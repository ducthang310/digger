import { Calculator } from './calculator';

const imageLevel0 = {
    uuid: 'adsdfsdf-asdfsdf',
    name: 'Level0.png',
    path: '/tools/images/Level0.png',
    url: 'http://tools.local/images/Level0.png',
    width: 1024,
    height: 600,
    size_in_kbs: 500,
};
const imageLevel1 = {
    uuid: 'aaaaa-asdbbbbbfsdf',
    name: 'Level1.png',
    path: '/tools/images/Level1.png',
    url: 'http://tools.local/images/Level1.png',
    width: 2048,
    height: 1200,
    size_in_kbs: 1000,
};
const calculator = new Calculator();

test('Level0 - case 1 ', () => {
    const expected = [
        {
            uuid: '1x1',
            url: 'http://tools.local/images/Level0-1x1.png',
            position: {x: 0, y: 0},
            width: 250,
            height: 250
        },
        {
            uuid: '1x2',
            url: 'http://tools.local/images/Level0-1x2.png',
            position: {x: 0, y: 250},
            width: 250,
            height: 250
        },
        {
            uuid: '1x3',
            url: 'http://tools.local/images/Level0-1x3.png',
            position: {x: 0, y: 500},
            width: 250,
            height: 250
        },

        {
            uuid: '2x1',
            url: 'http://tools.local/images/Level0-2x1.png',
            position: {x: 250, y: 0},
            width: 250,
            height: 250
        },
        {
            uuid: '2x2',
            url: 'http://tools.local/images/Level0-2x2.png',
            position: {x: 250, y: 250},
            width: 250,
            height: 250
        },
        {
            uuid: '2x3',
            url: 'http://tools.local/images/Level0-2x3.png',
            position: {x: 250, y: 500},
            width: 250,
            height: 250
        },

        {
            uuid: '3x1',
            url: 'http://tools.local/images/Level0-3x1.png',
            position: {x: 500, y: 0},
            width: 250,
            height: 250
        },
        {
            uuid: '3x2',
            url: 'http://tools.local/images/Level0-3x2.png',
            position: {x: 500, y: 250},
            width: 250,
            height: 250
        },
        {
            uuid: '3x3',
            url: 'http://tools.local/images/Level0-3x3.png',
            position: {x: 500, y: 500},
            width: 250,
            height: 250
        },

        {
            uuid: '4x1',
            url: 'http://tools.local/images/Level0-4x1.png',
            position: {x: 750, y: 0},
            width: 250,
            height: 250
        },
        {
            uuid: '4x2',
            url: 'http://tools.local/images/Level0-4x2.png',
            position: {x: 750, y: 250},
            width: 250,
            height: 250
        },
        {
            uuid: '4x3',
            url: 'http://tools.local/images/Level0-4x3.png',
            position: {x: 750, y: 500},
            width: 250,
            height: 250
        },

        {
            uuid: '5x1',
            url: 'http://tools.local/images/Level0-5x1.png',
            position: {x: 1000, y: 0},
            width: 250,
            height: 250
        },
        {
            uuid: '5x2',
            url: 'http://tools.local/images/Level0-5x2.png',
            position: {x: 1000, y: 250},
            width: 250,
            height: 250
        },
        {
            uuid: '5x3',
            url: 'http://tools.local/images/Level0-5x3.png',
            position: {x: 1000, y: 500},
            width: 250,
            height: 250
        }
    ];
    const result = calculator.generateRequiredImages(
        {x: 0, y: 0},
        1440,
        800,
        imageLevel0,
        1,
        1024,
        250
    );
    expect(result).toEqual(expected);
});

