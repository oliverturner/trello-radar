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
  const cardSelected = payload.cardId === state.get('cardSelected') ? null : payload.cardId
  const navPosition  = cardSelected
    ? state.getIn(['cardPositions', cardSelected])
    : state.get('navPosition')

  return {cardSelected, navPosition}
}

const updateNavWheelPosition = (state, payload) => {
  const y = state.get('navPosition') + payload.y

  let dy

  dy = y <= 0 ? 0 : y
  dy = y >= payload.h ? payload.h : dy

  return state.set('navPosition', dy)
}

// Exported reducer
//-----------------------------------------------
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

    case 'NAV_WHEELED':
      return updateNavWheelPosition(state, payload)

    default:
      return state
  }
}

export default reducer
