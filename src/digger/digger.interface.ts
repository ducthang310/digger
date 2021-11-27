import { PointInterface, ZoomLevelInterface } from '../data.interface';
import { DiggerEventCallbacksInterface } from '../common.interface';

export interface DiggerConfigInterface {
    containerId: string;
    width: number;
    height: number;
    zoomLevels: ZoomLevelInterface[];
    points: PointInterface[];
    apiUrl: string;
    zoomGap?: number;
    events?: DiggerEventCallbacksInterface;
}

export interface DiggerInterface {
    init(config: DiggerConfigInterface): void;
    reset(): void;

    zoomIn(): void;
    zoomOut(): void;

    cbDragEnd(position: {x: number, y: number} | undefined): void;
    cbScale(newScale: number, position: {x: number, y: number}): void;
}