test('Level0 - case 2 ', () => {
    const expected = [
        {
            uuid: '1x2',
            url: 'http://tools.local/images/Level0-1x2.png',
            position: {x: -81, y: -28},
            width: 250,
            height: 250
        },
        {
            uuid: '1x3',
            url: 'http://tools.local/images/Level0-1x3.png',
            position: {x: -81, y: 222},
            width: 250,
            height: 250
        },

        {
            uuid: '2x2',
            url: 'http://tools.local/images/Level0-2x2.png',
            position: {x: 169, y: -28},
            width: 250,
            height: 250
        },
        {
            uuid: '2x3',
            url: 'http://tools.local/images/Level0-2x3.png',
            position: {x: 169, y: 222},
            width: 250,
            height: 250
        },

        {
            uuid: '3x2',
            url: 'http://tools.local/images/Level0-3x2.png',
            position: {x: 419, y: -28},
            width: 250,
            height: 250
        },
        {
            uuid: '3x3',
            url: 'http://tools.local/images/Level0-3x3.png',
            position: {x: 419, y: 222},
            width: 250,
            height: 250
        },

        {
            uuid: '4x2',
            url: 'http://tools.local/images/Level0-4x2.png',
            position: {x: 669, y: -28},
            width: 250,
            height: 250
        },
        {
            uuid: '4x3',
            url: 'http://tools.local/images/Level0-4x3.png',
            position: {x: 669, y: 222},
            width: 250,
            height: 250
        },

        {
            uuid: '5x2',
            url: 'http://tools.local/images/Level0-5x2.png',
            position: {x: 919, y: -28},
            width: 250,
            height: 250
        },
        {
            uuid: '5x3',
            url: 'http://tools.local/images/Level0-5x3.png',
            position: {x: 919, y: 222},
            width: 250,
            height: 250
        }
    ];
    const result = calculator.generateRequiredImages(
        {x: -81, y: -278},
        1440,
        800,
        imageLevel0,
        1,
        1024,
        250
    );
    // console.log(result);
    expect(result).toEqual(expected);
});

test('Level0 - case 3 ', () => {
    const expected = [
        {
            uuid: '3x2',
            url: 'http://tools.local/images/Level0-3x2.png',
            position: {x: -106, y: -1},
            width: 250,
            height: 250
        },
        {
            uuid: '3x3',
            url: 'http://tools.local/images/Level0-3x3.png',
            position: {x: -106, y: 249},
            width: 250,
            height: 250
        },

        {
            uuid: '4x2',
            url: 'http://tools.local/images/Level0-4x2.png',
            position: {x: 144, y: -1},
            width: 250,
            height: 250
        },
        {
            uuid: '4x3',
            url: 'http://tools.local/images/Level0-4x3.png',
            position: {x: 144, y: 249},
            width: 250,
            height: 250
        },

        {
            uuid: '5x2',
            url: 'http://tools.local/images/Level0-5x2.png',
            position: {x: 394, y: -1},
            width: 250,
            height: 250
        },
        {
            uuid: '5x3',
            url: 'http://tools.local/images/Level0-5x3.png',
            position: {x: 394, y: 249},
            width: 250,
            height: 250
        }
    ];
    const result = calculator.generateRequiredImages(
        {x: -606, y: -251},
        1440,
        800,
        imageLevel0,
        1,
        1024,
        250
    );
    // console.log(result);
    expect(result).toEqual(expected);
});

test('Level0 - case 4 ', () => {
    const expected = [
        {
            uuid: '3x1',
            url: 'http://tools.local/images/Level0-3x1.png',
            position: {x: -101, y: 117},
            width: 250,
            height: 250
        },
        {
            uuid: '3x2',
            url: 'http://tools.local/images/Level0-3x2.png',
            position: {x: -101, y: 367},
            width: 250,
            height: 250
        },
        {
            uuid: '3x3',
            url: 'http://tools.local/images/Level0-3x3.png',
            position: {x: -101, y: 617},
            width: 250,
            height: 250
        },

        {
            uuid: '4x1',
            url: 'http://tools.local/images/Level0-4x1.png',
            position: {x: 149, y: 117},
            width: 250,
            height: 250
        },
        {
            uuid: '4x2',
            url: 'http://tools.local/images/Level0-4x2.png',
            position: {x: 149, y: 367},
            width: 250,
            height: 250
        },
        {
            uuid: '4x3',
            url: 'http://tools.local/images/Level0-4x3.png',
            position: {x: 149, y: 617},
            width: 250,
            height: 250
        },

        {
            uuid: '5x1',
            url: 'http://tools.local/images/Level0-5x1.png',
            position: {x: 399, y: 117},
            width: 250,
            height: 250
        },
        {
            uuid: '5x2',
            url: 'http://tools.local/images/Level0-5x2.png',
            position: {x: 399, y: 367},
            width: 250,
            height: 250
        },
        {
            uuid: '5x3',
            url: 'http://tools.local/images/Level0-5x3.png',
            position: {x: 399, y: 617},
            width: 250,
            height: 250
        }
    ];
    const result = calculator.generateRequiredImages(
        {x: -601, y: 117},
        1440,
        800,
        imageLevel0,
        1,
        1024,
        250
    );
    expect(result).toEqual(expected);
});

