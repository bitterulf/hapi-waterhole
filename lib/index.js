'use strict';

const Dogwater = require('dogwater');
const _ = require('lodash');

const extractPopulate = function (model) {
    const populate = [];
    _.keys(model.attributes).forEach(function (key) {
        if (model.attributes[key].collection) {
            populate.push(key);
        }
    });

    return populate;
};

const attachAPI = function (server, model, auth) {
    const name = model.identity;
    const populate = extractPopulate(model);

    if (!auth) {
        auth = {};
    }

    server.route({
        method: 'get',
        path: '/' + name + '/{id}',
        config: {
            auth: auth.find,
            handler: function (request, reply) {
                const collection = request.collections()[name];
                reply(collection.findOne(request.params.id));
            }
        }
    });

    server.route({
        method: 'post',
        path: '/' + name,
        config: {
            auth: auth.create,
            handler: function (request, reply) {
                const collection = request.collections()[name];
                reply(collection.create(request.payload));
            }
        }
    });

    server.route({
        method: 'patch',
        path: '/' + name + '/{id}',
        config: {
            auth: auth.update,
            handler: function (request, reply) {
                const collection = request.collections()[name];
                reply(collection.update({
                    id: request.params.id
                }, request.payload));
            }
        }
    });

    server.route({
        method: 'delete',
        path: '/' + name + '/{id}',
        config: {
            auth: auth.delete,
            handler: function (request, reply) {
                const collection = request.collections()[name];
                reply(collection.destroy({
                    id: request.params.id
                }));
            }
        }
    });

    server.route({
        method: 'get',
        path: '/' + name,
        config: {
            auth: auth.find,
            handler: function (request, reply) {
                const collection = request.collections()[name];

                reply(collection.find(request.query).populate(populate));
            }
        }
    });
};

exports.register = function (plugin, options, pluginNext) {
    plugin.register({
        register: Dogwater,
        options: {
            adapters: options.adapters,
            connections: options.connections
        }
    }, (err) => {
        if (err) {
            return pluginNext(err);
        }

        options.models.forEach(function (model) {
            plugin.dogwater(model);

            attachAPI(plugin, model, options.auth);
        });

        return pluginNext();
    });
};

exports.register.attributes = {
    pkg: require('../package.json')
};
