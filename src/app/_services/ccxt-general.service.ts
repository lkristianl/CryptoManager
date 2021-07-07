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
      exchange.apiKey = this.getAPIpublic(exchangeName);
      exchange.secret = this.getSecret(exchangeName);
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
  //Comprobamos si las claves API funcionan
  public async checkAPIKeys(exchangeName: string){
    let exchange = this.crearExchange(exchangeName);
    let resul = true;
    exchange.proxy = 'http://localhost:4202/';
    exchange.apiKey = this.getAPIpublic(exchangeName);
    exchange.secret = this.getSecret(exchangeName);
    
    try{
      const check = await (exchange.fetchBalance());
    } catch (e){
      if(e instanceof ccxt.ExchangeError){
        resul = false;
      }
    }
    return resul;
  }
  public async getClosedOrders(symbol: string, exchangeName: string){
    let exchange = this.crearExchange(exchangeName);
    let resul = undefined;
    exchange.proxy = 'http://localhost:4202/';
    if(exchange.has['fetchClosedOrders']){
      exchange.apiKey = this.getAPIpublic(exchangeName);
      exchange.secret = this.getSecret(exchangeName);
      resul = await (exchange.fetchClosedOrders(symbol, undefined, 10));
    }
    else{
      alert('NO TIENE OPENORDERS');
    }
    return resul;
  }
  public async getOpenOrders(exchangeName: string, pair: string){
    let exchange = this.crearExchange(exchangeName);
    let resul = undefined;
    exchange.proxy = 'http://localhost:4202/';
    if(exchange.has['fetchOpenOrders']){
      exchange.apiKey = this.getAPIpublic(exchangeName);
      exchange.secret = this.getSecret(exchangeName);
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
