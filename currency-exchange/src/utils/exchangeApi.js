/**
 * @class ExchangeApi
 * @type {Object}
 * @property {Array.<string>} Currencies available in the API
 * @property {function(string, string, number)} API conversion function
 */
export class ExchangeApi {
  constructor(currencies, convert) {
    (this.currencies = currencies), (this.convert = convert);
  }
}
