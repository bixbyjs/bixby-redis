/* global describe, it, expect */

var redis = require('..');

describe('bixby-redis', function() {
  
  it('should export function', function() {
    expect(redis).to.be.an('function');
  });
  
});
