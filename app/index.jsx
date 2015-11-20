// IMPORTANT: This needs to be first (before any other components)
// to get around CSS order randomness in webpack.
import './styles/base.scss'

import React from 'react'
import {render} from 'react-dom'

import Application from './components/application'
import Radar from './radar'
import radarData from '../data/radar.json'

// Data
//-----------------------------------------------
function onDataError (err) {
  console.log('onDataError', err)
}

/**
 * Called on successful retrieval of data
 * @param {Object} results
 * @param {Array.<Object>} results.cards
 * @param {Array.<Object>} results.lists
 */
function onSuccess (results) {
  const cards = results.cards.map(({idLabels, idList, name}) => ({idLabels, idList, name}))
  const lists = results.lists.map(({id, name}) => {
    const n = name.toLowerCase().split(' - ')[0]
    return {id, n}
  })

  console.log('onCardSuccess')
  console.log('-- cards', cards)
  console.log('-- lists', lists)
}

const types = ['cards', 'lists']
const srcs  = types.map((type) =>
  `https://api.trello.com/1/boards/uD51usV2/${type}` +
  '?key=27674ab7f9665fde168a16611001e771' +
  '&token=fb2811ea5b95bdbf70dd2a73d5243c9f846a422e31c12a1dd9489b13a29818c0'
)

Promise
  .all(srcs.map((src) => window.fetch(src).then((res) => res.json())))
  .then((values) => {
    return values.reduce((ret, val, index) => {
      ret[types[index]] = val
      return ret
    }, {})
  })
  .then(onSuccess)
  .catch(onDataError)

// Chart
//-----------------------------------------------
const chart = new Radar('#app', {
  horizons:  ['discover', 'assess', 'learn', 'use'],
  quadrants: ['languages', 'frameworks', 'tools', 'big data', 'statistics']
})

chart.draw(radarData)

// React
//-----------------------------------------------

render(<Application/>, document.getElementById('radar'))
