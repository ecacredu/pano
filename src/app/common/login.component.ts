import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { Component, ViewChild, AfterViewInit, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { FormGroup, Validators, FormControl, FormBuilder } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { UserService } from '../providers/userservice';
import { SecureService } from '../providers/secureservice';

@Component({
  selector: 'login-view',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginView implements OnInit {
  public subs: Observable<string>;

  public variable: String;

  myForm: FormGroup;
  user = { username: '', password: '' };

  constructor(private router: Router, private _formBuilder: FormBuilder, private userService: UserService, public ss: SecureService, public storage: LocalStorageService) {
    this.variable = this.ss.getValue();
  }

  onLoginSubmit() {
    this.user = this.myForm.value;
    //console.log(JSON.stringify(this.user));
    this.userService.userLogin(JSON.stringify(this.user))
      .subscribe(items => {
        if (items == 'ok') {
          if (this.storage.retrieve('activeUser') == null || this.storage.retrieve('activeUser') == undefined) {
            this.router.navigate(['login']);
          } else if (this.storage.retrieve('activeUser').roles['3'] != null && this.storage.retrieve('activeUser').roles['3'] != undefined && this.storage.retrieve('activeUser').roles['3'] == 'administrator') {
            console.log(this.storage.retrieve('activeUser').roles['3']);
            this.router.navigate(['/admin']);
          } else if (this.storage.retrieve('activeUser').roles['2'] != null && this.storage.retrieve('activeUser').roles['2'] != undefined && this.storage.retrieve('activeUser').roles['2'] == 'authenticated user' && this.storage.retrieve('activeUser').roles['3'] == undefined) {
            console.log(this.storage.retrieve('activeUser').roles['2']);
            this.router.navigate(['/user']);
          }
        }
      },
      err => console.log(err));
  }

  ngOnInit(): any {
    this.myForm = new FormGroup({
      'username': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });
  }

  logmeout() {
    this.userService.userLogout()
      .subscribe(items => console.log(items));
  }
}
