import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { CifrardescifrarService } from '../_services/cifrardescifrar.service';
import { CcxtGeneralService } from '../_services/ccxt-general.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;

  exchangesSoportados: string[] = ['kraken','binance'];
  krakenP:string = 'null';
  krakenS:string = 'null';
  binanceP:string = 'null';
  binanceS:string = 'null';
  krakenAPIKeys: boolean = false;
  binanceAPIKeys: boolean = false;

  constructor(private token: TokenStorageService, private cifrarDescifrarService: CifrardescifrarService, private ccxtGeneralService: CcxtGeneralService) { }

  ngOnInit() {
    this.currentUser = this.token.getUser();
    this.krakenP = this.cifrarDescifrarService.decryptUsingAES256(this.currentUser.krakenPublic);
    this.krakenS = this.cifrarDescifrarService.decryptUsingAES256(this.currentUser.krakenSecret);
    this.binanceP = this.cifrarDescifrarService.decryptUsingAES256(this.currentUser.binancePublic);
    this.binanceS = this.cifrarDescifrarService.decryptUsingAES256(this.currentUser.binanceSecret);
  
    let checkK = this.checkAPIs(this.exchangesSoportados[0]);
    let checkB = this.checkAPIs(this.exchangesSoportados[1]);

    if(this.krakenP != 'null' && this.krakenS != 'null' && checkK){
      this.krakenAPIKeys = true;
    }
    if(this.binanceP != 'null' && this.binanceS != 'null' && checkB){
      this.binanceAPIKeys = true;
    }
  }

  private async checkAPIs(exchangeName: string): Promise<boolean>{
    let x = await (this.ccxtGeneralService.checkAPIKeys(exchangeName));
    return x;
  }
}
