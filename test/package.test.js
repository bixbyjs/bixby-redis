/* global describe, it, expect */

var expect = require('chai').expect;


describe('bixby-redis', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have component metadata', function() {
      expect(json.namespace).to.equal('opt/redis');
      expect(json.components).to.have.length(1);
      expect(json.components).to.include('service');
    });
  });
  
});

