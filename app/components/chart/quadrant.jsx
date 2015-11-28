import React from 'react'

export default ({id, arcFn, fill}) => <path id={id} d={arcFn()} fill={fill} />