test('Level0 - case 5 ', () => {
    const expected = [
        {
            uuid: '1x1',
            url: 'http://tools.local/images/Level0-1x1.png',
            position: {x: 832, y: 60},
            width: 250,
            height: 250
        },
        {
            uuid: '1x2',
            url: 'http://tools.local/images/Level0-1x2.png',
            position: {x: 832, y: 310},
            width: 250,
            height: 250
        },
        {
            uuid: '1x3',
            url: 'http://tools.local/images/Level0-1x3.png',
            position: {x: 832, y: 560},
            width: 250,
            height: 250
        },

        {
            uuid: '2x1',
            url: 'http://tools.local/images/Level0-2x1.png',
            position: {x: 1082, y: 60},
            width: 250,
            height: 250
        },
        {
            uuid: '2x2',
            url: 'http://tools.local/images/Level0-2x2.png',
            position: {x: 1082, y: 310},
            width: 250,
            height: 250
        },
        {
            uuid: '2x3',
            url: 'http://tools.local/images/Level0-2x3.png',
            position: {x: 1082, y: 560},
            width: 250,
            height: 250
        },

        {
            uuid: '3x1',
            url: 'http://tools.local/images/Level0-3x1.png',
            position: {x: 1332, y: 60},
            width: 250,
            height: 250
        },
        {
            uuid: '3x2',
            url: 'http://tools.local/images/Level0-3x2.png',
            position: {x: 1332, y: 310},
            width: 250,
            height: 250
        },
        {
            uuid: '3x3',
            url: 'http://tools.local/images/Level0-3x3.png',
            position: {x: 1332, y: 560},
            width: 250,
            height: 250
        }
    ];
    const result = calculator.generateRequiredImages(
        {x: 832, y: 60},
        1440,
        800,
        imageLevel0,
        1,
        1024,
        250
    );
    expect(result).toEqual(expected);
});

