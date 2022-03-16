import { EventCallbacksInterface } from '../data.interface';

export interface PainterConfigInterface {
    containerId: string;
    width: number;
    height: number;
    events?: EventCallbacksInterface;
    scaleBy: number;
}

export interface PainterImageInterface {
    id: string;
    url: string;
    position: {x: number, y: number};
    width: number;
    height: number;
}

export interface PainterPointInterface {
    id: string;
    text?: string;
    text_base64?: string;
    textWidth?: number;
    title?: string;
    description?: string;
    type?: number;
    subtype: string;
    position: {x: number, y: number};
    rotation?: number;
    skewX?: number;
    skewY?: number;
    primaryColor?: string;
    textColor?: string;
    textBackgroundColor?: string;
    draggable?: boolean,
    tooltipPosition?: string;
    pin_to_edge?: string;
    hide_hotspot?: boolean;
    hide_chevron?: boolean;
    link_background_color?: string;
    link_background_color_hovering?: string;
    title_base64?: string;
    active?: boolean;
}

export interface TooltipConfig {
    primaryColor?: string;
    textColor?: string;
    text?: string;
    title?: string;
    description?: string;
}

export enum PointType {
    TEXT,
    LINK,
    BEST_PRACTICE,
    RISK,
    COMING_SOON,
}

export interface PainterInterface {
    config: PainterConfigInterface;

    init(config: PainterConfigInterface): void;

    reset(): void;
    scale(value: number): void;

    drawImages(images: PainterImageInterface[], levelId: string): void;
    hideImages(imageIds: string[], levelId: string): void;
    drawPoints(points: PainterPointInterface[]): void;
    redrawPoint(point: PainterPointInterface): void;
    changePointProperties(point: PainterPointInterface): void;
    removePoint(id: string): void;
    removeAllPoints(): void;
    setMaxScaleValue(val: number): void;
}
