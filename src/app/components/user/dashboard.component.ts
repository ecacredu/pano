import {Component, ViewChild, AfterViewInit,ElementRef,HostListener,OnInit} from '@angular/core';
import {Router,ActivatedRoute} from "@angular/router";
import {LocalStorageService, LocalStorage} from 'ng2-webstorage';
import { UserService } from '../../providers/userservice';
declare var jQuery:any;

@Component({
    selector: 'user-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})

export class UserDashboardComponent{

    public userDetails:any;
    public activeUser:any;
    constructor(public element: ElementRef,private us: UserService,public storage:LocalStorageService) {

      this.activeUser=this.storage.retrieve('activeUser');
      if(this.us.maskUser.id == undefined){
        //alert('Dont Mask');
        this.us.getUser(this.activeUser.uid,false).subscribe((res)=>{});
      }else{
      //  alert('Mask');
      this.us.getUser(this.us.maskUser.id,true).subscribe((res)=>{});
      }


    }

    ngOnInit() {



    }

    ngDoCheck(){

      if(this.us.maskUser.id == undefined){
        this.userDetails=this.us.userDetails;
      }else{
        this.userDetails=this.us.maskDetails;
      }

    }



}
