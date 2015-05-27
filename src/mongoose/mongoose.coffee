debug = require('debug')('rupert:mongo:mongoose')
mongoose = require('mongoose-q')(require('mongoose'), {spread: true})
restify = require('express-restify-mongoose').serve

module.exports = (app, config)->
  conf = app.mongo.configuration
  opts = {
    prefix: conf.prefix
    version: conf.version
    strict: yes
    plural: true # Backwards, see docs.
    lowercase: yes
  }

  debug(conf)

  new Promise (resolve, reject)->
    debug("Creating a connection to mongo")
    mongoose.createConnection conf.host, conf.database, conf.port, conf, ->
      debug('Mongo is connected, continuing app.')
      resolve(mongoose)

    mongoose.connection.on 'error', (err)->
      # logger.error 'connection error:', err
      debug(err)
      reject(err)

    if config.find 'mongo.schemas', false
      require('./mongoose-schemas')(config, mongoose).then (models)->
        models.forEach (model)->
          debug "Attaching model #{model.modelName}..."
          restify app, model, opts

    app.on 'stopping', ->
      debug('App is stopping, closing mongo connections.')
      mongoose.close()
