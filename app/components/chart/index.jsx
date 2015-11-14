import React, {Component, PropTypes} from 'react'
import DOM from 'react-dom'

import d3Chart from './d3chart'

class Chart extends Component {
  dispatcher = null

  showTooltip (d) {
    if (this.props.appState.showingAllTooltips) {
      return
    }

    this.props.setAppState({
      tooltip:    d,
      prevDomain: null // Disable animation
    })
  }

  hideTooltip () {
    if (this.props.appState.showingAllTooltips) {
      return
    }

    this.props.setAppState({
      tooltip:    null,
      prevDomain: null
    })
  }

  getChartState () {
    const appState = this.props.appState

    let tooltips = []
    if (appState.showingAllTooltips) {
      tooltips = appState.body
    }
    else if (appState.tooltip) {
      tooltips = [appState.tooltip]
    }

    return Object.assign({}, appState, {tooltips: tooltips})
  }

  componentDidMount () {
    const el = DOM.findDOMNode(this)

    const dispatcher = d3Chart.create(el, {
      width:  this.props.width,
      height: this.props.height
    }, this.getChartState())

    dispatcher.on('point:mouseover', this.showTooltip)
    dispatcher.on('point:mouseout', this.hideTooltip)

    this.dispatcher = dispatcher
  }

  componentDidUpdate (prevProps, prevState) {
    const el = DOM.findDOMNode(this)
    d3Chart.update(el, this.getChartState(), this.dispatcher)
  }

  render () {
    return (
      <div className="Chart"></div>
    )
  }
}

Chart.defaultProps = {
  width:  '100%',
  height: '300px',

  setAppState: function () {
  },

  appState: {
    data: [{
      id: 0,
      x:  10,
      y:  10,
      z:  10
    }],

    domain:     {x: [0, 30], y: [0, 100]},
    tooltip:    null,
    prevDomain: null,

    showingAllTooltips: false
  }
}

Chart.propTypes = {
  width:       PropTypes.string.isRequired,
  height:      PropTypes.string.isRequired,
  setAppState: PropTypes.func.isRequired,
  appState:    PropTypes.shape({
    body:               PropTypes.array.isRequired,
    showingAllTooltips: PropTypes.bool.isRequired
  })
}

export default Chart
