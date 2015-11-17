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

  /**
   * Calculate the basic metrics for the radar
   *
   * @param {number} quadNum
   * @param {number} horizonNum
   * @returns {{
   *   quadNum: number,
   *   quadAngle: number,
   *   horizonNum: number,
   *   horizonUnit: number,
   *   horizonWidth: number,
   *   colorScale
   * }}
   *
   * @private
   */
  static _calcMetrics (quadNum, horizonNum) {
    const quadAngle    = 2 * Math.PI / quadNum
    const horizonWidth = 0.95 * (Radar.width > Radar.height ? Radar.height : Radar.width) / 2
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

  // Public API
  //-----------------------------------------------
  /**
   * Initialise with basic sectors and assessments
   *
   * @param {string} id
   * @param {object} data
   * @param {Array} data.quadrants
   * @param {Array} data.horizons
   */
  constructor (id, data) {
    this.id   = id
    this.data = data
    this.svg  = this._initSVG()
    this.base = this._initBase()

    this.props = Radar._calcMetrics(data.quadrants.length, data.horizons.length)

    this._addHorizons()
    this._addQuadrants()
    this._drawArrow()
  }

  /**
   * @typedef  {Object} Entry
   * @property {Date}      start            Start date that this entry applies for
   * @property {Date|null} end              End date for the entry
   * @property {string}    quadrant         Quadrant label
   * @property {number}    position         0 - 1 Start point within the total of horizons. Larger = worse.
   * @property {number}    positionAngle    0 - 1 Horizontally within quadrant
   * @property {number}    direction        0 - 1 End point with the total of horizons. Larger = worse.
   * @property {number}    [directionAngle] Fraction of pi/2 (ie of a quadrant)
   */
  /**
   * @param {Array.<Entry>} entries
   * @param config
   */
  draw (entries, config = {lines: false}) {
    const blipData = this._processRadarData(entries)
      .sort(
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
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`)

    if (config.lines) {
      blips.append('line')
        .attr('class', 'direction')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', (d) => d.dx)
        .attr('y2', (d) => d.dy)
    }

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

  // Initialising methods
  //-----------------------------------------------
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
      .attr('r', (d, i) => (i + 1) * this.props.horizonUnit)
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
      .outerRadius((d) => d.outerRadius * this.props.horizonWidth)
      .innerRadius((d) => d.innerRadius * this.props.horizonWidth)
      .startAngle((d)  => d.quadrant * this.props.quadAngle + Math.PI / 2)
      .endAngle((d)    => (d.quadrant + 1) * this.props.quadAngle + Math.PI / 2)

    const quads = this.data.quadrants.reduce((ret, quad, i) => {
      for (var j = 0; j < this.props.horizonNum; j++) {
        ret.push({
          outerRadius: (j + 1) / this.props.horizonNum,
          innerRadius: j / this.props.horizonNum,
          quadrant:    i,
          horizon:     j,
          name:        quad
        })
      }

      return ret
    }, [])

    const textAngle = (360 / this.props.quadNum)

    svgQuadrants.selectAll('path.quadrant')
      .data(quads)
      .enter()
      .append('path')
      .attr('d', arcFunction)
      .attr('fill', (d) => {
        const rgb = d3.rgb(this.props.colorScale(d.quadrant))
        return rgb.brighter(d.horizon / this.props.horizonNum * 3)
      })
      .attr('class', quadrantClass)

    svgQuadrants.selectAll('text.quadrant')
      .data(quads.filter((d) => d.horizon === 0))
      .enter()
      .append('text')
      .attr('class', 'quadrant')
      .attr('dx', this.props.horizonWidth / this.props.horizonNum)
      .attr('transform', (d) => 'rotate(' + (d.quadrant * textAngle + textAngle) + ')')
      .text((d) => d.name)
  }

  _processRadarData (blipData, now = new Date()) {
    return blipData.map((entry, index) => {
      const history       = entry.history.filter((e) => (!e.end || (e.end > now && new Date(e.start) < now)))[0]
      const posAngle      = history.positionAngle || 0.5
      const dirAngle      = history.directionAngle || 0.5
      const quadrantDelta = getQuadrantDelta(this.data.quadrants, this.props.quadAngle, entry.quadrant)
      const theta         = (posAngle * this.props.quadAngle) + quadrantDelta
      const r             = history.position * this.props.horizonWidth
      const cart          = polarToCartesian(r, theta)

      const blip = {
        id:       index,
        name:     entry.name,
        quadrant: entry.quadrant,
        r:        r,
        theta:    theta,
        x:        cart[0],
        y:        cart[1]
      }

      if (history.direction) {
        const hR     = history.direction * this.props.horizonWidth
        const hTheta = (dirAngle * this.props.quadAngle) + quadrantDelta
        const vector = polarToCartesian(hR, hTheta)

        blip.dx = vector[0] - cart[0]
        blip.dy = vector[1] - cart[1]
      }

      return blip
    })
  }
}

export default Radar
