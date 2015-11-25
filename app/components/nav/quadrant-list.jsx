import React, {Component, PropTypes} from 'react'

import QuadrantItem from './quadrant-item'

class QuadrantList extends Component {
  render () {
    return (
      <ul className="navitems">
        {this.props.cards.map((c) => <QuadrantItem {...c} />)}
      </ul>
    )
  }
}

QuadrantList.propTypes = {
  cards: PropTypes.array.isRequired
}

export default QuadrantList
