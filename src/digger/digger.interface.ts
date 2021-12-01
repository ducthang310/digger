import { EventCallbacksInterface, PointInterface, ZoomLevelInterface } from '../data.interface';

export interface DiggerConfigInterface {
    containerId: string;
    zoomLevels: ZoomLevelInterface[];
    points: PointInterface[];
    zoomGap?: number;
    events?: EventCallbacksInterface;
}

export interface DiggerInterface {
    init(config: DiggerConfigInterface): void;
    reset(): void;

    zoomIn(): void;
    zoomOut(): void;

    cbDragEnd(position: {x: number, y: number} | undefined): void;
    cbScale(newScale: number, position: {x: number, y: number}): void;
}