test('Level0 - case 6 ', () => {
    const expected = [
        {
            uuid: '1x1',
            url: 'http://tools.local/images/Level0-1x1.png',
            position: {x: 183, y: 68},
            width: 250,
            height: 250
        },
        {
            uuid: '1x2',
            url: 'http://tools.local/images/Level0-1x2.png',
            position: {x: 183, y: 318},
            width: 250,
            height: 250
        },
        {
            uuid: '1x3',
            url: 'http://tools.local/images/Level0-1x3.png',
            position: {x: 183, y: 568},
            width: 250,
            height: 250
        },

        {
            uuid: '2x1',
            url: 'http://tools.local/images/Level0-2x1.png',
            position: {x: 433, y: 68},
            width: 250,
            height: 250
        },
        {
            uuid: '2x2',
            url: 'http://tools.local/images/Level0-2x2.png',
            position: {x: 433, y: 318},
            width: 250,
            height: 250
        },
        {
            uuid: '2x3',
            url: 'http://tools.local/images/Level0-2x3.png',
            position: {x: 433, y: 568},
            width: 250,
            height: 250
        },

        {
            uuid: '3x1',
            url: 'http://tools.local/images/Level0-3x1.png',
            position: {x: 683, y: 68},
            width: 250,
            height: 250
        },
        {
            uuid: '3x2',
            url: 'http://tools.local/images/Level0-3x2.png',
            position: {x: 683, y: 318},
            width: 250,
            height: 250
        },
        {
            uuid: '3x3',
            url: 'http://tools.local/images/Level0-3x3.png',
            position: {x: 683, y: 568},
            width: 250,
            height: 250
        },

        {
            uuid: '4x1',
            url: 'http://tools.local/images/Level0-4x1.png',
            position: {x: 933, y: 68},
            width: 250,
            height: 250
        },
        {
            uuid: '4x2',
            url: 'http://tools.local/images/Level0-4x2.png',
            position: {x: 933, y: 318},
            width: 250,
            height: 250
        },
        {
            uuid: '4x3',
            url: 'http://tools.local/images/Level0-4x3.png',
            position: {x: 933, y: 568},
            width: 250,
            height: 250
        },

        {
            uuid: '5x1',
            url: 'http://tools.local/images/Level0-5x1.png',
            position: {x: 1183, y: 68},
            width: 250,
            height: 250
        },
        {
            uuid: '5x2',
            url: 'http://tools.local/images/Level0-5x2.png',
            position: {x: 1183, y: 318},
            width: 250,
            height: 250
        },
        {
            uuid: '5x3',
            url: 'http://tools.local/images/Level0-5x3.png',
            position: {x: 1183, y: 568},
            width: 250,
            height: 250
        }
    ];
    const result = calculator.generateRequiredImages(
        {x: 183, y: 68},
        1440,
        800,
        imageLevel0,
        1,
        1024,
        250
    );
    expect(result).toEqual(expected);
});


