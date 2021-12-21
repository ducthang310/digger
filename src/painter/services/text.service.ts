import { PainterPointInterface } from '../painter.interface';
import Konva from 'konva';
import { PointService } from './base.service';

export class TextService extends PointService {
    createShapes(data: PainterPointInterface): Konva.Group {
        const point = new Konva.Group({
            id: data.id,
            name: 'Point',
            draggable: data.draggable,
            rotation: data.rotation,
        });
        const padding = 10;
        const rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: 100,
            height: 50,
            fill: '#EF4B41',
        });
        const simpleText = new Konva.Text({
            x: padding,
            y: padding,
            text: data.text,
            fontSize: 14,
            fill: data.textColor,
            fontStyle: '400',
            fontFamily: 'Poppins',
        });
        rect.width(simpleText.width() + padding * 2);
        rect.height(simpleText.height() + padding * 2);
        point.add(rect);
        point.add(simpleText);
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
        }
    }
}
