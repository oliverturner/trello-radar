import React, {Component} from 'react'

import Chart from '../chart'
import HorizonLabels from '../chart/horizon-labels'
import ChartBlips from '../chart/blips'
import Search from '../search'
import Nav from '../nav'

import metrics from '../../utils/metrics'

import '../../styles/base.pcss'
import styles from './styles.pcss'

// TODO: implement "submit a description; badge items missing a description"
// TODO: implement "customise view by discipline (DevOps, Front End, Perf, etc)"
// TODO: implement "Filter nav by tabs" [maybe]
// TODO: create read-only user account to access API; use dotenv?

class Application extends Component {
  render () {
    const {width, height} = metrics
    const cx = width / 2
    const cy = height / 2

    return (
      <div className={styles['radar']}>
        <svg className={styles['radar__chart']} viewBox={`0 0 ${width} ${height}`}>
          <g transform={`translate(${cx}, ${cy})`}>
            <HorizonLabels />
            <Chart />
            <ChartBlips />
          </g>
        </svg>
        <div className={styles['radar__nav']}>
          <Search />
          <Nav />
        </div>
      </div>
    )
  }
}

export default Application
