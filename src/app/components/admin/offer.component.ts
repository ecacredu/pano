import { Component, ViewChild, AfterViewInit, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, Validators, FormControl, FormBuilder } from "@angular/forms";
import { ToastyService, ToastyConfig, ToastyComponent, ToastOptions, ToastData } from 'ng2-toasty';
import { AdminService } from '../../providers/adminrights';
declare var jQuery: any;

@Component({
  selector: 'admin-offer',
  templateUrl: 'offer.component.html',
  styleUrls: ['offer.component.css']
})

export class AdminOfferComponent {

  sendEmailForm: FormGroup;
  sendSmsForm: FormGroup;

  public waitToastID: any;
  public successToastID: any;
  public errorToastID: any;


  constructor(public element: ElementRef, private adService: AdminService, private toastyService: ToastyService, private _formBuilder: FormBuilder) {



  }

  ngOnInit() {

    this.createOfferMailForm();

    this.createOfferSmsForm();

  }

  createOfferMailForm() {
    this.sendEmailForm = new FormGroup({
      'offermail': new FormControl('', Validators.compose([
        Validators.required,
        this.isEmail
      ])),
      'offersubject': new FormControl('', Validators.required),
      'offermessage': new FormControl('', Validators.required)
    });
  }

  createOfferSmsForm() {
    this.sendSmsForm = new FormGroup({
      'smsnumber': new FormControl('', Validators.compose([
        Validators.required,
        this.isContact
      ])),
      'smsmessage': new FormControl('', Validators.required)
    });
  }


  onSendOfferMail(type: any) {
    let tempUser = this.sendEmailForm.value;
    this.addToast('wait', 'Deleting Invoice', (type == 'Yes' ? 'Boosting mail offer to all...' : 'Sending Mail...'), 30000);
    let form: any = {
      type: 'boost',
      title: 'Offer',
      field_mailto: { und: [{ value: tempUser.offermail }] },
      field_mailsubject: { und: [{ value: tempUser.offersubject }] },
      field_mailbody: { und: [{ value: tempUser.offermessage }] },
      field_boost_type: { und: [(type == 'Yes' ? 'All' : 'Individual')] },
      field_contact_type: { und: ['Mail'] }
    };
    this.adService.sendOfferNoti(form).subscribe((res) => {
      if (res.status == 200) {
        this.toastyService.clear(this.waitToastID);
        this.addToast('success', 'Success !', 'Offer sent.', 5000);
        this.createOfferMailForm();
        this.createOfferSmsForm();
      }

    });

  }

  onSendOfferSms(type: any) {
    let tempUser = this.sendSmsForm.value;
    this.addToast('wait', 'Deleting Invoice', (type == 'Yes' ? 'Boosting sms offer to all...' : 'Sending SMS...'), 30000);
    let form: any = {
      type: 'boost',
      title: 'Offer',
      field_smscontact: { und: [{ value: tempUser.smsnumber }] },
      field_mailbody: { und: [{ value: tempUser.smsmessage }] },
      field_boost_type: { und: [(type == 'Yes' ? 'All' : 'Individual')] },
      field_contact_type: { und: ['SMS'] }
    };
    // console.log(JSON.stringify(form));
    this.adService.sendOfferNoti(form).subscribe((res) => {
      if (res.status == 200) {
        this.toastyService.clear(this.waitToastID);
        this.addToast('success', 'Success !', 'Offer sent.', 5000);
        this.createOfferMailForm();
        this.createOfferSmsForm();
      }

    });

  }

  private isEmail(control: any): { [s: string]: boolean } {
    if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
      return { invalidMail: true };
    }
  }

  private isContact(control: any): { [s: string]: boolean } {
    if (!control.value.match("^[0-9]{1,12}$")) {
      return { invalidContact: true };
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
        // console.log('Toast ' + toast.id + ' has been added!');
        if (type == 'wait') {
          this.waitToastID = toast.id;
        } else if (type == 'success') {
          this.successToastID = toast.id;
        } else if (type == 'error') {
          this.errorToastID = toast.id;
        }

      },
      onRemove: function (toast: ToastData) {
        // console.log('Toast ' + toast.id + ' has been removed!');
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
