// IMPORTANT: This needs to be first (before any other components)
// to get around CSS order randomness in webpack.
import './styles/base.scss'

import React from 'react'
import {render} from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'

import reducer from './reducers'
//import {srcs, types, searchQS} from './utils/trello'
import {loadData} from './actions/trello'

import Application from './components/application'

// Start
//-----------------------------------------------
// create a store that has redux-thunk middleware enabled
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)

const store = createStoreWithMiddleware(reducer, {
  horizonSelected:   null,
  cardSelected:      null,
  cardHovered:       null,
  cardsFiltered:     [],
  textPathSupported: navigator.userAgent.toLowerCase().indexOf('firefox') === -1
})

const onError = (err) => {
  console.log(err)
}

//const loadData = () => (dispatch) =>
//  Promise
//    .all(srcs.map((src) => fetch(src).then((res) => res.json())))
//    .then((values) =>
//      values.reduce((ret, val, index) => {
//        ret[types[index]] = val
//        return ret
//      }, {})
//    )
//    .then((data) => dispatch({type: 'DATA_LOADED', payload: data}))
//    .then(() => dispatch({type: 'DATA_DERIVED'}))

// Let's go disco!
//-----------------------------------------------
store.dispatch(loadData())
  .then(() => {
    render(
      <Provider store={store}>
        <Application/>
      </Provider>,
      document.getElementById('app')
    )
  })
  .catch(onError)
