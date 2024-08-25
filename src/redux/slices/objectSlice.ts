import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IObjectFile } from '../../interfaces';

interface IExport {
  _id: string;
  name: string,
  totalFiles: Number,
  success: Array<string>,
  failed: Array<string>,
  status: 'INQUEUE' | 'INITIATED' | 'COMPLETED' | 'EXPIRED';
}

interface IObjectState {
  path: string;
  parentId: string;
  selectedFiles: Array<string>;
  upload: {
    files: Array<IObjectFile>,
    status: "PROGRESS" | "COMPLETED" | "EXPIRED"
  },
  export: Array<IExport>
}

const initialState: IObjectState = {
  path: "/",
  parentId: "root",
  selectedFiles: [],
  upload: {
    files: [],
    status: "COMPLETED"
  },
  export: []
}

export const objectSlice = createSlice({
  name: 'object',
  initialState,
  reducers: {
    updatePath: (state, action: PayloadAction<{ path: string, parentId: string }>) => {
      return { ...state, ...action.payload }
    },

    updateSelectedFiles: (state, action: PayloadAction<string[]>) => {
      return { ...state, selectedFiles: action.payload }
    },

    // Upload Methods 
    updateUploadStatus: (state, action: PayloadAction<"PROGRESS" | "COMPLETED">) => {
      return { ...state, upload: { ...state.upload, status: action.payload } }
    },

    updateUploadFiles: (state, action: PayloadAction<IObjectFile[]>) => {
      return { ...state, upload: { ...state.upload, files: action.payload.length ? [...state.upload.files, ...action.payload] : [] } }
    },

    updateUploadFileStatus: (state, action: PayloadAction<{ id: number | string, status: "INPROGRESS" | "COMPLETED" | "FAILDED" }>) => {
      const data = state.upload.files.map(file => {
        if (file.id === action.payload.id) {
          return { ...file, status: action.payload.status }
        }
        return file;
      })
      return { ...state, upload: { ...state.upload, files: data } }
    },

    // Export Methods 
    updateExportFiles: (state, action: PayloadAction<Array<IExport>>) => {
      return { ...state, export: action.payload.length ? [...state.export, ...action.payload] : [] }
    },

    updateExportFile: (state, action: PayloadAction<IExport>) => {
      const data = state.export.map(file => {
        if (file._id === action.payload._id) {
          return { ...file, status: action.payload.status }
        }
        return file;
      });

      return { ...state, export: data }
    },
  },
})

export const { updateUploadStatus, updatePath, updateUploadFiles, updateUploadFileStatus, updateSelectedFiles, updateExportFiles, updateExportFile } = objectSlice.actions;

export default objectSlice.reducer;