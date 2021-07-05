import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs';
import * as ccxt from 'ccxt';

@Injectable({
  providedIn: 'root'
})
export class CcxtGeneralService {

  constructor() { }

  public getAllExchanges() {
    return ccxt.exchanges;
  }

  private getSecret(){
    return 'uQ9M4KgtzmfozUWklj6yvRB2IVO53OMRc8bF6IuRpnFsADKI4zWXzqilAuwhTuvg';//private_api_key
  }

  private getAPIpublic(){
    return '4vg5VDcoSY1JcBQH77q2uFgBbtm0tZQdwOoYgV6Tdl7yVsVOvdcfqn6hN2AHU5vy';//public_api_key
  }

  public async getKrakenPrice(){
    let kraken = new ccxt.kraken();
    kraken.proxy = 'https://cors-anywhere.herokuapp.com/';
    let ticker = await (kraken.fetchTicker('BTC/USDT'));

    let returnString = ticker.high;
    return returnString;
  }

  public async getLastTradePrice(symbol: string, exchangeName: string){
    let exchange = this.crearExchange(exchangeName);
    exchange.proxy = 'https://cors-anywhere.herokuapp.com/';
    let ticker = await (exchange.fetchTicker(symbol));

    return ticker.close;
  }

  public async getTicker(symbol: string, exchangeName: string){
    let exchange = this.crearExchange(exchangeName);
    exchange.proxy = 'http://localhost:4202/';
    let ticker = await (exchange.fetchTicker(symbol));

    return ticker;
  }
  // Verificar si un exchange tiene candlesticks
  public async getOHLC(symbol: string, exchangeName: string){
    let exchange = this.crearExchange(exchangeName);
    let responseString = 'hello';
    exchange.proxy = 'http://localhost:4202/';
    if (exchange.has.fetchOHLCV) {
      responseString = 'exchange has ohlc';
    }
    else {
      responseString = 'Does not have ohlc';
    }

    return responseString;
  }

  public async getOHLCV(symbol: string, exchangeName: string){
    let exchange = this.crearExchange(exchangeName);
    exchange.proxy = 'http://localhost:4202/';

    let today = new Date();
    let oneDayTime = 24 * 60 * 60 * 1000;
    let yesterday = new Date(today.getTime() - oneDayTime);
    yesterday.setHours(0, 0, 0, 0);
    let ohlcv = await exchange.fetchOHLCV (symbol, '1h', yesterday.getTime());

    return ohlcv;
  }

  public async getOrderBook(symbol: string, exchangeName: string){
    let exchange = this.crearExchange(exchangeName);
    let resul = undefined;
    if(exchange !== undefined){
      let limit = 5;
      exchange.proxy = 'http://localhost:4202/';

      let orderBook = await (exchange.fetchL2OrderBook(symbol, limit));
      resul = orderBook;
    }
    else{
      alert('EL NOMBRE DEL EXCHANGE NO ESTA IMPLEMENTADO O ES ERRONEO');
    }
    return resul;
  }

  private crearExchange(exchangeName: string){
    let resul;
    if(exchangeName == 'binance'){
      resul = new ccxt.binance();
    }
    else if(exchangeName == 'bitvavo'){
      resul = new ccxt.bitvavo();
    }
    else{
      resul = new ccxt.kraken();
    }
    return resul;
  }

  public async getLastTrades(symbol: string, exchangeName: string){
    let exchange = this.crearExchange(exchangeName);
    exchange.proxy = 'http://localhost:4202/';

    let today = new Date();
    let oneHourTime = 60 * 60 * 1000;
    let placeholder = new Date(today.getTime() - oneHourTime);
    let trades = await (exchange.fetchTrades(symbol, placeholder.getTime()));

    return trades;
  }


  public async getAccountBalance(exchangeName: string){
    let exchange = this.crearExchange(exchangeName);
    let resul = {};
    if(exchange !== undefined){
      exchange.proxy = 'http://localhost:4202/';
      exchange.apiKey = this.getAPIpublic();
      exchange.secret = this.getSecret();
      let balance = await (exchange.fetchBalance());
      resul = balance.total;
    }
    else{
      alert('EL NOMBRE DEL EXCHANGE NO ESTA IMPLEMENTADO O ES ERRONEO');
    }
    return resul;
  }

  public async getPriceActivoEUR(symbol: string, exchangeName: string){
    let exchange = this.crearExchange(exchangeName);
    let resul = 0;
    if(exchange !== undefined){
      exchange.proxy = 'http://localhost:4202/';
      let ticker = await (exchange.fetchTicker(symbol));
      resul = ticker.bid;
    }
    else{
      alert('EL NOMBRE DEL EXCHANGE NO ESTA IMPLEMENTADO O ES ERRONEO');
    }
    return resul;
  }

  public async getOpenOrders(exchangeName: string, pair: string){
    let exchange = this.crearExchange(exchangeName);
    let resul = undefined;
    exchange.proxy = 'http://localhost:4202/';
    if(exchange.has['fetchOpenOrders']){
      exchange.apiKey = this.getAPIpublic();
      exchange.secret = this.getSecret();
      resul = await (exchange.fetchOpenOrders(pair, 10));
    }
    else{
      alert('NO TIENE OPENORDERS');
    }
    return resul;
  }

  public async getExchangeSymbols(exchangeName: string){
    let exchange =  this.crearExchange(exchangeName);
    exchange.proxy = 'http://localhost:4202/';
    let symbols = (await exchange.loadMarkets ());
    let usableSymbols = await (exchange.symbols);
    return usableSymbols;
  }
}
