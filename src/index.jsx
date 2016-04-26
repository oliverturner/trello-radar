// IMPORTANT: This needs to be first (before any other components)
// to get around CSS order randomness in webpack.
import './styles/base.pcss'

import React from 'react'
import {render} from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'

import reducer from './reducers'
import {loadData} from './actions/trello'

import Application from './components/application'

// Initialise
//-----------------------------------------------
// create a store that has redux-thunk middleware enabled
const createAsyncStore = applyMiddleware(thunk)(createStore)

const store = createAsyncStore(reducer)

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
  .catch((err) => {
    throw err
  })
