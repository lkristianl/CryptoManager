import { Component, OnInit } from '@angular/core';
import { CcxtGeneralService } from '../../_services/ccxt-general.service';
import { Ticker } from '../../_interfaces/ticker';

@Component({
  selector: 'app-kraken',
  templateUrl: './kraken.component.html',
  styleUrls: ['./kraken.component.css']
})
export class KrakenComponent implements OnInit {


  high: undefined | number; // Precio mas alto de las ultimas 24 horas
  low: undefined | number; // Precio mas bajo de las ultimas 24 horas
  lastTrade: undefined | number; // Precio de la ultima transaccion
  average: undefined | number; // Media del precio de las ultimas 24 horas
  baseVolume: undefined | number; // Volumen de las transacciones de la criptomoneda durante las ultimas 24 horas
  currentSymbol: string = "ETH/EUR";
  fetchingData: boolean = false;
  tickers: Ticker[] = [];


  defaultSymbol: Array<string> = ['ETH/EUR', 'BTC/USDT', 'BTC/EUR'];

  constructor(private ccxtGeneralService: CcxtGeneralService) { }

  ngOnInit(): void {
    this.krakenETHEUR();
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

}
