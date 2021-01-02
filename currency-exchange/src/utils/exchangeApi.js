/**
 * @class ExchangeApi
 * @type {Object}
 * @property {Array.<string>} currencies Currencies available in the API
 * @property {function(string, string, number)} convert API conversion function
 */
export class ExchangeApi {
  constructor(currencies, convert) {
    (this.currencies = currencies), (this.convert = convert);
  }
}
