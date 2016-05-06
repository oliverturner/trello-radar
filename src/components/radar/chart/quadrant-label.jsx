import React, {PropTypes} from 'react'

import metrics from '../../../utils/metrics'

import styles from './styles.pcss'

const QuadrantLabel = ({name, arcId}) => {
  // NOTE: Attaching text to path has buggy behaviour in Firefox
  // Used to crash: @see https://bugzilla.mozilla.org/show_bug.cgi?id=1067695
  // Now simply doesn't render top and bottom labels

  // Attach the text to the path of the outermost Segment
  // (the linkage is the id of the Segment)
  const path = `<textPath xlink:href="#${arcId}">${name}</textPath>`

  // Anchor the text to the horizontal center of the segment
  const dx   = (Math.PI * metrics.horizonWidth * 2) / (metrics.quadNum * 2)

  // Push the text out from the center a tad
  const dy   = -6

  return (
    <text className={styles['quadrantlabel']} dx={dx} dy={dy}
      dangerouslySetInnerHTML={{__html: path }} />
  )
}

QuadrantLabel.propTypes = {
  name:  PropTypes.string.isRequired,
  arcId: PropTypes.string.isRequired
}

export default QuadrantLabel
