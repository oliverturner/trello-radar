import React, {Component, PropTypes} from 'react'
import Collapse from 'react-collapse'
import {connect} from 'react-redux'

import styles from './style.scss'

class QuadrantItem extends Component {
  static defaultProps = {
    description: ''
  }

  toggleOpen = () => {
    this.props.dispatch({type: 'CARD_SELECT', cardId: this.props.id})
  }

  getDescription () {
    if (this.props.description.length === 0) return

    const opened = this.props.cardSelected === this.props.id

    return (
      <Collapse isOpened={opened}>
        <p className={styles['item__desc']}>{this.props.description}</p>
      </Collapse>
    )
  }

  render () {
    const style  = {background: this.props.fill}

    return (
      <li className={styles['item--segment']} onClick={this.toggleOpen}>
        <p className={styles['item__label']} style={style}>{this.props.name}</p>
        {this.getDescription()}
      </li>
    )
  }
}

QuadrantItem.propTypes = {
  dispatch:     PropTypes.func.isRequired,
  cardSelected: PropTypes.string,

  id:          PropTypes.string.isRequired,
  fill:        PropTypes.object.isRequired,
  name:        PropTypes.string.isRequired,
  description: PropTypes.string
}

function select (state) {
  return {cardSelected: state.cardSelected}
}

export default connect(select)(QuadrantItem)
