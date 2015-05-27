glob = require 'glob'
logger = require('rupert/src/logger').log
Path = require 'path'
debug = require('debug')('tablettop:mongoose')
Q = require 'q'

module.exports = (config, mongoose)->
  root = config.find('root')
  patterns = config.find('mongoose.models', [])

  loadPattern = (modelPattern)->
    debug "Loading for '#{modelPattern}'..."
    files =
      try
        glob.sync("#{root}/#{modelPattern}").map (file)->
          './' + Path.relative __dirname, file
      catch e
        debug "Failed to find models for '#{modelPattern}'!"
        logger.debug e.stack
        []

    logger.silly "Modules globbing found ", files
    loadSchema = (file)->
      try
        debug "Found '#{file}'..."
        require(file)(mongoose, config)
      catch e
        debug "Failed to load model '#{file}'!"
        logger.debug e.stack
        Q.reject e
    Q.all files.map(loadSchema)

  Q.all(patterns.map(loadPattern)).then (models)->
    models.reduce(((a, b)->a.concat(b)), [])
