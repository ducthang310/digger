import { PainterPointInterface, TooltipConfig } from '../painter.interface';
import Konva from 'konva';
import { DefaultColor } from '../painter.constants';
import { PointService } from './base.service';

export class LinkService extends PointService {
    async createShapes(data: PainterPointInterface): Promise<Konva.Group> {
        const primaryColor = data.primaryColor ?? DefaultColor;
        const point = new Konva.Group({
            id: data.id,
            name: 'Point',
            draggable: data.draggable,
            rotation: data.rotation,
        });
        point.add(this.createHotspot(data));

        if (data.text) {
            point.add(this.createToolTip({
                text: data.text,
                primaryColor: primaryColor,
                textColor: data.textColor
            }));
        }

        return point;
    }

    private createToolTip(tooltipConfig: TooltipConfig): Konva.Group {
        const textColor = tooltipConfig.textColor ?? '#ffffff';
        const paddingLeft = 10;
        const paddingTop = 14;
        let rectWidth = 160;
        const rectHeight = 40;
        const triangleWidth = 14;
        const triangleHeight = 7;

        const toolTip = new Konva.Group({
            name: 'Tooltip',
            x: 0,
            y: 0,
        });

        const simpleText = new Konva.Text({
            x: paddingLeft,
            y: paddingTop,
            text: tooltipConfig.text,
            fontSize: 14,
            fill: textColor,
            fontFamily: 'Poppins',
            fontStyle: '400',
            textDecoration: 'underline',
        });
        let contentWidth = simpleText.width();
        const icon: Konva.Group = this.iconLink();
        icon.setPosition({x: 9, y: 16});
        contentWidth += 34;
        simpleText.x(37);

        rectWidth = contentWidth + 18;
        const rectWrapper = new Konva.Shape({
            sceneFunc: (context, shape) => {
                this.createWrapper(context, 0, 0, rectWidth, rectHeight, [8, 8, 8, 8], triangleWidth, triangleHeight)
                context.fillStrokeShape(shape);
            },
            x: 0,
            y: 0,
            fill: '#ffffff',
            shadowColor: '#BBBBBB',
            shadowBlur: 14,
            shadowOffset: { x: 0, y: 2 },
            shadowOpacity: 0.5,
        });
        rectWrapper.width(rectWidth);
        toolTip.add(rectWrapper);
        icon && toolTip.add(icon);
        toolTip.add(simpleText);
        toolTip.setPosition({
            x: -1 * rectWidth / 2,
            y: -1 * (rectHeight + 26)
        });

        return toolTip;
    }

    changePointProperties(pointData: PainterPointInterface, point: Konva.Group): void {
        point.position(pointData.position);
    }

    private iconLink(): Konva.Group {
        const group = new Konva.Group({
            x: 0,
            y: 0,
        });
        group.add(new Konva.Path({
            x: 0,
            y: 0,
            data:
                'M15,0 L11,0 L11,2 L15,2 C16.65,2 18,3.35 18,5 C18,6.65 16.65,8 15,8 L11,8 L11,10 L15,10 C17.76,10 20,7.76 20,5 C20,2.24 17.76,0 15,0 Z M9,8 L5,8 C3.35,8 2,6.65 2,5 C2,3.35 3.35,2 5,2 L9,2 L9,0 L5,0 C2.24,0 0,2.24 0,5 C0,7.76 2.24,10 5,10 L9,10 L9,8 Z M6,4 L14,4 L14,6 L6,6 L6,4 Z',
            fill: '#0372FF',
        }));
        return group;
    }
}
