import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import debounce from 'debounce'

import {searchCards} from '../../actions/trello'

import styles from './style.scss'

class Search extends Component {
  onFormChange = (query) => {
    if (query.length > 2) this.props.dispatch(searchCards(query))
  }

  onInputChange = (query) => {
    const type = (query.length === 0) ? 'CARDS_FILTER_RESET' : 'CARDS_FILTER_UPDATE'
    this.props.dispatch({type, payload: {query}})
  }

  onFocusChange = (listen) => {
    listen ? this.recognition.start() : this.recognition.stop()
  }

  onReset = () => {
    this.props.dispatch({type: 'CARDS_FILTER_RESET'})
  }

  onSubmit = (event) => {
    event.preventDefault()
  }

  // Lifecycle methods
  //-----------------------------------------------
  componentDidMount () {
    this.recognition                = new webkitSpeechRecognition()
    this.recognition.continuous     = false
    this.recognition.interimResults = false
    this.recognition.lang           = 'en-GB'

    this.recognition.onresult = (event) => {
      console.log('this.recognition.onresult', event.results[0][0]['transcript'], event.results[0][0]['confidence'])
      const query = event.results[0][0]['transcript']
      this.onInputChange(query)
      this.onFormChange(query)
    }
  }

  render () {
    return (
      <form className={styles['search']}
            onChange={debounce((event) => this.onFormChange(event.target.value), 250)}
            onReset={this.onReset}
            onSubmit={this.onSubmit}>
        <input className={styles['search__input']}
               name="query" value={this.props.query} placeholder="Search for a technology"
               onFocus={() => this.onFocusChange(true)}
               onBlur={() => this.onFocusChange(false)}
               onChange={(event) => this.onInputChange(event.target.value)}/>
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
