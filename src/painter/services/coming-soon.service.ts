import { PainterConfigInterface, PainterPointInterface, TooltipConfig } from '../painter.interface';
import Konva from 'konva';
import { DefaultColor } from '../painter.constants';
import { PointService } from './base.service';

export class ComingSoonService extends PointService {
    async createShapes(data: PainterPointInterface): Promise<Konva.Group> {
        const primaryColor = data.primaryColor ?? DefaultColor;
        const point = new Konva.Group({
            id: data.id,
            name: 'Point',
            draggable: data.draggable,
        });
        const iconBase64 = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTAwcHgiIGhlaWdodD0iMTAwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPmNvbWluZy1zb29uPC90aXRsZT4KICAgIDxkZWZzPgogICAgICAgIDxmaWx0ZXIgeD0iLTM0LjQlIiB5PSItMzQuNCUiIHdpZHRoPSIxNjguOCUiIGhlaWdodD0iMTY4LjglIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIGlkPSJmaWx0ZXItMSI+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjYiIGluPSJTb3VyY2VHcmFwaGljIj48L2ZlR2F1c3NpYW5CbHVyPgogICAgICAgIDwvZmlsdGVyPgogICAgPC9kZWZzPgogICAgPGcgaWQ9ImNvbWluZy1zb29uIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8Y2lyY2xlIGlkPSJoYWxvIiBvcGFjaXR5PSIwLjEzIiBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiPjwvY2lyY2xlPgogICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtQ29weS0yIiBmaWxsPSIjQjhCQUMzIiBvcGFjaXR5PSIwLjUwNDU1MSIgZmlsdGVyPSJ1cmwoI2ZpbHRlci0xKSIgY3g9IjUwLjE2Mjc5MDciIGN5PSI1MC4xNjI3OTA3IiByPSIyNi4xNjI3OTA3Ij48L2NpcmNsZT4KICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsIiBzdHJva2U9IiNGMUYxRjEiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0iI0I4QkFDMyIgY3g9IjUwIiBjeT0iNTAiIHI9IjE1Ij48L2NpcmNsZT4KICAgICAgICA8ZyBpZD0iR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM5Ljk1ODE3MCwgNDAuNDE0ODcyKSIgZmlsbD0iI0YwRjBGMCIgZmlsbC1ydWxlPSJub256ZXJvIiBvcGFjaXR5PSIwLjkiPgogICAgICAgICAgICA8ZyBpZD0iUGF0aC00Ij4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik05Ljc0NDYwNTMzLC0wLjA0NDcwMzgwMDEgQzEwLjI1NzQ0MTIsLTAuMDQ0NzAzODAwMSAxMC42ODAxMTI1LDAuMzQxMzM2MzkgMTAuNzM3ODc3NiwwLjgzODY3NTA3NCBMMTAuNzQ0NjA1MywwLjk1NTI5NjIgTDEwLjc0NCwxMS4wMDMgTDE4LjEyNzQwODgsMTYuMzgzMzQ3IEMxOC41NzM3NjQ5LDE2LjcwODU5MjYgMTguNjcxOTQ0NCwxNy4zMzQwOTkzIDE4LjM0NjY5ODksMTcuNzgwNDU1NCBDMTguMDQ2NDcyMiwxOC4xOTI0NzY0IDE3LjQ5MDQwMTcsMTguMzA3ODI2MiAxNy4wNTU1NTc3LDE4LjA2NzMxOTkgTDE2Ljk0OTU5MDUsMTcuOTk5NzQ1NSBMOC43NDQ2MDUzMywxMi4wMjEwMzI3IEw4Ljc0NDYwNTMzLDAuOTU1Mjk2MiBDOC43NDQ2MDUzMywwLjQwMzAxMTQ1IDkuMTkyMzIwNTgsLTAuMDQ0NzAzODAwMSA5Ljc0NDYwNTMzLC0wLjA0NDcwMzgwMDEgWiI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=';

        point.add(await this.createIcon(data, iconBase64));

        if (data.text) {
            point.add(this.createToolTip({
                text: data.text,
                primaryColor: primaryColor,
                textColor: data.textColor
            }, data.tooltipPosition));
        }

        return point;
    }

    private createToolTip(tooltipConfig: TooltipConfig, tooltipPosition?: string): Konva.Group {
        tooltipPosition = tooltipPosition ? tooltipPosition : 'top';
        const primaryColor = tooltipConfig.primaryColor ?? '#ffffff';
        const textColor = tooltipConfig.textColor ?? '#000000';
        const paddingLeft = 12;
        const paddingTop = 14;
        let rectWidth = 160;
        const rectHeight = 40;
        const triangleWidth = 9;
        const triangleHeight = 20;

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
            fontStyle: '400',
            fontFamily: 'Poppins',
        });

        const contentWidth = simpleText.width();
        rectWidth = contentWidth + paddingLeft * 2;
        const rectWrapper = new Konva.Shape({
            sceneFunc: (context, shape) => {
                this.createWrapper(context, 0, 0, rectWidth, rectHeight, [8, 8, 8, 8], triangleWidth, triangleHeight, tooltipPosition);
                context.fillStrokeShape(shape);
            },
            x: 0,
            y: 0,
            fill: primaryColor,
            shadowColor: '#000000',
            shadowBlur: 9,
            shadowOffset: { x: 0, y: 3 },
            shadowOpacity: 0.5,
            name: 'RectWrapper'
        });
        rectWrapper.width(rectWidth);
        rectWrapper.height(rectHeight);

        toolTip.add(rectWrapper);
        toolTip.add(simpleText);
        toolTip.setPosition(this.getTooltipPosition(rectWrapper, tooltipPosition));

        return toolTip;
    }

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
