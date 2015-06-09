if (typeof describe === "undefined" || describe === null) {
  var server = {
    name: 'rupert-plugin-mongo.test',
    root: __dirname,
    plugins: {
      dependencies: {}
    },
    stassets: {
      root: './',
      vendors: {
        prefix: [],
        js: []
      }
    },
    mongo: {
      rest: {
        open: true
      }
    }
  };

  server.plugins.dependencies[Path.resolve(__dirname, '../src/config')] = true;
  rupert = require('rupert')(server);
  rupert.start();
} else {
  var assert = require('assert');

  var objectId;

  describe('Testing crest', function () {
    var request;

    before(function(done){
      request = superroute(require('../src/mongo/mongo-route'), {
        mongo: {
          host: 'localhost',
          database: 'tests',
          rest: {
            open: true
          }
        }
      });
      setTimeout(done, 200);// Try to connect?
    });

    after(function(){
      request.app.mongo.db.close();
    });

    it('Should create a simple document', function (done) {
      request
        .post('/api/v1/tests')
        .type('application/json')
        .send({'test' : 'create'})
        .expect(201)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          assert.deepEqual(res.body, {'ok': 1});
          var location = res.header.location.split('/').slice(1);
          assert.equal(location[0], 'tests');
          assert.equal(location[1].length, 24);
          objectId = location[1];
          done();
        });
    });

    it('Should check that document exists', function (done) {
      request
        .get('/api/v1/tests/' + objectId)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          assert.deepEqual(res.body, {
            'test': 'create',
            'id': objectId
          });
          done();
        });
    });

    it('Should update a document', function (done) {
      request
        .put('/api/v1/tests/' + objectId)
        .type('application/json')
        .send({'test' : 'updated'})
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          assert.deepEqual(res.body, {'ok': 1});
          done();
        });
    });

    it('Should check that document is updated', function (done) {
      request
        .get('/api/v1/tests/' + objectId)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          assert.deepEqual(res.body, {
            'test': 'updated',
            'id': objectId
          });
          done();
        });
    });

    it('Should delete a document', function (done) {
      request
        .del('/api/v1/tests/' + objectId)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          assert.deepEqual(res.body, {'ok': 1});
          done();
        });
    });

    it('Should check that document is deleted', function (done) {
      request
        .get('/api/v1/tests/' + objectId)
        .expect(404)
        .end(function(){
          done();
        });
    });

  });
}
