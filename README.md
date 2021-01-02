# Currency Exchanger

Mini application which allows to check exchange rates between various currencies, taken from <https://exchangeratesapi.io/> and <https://api.binance.com/api/v3/ticker/price>.

## Project configuration

It uses:

- Vue 3,
- Composition API (in JavaScript),
- PWA extension.

## Architecture

To keep things as simple as possible, it consists of 4 components (including `App.vue` and separate component for view), 3 composables/mixins and 1 data class.

### Data class (`ExchangeApi`)

It is used to standarize values returned from the APIs. It does nothing, but provides standard interface: list of currencies available in the API and function which converts value from on currency to another using the specific API.

### Composables

There is one composable for each API + one used to combine them and expose to components in convenient way. Both API composables take care of dealing with each specific API - processing returned JSON-s and creating instance of `ExchangeApi`. Both of them internally keep object with exchange rates between predefined `BASE` currency and all the others. It is used in coversion function.
Fiat exchange API does not require much processing, as it returns the data nearly in the correct format out of the box. Binance API is more complicated.

#### Binance API

Firstly, `cryptoExchangeApi` takes the data from `exchangeInfo` and `ticker/price` endpoints. Exchange info gives information about available symbols, ticker-price about exchange rates between some of them. Then, some of the `BASE`-other exchange rates can be read directly from the API response, but some are unavailable and need to be calculated from the others, ex.:

- BTC and ETH rate is known
- BTC and XYZ rate is uknown
- ETH and XYZ rate is known

-> BTC and XYZ rate can be calculated using BTC-ETH and ETH-XYZ rates.

#### API combiner

Arbitrary number of APIs can be combined together with API combiner. They just need to be wrapped in a dedicated processing function and return `ExchangeApi`. `apiCombiner` relies on some *COMMON* currency available in all the APIs. In short, it converts input to *COMMON*, then *COMMON* to target currency. That way both fiat and cryptocurrencies can be mixed as long as there is some common ground (in the project it's `EUR`). It also returns instance of `ExchangeApi`, so can be easily swapped with dedicated scripts in components.

### Components

There are only two components worth mentioning:

- `BaseSelectSorted` - it's presentational component used as currency picker. It sorts provided values and properly updates passed model to match the selected value. It wraps HTML `select`
- `CurrencyExchanger` - main component which uses logic provided by composables. It displays input for providing number to exchange and two `BaseSelectSorted` to pick source and target currencies. Additionaly, there's SWAP button easily swap source and target currency

## Caching

To reduce network usage, data is cached using service worker. Due to different nature of APIs, they are handled differently:

- fiat API responses are cached until midnight, because the data on the server is updated only then;
- binance API responses are cached until midnight, but `network first` approach is used, as they are updated very frequently. That way, if app is online, it uses the most current data and caches the response so it can be used when there is problem with the internet.

## Other

It may be beneficial to write the whole project in TypeScript, but Vue 3 is quite new and it is sometimes hard to find relevant answers when problems arise. For the same reason it was cumbersome to use [Vue Styleguidist](https://github.com/vue-styleguidist) to generate docs - it is not yet compatible with Vue 3.
