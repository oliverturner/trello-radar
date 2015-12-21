import React, {Component, PropTypes} from 'react'

import HorizonLabel from './horizon-label'

class HorizonLabels extends Component {
  shouldComponentUpdate (nextProps) {
    return this.props.horizonSelected !== nextProps.horizonSelected
  }

  render () {
    const labels = this.props.horizons.map((h, i) => {
      const {id, name} = h.toObject()

      return <HorizonLabel key={id} index={i} name={name} selected={id === this.props.horizonSelected}/>
    })

    return (<g>{labels.toArray()}</g>)
  }
}

HorizonLabels.propTypes = {
  horizons:        PropTypes.object.isRequired,
  horizonSelected: PropTypes.string
}

export default HorizonLabels
