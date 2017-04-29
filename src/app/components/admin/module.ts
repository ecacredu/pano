import { NgModule, Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AdminComponent } from './component';
import { CommonModule } from '@angular/common';
import { AdminUsersComponent } from './users.component';
import { AdminInvoiceComponent } from './invoice.component';
import { AdminOfferComponent } from './offer.component';
import { AdminAccountComponent } from './account.component';
import { AdminDashboardComponent } from './dashboard.component';
import { BrowserAppModule } from '../../browser-app.module';
import { FormsModule } from '@angular/forms';
import { AppModule } from '../../app.module';
import { SharedModule } from '../../shared.module';
import { UserDashboardComponent } from '../user/dashboard.component';
import { UserStateComponent } from '../user/statement.component';
import { UserRedeemComponent } from '../user/redeem.component';
import { UserEmployeesComponent } from '../user/employee.component';

@NgModule({
	declarations: [
		AdminComponent, 
		AdminDashboardComponent, 
		AdminUsersComponent, 
		AdminInvoiceComponent, 
		AdminOfferComponent, 
		AdminAccountComponent,
		UserDashboardComponent,
		UserStateComponent,
		UserRedeemComponent,
		UserEmployeesComponent
		],
	imports: [
		SharedModule,
		RouterModule.forChild([
			{
				path: '', component: AdminComponent,
				children: [
					{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
					{ path: 'dashboard', component: AdminDashboardComponent },
					{ path: 'users', component: AdminUsersComponent },
					{ path: 'invoice', component: AdminInvoiceComponent },
					{ path: 'offer', component: AdminOfferComponent },
					{ path: 'account', component: AdminAccountComponent },
					{ path: 'account/user/dashboard', component: UserDashboardComponent },
					{ path: 'account/user/statement', component: UserStateComponent },
					{ path: 'account/user/redeem', component: UserRedeemComponent },
					{ path: 'account/user/employees', component: UserEmployeesComponent }
				]
			}
		])
	]
})
export class AdminModule {

}