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
        const iconBase64 = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTAwcHgiIGhlaWdodD0iMTAwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPmNvbWluZy1zb29uPC90aXRsZT4KICAgIDxkZWZzPgogICAgICAgIDxmaWx0ZXIgeD0iLTM0LjQlIiB5PSItMzQuNCUiIHdpZHRoPSIxNjguOCUiIGhlaWdodD0iMTY4LjglIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIGlkPSJmaWx0ZXItMSI+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjYiIGluPSJTb3VyY2VHcmFwaGljIj48L2ZlR2F1c3NpYW5CbHVyPgogICAgICAgIDwvZmlsdGVyPgogICAgPC9kZWZzPgogICAgPGcgaWQ9ImNvbWluZy1zb29uIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLUNvcHkiIGZpbGw9IiNCOEJBQzMiIG9wYWNpdHk9IjAuMTMiIGN4PSI1MCIgY3k9IjUwIiByPSI1MCI+PC9jaXJjbGU+CiAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC1Db3B5LTIiIGZpbGw9IiNCOEJBQzMiIG9wYWNpdHk9IjAuNTA0NTUxIiBmaWx0ZXI9InVybCgjZmlsdGVyLTEpIiBjeD0iNTAuMTYyNzkwNyIgY3k9IjUwLjE2Mjc5MDciIHI9IjI2LjE2Mjc5MDciPjwvY2lyY2xlPgogICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwiIHN0cm9rZT0iI0YxRjFGMSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSIjQjhCQUMzIiBjeD0iNTAiIGN5PSI1MCIgcj0iMTUiPjwvY2lyY2xlPgogICAgICAgIDxnIGlkPSJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzkuOTU4MTcwLCA0MC40MTQ4NzIpIiBmaWxsPSIjRjBGMEYwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIG9wYWNpdHk9IjAuOSI+CiAgICAgICAgICAgIDxnIGlkPSJQYXRoLTQiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTkuNzQ0NjA1MzMsLTAuMDQ0NzAzODAwMSBDMTAuMjU3NDQxMiwtMC4wNDQ3MDM4MDAxIDEwLjY4MDExMjUsMC4zNDEzMzYzOSAxMC43Mzc4Nzc2LDAuODM4Njc1MDc0IEwxMC43NDQ2MDUzLDAuOTU1Mjk2MiBMMTAuNzQ0LDExLjAwMyBMMTguMTI3NDA4OCwxNi4zODMzNDcgQzE4LjU3Mzc2NDksMTYuNzA4NTkyNiAxOC42NzE5NDQ0LDE3LjMzNDA5OTMgMTguMzQ2Njk4OSwxNy43ODA0NTU0IEMxOC4wNDY0NzIyLDE4LjE5MjQ3NjQgMTcuNDkwNDAxNywxOC4zMDc4MjYyIDE3LjA1NTU1NzcsMTguMDY3MzE5OSBMMTYuOTQ5NTkwNSwxNy45OTk3NDU1IEw4Ljc0NDYwNTMzLDEyLjAyMTAzMjcgTDguNzQ0NjA1MzMsMC45NTUyOTYyIEM4Ljc0NDYwNTMzLDAuNDAzMDExNDUgOS4xOTIzMjA1OCwtMC4wNDQ3MDM4MDAxIDkuNzQ0NjA1MzMsLTAuMDQ0NzAzODAwMSBaIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==';
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
        const paddingLeft = 15;
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
        point.on('click', (evt) => {
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
