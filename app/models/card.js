class Card {
  constructor ({id, idLabels, idList, name, desc}) {
    this.id         = id
    this.quadrantId = idLabels[0]
    this.horizonId  = idList
    this.name       = name
    this.desc       = desc

    this.segmentKey = `${this.quadrantId}-${this.horizonId}`
    this.displayed  = true
  }

  setSegment ({sIndex, sCount, qIndex, hIndex, fill}) {
    this.sIndex = sIndex
    this.sCount = sCount
    this.qIndex = qIndex
    this.hIndex = hIndex
    this.fill   = fill

    return this
  }

  setDisplayed (displayed) {
    this.displayed = displayed

    return this
  }
}

export default Card
