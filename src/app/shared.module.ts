import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './providers/userservice';
import { SecureService } from './providers/secureservice';
import { AdminService } from './providers/adminrights';

import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { SelectModule } from 'ng2-select';
import { ToastyModule } from 'ng2-toasty';
import { Ng2Webstorage } from 'ng2-webstorage';
import { SearchPipe } from './pipes/search-pipe';
import { SearchCordPipe } from './pipes/searchcord-pipe';
import { SearchEmpPipe } from './pipes/searchemployee-pipe';
import { SearchInvoicePipe } from './pipes/searchinvoice-pipe';
import { SearchPackagePipe } from './pipes/searchpackage-pipe';
import { SearchStatePipe } from './pipes/searchstatement-pipe';
import { PackageTypePipe } from './pipes/packagetype-pipe';
import { SweetAlertService } from 'ng2-sweetalert2';

const MODULES = [
    // Do NOT include UniversalModule, HttpModule, or JsonpModule here
    CommonModule,
    RouterModule,
    FormsModule,
    SelectModule,
    ReactiveFormsModule
];

const PIPES = [
    // put pipes here
    SearchPipe,
    SearchCordPipe,
    SearchEmpPipe,
    SearchInvoicePipe,
    SearchPackagePipe,
    SearchStatePipe,
    PackageTypePipe
];

const COMPONENTS = [
    // put shared components here
];

const PROVIDERS = [
    UserService,
    SecureService,
    AdminService,
    SweetAlertService
]

@NgModule({
    imports: [
        ...MODULES,
        Ng2Webstorage.forRoot({ prefix: 'panaroma', separator: '.' }),
        ToastyModule.forRoot(),
        ModalModule.forRoot(),
        DatepickerModule.forRoot(),
        ButtonsModule.forRoot()
    ],
    declarations: [
        ...PIPES,
        ...COMPONENTS
    ],
    exports: [
        ...MODULES,
        ...PIPES,
        ...COMPONENTS,
        Ng2Webstorage,
        ToastyModule,
        ModalModule,
        DatepickerModule,
        ButtonsModule
    ],
    providers: [
        ...PROVIDERS
    ]
})
export class SharedModule {
    // static forRoot(): ModuleWithProviders {
    //     return {
    //         ngModule: SharedModule,
    //         providers: [
    //             ...PROVIDERS
    //         ]
    //     };
    // }
}