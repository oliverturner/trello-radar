const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'INIT':
      console.log('INIT CALLED')
      return state

    default:
      return state
  }
}

export default reducer
