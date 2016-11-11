const observatory = require('observatory')
  .settings({
    prefix: '[base16] ',
    width: 80
  })

/** Represents an entity that can report its status */
class Reporter {
  /**
   * Creates a Reporter instance.
   * This creates a default reporting channel.
   *
   * @param {string} message - The initial message shown on the reporting channel created.
   */
  constructor (message) {
    this.reporter = Reporter.createChannel(message)
  }

  /**
   * Updates the status text on the default reporter channel.
   *
   * @param {string} message - The new status message to display.
   */
  report (message) {
    this.reporter.status(message)
    return this
  }

  /**
   * Creates a new reporter channel.
   *
   * @param {string} message - The initial message shown on the reporting channel created.
   * @returns {ObservatoryChannel}
   */
  static createChannel (message) {
    return observatory.add(message)
  }
}

module.exports = Reporter
