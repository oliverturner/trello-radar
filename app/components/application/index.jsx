import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import debounce from 'debounce'

import {searchCards} from '../../actions/trello'

import Chart from '../chart'
import HorizonLabels from '../chart/horizon-labels'
import ChartBlips from '../chart/blips'
import Search from '../search'
import Nav from '../nav'

import metrics from '../../utils/metrics'

import '../../styles/base.scss'

// TODO: implement "submit a description; badge items missing a description"
// TODO: implement "customise view by discipline (DevOps, Front End, Perf, etc)"
// TODO: implement "Filter nav by tabs" [maybe]
// TODO: create read-only user account to access API

class Application extends Component {
  // TODO: move these into Search component
  onSearchChange = (event) => {
    const query = event.target.value
    this.props.dispatch(searchCards(query))
  }

  onSearchReset = () => {
    this.props.dispatch({type: 'CARDS_FILTER_RESET'})
  }

  render () {
    const {width, height} = metrics
    const cx = width / 2
    const cy = height / 2

    return (
      <div className="radar">
        <svg className="radar__chart" viewBox={`0 0 ${width} ${height}`}>
          <g transform={`translate(${cx}, ${cy})`}>
            <HorizonLabels horizons={this.props.horizons} horizonSelected={this.props.horizonSelected}/>
            <Chart />
            <ChartBlips />
          </g>
        </svg>
        <div className="radar__nav">
          <Search onChange={debounce(this.onSearchChange, 250)} onReset={this.onSearchReset}/>
          <Nav />
        </div>
      </div>
    )
  }
}

Application.propTypes = {
  dispatch: PropTypes.func.isRequired,

  horizons:        PropTypes.object.isRequired,
  horizonSelected: PropTypes.string
}

const select = (state) => {
  return {
    horizons:        state.get('horizons'),
    horizonSelected: state.get('horizonSelected')
  }
}

export default connect(select)(Application)
