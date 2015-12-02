import React from 'react'

const Segment = ({id, d, fill, horizonId, onHover}) => {
  return <path id={id} d={d} fill={fill}
               onMouseEnter={onHover.bind(null, horizonId)}
               onMouseLeave={onHover.bind(null, null)}/>
}

export default Segment
