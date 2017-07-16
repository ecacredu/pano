import { Component, ViewChild, AfterViewInit, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastyService, ToastyConfig, ToastyComponent, ToastOptions, ToastData } from 'ng2-toasty';
import { UserService } from '../../providers/userservice';
declare var jQuery: any;

@Component({
  selector: 'admin-account',
  templateUrl: 'account.component.html',
  styleUrls: ['account.component.css']
})

export class AdminAccountComponent {

  public accountid: any;
  public waitToastID: any;
  public successToastID: any;
  public errorToastID: any;

  constructor(public element: ElementRef, public router: Router, private userService: UserService, private toastyService: ToastyService) {



  }

  ngOnInit() {


  }

  maskUserFunc(id: any) {
    this.addToast('wait', 'Logging User', 'Logging into users account...', 30000);
    this.userService.getUser(id.replace(/^0+/, ''), true).subscribe((res) => {
      if (res.status == 200) {
        this.toastyService.clear(this.waitToastID);
        this.addToast('success', 'Success', 'Logging...', 3000);
        this.userService.maskUser = res.data;
        this.router.navigate(['/admin/account/user/dashboard']);
      }
    }, (err) => {
      this.toastyService.clear(this.waitToastID);
      this.addToast('error', 'Error', err.json(), 8000);
    });
  }

  public addToast(type: any, rtitle: string, message: string, timeout: number) {
    // Just add default Toast with title only
    // Or create the instance of ToastOptions
    var toastOptions: ToastOptions = {
      title: rtitle,
      msg: message,
      showClose: false,
      theme: 'default',
      timeout: timeout,
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
        if (type == 'wait') {
          this.waitToastID = toast.id;
        } else if (type == 'success') {
          this.successToastID = toast.id;
        } else if (type == 'error') {
          this.errorToastID = toast.id;
        }

      },
      onRemove: function (toast: ToastData) {
        console.log('Toast ' + toast.id + ' has been removed!');
        if (type == 'wait') {
          this.waitToastID = null;
        } else if (type == 'success') {
          this.successToastID = null;
        } else if (type == 'error') {
          this.errorToastID = null;
        }
      }
    };

    if (type == 'wait') {
      this.toastyService.wait(toastOptions);
    } else if (type == 'success') {
      this.toastyService.success(toastOptions);
    } else if (type == 'error') {
      this.toastyService.error(toastOptions);
    }
  }

}
