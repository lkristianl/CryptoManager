import { Component, OnInit } from '@angular/core';
import { CcxtGeneralService } from '../../_services/ccxt-general.service';

@Component({
  selector: 'app-binance',
  templateUrl: './binance.component.html',
  styleUrls: ['./binance.component.css']
})
export class BinanceComponent implements OnInit {

  currentCurrency: string = 'EUR';
  currentCurrencySymbol: number = 3;

  allFIAT: string[] = ['AUD','CAD','USD','EUR','CHF','GBP','JPY'];
  FIATsymbol: string[] = ['A$','C$','$','€','Fr.','£','¥'];
  fetchBalance: boolean = false;
  fetchBalanceFinish: boolean = false;
  infoActivosCriptos: any[] = [];
  infoActivosFIAT: any[] = [];
  simbolosActivos: any[] = [];
  balance: any;
  valorTotal: number = 0;


  constructor(private ccxtGeneralService: CcxtGeneralService) { }

  ngOnInit(): void {
    this.getKrakenBalance();
  }

  private async getKrakenBalance(): Promise<void> {
    this.fetchBalance = true;

    this.balance = await (this.ccxtGeneralService.getKrakenBalance());

    for(let x in this.balance){
      this.simbolosActivos.push([x, this.balance[x]]);
    }
    
    for( let i=0 ; i<this.simbolosActivos.length ; i++){
      let fiatOcripto = this.allFIAT.indexOf(this.simbolosActivos[i][0]);

      if( fiatOcripto == -1 && this.simbolosActivos[i][1] > 0.00001){
        let price = await (this.ccxtGeneralService.getKrakenPriceE(this.simbolosActivos[i][0] + '/' + this.currentCurrency)); 
        this.infoActivosCriptos.push([this.simbolosActivos[i][0],this.simbolosActivos[i][1],price]);
        this.valorTotal += this.simbolosActivos[i][1]*price;
      }
      else if( fiatOcripto != -1 && this.simbolosActivos[i][1] > 0.0){
        this.infoActivosFIAT.push([this.simbolosActivos[i][0],this.simbolosActivos[i][1],'-']);
        this.valorTotal += this.simbolosActivos[i][1];
        console.log(this.allFIAT[fiatOcripto]);
      }
    }

    this.fetchBalance = false;
    this.fetchBalanceFinish = true;
    console.log(this.simbolosActivos);
    console.log(this.balance);
    console.log(this.infoActivosCriptos);
  }

  private checkFIAT(): boolean{
    return true;
  }

}
