function serialise (obj, separator = '&') {
  return Object.keys(obj)
    .map((key) => `${key}=${encodeURIComponent(obj[key])}`)
    .join(separator)
}

function isFunction (val) {
  return typeof val === 'function'
}

function waitUntil (name, fx) {
  if (ready[name]) {
    return fx(ready[name])
  }
  else {
    return (deferred[name] ? deferred[name] : deferred[name] = []).push(fx)
  }
}

let ready = {}

let deferred = {}

let window = {
  fetch:   () => null,
  screenX: 0,
  screenY: 0
}

class Trello {
  static storagePrefix = 'trello_'
  static endpoints     = {
    api:  'https://api.trello.com',
    auth: 'https://trello.com'
  }

  constructor (win, opts) {
    window        = win
    this.baseURL  = `${Trello.endpoints.api}/${opts.version}/`
    this.authURL  = `${Trello.endpoints.auth}/${opts.version}/authorize/`
    this.appKey   = null
    this.appToken = null

    window.addEventListener('message', this.receiveMessage, false)
  }

  authorized () {
    return typeof this.appToken !== 'undefined' && this.appToken !== null
  }

  deauthorize () {
    this.appToken = null
    this.writeStorage('token', this.appToken)
  }

  readStorage (key) {
    return window.localStorage[Trello.storagePrefix + key]
  }

  writeStorage (key, value) {
    if (value) {
      window.localStorage[Trello.storagePrefix + key] = value
    }
    else {
      delete window.localStorage[Trello.storagePrefix + key]
    }
  }

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
  get (...args) {
    const [path, params, success, error] = this._parseRestArgs(...args)

    let url     = this.baseURL + path
    let payload = {}

    // Only include the key if it's been set to something truthy
    if (this.appKey)   payload.key = this.appKey
    if (this.appToken) payload.token = this.appToken
    if (params)        Object.assign(payload, params)

    url += '?' + serialise(payload)

    window.fetch(url)
      .then((response) => response.json())
      .then((json) => success(json))
      .catch((ex) => error(ex))
  }

  // Request a token that will allow us to make API requests on a user's behalf
  //
  // opts =
  //   type         "redirect" or "popup"
  //   name         Name to display
  //   persist      Save the token to local storage?
  //   interactive  If false, don't redirect or popup, only use the stored token, if one exists
  //   scope        The permissions we're requesting
  //   expiration   When we want the requested token to expire ("1hour", "1day", "30days", "never")
  authorize (userOpts) {
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

    const persistToken = () => {
      if (opts.persist && this.appToken) {
        return this.writeStorage('token', this.appToken)
      }
    }

    if (opts.persist) {
      if (!this.appToken) {
        this.appToken = readStorage('token')
      }
    }

    if (!this.appToken) {
      let found = regexToken.exec(window.location.hash)
      if (found && found.length) this.appToken = found[1]
    }

    if (this.authorized()) {
      persistToken()
      window.location.hash = window.location.hash.replace(regexToken, '')

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
          const origin = /^[a-z]+:\/\/[^\/]*/.exec(window.location)[0]

          window.open(this._authorizeURL({
            return_url:      origin,
            callback_method: 'postMessage',
            scope:           scope,
            expiration:      opts.expiration,
            name:            opts.name
          }), 'trello', serialise({width, height, left, top}, ','))
        })()

      default:
        window.location = this._authorizeURL({
          redirect_uri:    window.location.href,
          callback_method: 'fragment',
          scope:           scope,
          expiration:      opts.expiration,
          name:            opts.name
        })
    }
  }

  receiveMessage (event) {
    if (event.origin !== Trello.endpoints.auth) {
      return
    }

    if (event.source) {
      event.source.close()
    }

    if (event.data && event.data.length > 4) {
      this.appToken = event.data
    }
    else {
      this.appToken = null
    }

    this.isReady('authorized', this.authorized())
  }

  // Private utility methods
  //-----------------------------------------------
  _parseRestArgs (path, params, success, error) {
    if (isFunction(params)) {
      error   = success
      success = params
      params  = {}
    }

    // Get rid of any leading /
    path = path.replace(/^\/*/, '')

    return [path, params, success, error]
  }

  _authorizeURL (args) {
    let baseArgs = {
      response_type: 'token',
      key:           this.appKey
    }

    return `${this.authURL}?${serialise(Object.assign(baseArgs, args))}`
  }
}

export default Trello
