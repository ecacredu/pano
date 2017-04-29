import { NgModule, Component } from '@angular/core'
import { Router } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';
import { UserService } from '../../providers/userservice';

@Component({
	selector: 'user',
	templateUrl: 'component.html',
	styleUrls: ['../admin/component.css']
})
export class UserComponent {

	public dashboardActive: boolean = true;
	public statementActive: boolean = false;
	public redeemActive: boolean = false;
	public contactActive: boolean = false;
	public employeeActive: boolean = false;

	public routeTitle: string = 'Dashboard';
	public activeUser: any;

	constructor(private router: Router, public storage: LocalStorageService, private us: UserService) {
		this.activeUser = this.storage.retrieve('activeUser');
		this.us.getUser(this.activeUser.uid, false).subscribe((res) => { });
		this.router.events.subscribe((val) => {
			if (val['url'] == "/user/dashboard") { this.routeTitle = 'DASHBOARD'; this.contactActive = false; this.dashboardActive = true; this.statementActive = false; this.redeemActive = false; this.employeeActive = false; };
			if (val['url'] == "/user/statement") { this.routeTitle = 'STATEMENT'; this.contactActive = false; this.dashboardActive = false; this.statementActive = true; this.redeemActive = false; this.employeeActive = false; };
			if (val['url'] == "/user/redeem") { this.routeTitle = 'LOYALTY MILAGE'; this.contactActive = false; this.dashboardActive = false; this.statementActive = false; this.redeemActive = true; this.employeeActive = false; };
			if (val['url'] == "/user/contact") { this.routeTitle = 'SEND YOUR QUERY'; this.contactActive = true; this.dashboardActive = false; this.statementActive = false; this.redeemActive = false; this.employeeActive = false; };
			if (val['url'] == "/user/employees") { this.routeTitle = 'EMPLOYEES'; this.contactActive = false; this.dashboardActive = false; this.statementActive = false; this.redeemActive = false; this.employeeActive = true; };
		});
	}

	logmeout() {
		this.us.userLogout()
			.subscribe(items => {
				if (items == 'ok') {
					this.router.navigate(['home']);
				}
			},
			err => console.log(err));
	}

}