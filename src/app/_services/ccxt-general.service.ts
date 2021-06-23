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
    return 'SECRET_KEY';//SECRET_KEY
  }

  private getAPIpublic(){
    return 'PUBLIC_KEY';//PUBLIC_KEY
  }

  public async getKrakenPrice(){
    let kraken = new ccxt.kraken();
    kraken.proxy = 'https://cors-anywhere.herokuapp.com/';
    let ticker = await (kraken.fetchTicker('BTC/USDT'));

    let returnString = ticker.high;
    return returnString;
  }

  private getSecret(){
    return 'SECRET_KEY';//SECRET_KEY
  }

  private getAPIpublic(){
    return 'PUBLIC_KEY';//PUBLIC_KEY
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

  public async getKrakenOrderBook(symbol: string){
    let kraken = new ccxt.kraken();
    let limit = 5;
    kraken.proxy = 'http://localhost:4202/';

    let orderBook = await (kraken.fetchL2OrderBook(symbol, limit));

    return orderBook;
  }



}
