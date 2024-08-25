import { IResponse } from "../shared";

export interface IObjectFile {
    id: number | string,
    file: File,
    status: "INQUEUE" | "INPROGRESS" | "COMPLETED" | "FAILDED"
}

export interface IObject {
    _id: string,
    originalName: string;
    originalType: string;
    originalPath: string;
    thumbnailPath: string;
    sizeInByte: number;
    type: string;
    extension: string;
    isFolder: boolean;
    parentId?: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IObjectState {
    data: IObject[]
    shiftPressing: boolean
    pagination: {
        totalPages: number
        page: number,
        totalRecords: number
    }
}

export interface IObjectsResponse extends IResponse {
    data: IObject[];
    meta: {
        page: number;
        limit: number;
        totalPages: number;
        totalRecords: number;
    }
}

export interface IObjectResponse extends IResponse {
    data: IObject;
}
export interface IUploadResponse extends IResponse {
    data: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        destination: string;
        filename: string;
        originalPath: string;
        thumbnailPath: string;
        size: number;
    };
}

export interface IExportResponse extends IResponse {
    data: {
        _id: string;
        name: string,
        totalFiles: Number,
        success: Array<string>,
        failed: Array<string>,
        originalPath: string,
        status: 'INQUEUE' | 'INITIATED' | 'COMPLETED' | 'EXPIRED';
    };
}

export interface IExportResponses extends IResponse {
    data: Array<{
        _id: string;
        name: string,
        totalFiles: Number,
        success: Array<string>,
        failed: Array<string>,
        status: 'INQUEUE' | 'INITIATED' | 'COMPLETED' | 'EXPIRED';
    }>;
}
