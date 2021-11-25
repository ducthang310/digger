import { PointInterface, ZoomLevelInterface } from '../data.interface';

export interface DiggerConfigInterface {
    containerId: string;
    width: number;
    height: number;
    zoomLevels: ZoomLevelInterface[];
    points: PointInterface[];
    apiUrl: string;
    zoomGap?: number;
}

export interface DiggerInterface {
    init(config: DiggerConfigInterface): void;
    reset(): void;

    zoomIn(): void;
    zoomOut(): void;

    cbDragEnd(position: {x: number, y: number} | undefined): void;
    cbScale(newScale: number, position: {x: number, y: number}): void;

    cbPointDragEnd(): void;
    cbPointHover(): void;
    cbPointClick(): void;
}
