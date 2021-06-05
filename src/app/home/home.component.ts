import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { CcxtGeneralService } from '../_services/ccxt-general.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  content?: string;

  exchanges: string[] = [];
  highestPrice: number = 0.0;

  num_Exchanges: number = 0;

  constructor(private userService: UserService, private ccxtGeneralService: CcxtGeneralService) { }

  ngOnInit(): void {
    this.userService.getPublicContent().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
    this.getAllExchanges();
    this.num_Exchanges = this.exchanges.length;
    this.getKrakenPrice();
  }

  getAllExchanges(): void {
    this.exchanges = this.ccxtGeneralService.getAllExchanges();
  }

  async getKrakenPrice(): Promise<void> {
    this.highestPrice = await(this.ccxtGeneralService.getKrakenPrice());
  }

}
