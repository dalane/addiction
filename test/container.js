var Container = require("../lib/Container");

var assert = require('assert');
describe('Container', function() {
    describe('#get()', function () {
        it('Should throw SyntaxError when the name parameter is not provided.', function () {
            var error = false;
            var container = new Container();
            try {
                var result = container.get();
            } catch (err) {
                if (err.name == 'SyntaxError') {
                    error = true;
                }
            }
            assert.equal(true, error);
        });
        it('Should throw RangeError when the named dependency is not in the collection.', function () {
            var error = false;
            var container = new Container();
            try {
                var result = container.get('non-existent-dependency');
            } catch (err) {
                if (err.name == 'RangeError') {
                    error = true;
                }
            }
            assert.equal(true, error);
        });
    });
});
