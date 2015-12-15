import fetch from 'isomorphic-fetch'
import {Promise} from 'es6-promise'
import qs from 'qs'

const endPoint = 'https://api.trello.com/1/'

const credentials = {
  key:   '27674ab7f9665fde168a16611001e771',
  token: 'fb2811ea5b95bdbf70dd2a73d5243c9f846a422e31c12a1dd9489b13a29818c0'
}

const types = ['cards', 'lists', 'labels']

const srcs = types.map((type) => `${endPoint}/boards/uD51usV2/${type}?${qs.stringify(credentials)}`)

const getSearchQS = (query) => {
  const str = qs.stringify(Object.assign({}, credentials, {
    card_fields: 'id',
    idBoards:    '56431976063102e6178fa3d4',
    modelTypes:  'cards',
    partial:     true,
    cb:          new Date().toISOString(),
    query:       query
  }))

  return `${endPoint}/search?${str}`
}

// Exports
//-----------------------------------------------
export const loadData = () => (dispatch) =>
  Promise
    .all(srcs.map((src) => fetch(src).then((res) => res.json())))
    .then((values) =>
      values.reduce((ret, val, index) => {
        ret[types[index]] = val
        return ret
      }, {})
    )
    .then((data) => dispatch({type: 'DATA_LOADED', payload: data}))
    .then(() => dispatch({type: 'DATA_DERIVED'}))

export const searchCards = (query) => (dispatch) => {
  if (query.length === 0) {
    return dispatch({type: 'CARDS_FILTER_RESET'})
  }

  if (query.length < 2) {
    return
  }

  return fetch(getSearchQS(query))
    .then((res) => res.json())
    .then((json) => dispatch({type: 'CARDS_FILTER_APPLY', payload: json}))
}
