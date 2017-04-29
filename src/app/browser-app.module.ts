import { NgModule, APP_INITIALIZER, ModuleWithProviders } from '@angular/core';
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


@NgModule({
	bootstrap: [ AppComponent ],
	imports: [
    BrowserModule.withServerTransition({
      appId: 'my-app-id'
    }),
    SharedModule,
    AppModule,
    BrowserTransferStateModule
	]
})
export class BrowserAppModule {}
// {
//       provide: APP_INITIALIZER,
//       useFactory: (demo: UserService) => () => demo.initMyApp(),
//       deps: [UserService, Ng2Webstorage,SecureService],
//       multi: true,
//     }