import { Component, OnInit } from '@angular/core';
import { CcxtGeneralService } from '../../_services/ccxt-general.service';

@Component({
  selector: 'app-binance',
  templateUrl: './binance.component.html',
  styleUrls: ['./binance.component.css']
})
export class BinanceComponent implements OnInit {

  currentCurrency: string = 'EUR';
  currentCurrencySymbol: number = 1;

  allFIAT: string[] = ['AUD','CAD','USD','EUR','CHF','GBP','JPY'];// ['AUD','CAD','USD','EUR','CHF','GBP','JPY'];
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
    this.getKrakenBalance();
  }

  private async getKrakenBalance(): Promise<void> {
    this.balance = await (this.ccxtGeneralService.getAccountBalance('kraken'));

    for(let x in this.balance){
      this.activos.push([x, this.balance[x]]);
    }
    
    for( let i=0 ; i<this.activos.length ; i++){
      let fiatOcripto = this.allFIAT.indexOf(this.activos[i][0]);

      if( fiatOcripto == -1 && this.activos[i][1] > 0.00001){
        let price = await (this.ccxtGeneralService.getPriceActivoEUR(this.activos[i][0] + '/' + this.currentCurrency,'kraken')); 
        this.infoActivosCriptos.push([this.activos[i][0],this.activos[i][1],price]);
        this.valorTotal += this.activos[i][1]*price;
      }
      else if( fiatOcripto != -1 && this.activos[i][1] > 0.01){
        if( this.activos[i][0] == this.currentCurrency){
          this.infoActivosFIAT.push([this.activos[i][0],this.activos[i][1]]);
        }
        else{
          let priceCurrentCurrency = await (this.ccxtGeneralService.getPriceActivoEUR(this.activos[i][0] + '/' + this.currentCurrency,'kraken'));
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
    this.currentCurrencySymbol = this.allFIAT.indexOf(this.currentCurrency);
    this.stringSymbol = this.mainFIATsymbols[this.currentCurrencySymbol];
    this.fetchBalanceFinish = false;
    this.infoActivosCriptos = [];
    this.infoActivosFIAT = [];
    this.activos = [];
    this.balance = undefined;
    this.valorTotal = 0;
    this.getKrakenBalance();
  }

}
