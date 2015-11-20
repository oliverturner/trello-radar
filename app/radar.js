import d3 from 'd3'

function polarToCartesian (r, t) {
  var x = r * Math.cos(t)
  var y = r * Math.sin(t)
  return [x, y]
}

function identity (i) {
  return i
}

function getQuadrantDelta (quadrants, quadAngle, currentQuad) {
  let quadrantDelta = 0

  // figure out which quadrant this is
  quadrants.forEach((quadrant, index) => {
    if (quadrant === currentQuad) {
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
   *
   * @returns {Metrics}
   */
  static _calcMetrics (quadNum, horizonNum) {
    const innerRad     = 2
    const quadAngle    = 2 * Math.PI / quadNum
    const horizonWidth = 0.95 * (Radar.width > Radar.height ? Radar.height : Radar.width) / 2
    const horizonUnit  = horizonWidth / (horizonNum + innerRad)
    const colorScale   = d3.scale.category10()

    return {
      quadNum,
      quadAngle,
      horizonNum,
      horizonUnit,
      horizonWidth,
      innerRad,
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

    console.log(this.props)

    this._addQuadrants()
    this._drawArrow()
  }

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
    const ul = d3.select(this.id)
      .append('ul')
      .attr('class', 'quadrants')

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
          outerRadius: (j + this.props.innerRad + 1) / (this.props.horizonNum + this.props.innerRad),
          innerRadius: (j + this.props.innerRad) / (this.props.horizonNum + this.props.innerRad),
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
      .attr('dx', this.props.horizonWidth / (this.props.horizonNum - this.props.innerRad))
      .attr('transform', (d) => `rotate(${d.quadrant * textAngle + textAngle})`)
      .text((d) => d.name)
  }

  _processRadarData (blipData) {
    const keys    = {}
    const ry      = this.props.horizonUnit / 2
    const ry2     = ry / 2
    const calcRad = (h) => {
      const min = h + this.props.innerRad
      const max = this.props.horizonNum + this.props.innerRad
      return min / max * this.props.horizonWidth
    }

    const blips = blipData
      .map((entry, index) => {
        return {
          id:       index,
          key:      entry.quadrant + '-' + entry.horizon,
          name:     entry.name,
          quadrant: entry.quadrant,
          horizon:  entry.horizon
        }
      })
      .map((blip) => {
        keys[blip.key] = keys[blip.key] ? ++keys[blip.key] : 1
        blip.keyIndex  = keys[blip.key]
        return blip
      })
      .map((blip, index) => {
        let stagger = 0
        if (keys[blip.key] > blip.horizon + 1) {
          stagger = index % 2 ? ry2 : -ry2
        }

        blip.r = calcRad(blip.horizon) + ry + stagger

        return blip
      })
      .map((blip) => {
        const posAngle      = (1 / (keys[blip.key] + 1)) * blip.keyIndex
        const quadrantDelta = getQuadrantDelta(this.data.quadrants, this.props.quadAngle, blip.quadrant)
        const theta         = (posAngle * this.props.quadAngle) + quadrantDelta
        const cart          = polarToCartesian(blip.r, theta)

        blip = Object.assign(blip, {
          theta: theta,
          x:     cart[0],
          y:     cart[1]
        })

        return blip
      })

    return blips
  }
}

export default Radar

/**
 * @typedef {Object} Metrics
 * @property {number}   quadNum
 * @property {number}   quadAngle
 * @property {number}   horizonNum
 * @property {number}   horizonUnit
 * @property {number}   horizonWidth
 * @property {number}   innerRad
 * @property {Function} colorScale
 * }
 */

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
