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
    public newHotelmilage:any;
    public newPackagemilage:any;
    public waitToastID:any;
    public successToastID:any;
    public errorToastID:any;

    public invoiceInfo:any;
    public userInfo:any;

    constructor(public element: ElementRef,private adService:AdminService,private toastyService:ToastyService) {

    }

    ngOnInit() {
      // this.milage=this.adService.retrieveOfferMilage();
      this.adService.getOfferMilage().subscribe((res)=>{
          let offers = this.adService.retrieveOfferMilage();
          console.log("PERCENTS: "+JSON.stringify(offers))
          this.newmilage = offers.percent;
          this.newPackagemilage = offers.percent_package;
          this.newHotelmilage = offers.percent_hotel;
      });
      this.invoiceInfo=this.adService.refreshInvoiceDetails();
      this.userInfo=this.adService.refreshUserDetails();
    }

    updateMil(mil : any, type:String){
      this.addToast('wait','Updating !','Updating Milage.', 50000);
      this.adService.updateMilage(mil,type).subscribe((res)=>{
        if(res.status==200){
          this.newmilage=null;
          this.toastyService.clear(this.waitToastID);
          this.addToast('success','Success !','Milage changed successfully.', 5000);
          this.adService.getOfferMilage().subscribe((res)=>{
              let offers = this.adService.retrieveOfferMilage();
              this.newmilage = offers.percent;
              this.newPackagemilage = offers.percent_package;
              this.newHotelmilage = offers.percent_hotel;
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
