import {Component, ViewChild, AfterViewInit,ElementRef,HostListener,OnInit} from '@angular/core';
import {Router,ActivatedRoute,} from "@angular/router";
import {ToastyService, ToastyConfig, ToastyComponent, ToastOptions, ToastData} from 'ng2-toasty';
import { SecureService } from '../../providers/secureservice';
import { AdminService } from '../../providers/adminrights';
declare var jQuery:any;

@Component({
    selector: 'admin-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})

export class AdminDashboardComponent{

    public milage:any;
    public newmilage:any;
    public waitToastID:any;
    public successToastID:any;
    public errorToastID:any;

    public invoiceInfo:any;
    public userInfo:any;

    constructor(public element: ElementRef,private adService:AdminService,private toastyService:ToastyService) {

      this.adService.getOfferMilage().subscribe((res)=>{});

    }

    ngDoCheck() {
      this.milage=this.adService.retrieveOfferMilage();
      this.invoiceInfo=this.adService.refreshInvoiceDetails();
      this.userInfo=this.adService.refreshUserDetails();
    }

    updateMil(mil : any){
      this.addToast('wait','Updating !','Updating Milage.', 50000);
      this.adService.updateMilage(mil).subscribe((res)=>{
        if(res.status==200){
          this.newmilage=null;
          this.toastyService.clear(this.waitToastID);
          this.addToast('success','Success !','Milage changed successfully.', 5000);
          this.adService.getOfferMilage().subscribe((res)=>{
            this.milage=this.adService.retrieveOfferMilage();
          });
        }
      });
    }

    public addToast(type:any,rtitle:string,message:string,timeout:number) {
        // Just add default Toast with title only
        // Or create the instance of ToastOptions
        var toastOptions:ToastOptions = {
            title: rtitle,
            msg: message,
            showClose: false,
            theme: 'default',
            timeout:timeout,
            onAdd: (toast:ToastData) => {
                if(type=='wait'){
                  this.waitToastID=toast.id;
                }else if(type=='success'){
                  this.successToastID=toast.id;
                }else if(type=='error'){
                  this.errorToastID=toast.id;
                }

            },
            onRemove: function(toast:ToastData) {
                if(type=='wait'){
                  this.waitToastID=null;
                }else if(type=='success'){
                  this.successToastID=null;
                }else if(type=='error'){
                  this.errorToastID=null;
                }
            }
        };

        if(type=='wait'){
          this.toastyService.wait(toastOptions);
        }else if(type=='success'){
          this.toastyService.success(toastOptions);
        }else if(type=='error'){
          this.toastyService.error(toastOptions);
        }
    }



}
