class Card {
  constructor ({id, idLabels, idList, name, desc}) {
    this.id        = id
    this.idLabel   = idLabels[0]
    this.idList    = idList
    this.name      = name
    this.desc      = desc
    this.displayed = false

    this.key = `${this.idLabel}-${this.idList}`

    // Remove
    this.idLabels = idLabels
  }

  setSegment (segment) {

  }
}

export default Card
