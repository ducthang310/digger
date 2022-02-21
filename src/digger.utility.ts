export class DiggerUtility {
    static hex2rgba(hex: string, alpha = 1): string {
        const parts = hex.match(/\w\w/g);
        if (parts) {
            const [r, g, b] = parts.map(x => parseInt(x, 16));
            return `rgba(${r},${g},${b},${alpha})`;
        } else {
            return 'rgba(0, 0, 0, 1)';
        }
    }

    static calculateScaleValue(zoomGap: number, levelIndex: number): number {
        levelIndex = !levelIndex || levelIndex === 1 ? 0 : (levelIndex - 1);
        return levelIndex ? Math.round((Math.pow(zoomGap, levelIndex) + Number.EPSILON) * 100) / 100 : 0;
    }

    static isHTML(str: string): boolean {
        return !(str || '')
            // replace html tag with content
            .replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/ig, '')
            // remove remaining self closing tags
            .replace(/(<([^>]+)>)/ig, '')
            // remove extra space at start and end
            .trim();
    }
}
