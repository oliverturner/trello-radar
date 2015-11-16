// IMPORTANT: This needs to be first (before any other components)
// to get around CSS order randomness in webpack.
import './styles/base.scss'

import React from 'react'
import {render} from 'react-dom'

import Application from './components/application'
import wrapper from './trello-client'
//import radar from './radar'

const results = {}

function onListSuccess (data) {
  results.lists = data
}

function onCardSuccess (data) {
  results.cards = data

  console.log('onCardSuccess')
  console.log('-- cards', results.cards)
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

window.Trello.authorize({
  type:       'popup',
  name:       'Tech Radar',
  expiration: 'never',
  success:    onAuthSuccess,
  error:      onAuthFailure
})

render(<Application />, document.getElementById('app'))

// Radar
//-----------------------------------------------
//function entry (start, end, quadrant, position, positionAngle, direction, directionAngle) {
//  return {
//    start,          // start date that this entry applies for
//    end,            // end date for the entry
//    quadrant,       // the quadrant label
//    position,       // position is within the total of horizons.
//    positionAngle,  // angles are fractions of pi/2 (ie of a quadrant)
//    direction,      // the learning end point with the total of horizons.
//    directionAngle  // angles are fractions of pi/2 (ie of a quadrant)
//  }
//}
//
//const chart = radar('#radar',
//  {
//    horizons:  ['discover', 'assess', 'learn', 'use'],
//    quadrants: ['languages', 'frameworks', 'tools', 'big data', 'statistics'],
//    width:     850,
//    height:    850,
//    data:      [
//      {
//        name:        'd3',
//        description: 'The d3 library for producing visualisation and data driven documents',
//        links:       ['http://d3js.org'],
//        history:     [
//          entry(new Date(2013, 1, 29), new Date(2013, 9, 29), 'frameworks', 0.8, 0.5, 0.6, 0.5),
//          entry(new Date(2013, 9, 29), null, 'frameworks', 0.6, 0.5, 0.2, 0.5)
//        ]
//      }
//    ]
//  })
//
//chart.draw()
