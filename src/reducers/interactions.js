import {Map} from 'immutable'

const initialState = Map({
  quadrantSelected: null,
  horizonSelected:  null,
  cardSelected:     null,
  cardHovered:      null
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'HORIZON_HOVER':
      return state.merge({
        quadrantSelected: action.payload.quadrantId,
        horizonSelected:  action.payload.horizonId
      })

    case 'CARD_HOVER':
      return state.merge({
        cardHovered:      action.cardId,
        quadrantSelected: action.quadrantId,
        horizonSelected:  action.horizonId
      })

    case 'CARD_SELECT':
      return state.set('cardSelected', state.get('cardSelected') === action.payload.cardId ? null : action.payload.cardId)

    default:
      return state
  }
}

export default reducer
