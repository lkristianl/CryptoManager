import { Component, OnInit } from '@angular/core';
import { CcxtGeneralService } from '../../_services/ccxt-general.service';
//import { Ticker } from '../../_interfaces/ticker';// Mirar para 

@Component({
  selector: 'app-binance',
  templateUrl: './binance.component.html',
  styleUrls: ['./binance.component.css']
})
export class BinanceComponent implements OnInit {

  buy_orders: undefined | number[][];
  sell_orders: undefined | number[][];
  spread: undefined | number;

  fetchOrderBook: boolean = false;
  fetchOrderBookFinish: boolean = false;

  currentSymbol: string = "ETH/EUR";

  defaultSymbol: Array<string> = ['ETH/EUR', 'BTC/USDT', 'BTC/EUR'];

  constructor(private ccxtGeneralService: CcxtGeneralService) { }

  ngOnInit(): void {
    this.krakenETHEUR();
  }

  krakenBTCEUR(): void {
    this.getKrakenOB('BTC/EUR');
  }

  krakenETHEUR(): void {
    this.getKrakenOB('ETH/EUR');
  }

  krakenDOGEEUR(): void {
    this.getKrakenOB('DOGE/EUR');
  }


  async getKrakenOB(symbol: string): Promise<void> {

    for (var index in this.defaultSymbol) {
      this.fetchOrderBook = true;

      let orderBook = await this.ccxtGeneralService.getKrakenOrderBook(symbol);

      this.fetchOrderBook = false;
      this.fetchOrderBookFinish = true;

      this.currentSymbol = symbol;
      this.buy_orders = orderBook.bids;
      this.sell_orders = orderBook.asks;

      let bid = orderBook.bids.length ? orderBook.bids[0][0] : undefined;
      let ask = orderBook.asks.length ? orderBook.asks[0][0] : undefined;
      this.spread = (bid && ask) ? ask - bid : undefined;
    }
  }

}
