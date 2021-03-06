const main = require('../main/main');
const datbase = require('../main/datbase');
const printInventory = main.printInventory;
const formateInputs = main.formateInputs;
const loadAllItems = datbase.loadAllItems
const loadPromotions = datbase.loadPromotions
const buildOriginalBill = main.buildOriginalBill
const usePromotions = main.usePromotions
const buildFinalBill = main.buildFinalBill
const printBill = main.printBill

describe('pos', function () {
    var inputs;

    beforeEach(function () {
        inputs = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2',
            'ITEM000005',
            'ITEM000005',
            'ITEM000005'
        ];
    });

    it('should print correct text', function () {

        spyOn(console, 'log');

        printInventory(inputs);

        var expectText =
            '***<没钱赚商店>购物清单***\n' +
            '名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)\n' +
            '名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)\n' +
            '名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)\n' +
            '----------------------\n' +
            '挥泪赠送商品：\n' +
            '名称：雪碧，数量：1瓶\n' +
            '名称：方便面，数量：1袋\n' +
            '----------------------\n' +
            '总计：51.00(元)\n' +
            '节省：7.50(元)\n' +
            '**********************';

        expect(console.log).toHaveBeenCalledWith(expectText);
    });
});

describe('loadAllItems', function () {
    it('should return all items', function () {
        let result = loadAllItems();
        let expected=[
            {
                barcode: 'ITEM000000',
                name: '可口可乐',
                unit: '瓶',
                price: 3.00
            },
            {
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00
            },
            {
                barcode: 'ITEM000002',
                name: '苹果',
                unit: '斤',
                price: 5.50
            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00
            },
            {
                barcode: 'ITEM000004',
                name: '电池',
                unit: '个',
                price: 2.00
            },
            {
                barcode: 'ITEM000005',
                name: '方便面',
                unit: '袋',
                price: 4.50
            }
        ];
        expect(result).toEqual(expected)
    });
});

describe('loadPromotions', function () {
    it('should return all promotions', function () {
        let result = loadPromotions();
        let expected=[
            {
                type: 'BUY_TWO_GET_ONE_FREE',
                barcodes: [
                    'ITEM000000',
                    'ITEM000001',
                    'ITEM000005'
                ]
            }
        ];
        expect(result).toEqual(expected)
    });
});

describe('formateInputs', function () {
    it('should return object array that generated from inputs array', function () {
        let inputs = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2',
            'ITEM000005',
            'ITEM000005',
            'ITEM000005'
        ];
        let result = formateInputs(inputs);
        let expected=[{
            barcode:'ITEM000001',
            quantity:5
        },
        {
            barcode:'ITEM000003',
            quantity:2
        },
        {
            barcode:'ITEM000005',
            quantity:3
        }];
        expect(result).toEqual(expected)
    });
});

describe('buildOriginalBill', function () {
    it('should return bill without promotion', function () {
        let inputs1 = [{
            barcode:'ITEM000001',
            quantity:5
        },
        {
            barcode:'ITEM000003',
            quantity:2
        },
        {
            barcode:'ITEM000005',
            quantity:3
        }];
        let inputs2 = [
            {
                barcode: 'ITEM000000',
                name: '可口可乐',
                unit: '瓶',
                price: 3.00
            },
            {
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00
            },
            {
                barcode: 'ITEM000002',
                name: '苹果',
                unit: '斤',
                price: 5.50
            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00
            },
            {
                barcode: 'ITEM000004',
                name: '电池',
                unit: '个',
                price: 2.00
            },
            {
                barcode: 'ITEM000005',
                name: '方便面',
                unit: '袋',
                price: 4.50
            }
        ];
        let result = buildOriginalBill(inputs1,inputs2);
        let expected={itemDetails:[{
            barcode:'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00,
            quantity:5,
            subtotalPrice:15.00
        },
        {
            barcode:'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15.00,
            quantity:2,
            subtotalPrice:30.00
        },
        {
            barcode:'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.50,
            quantity:3,
            subtotalPrice:13.50
        }],
        totalPrice:58.50};
        expect(result).toEqual(expected)
    });
});

