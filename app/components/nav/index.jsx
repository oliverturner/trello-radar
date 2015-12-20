import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Collapse from 'react-collapse'

import Card from './card'

import styles from './style.scss'

class Nav extends Component {
  toggleOpen = (cardId) => {
    this.props.dispatch({type: 'CARD_SELECT', cardId: cardId})
  }

  getQuadrant (opened, q, qCards) {
    if (!opened) return false

    return (
      <li key={q.get('id')} id={q.get('id')} className={styles['quadrant']}>
          <p className={styles['quadrant__label']}>{q.get('name')}</p>
        <ul className={styles['quadrant__cards']}>
          {qCards.map((c) => {
            const cardId    = c.get('id')
            const isOpened  = this.props.cardSelected === cardId
            const isHovered = this.props.cardHovered === cardId

            return c.get('displayed')
              ? <Card key={cardId}
                      onClick={this.toggleOpen}
                      isOpened={isOpened} isHovered={isHovered}
                {...c.toObject()} />
              : false
          })}
        </ul>
      </li>
    )
  }

  render () {
    return (
      <ul className={styles.quadrants}>
        {this.props.quadrants.map((q) => {
          const qCards = this.props.cards.filter((c) => c.get('quadrantId') === q.get('id'))
          const opened = (qCards.every((c) => c.get('displayed') === false))

          return this.getQuadrant(!opened, q, qCards)
        })}
      </ul>
    )
  }
}

Nav.propTypes = {
  dispatch:     PropTypes.func.isRequired,
  quadrants:    PropTypes.array.isRequired,
  cards:        PropTypes.array.isRequired,
  cardHovered:  PropTypes.string,
  cardSelected: PropTypes.string
}

function select (state) {
  return {
    cardSelected: state.get('cardSelected'),
    cardHovered:  state.get('cardHovered')
  }
}

export default connect(select)(Nav)
