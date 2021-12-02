export interface EventCallbacksInterface {
    dragstart?: () => void,
    dragMove?: () => void,
    dragend?: (position: {x: number, y: number} | undefined) => void,
    scale?: (newScale: number, position: {x: number, y: number}) => void,
    pointClick?: (uuid: string) => void,
    pointDragend?: (uuid: string, position: {x: number, y: number}) => void,
}
export interface BaseImageInterface {
    uuid: string;
    name: string;
    url: string;
    width: number;
    height: number;
}

export interface ZoomLevelInterface {
    uuid: string;
    name: string;
    levelIndex: number;
    image: BaseImageInterface;
}

export enum PointType {
    NORMAL,
    BEST_PRACTICE,
    MAINTENANCE
}

export interface Vector2d {
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
    position: Vector2d;
    draggable?: boolean,
    visible_in_zoom_levels: number[];
}
