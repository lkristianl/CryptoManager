import { Component, OnInit } from '@angular/core';
import { CcxtGeneralService } from '../../_services/ccxt-general.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {

  exchangeName: string = "kraken";
  value = '';
  fetchingData: boolean = false;

  supportedExchanges: string[] = ['kraken', 'binance'];


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

  constructor(private ccxtGeneralService: CcxtGeneralService) { }

  ngOnInit(): void {
    this.getClosedOrders();
    this.getBalance();
    this.getOpenOrders();
  }

  async changeExchange(exchange: any): Promise<void> {
    this.valorTotal = 0;
    this.exchangeName = exchange.target.value;
    this.getClosedOrders();
    this.getBalance();
    this.getOpenOrders();
  }


  private async getBalance(): Promise<void> {
    this.balance = await (this.ccxtGeneralService.getAccountBalance(this.exchangeName));

    let activosAux: any[] = [];
    let infoActivosCriptosAux: any[] = [];
    let infoActivosFIATAux: any[] = [];

    for(let x in this.balance){
      activosAux.push([x, this.balance[x]]);
    }
    this.activos = activosAux;

    for( let i=0 ; i<this.activos.length ; i++){
      let fiatOcripto = this.allFIAT.indexOf(this.activos[i][0]);

      if( fiatOcripto == -1 && this.activos[i][1] > 0.00001){
        let price = await (this.ccxtGeneralService.getPriceActivoEUR(this.activos[i][0] + '/' + this.currentCurrency,this.exchangeName));
        infoActivosCriptosAux.push([this.activos[i][0],this.activos[i][1],price]);
        this.valorTotal += this.activos[i][1]*price;
      }
      else if( fiatOcripto != -1 && this.activos[i][1] > 0.01){
        if( this.activos[i][0] == this.currentCurrency){
          infoActivosFIATAux.push([this.activos[i][0],this.activos[i][1]]);
        }
        else{
          let priceCurrentCurrency = await (this.ccxtGeneralService.getPriceActivoEUR(this.activos[i][0] + '/' + this.currentCurrency,this.exchangeName));
          infoActivosFIATAux.push([this.activos[i][0],this.activos[i][1],priceCurrentCurrency*this.activos[i][1]]);
        }
        this.valorTotal += this.activos[i][1];
      }
    }
    this.infoActivosCriptos = infoActivosCriptosAux;
    this.infoActivosFIAT = infoActivosFIATAux;
    this.fetchBalanceFinish = true;
  }


  public changeFIAT(newSymbol: any): void{
    this.currentCurrency = newSymbol.target.value;
    console.log(typeof(newSymbol.target.value));
    this.currentCurrencySymbol = this.allFIAT.indexOf(this.currentCurrency);
    this.stringSymbol = this.mainFIATsymbols[this.currentCurrencySymbol];
    this.fetchBalanceFinish = false;
    this.infoActivosCriptos = [];
    this.infoActivosFIAT = [];
    this.activos = [];
    this.balance = undefined;
    this.valorTotal = 0;
    this.getBalance();
  }


  private async getOpenOrders(){
    this.fetchOpenOrders = false;
    this.openOrders = await (this.ccxtGeneralService.getOpenOrders(this.exchangeName, this.symbolOpenOrders));
    this.fetchOpenOrders = true;
  }

  public async changePairOpenOrders(newSymbol: string){
    let supportedSymbols = await (this.ccxtGeneralService.getExchangeSymbols(this.exchangeName));
    if (supportedSymbols.includes(newSymbol)){
      this.symbolOpenOrders = newSymbol;
      this.openOrders = [];
      this.getOpenOrders();
    } else {
      alert('EL SÍMBOLO INTRODUCIDO NO ESTA PRESENTE EN ESTE EXCHANGE');
    }
  }
  private async getClosedOrders(){
    this.fetchClosedOrders = false;
    this.closedOrders = await (this.ccxtGeneralService.getClosedOrders(this.symbolClosedOrders, this.exchangeName));
    this.fetchClosedOrders = true;
  }
  public async changePairClosedOrders(newSymbol: string){
    let supportedSymbols = await (this.ccxtGeneralService.getExchangeSymbols(this.exchangeName));
    if (supportedSymbols.includes(newSymbol)){
      this.symbolClosedOrders = newSymbol;
      this.closedOrders = [];
      this.getClosedOrders();
    } else {
      alert('EL SÍMBOLO INTRODUCIDO NO ESTA PRESENTE EN ESTE EXCHANGE');
    }
  }

}
