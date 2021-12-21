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
        const simpleText = new Konva.Text({
            x: 0,
            y: 0,
            text: data.text,
            fontSize: 14,
            fill: data.textColor,
            fontStyle: '400',
            fontFamily: 'Poppins',
        });
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
