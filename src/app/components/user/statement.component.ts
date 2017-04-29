import { Component, ViewChild, AfterViewInit, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { SearchStatePipe } from '../../pipes/searchstatement-pipe';
import { LocalStorageService, LocalStorage } from 'ng2-webstorage';
import { UserService } from '../../providers/userservice';
declare var jQuery: any;

@Component({
  selector: 'user-statement',
  templateUrl: 'statement.component.html',
  styleUrls: ['statement.component.css']
})

export class UserStateComponent {

  public activeUser: any;
  public customSearch: string = "";
  public allStatements: any = [];

  constructor(public element: ElementRef, private us: UserService, public storage: LocalStorageService) {

    this.activeUser = this.storage.retrieve('activeUser');
    if (this.us.maskUser.id == undefined) {
      this.us.getStatements(this.activeUser.uid).subscribe((res) => {
        this.allStatements = res.data;
      });
    } else {
      this.us.getStatements(this.us.maskUser.id).subscribe((res) => {
        this.allStatements = res.data;
      });
    }



  }

  ngDoCheck() {
    this.allStatements = this.us.allStatesments;
  }

  ngOnInit() {

    jQuery(".usertable").niceScroll({ cursorwidth: "6px", cursorborder: "1px solid #ccc", cursorcolor: "#ccc", autohidemode: "cursor" });


  }

  printStatement() {
    var mywindow = window.open('', 'Statement', 'height=0,width=0');
    mywindow.document.open();
    mywindow.document.onreadystatechange = function () {
      if (this.readyState === 'complete') {
        this.onreadystatechange = function () { };
        mywindow.focus();
        mywindow.print();
        //    mywindow.close();
      }
    }
    mywindow.document.write('<html><head><title>Statement</title>');
    mywindow.document.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous" type="text/css" />');
    mywindow.document.write('<link rel="stylesheet" href="/assets/css/print.css" type="text/css" />');
    mywindow.document.write('</head><body >');
    mywindow.document.write(jQuery('#tab').html());
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    //  mywindow.focus(); // necessary for IE >= 10

    //  mywindow.print();
    //mywindow.close();

    return true;

  }



}
