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
import blips from '../data/radar.json'

const data = {
  horizons:  ['discover', 'assess', 'learn', 'use'],
  quadrants: ['languages', 'frameworks', 'tools', 'big data', 'statistics'],
  blips:     blips
}

const m = metrics(data.quadrants.length, data.horizons.length)
const w = m.horizonNum + m.innerRad
const s = data.quadrants
  .reduce((ret, quadrant, i) => {
    return ret.concat(data.horizons.map((horizon, j) => {
      const segBlips = data.blips.filter((b) => b.quadrant === i && b.horizon === j)

      return {
        id:          `${i}-${j}`,
        name:        quadrant,
        outerRadius: (m.innerRad + j + 1) / w,
        innerRadius: (m.innerRad + j) / w,
        quadrant:    i,
        horizon:     j,
        blips:       segBlips.map((sb) => sb.id)
      }
    }))
  }, [])

function setSegment (blip) {
  const segmentId = `${blip.quadrant}-${blip.horizon}`
  const segment   = s.filter((seg) => seg.id === segmentId)[0]
  const keyNum    = segment.blips.length
  const keyIndex  = segment.blips.indexOf(blip.id)

  return Object.assign(blip, {segment, keyIndex, keyNum})
}

const b = data.blips.map(setSegment)

const store = createStore(reducer, {metrics: m, segments: s, blips: b})

render(
  <Provider store={store}>
    <Application/>
  </Provider>,
  document.getElementById('app')
)
