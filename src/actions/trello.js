import fetch from 'isomorphic-fetch'
import {Promise} from 'bluebird'
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

const parseInitial = (data) =>
  data.reduce((ret, val, index) => {
    ret[types[index]] = val
    return ret
  }, {})

// Exports
//-----------------------------------------------
export const loadData = () => (dispatch) =>
  Promise
    .all(srcs.map((src) => fetch(src).then((res) => res.json())))
    .then((json) => dispatch({
      type:    'DATA_LOADED',
      payload: parseInitial(json)
    }))
    .then(() => dispatch({type: 'DATA_DERIVED'}))

export const searchCards = (query) => (dispatch) =>
  fetch(getSearchUrl(query))
    .then((res) => res.json())
    .then((json) => dispatch({type: 'CARDS_FILTER_APPLY', payload: json}))
