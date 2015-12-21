import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import {searchCards} from '../../actions/trello'

import Chart from '../chart'
import HorizonLabels from '../chart/horizon-labels'
import ChartBlips from '../chart/blips'
import Search from '../search'
import Nav from '../nav'

import metrics from '../../utils/metrics'

import '../../styles/base.scss'

class Application extends Component {
  onSearchChange = (event) => {
    const query = event.currentTarget.query.value
    this.props.dispatch(searchCards(query))
  }

  onSearchReset = () => {
    this.props.dispatch({type: 'CARDS_FILTER_RESET'})
  }

  render () {
    if (this.props.quadrantSelected) {
      window.location.hash = this.props.quadrantSelected
    }

    const {width, height} = metrics
    const cx = width / 2
    const cy = height / 2

    return (
      <div className="radar">
        <svg className="radar__chart" viewBox={`0 0 ${width} ${height}`}>
          <g transform={`translate(${cx}, ${cy})`}>
            <HorizonLabels horizons={this.props.horizons} horizonSelected={this.props.horizonSelected} />
            <Chart />
            <ChartBlips />
          </g>
        </svg>
        <div className="radar__nav">
          <Search onChange={this.onSearchChange} onReset={this.onSearchReset}/>
          <Nav />
        </div>
      </div>
    )
  }
}

Application.propTypes = {
  dispatch: PropTypes.func.isRequired,

  horizons: PropTypes.object.isRequired,

  quadrantSelected: PropTypes.string,
  horizonSelected:  PropTypes.string
}

const select = (state) => {
  return {
    horizons: state.get('horizons'),

    quadrantSelected: state.get('quadrantSelected'),
    horizonSelected:  state.get('horizonSelected')
  }
}

export default connect(select)(Application)
