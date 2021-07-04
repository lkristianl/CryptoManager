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
    return 'BJvnMCoc3iefFlB2wtP/I/c1kx+03mbwCZhpWDBfZr4LY+1cM07zXL5fdedD6P9+aMilrB1lECrBcq0sZSfgeQ==';//private_api_key uQ9M4KgtzmfozUWklj6yvRB2IVO53OMRc8bF6IuRpnFsADKI4zWXzqilAuwhTuvg
  }

  private getAPIpublic(){
    return '7JLRZAyfxhLq4AG6i/sciCKuUAbb4FgFWkaYccGBxovUsga+24Sppo2S';//public_api_key 4vg5VDcoSY1JcBQH77q2uFgBbtm0tZQdwOoYgV6Tdl7yVsVOvdcfqn6hN2AHU5vy 
  }

  public async getKrakenPrice(){
    let kraken = new ccxt.kraken();
    kraken.proxy = 'https://cors-anywhere.herokuapp.com/';
    let ticker = await (kraken.fetchTicker('BTC/USDT'));

    let returnString = ticker.high;
    return returnString;
  }

  public async getKrakenLastTradePrice(symbol: string){
    let kraken = new ccxt.kraken();
    kraken.proxy = 'https://cors-anywhere.herokuapp.com/';
    let ticker = await (kraken.fetchTicker(symbol));

    return ticker.close;
  }

  public async getKrakenTicker(symbol: string){
    let kraken = new ccxt.kraken();
    kraken.proxy = 'http://localhost:4202/';
    let ticker = await (kraken.fetchTicker(symbol));

    return ticker;
  }
  // Verificar si un exchange tiene candlesticks
  public async getKrakenOHLC(symbol: string){
    let kraken = new ccxt.kraken();
    let responseString = 'hello';
    kraken.proxy = 'http://localhost:4202/';
    if (kraken.has.fetchOHLCV) {
      responseString = 'kraken has ohlc';
    }
    else {
      responseString = 'Does not have ohlc';
    }

    return responseString;
  }

  public async getKrakenOHLCV(symbol: string){
    let kraken = new ccxt.kraken();
    kraken.proxy = 'http://localhost:4202/';

    let today = new Date();
    let oneDayTime = 24 * 60 * 60 * 1000;
    let yesterday = new Date(today.getTime() - oneDayTime);
    yesterday.setHours(0, 0, 0, 0);
    let ohlcv = await kraken.fetchOHLCV (symbol, '1h', yesterday.getTime());

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
    if(exchangeName == 'kraken'){
      resul = new ccxt.kraken();
    }
    else{
      resul = new ccxt.binance();
    }
    return resul;
  }

  public async getAccountBalance(exchangeName: string){
    let exchange = this.crearExchange(exchangeName);
    let resul = {};
    if(exchange !== undefined){
      exchange.proxy = 'http://localhost:4202/';
      exchange.apiKey = this.getAPIpublic();
      exchange.secret = this.getSecret();
      let balance = await (exchange.fetchBalance());
      console.log(balance);
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

  public async getClosedOrders(symbol: string, exchangeName: string){
    let exchange = this.crearExchange(exchangeName);
    let resul = undefined;
    exchange.proxy = 'http://localhost:4202/';
    if(exchange.has['fetchClosedOrders']){
      exchange.apiKey = this.getAPIpublic();
      exchange.secret = this.getSecret();
      resul = await (exchange.fetchClosedOrders(symbol, undefined, 10));
    }
    else{
      alert('NO TIENE OPENORDERS');
    }
    return resul;
  }
}
