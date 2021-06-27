import { Component, OnInit } from '@angular/core';
import { CcxtGeneralService } from '../../_services/ccxt-general.service';
import { Ticker } from '../../_interfaces/ticker';

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
  selector: 'app-kraken',
  templateUrl: './kraken.component.html',
  styleUrls: ['./kraken.component.css']
})
export class KrakenComponent implements OnInit {

//test apex charts
  public chartOptions: ChartOptions;
//end

exchangeName: string = 'kraken';

  high: undefined | number; // Precio mas alto de las ultimas 24 horas
  low: undefined | number; // Precio mas bajo de las ultimas 24 horas
  lastTrade: undefined | number; // Precio de la ultima transaccion
  average: undefined | number; // Media del precio de las ultimas 24 horas
  baseVolume: undefined | number; // Volumen de las transacciones de la criptomoneda durante las ultimas 24 horas
  currentSymbol: string = "ETH/EUR";
  fetchingData: boolean = false;
  tickers: Ticker[] = [];
  candlesticks: undefined | number[][];

  buyTrades: number [][];
  sellTrades: number [][];

  buy_orders: undefined | number[][];
  sell_orders: undefined | number[][];
  spread: undefined | number;
  year: undefined | string;

  fetchOrderBook: boolean = false;
  fetchOrderBookFinish: boolean = false;

  defaultSymbol: Array<string> = ['ETH/EUR', 'BTC/USDT', 'BTC/EUR'];

  constructor(private ccxtGeneralService: CcxtGeneralService) {
    this.buyTrades = [[0,0,0]];
    this.sellTrades = [[0,0,0]];

    this.chartOptions = {
      series: [],
      chart: {
        type: "candlestick",
        height: 700,
        zoom: {
          enabled:false
        },
        offsetX: 10
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
    this.krakenETHEUR();
  }

  krakenBTCEUR(): void {
    this.getKrakenTicker('BTC/EUR');
    this.initializeGraph();
    this.getKrakenOHLCV('BTC/EUR');
    this.getKrakenOB('BTC/EUR');
  }

  krakenETHEUR(): void {
    this.getKrakenTicker('ETH/EUR');
    this.initializeGraph();
    this.getKrakenOHLCV('ETH/EUR');
    this.getKrakenOB('ETH/EUR');
    this.getKrakenLastTrades('ETH/EUR');
  }

  krakenDOGEEUR(): void {
    this.getKrakenTicker('DOGE/EUR');
    this.initializeGraph();
    this.getKrakenOHLCV('DOGE/EUR');
    this.getKrakenOB('DOGE/EUR');
  }


  async getKrakenTicker(symbol: string): Promise<void> {

    for (var index in this.defaultSymbol) {
      this.fetchingData = true;
      let ticker = await this.ccxtGeneralService.getKrakenTicker(symbol);
      this.fetchingData = false;
      this.currentSymbol = symbol;
      this.high = ticker.high;
      this.low = ticker.low;
      this.lastTrade = ticker.close;
      this.average = (this.high+this.low)/2;
      this.baseVolume = ticker.baseVolume;
    }
  }

  async initializeGraph(): Promise<void> {

    this.chartOptions = {
      series: [],
      chart: {
        type: "candlestick",
        height: 700,
        zoom: {
          enabled:false
        },
        offsetX: 10
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


//  async getKrakenOHLC(): Promise<void> {
    //this.responseString = await this.ccxtGeneralService.getKrakenOHLC('ETH/EUR');
//  }

  async getKrakenOHLCV(symbol: string): Promise<void> {
    this.candlesticks = await this.ccxtGeneralService.getKrakenOHLCV(symbol);

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

  private async getKrakenOB(symbol: string): Promise<void> {

    do{
      this.fetchOrderBook = true;

      let orderBook = await (this.ccxtGeneralService.getOrderBook(symbol, this.exchangeName));

      this.fetchOrderBook = false;
      this.fetchOrderBookFinish = true;

      this.currentSymbol = symbol;
      this.buy_orders = orderBook.bids;
      this.sell_orders = orderBook.asks;

      this.spread = orderBook.asks[0][0] - orderBook.bids[0][0];

      await this.delay(10000);
    }while(this.fetchOrderBookFinish == true);//Este logueado o despues de x tiempo? 12 min

  }

  private async getKrakenLastTrades(symbol: string): Promise<void> {
    let lastTrades = await this.ccxtGeneralService.getKrakenLastTrades(symbol);

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
