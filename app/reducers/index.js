const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'INIT':
      console.log('INIT CALLED')
      return state

    default:
      console.log('default')
      return state
  }
}

export default reducer
