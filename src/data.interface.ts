import { PointSubtype } from './painter/painter.constants';

export interface EventCallbacksInterface {
    dragstart?: () => void,
    dragMove?: () => void,
    dragend?: (position: {x: number, y: number} | undefined) => void,
    scale?: (newScale: number, position: {x: number, y: number}) => void,
    cbScale?: (newScale: number, levelIndex: number) => void,
    pointClick?: (id: string) => void,
    tooltipClick?: (id: string) => void,
    pointDragend?: (id: string, position: {x: number, y: number}) => void,
    pointMouseenter?: (id: string, position: {x: number, y: number}) => void,
    pointMouseleave?: (id: string, position: {x: number, y: number}) => void,
}
export interface BaseImageInterface {
    id: string;
    name: string;
    url: string;
    width: number;
    height: number;
}

export interface ZoomLevelInterface {
    id: string;
    name: string;
    levelIndex: number;
    image: BaseImageInterface;
}

export enum PointType {
    TEXT,
    LINK,
    BEST_PRACTICE,
    RISK,
    COMING_SOON,
}

export interface Vector2d {
    x: number;
    y: number;
}

export interface PointInterface {
    id: string;
    type: PointType;
    subtype: PointSubtype;
    text?: string;
    text_base64?: string;
    text_width?: number;
    text_rotation?: number;
    text_skew_x?: number;
    text_skew_y?: number;
    primary_color?: string;
    text_color?: string;
    text_background_color?: string;
    title: string;
    description: string;
    position: Vector2d;
    draggable?: boolean,
    visible_in_zoom_levels?: number[];
    tooltip_position?: string;
    pin_to_edge?: string;
    min_zoom?: number;
    max_zoom?: number;
    hide_hotspot?: boolean;
    hide_chevron?: boolean;
    link_background_color?: string;
    link_background_color_hovering?: string;
}
