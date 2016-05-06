import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import HorizonLabel from './label'

class HorizonLabels extends Component {
  shouldComponentUpdate (nextProps) {
    return this.props.horizonSelected !== nextProps.horizonSelected
  }

  render () {
    const labels = this.props.horizons.map((h, i) => {
      const {id, name} = h.toObject()

      return <HorizonLabel key={id} index={i} name={name} selected={id === this.props.horizonSelected} />
    })

    return (<g>{labels.toArray()}</g>)
  }
}

HorizonLabels.propTypes = {
  horizons:        PropTypes.object.isRequired,
  horizonSelected: PropTypes.string
}

const select = (state) => {
  return {
    horizons: state.chart.get('horizons'),

    horizonSelected: state.interactions.get('horizonSelected')
  }
}

export default connect(select)(HorizonLabels)
