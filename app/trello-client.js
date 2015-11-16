function wrapper (window, opts) {
  let {key, token} = opts

  const version        = 1
  const apiEndpoint    = 'https://api.trello.com'
  const authEndpoint   = 'https://trello.com'
  const intentEndpoint = 'https://trello.com'

  const baseURL     = `${apiEndpoint}/${version}/`
  const location    = window.location
  const verbs       = ['GET', 'PUT', 'POST', 'DELETE']
  const collections = ['actions', 'cards', 'checklists', 'boards', 'lists', 'members', 'organizations', 'lists']

  let localStorage  = window.localStorage
  let storagePrefix = 'trello_'

  let readStorage = function () {
  }

  let writeStorage = function () {
  }

  if (localStorage) {
    readStorage = function (key) {
      return localStorage[storagePrefix + key]
    }

    writeStorage = function (key, value) {
      if (value === null) {
        delete localStorage[storagePrefix + key]
      }
      else {
        localStorage[storagePrefix + key] = value
      }
    }
  }

  function authorizeURL (args) {
    var baseArgs = {
      response_type: 'token',
      key:           key
    }

    return `${authEndpoint}/${version}/authorize?${serialise(Object.assign(baseArgs, args))}`
  }

  function parseRestArgs (path, params, success, error) {
    if (isFunction(params)) {
      error   = success
      success = params
      params  = {}
    }

    // Get rid of any leading /
    path = path.replace(/^\/*/, '')

    return [path, params, success, error]
  }

  function receiveMessage (event) {
    if (event.origin !== authEndpoint) {
      return
    }

    if (event.source) {
      event.source.close()
    }

    if (event.data && event.data.length > 4) {
      token = event.data
    }
    else {
      token = null
    }

    isReady('authorized', Trello.authorized())
  }

  function serialise (obj) {
    return Object.keys(obj).map((key) => key + '=' + encodeURIComponent(obj[key])).join('&')
  }

  window.addEventListener('message', receiveMessage, false)

  //-----------------------------------------------
  // Trello object
  //-----------------------------------------------
  const Trello = {
    version: function () {
      return version
    },

    token: function () {
      return token
    },

    setKey: function (newKey) {
      key = newKey
    },

    setToken: function (newToken) {
      token = newToken
    },

    authorized: function () {
      return typeof token !== 'undefined' && token !== null
    },

    deauthorize: function () {
      token = null
      writeStorage('token', token)
    },

    // Issue a REST call to the API
    //
    // .rest(method, path, params, success, error)
    // .rest(method, path, success, error)
    //
    // method - The HTTP method to use/simulate (e.g. GET, POST, PUT, DELETE)
    // path - The API path to use (e.g. 'members/me')
    // params - Optional.  A hash of values to include in the querystring/body (e.g. { filter: 'open', fields: 'name,desc' })
    // success - Function to call when the request succeeds
    // error - Function to call when the request fails
    rest: function (method, ...args) {
      const [path, params, success, error] = parseRestArgs(...args)

      let url       = '' + baseURL + path
      let payload   = {}
      let fetchOpts = {
        method: method
      }

      // Only include the key if it's been set to something truthy
      if (key) payload.key = key
      if (token) payload.token = token
      if (params) Object.assign(payload, params)

      if (method === 'GET') {
        url += '?'+serialise(payload)
      }
      else {
        fetchOpts.body = JSON.stringify(payload)
      }

      window.fetch(url, fetchOpts)
        .then(function (response) {
          return response.json()
        })
        .then(function (json) {
          success(json)
        })
        .catch(function (ex) {
          error(ex)
        })
    },

    // Request a token that will allow us to make API requests on a user's behalf
    //
    // opts =
    //   type         "redirect" or "popup"
    //   name         Name to display
    //   persist      Save the token to local storage?
    //   interactive  If false, don't redirect or popup, only use the stored token, if one exists
    //   scope        The permissions we're requesting
    //   expiration   When we want the requested token to expire ("1hour", "1day", "30days", "never")
    authorize: function (userOpts) {
      const opts = Object.assign({
        type:        'redirect',
        persist:     true,
        interactive: true,
        expiration:  '30days',
        scope:       {
          read:    true,
          write:   false,
          account: false
        }
      }, userOpts)

      const regexToken = /[&#]?token=([0-9a-f]{64})/

      function persistToken () {
        if (opts.persist && token) {
          return writeStorage('token', token)
        }
      }

      if (opts.persist) {
        if (!token) {
          token = readStorage('token')
        }
      }

      if (!token) {
        let found = regexToken.exec(location.hash)
        if (found && found.length) token = found[1]
      }

      if (this.authorized()) {
        persistToken()
        location.hash = location.hash.replace(regexToken, '')

        return typeof opts.success === 'function'
          ? opts.success()
          : void 0
      }

      if (!opts.interactive) {
        return typeof opts.error === 'function'
          ? opts.error()
          : void 0
      }

      const scope = Object.keys(opts.scope).filter((key) => opts.scope[key]).join(',')

      switch (opts.type) {
        case 'popup':
          return (function () {
            waitUntil('authorized', function (isAuthorized) {
              if (isAuthorized) {
                persistToken()
                return typeof opts.success === 'function'
                  ? opts.success()
                  : void 0
              }
              else {
                return typeof opts.error === 'function'
                  ? opts.error()
                  : void 0
              }
            })

            const width  = 420
            const height = 470
            const left   = window.screenX + (window.innerWidth - width) / 2
            const top    = window.screenY + (window.innerHeight - height) / 2
            const origin = /^[a-z]+:\/\/[^\/]*/.exec(location)[0]

            window.open(authorizeURL({
              return_url:      origin,
              callback_method: 'postMessage',
              scope:           scope,
              expiration:      opts.expiration,
              name:            opts.name
            }), 'trello', `width=${width},height=${height},left=${left},top=${top}`)
          })()

        default:
          window.location = authorizeURL({
            redirect_uri:    location.href,
            callback_method: 'fragment',
            scope:           scope,
            expiration:      opts.expiration,
            name:            opts.name
          })
      }
    },

    // Request that a card be created, using the provided name, description, and url.
    //
    // options =
    //   name - The name to use for the card
    //   desc - The description to use for the card (optional)
    //   url  - A url to attach to the card (optional)
    //
    // next = a method to be called once the card has been created.  The method
    // should take two arguments, an error and a card.  If next is not defined
    // then a promise that resolves to the card will be returned.
    addCard: function (options, next) {
      var baseArgs = {
        mode:   'popup',
        source: key || window.location.host
      }

      function getCard (callback) {
        const width  = 500
        const height = 600
        const left   = window.screenX + (window.outerWidth - width) / 2
        const top    = window.screenY + (window.outerHeight - height) / 2

        function returnUrl (e) {
          var data

          window.removeEventListener('message', returnUrl)

          try {
            data = JSON.parse(e.body)
            if (data.success) {
              return callback(null, data.card)
            }
            else {
              return callback(new Error(data.error))
            }
          }
          catch (err) {
            console.log(err)
          }
        }

        window.addEventListener('message', returnUrl, false)
        window.open(`${intentEndpoint}/add-card?${serialise(Object.assign(baseArgs, options))}`, 'trello', `width=${width},height=${height},left=${left},top=${top}`)
      }

      if (next != null) {
        return getCard(next)
      }
      else if (window.Promise) {
        return new Promise(function (resolve, reject) {
          return getCard(function (err, card) {
            if (err) {
              return reject(err)
            }
            else {
              return resolve(card)
            }
          })
        })
      }
      else {
        return getCard(function () {
        })
      }
    }
  }

  // Hook up some convenience methods for HTTP methods
  //
  // Trello.get(path, params, success, error)
  // Trello.put(path, params, success, error)
  // Trello.post(path, params, success, error)
  // Trello.delete(path, params, success, error)
  verbs.forEach((type) =>
    Trello[type.toLowerCase()] = function () {
      this.rest(type, ...arguments)
    }
  )

  // Provide another alias for Trello.delete, since delete is a keyword in javascript
  Trello.del = Trello.delete

  // Hook up convenience methods for the different collections
  // e.g. Trello.cards(id, params, success, error)
  collections.forEach((collection) =>
    Trello[collection] = {
      get: function (id, params, success, error) {
        Trello.get(`${ collection }/${ id }`, params, success, error)
      }
    }
  )

  // Export Trello
  //-----------------------------------------------
  window.Trello = Trello
}

let deferred = {}

let ready = {}

function waitUntil (name, fx) {
  if (ready[name]) {
    return fx(ready[name])
  }
  else {
    return (deferred[name] ? deferred[name] : deferred[name] = []).push(fx)
  }
}

function isReady (name, value) {
  var fx, fxs, i, len

  ready[name] = value

  if (deferred[name]) {
    fxs = deferred[name]
    delete deferred[name]

    for (i = 0, len = fxs.length; i < len; i++) {
      fx = fxs[i]
      fx(value)
    }
  }
}

function isFunction (val) {
  return typeof val === 'function'
}

export default wrapper
