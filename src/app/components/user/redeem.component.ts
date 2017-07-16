import { Component, ViewChild, AfterViewInit, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { LocalStorageService, LocalStorage } from 'ng2-webstorage';
import { ToastyService, ToastyConfig, ToastyComponent, ToastOptions, ToastData } from 'ng2-toasty';
import { UserService } from '../../providers/userservice';
declare var jQuery: any;

@Component({
  selector: 'user-redeem',
  templateUrl: 'redeem.component.html',
  styleUrls: ['redeem.component.css']
})

export class UserRedeemComponent {

  public withDrawIn: any;
  public cancelIn: any;
  public userDetails: any;

  public activeUser: any;

  public waitToastID: any;
  public successToastID: any;
  public errorToastID: any;

  constructor(public element: ElementRef, private us: UserService, public storage: LocalStorageService, private toastyService: ToastyService) {

    this.activeUser = this.storage.retrieve('activeUser');
    if (this.us.maskUser.id == undefined) {
      this.us.getUser(this.activeUser.uid, false).subscribe((res) => { });
    } else {
      this.us.getUser(this.us.maskUser.id, true).subscribe((res) => { });
    }
  }

  ngOnInit() {


  }

  ngDoCheck() {
    if (this.us.maskUser.id == undefined) {
      this.userDetails = this.us.userDetails;
    } else {
      this.userDetails = this.us.maskDetails;
    }

  }

  submitRedeem(type: string, val: number) {

    let float: any = parseFloat(this.userDetails.float); let balance: any = parseFloat(this.userDetails.balance);

    if (type == 'withdraw') {
      float = float + val;
      balance = balance - val;
    } else if (type == 'cancel') {
      float = float - val;
      balance = balance + val;

      if(float < 0){
        this.addToast('error', 'Error !', 'Insufficient Balance !', 8000);
        return;
      }
    }

    if (balance >= 0) {
      let form = {
        field_claimed_milage: { und: [{ value: float }] },
        field_balance: { und: [{ value: balance }] }
      };

      this.addToast('wait', 'Updating !', 'Updating points...', 50000);

      if (this.us.maskUser.id == undefined) {
        this.us.updateUserPoints(this.activeUser.uid, form).subscribe((res) => {
          if (res.status == 200) {
            this.withDrawIn = null;
            this.cancelIn = null;
            this.toastyService.clear(this.waitToastID);
            this.addToast('success', 'Successfull !', 'Points updated !', 10000);
            this.us.getUser(this.activeUser.uid, false).subscribe((res) => { });
          }
        });

      } else {
        this.us.updateUserPoints(this.us.maskUser.id, form).subscribe((res) => {
          if (res.status == 200) {
            this.withDrawIn = null;
            this.cancelIn = null;
            this.toastyService.clear(this.waitToastID);
            this.addToast('success', 'Successfull !', 'Points updated !', 10000);
            this.us.getUser(this.us.maskUser.id, true).subscribe((res) => { });
          }
        });

      }
    } else {
      this.addToast('error', 'Error !', 'Insufficient Balance !', 8000);
    }





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
