import { NgModule, forwardRef, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeView } from './common/home-view.component';
import { TransferHttpModule } from '../modules/transfer-http/transfer-http.module';
import { LoginView } from './common/login.component';


import { PopoverModule } from 'ngx-bootstrap/popover';
import { SwiperModule } from 'angular2-useful-swiper';
import { UserService } from './providers/userservice';
import { SecureService } from './providers/secureservice';
import { Ng2Webstorage } from 'ng2-webstorage';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
	imports: [
    CommonModule,
    HttpModule,
    ReactiveFormsModule,
    TransferHttpModule,
    PopoverModule.forRoot(),
    SwiperModule,
    RouterModule.forRoot([
      { path: '', component: HomeView, pathMatch: 'full'},
      { path: 'login', component: LoginView, pathMatch: 'full'},
      { path: 'lazy', loadChildren: './+lazy/lazy.module#LazyModule'},
      { path: 'admin', loadChildren: './components/admin/module#AdminModule'},
      { path: 'user', loadChildren: './components/user/module#UserModule'}
    ])
	],
	declarations: [ AppComponent, HomeView, LoginView ],
  exports: [ AppComponent ],
  providers: []
})
export class AppModule {}
