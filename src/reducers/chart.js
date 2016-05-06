import {Map, fromJS} from 'immutable'

import metrics from '../utils/metrics'

// Helpers
//-----------------------------------------------
const deriveKey = (q, h) => {
  return `${q.id}-${h.id}`
}

const parseData = (results) => {
  const quadrants = results.labels.map(({id, name}) => ({id, name}))

  // Prevent "deprecated" items showing up on radar
  // But display in navigation bar
  const horizons = results.lists
    .slice(0, -1)
    .map(({id, name}) =>
      ({id, name: name.split(' ')[0]}))

  const cards = results.cards.map((c) => {
    const quadrantId = c.idLabels[0]
    const horizonId  = c.idList

    return {
      id:         c.id,
      name:       c.name,
      desc:       c.desc,
      quadrantId: quadrantId,
      horizonId:  horizonId,
      segmentKey: `${quadrantId}-${horizonId}`,
      displayed:  true
    }
  })

  metrics.init(quadrants.length, horizons.length)

  return {loaded: true, quadrants, horizons, cards}
}

const deriveData = (data) => {
  const segments = createSegments(data)
  const cards    = addSegmentData(data.cards, segments)

  // hOuter: a reference to the outermost horizon: used as curved quadrantLabel path
  const hOuter    = data.horizons[data.horizons.length - 1]
  const quadrants = data.quadrants.reduce((ret, q) => {
    ret.push(Object.assign({}, q, {labelArcId: deriveKey(q, hOuter)}))

    return ret
  }, [])

  return Object.assign({}, data, {
    segments:     segments,
    quadrants:    quadrants,
    cards:        cards,
    segmentCards: filterSegmentCards(cards)
  })
}

/**
 * Generate segments from quadrants and horizons
 * Returns a hash keyed by [quadrantId-horizonId]
 *
 * @param quadrants
 * @param horizons
 * @param cards
 * @returns {*|{}}
 */
const createSegments = ({quadrants, horizons, cards}) => {
  const segments = quadrants.reduce((qRet, quadrant, i) => {
    const qh = horizons.reduce((hRet, horizon, j) => {
      const key     = deriveKey(quadrant, horizon)
      const qIndex  = i
      const hIndex  = j
      const cardIds = cards
        .filter((c) => c.quadrantId === quadrant.id && c.horizonId === horizon.id)
        .map((c) => c.id)

      hRet[key] = {
        id:         key,
        quadrantId: quadrant.id,
        horizonId:  horizon.id,
        qIndex:     qIndex,
        hIndex:     hIndex,
        fill:       metrics.getSegmentFill(qIndex, hIndex),
        d:          metrics.getSegmentArc(qIndex, hIndex),
        cardIds:    cardIds,
        sCount:     cardIds.length
      }

      return hRet
    }, {})

    return Object.assign(qRet, qh)
  }, {})

  return segments
}

const addSegmentData = (cards, segments) => {
  return cards.map((card) => {
    const segment = segments[card.segmentKey]

    if (segment) {
      const sIndex = segment.cardIds.indexOf(card.id)
      return Object.assign({}, card, {
        sIndex: sIndex,
        sCount: segment.sCount,
        qIndex: segment.qIndex,
        hIndex: segment.hIndex,
        fill:   segment.fill
      })
    }

    return card
  })
}

/**
 * Remove cards that lack a corresponding segment. This occurs when...
 * 1) No label is applied on Trello source
 * 2) Card is in the "deprecated" list
 *
 * @param cards
 * @param segments
 */
const filterSegmentCards = (cards, segments) =>
  cards.reduce((ret, card) => {
    if (card.sIndex >= 0) ret.push(card)

    return ret
  }, [])

// Reducers
//-----------------------------------------------
const initialState = fromJS({
  loaded:       false,
  query:        '',
  quadrants:    [],
  horizons:     [],
  segments:     [],
  cards:        [],
  segmentCards: []
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'DATA_LOADED':
      return state.merge(deriveData(parseData(action.payload)))

    case 'CARDS_FILTER_RESET':
      return state.merge({
        query:        '',
        cards:        state.get('cards').map((c) => c.set('displayed', true)),
        segmentCards: state.get('segmentCards').map((c) => c.set('displayed', true))
      })

    case 'CARDS_FILTER_UPDATE':
      return state.set('query', action.payload.query)

    case 'CARDS_FILTER_APPLY':
      const res         = action.payload.cards.map((r) => r.id)
      const applyFilter = (c) => c.set('displayed', (res.indexOf(c.get('id')) > -1))

      return state.merge({
        cards:        state.get('cards').map(applyFilter),
        segmentCards: state.get('segmentCards').map(applyFilter)
      })

    default:
      return state
  }
}

export default reducer
