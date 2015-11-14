// IMPORTANT: This needs to be first (before any other components)
// to get around CSS order randomness in webpack.
import './styles/base.scss'

import React from 'react'
import {render} from 'react-dom'

import Application from './components/application'
import wrapper from './trello-client'

const results = {}

function onListSuccess (data) {
  results.lists = data
}

function onCardSuccess (data) {
  results.cards = data

  const last = results.cards.pop().idList
  console.log(last)
  console.log(results.lists.filter((list) => list.id === last))
  // console.log(results.lists[])
}

function onDataError () {
  // console.log(arguments)
}

function onAuthSuccess () {
  console.log('Successful authentication')

  window.Trello.get('/boards/uD51usV2/lists', onListSuccess, onDataError)
  window.Trello.get('/boards/uD51usV2/cards', onCardSuccess, onDataError)
}

function onAuthFailure (err) {
  console.log('Failed authentication', err)
}

wrapper(window, {key: '27674ab7f9665fde168a16611001e771'})

window.Trello.authorize({
  type:       'popup',
  name:       'Tech Radar',
  expiration: 'never',
  success:    onAuthSuccess,
  error:      onAuthFailure
})

render(<Application />, document.getElementById('app'))
