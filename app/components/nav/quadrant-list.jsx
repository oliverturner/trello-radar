import React, {Component, PropTypes} from 'react'

import QuadrantItem from './quadrant-item'

import styles from './style.scss'

class QuadrantList extends Component {
  render () {
    return (
      <ul className={styles['items']}>
        {this.props.cards.map((c) => <QuadrantItem key={c.id} {...c} />)}
      </ul>
    )
  }
}

QuadrantList.propTypes = {
  cards: PropTypes.array.isRequired
}

export default QuadrantList
