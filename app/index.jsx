// IMPORTANT: This needs to be first (before any other components)
// to get around CSS order randomness in webpack.
import './styles/base.scss'

import React from 'react'
import {render} from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'
import fetch from 'isomorphic-fetch'
import {Promise} from 'es6-promise'
import qs from 'qs'

import reducer from './reducers'
import metrics from './utils/metrics'

import Segment from './models/segment'

import Application from './components/application'

// create a store that has redux-thunk middleware enabled
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)

const store = createStoreWithMiddleware(reducer, {
  horizonSelected:   null,
  cardSelected:      null,
  cardHovered:       null,
  cardsFiltered:     [],
  textPathSupported: navigator.userAgent.toLowerCase().indexOf('firefox') === -1
})

// Load data
//-----------------------------------------------
const types       = ['cards', 'lists', 'labels']
const endPoint    = 'https://api.trello.com/1/'
const srcs        = types.map((type) => `${endPoint}/boards/uD51usV2/${type}?`)
const credentials = {
  key:   '27674ab7f9665fde168a16611001e771',
  token: 'fb2811ea5b95bdbf70dd2a73d5243c9f846a422e31c12a1dd9489b13a29818c0'
}

const searchQS = (query) => {
  const str = qs.stringify(Object.assign({}, credentials, {
    card_fields: 'name,desc',
    idBoards:    '56431976063102e6178fa3d4',
    modelTypes:  'cards',
    cb:          new Date().toISOString(),
    query:       query
  }))

  return `${endPoint}/search?${str}`
}

//fetch(searchQS('PHP')).then((res) => res.json()).then((res) => console.log(res))

// Start
//-----------------------------------------------
const onError = (err) => {
  console.log(err)
}

const loadData = () => {
  return function () {
    return Promise
      .all(srcs.map((src) => fetch(src + qs.stringify(credentials)).then((res) => res.json())))
      .then((values) =>
        values.reduce((ret, val, index) => {
          ret[types[index]] = val
          return ret
        }, {})
      )
  }
}

// Let's go disco!
//-----------------------------------------------
store.dispatch(loadData())
  .then((data) => store.dispatch({type: 'DATA_LOADED', payload: data}))
  .then(() => store.dispatch({type: 'DATA_DERIVED'}))
  .then(() => {
    render(
      <Provider store={store}>
        <Application/>
      </Provider>,
      document.getElementById('app')
    )
  })
  .catch(onError)
