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
const q = data.quadrants.reduce((ret, q, i) => {
  return ret.concat(data.horizons.map((horizon, j) => {
    return {
      outerRadius: (m.innerRad + j + 1) / w,
      innerRadius: (m.innerRad + j) / w,
      quadrant:    i,
      horizon:     j,
      name:        q
    }
  }))
}, [])

const store = createStore(reducer, {metrics: m, quadrants: q, data})

render(
  <Provider store={store}>
    <Application/>
  </Provider>,
  document.getElementById('app')
)
