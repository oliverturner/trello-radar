// IMPORTANT: This needs to be first (before any other components)
// to get around CSS order randomness in webpack.
import './styles/base.scss'

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'

import Application from './components/application'
import Radar from './radar'
import data from '../data/radar.json'

// Chart
//-----------------------------------------------
const axes = {
  horizons:  ['discover', 'assess', 'learn', 'use'],
  quadrants: ['languages', 'frameworks', 'tools', 'big data', 'statistics']
}

const chart = new Radar('#app', axes)

chart.draw(data)

// React
//-----------------------------------------------
import {createStore} from 'redux'
import reducer from './reducers'
import metrics from './utils/metrics'

const m = metrics(axes.quadrants.length, axes.horizons.length)
let store = createStore(reducer, {m, ...axes, data})

render(
  <Provider store={store}>
    <Application/>
  </Provider>,
  document.getElementById('radar')
)
