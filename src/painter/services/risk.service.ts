import { PainterConfigInterface, PainterPointInterface, TooltipConfig } from '../painter.interface';
import Konva from 'konva';
import { DefaultColor, PointSubtype } from '../painter.constants';
import { PointService } from './base.service';

export class RiskService extends PointService {
    async createShapes(data: PainterPointInterface): Promise<Konva.Group> {
        const primaryColor = data.primaryColor ?? DefaultColor;
        const point = new Konva.Group({
            id: data.id,
            name: 'Point',
            draggable: data.draggable,
        });

        const importantItem = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTAwcHgiIGhlaWdodD0iMTAwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPnN0YW5kYXJkPC90aXRsZT4KICAgIDxkZWZzPgogICAgICAgIDxmaWx0ZXIgeD0iLTM0LjQlIiB5PSItMzQuNCUiIHdpZHRoPSIxNjguOCUiIGhlaWdodD0iMTY4LjglIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIGlkPSJmaWx0ZXItMSI+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjYiIGluPSJTb3VyY2VHcmFwaGljIj48L2ZlR2F1c3NpYW5CbHVyPgogICAgICAgIDwvZmlsdGVyPgogICAgPC9kZWZzPgogICAgPGcgaWQ9IkhJLUZJLVVJIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iVXBkYXRlcyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI1MC4wMDAwMDAsIC02MDUuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJzdGFuZGFyZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjUwLjAwMDAwMCwgNjA1LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0id3JhcCIgZmlsbC1vcGFjaXR5PSIwLjIyMTYxODIyNiIgZmlsbD0iI0ZEQjAzMCIgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9InNlY29uZCIgZmlsbC1vcGFjaXR5PSIwLjU5NzgyMDE0OSIgZmlsbD0iI0ZDQjAzMCIgZmlsdGVyPSJ1cmwoI2ZpbHRlci0xKSIgY3g9IjUwLjE2Mjc5MDciIGN5PSI1MC4xNjI3OTA3IiByPSIyNi4xNjI3OTA3Ij48L2NpcmNsZT4KICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9ImNlbnRlciIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IiNGREIwMzAiIGN4PSI1MCIgY3k9IjUwIiByPSIxNSI+PC9jaXJjbGU+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==';
        const criticalItem = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTAwcHgiIGhlaWdodD0iMTAwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPlB1bHNlIENvcHkgNTwvdGl0bGU+CiAgICA8ZGVmcz4KICAgICAgICA8ZmlsdGVyIHg9Ii0zNC40JSIgeT0iLTM0LjQlIiB3aWR0aD0iMTY4LjglIiBoZWlnaHQ9IjE2OC44JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBpZD0iZmlsdGVyLTEiPgogICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI2IiBpbj0iU291cmNlR3JhcGhpYyI+PC9mZUdhdXNzaWFuQmx1cj4KICAgICAgICA8L2ZpbHRlcj4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJISS1GSS1VSSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IlVwZGF0ZXMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05NzkuMDAwMDAwLCAtNzUxLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMTEtQ29weS01IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5NTYuMDAwMDAwLCA3MTkuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iUHVsc2UtQ29weS01IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMy4wMDAwMDAsIDMyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtQ29weSIgZmlsbD0iI0Q5MkUyNCIgb3BhY2l0eT0iMC4xMyIgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLUNvcHktMiIgZmlsbD0iI0Q5MkUyNCIgb3BhY2l0eT0iMC41MDQ1NTEiIGZpbHRlcj0idXJsKCNmaWx0ZXItMSkiIGN4PSI1MC4xNjI3OTA3IiBjeT0iNTAuMTYyNzkwNyIgcj0iMjYuMTYyNzkwNyI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9ImNlbnRlciIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQuMDAwMDAwLCAzNC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IiNEOTJFMjQiIGN4PSIxNiIgY3k9IjE2IiByPSIxNSI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTYuMDAwMDAwLCAxNS42NjY2NjcpIHJvdGF0ZSgtMTgwLjAwMDAwMCkgdHJhbnNsYXRlKC0xNi4wMDAwMDAsIC0xNS42NjY2NjcpIHRyYW5zbGF0ZSgxNC4wMDAwMDAsIDYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZWxsaXBzZSBpZD0iT3ZhbCIgZmlsbD0iI0ZGRkZGRiIgY3g9IjIiIGN5PSIyLjAzNTcxNDI5IiByeD0iMiIgcnk9IjIuMDM1NzE0MjkiPjwvZWxsaXBzZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPSIyIiB5MT0iNy43OTc2MTkwNSIgeDI9IjIiIHkyPSIxOS4zMzMzMzMzIiBpZD0iUGF0aC01MiIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PC9saW5lPgogICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=';
        const iconBase64 = data.subtype === PointSubtype.CriticalItem ? criticalItem : importantItem;
        point.add(await this.createIcon(data, iconBase64));
        point.add(this.createToolTip({
            title: data.title,
            description: data.description,
            primaryColor: primaryColor,
            textColor: data.textColor,
        }, data.tooltipPosition));
        return point;
    }

