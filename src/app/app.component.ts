import { Component, OnInit } from '@angular/core'
import { TransferState } from '../modules/transfer-state/transfer-state';

@Component({
	selector: 'demo-app',
	template: `
	   <!--<h1>Universal Demo</h1>
	   <a routerLink="/">Home</a>
	   <a routerLink="/login">Login</a>
	   <a routerLink="/lazy">Lazy</a>
	   <a routerLink="/admin">Admin</a>
	   <a routerLink="/user">User</a> -->
	  <router-outlet></router-outlet>
	`,
  styles: [
    `home-view{
        position: absolute;
        width: 100%;
        height: 100%;
      }
    h1 {
      color: green;
    }`
  ]
})
export class AppComponent implements OnInit {
  constructor(private cache: TransferState) {}
  ngOnInit() {
    this.cache.set('cached', true);
  }
}
