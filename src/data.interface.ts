export interface BaseImageInterface {
    uuid: string;
    name: string;
    path: string;
    url: string;
    width: number;
    height: number;
    size_in_kbs?: number;
}

export enum ZoomLevelStatusInterface {
    INACTIVE,
    Active,
    PROCESSING_IMAGE
}

export interface ZoomLevelInterface {
    uuid: string;
    name: string;
    levelIndex: number;
    status: ZoomLevelStatusInterface;
    image: BaseImageInterface;
}

export enum PointType {
    NORMAL,
    BEST_PRACTICE,
    MAINTENANCE
}

export interface CoordinateInterface {
    x: number;
    y: number;
}

export interface PointInterface {
    uuid: string;
    type: PointType;
    text?: string;
    text_rotation?: number;
    primary_color?: string;
    text_color?: string;
    title: string;
    description: string;
    meta_data: {[key: string]: any};
    coordinate: CoordinateInterface;
    visible_in_zoom_levels: number[];
}

export interface ToolDataInterface {
    zoom_levels: ZoomLevelInterface[];
    points: PointInterface[];
}

export enum ToolStatus {
    DRAFT,
    PUBLISHED_ACTIVE,
    PUBLISHED_INACTIVE
}

export interface ToolInterface {
    uuid: string;
    status: ToolStatus;
    name: string;
    description: string;
    data: ToolDataInterface;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}
