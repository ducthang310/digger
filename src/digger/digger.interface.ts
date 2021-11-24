import { PointInterface, ZoomLevelInterface } from '../data.interface';

export interface DiggerConfigInterface {
    containerId: string;
    width: number;
    height: number;
    zoomLevels: ZoomLevelInterface[];
    points: PointInterface[];
    apiUrl: string;
}

export interface DiggerInterface {
    init(config: DiggerConfigInterface): void;
    reset(): void;

    zoomIn(): void;
    zoomOut(): void;

    cbDragEnd(): void;
    cbScale(): void;

    cbPointDragEnd(): void;
    cbPointHover(): void;
    cbPointClick(): void;
}
