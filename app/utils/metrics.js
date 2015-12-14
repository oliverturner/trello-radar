import {arc} from 'd3-shape'
import color from 'd3-color'

const getArea = (r) => Math.pow(r, 2) * Math.PI

class Metrics {
  constructor () {
    this.width        = 800
    this.height       = 600
    this.horizonWidth = (this.width > this.height ? this.height : this.width) / 2
    this.aMax         = getArea(this.horizonWidth)
  }

  init (quadNum, horizonNum) {
    this.quadNum    = quadNum
    this.horizonNum = horizonNum

    this.hMax          = this.horizonNum + 1
    this.aConst        = this.aMax / this.horizonNum
    this.rads          = this.calcRadii(this.hMax, this.aConst)
    this.horizonWidths = this.calcHorizonWidths(this.horizonNum, this.rads)

    this.quadAngle   = 2 * Math.PI / this.quadNum
    this.colourScale = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
    this.arc         = arc()
  }

  calcRadii (n, aConst) {
    return Array(n).fill().map((_, i) => {
      const index = i === 0 ? 1 : i
      const area  = index * aConst
      const rad   = Math.sqrt(area / Math.PI)

      return (i === 0) ? rad / 2 : rad
    })
  }

  calcHorizonWidths (n, rads) {
    return Array(n).fill().map((_, i) => {
      const inner = rads[i]
      const outer = rads[i + 1]

      return (outer - inner)
    })
  }

  getSegmentFill (qIndex, hIndex) {
    const rgb = color.rgb(this.colourScale[qIndex])

    return rgb.brighter(hIndex / this.horizonNum * 3)
  }

  getSegmentArc (qIndex, hIndex) {
    return this.arc({
      innerRadius: this.getHorizonRad(hIndex),
      outerRadius: this.getHorizonRad(hIndex + 1),
      startAngle:  qIndex * this.quadAngle + Math.PI / 2,
      endAngle:    (qIndex + 1) * this.quadAngle + Math.PI / 2
    })
  }

  getHorizonRad (hIndex) {
    return this.rads[hIndex]
  }

  getBlipTheta (sCount, sIndex, qIndex) {
    const posAngle  = (1 / (sCount + 1)) * (sIndex + 1)
    const quadDelta = this.quadAngle * qIndex

    return (posAngle * this.quadAngle) + quadDelta
  }

  getBlipRadius (sCount, sIndex, hIndex) {
    let stagger = 0.5
    if (sCount > hIndex + 4) {
      stagger = sIndex % 2 ? 0.75 : 0.25
    }

    return this.getHorizonRad(hIndex) + (this.horizonWidths[hIndex] * stagger)
  }

  polarToCartesian (r, theta) {
    var x = r * Math.cos(theta)
    var y = r * Math.sin(theta)

    return [x, y]
  }
}

const metrics = new Metrics()

export default metrics
