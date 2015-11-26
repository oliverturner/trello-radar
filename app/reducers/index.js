const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'INIT':
      console.log('INIT CALLED')
      return state

    case 'CARD_SELECT':
      return Object.assign({}, state, {
        cardSelected: state.cardSelected === action.cardId ? null : action.cardId
      })

    default:
      return state
  }
}

export default reducer
