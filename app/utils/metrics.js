import d3 from 'd3'

const width    = 800
const height   = 600
const innerRad = 2

export default function (quadNum, horizonNum) {
  const quadAngle    = 2 * Math.PI / quadNum
  const textAngle    = (360 / quadNum)
  const horizonWidth = (width > height ? height : width) / 2
  const horizonUnit  = horizonWidth / (horizonNum + innerRad)
  const colourScale  = d3.scale.category10()

  return {
    width,
    height,
    quadNum,
    quadAngle,
    textAngle,
    horizonNum,
    horizonUnit,
    horizonWidth,
    innerRad,
    colourScale
  }
}
