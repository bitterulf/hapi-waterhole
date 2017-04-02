# hapi-waterhole

> gathering point to connect waterline models to rest endpoints via hapi

Example:
```js
server.register(
    [
        require('hapi-auth-basic'),
        register,
        {
            register: require('hapi-waterhole'),
            options: {
                adapters: {
                    disk: require('sails-disk')
                },
                connections: {
                    simple: { adapter: 'disk' }
                },
                models: [
                    {
                        identity: 'hippo',
                        connection: 'simple',
                        attributes: {
                            name: 'string'
                        }
                    }
                ],
                auth: {
                    find: 'simple',
                    create: 'simple',
                    update: 'simple',
                    delete: 'simple'
                }
            }
        }
    ]
, (err) => {
...
```
