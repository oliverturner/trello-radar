class Card {
  constructor ({id, idLabels, idList, name, desc}) {
    this.id      = id
    this.idLabel = idLabels[0]
    this.idList  = idList
    this.name    = name
    this.desc    = desc

    this.segmentKey = `${this.idLabel}-${this.idList}`
  }

  setSegment ({sIndex, sCount, quadrantId, horizonId, qIndex, hIndex, fill}) {
    this.sIndex     = sIndex
    this.sCount     = sCount
    this.quadrantId = quadrantId
    this.horizonId  = horizonId
    this.qIndex     = qIndex
    this.hIndex     = hIndex
    this.fill       = fill

    return this
  }
}

export default Card
