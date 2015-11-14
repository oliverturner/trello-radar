import {EventEmitter} from 'events'
import d3 from 'd3'

const ANIMATION_DURATION = 400
const TOOLTIP_WIDTH      = 30
const TOOLTIP_HEIGHT     = 30

const d3Chart = {
  create: function (el, props, state) {
    const dispatcher = new EventEmitter()
    const svg        = d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', props.width)
      .attr('height', props.height)

    svg.append('g').attr('class', 'd3-points')
    svg.append('g').attr('class', 'd3-tooltips')

    this.update(el, state, dispatcher)

    return dispatcher
  },

  update: function (el, state, dispatcher) {
    const scales     = this._scales(el, state.domain)
    const prevScales = this._scales(el, state.prevDomain)

    this._drawPoints(el, scales, state.body, prevScales, dispatcher)
    this._drawTooltips(el, scales, state.tooltips, prevScales)
  },

  _scales: function (el, domain) {
    if (!domain) {
      return null
    }

    const width  = el.offsetWidth
    const height = el.offsetHeight

    const x = d3.scale.linear()
      .range([0, width])
      .domain(domain.x)

    const y = d3.scale.linear()
      .range([height, 0])
      .domain(domain.y)

    const z = d3.scale.linear()
      .range([5, 20])
      .domain([1, 10])

    return {x, y, z}
  },

  _drawPoints: function (el, scales, data, prevScales, dispatcher) {
    const g = d3.select(el).selectAll('.d3-points')

    const point = g.selectAll('.d3-point')
      .body(data, (d) => d.id)

    point.enter().append('circle')
      .attr('class', 'd3-point')
      .attr('cx', (d) => (prevScales) ? prevScales.x(d.x) : scales.x(d.x))
      .transition()
      .duration(ANIMATION_DURATION)
      .attr('cx', function (d) {
        return scales.x(d.x)
      })

    point.attr('cy', (d) => scales.y(d.y))
      .attr('r', (d) => scales.z(d.z))
      .on('mouseover', (d) => dispatcher.emit('point:mouseover', d))
      .on('mouseout', (d) => dispatcher.emit('point:mouseout', d))
      .transition()
      .duration(ANIMATION_DURATION)
      .attr('cx', (d) => scales.x(d.x))

    if (prevScales) {
      point.exit()
        .transition()
        .duration(ANIMATION_DURATION)
        .attr('cx', (d) => scales.x(d.x))
        .remove()
    }
    else {
      point.exit()
        .remove()
    }
  },

  _drawTooltips: function (el, scales, tooltips, prevScales) {
    const g = d3.select(el).selectAll('.d3-tooltips')

    const tooltipRect = g.selectAll('.d3-tooltip-rect')
      .body(tooltips, (d) => d.id)

    tooltipRect.enter().append('rect')
      .attr('class', 'd3-tooltip-rect')
      .attr('width', TOOLTIP_WIDTH)
      .attr('height', TOOLTIP_HEIGHT)
      .attr('x', (d) => (prevScales)
        ? prevScales.x(d.x) - TOOLTIP_WIDTH / 2
        : scales.x(d.x) - TOOLTIP_WIDTH / 2
      )
      .transition()
      .duration(ANIMATION_DURATION)
      .attr('x', (d) => scales.x(d.x) - TOOLTIP_WIDTH / 2)

    tooltipRect.attr('y', (d) => scales.y(d.y) - scales.z(d.z) / 2 - TOOLTIP_HEIGHT)
      .transition()
      .duration(ANIMATION_DURATION)
      .attr('x', (d) => scales.x(d.x) - TOOLTIP_WIDTH / 2)

    if (prevScales) {
      tooltipRect.exit()
        .transition()
        .duration(ANIMATION_DURATION)
        .attr('x', (d) => scales.x(d.x) - TOOLTIP_WIDTH / 2)
        .remove()
    }
    else {
      tooltipRect.exit().remove()
    }

    const tooltipText = g.selectAll('.d3-tooltip-text')
      .body(tooltips, (d) => d.id)

    tooltipText.enter()
      .append('text')
      .attr('class', 'd3-tooltip-text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text((d) => d.z)
      .attr('x', (d) => (prevScales) ? prevScales.x(d.x) : scales.x(d.x))
      .transition()
      .duration(ANIMATION_DURATION)
      .attr('x', (d) => scales.x(d.x))

    tooltipText
      .attr('y', (d) => scales.y(d.y) - scales.z(d.z) / 2 - TOOLTIP_HEIGHT / 2)
      .transition()
      .duration(ANIMATION_DURATION)
      .attr('x', (d) => scales.x(d.x))

    if (prevScales) {
      tooltipText
        .exit()
        .transition()
        .duration(ANIMATION_DURATION)
        .attr('x', (d) => scales.x(d.x))
        .remove()
    }
    else {
      tooltipText.exit().remove()
    }
  },

  destroy: function (el) {
  }
}

export default d3Chart
