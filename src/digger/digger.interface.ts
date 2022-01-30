import { EventCallbacksInterface, PointInterface, Vector2d, ZoomLevelInterface } from '../data.interface';

export interface DiggerConfigInterface {
    containerId: string;
    zoomLevels: ZoomLevelInterface[];
    points: PointInterface[];
    zoomGap?: number;
    events?: EventCallbacksInterface;
    scaleBy?: number;
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
    redrawPoint(point: PointInterface, redraw?: boolean): void;
    changePointProperties(point: PointInterface, redraw?: boolean): void;
    removePoint(id: string, redraw?: boolean): void;
    convertOffsetToImagePosition(offset: Vector2d): Vector2d;

    updateScaleBy(val: number): void;
    updateZoomGap(val: number): void;
}