describe('Use promotions', function () {
    it('should return promotion info object when use promotion BUY_TWO_GET_ONE_FREE', function() {
      let inputs1 = {itemDetails:[{
        barcode:'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        quantity:5,
        subtotalPrice:15.00
        },
        {
            barcode:'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15.00,
            quantity:2,
            subtotalPrice:30.00
        },
        {
            barcode:'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.50,
            quantity:3,
            subtotalPrice:13.50
        }],
        totalPrice:58.50};
        let inputs2 = [
            {
                type: 'BUY_TWO_GET_ONE_FREE',
                barcodes: [
                    'ITEM000000',
                    'ITEM000001',
                    'ITEM000005'
                ]
            }
        ];
      let summary = usePromotions(inputs1,inputs2);
      let expected = {
        description:'挥泪赠送商品',
        isabled:true,
        discountedPrice:7.5,
        itemDetails:[{
            barcode:'ITEM000001',
            name:'雪碧',
            quantity:1,
            unit:'瓶'
        },{
            barcode:'ITEM000005',
            name:'方便面',
            quantity:1,
            unit:'袋'
        }]
      };
      expect(summary).toEqual(expected)
    });
});


describe('Build final bill', function () {
    it('should return final bill object', function() {
      let inputs1 = {itemDetails:[{
        barcode:'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        quantity:5,
        subtotalPrice:15.00
        },
        {
            barcode:'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15.00,
            quantity:2,
            subtotalPrice:30.00
        },
        {
            barcode:'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.50,
            quantity:3,
            subtotalPrice:13.50
        }],
        totalPrice:58.50};
        let inputs2 = {
            description:'挥泪赠送商品',
            isabled:true,
            discountedPrice:7.5,
            itemDetails:[{
                barcode:'ITEM000001',
                name:'雪碧',
                quantity:1,
                unit:'瓶'
            },{
                barcode:'ITEM000005',
                name:'方便面',
                quantity:1,
                unit:'袋'
            }]
          };
      let summary = buildFinalBill(inputs1,inputs2);
      let expected = {itemDetails:[{
        barcode:'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        quantity:5,
        subtotalPrice:12.00
        },
        {
            barcode:'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15.00,
            quantity:2,
            subtotalPrice:30.00
        },
        {
            barcode:'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.50,
            quantity:3,
            subtotalPrice:9.00
        }],
        promotionInfo:{
            description:'挥泪赠送商品',
            itemDetails:[{
                barcode:'ITEM000001',
                name:'雪碧',
                quantity:1,
                unit:'瓶'
            },{
                barcode:'ITEM000005',
                name:'方便面',
                quantity:1,
                unit:'袋'
            }]
          },
        discountedPrice:7.5,
        totalPrice:51.00};
      expect(summary).toEqual(expected)
    });
});

describe('Print bill', function () {
    it('should return a string of bill', function() {
      let inputs ={itemDetails:[{
        barcode:'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        quantity:5,
        subtotalPrice:12.00
        },
        {
            barcode:'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15.00,
            quantity:2,
            subtotalPrice:30.00
        },
        {
            barcode:'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.50,
            quantity:3,
            subtotalPrice:9.00
        }],
        promotionInfo:{
            description:'挥泪赠送商品',
            itemDetails:[{
                barcode:'ITEM000001',
                name:'雪碧',
                quantity:1,
                unit:'瓶'
            },{
                barcode:'ITEM000005',
                name:'方便面',
                quantity:1,
                unit:'袋'
            }]
          },
        discountedPrice:7.5,
        totalPrice:51.00};
        spyOn(console, 'log');
        printBill(inputs);
        var expectText =
            '***<没钱赚商店>购物清单***\n' +
            '名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)\n' +
            '名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)\n' +
            '名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)\n' +
            '----------------------\n' +
            '挥泪赠送商品：\n' +
            '名称：雪碧，数量：1瓶\n' +
            '名称：方便面，数量：1袋\n' +
            '----------------------\n' +
            '总计：51.00(元)\n' +
            '节省：7.50(元)\n' +
            '**********************';
        expect(console.log).toHaveBeenCalledWith(expectText);
    });
});