import React, {Component, PropTypes} from 'react'

import styles from './style.scss'

class Search extends Component {
  constructor (props) {
    super(props)

    this.state = {
      query: ''
    }
  }

  onInputUpdate = (event) => {
    this.setState({query: event.target.value})
  }

  onReset = () => {
    this.setState({query: ''})
    this.props.onReset()
  }

  onSubmit = (event) => {
    event.preventDefault()
  }

  // TODO: eliminate local state: make query a prop
  render () {
    return (
      <form className={styles['search']} onChange={this.props.onChange} onReset={this.onReset} onSubmit={this.onSubmit}>
        <input className={styles['search__input']}
               name="query" value={this.state.query} placeholder="Search for a technology"
               onChange={this.onInputUpdate}/>
        <button className={styles['search__btn']} type="reset">clear</button>
      </form>
    )
  }
}

Search.propTypes = {
  onChange: PropTypes.func.isRequired,
  onReset:  PropTypes.func.isRequired
}

export default Search