test('Level1 - case 1 ', () => {
    const expected = [
        {
            uuid: '1x1',
            url: 'http://tools.local/images/Level1-1x1.png',
            position: {x: 0, y: 0},
            width: 125,
            height: 125
        },
        {
            uuid: '1x2',
            url: 'http://tools.local/images/Level1-1x2.png',
            position: {x: 0, y: 125},
            width: 125,
            height: 125
        },
        {
            uuid: '1x3',
            url: 'http://tools.local/images/Level1-1x3.png',
            position: {x: 0, y: 250},
            width: 125,
            height: 125
        },
        {
            uuid: '1x4',
            url: 'http://tools.local/images/Level1-1x4.png',
            position: {x: 0, y: 375},
            width: 125,
            height: 125
        },
        {
            uuid: '1x5',
            url: 'http://tools.local/images/Level1-1x5.png',
            position: {x: 0, y: 500},
            width: 125,
            height: 125
        },


        {
            uuid: '2x1',
            url: 'http://tools.local/images/Level1-2x1.png',
            position: {x: 125, y: 0},
            width: 125,
            height: 125
        },
        {
            uuid: '2x2',
            url: 'http://tools.local/images/Level1-2x2.png',
            position: {x: 125, y: 125},
            width: 125,
            height: 125
        },
        {
            uuid: '2x3',
            url: 'http://tools.local/images/Level1-2x3.png',
            position: {x: 125, y: 250},
            width: 125,
            height: 125
        },
        {
            uuid: '2x4',
            url: 'http://tools.local/images/Level1-2x4.png',
            position: {x: 125, y: 375},
            width: 125,
            height: 125
        },
        {
            uuid: '2x5',
            url: 'http://tools.local/images/Level1-2x5.png',
            position: {x: 125, y: 500},
            width: 125,
            height: 125
        },


        {
            uuid: '3x1',
            url: 'http://tools.local/images/Level1-3x1.png',
            position: {x: 250, y: 0},
            width: 125,
            height: 125
        },
        {
            uuid: '3x2',
            url: 'http://tools.local/images/Level1-3x2.png',
            position: {x: 250, y: 125},
            width: 125,
            height: 125
        },
        {
            uuid: '3x3',
            url: 'http://tools.local/images/Level1-3x3.png',
            position: {x: 250, y: 250},
            width: 125,
            height: 125
        },
        {
            uuid: '3x4',
            url: 'http://tools.local/images/Level1-3x4.png',
            position: {x: 250, y: 375},
            width: 125,
            height: 125
        },
        {
            uuid: '3x5',
            url: 'http://tools.local/images/Level1-3x5.png',
            position: {x: 250, y: 500},
            width: 125,
            height: 125
        },

        {
            uuid: '4x1',
            url: 'http://tools.local/images/Level1-4x1.png',
            position: {x: 375, y: 0},
            width: 125,
            height: 125
        },
        {
            uuid: '4x2',
            url: 'http://tools.local/images/Level1-4x2.png',
            position: {x: 375, y: 125},
            width: 125,
            height: 125
        },
        {
            uuid: '4x3',
            url: 'http://tools.local/images/Level1-4x3.png',
            position: {x: 375, y: 250},
            width: 125,
            height: 125
        },
        {
            uuid: '4x4',
            url: 'http://tools.local/images/Level1-4x4.png',
            position: {x: 375, y: 375},
            width: 125,
            height: 125
        },
        {
            uuid: '4x5',
            url: 'http://tools.local/images/Level1-4x5.png',
            position: {x: 375, y: 500},
            width: 125,
            height: 125
        },


        {
            uuid: '5x1',
            url: 'http://tools.local/images/Level1-5x1.png',
            position: {x: 500, y: 0},
            width: 125,
            height: 125
        },
        {
            uuid: '5x2',
            url: 'http://tools.local/images/Level1-5x2.png',
            position: {x: 500, y: 125},
            width: 125,
            height: 125
        },
        {
            uuid: '5x3',
            url: 'http://tools.local/images/Level1-5x3.png',
            position: {x: 500, y: 250},
            width: 125,
            height: 125
        },
        {
            uuid: '5x4',
            url: 'http://tools.local/images/Level1-5x4.png',
            position: {x: 500, y: 375},
            width: 125,
            height: 125
        },
        {
            uuid: '5x5',
            url: 'http://tools.local/images/Level1-5x5.png',
            position: {x: 500, y: 500},
            width: 125,
            height: 125
        },

        {
            uuid: '6x1',
            url: 'http://tools.local/images/Level1-6x1.png',
            position: {x: 625, y: 0},
            width: 125,
            height: 125
        },
        {
            uuid: '6x2',
            url: 'http://tools.local/images/Level1-6x2.png',
            position: {x: 625, y: 125},
            width: 125,
            height: 125
        },
        {
            uuid: '6x3',
            url: 'http://tools.local/images/Level1-6x3.png',
            position: {x: 625, y: 250},
            width: 125,
            height: 125
        },
        {
            uuid: '6x4',
            url: 'http://tools.local/images/Level1-6x4.png',
            position: {x: 625, y: 375},
            width: 125,
            height: 125
        },
        {
            uuid: '6x5',
            url: 'http://tools.local/images/Level1-6x5.png',
            position: {x: 625, y: 500},
            width: 125,
            height: 125
        },

        {
            uuid: '7x1',
            url: 'http://tools.local/images/Level1-7x1.png',
            position: {x: 750, y: 0},
            width: 125,
            height: 125
        },
        {
            uuid: '7x2',
            url: 'http://tools.local/images/Level1-7x2.png',
            position: {x: 750, y: 125},
            width: 125,
            height: 125
        },
        {
            uuid: '7x3',
            url: 'http://tools.local/images/Level1-7x3.png',
            position: {x: 750, y: 250},
            width: 125,
            height: 125
        },
        {
            uuid: '7x4',
            url: 'http://tools.local/images/Level1-7x4.png',
            position: {x: 750, y: 375},
            width: 125,
            height: 125
        },
        {
            uuid: '7x5',
            url: 'http://tools.local/images/Level1-7x5.png',
            position: {x: 750, y: 500},
            width: 125,
            height: 125
        },

        {
            uuid: '8x1',
            url: 'http://tools.local/images/Level1-8x1.png',
            position: {x: 875, y: 0},
            width: 125,
            height: 125
        },
        {
            uuid: '8x2',
            url: 'http://tools.local/images/Level1-8x2.png',
            position: {x: 875, y: 125},
            width: 125,
            height: 125
        },
        {
            uuid: '8x3',
            url: 'http://tools.local/images/Level1-8x3.png',
            position: {x: 875, y: 250},
            width: 125,
            height: 125
        },
        {
            uuid: '8x4',
            url: 'http://tools.local/images/Level1-8x4.png',
            position: {x: 875, y: 375},
            width: 125,
            height: 125
        },
        {
            uuid: '8x5',
            url: 'http://tools.local/images/Level1-8x5.png',
            position: {x: 875, y: 500},
            width: 125,
            height: 125
        },

        {
            uuid: '9x1',
            url: 'http://tools.local/images/Level1-9x1.png',
            position: {x: 1000, y: 0},
            width: 125,
            height: 125
        },
        {
            uuid: '9x2',
            url: 'http://tools.local/images/Level1-9x2.png',
            position: {x: 1000, y: 125},
            width: 125,
            height: 125
        },
        {
            uuid: '9x3',
            url: 'http://tools.local/images/Level1-9x3.png',
            position: {x: 1000, y: 250},
            width: 125,
            height: 125
        },
        {
            uuid: '9x4',
            url: 'http://tools.local/images/Level1-9x4.png',
            position: {x: 1000, y: 375},
            width: 125,
            height: 125
        },
        {
            uuid: '9x5',
            url: 'http://tools.local/images/Level1-9x5.png',
            position: {x: 1000, y: 500},
            width: 125,
            height: 125
        },
    ];
    const result = calculator.generateRequiredImages(
        {x: 0, y: 0},
        1440,
        800,
        imageLevel1,
        1,
        1024,
        250
    );
    expect(result).toEqual(expected);
});

