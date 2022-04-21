import { PainterConfigInterface, PainterPointInterface } from '../painter.interface';
import Konva from 'konva';
import { PointService } from './base.service';

export class LinkService extends PointService {
    async createShapes(data: PainterPointInterface): Promise<Konva.Group> {
        // const primaryColor = data.primaryColor ?? DefaultColor;
        const point = new Konva.Group({
            id: data.id,
            name: 'Point',
            draggable: data.draggable,
            rotation: data.rotation,
        });
        const hotspot = this.createHotspot({...data, primaryColor: data.link_background_color}, 7, false);
        if (data.hide_hotspot) {
            hotspot.hide();
        }
        point.add(hotspot);

        if (data.text) {
            point.add(await this.createToolTip(data.tooltipPosition, data));
        }

        return point;
    }

    private async createToolTip(tooltipPosition: string, data: PainterPointInterface): Promise<Konva.Group> {
        tooltipPosition = tooltipPosition ? tooltipPosition : 'top';
        const hideChevron = data.hide_chevron;
        const hideHotspot = data.hide_hotspot;
        const textColor = '#ffffff';
        let paddingLeft = 12;
        let paddingTop = 14;
        let rectWidth = 160;
        let rectHeight = 40;
        let triangleWidth = 9;
        let triangleHeight = 20;

        const toolTip = new Konva.Group({
            name: 'Tooltip',
            x: 0,
            y: 0,
        });

        let icon: Konva.Group;
        let iconWidth = 0;
        let iconPaddingLeft = 10;
        let mainText: Konva.Shape;
        let textScale = 1;
        if (!data.title_base64) {
            const textStr = data.text ? data.text.replace(/(<([^>]+)>)/gi, "") : '';
            mainText = new Konva.Text({
                x: paddingLeft,
                y: paddingTop,
                text: textStr,
                fontSize: 14,
                fill: textColor,
                fontFamily: 'Poppins',
                fontStyle: '400',
            });
        } else {
            paddingLeft -= 3;
            paddingTop -= 5;
            textScale = 0.5;
            iconPaddingLeft -= 3;
            mainText = await this.getImage(data.title_base64, textScale);
            mainText.setPosition({x: paddingLeft, y: paddingTop});
        }
        const textWidth = mainText.width() * textScale;
        const textHeight = mainText.height() * textScale;
        if (!hideChevron) {
            icon = this.iconLink();
            icon.width(14);
            iconWidth = icon.width();
        }
        if (hideHotspot) {
            triangleWidth = 0;
            triangleHeight = 0;
        }

        rectWidth = textWidth + iconWidth + paddingLeft * 2;
        rectHeight = textHeight + paddingTop * 2;
        if (icon) {
            icon.setPosition({
                x: paddingLeft + textWidth + iconPaddingLeft,
                y: Math.round(rectHeight / 2 - 10)
            })
        }

        const rectWrapper = new Konva.Shape({
            sceneFunc: (context, shape) => {
                this.createWrapper(context, 0, 0, rectWidth, rectHeight, [8, 8, 8, 8], triangleWidth, triangleHeight, tooltipPosition)
                context.fillStrokeShape(shape);
            },
            x: 0,
            y: 0,
            fill: data.link_background_color,
            shadowColor: '#000000',
            shadowBlur: 9,
            shadowOffset: { x: 0, y: 3 },
            shadowOpacity: 0.5,
            name: 'RectWrapper',
        });
        rectWrapper.width(rectWidth);
        rectWrapper.height(rectHeight);
        toolTip.add(rectWrapper);
        toolTip.width(rectWidth);
        toolTip.height(rectHeight);
        icon && toolTip.add(icon);
        toolTip.add(mainText);
        const pos = this.getTooltipPosition(rectWrapper, tooltipPosition);

        switch (tooltipPosition) {
            case 'right':
                pos.x -= 12;
                break;
            case 'bottom':
                pos.y -= 12;
                break;
            case 'left':
                pos.x += 12;
                break;
            default:
                pos.y += 12;
        }
        toolTip.setPosition(pos);

        return toolTip;
    }

    private async getImage(dataUrl: string, textScale: number): Promise<Konva.Image> {
        return new Promise((resolve, reject) => {
            const imageObj = new Image();
            imageObj.onload = () => {
                const mainText = new Konva.Image({
                    x: 0,
                    y: 0,
                    scaleX: textScale,
                    scaleY: textScale,
                    image: imageObj,
                });
                resolve(mainText);
            };
            imageObj.onerror = () => reject();
            imageObj.src = dataUrl;
        });
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

    private iconLink(): Konva.Group {
        const group = new Konva.Group({
            x: 0,
            y: 0,
        });
        group.add(new Konva.Path({
            x: 0,
            y: 0,
            data:
                'M0.244774323,0.20599246 C0.531448498,-0.0609106705 0.967743195,-0.0666469744 1.26058958,0.178316578 L1.33064307,0.244774323 L10,9.55632021 L1.31106246,18.2281433 C1.01072126,18.5278929 0.524251539,18.5274133 0.224501919,18.2270721 C-0.0521900384,17.9498341 -0.0730654087,17.5140013 0.161586713,17.2128294 L0.225573065,17.1405116 L7.86380145,9.51675162 L0.20599246,1.2918612 C-0.0609106705,1.00518703 -0.0666469744,0.568892332 0.178316578,0.276045949 L0.244774323,0.20599246 Z',
            fill: '#ffffff',
        }));
        return group;
    }

    initEvents(point: Konva.Group, config: PainterConfigInterface, data: PainterPointInterface): Konva.Group {
        point.on('click touchstart', () => {
            if (config.events?.pointClick) {
                config.events.pointClick(point.id());
            }
        });
        point.find('.Tooltip').forEach(t => {
            t.on('click touchstart', (evt) => {
                if (config.events?.tooltipClick) {
                    evt.cancelBubble = true;
                    config.events.tooltipClick(point.id());
                }
            });
        });
        point.on('mouseenter', () => {
            point.getStage().container().style.cursor = 'pointer';
            if (config.events && config.events.pointMouseenter) {
                config.events.pointMouseenter(point.id(), point.getPosition());
            }
            point.find('.RectWrapper').forEach((t) => {
                (t as Konva.Shape).fill(data.link_background_color_hovering);
            });
            point.find('.PointCircle').forEach((t) => {
                (t as Konva.Shape).fill(data.link_background_color_hovering);
            });
            point.clearCache();
        });
        point.on('mouseleave', () => {
            point.getStage().container().style.cursor = 'default';
            if (config.events && config.events.pointMouseleave) {
                config.events.pointMouseleave(point.id(), point.getPosition());
            }
            point.find('.RectWrapper').forEach((t) => {
                (t as Konva.Shape).fill(data.link_background_color);
            });
            point.find('.PointCircle').forEach((t) => {
                (t as Konva.Shape).fill(data.link_background_color);
            });
            point.clearCache();
        });
        return point;
    }
}
