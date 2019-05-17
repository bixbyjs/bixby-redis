var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/http/session/store');
var redis = require('redis');
var RedisStore = require('connect-redis')(require('express-session'));


describe('http/session/store', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.equal(true);
    expect(factory['@implements']).to.deep.equal([ 'http://i.bixbyjs.org/IService', 'http://i.bixbyjs.org/http/ISessionStore' ]);
    expect(factory['@name']).to.equal('sess-redis');
  });
  
  describe('API', function() {
    var _redis = { createConnection: function(){} };
    var _store = new RedisStore({ client: sinon.createStubInstance(redis.RedisClient) });
    var ReidsStoreStub = sinon.stub().returns(_store);
    var api = $require('../../../app/http/session/store',
      { 'connect-redis': function() { return ReidsStoreStub; } }
    )(_redis);
    
    
    describe('.createConnection', function() {
      beforeEach(function() {
        sinon.stub(_redis, 'createConnection').returns(sinon.createStubInstance(redis.RedisClient));
      });
      
      afterEach(function() {
        ReidsStoreStub.resetHistory();
      });
      
      
      it('should construct store', function() {
        var store = api.createConnection({ cname: 'redis.example.com', port: 6379 });
        
        expect(_redis.createConnection).to.have.been.calledOnceWithExactly({ cname: 'redis.example.com', port: 6379 });
        expect(ReidsStoreStub).to.have.been.calledOnce.and.calledWithNew;
        expect(ReidsStoreStub.getCall(0).args[0].client).to.be.an.instanceof(redis.RedisClient);
        expect(store).to.be.an.instanceof(RedisStore);
      }); // should construct store
      
      it('should construct store and add listener', function(done) {
        var store = api.createConnection({ cname: 'redis.example.com', port: 6379 }, function() {
          done();
        });
        
        expect(_redis.createConnection).to.have.been.calledOnceWithExactly({ cname: 'redis.example.com', port: 6379 });
        expect(ReidsStoreStub).to.have.been.calledOnce.and.calledWithNew;
        expect(ReidsStoreStub.getCall(0).args[0].client).to.be.an.instanceof(redis.RedisClient);
        expect(store).to.be.an.instanceof(RedisStore);
        
        process.nextTick(function() {
          store.emit('connect');
        });
      }); // should construct store and add listener
      
    }); // .createConnection
    
  }); // API
  
}); // http/session/store
