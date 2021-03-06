var test = require('tape')
var sinon = require('sinon')
var koop = require('koop/lib')
var createGithubModel = require('../model')
var repo = 'geodata'
var user = 'chelm'
var file = 'co-river-basin'

koop.config = {
  data_dir: __dirname + '/output/'
}

koop.log = new koop.Logger({})
koop.Cache = new koop.DataCache(koop)
koop.Cache.db = koop.LocalDB
koop.Cache.db.log = koop.log

var github = createGithubModel(koop)

test('model: setup', function (t) {
  sinon.stub(github.geohub, 'repo', function (options, callback) {
    callback(null, {})
  })

  sinon.stub(koop.Cache, 'get', function (type, id, options, callback) {
    callback(true)
  })

  sinon.stub(koop.Cache, 'insert', function (type, id, geojson, layer, callback) {
    callback(null, true)
  })

  t.end()
})

test('model: caching a file from github', function (t) {
  github.find({
    user: user,
    repo: repo,
    file: file,
    query: null
  }, function (err, data) {
    t.error(err, 'does not error')
    t.ok(koop.Cache.get.called, 'called get')
    t.ok(koop.Cache.insert.called, 'called insert')
    t.ok(github.geohub.repo.called, 'called geohub.repo')
    t.end()
  })
})

test('model: teardown', function (t) {
  koop.Cache.get.restore()
  koop.Cache.insert.restore()
  github.geohub.repo.restore()
  t.end()
})
