import React, {PropTypes} from 'react'

const Segment = ({fill, d, onSegmentHover, onSegmentLeave}) => {
  return (
    <path fill={fill} d={d}
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
