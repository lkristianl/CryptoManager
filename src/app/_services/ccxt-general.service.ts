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

  public async getKrakenPrice(){
    let kraken = new ccxt.kraken();
    kraken.proxy = 'https://cors-anywhere.herokuapp.com/';
    let ticker = await (kraken.fetchTicker('BTC/USDT'));

    let returnString = ticker.high;
    return returnString;
  }

  private getSecret(){
    return 'private_api_key';//private_api_key
  }

  private getAPIpublic(){
    return 'public_api_key';//public_api_key
  }
  // Verificar si Binance tiene candlesticks
  public async getKrakenOHLC(symbol: string){
    let kraken = new ccxt.kraken();
    let responseString;
    kraken.proxy = 'http://localhost:4202/';
    if (kraken.has.fetchOHLCV) {
      responseString = 'kraken has ohlc';
    }
    else {
      responseString = 'Does not have ohlc';
    }

    return responseString;
  }

  private crearExchange(exchangeName: string){
    let resul;
    if(exchangeName == 'kraken'){
      resul = new ccxt.kraken();
    }
    else if(exchangeName == 'binance'){
      resul = new ccxt.binance();
    }
    else{
      resul = undefined;
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
  // No se usa
  public async getPriceEUR(symbol: string){
    let kraken = new ccxt.kraken();
    kraken.proxy = 'http://localhost:4202/';
    let ticker = await (kraken.fetchOrderBook(symbol, 1));

    return ticker.bids[0][0];
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
}
