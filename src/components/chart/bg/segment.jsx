import React, {PropTypes} from 'react'

const Segment = ({id, fill, d, onSegmentHover, onSegmentLeave}) => {
  return (
    <path id={id} fill={fill} d={d}
      onMouseEnter={onSegmentHover}
      onMouseLeave={onSegmentLeave}/>
  )
}

Segment.propTypes = {
  fill:           PropTypes.string.isRequired,
  d:              PropTypes.string.isRequired,
  onSegmentHover: PropTypes.func.isRequired,
  onSegmentLeave: PropTypes.func.isRequired
}

export default Segment
