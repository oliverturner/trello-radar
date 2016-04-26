let exported = {
  start: Function.prototype,
  stop:  Function.prototype
}

class PerfManager {
  constructor () {
    this.perf = require('react-addons-perf')
  }

  start () {
    this.perf.start()
  }

  stop () {
    this.perf.stop()
  }
}

if (process.env.NODE_ENV !== 'production') {
  exported = new PerfManager()
}

export default exported
