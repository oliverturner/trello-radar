import React, {Component, PropTypes} from 'react'
import Collapse from 'react-collapse'
import {connect} from 'react-redux'

import styles from './style.scss'

class Card extends Component {
  static defaultProps = {
    description: ''
  }

  toggleOpen = () => {
    this.props.dispatch({type: 'CARD_SELECT', cardId: this.props.id})
  }

  getDescription (opened) {
    if (this.props.desc.length === 0) return

    return (
      <Collapse isOpened={opened}>
        <p className={styles['card__desc']}>{this.props.desc}</p>
      </Collapse>
    )
  }

  render () {
    const opened  = this.props.cardSelected === this.props.id
    const hovered = this.props.cardHovered === this.props.id
    const style   = {background: this.props.fill}

    if (opened || hovered) style.width = '100%'

    return (
      <li className={styles['card']} onClick={this.toggleOpen}>
        <p className={styles['card__label']}>
          <span className={styles['card__label__prompt']} style={style}/>
          <span className={styles['card__label__text']}>{this.props.name}</span>
        </p>
        {this.getDescription(opened)}
      </li>
    )
  }
}

Card.propTypes = {
  dispatch:     PropTypes.func.isRequired,
  cardSelected: PropTypes.string,
  cardHovered:  PropTypes.string,

  id:   PropTypes.string.isRequired,
  fill: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  desc: PropTypes.string
}

function select (state) {
  return {
    cardSelected: state.cardSelected,
    cardHovered:  state.cardHovered
  }
}

export default connect(select)(Card)
