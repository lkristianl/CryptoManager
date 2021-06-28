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
    return 'XSJTVAL8WVVb6RWM5YV6X179/633rhV1ekXE0/cnqYM0Ggsd9+IegtOVJ/rgub1mCPypmzvXAYot/27/ISrvcw==';//public_private_key
  }

  private getAPIpublic(){
    return 'Gd8R0E4b0odeej9fv1WLcYgQBgmXgOqPm9UIoTal22nYei7tDuOAECXa';//public_api_key
  }

  public async getKrakenBalance(){
    let kraken = new ccxt.kraken();
    kraken.proxy = 'http://localhost:4202/';
    kraken.apiKey = this.getAPIpublic();
    kraken.secret = this.getSecret();
    let balance = await (kraken.fetchBalance());

    return balance.total;
  }

  public async getKrakenPriceEUR(symbol: string){
    let kraken = new ccxt.kraken();
    kraken.proxy = 'http://localhost:4202/';
    let ticker = await (kraken.fetchOrderBook(symbol, 1));

    return ticker.bids[0][0];
  }

  public async getKrakenPriceE(symbol: string){
    let kraken = new ccxt.kraken();
    kraken.proxy = 'http://localhost:4202/';
    let ticker = await (kraken.fetchTicker(symbol));

    return ticker.bid;
  }
}
