import React, {Component, PropTypes} from 'react'

import {connect} from 'react-redux'

class QuadrantItem extends Component {
  toggleOpen = () => {
    this.props.dispatch({type: 'CARD_SELECT', cardId: this.props.id})
  }

  render () {
    const style = {background: this.props.fill}
    const cls   = this.props.cardSelected === this.props.id ? 'navitem__desc is-active' : 'navitem__desc'

    return (
      <li key={this.props.id} className="navitem--segment" onClick={this.toggleOpen}>
        <p className="navitem__label" style={style}>{this.props.name}</p>
        <p className={cls}>{this.props.description}</p>
      </li>
    )
  }
}

QuadrantItem.propTypes = {
  dispatch:     PropTypes.func.isRequired,
  cardSelected: PropTypes.string.isRequired,

  id:          PropTypes.string.isRequired,
  fill:        PropTypes.string.isRequired,
  name:        PropTypes.string.isRequired,
  description: PropTypes.string
}

function select (state) {
  return {cardSelected: state.cardSelected}
}

export default connect(select)(QuadrantItem)
