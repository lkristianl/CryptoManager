import { Component, OnInit } from '@angular/core';
import { CcxtGeneralService } from '../../_services/ccxt-general.service';
import { interval, Subscription } from 'rxjs';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexDataLabels
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
};


@Component({
  selector: 'app-binance',
  templateUrl: '../exchange.component.html',
  styleUrls: ['../exchange.component.css']
})
export class BinanceComponent implements OnInit {

  value = '';

  timeInterval = 'month';
  updatingGraph: boolean = false;

  source = interval(10000);
  subscription: Subscription = this.source.subscribe(val => this.changeSymbolEvent(this.currentSymbol));;

  public chartOptions: ChartOptions;

  exchangeName: string = "binance";
  high: undefined | number; // Precio mas alto de las ultimas 24 horas
  low: undefined | number; // Precio mas bajo de las ultimas 24 horas
  lastTrade: undefined | number; // Precio de la ultima transaccion
  average: undefined | number; // Media del precio de las ultimas 24 horas
  baseVolume: undefined | number; // Volumen de las transacciones de la criptomoneda durante las ultimas 24 horas
  currentSymbol: string = "ETH/EUR";
  fetchingData: boolean = false;
  candlesticks: undefined | number[][];

  buyTrades: number [][];
  sellTrades: number [][];

  buy_orders: undefined | number[][];
  sell_orders: undefined | number[][];
  spread: undefined | number;
  year: undefined | string;

  fetchOrderBook: boolean = false;
  fetchOrderBookFinish: boolean = false;

  defaultSymbol: string[] = ['ETH/EUR', 'BTC/EUR', 'DOGE/EUR', 'ADA/EUR', 'XRP/EUR', 'XLM/EUR' ];
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

  //variables open orders
  symbolOpenOrders:string = 'ETH/EUR';
  fetchOpenOrders: boolean = false;
  openOrders: undefined | any[] = [];

  //variables closed orders
  symbolClosedOrders: string = 'ETH/EUR';
  fetchClosedOrders: boolean = false;
  closedOrders: undefined | any[] = [];

  constructor(private ccxtGeneralService: CcxtGeneralService) {
    this.buyTrades = [[0,0,0]];
    this.sellTrades = [[0,0,0]];

    this.chartOptions = {
      series: [],
      chart: {
        type: "candlestick",
        height: 450,
        zoom: {
          enabled:false
        }
      },
      dataLabels: {
        enabled: false
      },
      title: {
        text: this.currentSymbol,
        align: "left"
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    };
  }

  ngOnInit(): void {
    this.changeSymbol("ETH/EUR");
    this.getOB(this.currentSymbol);
  }

  async onEnter(value: string){
    let supportedSymbols = await this.ccxtGeneralService.getExchangeSymbols(this.exchangeName);

    if (supportedSymbols.includes(value)){
      this.changeSymbol(value);
    } else {
      alert('EL SIMBOLO INTRODUCIDO NO ESTA PRESENTE EN ESTE EXCHANGE');
    }
  }

  async changeSymbol(symbol: string): Promise<void> {
    this.currentSymbol = symbol;
    this.fetchingData = true;
    this.getTicker(symbol);
    this.cleanData();
    this.getOB(symbol);
    this.getLastTrades(symbol);
    await this.getOHLCV(symbol);
    this.fetchingData = false;
  }

  async changeChart(interval: string): Promise<void> {
    this.updatingGraph = true;
    this.timeInterval = interval;
    this.cleanData();
    await this.getOHLCV(this.currentSymbol);
    this.updatingGraph = false;
  }

  changeSymbolEvent(symbol: string): void {
    this.currentSymbol = symbol;
    this.getTicker(symbol);
    this.getOB(symbol);
    this.getLastTrades(symbol);
  }

  async changeSymbolTest(symbol: any): Promise<void> {
    this.currentSymbol = symbol.target.value;
    this.fetchingData = true;
    this.getTicker(symbol.target.value);
    this.cleanData();
    this.getOB(symbol.target.value);
    this.getLastTrades(symbol.target.value);
    await this.getOHLCV(symbol.target.value);
    this.fetchingData = false;
  }

  async getTicker(symbol: string): Promise<void> {
      let ticker = await this.ccxtGeneralService.getTicker(symbol, this.exchangeName);
      this.high = ticker.high;
      this.low = ticker.low;
      this.lastTrade = ticker.close;
      this.average = (this.high+this.low)/2;
      this.baseVolume = ticker.baseVolume;
  }

  async cleanData(): Promise<void> {

    this.chartOptions = {
      series: [],
      chart: {
        type: "candlestick",
        height: 450,
        zoom: {
          enabled:false
        }
      },
      dataLabels: {
        enabled: false
      },
      title: {
        text: this.currentSymbol,
        align: "left"
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    };

  }


//  async getOHLC(): Promise<void> {
    //this.responseString = await this.ccxtGeneralService.getOHLC('ETH/EUR');
//  }

  async getOHLCV(symbol: string): Promise<void> {
    this.candlesticks = await this.ccxtGeneralService.getOHLCV(symbol, this.exchangeName, this.timeInterval);

    for (var candlestick of this.candlesticks){
      let placeholderDate = new Date(candlestick[0]);
      this.chartOptions.series.push({
        data: [
          {
            x: placeholderDate,
            y: [candlestick[1],candlestick[2],candlestick[3],candlestick[4]]
          }
        ]
      })
    }
  }

  private async getOB(symbol: string): Promise<void> {

      let orderBook = await (this.ccxtGeneralService.getOrderBook(symbol, this.exchangeName));

      this.fetchOrderBookFinish = true;

      this.buy_orders = orderBook.bids;
      this.sell_orders = orderBook.asks;

      this.spread = orderBook.asks[0][0] - orderBook.bids[0][0];

      await this.delay(10000);

  }

  private async getLastTrades(symbol: string): Promise<void> {
    let lastTrades = await this.ccxtGeneralService.getLastTrades(symbol, this.exchangeName);
    this.buyTrades = [[0,0,0]];
    this.sellTrades = [[0,0,0]];
      for (var trade of lastTrades){
        if (trade.side == "buy"){
          this.buyTrades.push([trade.price, trade.amount, trade.timestamp]);
        }
        else this.sellTrades.push([trade.price, trade.amount, trade.timestamp]);
      }
  }

  //Para actualizzar los datos cada x milisegs
  private delay(ms: number): Promise<void> {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
