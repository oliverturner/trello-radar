const reducer = (state, action) => {
  switch (action.type) {
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

    default:
      return state
  }
}

export default reducer
