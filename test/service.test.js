var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../app/service');
var redis = require('redis');


describe('service', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.equal(true);
    expect(factory['@implements']).to.deep.equal([ 'http://i.bixbyjs.org/redis', 'http://i.bixbyjs.org/IService' ]);
    expect(factory['@name']).to.equal('redis');
  });
  
  describe('API', function() {
    var _keyring = { get: function(){} };
    var _client = sinon.createStubInstance(redis.RedisClient);
    _client.emit.callThrough();
    _client.on.callThrough();
    _client.once.callThrough();
    var createClientStub = sinon.stub().returns(_client);
    var api = $require('../app/service',
      { 'redis': { createClient: createClientStub } }
    )(_keyring);
    
    
    describe('.createConnection', function() {
      beforeEach(function() {
        sinon.stub(_keyring, 'get').withArgs('redis.example.com').yieldsAsync(null, { password: 'keyboard cat' })
                                   .withArgs('localhost').yieldsAsync(null, { password: 'h0m35w337h0m3' });
        
        _client.auth.callsFake(function() {
          var self = this;
          process.nextTick(function() {
            _client.emit('connect');
          });
        });
      });
      
      afterEach(function() {
        createClientStub.resetHistory();
        _client.auth.resetHistory();
      });
      
      
      it('should construct client and auth', function(done) {
        var client = api.createConnection({ name: 'redis.example.com', port: 6379 });
        
        expect(createClientStub).to.have.been.calledOnceWithExactly(6379, 'redis.example.com');
        expect(client).to.be.an.instanceof(redis.RedisClient);
        
        client.once('connect', function() {
          expect(client.auth).to.have.been.calledOnceWithExactly('keyboard cat');
          done();
        });
      }); // should construct client and auth
      
      it('should construct client, add listener and auth', function(done) {
        var client = api.createConnection({ name: 'redis.example.com', port: 6379 }, function() {
          expect(this).to.be.an.instanceof(redis.RedisClient);
          expect(client.auth).to.have.been.calledOnceWithExactly('keyboard cat');
          done();
        });
        
        expect(createClientStub).to.have.been.calledOnceWithExactly(6379, 'redis.example.com');
        expect(client).to.be.an.instanceof(redis.RedisClient);
      }); // should construct client, add listener and auth
      
      it('should construct client and auth to address', function(done) {
        var client = api.createConnection({ name: 'localhost', address: '127.0.0.1', port: 6379 });
        
        expect(createClientStub).to.have.been.calledOnceWithExactly(6379, '127.0.0.1');
        expect(client).to.be.an.instanceof(redis.RedisClient);
        
        client.once('connect', function() {
          expect(client.auth).to.have.been.calledOnceWithExactly('h0m35w337h0m3');
          done();
        });
      }); // should construct client and auth to address
      
    }); // .createConnection
    
  }); // API
  
}); // service
