import React from 'react'

export default ({arcFn, fill}) => {
  return <path d={arcFn()} fill={fill}/>
}
