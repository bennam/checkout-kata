require('chai').should();

var Checkout = function Checkout(prices, discounts, discountThresholds) {

    this._discounts = discounts || {};
    this._discountThresholds = discountThresholds || {};
    this._discountThresholdCounter = {};
    this._prices = prices;
    this._total = 0;
    this._newDiscounts = {};

    for (var item in this._discountThresholds) {
        if (this._discountThresholds.hasOwnProperty(item)) {
            this._discountThresholdCounter[item] = this._discountThresholds[item];
        }
    }

    for (var item in this._discounts) {
        var cost = this._prices[item] * this._discountThresholds[item];
        var newDiscount = cost - this._discounts[item];
        this._newDiscounts[item] = newDiscount;
    }

};

Checkout.prototype.scan = function scan(item) {

    this._total += this._prices[item];

    if (this._discounts[item]) {

        this._discountThresholds[item]--;

        if (!this._discountThresholds[item]) {
            this._total -= this._newDiscounts[item];
            this._discountThresholds[item] = this._discountThresholdCounter[item];
        }

    }

};

Checkout.prototype.total = function total() {
    return this._total;
};

describe('Checkout KATA!', function() {

    it('should have the price of one scanned item as the total.', function() {

        var prices = {
            itemToScan: 42.1
        };

        var checkout = new Checkout(prices);

        checkout.scan('itemToScan');

        var total = checkout.total();

        var expectedTotal = 42.1;

        total.should.equal(expectedTotal);
    });

    it('should give the total cost of two scanned items.', function() {

        var prices = {
            item1: 15.5,
            item2: 12.4
        };

        var checkout = new Checkout(prices);

        checkout.scan('item1');
        checkout.scan('item2');

        var total = checkout.total();

        var expectedTotal = 27.9;

        total.should.equal(expectedTotal);
    });

    it('should allow items to be scanned multiple times.', function() {

        var prices = {
            Apple: 10,
            Orange: 20,
            Pear: 30
        };

        var expectedTotal = 120;

        var checkout = new Checkout(prices);

        checkout.scan('Apple');
        checkout.scan('Orange');
        checkout.scan('Orange');
        checkout.scan('Pear');
        checkout.scan('Pear');
        checkout.scan('Apple');

        var total = checkout.total();

        total.should.equal(expectedTotal);
    });

    it('should apply discounts.', function() {

        var prices = {
            'Pumpkin': 7
        };

        var discounts = {
            'Pumpkin': 18
        };

        var discountThresholds = {
            'Pumpkin': 3
        };

        var expectedTotal = 18;

        var checkout = new Checkout(prices, discounts, discountThresholds);

        checkout.scan('Pumpkin');
        checkout.scan('Pumpkin');
        checkout.scan('Pumpkin');

        var total = checkout.total();

        total.should.equal(expectedTotal);
    });

    it('should apply discounts items more than once.', function() {

        var prices = {
            'Pen': 4,
            'Glass': 5
        };

        var discounts = {
            'Pen': 6
        };

        var discountThresholds = {
            'Pen': 2
        };

        var expectedTotal = 17;

        var checkout = new Checkout(prices, discounts, discountThresholds);

        checkout.scan('Pen');
        checkout.scan('Pen');
        checkout.scan('Glass');
        checkout.scan('Pen');
        checkout.scan('Pen');

        var total = checkout.total();

        total.should.equal(expectedTotal);
    });

    it('should apply different discounts to items more than once.', function() {

        var prices = {
            'Shirt': 10,
            'Turtle': 20,
            'Pizza': 30
        };

        var discounts = {
            'Shirt': 25,
            'Turtle': 30,
            'Pizza': 20
        };

        var discountThresholds = {
            'Shirt': 3,
            'Turtle': 2,
            'Pizza': 1
        };

        var expectedTotal = 100;

        var checkout = new Checkout(prices, discounts, discountThresholds);

        checkout.scan('Turtle');
        checkout.scan('Shirt');
        checkout.scan('Shirt');
        checkout.scan('Shirt');
        checkout.scan('Turtle');
        checkout.scan('Shirt');
        checkout.scan('Shirt');
        checkout.scan('Pizza');
        checkout.scan('Shirt');

        var total = checkout.total();

        total.should.equal(expectedTotal);

    });

});