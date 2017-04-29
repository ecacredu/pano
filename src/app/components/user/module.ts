import {NgModule, Component} from '@angular/core'
import {RouterModule} from '@angular/router'
import { UserComponent } from './component';
import { UserDashboardComponent } from './dashboard.component';
import { UserStateComponent } from './statement.component';
import { UserRedeemComponent } from './redeem.component';
import { UserEmployeesComponent } from './employee.component';
import { UserContactComponent } from './contact.component';
import { SharedModule } from '../../shared.module';

@NgModule({
	declarations: [
		UserComponent,
		UserDashboardComponent,
		UserStateComponent,
		UserRedeemComponent,
		UserEmployeesComponent,
		UserContactComponent
		],
	imports: [
		SharedModule,
		RouterModule.forChild([
			{ path: '', component: UserComponent,
				children: [
					{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
					{ path: 'dashboard', component: UserDashboardComponent },
					{ path: 'statement', component: UserStateComponent },
					{ path: 'redeem', component: UserRedeemComponent },
					{ path: 'contact', component: UserContactComponent },
					{ path: 'employees', component: UserEmployeesComponent }
				]
			}
		])
	]
})
export class UserModule {

}