import { Component, OnInit } from '@angular/core';
import { CcxtGeneralService } from '../../_services/ccxt-general.service';

@Component({
  selector: 'app-binance',
  templateUrl: './binance.component.html',
  styleUrls: ['./binance.component.css']
})
export class BinanceComponent implements OnInit {

  exchangeName: string = 'binance';

  buy_orders: undefined | number[][];
  sell_orders: undefined | number[][];
  spread: undefined | number;
  year: undefined | string;

  fetchOrderBookFinish: boolean = false;

  currentSymbol: string = 'BTC/EUR';//document.getElementById('parActivos');

  //En las opciones de mostrar info de un par de activos
  //defaultSymbol: Array<string> = ['BTC/EUR', 'ETH/EUR', 'DOGE/EUR'];
  
  //Code para mostrar pos global
  currentCurrency: string = 'EUR';
  currentCurrencySymbol: number = 1;

  allFIAT: string[] = ['AUD','CAD','USD','EUR','CHF','GBP','JPY'];
  mainFIAT: string[] = ['USD','EUR'];
  mainFIATsymbols: string[] = ['$','€'];// ['A$','C$','$','€','Fr.','£','¥']
  stringSymbol: string = this.mainFIATsymbols[this.currentCurrencySymbol];
  fetchBalanceFinish: boolean = false;
  
  infoActivosCriptos: any[] = [];
  infoActivosFIAT: any[] = [];
  
  activos: any[] = [];
  
  balance: any;
  
  valorTotal: number = 0;

  constructor(private ccxtGeneralService: CcxtGeneralService) { }

  ngOnInit(): void {
    this.fetchOpenOrders();
    this.getBalance();
    this.getOB(this.currentSymbol);
    
  }

  private async getBalance(): Promise<void> {
    this.balance = await (this.ccxtGeneralService.getAccountBalance(this.exchangeName));

    for(let x in this.balance){
      this.activos.push([x, this.balance[x]]);
    }
    
    for( let i=0 ; i<this.activos.length ; i++){
      let fiatOcripto = this.allFIAT.indexOf(this.activos[i][0]);

      if( fiatOcripto == -1 && this.activos[i][1] > 0.00001){
        let price = await (this.ccxtGeneralService.getPriceActivoEUR(this.activos[i][0] + '/' + this.currentCurrency,this.exchangeName)); 
        this.infoActivosCriptos.push([this.activos[i][0],this.activos[i][1],price]);
        this.valorTotal += this.activos[i][1]*price;
      }
      else if( fiatOcripto != -1 && this.activos[i][1] > 0.01){
        if( this.activos[i][0] == this.currentCurrency){
          this.infoActivosFIAT.push([this.activos[i][0],this.activos[i][1]]);
        }
        else{
          let priceCurrentCurrency = await (this.ccxtGeneralService.getPriceActivoEUR(this.activos[i][0] + '/' + this.currentCurrency,this.exchangeName));
          this.infoActivosFIAT.push([this.activos[i][0],this.activos[i][1],priceCurrentCurrency*this.activos[i][1]]);
        }
        this.valorTotal += this.activos[i][1];
      }
    }

    this.fetchBalanceFinish = true;
    console.log(this.activos);
    console.log(this.balance);
    console.log(this.infoActivosCriptos);
    console.log(this.infoActivosFIAT);
  }

  public changeFIAT(newSymbol: any): void{
    this.currentCurrency = newSymbol.target.value;
    console.log(typeof(newSymbol.target.value));
    this.currentCurrencySymbol = this.allFIAT.indexOf(this.currentCurrency);
    this.stringSymbol = this.mainFIATsymbols[this.currentCurrencySymbol];
    this.fetchBalanceFinish = false;
    this.infoActivosCriptos = [];
    this.infoActivosFIAT = [];
    this.activos = [];
    this.balance = undefined;
    this.valorTotal = 0;
    this.getBalance();
  }

  private async getOB(symbol: string): Promise<void> {
    
    do{
      let orderBook = await (this.ccxtGeneralService.getOrderBook(symbol, this.exchangeName));

      this.fetchOrderBookFinish = true;

      this.currentSymbol = symbol;
      this.buy_orders = orderBook.bids;
      this.sell_orders = orderBook.asks;
      
      this.spread = orderBook.asks[0][0] - orderBook.bids[0][0];

      await this.delay(10000);
    }while(this.fetchOrderBookFinish == true);//Este logueado o despues de x tiempo? 12 min
    
  }

  //Para actualizzar los datos cada x milisegs
  private delay(ms: number): Promise<void> {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  private async fetchOpenOrders(){
    let openOrders = await (this.ccxtGeneralService.getOpenOrders(this.exchangeName));
    console.log(openOrders);
  }

}
