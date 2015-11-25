import d3 from 'd3'

class Metrics {
  constructor () {
    this.width    = 800
    this.height   = 600
    this.innerRad = 2
  }

  init (quadNum, horizonNum) {
    this.quadNum    = quadNum
    this.horizonNum = horizonNum

    this.quadAngle    = 2 * Math.PI / this.quadNum
    this.textAngle    = 360 / this.quadNum
    this.horizonWidth = (this.width > this.height ? this.height : this.width) / 2
    this.horizonMax   = this.horizonNum + this.innerRad
    this.horizonUnit  = this.horizonWidth / this.horizonMax
    this.colourScale  = d3.scale.category10()
    this.labelDX      = this.getHorizonRad(1)
  }

  getSegmentFill (qIndex, hIndex) {
    const rgb = d3.rgb(this.colourScale(qIndex))

    return rgb.brighter(hIndex / this.horizonNum * 3)
  }

  getSegmentArc (qIndex, hIndex) {
    return d3.svg.arc()
      .innerRadius((d) => this.getHorizonRad(hIndex))
      .outerRadius((d) => this.getHorizonRad(hIndex + 1))
      .startAngle((d)  => qIndex * this.quadAngle + Math.PI / 2)
      .endAngle((d)    => (qIndex + 1) * this.quadAngle + Math.PI / 2)
  }

  getHorizonRad (hIndex) {
    const min = hIndex + this.innerRad

    return min / this.horizonMax * this.horizonWidth
  }

  getBlipTheta (sCount, sIndex, qIndex) {
    const posAngle  = (1 / (sCount + 1)) * (sIndex + 1)
    const quadDelta = this.quadAngle * qIndex

    return (posAngle * this.quadAngle) + quadDelta
  }

  getBlipRadius (sCount, sIndex, hIndex) {
    let stagger = 0.5
    if (sCount > hIndex + 1) {
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
