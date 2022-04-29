import { PainterConfigInterface, PainterPointInterface } from '../painter.interface';
import Konva from 'konva';
// import { DefaultColor } from '../painter.constants';
import { PointService } from './base.service';

export class ComingSoonService extends PointService {
    async createShapes(data: PainterPointInterface): Promise<Konva.Group> {
        // const primaryColor = data.primaryColor ?? DefaultColor;
        const point = new Konva.Group({
            id: data.id,
            name: 'Point',
            draggable: data.draggable,
        });
        const iconBase64 = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjAgMjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+SG90IFNwb3QgQ29taW5nIFNvb248L3RpdGxlPgogICAgPGcgaWQ9IkhvdC1TcG90LUNvbWluZy1Tb29uIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsIiBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNBQUFEQjgiIGN4PSIxMCIgY3k9IjEwIiByPSI5LjUiPjwvY2lyY2xlPgogICAgICAgIDxwb2x5bGluZSBpZD0iUGF0aC02IiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBwb2ludHM9IjggNSA4IDExLjAyOTI5MzcgMTIuNjc0MTU0IDE0LjgwNDcxMjMiPjwvcG9seWxpbmU+CiAgICA8L2c+Cjwvc3ZnPg==';

        point.add(await this.createIcon(data, iconBase64));

        if (data.text) {
            // point.add(this.createToolTip({
            //     text: data.text,
            //     primaryColor: primaryColor,
            //     textColor: data.textColor
            // }, data.tooltipPosition));
            point.add(this.createText(data, data.tooltipPosition));
        }

        return point;
    }

    // private createToolTip(tooltipConfig: TooltipConfig, tooltipPosition?: string): Konva.Group {
    //     tooltipPosition = tooltipPosition ? tooltipPosition : 'top';
    //     const primaryColor = tooltipConfig.primaryColor ?? '#ffffff';
    //     const textColor = tooltipConfig.textColor ?? '#000000';
    //     const paddingLeft = 12;
    //     const paddingTop = 14;
    //     let rectWidth = 160;
    //     const rectHeight = 40;
    //     const triangleWidth = 9;
    //     const triangleHeight = 20;
    //
    //     const toolTip = new Konva.Group({
    //         name: 'Tooltip',
    //         x: 0,
    //         y: 0,
    //     });
    //
    //     const simpleText = new Konva.Text({
    //         x: paddingLeft,
    //         y: paddingTop,
    //         text: tooltipConfig.text,
    //         fontSize: 14,
    //         fill: textColor,
    //         fontStyle: '400',
    //         fontFamily: 'Poppins',
    //     });
    //
    //     const contentWidth = simpleText.width();
    //     rectWidth = contentWidth + paddingLeft * 2;
    //     const rectWrapper = new Konva.Shape({
    //         sceneFunc: (context, shape) => {
    //             this.createWrapper(context, 0, 0, rectWidth, rectHeight, [8, 8, 8, 8], triangleWidth, triangleHeight, tooltipPosition);
    //             context.fillStrokeShape(shape);
    //         },
    //         x: 0,
    //         y: 0,
    //         fill: primaryColor,
    //         shadowColor: '#000000',
    //         shadowBlur: 9,
    //         shadowOffset: { x: 0, y: 3 },
    //         shadowOpacity: 0.5,
    //         name: 'RectWrapper'
    //     });
    //     rectWrapper.width(rectWidth);
    //     rectWrapper.height(rectHeight);
    //
    //     toolTip.add(rectWrapper);
    //     toolTip.add(simpleText);
    //     toolTip.setPosition(this.getTooltipPosition(rectWrapper, tooltipPosition));
    //
    //     return toolTip;
    // }

    changePointProperties(pointData: PainterPointInterface, point: Konva.Group): void {
        point.position(pointData.position);
        const toolTip: Konva.Group = point.findOne('.Tooltip');
        let wrapper: Konva.Rect;
        if (toolTip) {
            wrapper = toolTip.findOne('.RectWrapper');
        }
        if (wrapper) {
            toolTip.setPosition(this.getTooltipPosition(wrapper, pointData.tooltipPosition));
        }
    }

    initEvents(point: Konva.Group, config: PainterConfigInterface): Konva.Group {
        point.on('click touchstart', (evt) => {
            if (config.events?.pointClick && evt.target.name() === 'PointCircle') {
                config.events.pointClick(point.id());
            } else if (config.events?.tooltipClick && evt.target.name() === 'Tooltip') {
                config.events.tooltipClick(point.id());
            }
        });
        point.on('mouseenter', () => {
            point.getStage().container().style.cursor = 'pointer';
            if (config.events && config.events.pointMouseenter) {
                config.events.pointMouseenter(point.id(), point.getPosition());
            }
        });
        point.on('mouseleave', () => {
            point.getStage().container().style.cursor = 'default';
            if (config.events && config.events.pointMouseleave) {
                config.events.pointMouseleave(point.id(), point.getPosition());
            }
        });
        return point;
    }
}
