import { Component, OnInit } from '@angular/core';
import { CcxtGeneralService } from '../../_services/ccxt-general.service';
import { Ticker } from '../../_interfaces/ticker';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexLegend,
  ApexYAxis,
  ApexXAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  legend: ApexLegend;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
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

  high: undefined | number; // Precio mas alto de las ultimas 24 horas
  low: undefined | number; // Precio mas bajo de las ultimas 24 horas
  lastTrade: undefined | number; // Precio de la ultima transaccion
  average: undefined | number; // Media del precio de las ultimas 24 horas
  baseVolume: undefined | number; // Volumen de las transacciones de la criptomoneda durante las ultimas 24 horas
  currentSymbol: string = "ETH/EUR";
  fetchingData: boolean = false;
  tickers: Ticker[] = [];
  candlesticks: undefined | number[][];


  defaultSymbol: Array<string> = ['ETH/EUR', 'BTC/USDT', 'BTC/EUR'];

  constructor(private ccxtGeneralService: CcxtGeneralService) {
    this.chartOptions = {
      series: [],
      chart: {
        type: "candlestick",
        height: 700
      },
      legend: {
        show: false
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
    this.getKrakenOHLCV();
  }

  krakenBTCEUR(): void {
    this.getKrakenTicker('BTC/EUR');
  }

  krakenETHEUR(): void {
    this.getKrakenTicker('ETH/EUR');
  }

  krakenDOGEEUR(): void {
    this.getKrakenTicker('DOGE/EUR');
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


//  async getKrakenOHLC(): Promise<void> {
    //this.responseString = await this.ccxtGeneralService.getKrakenOHLC('ETH/EUR');
//  }

  async getKrakenOHLCV(): Promise<void> {
    this.candlesticks = await this.ccxtGeneralService.getKrakenOHLCV('ETH/EUR');

    for (var candlestick of this.candlesticks){
      let placeholderDate = new Date(candlestick[0]);
      this.chartOptions.series.push({
        name: placeholderDate.toString(),
        data: [
          {
            x: placeholderDate.toLocaleDateString("en-eu"),
            y: [candlestick[1],candlestick[2],candlestick[3],candlestick[4]]
          }
        ]
      })
    }
  }
}
