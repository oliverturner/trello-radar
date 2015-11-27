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

const json = JSON.parse(document.getElementById('radar-data').innerHTML)
const data = {
  quadrants:    json.labels,
  horizons:     json.lists,
  cards:        json.cards,
  cardSelected: null,
  cardHovered:  null
}

metrics.init(data.quadrants.length, data.horizons.length)

// TODO: move these into the reducer
const segments = data.quadrants
  .reduce((qRet, quadrant, i) => {
    const qh = data.horizons.reduce((hRet, horizon, j) => {
      const key = `${quadrant.id}-${horizon.id}`

      hRet[key] = {
        qIndex:  i,
        hIndex:  j,
        fill:    metrics.getSegmentFill(i, j),
        arcFn:   metrics.getSegmentArc(i, j),
        cardIds: data.cards
                   .filter((b) => b.idLabels[0] === quadrant.id && b.idList === horizon.id)
                   .map(({id}) => id)
      }

      return hRet
    }, {})

    return Object.assign(qRet, qh)
  }, {})

data.cards.map((card) => {
  const k      = `${card.idLabels[0]}-${card.idList}`
  const s      = segments[k]
  const sCount = s.cardIds.length
  const sIndex = s.cardIds.indexOf(card.id)

  const {qIndex, hIndex, fill} = s

  return Object.assign(card, {sIndex, sCount, qIndex, hIndex, fill})
})

data.quadrants.map((q) => {
  const cards = data.cards.filter((c) => c.idLabels[0] === q.id)

  return Object.assign(q, {cards})
})

const store = createStore(reducer, {segments, ...data})

render(
  <Provider store={store}>
    <Application/>
  </Provider>,
  document.getElementById('app')
)
