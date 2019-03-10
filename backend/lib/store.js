'use strict';

/**
 * A simple in memory store. This is really just to abstract the storage with
 * some idea that in the future a persistent store would be used instead.
 *
 * Warning: Objects and arrays will be stored by reference, so changing them
 * after they have been stored will mean the result from get() will include
 * those changes!
 *
 * Example usage:
 *
 *      var store = require('store');
 *
 *          id = store.set('some data');
 *
 *      console.log(store.get(id));
 *      store.flush();
 */

var uuid = require('uuid'),

    store = {};

module.exports = {
    set: function (data) {
        var id = uuid.v4();

        store[id] = data;

        return id;
    },

    get: function (id) {
        return store[id] || null;
    },

    flush: function () {
        store = {};
    }
};
