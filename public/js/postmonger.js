(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function () { return factory(root); });
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.Postmonger = factory(root);
    }
}(this, function (root) {
    root = root || window;

    var Postmonger = {};
    var previous = root.Postmonger;

    Postmonger.noConflict = function () {
        root.Postmonger = previous;
        return this;
    };

    Postmonger.version = '0.0.14';

    // Connection and Events implementation...

    return Postmonger;
}));
