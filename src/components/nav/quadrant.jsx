import React, {Component, PropTypes} from 'react'

import Card from './card'

import styles from './styles.pcss'

class Quadrant extends Component {
  constructor () {
    super()

    this.toggleCard = (payload) => () => {
      this.props.onCardSelected(payload)
    }
  }

  getCard ({id: cardId, quadrantId, horizonId, name, desc, fill}) {
    const isOpened  = this.props.cardSelected === cardId
    const isHovered = this.props.cardHovered === cardId

    return (
      <Card key={cardId} name={name} desc={desc} fill={fill}
        cardId={cardId} quadrantId={quadrantId} horizonId={horizonId}
        onMounted={this.props.onCardMounted}
        onClick={this.toggleCard({cardId, quadrantId, horizonId})}
        isOpened={isOpened} isHovered={isHovered} />
    )
  }

  render () {
    const noActiveCards = (this.props.cards.every((c) => c.get('displayed') === false))

    if (noActiveCards) return false

    return (
      <li key={this.props.id} id={this.props.id} className={styles['quadrant']}>
        <p className={styles['quadrant__label']}>{this.props.name}</p>
        <ul className={styles['quadrant__cards']}>
          {this.props.cards.map((c) => {
            const data = c.toObject()
            return data.displayed ? this.getCard(data) : false
          })}
        </ul>
      </li>
    )
  }
}

Quadrant.propTypes = {
  id:             PropTypes.string.isRequired,
  name:           PropTypes.string.isRequired,
  cards:          PropTypes.object.isRequired,
  cardSelected:   PropTypes.string,
  cardHovered:    PropTypes.string,
  onCardMounted:  PropTypes.func.isRequired,
  onCardSelected: PropTypes.func.isRequired
}

export default Quadrant
