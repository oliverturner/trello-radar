import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Motion, spring} from 'react-motion'

import Quadrant from './quadrant'

import styles from './styles.pcss'

class Nav extends Component {
  constructor () {
    super()

    // ReactMotion requires callback-based refs
    this.getRef = (refName) => (ref) => {
      this[refName] = ref
    }

    // Distinguish between manual and programmatic scroll
    this.onNavWheel = (event) => {
      const el = event.currentTarget.children.item(0)
      this.props.onNavWheeled({y: event.deltaY, h: el.offsetHeight})
    }
  }

  render () {
    return (
      <Motion style={{y: spring(this.props.navPosition)}}>
        {(val) => {
          if (this.cardNav) this.cardNav.scrollTop = val.y

          return (
            <div ref={this.getRef('cardNav')}
              className={styles['quadrants-wrap']} onWheel={this.onNavWheel}>
              <ul className={styles['quadrants']}>
                {this.props.quadrants.map((q) => {
                  const id    = q.get('id')
                  const cards = this.props.cards.filter((c) => c.get('quadrantId') === q.get('id'))

                  return (
                    <Quadrant key={id} id={id} name={q.get('name')}
                      cards={cards}
                      quadrantSelected={this.props.quadrantSelected}
                      cardSelected={this.props.cardSelected}
                      cardHovered={this.props.cardHovered}
                      onCardMounted={this.props.onCardMounted}
                      onCardSelected={this.props.onCardSelected}/>
                  )
                })}
              </ul>
            </div>
          )
        }}
      </Motion>
    )
  }
}

Nav.propTypes = {
  quadrants:        PropTypes.object.isRequired,
  cards:            PropTypes.object.isRequired,
  cardHovered:      PropTypes.string,
  quadrantSelected: PropTypes.string,
  cardSelected:     PropTypes.string,
  navPosition:      PropTypes.number.isRequired,
  onCardMounted:    PropTypes.func.isRequired,
  onCardSelected:   PropTypes.func.isRequired,
  onNavWheeled:     PropTypes.func.isRequired
}

function mapStateToProps (state) {
  return {
    quadrants: state.chart.get('quadrants'),
    cards:     state.chart.get('cards'),

    cardHovered:      state.interactions.get('cardHovered'),
    quadrantSelected: state.interactions.get('quadrantSelected'),
    cardSelected:     state.interactions.get('cardSelected'),
    navPosition:      state.interactions.get('navPosition')
  }
}

const mapDispatchToProps = (dispatch) => ({
  onCardMounted:  (payload) => dispatch({type: 'CARD_MOUNTED', payload}),
  onCardSelected: (payload) => dispatch({type: 'CARD_SELECT', payload}),
  onNavWheeled:   (payload) => dispatch({type: 'NAV_WHEELED', payload})
})

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
