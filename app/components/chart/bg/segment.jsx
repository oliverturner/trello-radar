import React from 'react'

const Segment = ({quadrantId, horizonId, onHover, ...props}) => {
  return <path {...props}
               onMouseEnter={() => onHover(quadrantId, horizonId)}
               onMouseLeave={() => onHover()}/>
}

export default Segment
