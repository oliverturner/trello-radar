import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Card from './card'

import styles from './style.scss'

class Nav extends Component {
  toggleCard = (cardId) => () => {
    this.props.dispatch({type: 'CARD_SELECT', cardId: cardId})
  }

  getCard (data) {
    if (!data.displayed) return false

    const cardId    = data.id
    const isOpened  = this.props.cardSelected === cardId
    const isHovered = this.props.cardHovered === cardId

    return (
      <Card key={cardId}
        onClick={this.toggleCard(cardId)}
        isOpened={isOpened} isHovered={isHovered} {...data} />
    )
  }

  getQuadrant (opened, q, qCards) {
    if (!opened) return false

    return (
      <li key={q.get('id')} id={q.get('id')} className={styles['quadrant']}>
        <p className={styles['quadrant__label']}>{q.get('name')}</p>
        <ul className={styles['quadrant__cards']}>
          {qCards.map((c) => this.getCard(c.toObject()))}
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
  quadrants:    PropTypes.object.isRequired,
  cards:        PropTypes.object.isRequired,
  cardHovered:  PropTypes.string,
  cardSelected: PropTypes.string
}

function select (state) {
  return {
    quadrants: state.chart.get('quadrants'),
    cards:     state.chart.get('cards'),

    cardHovered:  state.interactions.get('cardHovered'),
    cardSelected: state.interactions.get('cardSelected')
  }
}

export default connect(select)(Nav)
