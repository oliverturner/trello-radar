import React, {Component, PropTypes} from 'react'

class Search extends Component {
  constructor (props) {
    super(props)

    this.state = {
      query: ''
    }
  }

  onInputUpdate = (event) => {
    console.log('onInputUpdate:', event.target.value)
    this.setState({query: event.target.value})
  }

  render () {
    return (
      <form onChange={this.props.onChange}>
        <input name="query" value={this.state.query} onChange={this.onInputUpdate} />
        <button type="reset">x</button>
        <button disabled>Go!</button>
      </form>
    )
  }
}

Search.propTypes = {
  onChange: PropTypes.func.isRequired
}

export default Search
