import d3 from 'd3'

function polarToCartesian (r, t) {
  var x = r * Math.cos(t)
  var y = r * Math.sin(t)
  return [x, y]
}

function identity (i) {
  return i
}

function getQuadrantDelta (quadrants, quadAngle, historyQuad) {
  let quadrantDelta = 0

  // figure out which quadrant this is
  quadrants.forEach((quadrant, index) => {
    if (quadrant === historyQuad) {
      quadrantDelta = quadAngle * index
    }
  })

  return quadrantDelta
}

class Radar {
  static width  = 800
  static height = 600

  static _calcMetrics (data) {
    const quadNum      = data.quadrants.length
    const horizonNum   = data.horizons.length
    const horizonWidth = 0.95 * (Radar.width > Radar.height ? Radar.height : Radar.width) / 2
    const quadAngle    = 2 * Math.PI / quadNum
    const horizonUnit  = horizonWidth / horizonNum
    const colorScale   = d3.scale.category10()

    return {
      quadNum,
      quadAngle,
      horizonNum,
      horizonUnit,
      horizonWidth,
      colorScale
    }
  }

  constructor (id, data) {
    this.id   = id
    this.data = data
    this.svg  = this._initSVG()
    this.base = this._initBase()

    this.metrics = Radar._calcMetrics(data)

    this._addHorizons()
    this._addQuadrants()
    this._drawArrow()
  }

  _initSVG () {
    return d3.select(this.id).append('svg')
      .attr('viewBox', `0 0 ${Radar.width} ${Radar.height}`)
  }

  _initBase () {
    const cx = Radar.width / 2
    const cy = Radar.height / 2

    return this.svg.append('g')
      .attr('transform', `translate(${cx}, ${cy})`)
  }

  _drawArrow () {
    this.svg.append('marker')
      .attr('id', 'arrow')
      .attr('orient', 'auto')
      .attr('markerWidth', '2')
      .attr('markerHeight', '4')
      .attr('refX', 0.1)
      .attr('refY', 2)
      .append('path').attr('d', 'M0,0 V4 L2,2 Z')
  }

  _addHorizons () {
    const horizons = this.base
      .append('g')
      .attr('class', 'horizons')

    horizons.selectAll('.horizon')
      .data(this.data.horizons, identity)
      .enter()
      .append('circle')
      .attr('r', (d, i) => (i + 1) * this.metrics.horizonUnit)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('class', 'horizon')
  }

  _addQuadrants () {
    const svgQuadrants = this.base
      .append('g')
      .attr('class', 'quadrants')

    function quadrantClass (d) {
      return 'quadrant quadrant--' + d.name.toLowerCase().replace(/ /, '-')
    }

    const arcFunction = d3.svg.arc()
      .outerRadius((d) => d.outerRadius * this.metrics.horizonWidth)
      .innerRadius((d) => d.innerRadius * this.metrics.horizonWidth)
      .startAngle((d) => d.quadrant * this.metrics.quadAngle + Math.PI / 2)
      .endAngle((d) => (d.quadrant + 1) * this.metrics.quadAngle + Math.PI / 2)

    const quads = []
    for (var i = 0, ilen = this.metrics.quadNum; i < ilen; i++) {
      const qName = this.data.quadrants[i]
      for (var j = 0; j < this.metrics.quadNum; j++) {
        quads.push({
          outerRadius: (j + 1) / this.metrics.quadNum,
          innerRadius: j / this.metrics.quadNum,
          quadrant:    i,
          horizon:     j,
          name:        qName
        })
      }
    }

    const textAngle = (360 / this.metrics.quadNum)

    svgQuadrants.selectAll('path.quadrant')
      .data(quads)
      .enter()
      .append('path')
      .attr('d', arcFunction)
      .attr('fill', (d) => {
        const rgb = d3.rgb(this.metrics.colorScale(d.quadrant))
        return rgb.brighter(d.horizon / this.metrics.horizonNum * 3)
      })
      .attr('class', quadrantClass)

    svgQuadrants.selectAll('text.quadrant')
      .data(quads.filter((d) => d.horizon === 0))
      .enter()
      .append('text')
      .attr('class', 'quadrant')
      .attr('dx', this.metrics.horizonWidth / this.metrics.horizonNum)
      .attr('transform', (d) => 'rotate(' + (d.quadrant * textAngle + textAngle) + ')')
      .text((d) => d.name)
  }

  _processRadarData (blipData, currentTime = new Date()) {
    // go through the data
    return blipData.map((entry, index) => {
      const history       = entry.history.filter((e) =>
        (e.end === null || (e.end > currentTime && e.start < currentTime))
      )[0]
      const quadrantDelta = getQuadrantDelta(this.data.quadrants, this.metrics.quadAngle, history.quadrant)
      const theta         = (history.positionAngle * this.metrics.quadAngle) + quadrantDelta
      const r             = history.position * this.metrics.horizonWidth
      const cart          = polarToCartesian(r, theta)

      const blip = {
        id:       index,
        name:     entry.name,
        quadrant: history.quadrant,
        r:        r,
        theta:    theta,
        x:        cart[0],
        y:        cart[1]
      }

      if (history.direction) {
        const r2     = history.direction * this.metrics.horizonWidth
        const theta2 = (history.directionAngle * this.metrics.quadAngle) + quadrantDelta
        const vector = polarToCartesian(r2, theta2)

        blip.dx = vector[0] - cart[0]
        blip.dy = vector[1] - cart[1]
      }

      return blip
    })
  }

  // Public API
  //-----------------------------------------------
  draw (data) {
    const blipData = this._processRadarData(data)

    blipData.sort(
      function (a, b) {
        if (a.quadrant < b.quadrant) return -1
        if (a.quadrant > b.quadrant) return 1
        return 0
      })

    const blips = this.base.selectAll('.blip')
      .data(blipData)
      .enter().append('g')
      .attr('class', 'blip')
      .attr('id', (d) => 'blip-' + d.id)
      .attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')

    blips.append('line')
      .attr('class', 'direction')
      .attr('x1', 0).attr('y1', 0)
      .attr('x2', (d) => d.dx)
      .attr('y2', (d) => d.dy)

    blips.append('circle')
      .attr('r', '7px')

    blips.append('text')
      .attr('dy', '20px')
      .style('text-anchor', 'middle')
      .attr('class', 'name')
      .text((d) => d.name)

    // add the lists
    const ul = d3.select(this.id).append('ul')

    ul.selectAll('li.quadrant')
      .data(blipData)
      .enter()
      .append('li')
      .attr('class', 'quadrant')
      .text((d) => d.name)
  }
}

export default Radar
