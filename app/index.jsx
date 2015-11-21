// IMPORTANT: This needs to be first (before any other components)
// to get around CSS order randomness in webpack.
import './styles/base.scss'

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'

import Application from './components/application'
//import Radar from './radar'
import data from '../data/radar.json'

// Chart
//-----------------------------------------------
const axes = {
  horizons:  ['discover', 'assess', 'learn', 'use'],
  quadrants: ['languages', 'frameworks', 'tools', 'big data', 'statistics']
}

//const chart = new Radar('#app', axes)
//
//chart.draw(data)

// React
//-----------------------------------------------
import {createStore} from 'redux'
import reducer from './reducers'
import metrics from './utils/metrics'

const m         = metrics(axes.quadrants.length, axes.horizons.length)
const quadrants = axes.quadrants.reduce((ret, q, i) => {
  for (let j = 0; j < m.horizonNum; j++) {
    ret.push({
      outerRadius: (j + m.innerRad + 1) / (m.horizonNum + m.innerRad),
      innerRadius: (j + m.innerRad) / (m.horizonNum + m.innerRad),
      index:       i,
      quadrant:    i,
      horizon:     j,
      name:        q
    })
  }

  return ret
}, [])

const store = createStore(reducer, {metrics: m, quadrants, axes, data})

render(
  <Provider store={store}>
    <Application/>
  </Provider>,
  document.getElementById('radar')
)
