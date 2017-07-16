import { NgModule, forwardRef, APP_INITIALIZER, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeView } from './common/home-view.component';
import { TransferHttpModule } from '../modules/transfer-http/transfer-http.module';
import { LoginView } from './common/login.component';
enableProdMode();

import { PopoverModule } from 'ngx-bootstrap/popover';
import { SwiperModule } from 'angular2-useful-swiper';
import { UserService } from './providers/userservice';
import { SecureService } from './providers/secureservice';
import { Ng2Webstorage } from 'ng2-webstorage';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PanoramaInternationalComponent } from './common/international.component';
import { PanoramaDomesticComponent } from './common/domestic.component';
import { PackageTypePipe } from './pipes/packagetype-pipe';
import { SearchPackagePipe } from './pipes/searchpackage-pipe';
import { BrowserAppModule } from './browser-app.module';

@NgModule({
	imports: [
    CommonModule,
    HttpModule,
    ReactiveFormsModule,
    TransferHttpModule,
    PopoverModule.forRoot(),
    SwiperModule,
    RouterModule.forRoot([
      { path: 'lazy', loadChildren: './+lazy/lazy.module#LazyModule'},
      { path: 'admin', loadChildren: './components/admin/module#AdminModule'},
      { path: 'user', loadChildren: './components/user/module#UserModule'}
    ])
	],
	declarations: [ AppComponent],
  exports: [ AppComponent ],
  providers: []
})
export class AppModule {}
