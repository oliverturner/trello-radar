// IMPORTANT: This needs to be first (before any other components)
// to get around CSS order randomness in webpack.
import './styles/base.scss'

import React from 'react'
import {render} from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import fetch from 'isomorphic-fetch'
import {Promise} from 'es6-promise'

import reducer from './reducers'
import metrics from './utils/metrics'

import Application from './components/application'
import BrowserCheck from './components/application/browser-check'

// Load data
//-----------------------------------------------
const types = ['cards', 'lists', 'labels']
const srcs  = types.map((type) =>
  `https://api.trello.com/1/boards/uD51usV2/${type}` +
  '?key=27674ab7f9665fde168a16611001e771' +
  '&token=fb2811ea5b95bdbf70dd2a73d5243c9f846a422e31c12a1dd9489b13a29818c0'
)

const deriveKey = (q, h) => `${q.id}-${h.id}`

/**
 * Called on successful retrieval of data
 * @param {Object} results
 * @param {Array.<Object>} results.cards
 * @param {Array.<Object>} results.labels
 * @param {Array.<Object>} results.lists
 */
const onSuccess = (results) => {
  const data = {
    quadrants: results.labels.map(({id, name}) => ({id, name})),

    horizons: results.lists.slice(0, -1).map(({id, name}) => {
      return {id, name: name.split(' - ')[0]}
    }),

    cards: results.cards.map(({id, idLabels, idList, name, desc}) =>
      ({id, idLabels, idList, name, desc})
    ),

    cardSelected: null,
    cardHovered:  null
  }

  metrics.init(data.quadrants.length, data.horizons.length)

  const segments = data.quadrants.reduce((qRet, quadrant, i) => {
    quadrant.labelArcId = deriveKey(quadrant, data.horizons.slice().pop())

    const qh = data.horizons.reduce((hRet, horizon, j) => {
      const key = deriveKey(quadrant, horizon)

      hRet[key] = {
        id:         key,
        quadrantId: quadrant.id,
        qIndex:     i,
        hIndex:     j,
        fill:       metrics.getSegmentFill(i, j),
        d:          metrics.getSegmentArc(i, j)(),
        cardIds:    data.cards
                      .filter((c) => c.idLabels[0] === quadrant.id && c.idList === horizon.id)
                      .map(({id}) => id)
      }

      return hRet
    }, {})

    return Object.assign(qRet, qh)
  }, {})

  data.cards.map((card) => {
    const k = `${card.idLabels[0]}-${card.idList}`
    const s = segments[k]

    if (!s) return Object.assign(card, {displayed: false})

    const sCount = s.cardIds ? s.cardIds.length : 0
    const sIndex = s.cardIds ? s.cardIds.indexOf(card.id) : 0

    const {quadrantId, qIndex, hIndex, fill} = s

    return Object.assign(card, {sIndex, sCount, quadrantId, qIndex, hIndex, fill, displayed: true})
  })

  data.quadrants.map((q) => {
    const cards = data.cards.filter((c) => c.idLabels[0] === q.id)

    return Object.assign(q, {cards})
  })

  const store = createStore(reducer, {segments, ...data})

  console.log('state', store.getState())

  render(
    <Provider store={store}>
      <Application/>
    </Provider>,
    document.getElementById('app')
  )
}

const onError = (err) => {
  console.log(err)
}

// Let's go disco!
//-----------------------------------------------
var browser = navigator.userAgent.toLowerCase();

if (browser.indexOf('firefox') > -1) {
  render(<BrowserCheck />, document.getElementById('app'))
}
else {
  Promise
    .all(srcs.map((src) => fetch(src).then((res) => res.json())))
    .then((values) => {
      return values.reduce((ret, val, index) => {
        ret[types[index]] = val
        return ret
      }, {})
    })
    .then(onSuccess)
    .catch(onError)
}

