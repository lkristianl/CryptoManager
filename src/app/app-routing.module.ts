import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//import { TestComponent } from './test/test.component';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ExchangesComponent } from './exchanges/exchanges.component';
import { HelpComponent } from './help/help.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { KrakenComponent } from './_exchanges/kraken/kraken.component';
import { BinanceComponent } from './_exchanges/binance/binance.component';
import { BitvavoComponent } from './_exchanges/bitvavo/bitvavo.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'exchanges', component: ExchangesComponent },
  { path: 'help', component: HelpComponent },
  { path: 'aboutUs', component: AboutUsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: BoardUserComponent },
  { path: 'admin', component: BoardAdminComponent },
  { path: 'kraken', component: KrakenComponent },
  { path: 'binance', component: BinanceComponent },
  { path: 'bitvavo', component: BitvavoComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
//  { path: 'test', component: TestComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [HomeComponent, ExchangesComponent, HelpComponent, AboutUsComponent, LoginComponent, RegisterComponent, ProfileComponent, BoardUserComponent, BoardAdminComponent, KrakenComponent, BinanceComponent, BitvavoComponent]
