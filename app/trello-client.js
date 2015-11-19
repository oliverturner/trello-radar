import Trello from './trello'

function wrapper (window, opts) {
  let {appKey, appToken} = opts

  const verbs       = ['GET', 'PUT', 'POST', 'DELETE']
  const collections = ['actions', 'cards', 'checklists', 'boards', 'lists', 'members', 'organizations', 'lists']

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

export default wrapper
