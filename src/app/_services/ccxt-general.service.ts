import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs';
import * as ccxt from 'ccxt';
import { CifrardescifrarService } from '../_services/cifrardescifrar.service';
import { TokenStorageService } from '../_services/token-storage.service';


@Injectable({
  providedIn: 'root'
})
export class CcxtGeneralService {

  constructor(private cifrarDescifrarService: CifrardescifrarService, private token: TokenStorageService) { }
  private currentUser = this.token.getUser();
  private exchanges: string[] = ['kraken','binance'];

  private msgError = 'EL EXCHANGE NO ESTA SOPORTADO';

  public getAllExchanges() {
    return ccxt.exchanges;
  }

  private getSecret(exchangeName: string){
    let resul;
    if(exchangeName == this.exchanges[0]){
      resul = this.decryptAES(this.currentUser.krakenSecret);
    }
    else if(exchangeName == this.exchanges[1]){
      resul = this.decryptAES(this.currentUser.binanceSecret);
    }
    else{
      resul = this.msgError;
    }
    return resul;
  }

  private getAPIpublic(exchangeName: string){
    let resul;
    if(exchangeName == this.exchanges[0]){
      resul = this.decryptAES(this.currentUser.krakenPublic);
    }
    else if(exchangeName == this.exchanges[1]){
      resul = this.decryptAES(this.currentUser.binancePublic);
    }
    else{
      resul = this.msgError;
    }
    return resul;
  }

  private decryptAES(strCifrado: string){
    const str = this.cifrarDescifrarService.decryptUsingAES256(strCifrado);
    return str.slice(1,str.length-1);
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

      //let orderBook = await (exchange.fetchL2OrderBook(symbol, limit));
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
      exchange.apiKey = this.getAPIpublic(exchangeName);
      exchange.secret = this.getSecret(exchangeName);
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
}
