import metrics from '../utils/metrics'

class Segment {
  constructor ({id, quadrantId, horizonId, qIndex, hIndex, cardIds}) {
    this.id         = id
    this.quadrantId = quadrantId
    this.horizonId  = horizonId
    this.qIndex     = qIndex
    this.hIndex     = hIndex
    this.cardIds    = cardIds

    this.fill   = metrics.getSegmentFill(this.qIndex, this.hIndex)
    this.d      = metrics.getSegmentArc(this.qIndex, this.hIndex)
    this.sCount = this.cardIds ? this.cardIds.length : 0
  }

  getCardDetails (cardId) {
    const sIndex = this.cardIds ? this.cardIds.indexOf(cardId) : 0

    return ({sIndex, ...this})
  }
}

export default Segment
