import { EventCallbacksInterface, PointInterface, Vector2d, ZoomLevelInterface } from '../data.interface';

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
    redraw(): void;

    setZoomLevels(zoomLevels: ZoomLevelInterface[], redraw?: boolean): void;

    setPoints(points: PointInterface[], redraw?: boolean): void;
    addPoint(point: PointInterface, offset: Vector2d): void;
    updatePoint(point: PointInterface, redraw?: boolean): void;
    removePoint(id: string, redraw?: boolean): void;
}
