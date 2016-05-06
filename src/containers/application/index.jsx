import React, {Component, PropTypes} from 'react'

import Radar from 'components/radar'
import Search from 'components/search'
import Nav from 'components/nav'

import './styles.pcss'

// TODO: implement "submit a description; badge items missing a description"
// TODO: implement "customise view by discipline (DevOps, Front End, Perf, etc)"
// TODO: implement "Filter nav by tabs" [maybe]
// TODO: create read-only user account to access API; use dotenv?

class Application extends Component {
  render () {
    return (
      <div className="radar">
        <Radar />
        <div className="radar__nav">
          <Search />
          <Nav />
        </div>
      </div>
    )
  }
}

export default Application
