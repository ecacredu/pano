import { NgModule, Component } from '@angular/core'
import { Router } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';
import { UserService } from '../../providers/userservice';
import { AdminService } from '../../providers/adminrights';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'admin',
	templateUrl: 'component.html',
	styleUrls: ['component.css']
})
export class AdminComponent {

	newInvoiceForm: FormGroup;
	public selectedInvoiceFile: any;

	public dashboardActive: boolean = true;
	public usersActive: boolean = false;
	public invoiceActive: boolean = false;
	public offerActive: boolean = false;
	public accountActive: boolean = false;

	public AccountdashboardActive: boolean = true;
	public AccountstatementActive: boolean = false;
	public AccountredeemActive: boolean = false;
	public AccountcontactActive: boolean = false;
	public AccountemployeeActive: boolean = false;

	public maskDetails: any = {};

	public adminMask: boolean;

	public routeTitle: string = 'Dashboard';
	public activeUser: any;




	constructor(private router: Router, public storage: LocalStorageService, private userService: UserService, private adService: AdminService, private _formBuilder: FormBuilder) {
		this.activeUser = this.storage.retrieve('activeUser');
		this.userService.getUser(this.activeUser.uid, false).subscribe((res) => { });
		this.router.events.subscribe((val) => {
			

			if (val['url'] == "/admin/account/user/dashboard" || val['url'] == "/admin/account/user/statement" || val['url'] == "/admin/account/user/redeem" || val['url'] == "/admin/account/user/contact" || val['url'] == "/admin/account/user/employees") {
				this.adminMask = true;
				if (this.userService.maskUser.id == undefined) {
					this.adminMask = false;
					this.router.navigate(['admin/account']);
				}
			} else {
				this.adminMask = false;
			}

			if (val['url'] == "/admin/account/user/dashboard") { this.AccountdashboardActive = true; this.AccountstatementActive = false; this.AccountredeemActive = false; this.AccountcontactActive = false; this.AccountemployeeActive = false; };
			if (val['url'] == "/admin/account/user/statement") { this.AccountdashboardActive = false; this.AccountstatementActive = true; this.AccountredeemActive = false; this.AccountcontactActive = false; this.AccountemployeeActive = false; };
			if (val['url'] == "/admin/account/user/redeem") { this.AccountdashboardActive = false; this.AccountstatementActive = false; this.AccountredeemActive = true; this.AccountcontactActive = false; this.AccountemployeeActive = false; };
			if (val['url'] == "/admin/account/user/employees") { this.AccountdashboardActive = false; this.AccountstatementActive = false; this.AccountredeemActive = false; this.AccountcontactActive = false; this.AccountemployeeActive = true; };


			if (val['url'] == "/admin/dashboard") { this.dashboardActive = true; this.usersActive = false; this.invoiceActive = false; this.offerActive = false; this.accountActive = false; };
			if (val['url'] == "/admin/users") { this.dashboardActive = false; this.usersActive = true; this.invoiceActive = false; this.offerActive = false; this.accountActive = false; };
			if (val['url'] == "/admin/invoice") { this.dashboardActive = false; this.usersActive = false; this.invoiceActive = true; this.offerActive = false; this.accountActive = false; };
			if (val['url'] == "/admin/offer") { this.dashboardActive = false; this.usersActive = false; this.invoiceActive = false; this.offerActive = true; this.accountActive = false; };
			if (val['url'] == "/admin/account") { this.dashboardActive = false; this.usersActive = false; this.invoiceActive = false; this.offerActive = false; this.accountActive = true; };
		});

		this.activeUser = this.storage.retrieve('activeUser');

		this.adService.getAllUsers().subscribe((res) => { });
		this.adService.getAllCords().subscribe((res) => { });
		this.adService.getOfferMilage().subscribe((res) => { });
		this.adService.getAllInvoices().subscribe((res) => { });
	}

	onChange(data) {
		var files = data.target.files;
		console.log(files);
		this.adService.updateNode(files['0'])
			.subscribe(items => console.log(items),
			err => console.log(err));
	}

	logmeout() {
		this.userService.userLogout()
			.subscribe(items => {
				if (items == 'ok') {
					this.router.navigate(['home']);
				}
			},
			err => console.log(err));
	}

	ngOnInit(): any {
		this.adService.getOfferMilage().subscribe((res) => { });
	}

	ngDoCheck() {
		if (this.userService.maskUser.id == undefined) {
		} else {
			this.maskDetails = this.userService.maskDetails;
		}

	}
}