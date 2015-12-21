import metrics from '../utils/metrics'

// Helpers
//-----------------------------------------------
const deriveKey = (q, h) => `${q.get('id')}-${h.get('id')}`

const parseData = (results) => {
  const data = {
    quadrants: results.labels.map(({id, name}) => ({id, name})),
    horizons:  results.lists.slice(0, -1).map(({id, name}) => ({id, name: name.split(' ')[0]})),
    cards:     results.cards.map(c => {
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
  }

  metrics.init(data.quadrants.length, data.horizons.length)

  return data
}

// Generate segments from quadrants and horizons
const createSegments = ({quadrants, horizons, cards}) =>
  quadrants.reduce((qRet, quadrant, i) => {
    const qh = horizons.reduce((hRet, horizon, j) => {
      const key     = deriveKey(quadrant, horizon)
      const qIndex  = i
      const hIndex  = j
      const cardIds = cards
        .filter((c) => c.get('quadrantId') === quadrant.get('id') && c.get('horizonId') === horizon.get('id'))
        .map((c) => c.get('id'))

      hRet[key] = {
        id:         key,
        quadrantId: quadrant.get('id'),
        horizonId:  horizon.get('id'),
        qIndex:     qIndex,
        hIndex:     hIndex,
        fill:       metrics.getSegmentFill(qIndex, hIndex),
        d:          metrics.getSegmentArc(qIndex, hIndex),
        cardIds:    cardIds,
        sCount:     cardIds.count()
      }

      return hRet
    }, {})

    return Object.assign(qRet, qh)
  }, {})

const addSegmentData = (cards, segments) =>
  cards.map((card) => {
    const segment = segments[card.get('segmentKey')]

    if (segment) {
      const sIndex = segment.cardIds.indexOf(card.get('id'))
      return card.merge({
        sIndex: sIndex,
        sCount: segment.sCount,
        qIndex: segment.qIndex,
        hIndex: segment.hIndex,
        fill:   segment.fill
      })
    }

    return card
  })

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
    if (card.get('sIndex') >= 0) ret.push(card)

    return ret
  }, [])

const deriveData = (data) => {
  const segments = createSegments(data)
  const cards    = addSegmentData(data.cards, segments)

  // store a reference to the outermost section: used to apply curved quadrantLabel
  const hOuter    = data.horizons.last()
  const quadrants = data.quadrants.map(q => q.set('labelArcId', deriveKey(q, hOuter)))

  return {
    segments:     segments,
    quadrants:    quadrants,
    cards:        cards,
    segmentCards: filterSegmentCards(cards)
  }
}

// Reducers
//-----------------------------------------------
const reducer = (state, action) => {
  switch (action.type) {
    case 'DATA_LOADED':
      return state.merge(parseData(action.payload))

    case 'DATA_DERIVED':
      return state.merge(deriveData({
        quadrants: state.get('quadrants'),
        horizons:  state.get('horizons'),
        cards:     state.get('cards')
      }))

    case 'HORIZON_HOVER':
      if (action.payload.quadrantId) {
        window.location.hash = action.payload.quadrantId
      }

      return state.merge({
        quadrantSelected: action.payload.quadrantId,
        horizonSelected:  action.payload.horizonId
      })

    case 'CARD_SELECT':
      return state.set('cardSelected', state.get('cardSelected') === action.cardId ? null : action.cardId)

    case 'CARD_HOVER':
      return state.merge({
        cardHovered:      action.cardId,
        quadrantSelected: action.quadrantId,
        horizonSelected:  action.horizonId
      })

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
