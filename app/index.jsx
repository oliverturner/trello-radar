// IMPORTANT: This needs to be first (before any other components)
// to get around CSS order randomness in webpack.
import './styles/base.scss'

import React from 'react'
import {render} from 'react-dom'

import Application from './components/application'
import wrapper from './trello-client'
import radar from './radar'

const results = {}

//render(<Application />, document.getElementById('app'))

// Radar
//-----------------------------------------------
function parseEntry (start, end, quadrant, position, positionAngle, direction, directionAngle = 0.5) {
  return {
    start,          // start date that this entry applies for
    end,            // end date for the entry
    quadrant,       // the quadrant label
    position,       // 0 - 1 start point within the total of horizons. Larger = worse.
    positionAngle,  // 0 - 1 horizontally within quadrant
    direction,      // 0 - 1 end point with the total of horizons. Larger = worse.
    directionAngle  // angles are fractions of pi/2 (ie of a quadrant)
  }
}

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

  const chart = radar('#app', {
    horizons:  ['discover', 'assess', 'learn', 'use'],
    quadrants: ['languages', 'frameworks', 'tools', 'big data', 'statistics'],
    //width:     window.innerWidth - 16,
    //height:    window.innerHeight - 16
  })

  chart.draw([
    {
      name:        'd3',
      description: 'The d3 library for producing visualisation and data driven documents',
      links:       ['http://d3js.org'],
      history:     [
        parseEntry(new Date(2013, 9, 29), null, 'frameworks', 0.1, 0.5, 0.9, 0.75)
      ]
    },
    {
      name:        'react',
      description: 'The d3 library for producing visualisation and data driven documents',
      links:       ['http://d3js.org'],
      history:     [
        parseEntry(new Date(2013, 9, 29), null, 'frameworks', 0.9, 0.5, 0.4)
      ]
    }
  ])
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

window.Trello.authorize({
  type:       'popup',
  name:       'Tech Radar',
  expiration: 'never',
  success:    onAuthSuccess,
  error:      onAuthFailure
})
