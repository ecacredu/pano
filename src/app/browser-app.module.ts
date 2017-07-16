import { NgModule, APP_INITIALIZER, ModuleWithProviders, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

import { ToastyModule } from 'ng2-toasty';
import { BrowserTransferStateModule } from '../modules/transfer-state/browser-transfer-state.module';

import { Ng2Webstorage } from 'ng2-webstorage';
import { SecureService } from './providers/secureservice';
import { UserService } from './providers/userservice';
import { AdminService } from './providers/adminrights';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared.module';
import { RouterModule } from '@angular/router';
import { PanoramaInternationalComponent } from './common/international.component';
import { PanoramaDomesticComponent } from './common/domestic.component';
import { HomeView } from './common/home-view.component';
import { LoginView } from "./common/login.component";
import { SwiperModule } from 'angular2-useful-swiper';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { UserDashboardComponent } from './components/user/dashboard.component';
import { UserStateComponent } from './components/user/statement.component';
import { UserRedeemComponent } from './components/user/redeem.component';
import { UserEmployeesComponent } from './components/user/employee.component';
import { UserContactComponent } from './components/user/contact.component';
enableProdMode();

@NgModule({
	bootstrap: [ AppComponent ],
	imports: [
    BrowserModule.withServerTransition({
      appId: 'my-app-id'
    }),
    SharedModule,
    AppModule,
    BrowserTransferStateModule,
    PopoverModule.forRoot(),
    SwiperModule,
    RouterModule.forRoot([
      { path: '', component: HomeView, pathMatch: 'full'},
      { path: 'login', component: LoginView, pathMatch: 'full'},
      { path: 'international', component: PanoramaInternationalComponent, pathMatch: 'full'},
      { path: 'domestic', component: PanoramaDomesticComponent, pathMatch: 'full'}
    ])
	],
  declarations: [
    HomeView, 
    LoginView , 
    PanoramaInternationalComponent, 
    PanoramaDomesticComponent]
})
export class BrowserAppModule {}
// {
//       provide: APP_INITIALIZER,
//       useFactory: (demo: UserService) => () => demo.initMyApp(),
//       deps: [UserService, Ng2Webstorage,SecureService],
//       multi: true,
//     }