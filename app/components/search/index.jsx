import React, {Component, PropTypes} from 'react'

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

  render () {
    return (
      <form onChange={this.props.onChange} onReset={this.props.onReset}>
        <input name="query" value={this.state.query} onChange={this.onInputUpdate}/>
        <button type="reset">x</button>
        <button disabled>Go!</button>
      </form>
    )
  }
}

Search.propTypes = {
  onChange: PropTypes.func.isRequired,
  onReset:  PropTypes.func.isRequired
}

export default Search
