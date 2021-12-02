import { EventCallbacksInterface } from '../data.interface';

export interface PainterConfigInterface {
    containerId: string;
    width: number;
    height: number;
    events?: EventCallbacksInterface;
}

export interface PainterImageInterface {
    uuid: string;
    url: string;
    position: {x: number, y: number};
    width: number;
    height: number;
}

export interface PainterPointInterface {
    uuid: string;
    text?: string;
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
    text: string;
}

export interface PainterInterface {

    init(config: PainterConfigInterface): void;

    reset(): void;
    scale(value: number): void;

    drawImages(images: PainterImageInterface[], levelUuid: string): void;
    drawPoints(points: PainterPointInterface[]): void;
    updatePoint(point: PainterPointInterface): void;
    removePoint(uuid: string): void;
    removeAllPoints(): void;
}
