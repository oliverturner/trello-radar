import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Quadrant from './quadrant'

import styles from './styles.pcss'

class Nav extends Component {
  render () {
    return (
      <div ref="cardNav" className={styles['quadrants-wrap']}>
        <ul className={styles['quadrants']}
          style={{top: this.props.navPosition}}>
          {this.props.quadrants.map((q) => {
            const quadrantCards = this.props.cards.filter((c) => c.get('quadrantId') === q.get('id'))
            const noActiveCards = (quadrantCards.every((c) => c.get('displayed') === false))

            if (noActiveCards) return false

            return (
              <Quadrant id={q.get('id')} name={q.get('name')}
                cards={quadrantCards}
                cardSelected={this.props.cardSelected}
                cardHovered={this.props.cardHovered}
                onCardMounted={this.props.onCardMounted}
                onCardSelected={this.props.onCardSelected} />
            )
          })}
        </ul>
      </div>
    )
  }
}

Nav.propTypes = {
  quadrants:      PropTypes.object.isRequired,
  cards:          PropTypes.object.isRequired,
  cardHovered:    PropTypes.string,
  cardSelected:   PropTypes.string,
  navPosition:    PropTypes.number.isRequired,
  onCardMounted:  PropTypes.func.isRequired,
  onCardSelected: PropTypes.func.isRequired
}

function mapStateToProps (state) {
  return {
    quadrants: state.chart.get('quadrants'),
    cards:     state.chart.get('cards'),

    cardHovered:  state.interactions.get('cardHovered'),
    cardSelected: state.interactions.get('cardSelected'),
    navPosition:  state.interactions.get('navPosition')
  }
}

const mapDispatchToProps = (dispatch) => ({
  onCardMounted:  (payload) => dispatch({type: 'CARD_MOUNTED', payload}),
  onCardSelected: (payload) => dispatch({type: 'CARD_SELECT', payload})
})

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