test('Level1 - case 2 ', () => {
    const expected = [
        {
            uuid: '8x3',
            url: 'http://tools.local/images/Level1-8x3.png',
            position: {x: -31, y: -88},
            width: 125,
            height: 125
        },
        {
            uuid: '8x4',
            url: 'http://tools.local/images/Level1-8x4.png',
            position: {x: -31, y: 37},
            width: 125,
            height: 125
        },
        {
            uuid: '8x5',
            url: 'http://tools.local/images/Level1-8x5.png',
            position: {x: -31, y: 162},
            width: 125,
            height: 125
        },

        {
            uuid: '9x3',
            url: 'http://tools.local/images/Level1-9x3.png',
            position: {x: 94, y: -88},
            width: 125,
            height: 125
        },
        {
            uuid: '9x4',
            url: 'http://tools.local/images/Level1-9x4.png',
            position: {x: 94, y: 37},
            width: 125,
            height: 125
        },
        {
            uuid: '9x5',
            url: 'http://tools.local/images/Level1-9x5.png',
            position: {x: 94, y: 162},
            width: 125,
            height: 125
        },
    ];
    const result = calculator.generateRequiredImages(
        {x: -906, y: -338},
        1440,
        800,
        imageLevel1,
        1,
        1024,
        250
    );
    expect(result).toEqual(expected);
});

