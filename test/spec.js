'use strict';

// Simple test, really...
describe('ngSharedObject', function () {
    beforeEach(module('ngSharedObject'));

    it('should contain a sharedObject service', inject(function(
        sharedObject
    ){
        expect(sharedObject).not.toBe(null);
    }));
});