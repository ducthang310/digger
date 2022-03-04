import Konva from 'konva';
import { DefaultColor } from '../painter.constants';
import { PainterUtility } from '../painter.utility';
import { PainterConfigInterface, PainterPointInterface } from '../painter.interface';
import { Context } from 'konva/lib/Context';
import { NodeConfig } from 'konva/lib/Node';

export abstract class PointService {
    abstract createShapes(data: PainterPointInterface, stage?: Konva.Stage): Promise<Konva.Group>;
    abstract changePointProperties(data: PainterPointInterface, point: Konva.Group): void;
    abstract initEvents(point: Konva.Group, config: PainterConfigInterface, data?: PainterPointInterface): Konva.Group;

    createHotspot(data: PainterPointInterface, radius = 10, stroke = true): Konva.Circle {
        const primaryColor = data.primaryColor ?? DefaultColor;
        const strokeColor = PainterUtility.hex2rgba(primaryColor, 0.2);
        const circleData: NodeConfig = {
            radius,
            fill: primaryColor,
            name: 'PointCircle'
        };
        if (stroke) {
            circleData.stroke = strokeColor;
            circleData.strokeWidth = 12;
        }
        const circle = new Konva.Circle(circleData);
        circle.setAttr('point_id', data.id);
        return circle;
    }

    createIcon(data: PainterPointInterface, base64: string): Promise<Konva.Image> {
        return new Promise((resolve, reject) => {
            const imageObj = new Image();
            imageObj.onload = () => {
                const icon = new Konva.Image({
                    x: 0,
                    y: 0,
                    image: imageObj,
                    name: 'PointCircle',
                });
                icon.setPosition({
                    x: -1 * icon.width() / 2,
                    y: -1 * icon.height() / 2,
                })
                icon.setAttr('point_id', data.id);
                resolve(icon);
            };
            imageObj.onerror = () => reject();
            imageObj.src = base64;
        });
    }

    createWrapper(
        ctx: Context, x: number, y: number, width: number, height: number, radiusArr: number[],
        triangleWidth: number, triangleHeight: number, position?: string
    ): void {
        position = position ?? 'top';
        const radius = {tl: radiusArr[0], tr: radiusArr[1], br: radiusArr[2], bl: radiusArr[3]};
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        const curveW = 2;
        const curveH = 1;

        if (triangleWidth && triangleHeight && position === 'bottom') {
            ctx.lineTo((x + width - triangleWidth) / 2, y);
            ctx.lineTo((x + width - curveW) / 2, y - triangleHeight + curveH);
            ctx.quadraticCurveTo((x + width ) / 2, y - triangleHeight, (x + width + curveW) / 2, y - triangleHeight + curveH);
            ctx.lineTo((x + width + triangleWidth) / 2, y);
        }

        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);

        if (triangleWidth && triangleHeight && position === 'left') {
            ctx.lineTo(x + width, (y + height - triangleWidth) / 2);
            ctx.lineTo(x + width + triangleHeight - curveH, (y + height - curveW) / 2);
            ctx.quadraticCurveTo(x + width + triangleHeight, (y + height) / 2, x + width + triangleHeight - curveH, (y + height + curveW) / 2);
            ctx.lineTo(x + width, (y + height + triangleWidth) / 2);
        }

        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);

        if (triangleWidth && triangleHeight && position === 'top') {
            ctx.lineTo((x + width + triangleWidth) / 2, y + height);
            ctx.lineTo((x + width + curveW) / 2, y + height + triangleHeight - curveH);
            ctx.quadraticCurveTo((x + width ) / 2, y + height + triangleHeight, (x + width - curveW) / 2, y + height + triangleHeight - curveH);
            ctx.lineTo((x + width - triangleWidth) / 2, y + height);
        }

        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);

        if (triangleWidth && triangleHeight && position === 'right') {
            ctx.lineTo(x, (y + height + triangleWidth) / 2);
            ctx.lineTo(x - triangleHeight + curveH, (y + height + curveW) / 2);
            ctx.quadraticCurveTo(x - triangleHeight, (y + height) / 2, x - triangleHeight + curveH, (y + height - curveW) / 2);
            ctx.lineTo(x, (y + height - triangleWidth) / 2);
        }

        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
    }

    getTooltipPosition(wrapper: Konva.Shape, tooltipPosition: string): {x: number, y: number} {
        const pos = {x: 0, y: 0};
        const gap = 45;
        const height = 40;
        const width = wrapper.width();
        switch (tooltipPosition) {
            case 'right':
                pos.x = gap;
                pos.y = -1 * height / 2;
                break;
            case 'bottom':
                pos.x = -1 * width / 2;
                pos.y = gap;
                break;
            case 'left':
                pos.x = -1 * (width + gap)
                pos.y = -1 * height / 2;
                break;
            default:
                pos.x = -1 * width / 2;
                pos.y = -1 * (height + gap);
        }
        return pos;
    }
}
