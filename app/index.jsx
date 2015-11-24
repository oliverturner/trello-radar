// IMPORTANT: This needs to be first (before any other components)
// to get around CSS order randomness in webpack.
import './styles/base.scss'

import React from 'react'
import {render} from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'

import reducer from './reducers'
import metrics from './utils/metrics'

import Application from './components/application'
import radar from '../data/radar.json'

const data = {
  quadrants: radar.labels,
  horizons:  radar.lists,
  blips:     radar.cards
}

const m = metrics(data.quadrants.length, data.horizons.length)

const segments = data.quadrants
  .reduce((ret, quadrant, i) => {
    return ret.concat(data.horizons.map((horizon, j) => {
      const segBlips = data.blips.filter((b) =>
        b.idLabels[0] === quadrant.id && b.idList === horizon.id
      )

      return {
        id:     `${i}-${j}`,
        qIndex: i,
        hIndex: j,
        blips:  segBlips.map((sb) => sb.id)
      }
    }))
  }, [])

function setSegment (blip) {
  const segmentId = `${blip.quadrant}-${blip.horizon}`
  const segment   = segments.filter(({id}) => id === segmentId)[0]
  const keyNum    = segment.blips.length
  const keyIndex  = segment.blips.indexOf(blip.id)

  return Object.assign(blip, {horizon: segment.hIndex, quadrant: segment.qIndex, keyIndex, keyNum})
  //return Object.assign(blip, {keyIndex, keyNum})
}

const blips = data.blips.map(setSegment)

const store = createStore(reducer, {metrics: m, segments, blips})

render(
  <Provider store={store}>
    <Application/>
  </Provider>,
  document.getElementById('app')
)
