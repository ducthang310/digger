import { EventCallbacksInterface } from '../data.interface';

export interface PainterConfigInterface {
    containerId: string;
    width: number;
    height: number;
    events?: EventCallbacksInterface;
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
    title?: string;
    description?: string;
    type?: number;
    position: {x: number, y: number};
    rotation?: number;
    primaryColor?: string;
    textColor?: string;
    draggable?: boolean,
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
}

export interface PainterInterface {

    init(config: PainterConfigInterface): void;

    reset(): void;
    scale(value: number): void;

    drawImages(images: PainterImageInterface[], levelId: string): void;
    drawPoints(points: PainterPointInterface[]): void;
    redrawPoint(point: PainterPointInterface): void;
    changePointProperties(point: PainterPointInterface): void;
    removePoint(id: string): void;
    removeAllPoints(): void;
}
