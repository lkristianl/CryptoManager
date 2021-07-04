import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;

  exchangesSoportados: string[] = ['kraken','binance'];
  krakenAPIKeys: boolean = false;
  binanceAPIKeys: boolean = false;

  constructor(private token: TokenStorageService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    if(this.currentUser.krakenPublic != null && this.currentUser.krakenSecret != null){
      this.krakenAPIKeys = true;
      console.log('kraken');
    }

    if(this.currentUser.binancePublic != "dsd" && this.currentUser.binanceSecret != "sds"){
      this.binanceAPIKeys = true;
      console.log('binance');
    }

  }
}
