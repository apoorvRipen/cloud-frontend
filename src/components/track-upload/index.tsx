import "./style.scss";
import { useEffect, useState } from "react";
import { IconButton, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

import { formatMimetype } from "../../utilities/helper";
import { useLazyExportProgressQuery, useLazyExportZipQuery } from "../../services";
import { useAppDispatch, useAppSelector, updateUploadStatus, updateUploadFiles, updateExportFile, updateExportFiles } from "../../redux";
import imageIcon from '../../assets/images/image.svg';
import useObject from "../../hooks/useObject";
import WarningDialog from "../mui/warning-dialog";
import useScreenSize from "../../hooks/useScreenSize";

const TrackUpload = () => {
  const dispatch = useAppDispatch();
  const screenSize = useScreenSize();
  const { upload, addObject } = useObject();
  const [expand, setExpand] = useState(true);
  const [isClose, setIsClose] = useState(true);
  const [warning, setWarning] = useState(false);
  const [exportProgressTraking, setExportProgressTraking] = useState(false);
  const objectDetail = useAppSelector(state => state.objectSlice);
  const uploadObject = useAppSelector(state => state.objectSlice.upload);
  const exportObject = useAppSelector(state => state.objectSlice.export);
  const [getExportProgress, { data: exportProgressData }] = useLazyExportProgressQuery({ pollingInterval: exportProgressTraking ? 3000 : 0 });
  const [getExportZip, { data: exportZip }] = useLazyExportZipQuery();
  const uploadCompleted = uploadObject.files.filter(ele => ele.status === "COMPLETED");
  const exportCompleted = exportObject.filter(ele => ele.status === "COMPLETED");

  const initiateUpload = async () => {
    for await (const object of uploadObject.files) {
      if (object.status === "INQUEUE") {
        const uploadedObject = await upload(object.id, object.file);
        if (uploadedObject) {
          const payload = {
            originalName: object.file.name,
            sizeInByte: object.file.size,
            originalType: object.file.type,
            parentId: objectDetail.parentId,
            extension: formatMimetype(object.file.type),
            originalPath: uploadedObject.data.originalPath,
            thumbnailPath: uploadedObject.data.thumbnailPath
          }
          await addObject(object.id, payload);
        }
      }
    }

    dispatch(updateUploadStatus("COMPLETED"));
  }

  const initializeDowload = async () => {
    try {
      for await (const object of exportCompleted) {
        await getExportZip({ _id: object._id });
      }
    } catch (error) {
      console.log("Error while fetching zip blob ", { error });
    }
  }

  const onDownload = (base64Zip: string) => {
    if (base64Zip) {
      // Convert Base64 to a Blob
      const binaryString = window.atob(base64Zip);
      const binaryLen = binaryString.length;
      const bytes = new Uint8Array(binaryLen);

      for (let i = 0; i < binaryLen; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'files.zip'; // Name of the file to be downloaded
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Clean
    }
  }

  useEffect(() => {
    const totalFiles = uploadObject.files.length;
    if (totalFiles && totalFiles !== uploadCompleted.length && uploadObject.status !== "PROGRESS") {
      setIsClose(false);
      dispatch(updateUploadStatus("PROGRESS"));
      initiateUpload();
    }
  }, [uploadObject.files, uploadObject.status]);

  useEffect(() => {
    const exportIds = exportObject.filter(ele => ele.status === "INITIATED").map(ele => ele._id);
    
    if (exportObject.length && exportIds?.length) {
      setIsClose(false);
      setExportProgressTraking(true);
      getExportProgress({ _ids: exportIds });
    } else {
      setExportProgressTraking(false);
      setTimeout(() => {
        initializeDowload();
      }, 1000 * 1);
    }
  }, [exportObject]);

  useEffect(() => {
    if (exportProgressData && exportProgressData.data) {
      exportProgressData.data.forEach(ele => {
        dispatch(updateExportFile(ele));
      });
    }
  }, [exportProgressData]);

  useEffect(() => {
    if (exportZip?.data.status !== "EXPIRED") {
      if (exportZip?.data.originalPath) {
        onDownload(exportZip.data.originalPath);
      }
    }
  }, [exportZip])

  const onclose = () => {
    const uploadInProgress = uploadObject.status === "PROGRESS" && uploadObject.files.length !== uploadCompleted.length;

    if (uploadInProgress || exportProgressTraking) {
      setWarning(true);
    } else {
      setIsClose(true);
      dispatch(updateUploadFiles([]));
      dispatch(updateExportFiles([]));
    }
  }

  return (
    <div className="custom-snakebar" style={{ display: (isClose || screenSize.width < 768) ? "none" : "initial" }}>
      <div className="header">
        <Typography variant="body1">
          {uploadCompleted.length ? uploadCompleted.length + " Uploaded" : null}
          {(uploadCompleted.length && exportCompleted.length) ? " & " : null}
          {exportCompleted.length ? exportCompleted.length + " Downloaded " : null}
        </Typography>
        <div>
          <IconButton onClick={() => setExpand(!expand)}>
            {expand ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
          <IconButton onClick={onclose}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>

      <div className="body" style={{ maxHeight: expand ? "350px" : "0px" }}>
        {exportObject.length ? <Typography variant="caption" className="ml-2" >Download</Typography> : null}
        {
          exportObject.map((file, i) => {
            return <div className="content-wrapper" key={i}>
              <div className="center">
                <img src={imageIcon} width="20px" />
                <div className="ml-2 title">{file.name}</div>
              </div>
              {
                file.status === "COMPLETED" ?
                  <CheckCircleIcon color="success" />
                  :
                  <HourglassBottomIcon color="warning" />
              }
            </div>
          })
        }

        {uploadObject.files.length ? <Typography variant="caption" className="ml-2" >Upload</Typography> : null}
        {
          uploadObject.files.map((file, i) => {
            return <div className="content-wrapper" key={i}>
              <div className="center">
                <img src={imageIcon} width="20px" />
                <div className="ml-2 title">{file.file.name}</div>
              </div>
              {
                file.status === "COMPLETED" ?
                  <CheckCircleIcon color="success" />
                  :
                  <HourglassBottomIcon color="warning" />
              }
            </div>
          })
        }

      </div>

      <WarningDialog
        isOpen={warning}
        onClose={() => setWarning(false)}
        onConfirm={() => setWarning(false)}
        title="Uploading still in progress"
        description="Do you want cancelling uploading"
      />
    </div>
  )
}

export default TrackUpload