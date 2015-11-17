// IMPORTANT: This needs to be first (before any other components)
// to get around CSS order randomness in webpack.
import './styles/base.scss'

import React from 'react'
import {render} from 'react-dom'

import Application from './components/application'
import wrapper from './trello-client'
import Radar from './radar'
import radarData from './data/radar.json'

const results = {}

// Data
//-----------------------------------------------
function onListSuccess (data) {
  results.lists = data
}

function onCardSuccess (data) {
  results.cards = data

  console.log('onCardSuccess')
  console.log('-- cards', results.cards)
  console.log('---- labels', results.cards.reduce(function (ret, card) {
    card.labels.forEach(function (label) {
      if (ret.indexOf(label.name) < 0) ret.push(label.name)
    })
    return ret
  }, []).sort())
  console.log('-- lists', results.lists)
}

function onDataError (err) {
  console.log('onDataError', err)
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

const chart = new Radar('#app', {
  horizons:  ['discover', 'assess', 'learn', 'use'],
  quadrants: ['languages', 'frameworks', 'tools', 'big data', 'statistics']
})

chart.draw(radarData)

window.Trello.authorize({
  type:       'popup',
  name:       'Tech Radar',
  expiration: 'never',
  success:    onAuthSuccess,
  error:      onAuthFailure
})
