// IMPORTANT: This needs to be first (before any other components)
// to get around CSS order randomness in webpack.
import './styles/base.scss'

// Some ES6+ features require the babel polyfill
// More info here: https://babeljs.io/docs/usage/polyfill/
// Uncomment the following line to enable the polyfill
// require("babel/polyfill")

import React from 'react'
import {render} from 'react-dom'

import Application from './components/application'

const results = {}

function onListSuccess (data) {
  results.lists = data
}

function onCardSuccess (data) {
  results.cards = data

  const last = results.cards.pop().idList
  console.log(last)
  console.log(results.lists.filter((list) => list.id === last))
  //console.log(results.lists[])
}

function onDataError () {
  console.log(arguments)
}

function onAuthSuccess () {
  console.log('Successful authentication')

  window.Trello.get('/boards/uD51usV2/lists', onListSuccess, onDataError)
  window.Trello.get('/boards/uD51usV2/cards', onCardSuccess, onDataError)
}

function onAuthFailure () {
  console.log('Failed authentication')
}

window.Trello.authorize({
  type:       'popup',
  name:       'Tech Radar',
  expiration: 'never',
  success:    onAuthSuccess,
  error:      onAuthFailure
})

render(<Application />, document.getElementById('app'))
