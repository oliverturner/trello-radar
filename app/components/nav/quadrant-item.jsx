import React, {Component, PropTypes} from 'react'

class QuadrantItem extends Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false
    }
  }

  toggleOpen = () => {
    if (!this.props.description.length) return

    this.setState({open: !this.state.open})
  }

  render () {
    const style = {background: this.props.fill}
    const cls   = this.state.open ? 'navitem__desc is-active' : 'navitem__desc'

    return (
      <li key={this.props.id} className="navitem--segment" onClick={this.toggleOpen}>
        <p className="navitem__label" style={style}>{this.props.name}</p>
        <p className={cls}>{this.props.description}</p>
      </li>
    )
  }
}

QuadrantItem.propTypes = {
  id:          PropTypes.string.isRequired,
  fill:        PropTypes.string.isRequired,
  name:        PropTypes.string.isRequired,
  description: PropTypes.string
}

export default QuadrantItem