test('Level1 - case 3 ', () => {
    const expected = [
        {
            uuid: '1x1',
            url: 'http://tools.local/images/Level1-1x1.png',
            position: {x: 70, y: 600},
            width: 125,
            height: 125
        },
        {
            uuid: '1x2',
            url: 'http://tools.local/images/Level1-1x2.png',
            position: {x: 70, y: 725},
            width: 125,
            height: 125
        },

        {
            uuid: '2x1',
            url: 'http://tools.local/images/Level1-2x1.png',
            position: {x: 195, y: 600},
            width: 125,
            height: 125
        },
        {
            uuid: '2x2',
            url: 'http://tools.local/images/Level1-2x2.png',
            position: {x: 195, y: 725},
            width: 125,
            height: 125
        },

        {
            uuid: '3x1',
            url: 'http://tools.local/images/Level1-3x1.png',
            position: {x: 320, y: 600},
            width: 125,
            height: 125
        },
        {
            uuid: '3x2',
            url: 'http://tools.local/images/Level1-3x2.png',
            position: {x: 320, y: 725},
            width: 125,
            height: 125
        },

        {
            uuid: '4x1',
            url: 'http://tools.local/images/Level1-4x1.png',
            position: {x: 445, y: 600},
            width: 125,
            height: 125
        },
        {
            uuid: '4x2',
            url: 'http://tools.local/images/Level1-4x2.png',
            position: {x: 445, y: 725},
            width: 125,
            height: 125
        },

        {
            uuid: '5x1',
            url: 'http://tools.local/images/Level1-5x1.png',
            position: {x: 570, y: 600},
            width: 125,
            height: 125
        },
        {
            uuid: '5x2',
            url: 'http://tools.local/images/Level1-5x2.png',
            position: {x: 570, y: 725},
            width: 125,
            height: 125
        },

        {
            uuid: '6x1',
            url: 'http://tools.local/images/Level1-6x1.png',
            position: {x: 695, y: 600},
            width: 125,
            height: 125
        },
        {
            uuid: '6x2',
            url: 'http://tools.local/images/Level1-6x2.png',
            position: {x: 695, y: 725},
            width: 125,
            height: 125
        },

        {
            uuid: '7x1',
            url: 'http://tools.local/images/Level1-7x1.png',
            position: {x: 820, y: 600},
            width: 125,
            height: 125
        },
        {
            uuid: '7x2',
            url: 'http://tools.local/images/Level1-7x2.png',
            position: {x: 820, y: 725},
            width: 125,
            height: 125
        },

        {
            uuid: '8x1',
            url: 'http://tools.local/images/Level1-8x1.png',
            position: {x: 945, y: 600},
            width: 125,
            height: 125
        },
        {
            uuid: '8x2',
            url: 'http://tools.local/images/Level1-8x2.png',
            position: {x: 945, y: 725},
            width: 125,
            height: 125
        },

        {
            uuid: '9x1',
            url: 'http://tools.local/images/Level1-9x1.png',
            position: {x: 1070, y: 600},
            width: 125,
            height: 125
        },
        {
            uuid: '9x2',
            url: 'http://tools.local/images/Level1-9x2.png',
            position: {x: 1070, y: 725},
            width: 125,
            height: 125
        },
    ];
    const result = calculator.generateRequiredImages(
        {x: 70, y: 600},
        1440,
        800,
        imageLevel1,
        1,
        1024,
        250
    );
    expect(result).toEqual(expected);
});

test('Level1 - case 4 ', () => {
    const expected = [
        {
            uuid: '1x1',
            url: 'http://tools.local/images/Level1-1x1.png',
            position: {x: 0, y: 0},
            width: 125,
            height: 125
        },
        {
            uuid: '1x2',
            url: 'http://tools.local/images/Level1-1x2.png',
            position: {x: 0, y: 125},
            width: 125,
            height: 125
        },
        {
            uuid: '2x1',
            url: 'http://tools.local/images/Level1-2x1.png',
            position: {x: 125, y: 0},
            width: 125,
            height: 125
        },
        {
            uuid: '2x2',
            url: 'http://tools.local/images/Level1-2x2.png',
            position: {x: 125, y: 125},
            width: 125,
            height: 125
        },


        {
            uuid: '3x1',
            url: 'http://tools.local/images/Level1-3x1.png',
            position: {x: 250, y: 0},
            width: 125,
            height: 125
        },
        {
            uuid: '3x2',
            url: 'http://tools.local/images/Level1-3x2.png',
            position: {x: 250, y: 125},
            width: 125,
            height: 125
        },
    ];
    const result = calculator.generateRequiredImages(
        {x: 0, y: 0},
        1440,
        800,
        imageLevel1,
        4,
        1024,
        250
    );
    expect(result).toEqual(expected);
});

