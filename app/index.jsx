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

import Card from './models/card'
import Segment from './models/segment'

import Application from './components/application'

// Load data
//-----------------------------------------------
const types      = ['cards', 'lists', 'labels']
const endPoint   = 'https://api.trello.com/1/'
const srcs       = types.map((type) => `${endPoint}/boards/uD51usV2/${type}?`)
const cedentials = '&key=27674ab7f9665fde168a16611001e771&token=fb2811ea5b95bdbf70dd2a73d5243c9f846a422e31c12a1dd9489b13a29818c0'

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
    horizons:  results.lists.slice(0, -1).map(({id, name}) => ({id, name: name.split(' ')[0]})),
    cards:     results.cards.map(c => new Card(c)),

    horizonSelected:   null,
    cardSelected:      null,
    cardHovered:       null,
    cardsFiltered:     [],
    textPathSupported: navigator.userAgent.toLowerCase().indexOf('firefox') === -1
  }

  // Derived data
  //-----------------------------------------------
  // Create a singleton source of metrics
  metrics.init(data.quadrants.length, data.horizons.length)

  // Generate segments from quadrants and horizons
  data.segments = data.quadrants.reduce((qRet, quadrant, i) => {
    // store a reference to the outermost section: used to apply curved quadrantLabel
    quadrant.labelArcId = deriveKey(quadrant, data.horizons.slice().pop())

    const qh = data.horizons.reduce((hRet, horizon, j) => {
      const key = deriveKey(quadrant, horizon)

      hRet[key] = new Segment({
        id:         key,
        quadrantId: quadrant.id,
        horizonId:  horizon.id,
        qIndex:     i,
        hIndex:     j,
        cardIds:    data.cards
                      .filter((c) => c.idLabel === quadrant.id && c.idList === horizon.id)
                      .map(({id}) => id)
      })

      return hRet
    }, {})

    return Object.assign(qRet, qh)
  }, {})

  // Remove cards that lack a corresponding segment (e.g. no label applied)
  data.cards = data.cards.reduce((ret, card) => {
    const segment = data.segments[card.segmentKey]

    if (segment) {
      ret.push(card.setSegment(segment.getCardDetails(card.id)))
    }

    return ret
  }, [])

  // Cache references to cards within this quadrant
  data.quadrants = data.quadrants.map((q) =>
    Object.assign({}, q, {
      cards: data.cards.filter((c) => c.idLabel === q.id)
    })
  )

  const store = createStore(reducer, data)

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
srcs.push(`${endPoint}/search?query=PHP&card_fields=name,idLabels,desc&modelTypes=cards&idBoards=56431976063102e6178fa3d4&cb=${new Date().toISOString()}`)

//var s = {
//  key:         '27674ab7f9665fde168a16611001e771',
//  token:       'fb2811ea5b95bdbf70dd2a73d5243c9f846a422e31c12a1dd9489b13a29818c0'
//  card_fields: 'name,desc',
//  idBoards:    '56431976063102e6178fa3d4',
//  modelTypes:  'cards',
//  query:       '',
//  cb:          new Date().toISOString(),
//}

Promise
  .all(srcs.map((src) => fetch(src + cedentials).then((res) => res.json())))
  .then((values) => {
    return values.reduce((ret, val, index) => {
      ret[types[index]] = val
      return ret
    }, {})
  })
  .then((results) => setTimeout(onSuccess.bind(null, results), 700))
  .catch(onError)

