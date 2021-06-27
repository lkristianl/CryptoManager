import { Component, OnInit } from '@angular/core';
import { CcxtGeneralService } from '../../_services/ccxt-general.service';

@Component({
  selector: 'app-binance',
  templateUrl: './binance.component.html',
  styleUrls: ['./binance.component.css']
})
export class BinanceComponent implements OnInit {

  buy_orders: undefined | number[][];
  sell_orders: undefined | number[][];
  spread: undefined | number;
  year: undefined | string;

  fetchOrderBook: boolean = false;
  fetchOrderBookFinish: boolean = false;

  currentSymbol: string = 'BTC/EUR';//document.getElementById('parActivos');

  //En las opciones de mostrar info de un par de activos
  //defaultSymbol: Array<string> = ['BTC/EUR', 'ETH/EUR', 'DOGE/EUR'];

  constructor(private ccxtGeneralService: CcxtGeneralService) { }

  ngOnInit(): void {
    this.getKrakenOB(this.currentSymbol);
  }

  private async getKrakenOB(symbol: string): Promise<void> {
    
    do{
      this.fetchOrderBook = true;

      let orderBook = await (this.ccxtGeneralService.getKrakenOrderBook(symbol));

      this.fetchOrderBook = false;
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
}
