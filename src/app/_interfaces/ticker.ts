export interface Ticker {
  high: undefined | number; // Precio mas alto de las ultimas 24 horas
  low: undefined | number; // Precio mas bajo de las ultimas 24 horas
  lastTrade: undefined | number; // Precio de la ultima transaccion
  average: undefined | number; // Media del precio de las ultimas 24 horas
  baseVolume: undefined | number; // Volumen de las transacciones de la criptomoneda durante las ultimas 24 horas
}
