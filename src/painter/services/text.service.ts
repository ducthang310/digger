import { PainterPointInterface } from '../painter.interface';
import Konva from 'konva';
import { PointService } from './base.service';
import { Vector2d } from '../../data.interface';

export class TextService extends PointService {
    async createShapes(data: PainterPointInterface): Promise<Konva.Group> {
        const point = new Konva.Group({
            id: data.id,
            name: 'Point',
            draggable: data.draggable,
            rotation: data.rotation,
        });
        const padding = 0;
        const rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: 100,
            height: 50,
            fill: data.textBackgroundColor,
        });
        // const simpleText = new Konva.Text({
        //     x: padding,
        //     y: padding,
        //     text: data.text,
        //     fontSize: 14,
        //     fill: data.textColor,
        //     fontStyle: '400',
        //     fontFamily: 'Poppins',
        //     lineHeight: 1.25,
        // });

        const textScale = 1 / window.devicePixelRatio;
        const simpleText = new Konva.Image({
            x: 0,
            y: 0,
            scaleX: textScale,
            scaleY: textScale,
            image: data.text_canvas,
        });
        // const textScale = 1;
        const textWidth = simpleText.width() * textScale;
        const textHeight = simpleText.height() * textScale;

        const rectWidth = textWidth + padding * 2;
        rect.width(rectWidth);
        const rectHeight = textHeight + padding * 2;
        rect.height(rectHeight);
        point.add(rect);
        point.add(simpleText);
        if (data.skewX) {
            point.skewX(Math.tan( Number(data.skewX) * Math.PI/180 ));
        }
        if (data.skewY) {
            point.skewY(Math.tan( Number(data.skewY) * Math.PI/180 ));
        }
        // point.position(this.getPositionByPinToEdge(data.pin_to_edge, rectWidth, rectHeight));
        const off = this.getPositionByPinToEdge(data.pin_to_edge, rectWidth, rectHeight);
        point.offsetX(off.x);
        point.offsetY(off.y);
        // point.add(point);
        return point;
    }

    changePointProperties(pointData: PainterPointInterface, point: Konva.Group): void {
        point.position(pointData.position);
        const konText: Konva.Text = point.findOne('Text');
        if (!pointData.text && konText) {
            konText.destroy();
        } else if (pointData.text) {
            if (!konText) {
                const newKonText = new Konva.Text({
                    text: pointData.text,
                    fontSize: 14,
                    fill: pointData.textColor,
                    fontStyle: '400'
                });
                point.add(newKonText);
            } else {
                konText.fill(pointData.textColor);
                konText.text(pointData.text);
            }

            const konRect: Konva.Rect = point.findOne('Rect');
            if (konRect) {
                konRect.fill(pointData.textBackgroundColor);
            }
        }
    }

    private getPositionByPinToEdge(pinToEdge: string, width: number, height: number): Vector2d {
        const pos = {x: 0, y: 0};
        switch (pinToEdge) {
            case 'top_right':
                pos.x = width;
                break;
            case 'bottom_left':
                pos.y = -1 * height;
                pos.y = height;
                break;
            case 'bottom_right':
                pos.x = width;
                pos.y = height;
                break;
            case 'middle':
                pos.x = Math.round(width / 2);
                pos.y = Math.round(height / 2);
                break;
            case 'top_center':
                pos.x = Math.round(width / 2);
                break;
            case 'bottom_center':
                pos.x = Math.round(width / 2);
                pos.y = height;
                break;
            case 'left_center':
                pos.y = Math.round(height / 2);
                break;
            case 'right_center':
                pos.x = width;
                pos.y = Math.round(height / 2);
                break;
            default:
                break;
        }

        return pos;
    }
}
