import {Component, ViewChild, AfterViewInit,ElementRef,HostListener,OnInit} from '@angular/core';
import {Router,ActivatedRoute} from "@angular/router";
import {LocalStorageService, SessionStorageService} from 'ng2-webstorage';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { Observable } from 'rxjs/Observable';
import { SecureService } from '../providers/secureservice';
import { UserService } from '../providers/userservice';
declare var jQuery: any;
declare var navline:any;
declare var google:any;

@Component({
  selector: 'home-view',
  // template: `heloooooooo`,
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeView implements OnInit {
  public subs: Observable<string>;
  config: Object = {
            slidesPerView: 1,
            loop: true,
            spaceBetween: 0,
            resistance : true,
            resistanceRatio : 0,
            keyboardControl: true,
            duration:1000,
            effect:'side',
            autoplay:4000,
            autoplayDisableOnInteraction: false
        };

  public allSlides: any = [];

  constructor(private router: Router, private route: ActivatedRoute,public us:UserService,public ss:SecureService,public storage:LocalStorageService) { 
    this.us.getSlides().subscribe((res)=>{
          if(res.status==200){
              this.allSlides=this.us.allSlides;
          }});//
  }

  ngOnInit() {
    // setInterval(function(){
    //   jQuery('.dubaiCircle').toggleClass('animated pulse');
    // }, 3500);

    jQuery("#navline").delay(8800).animate({
      right: '2em',
      width: '00px',
      transition: 'max-height 0.25s ease-in',
    });
    jQuery("nav").delay(8000).slideUp("slow");
    //jQuery("a").show(0).delay(8000).hide(0);

    jQuery("#menuButton").addClass('rotate');




    // this.dataService.getData();
    				var mapProp = {
    center:new google.maps.LatLng(51.508742,-0.120850),
    zoom:5,
    mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    var map=new google.maps.Map(document.getElementById("googleMap"), mapProp);



    jQuery("nav a").click(function (e) {
      e.preventDefault();
      if (e.currentTarget.id != 'internationalTours' && e.currentTarget.id != 'domesticTours') {
        var sectionID = e.currentTarget.id + "section";
        var move = jQuery("#" + sectionID).offset().top;
        var delay = 1000;
        jQuery("body,html").animate({ scrollTop: move }, delay);
      }

    });

    // jQuery(".menu button").click(function(e){
    //
    // });



  }

  menuClick() {
    var widt = navline.clientWidth;
    var oriwidth = widt;

    if (widt == 0) {
      jQuery("#navline").animate({
        right: '3%',
        width: '91%',
        transition: 'max-height 0.25s ease-in'
      });


      jQuery("nav").delay(500).slideDown("slow");
      //  jQuery("a").show();
      jQuery("#menuButton").removeClass('rotate');
    }


    else {
      jQuery("#navline").delay(800).animate({
        right: '2em',
        width: '00px',
        transition: 'max-height 0.25s ease-in',
      });
      jQuery("nav").slideUp("slow");
      //  jQuery("a").hide();
      jQuery("#menuButton").addClass('rotate');
    }
  }

  goToLogin() {
    if(this.storage.retrieve('activeUser')==null || this.storage.retrieve('activeUser')==undefined){
            this.router.navigate(['/login']);
        }else if(this.storage.retrieve('activeUser').roles['3'] !=null && this.storage.retrieve('activeUser').roles['3'] != undefined && this.storage.retrieve('activeUser').roles['3']=='administrator'){
            console.log(this.storage.retrieve('activeUser').roles['3']);
            this.router.navigate(['/admin']);
        }else if(this.storage.retrieve('activeUser').roles['2'] !=null && this.storage.retrieve('activeUser').roles['2'] != undefined && this.storage.retrieve('activeUser').roles['2']=='authenticated user' && this.storage.retrieve('activeUser').roles['3']==undefined){
          console.log(this.storage.retrieve('activeUser').roles['2']);
          this.router.navigate(['/user']);
        }

  }
}
