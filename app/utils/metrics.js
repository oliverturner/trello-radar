import {arc} from 'd3-shape'
import color from 'd3-color'

class Metrics {
  constructor () {
    this.width    = 800
    this.height   = 600
    this.innerRad = 1
  }

  init (quadNum, horizonNum) {
    this.quadNum    = quadNum
    this.horizonNum = horizonNum

    this.quadAngle    = 2 * Math.PI / this.quadNum
    this.horizonWidth = (this.width > this.height ? this.height : this.width) / 2
    this.horizonMax   = this.horizonNum + this.innerRad
    this.horizonUnit  = this.horizonWidth / this.horizonMax
    this.colourScale  = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
    //this.colourScale  = ['#a559ff', '#e059ff', '#ff59d3', '#ff595b', '#ff7f59', '#ffa159', '#ffb559', '#ffc959', '#bcbd22', '#17becf']
    this.arc          = arc()
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
    return (hIndex + this.innerRad) * this.horizonUnit
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

    return this.getHorizonRad(hIndex) + (this.horizonUnit * stagger)
  }

  polarToCartesian (r, theta) {
    var x = r * Math.cos(theta)
    var y = r * Math.sin(theta)

    return [x, y]
  }
}

const metrics = new Metrics()

export default metrics
