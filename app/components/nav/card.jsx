import React, {Component, PropTypes} from 'react'
import Collapse from 'react-collapse'
import {connect} from 'react-redux'
import {markdown} from 'markdown'

import styles from './style.scss'

class Card extends Component {
  toggleOpen = () => {
    this.props.dispatch({type: 'CARD_SELECT', cardId: this.props.id})
  }

  getDescription (opened) {
    if (this.props.desc.length === 0) return

    const desc = markdown.toHTML(this.props.desc)
    return (
      <Collapse isOpened={opened}>
        <div className={styles['card__desc']} dangerouslySetInnerHTML={{__html: desc }}/>
      </Collapse>
    )
  }

  render () {
    if (!this.props.displayed) return false

    const opened  = this.props.cardSelected === this.props.id
    const hovered = this.props.cardHovered === this.props.id
    const style   = {background: this.props.fill || '#ccc'}

    if (opened || hovered) style.width = '100%'

    return (
      <li className={styles['card']}>
        <p className={styles['card__label']} onClick={this.toggleOpen}>
          <span className={styles['card__label__prompt']} style={style}/>
          <span className={styles['card__label__text']}>{this.props.name}</span>
        </p>
        {this.getDescription(opened)}
      </li>
    )
  }
}

Card.defaultProps = {
  description: '',
  displayed:   true
}

Card.propTypes = {
  dispatch:     PropTypes.func.isRequired,
  cardSelected: PropTypes.string,
  cardHovered:  PropTypes.string,

  id:        PropTypes.string.isRequired,
  name:      PropTypes.string.isRequired,
  fill:      PropTypes.object,
  desc:      PropTypes.string,
  displayed: PropTypes.bool.isRequired
}

function select (state) {
  return {
    cardSelected: state.cardSelected,
    cardHovered:  state.cardHovered
  }
}

export default connect(select)(Card)
