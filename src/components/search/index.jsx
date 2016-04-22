import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
// import debounce from 'debounce'

import {searchCards} from '../../actions/trello'

import styles from './style.pcss'

class Search extends Component {
  constructor (props) {
    super(props)

    const {dispatch} = this.props

    this.onFormReset = function () {
      dispatch({type: 'CARDS_FILTER_RESET'})
    }

    this.onFormSubmit = function (e) {
      e.preventDefault()
    }

    this.onInputTextChange = function (e) {
      const query = e.nativeEvent.target.value
      const type  = query.length ? 'CARDS_FILTER_UPDATE' : 'CARDS_FILTER_RESET'

      dispatch({type, payload: {query}})

      if (query.length > 2) dispatch(searchCards(query))
    }
  }

  render () {
    return (
      <form className={styles['search']}
        onReset={this.onFormReset}
        onSubmit={this.onFormSubmit}>

        <input className={styles['search__input']}
          value={this.props.query}
          placeholder="Search for a technology"
          onChange={this.onInputTextChange} />

        <button className={styles['search__btn']} type="reset">clear</button>

      </form>
    )
  }
}

Search.propTypes = {
  dispatch: PropTypes.func.isRequired,
  query:    PropTypes.string.isRequired
}

const select = (state) => {
  return {
    query: state.chart.get('query')
  }
}

export default connect(select)(Search)
