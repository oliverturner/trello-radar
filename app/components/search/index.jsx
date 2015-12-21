import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import debounce from 'debounce'

import {searchCards} from '../../actions/trello'

import styles from './style.scss'

class Search extends Component {
  onFormChange = (event) => {
    const query = event.target.value
    if (query.length > 2) this.props.dispatch(searchCards(query))
  }

  onInputChange = (event) => {
    const query = event.target.value
    const type  = (query.length === 0) ? 'CARDS_FILTER_RESET' : 'CARDS_FILTER_UPDATE'
    this.props.dispatch({type, payload: {query}})
  }

  onReset = () => {
    this.props.dispatch({type: 'CARDS_FILTER_RESET'})
  }

  onSubmit = (event) => {
    event.preventDefault()
  }

  render () {
    return (
      <form className={styles['search']} onChange={debounce(this.onFormChange, 250)} onReset={this.onReset}
            onSubmit={this.onSubmit}>
        <input className={styles['search__input']}
               name="query" value={this.props.query} placeholder="Search for a technology"
               onChange={this.onInputChange}/>
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
    query: state.get('query')
  }
}

export default connect(select)(Search)
