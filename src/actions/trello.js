import qs from 'query-string'

import trello from '../../auth'

const endpoint    = `${trello.url}/boards/${trello.board}`
const credentials = qs.stringify(trello.credentials)

const types = ['cards', 'lists', 'labels']

const srcs = types.map((type) => `${endpoint}/${type}?${credentials}`)

const getSearchUrl = (term) => {
  const query = qs.stringify(Object.assign({}, trello.credentials, {
    card_fields: 'id',
    idBoards:    trello.idBoards,
    modelTypes:  'cards',
    partial:     true,
    cb:          new Date().toISOString(),
    query:       term
  }))

  return `${trello.url}/search?${query}`
}

// Build up an object with keys from `types`
const parseInitial = (data) => {
  return data.reduce((ret, val, index) => {
    return Object.assign(ret, {[types[index]]: val})
  }, {})
}

// Exports
//-----------------------------------------------
export const loadData = () => (dispatch) =>
  Promise.all(srcs.map((src) => {
    return window.fetch(src)
      .then((res) => res.json())
      .catch((err) => {
        throw err
      })
  }))
    .then((json) => {
      dispatch({type: 'DATA_LOADED', payload: parseInitial(json)})
    })

export const searchCards = (query) => (dispatch) =>
  window.fetch(getSearchUrl(query))
    .then((res) => res.json())
    .then((json) => dispatch({type: 'CARDS_FILTER_APPLY', payload: json}))
