import d3 from 'd3'

function polarToCartesian (r, t) {
  var x = r * Math.cos(t)
  var y = r * Math.sin(t)
  return [x, y]
}

function identity (i) {
  return i
}

/**
 * Figure out the current quadrantDelta
 *
 * @param {Array} quadrants
 * @param {number} quadAngle
 * @param {string} historyQuad
 * @returns {number}
 */
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

/**
 * Uses d3 to plot the radar
 *
 * @param {string} id
 * @param {Object} data
 * @param {number} data.width
 * @param {number} data.height
 * @param {Array}  data.data
 * @param {Array}  data.quadrants
 * @param {Array}  data.horizons
 */
function radar (id, data) {
  const width        = data.width || 800
  const height       = data.height || 600
  const cx           = width / 2
  const cy           = height / 2
  const horizonWidth = 0.95 * (width > height ? height : width) / 2
  const quadAngle    = 2 * Math.PI / data.quadrants.length
  const horizonUnit  = horizonWidth / data.horizons.length
  const colorScale   = d3.scale.category10()

  const svg = d3.select(id).append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)

  svg.append('marker')
    .attr('id', 'arrow')
    .attr('orient', 'auto')
    .attr('markerWidth', '2')
    .attr('markerHeight', '4')
    .attr('refX', 0.1)
    .attr('refY', 2)
    .append('path').attr('d', 'M0,0 V4 L2,2 Z')

  // add the horizons
  const base = svg.append('g')
    .attr('transform', 'translate(' + cx + ',' + cy + ')')

  addHorizons(base)
  addQuadrants(base)

  /**
   *
   * @param {Array}  blipData
   * @param {Array}  blipData.history
   * @param {number} blipData.history.positionAngle
   * @param {number} blipData.history.directionAngle
   * @param {number} blipData.history.direction
   * @param {string} blipData.history.quadrant
   * @param currentTime
   *
   * @returns {Array}
   */
  function processRadarData (blipData, currentTime = new Date()) {
    // go through the data
    return blipData.map((entry, index) => {
      const history       = entry.history.filter((e) =>
        (e.end === null || (e.end > currentTime && e.start < currentTime))
      )[0]
      const quadrantDelta = getQuadrantDelta(data.quadrants, quadAngle, history.quadrant)
      const theta         = (history.positionAngle * quadAngle) + quadrantDelta
      const r             = history.position * horizonWidth
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
        const r2     = history.direction * horizonWidth
        const theta2 = (history.directionAngle * quadAngle) + quadrantDelta
        const vector = polarToCartesian(r2, theta2)

        blip.dx = vector[0] - cart[0]
        blip.dy = vector[1] - cart[1]
      }

      return blip
    })
  }

  function addHorizons (base) {
    const horizons = base
      .append('g')
      .attr('class', 'horizons')

    horizons.selectAll('.horizon')
      .data(data.horizons, identity)
      .enter()
      .append('circle')
      .attr('r', (d, i) => (i + 1) * horizonUnit)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('class', 'horizon')
  }

  // add the quadrants
  function addQuadrants (base) {
    const svgQuadrants = base
      .append('g')
      .attr('class', 'quadrants')

    function quadrantClass (d) {
      return 'quadrant quadrant--' + d.name.toLowerCase().replace(/ /, '-')
    }

    const arcFunction = d3.svg.arc()
      .outerRadius((d) => d.outerRadius * horizonWidth)
      .innerRadius((d) => d.innerRadius * horizonWidth)
      .startAngle((d) => d.quadrant * quadAngle + Math.PI / 2)
      .endAngle((d) => (d.quadrant + 1) * quadAngle + Math.PI / 2)

    const hNum = data.horizons.length
    const quads = []
    for (var i = 0, ilen = data.quadrants.length; i < ilen; i++) {
      const qName = data.quadrants[i]
      for (var j = 0; j < hNum; j++) {
        quads.push({
          outerRadius: (j + 1) / hNum,
          innerRadius: j / hNum,
          quadrant:    i,
          horizon:     j,
          name:        qName
        })
      }
    }

    const textAngle = (360 / data.quadrants.length)

    svgQuadrants.selectAll('path.quadrant')
      .data(quads)
      .enter()
      .append('path')
      .attr('d', arcFunction)
      .attr('fill', (d) => {
        const rgb = d3.rgb(colorScale(d.quadrant))
        return rgb.brighter(d.horizon / data.horizons.length * 3)
      })
      .attr('class', quadrantClass)

    svgQuadrants.selectAll('text.quadrant')
      .data(quads.filter((d) => d.horizon === 0))
      .enter()
      .append('text')
      .attr('class', 'quadrant')
      .attr('dx', horizonWidth / data.horizons.length)
      .attr('transform', (d) => 'rotate(' + (d.quadrant * textAngle + textAngle) + ')')
      .text((d) => d.name)
  }

  function drawRadar (data) {
    const blipData = processRadarData(data)

    blipData.sort(
      function (a, b) {
        if (a.quadrant < b.quadrant) return -1
        if (a.quadrant > b.quadrant) return 1
        return 0
      })

    const blips = base.selectAll('.blip')
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
    const ul = d3.select(id).append('ul')

    ul.selectAll('li.quadrant')
      .data(blipData)
      .enter()
      .append('li')
      .attr('class', 'quadrant')
      .text((d) => d.name)
  }

  return {
    draw: drawRadar
  }
}

export default radar
