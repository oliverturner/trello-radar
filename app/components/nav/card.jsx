import React, {Component, PropTypes} from 'react'
import Collapse from 'react-collapse'
import {markdown} from 'markdown'

import styles from './style.scss'

class Card extends Component {
  static getDescription  = (desc) => {
    if (desc.length === 0) return false

    return (<div className={styles['card__desc']} dangerouslySetInnerHTML={{__html: markdown.toHTML(desc) }}/>)
  }

  constructor (props) {
    super(props)

    this.content = Card.getDescription(props.desc)
  }

  shouldComponentUpdate (nextProps) {
    return (
      this.props.isHovered !== nextProps.isHovered ||
      this.props.isOpened !== nextProps.isOpened
    )
  }

  render () {
    const style = {background: this.props.fill || '#ccc'}

    if (this.props.isOpened || this.props.isHovered) style.width = '100%'

    return (
      <li className={styles['card']}>
        <p className={styles['card__label']} onClick={() => this.props.onClick(this.props.id)}>
          <span className={styles['card__label__prompt']} style={style}/>
          <span className={styles['card__label__text']}>{this.props.name}</span>
        </p>
        {this.content
          ? <Collapse isOpened={this.props.isOpened}>{this.content}</Collapse>
          : false
        }
      </li>
    )
  }
}

Card.propTypes = {
  id:      PropTypes.string.isRequired,
  name:    PropTypes.string.isRequired,
  fill:    PropTypes.string,
  desc:    PropTypes.string,
  onClick: PropTypes.func.isRequired,

  isHovered: PropTypes.bool.isRequired,
  isOpened:  PropTypes.bool.isRequired
}

export default Card
