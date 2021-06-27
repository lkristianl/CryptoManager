import { Component, OnInit } from '@angular/core';
import { CcxtGeneralService } from '../../_services/ccxt-general.service';

@Component({
  selector: 'app-binance',
  templateUrl: './binance.component.html',
  styleUrls: ['./binance.component.css']
})
export class BinanceComponent implements OnInit {

  fetchBalance: boolean = false;
  fetchBalanceFinish: boolean = false;
  infoActivos: any[] = [];
  simbolosActivos: any[] = [];
  balance: any;

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
      if(this.simbolosActivos[i][0] != 'EUR' && this.simbolosActivos[i][1] > 0.00001){
        let price = await (this.ccxtGeneralService.getKrakenPriceE(this.simbolosActivos[i][0])); 
        this.infoActivos.push([this.simbolosActivos[i][0],this.simbolosActivos[i][1],price]);
      }
    }
    

    this.fetchBalance = false;
    this.fetchBalanceFinish = true;
    console.log(this.simbolosActivos);
    console.log(this.balance);
    console.log(this.infoActivos);
  }

}
