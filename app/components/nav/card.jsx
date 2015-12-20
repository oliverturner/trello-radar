import React, {Component, PropTypes} from 'react'
import Collapse from 'react-collapse'
import {connect} from 'react-redux'
import {markdown} from 'markdown'

import styles from './style.scss'

const getDescription = (desc = '', isOpened = false) => {
  if (desc.length === 0) return

  desc = markdown.toHTML(desc)
  return (
    <Collapse isOpened={isOpened}>
      <div className={styles['card__desc']} dangerouslySetInnerHTML={{__html: desc }}/>
    </Collapse>
  )
}

const Card = ({id, name, fill, desc, isOpened, isHovered, onClick}) => {
  const style = {background: fill || '#ccc'}

  if (isOpened || isHovered) style.width = '100%'

  return (
    <li className={styles['card']}>
      <p className={styles['card__label']} onClick={() => onClick(id)}>
        <span className={styles['card__label__prompt']} style={style}/>
        <span className={styles['card__label__text']}>{name}</span>
      </p>
      {getDescription(desc, isOpened)}
    </li>
  )
}

export default Card