    private createToolTip(tooltipConfig: TooltipConfig, tooltipPosition?: string): Konva.Group {
        tooltipPosition = tooltipPosition ? tooltipPosition : 'top';
        // const primaryColor = tooltipConfig.primaryColor ?? DefaultColor;
        const textColor = tooltipConfig.textColor ?? '#ffffff';
        const paddingLeft = 15;
        const paddingTop = 14;
        let rectWidth = 160;
        let rectHeight = 40;
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
            text: tooltipConfig.title,
            fontSize: 14,
            fontFamily: 'Poppins',
            fill: textColor,
            fontStyle: '400',
        });
        let descriptionText: Konva.Text;
        if (tooltipConfig.description) {
            descriptionText = new Konva.Text({
                x: paddingLeft,
                y: paddingTop + simpleText.height() + 5,
                text: tooltipConfig.description,
                fontSize: 14,
                fill: textColor,
                fontStyle: '400',
                fontFamily: 'Poppins',
            });
        }

        // const headRect = new Konva.Shape({
        //     sceneFunc: (context, shape) => {
        //         this.createWrapper(context, 0, 0, rectWidth, 8, [8, 8, 0, 0], 0, 0)
        //         context.fillStrokeShape(shape);
        //     },
        //     x: 0,
        //     y: 0,
        //     width: 140,
        //     height: 8,
        //     fill: primaryColor,
        // });
        const titleWidth = simpleText.width();
        const descriptionWidth = descriptionText ? descriptionText.width() : 0;
        const descriptionHeight = descriptionText ? descriptionText.height() : 0;
        const contentWidth = titleWidth < descriptionWidth ? descriptionWidth : titleWidth;
        rectWidth = contentWidth + paddingLeft * 2;
        // headRect.width(rectWidth);
        rectHeight = descriptionHeight ? (paddingTop + simpleText.height() + descriptionHeight + 17) : 40;

        const rectWrapper = new Konva.Shape({
            sceneFunc: (context, shape) => {
                this.createWrapper(context, 0, 0, rectWidth, rectHeight, [8, 8, 8, 8], triangleWidth, triangleHeight, tooltipPosition)
                context.fillStrokeShape(shape);
            },
            x: 0,
            y: 0,
            fill: '#fff',
            shadowColor: '#000000',
            shadowBlur: 9,
            shadowOffset: { x: 0, y: 3 },
            shadowOpacity: 0.5,
            // strokeWidth: 1,
            // stroke: primaryColor,
            name: 'RectWrapper'
        });
        rectWrapper.width(rectWidth + 2);
        rectWrapper.height(45);
        toolTip.add(rectWrapper);
        // toolTip.add(headRect);
        toolTip.add(simpleText);
        descriptionText && toolTip.add(descriptionText);
        const pos = this.getTooltipPosition(rectWrapper, tooltipPosition);
        pos.x++;
        toolTip.setPosition(pos);

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

    //
    // private iconLowRisk(): Konva.Group {
    //     const group = new Konva.Group({
    //         x: 0,
    //         y: 0,
    //     });
    //     const clockwise = new Konva.Path({
    //         x: 0,
    //         y: 0,
    //         data:
    //             'M4.51422485,17.1951152 C4.42851354,16.6894926 4.73848196,16.2082467 5.21917093,16.0681728 L5.3330273,16.0420486 L14.4186792,14.5018099 C15.1517038,13.5863102 16.2787892,13 17.5428146,13 C19.7519536,13 21.5428146,14.790861 21.5428146,17 C21.5428146,19.209139 19.7519536,21 17.5428146,21 C16.3603071,21 15.2976465,20.4868745 14.5653469,19.6711376 L5.32355141,18.0122644 C4.90845985,17.9377852 4.58470787,17.610904 4.51422485,17.1951152 Z',
    //         fill: '#56B631',
    //
    //     });
    //     const clock = new Konva.Path({
    //         x: 0,
    //         y: 0,
    //         data:
    //             'M17.4856883,-0.00667040478 C26.9835835,-0.00667040478 34.7142383,7.55978506 34.9786943,16.9937376 L32.977797,16.9939768 C32.8719559,13.649817 31.7068047,10.5729168 29.8068051,8.08773786 L24.9427951,12.9504364 C24.5522708,13.3409607 23.9191059,13.3409607 23.5285816,12.9504364 C23.1680976,12.5899524 23.1403681,12.0227214 23.445393,11.6304302 L23.5285816,11.5362228 L28.4881096,6.57560325 C25.6798866,3.7457318 21.7874352,1.9933296 17.4856883,1.9933296 C13.1839415,1.9933296 9.29149007,3.7457318 6.48326707,6.57560325 L11.4427951,11.5362228 L11.5259837,11.6304302 C11.8310086,12.0227214 11.8032791,12.5899524 11.4427951,12.9504364 C11.0522708,13.3409607 10.4191059,13.3409607 10.0285816,12.9504364 L10.0285816,12.9504364 L5.16457158,8.08773786 C3.26457198,10.5729168 2.09942082,13.649817 1.9935797,16.9939768 L-0.00731763447,16.9937376 C0.257138367,7.55978506 7.98779317,-0.00667040478 17.4856883,-0.00667040478 Z',
    //         fill: '#242424',
    //     });
    //     group.add(clockwise, clock);
    //     return group;
    // }
    //
    // private iconMediumRisk(): Konva.Group {
    //     const group = new Konva.Group({
    //         x: 0,
    //         y: 0,
    //     });
    //     const clockwise = new Konva.Path({
    //         x: 0,
    //         y: 0,
    //         data:
    //             'M17.3048848,4.01422485 C17.8105074,3.92851354 18.2917533,4.23848196 18.4318272,4.71917093 L18.4579514,4.8330273 L19.9981901,13.9186792 C20.9136898,14.6517038 21.5,15.7787892 21.5,17.0428146 C21.5,19.2519536 19.709139,21.0428146 17.5,21.0428146 C15.290861,21.0428146 13.5,19.2519536 13.5,17.0428146 C13.5,15.8603071 14.0131255,14.7976465 14.8288624,14.0653469 L16.4877356,4.82355141 C16.5622148,4.40845985 16.889096,4.08470787 17.3048848,4.01422485 Z',
    //         fill: '#FBAF40',
    //
    //     });
    //     const clock = new Konva.Path({
    //         x: 0,
    //         y: 0,
    //         data:
    //             'M17.4856883,-0.00667040478 C26.9835835,-0.00667040478 34.7142383,7.55978506 34.9786943,16.9937376 L32.977797,16.9939768 C32.8719559,13.649817 31.7068047,10.5729168 29.8068051,8.08773786 L24.9427951,12.9504364 C24.5522708,13.3409607 23.9191059,13.3409607 23.5285816,12.9504364 C23.1680976,12.5899524 23.1403681,12.0227214 23.445393,11.6304302 L23.5285816,11.5362228 L28.4881096,6.57560325 C25.6798866,3.7457318 21.7874352,1.9933296 17.4856883,1.9933296 C13.1839415,1.9933296 9.29149007,3.7457318 6.48326707,6.57560325 L11.4427951,11.5362228 L11.5259837,11.6304302 C11.8310086,12.0227214 11.8032791,12.5899524 11.4427951,12.9504364 C11.0522708,13.3409607 10.4191059,13.3409607 10.0285816,12.9504364 L10.0285816,12.9504364 L5.16457158,8.08773786 C3.26457198,10.5729168 2.09942082,13.649817 1.9935797,16.9939768 L-0.00731763447,16.9937376 C0.257138367,7.55978506 7.98779317,-0.00667040478 17.4856883,-0.00667040478 Z',
    //         fill: '#242424',
    //     });
    //     group.add(clockwise, clock);
    //     return group;
    // }
    //
    // private iconHighRisk(): Konva.Group {
    //     const group = new Konva.Group({
    //         x: 0,
    //         y: 0,
    //     });
    //     const clockwise = new Konva.Path({
    //         x: 0,
    //         y: 0,
    //         data:
    //             'M30.5285898,16.8048848 C30.6143011,17.3105074 30.3043327,17.7917533 29.8236437,17.9318272 L29.7097873,17.9579514 L20.6241355,19.4981901 C19.8911108,20.4136898 18.7640255,21 17.5,21 C15.290861,21 13.5,19.209139 13.5,17 C13.5,14.790861 15.290861,13 17.5,13 C18.6825075,13 19.7451681,13.5131255 20.4774677,14.3288624 L29.7192632,15.9877356 C30.1343548,16.0622148 30.4581068,16.389096 30.5285898,16.8048848 Z',
    //         fill: '#EF4036',
    //
    //     });
    //     const clock = new Konva.Path({
    //         x: 0,
    //         y: 0,
    //         data:
    //             'M17.4856883,-0.00667040478 C26.9835835,-0.00667040478 34.7142383,7.55978506 34.9786943,16.9937376 L32.977797,16.9939768 C32.8719559,13.649817 31.7068047,10.5729168 29.8068051,8.08773786 L24.9427951,12.9504364 C24.5522708,13.3409607 23.9191059,13.3409607 23.5285816,12.9504364 C23.1680976,12.5899524 23.1403681,12.0227214 23.445393,11.6304302 L23.5285816,11.5362228 L28.4881096,6.57560325 C25.6798866,3.7457318 21.7874352,1.9933296 17.4856883,1.9933296 C13.1839415,1.9933296 9.29149007,3.7457318 6.48326707,6.57560325 L11.4427951,11.5362228 L11.5259837,11.6304302 C11.8310086,12.0227214 11.8032791,12.5899524 11.4427951,12.9504364 C11.0522708,13.3409607 10.4191059,13.3409607 10.0285816,12.9504364 L10.0285816,12.9504364 L5.16457158,8.08773786 C3.26457198,10.5729168 2.09942082,13.649817 1.9935797,16.9939768 L-0.00731763447,16.9937376 C0.257138367,7.55978506 7.98779317,-0.00667040478 17.4856883,-0.00667040478 Z',
    //         fill: '#242424',
    //     });
    //     group.add(clockwise, clock);
    //     return group;
    // }

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
