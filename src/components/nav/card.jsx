import React, {Component, PropTypes} from 'react'
import {markdown} from 'markdown'

import styles from './styles.pcss'

class Card extends Component {
  static getDescription = (desc) => {
    if (desc.length === 0) return false

    return (
      <div className={styles['card__desc']}
        dangerouslySetInnerHTML={{__html: markdown.toHTML(desc) }} />
    )
  }

  constructor (props) {
    super(props)

    this.content = Card.getDescription(props.desc)
  }

  componentDidMount () {
    // Store the initial y position of this element:
    // Used to handle scrolling the nav correctly no
    // matter whether cards are open or their dimensions
    this.props.onMounted({
      cardId:    this.props.cardId,
      offsetTop: this.refs.card.offsetTop
    })
  }

  shouldComponentUpdate (nextProps) {
    return (
      this.props.isHovered !== nextProps.isHovered ||
      this.props.isOpened !== nextProps.isOpened
    )
  }

  render () {
    const style   = {background: this.props.fill || '#ccc'}
    const cardCls = this.props.isOpened ? 'card__content--open' : 'card__content'

    if (this.props.isOpened || this.props.isHovered) style.width = '100%'

    return (
      <li ref="card" id={this.props.cardId} className={styles['card']}>
        <button className={styles['card__btn']} onClick={this.props.onClick}>
          <span className={styles['card__btn__prompt']} style={style} />
          <span className={styles['card__btn__text']}>{this.props.name}</span>
        </button>
        {this.content
          ? <div className={styles[cardCls]}>{this.content}</div>
          : false
        }
      </li>
    )
  }
}

Card.propTypes = {
  cardId:    PropTypes.string.isRequired,
  name:      PropTypes.string.isRequired,
  fill:      PropTypes.string,
  desc:      PropTypes.string,
  onClick:   PropTypes.func.isRequired,
  onMounted: PropTypes.func.isRequired,

  isHovered: PropTypes.bool.isRequired,
  isOpened:  PropTypes.bool.isRequired
}

export default Card
