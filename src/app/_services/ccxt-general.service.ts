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

    let ohlcv = await kraken.fetchOHLCV (symbol, '1d', 1616101580000);

    return ohlcv;
  }



}
