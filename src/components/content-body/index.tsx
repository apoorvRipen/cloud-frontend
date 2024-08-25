import { useEffect, useState } from 'react'
import { Grid } from '@mui/material';

import { IObject } from '../../interfaces';
import { useObjectsQuery } from '../../services';
import CustomDropzone from '../custom-dropzone';
import ContentCard from '../content-card';
import { useAppSelector } from '../../redux';
import useScreenSize from '../../hooks/useScreenSize';

interface IObjectState {
    data: IObject[]
    shiftPressing: boolean
    pagination: {
        totalPages: number
        page: number,
        totalRecords: number
    }
}

const ContentBody = () => {
    const screenSize = useScreenSize();
    const uploadObjects = useAppSelector(state => state.objectSlice.upload);
    const uploadFiles = uploadObjects.files.filter(ele => ele.status === "INQUEUE");
    const [state, setState] = useState<IObjectState>({
        data: [],
        shiftPressing: false,
        pagination: {
            page: 1,
            totalPages: 1,
            totalRecords: 0
        }
    });
    const { data, refetch } = useObjectsQuery({
        pagination: true,
        page: state.pagination.page,
        limit: 20,
        skip: false
    });

    useEffect(() => {
        if (data?.data) {
            const meta = data.meta;
            const objects = data.data;
            setState(prev => ({
                ...prev,
                data: [...prev.data, ...objects],
                pagination: {
                    ...prev.pagination,
                    totalPages: meta.totalPages,
                    totalRecords: meta.totalRecords
                }
            }))
        }
        
    }, [data?.data]);

    const onScroll = () => {
        if (state.pagination.page !== state.pagination.totalPages) {
            setState(prev => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    page: prev.pagination.page + 1
                }
            }));
            refetch();
        }
    }

    return (
        <>
            <CustomDropzone height="calc(100% - 135px)" onScroll={onScroll}>
                <Grid container spacing={2}>
                    {
                        screenSize.width < 768 && uploadFiles.map((ele, i) => {
                            return <ContentCard
                                key={i}
                                id={String(i)}
                                mimeType={ele.file.type}
                                title={ele.file.name}
                                varient="UPLOAD"
                            />
                        })
                    }
                    {
                        data?.data.map(ele => {
                            return <ContentCard
                                key={ele._id}
                                id={ele._id}
                                mimeType={ele.originalType}
                                title={ele.originalName}
                                previewUrl={ele.thumbnailPath}
                            />
                        })
                    }
                </Grid>
            </CustomDropzone>
        </>
    )
}

export default ContentBody