import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Card from './card'

import styles from './styles.pcss'

class Nav extends Component {
  toggleCard = (payload) => () => {
    this.props.dispatch({type: 'CARD_SELECT', payload})
  }

  getCard (data) {
    if (!data.displayed) return false

    const {id: cardId, quadrantId, horizonId} = data

    const isOpened  = this.props.cardSelected === cardId
    const isHovered = this.props.cardHovered === cardId

    return (
      <Card key={cardId}
        onClick={this.toggleCard({cardId, quadrantId, horizonId})}
        isOpened={isOpened} isHovered={isHovered} {...data} />
    )
  }

  getQuadrant (opened, q, qCards) {
    if (!opened) return false

    const id = q.get('id')

    return (
      <li key={id} id={id} className={styles['quadrant']}>
        <p className={styles['quadrant__label']}>{q.get('name')}</p>
        <ul className={styles['quadrant__cards']}>
          {qCards.map((c) => this.getCard(c.toObject()))}
        </ul>
      </li>
    )
  }

  calcTop () {
    if (!this.props.cardSelected) return

    const el = document.getElementById(this.props.cardSelected)

    console.group('el')
    console.log('el:', el.offsetTop)
    console.log('quadrant:', el.parentElement.offsetTop)
    console.log('nav.offsetTop:', this.refs.nav.offsetTop)
    console.log('nav.scrollTop:', this.refs.nav.scrollTop)
    console.groupEnd()

    return 0
  }

  render () {
    const offsetTop = this.calcTop()

    return (
      <ul ref="nav" className={styles.quadrants}>
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
