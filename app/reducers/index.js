import Card from '../models/card'
import Segment from '../models/segment'

import metrics from '../utils/metrics'

// Helpers
//-----------------------------------------------
const deriveKey = (q, h) => `${q.id}-${h.id}`

const parseData = (results) => {
  const data = {
    quadrants: results.labels.map(({id, name}) => ({id, name})),
    horizons:  results.lists.slice(0, -1).map(({id, name}) => ({id, name: name.split(' ')[0]})),
    cards:     results.cards.map(c => new Card(c))
  }

  metrics.init(data.quadrants.length, data.horizons.length)

  return data
}

// Generate segments from quadrants and horizons
const createSegments = ({quadrants, horizons, cards}) =>
  quadrants.reduce((qRet, quadrant, i) => {
    // store a reference to the outermost section: used to apply curved quadrantLabel
    quadrant.labelArcId = deriveKey(quadrant, horizons.slice().pop())

    const qh = horizons.reduce((hRet, horizon, j) => {
      const key = deriveKey(quadrant, horizon)

      hRet[key] = new Segment({
        id:         key,
        quadrantId: quadrant.id,
        horizonId:  horizon.id,
        qIndex:     i,
        hIndex:     j,
        cardIds:    cards
                      .filter((c) => c.idLabel === quadrant.id && c.idList === horizon.id)
                      .map(({id}) => id)
      })

      return hRet
    }, {})

    return Object.assign(qRet, qh)
  }, {})

// Remove cards that lack a corresponding segment (e.g. no label applied)
const filterSegmentCards = (cards, segments) =>
  cards.reduce((ret, card) => {
    const segment = segments[card.segmentKey]

    if (segment) {
      ret.push(card.setSegment(segment.getCardDetails(card.id)))
    }

    return ret
  }, [])

// Cache references to cards within this quadrant
const cacheQuadrantCards = ({quadrants, cards}) =>
  quadrants.map((q) =>
    Object.assign({}, q, {
      cards: cards.filter((c) => c.idLabel === q.id)
    })
  )

const deriveData = (data) => {
  const segments = createSegments(data)

  return {
    segments,
    cards:     filterSegmentCards(data.cards, segments),
    quadrants: cacheQuadrantCards(data)
  }
}

// Reducers
//-----------------------------------------------
const reducer = (state, action) => {
  switch (action.type) {
    case 'DATA_LOADED':
      return Object.assign({}, state, parseData(action.payload))

    case 'DATA_DERIVED':
      return Object.assign({}, state, deriveData(state))

    case 'HORIZON_HOVER':
      return Object.assign({}, state, {
        horizonSelected: action.horizonId
      })

    case 'CARD_SELECT':
      return Object.assign({}, state, {
        cardSelected: state.cardSelected === action.cardId ? null : action.cardId
      })

    case 'CARD_HOVER':
      return Object.assign({}, state, {
        cardHovered:     action.cardId,
        horizonSelected: action.horizonId
      })

    //case 'CARDS_FILTER':
    //  return {}

    default:
      return state
  }
}

export default reducer
