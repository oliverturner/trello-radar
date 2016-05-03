import {Map} from 'immutable'

const initialState = Map({
  quadrantSelected: null,
  horizonSelected:  null,
  cardSelected:     null,
  cardHovered:      null,
  cardPositions:    Map(),
  navPosition:      0
})

const onCardSelected = (state, payload) => {
  const cardSelected = payload.cardId ? payload.cardId : null
  const navPosition  = cardSelected ? state.getIn(['cardPositions', cardSelected]) * -1 : 0

  return {cardSelected, navPosition}
}

const reducer = (state = initialState, action) => {
  const {type, payload} = action

  switch (type) {
    case 'HORIZON_HOVER':
      return state.merge({
        quadrantSelected: payload.quadrantId,
        horizonSelected:  payload.horizonId
      })

    case 'CARD_MOUNTED':
      return state.setIn(['cardPositions', payload.cardId], payload.offsetTop)

    case 'CARD_HOVER':
      return state.merge({
        cardHovered:      payload.cardId,
        quadrantSelected: payload.quadrantId,
        horizonSelected:  payload.horizonId
      })

    case 'CARD_SELECT':
      return state.merge(onCardSelected(state, payload))

    default:
      return state
  }
}

export default reducer
