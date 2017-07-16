import { Component, ViewChild, AfterViewInit, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { SelectComponent } from 'ng2-select/ng2-select';
import { Validators, FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { SearchInvoicePipe } from '../../pipes/searchinvoice-pipe';
import { ToastyService, ToastyConfig, ToastyComponent, ToastOptions, ToastData } from 'ng2-toasty';
import { SweetAlertService } from 'ng2-sweetalert2';
import { AdminService } from '../../providers/adminrights';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserService } from '../../providers/userservice';
declare var jQuery: any;
declare var self: any;
@Component({
  selector: 'admin-invoice',
  templateUrl: 'invoice.component.html',
  styleUrls: ['invoice.component.css']
})

export class AdminInvoiceComponent {

  @ViewChild('lgModal') public lgModal: ModalDirective;

  @ViewChild('cordselect')
  private coselect: SelectComponent;

  @ViewChild('forselect')
  private foselect: SelectComponent;

  @ViewChild('statusselect')
  private statusselect: SelectComponent;

  addInvoiceForm: FormGroup;

  public invoiceid: string = '';
  public description: string = '';
  public from: string = '';
  public to: string = '';
  public seats: any = null;

  public file: File;
  public reader: FileReader;
  public encodedFile: string;
  public finalFileObject: any;

  public invoiceInfo: any;

  public AllInvoices: any = [];
  public customSearch: string = "";
  public waitToastID: any;
  public successToastID: any;
  public errorToastID: any;

  public selecteduid: any;

  public fid: any;
  public updateIn: boolean = false;

  public status: any = [
    { id: '0', text: 'Pending' },
    { id: '1', text: 'Completed' },
    { id: '2', text: 'Cancelled' }
  ];

  public bookingfor: any = [
    { id: '0', text: 'Bus' },
    { id: '1', text: 'Train' },
    { id: '2', text: 'Flight' },
    { id: '3', text: 'Hotel' },
    { id: '4', text: 'Visa' },
    { id: '5', text: 'Package' },
    { id: '6', text: 'Car' }
  ];

  public allusers: any = [];
  public allcoords: any = [];

  public invoiceToUpdate: any;

  public disabled: boolean = true;

  public selectedStatus: any;
  public selectedBookingfor: any;
  public fromPlace: string;
  public toPlace: string;

  public selectedCord: any;

  public showOnDatePicker: boolean = false;
  public onDate: Date = new Date();
  public onDateDay: string = ''; public onDateMonth: string = ''; public onDateYear: string = '';

  public addInvoiceSelectedUser: any;
  public addInvoiceSelectedCord: any;

  public invoicecost: any;
  public netinvoicecost: any;
  public floattoredeem: any;

  public updateredeemed: any;

  public invoicetoupdateid: any;
  public fromTrue = false;

  public initialStatus = '';
  public newStatus = '';

  constructor(public swalService: SweetAlertService, public element: ElementRef, private toastyService: ToastyService, private adService: AdminService, public us: UserService) {
    self = this;
    this.selectedStatus = this.status[0];
    this.adService.getAllCords().subscribe((res) => { });

  }

  public toggleOnDatePicker(): void {
    this.showOnDatePicker = !this.showOnDatePicker;
  }

  public onDateChange(value: any): void {
    this.onDateDay = value.getDate().toString();
    this.onDateMonth = (value.getMonth() + 1).toString();
    this.onDateYear = value.getFullYear().toString();
  }

  ngOnInit() {
    jQuery(".invoicetable").niceScroll({ cursorwidth: "6px", cursorborder: "1px solid #ccc", cursorcolor: "#ccc", autohidemode: "cursor" });
    this.createForm();


  }

  ngDoCheck() {
    this.AllInvoices = this.adService.retrieveInvoices();
    this.invoiceInfo = this.adService.refreshInvoiceDetails();

  }

  createForm() {
    this.addInvoiceForm = new FormGroup({});
  }

  createAutoForm(invoice: any) {

    let htmldate: any = invoice.journey_date;

    this.invoiceToUpdate = invoice;

    var div = document.createElement('div');
    div.innerHTML = htmldate;
    var text = div.textContent || div.innerText || '';

    var parts = text.split('/');
    this.onDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    this.onDateDay = this.onDate.getDate().toString();
    this.onDateMonth = (this.onDate.getMonth() + 1).toString();
    this.onDateYear = this.onDate.getFullYear().toString();
    // console.log(this.onDate);
    // console.log(this.onDateDay + ' -- ' + this.onDateMonth + ' -- ' + this.onDateYear);

    this.invoicetoupdateid = invoice.nid;

    // console.log(invoice.booking_for);

    this.invoiceid = invoice.title;
    this.description = invoice.description;
    this.from = invoice.from;
    this.to = invoice.to;
    this.seats = invoice.seats;
    this.foselect.active = [{ text: invoice.booking_for }];
    this.selectedBookingfor = { text: invoice.booking_for };

    this.statusselect.active = [{ text: invoice.status }];
    this.selectedStatus = { text: invoice.status };
    this.initialStatus = invoice.status;

    this.updateredeemed = invoice.milage_redeemed;
    this.invoicecost = invoice.invoice_cost;
    this.netinvoicecost = invoice.net_invoice_amount;


    // this.onDate=new Date();
    // this.onDateDay='';this.onDateMonth='';this.onDateYear='';

    this.selecteduid = invoice.booked_by;
    this.addInvoiceSelectedUser = this.adService.retrieveUserByUnique(invoice.booked_by);
    this.allcoords = this.adService.retrieveCordsForUser(invoice.booked_by);
    if (this.addInvoiceSelectedUser != undefined) {
      this.floattoredeem = this.addInvoiceSelectedUser.float;
    }

    this.addInvoiceSelectedCord = this.adService.retrieveCordById(invoice.co_ordinator);
    // this.coselect.active=[this.addInvoiceSelectedCord];
    this.selectedCord = this.addInvoiceSelectedCord;
    // if(this.allcoords.length){
    //     this.disabled=false;
    //   }

    this.addInvoiceForm = new FormGroup({
    });


    this.lgModal.toggle();
    // jQuery('#myModal').modal('toggle');
  }

  openForm() {
    this.updateIn = false;
    this.invoiceid = ''; this.description = ''; this.from = ''; this.to = ''; this.seats = null;
    this.selecteduid = ''; this.allcoords = []; this.addInvoiceSelectedCord = undefined; this.addInvoiceSelectedCord = undefined;
    this.selectedBookingfor = undefined;
    this.updateredeemed = undefined;
    this.invoicecost = undefined;
    this.netinvoicecost = undefined;
    this.floattoredeem = undefined;
    // var activeItem2 = this.foselect.activeOption;
    // if (activeItem2) {
    //     this.foselect.remove(activeItem2)
    //   }
    // this.coselect.remove();
    //  this.foselect.remove();
    if (!this.allcoords.length) {
      this.disabled = true;
    }
    this.onDate = new Date();
    this.onDateDay = ''; this.onDateMonth = ''; this.onDateYear = '';
    // jQuery('#myModal').modal('toggle');
    this.lgModal.toggle();
  }

  openAutoFil(invoice: any) {
    this.updateIn = true;
    this.createAutoForm(invoice);
  }

  onAddInvoiceSubmit(ev: any) {
    ev.preventDefault();
    if (this.errorToastID) {
      this.toastyService.clear(this.errorToastID);
    }
    let tempUser = this.addInvoiceForm.value;
    let tempext: any;
    let invoiceform: any;
    let stateForm: any;
    // console.log(JSON.stringify(this.addInvoiceSelectedUser));
    // console.log(JSON.stringify(this.addInvoiceSelectedCord));
    // console.log(JSON.stringify(this.finalFileObject));
    if (this.invoiceid == '') {
      this.addToast('error', 'Error !', 'Invoice id required.', 10000);
    }
    else if (this.description == '') {
      this.addToast('error', 'Error !', 'Description required.', 10000);
    }
    else if (this.to == '') {
      this.addToast('error', 'Error !', 'To field required.', 10000);
    }
    else if (this.seats == null) {
      this.addToast('error', 'Error !', 'Seats required.', 10000);
    }
    else if (this.addInvoiceSelectedUser == undefined || this.addInvoiceSelectedCord == undefined) {
      this.addToast('error', 'Error !', 'User / co-ordinator not selected.', 10000);
    }
    else if (this.onDateDay == '' && this.onDateMonth == '' && this.onDateYear == '') {
      this.addToast('error', 'Error !', 'Journey date not selected.', 10000);
    }
    else if (this.selectedBookingfor == undefined) {
      this.addToast('error', 'Error !', 'Transport mode not selected.', 10000);
    }
    else if (this.invoicecost == undefined) {
      this.addToast('error', 'Error !', 'Invoice cost is missing.', 10000);
    }
    else {

      if (this.updateIn == true) {

        if (this.file == undefined || this.finalFileObject == undefined) {
          if (this.waitToastID) {
            this.toastyService.clear(this.waitToastID);
          }
          this.addToast('wait', 'Updating !', 'Updating invoice', 50000);

          invoiceform = {
            title: this.invoiceid,
            type: 'invoice',
            // name: this.addInvoiceSelectedUser.name,
            field_booked_by: { und: '[uid (' + this.addInvoiceSelectedUser.id + ')]' },
            field_co_ordinator: { und: '[nid (' + this.addInvoiceSelectedCord.id + ')]' },
            field_booking_for: { und: [this.selectedBookingfor.text] },
            field_description: { und: [{ value: this.description }] },
            field_from: { und: [{ value: this.from }] },
            field_to: { und: [{ value: this.to }] },
            field_seats: { und: [{ value: this.seats }] },
            field_status: { und: [this.selectedStatus.text] },
            field_journey_date: {
              und: [
                { value: { day: this.onDateDay, month: this.onDateMonth, year: this.onDateYear } }]
            }
          };

          let currentUserClaims = this.getUserClaimedMilage(this.invoiceToUpdate.user);

          if (this.initialStatus != this.newStatus) {


            if (this.initialStatus == "Cancelled") {
              invoiceform.field_points_redeemed = { und: [{ value: currentUserClaims }] };
            }



            if (this.selectedStatus.text == "Pending") {
              invoiceform.field_milage_recieved = { und: [{ value: "0" }] };
            }

            if (this.selectedStatus.text == "Completed") {
              invoiceform.field_milage_recieved = { und: [{ value: parseInt(((parseFloat(this.netinvoicecost) * parseFloat(this.invoiceToUpdate.milage_percent)) / 100) + '') + '' }] };
            }

            if (this.selectedStatus.text == "Cancelled") {
              invoiceform.field_milage_recieved = { und: [{ value: "0" }] };
              invoiceform.field_points_redeemed = { und: [{ value: "0" }] };
            }
          }

          // console.log(JSON.stringify(invoiceform));

          this.adService.updateInvoice(invoiceform, this.invoicetoupdateid).subscribe((inres) => {
            if (inres.status == 200) {
              if (this.waitToastID) {
                this.toastyService.clear(this.waitToastID);
              }
              this.addToast('success', 'Success !', 'Invoice updated successfully.', 5000);

              //Edit
              if (this.newStatus != this.initialStatus) {

                if (this.initialStatus == "Cancelled") {
                  let temp = {
                    field_claimed_milage: { und: [{ value: "0" }] }
                  };
                  this.us.updateUserPoints(this.selecteduid, temp).subscribe((res) => {
                    this.addToast('success', 'Success !', 'User updated successfully.', 5000);
                  });
                }
                if (this.newStatus == "Cancelled") {
                  //Set User Claim to milageRedeemed
                  //Set milage Redeemed to 0
                  let temp = {
                    field_claimed_milage: { und: [{ value: this.invoiceToUpdate.milage_redeemed }] }
                    // field_claimed_milage: { und: [{ value: "0" }] }
                  };
                  this.us.updateUserPoints(this.selecteduid, temp).subscribe((res) => {
                    this.addToast('success', 'Success !', 'User updated successfully.', 5000);
                  });

                }

              }
              // this.adService.getAllInvoices().subscribe((res) => {
              //   this.AllInvoices = this.adService.retrieveInvoices();
              // });
              // this.adService.getOfferMilage().subscribe((res) => { });
              // if (this.selectedStatus.text == 'Cancelled' || this.selectedStatus.text=='Departed') {
              //   let percentoffer: any = this.adService.retrieveOfferMilage();

              //   let finalmilagetoadd: any = (this.netinvoicecost * parseFloat(percentoffer.percent)) / 100;

              //   let floatToUpdate = parseFloat(this.adService.userDetails.float)-this.floattoredeem;

              //   if(this.selectedStatus.text=='Departed'){
              //     let updtuserform = {
              //         field_balance: { und: [{ value: Math.round(this.updateredeemed) }] }
              //         // field_redeemed : { und: [{ value: this.floattoredeem+"" }] },
              //         // field_float : { und: [{ value: floatToUpdate+"" }] }
              //       };

              //       this.adService.updateUserPoints(this.addInvoiceSelectedUser.id, updtuserform).subscribe((res) => {
              //         if (res.status == 200) {
              //           this.addToast('success', 'Successfull !', 'Points updated !', 4000);
              //         }
              //       });
              //   }

              //   stateForm = {
              //     title: 'Loyalty Points',
              //     type: 'loyalty_milage',
              //     name: this.addInvoiceSelectedUser.name,
              //     field_description: { und: [{ value: 'Against Invoice Cancellation ' + this.invoiceid }] },
              //     field_transaction_type: { und: ['Milage Deposit'] },
              //     field_milage: { und: [{ value: Math.round(this.updateredeemed) }] },
              //     field_against_invoice: { und: '[nid (' + this.invoicetoupdateid + ')]' },
              //   };

              //   this.adService.createStatement(stateForm).subscribe((sres) => {

              //     if (sres.status == 200) {
              //       if (this.waitToastID) {
              //         this.toastyService.clear(this.waitToastID);
              //       }
              //       this.addToast('success', 'Success !', 'Statement generated successfully.', 5000);
              //       this.openForm();
              //     } else {
              //       if (this.waitToastID) {
              //         this.toastyService.clear(this.waitToastID);
              //       }
              //       // console.log(JSON.stringify(sres.data));
              //       this.addToast('error', 'Error !', JSON.stringify(sres.data), 10000);
              //     }

              //   });
              // } else {
              //   this.openForm();
              // }

            } else {
              if (this.waitToastID) {
                this.toastyService.clear(this.waitToastID);
              }
              // console.log(JSON.stringify(inres.data));
              this.addToast('error', 'Error !', JSON.stringify(inres.data), 10000);
            }

          });
        } else {
          this.addToast('wait', 'Uploading !', 'Uploading invoice file.', 50000);

          if (this.file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            tempext = '.doc';
          } else {
            tempext = '.pdf';
          }

          let newfilename: any = 'invoice_' + this.onDateDay + '_' + this.onDateMonth + '_' + this.onDateYear + tempext;
          this.finalFileObject.filepath = 'public://invoices/' + this.addInvoiceSelectedUser.id + '/' + newfilename;
          // console.log(JSON.stringify(this.finalFileObject.filepath));
          this.adService.uploadInvoiceFile(this.finalFileObject).subscribe((res) => {
            // console.log(JSON.stringify(res.data));
            if (res.status == 200) {
              if (this.waitToastID) {
                this.toastyService.clear(this.waitToastID);
              }
              this.addToast('success', 'Success !', 'File uploaded successfully', 5000);
              this.addToast('wait', 'Saving !', 'Saving invoice', 50000);

              invoiceform = {
                title: this.invoiceid,
                type: 'invoice',
                // name: this.addInvoiceSelectedUser.name,
                field_booked_by: { und: '[uid (' + this.addInvoiceSelectedUser.id + ')]' },
                field_co_ordinator: { und: '[nid (' + this.addInvoiceSelectedCord.id + ')]' },
                field_booking_for: { und: [this.selectedBookingfor.text] },
                field_description: { und: [{ value: this.description }] },
                field_from: { und: [{ value: this.from }] },
                field_to: { und: [{ value: this.to }] },
                field_seats: { und: [{ value: this.seats }] },
                field_invoice_file: { und: [{ fid: res.data.fid }] },
                field_status: { und: [this.selectedStatus.text] },
                field_journey_date: {
                  und: [
                    { value: { day: this.onDateDay, month: this.onDateMonth, year: this.onDateYear } }]
                }
              };


              let currentUserClaims = this.getUserClaimedMilage(this.invoiceToUpdate.user);

              if (this.initialStatus != this.newStatus) {


                if (this.initialStatus == "Cancelled") {
                  invoiceform.field_points_redeemed = { und: [{ value: currentUserClaims }] };
                }



                if (this.selectedStatus.text == "Pending") {
                  invoiceform.field_milage_recieved = { und: [{ value: "0" }] };
                }

                if (this.selectedStatus.text == "Completed") {
                  invoiceform.field_milage_recieved = { und: [{ value: ((parseFloat(this.netinvoicecost) * parseFloat(this.invoiceToUpdate.milage_percent)) / 100) + '' }] };
                }

                if (this.selectedStatus.text == "Cancelled") {
                  invoiceform.field_milage_recieved = { und: [{ value: "0" }] };
                  invoiceform.field_points_redeemed = { und: [{ value: "0" }] };
                }
              }

              // console.log(JSON.stringify(invoiceform));


              // console.log(JSON.stringify(invoiceform));

              this.adService.updateInvoice(invoiceform, this.invoicetoupdateid).subscribe((inres) => {
                if (inres.status == 200) {
                  if (this.waitToastID) {
                    this.toastyService.clear(this.waitToastID);
                  }
                  this.addToast('success', 'Success !', 'Invoice saved successfully.', 5000);

                  //Edit
                  if (this.newStatus != this.initialStatus) {

                    if (this.initialStatus == "Cancelled") {
                      let temp = {
                        field_claimed_milage: { und: [{ value: "0" }] }
                      };
                      this.us.updateUserPoints(this.selecteduid, temp).subscribe((res) => {
                        this.addToast('success', 'Success !', 'User updated successfully.', 5000);
                      });
                    }
                    if (this.newStatus == "Cancelled") {
                      //Set User Claim to milageRedeemed
                      //Set milage Redeemed to 0
                      let temp = {
                        field_claimed_milage: { und: [{ value: this.invoiceToUpdate.milage_redeemed }] }
                        // field_claimed_milage: { und: [{ value: "0" }] }
                      };
                      this.us.updateUserPoints(this.selecteduid, temp).subscribe((res) => {
                        this.addToast('success', 'Success !', 'User updated successfully.', 5000);
                      });

                    }

                  }
                  // this.addToast('wait', 'Saving !', 'Generating statement', 50000);
                  // this.adService.getAllInvoices().subscribe((res) => {
                  //   this.AllInvoices = this.adService.retrieveInvoices();
                  // });
                  // this.adService.getOfferMilage().subscribe((res) => { });
                  // if (this.selectedStatus.text == 'Cancelled' || this.selectedStatus.text=='Departed') {
                  //   let percentoffer: any = this.adService.retrieveOfferMilage();

                  //   let finalmilagetoadd: any = (this.netinvoicecost * parseFloat(percentoffer.percent)) / 100;

                  //   let floatToUpdate = parseFloat(this.adService.userDetails.float)-this.floattoredeem;

                  //   if(this.selectedStatus.text=='Departed'){
                  //       let updtuserform = {
                  //         field_balance: { und: [{ value: Math.round(this.updateredeemed) }] }
                  //         // field_redeemed : { und: [{ value: this.floattoredeem+"" }] },
                  //         // field_float : { und: [{ value: floatToUpdate+"" }] }
                  //       };

                  //       this.adService.updateUserPoints(this.addInvoiceSelectedUser.id, updtuserform).subscribe((res) => {
                  //         if (res.status == 200) {
                  //           this.addToast('success', 'Successfull !', 'Points updated !', 4000);
                  //         }
                  //       });
                  //     }



                  //   stateForm = {
                  //     title: 'Loyalty Points',
                  //     type: 'loyalty_milage',
                  //     name: this.addInvoiceSelectedUser.name,
                  //     field_description: { und: [{ value: this.description }] },
                  //     field_transaction_type: { und: ['Milage Deposit'] },
                  //     field_milage: { und: [{ value: Math.round(this.updateredeemed) }] },
                  //     field_against_invoice: { und: '[nid (' + this.invoicetoupdateid + ')]' },
                  //   };

                  //   this.adService.createStatement(stateForm).subscribe((sres) => {

                  //     if (sres.status == 200) {
                  //           if (this.waitToastID) {
                  //             this.toastyService.clear(this.waitToastID);
                  //           }
                  //           this.addToast('success', 'Success !', 'Statement generated successfully.', 5000);
                  //           this.openForm();
                  //     } else {
                  //       this.toastyService.clear(this.waitToastID);
                  //       // console.log(JSON.stringify(sres.data));
                  //       this.addToast('error', 'Error !', JSON.stringify(sres.data), 10000);
                  //     }

                  //   });

                  // } else {
                  //   this.openForm();
                  // }
                } else {
                  if (this.waitToastID) {
                    this.toastyService.clear(this.waitToastID);
                  }
                  // console.log(JSON.stringify(inres.data));
                  this.addToast('error', 'Error !', JSON.stringify(inres.data), 10000);
                }

              });



            } else {
              this.addToast('error', 'Error !', 'Error uploading file.', 10000);
            }

          });
        }

      } else {
        if (this.file == undefined || this.finalFileObject == undefined) {
          if (this.waitToastID) {
            this.toastyService.clear(this.waitToastID);
          }
          this.addToast('success', 'Success !', 'File uploaded successfully', 5000);
          this.addToast('wait', 'Saving !', 'Saving invoice', 50000);

          let milageForType = this.adService.retrieveOfferMilageAccordingToType(this.selectedBookingfor.text);
          return this.totalRecievedMilage(this.addInvoiceSelectedUser).then((totalMilages) => {


            // nahi ara are us din t
            console.log(JSON.stringify(totalMilages))
            let milageBalance: number = parseFloat(totalMilages['totalMilage']) - parseFloat(totalMilages['totalRedeemed']);

            // console.log("TOTALS : "+ parseFloat(totalMilages['totalMilage'])+" "+parseFloat(totalMilages['totalRedeemed']));

            //Yeh Return kaise kar raha hai? Function band ho jayega na? aisehi return hai woh kaam ka nahi
            //But function isse aage kaise badh raha hai? uske andar hai then
            return this.getUserClaimedMilage(this.addInvoiceSelectedUser).then((milageToBeRedeemed) => {
              //OK // aya kya? Haa
              //   let milageToBeRedeemed = this.getUserClaimedMilage(this.addInvoiceSelectedUser) || 0;
              console.log(milageBalance + "Milage Balance");
              console.log(milageToBeRedeemed + " Milage To Be Redeemed");
              if (milageBalance < milageToBeRedeemed) {
                console.log("Reached here 2");
                return;
              }



              invoiceform = {
                field_milage_percent: { und: [{ value: milageForType }] },
                title: this.invoiceid,
                type: 'invoice',
                // name: this.addInvoiceSelectedUser.name,
                field_user: { und: '[uid (' + this.addInvoiceSelectedUser.id + ')]' },
                field_booked_by: { und: '[uid (' + this.addInvoiceSelectedUser.id + ')]' },
                field_co_ordinator: { und: '[nid (' + this.addInvoiceSelectedCord.id + ')]' },
                field_booking_for: { und: [this.selectedBookingfor.text] },
                field_invoice_cost: { und: [{ value: this.invoicecost }] },
                field_points_redeemed: { und: [{ value: milageToBeRedeemed }] },
                field_description: { und: [{ value: this.description }] },
                field_from: { und: [{ value: this.from }] },
                field_to: { und: [{ value: this.to }] },
                field_seats: { und: [{ value: this.seats }] },
                field_net_invoice_amount: { und: [{ value: this.invoicecost + '' }] },
                field_status: { und: [this.selectedStatus.text] },
                field_journey_date: {
                  und: [
                    { value: { day: this.onDateDay, month: this.onDateMonth, year: this.onDateYear } }]
                }
              };

              if (this.selectedStatus.text == "Pending") {
                invoiceform.field_milage_recieved = { und: [{ value: "0" }] };
                let NetInvoiceCost = parseFloat(invoiceform.field_invoice_cost.und[0].value) - milageToBeRedeemed;
                invoiceform.field_net_invoice_amount = { und: [{ value: NetInvoiceCost }] };
              }

              if (this.selectedStatus.text == "Completed") {
                let NetInvoiceCost = parseFloat(invoiceform.field_invoice_cost.und[0].value) - milageToBeRedeemed;
                invoiceform.field_net_invoice_amount = { und: [{ value: NetInvoiceCost }] };
                invoiceform.field_milage_recieved = { und: [{ value: parseInt(((NetInvoiceCost * parseFloat(milageForType)) / 100) + '') }] };
              }

              if (this.selectedStatus.text == "Cancelled") {
                invoiceform.field_milage_recieved = { und: [{ value: "0" }] };
                invoiceform.field_points_redeemed = { und: [{ value: "0" }] };
              }

              // console.log(JSON.stringify(invoiceform));

              this.adService.uploadInvoice(invoiceform).subscribe((inres) => {
                if (inres.status == 200) {
                  if (this.waitToastID) {
                    this.toastyService.clear(this.waitToastID);
                  }


                  this.addToast('success', 'Success !', 'Invoice saved successfully.', 5000);

                  if (this.selectedStatus.text == "Pending" || this.selectedStatus.text == "Completed") {
                    // yaha user update karega waha relect hoga okToh rukh lemme think
                    // chai pike aya ok ok?
                    // kya baat hai akash tuje object padhna nahi ata
                    //Bored + Tried ho gya? try karte hai? file ipload mein bhi dal diya? Test karte hai pehle hmm

                    let totalRecieved = parseFloat(totalMilages['totalMilage']) + parseInt(invoiceform.field_milage_recieved.und[0].value);
                    // console.log("Total Milage Recieved "+ parseFloat(totalMilages['totalMilage']) + " + "+ parseFloat(invoiceform.field_milage_recieved.und[0].value) + " =  " + totalRecieved );
                    let totalRedeemed = parseFloat(totalMilages['totalRedeemed']) + parseFloat(invoiceform.field_points_redeemed.und[0].value);
                    let totalBalance = totalRecieved - totalRedeemed;
                    let temp = {
                      field_balance: { und: [{ value: totalBalance }] },
                      field_claimed_milage: { und: [{ value: "0" }] },
                      field_redeemed: { und: [{ value: totalRedeemed }] },
                      field_recieved: { und: [{ value: totalRecieved }] }
                    };
                    this.us.updateUserPoints(this.addInvoiceSelectedUser.id, temp).subscribe((res) => {
                      this.addToast('success', 'Success !', 'User updated successfully.', 5000);
                    });
                  }

                } else {
                  if (this.waitToastID) {
                    this.toastyService.clear(this.waitToastID);
                  }
                  // console.log(JSON.stringify(inres.data));
                  this.addToast('error', 'Error !', JSON.stringify(inres.data), 10000);
                }

              });
            });

          });
        } else {
          this.addToast('wait', 'Uploading !', 'Uploading invoice file.', 50000);

          if (this.file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            tempext = '.doc';
          } else {
            tempext = '.pdf';
          }

          let newfilename: any = 'invoice_' + this.onDateDay + '_' + this.onDateMonth + '_' + this.onDateYear + tempext;
          this.finalFileObject.filepath = 'public://invoices/' + this.addInvoiceSelectedUser.id + '/' + newfilename;
          // console.log(JSON.stringify(this.finalFileObject.filepath));
          this.adService.uploadInvoiceFile(this.finalFileObject).subscribe((res) => {
            // console.log(JSON.stringify(res.data));
            if (res.status == 200) {
              if (this.waitToastID) {
                this.toastyService.clear(this.waitToastID);
              }
              // field_invoice_file: { und: [{ fid: res.data.fid }] },
              this.addToast('success', 'Success !', 'File uploaded successfully', 5000);
              this.addToast('wait', 'Saving !', 'Saving invoice', 50000);

              let milageForType = this.adService.retrieveOfferMilageAccordingToType(this.selectedBookingfor.text);
          return this.totalRecievedMilage(this.addInvoiceSelectedUser).then((totalMilages) => {


            // nahi ara are us din t
            console.log(JSON.stringify(totalMilages))
            let milageBalance: number = parseFloat(totalMilages['totalMilage']) - parseFloat(totalMilages['totalRedeemed']);

            // console.log("TOTALS : "+ parseFloat(totalMilages['totalMilage'])+" "+parseFloat(totalMilages['totalRedeemed']));

            //Yeh Return kaise kar raha hai? Function band ho jayega na? aisehi return hai woh kaam ka nahi
            //But function isse aage kaise badh raha hai? uske andar hai then
            return this.getUserClaimedMilage(this.addInvoiceSelectedUser).then((milageToBeRedeemed) => {
              //OK // aya kya? Haa
              //   let milageToBeRedeemed = this.getUserClaimedMilage(this.addInvoiceSelectedUser) || 0;
              console.log(milageBalance + "Milage Balance");
              console.log(milageToBeRedeemed + " Milage To Be Redeemed");
              if (milageBalance < milageToBeRedeemed) {
                console.log("Reached here 2");
                return;
              }



              invoiceform = {
                field_milage_percent: { und: [{ value: milageForType }] },
                title: this.invoiceid,
                type: 'invoice',
                // name: this.addInvoiceSelectedUser.name,
                field_user: { und: '[uid (' + this.addInvoiceSelectedUser.id + ')]' },
                field_booked_by: { und: '[uid (' + this.addInvoiceSelectedUser.id + ')]' },
                field_co_ordinator: { und: '[nid (' + this.addInvoiceSelectedCord.id + ')]' },
                field_booking_for: { und: [this.selectedBookingfor.text] },
                field_invoice_cost: { und: [{ value: this.invoicecost }] },
                field_points_redeemed: { und: [{ value: milageToBeRedeemed }] },
                field_description: { und: [{ value: this.description }] },
                field_from: { und: [{ value: this.from }] },
                field_to: { und: [{ value: this.to }] },
                field_seats: { und: [{ value: this.seats }] },
                field_invoice_file: { und: [{ fid: res.data.fid }] },
                field_net_invoice_amount: { und: [{ value: this.invoicecost + '' }] },
                field_status: { und: [this.selectedStatus.text] },
                field_journey_date: {
                  und: [
                    { value: { day: this.onDateDay, month: this.onDateMonth, year: this.onDateYear } }]
                }
              };

              if (this.selectedStatus.text == "Pending") {
                invoiceform.field_milage_recieved = { und: [{ value: "0" }] };
                let NetInvoiceCost = parseFloat(invoiceform.field_invoice_cost.und[0].value) - milageToBeRedeemed;
                invoiceform.field_net_invoice_amount = { und: [{ value: NetInvoiceCost }] };
              }

              if (this.selectedStatus.text == "Completed") {
                let NetInvoiceCost = parseFloat(invoiceform.field_invoice_cost.und[0].value) - milageToBeRedeemed;
                invoiceform.field_net_invoice_amount = { und: [{ value: NetInvoiceCost }] };
                invoiceform.field_milage_recieved = { und: [{ value: parseInt(((NetInvoiceCost * parseFloat(milageForType)) / 100) + '') }] };
              }

              if (this.selectedStatus.text == "Cancelled") {
                invoiceform.field_milage_recieved = { und: [{ value: "0" }] };
                invoiceform.field_points_redeemed = { und: [{ value: "0" }] };
              }

              // console.log(JSON.stringify(invoiceform));

              this.adService.uploadInvoice(invoiceform).subscribe((inres) => {
                if (inres.status == 200) {
                  if (this.waitToastID) {
                    this.toastyService.clear(this.waitToastID);
                  }


                  this.addToast('success', 'Success !', 'Invoice saved successfully.', 5000);

                  if (this.selectedStatus.text == "Pending" || this.selectedStatus.text == "Completed") {
                    // yaha user update karega waha relect hoga okToh rukh lemme think
                    // chai pike aya ok ok?
                    // kya baat hai akash tuje object padhna nahi ata
                    //Bored + Tried ho gya? try karte hai? file ipload mein bhi dal diya? Test karte hai pehle hmm

                    let totalRecieved = parseFloat(totalMilages['totalMilage']) + parseInt(invoiceform.field_milage_recieved.und[0].value);
                    // console.log("Total Milage Recieved "+ parseFloat(totalMilages['totalMilage']) + " + "+ parseFloat(invoiceform.field_milage_recieved.und[0].value) + " =  " + totalRecieved );
                    let totalRedeemed = parseFloat(totalMilages['totalRedeemed']) + parseFloat(invoiceform.field_points_redeemed.und[0].value);
                    let totalBalance = totalRecieved - totalRedeemed;
                    let temp = {
                      field_balance: { und: [{ value: totalBalance }] },
                      field_claimed_milage: { und: [{ value: "0" }] },
                      field_redeemed: { und: [{ value: totalRedeemed }] },
                      field_recieved: { und: [{ value: totalRecieved }] }
                    };
                    this.us.updateUserPoints(this.addInvoiceSelectedUser.id, temp).subscribe((res) => {
                      this.addToast('success', 'Success !', 'User updated successfully.', 5000);
                    });
                  }

                } else {
                  if (this.waitToastID) {
                    this.toastyService.clear(this.waitToastID);
                  }
                  // console.log(JSON.stringify(inres.data));
                  this.addToast('error', 'Error !', JSON.stringify(inres.data), 10000);
                }

              });
            });

          });

            } else {
              this.addToast('error', 'Error !', 'Error uploading file.', 10000);
            }

          });
        }
      }


    }
  }

  selectuid(val: any) {

    if (val.length) {
      this.addInvoiceSelectedUser = this.adService.retrieveUserByUnique(val.replace(/^0+/, ''));
      this.allcoords = this.adService.retrieveCordsForUser(val.replace(/^0+/, ''));
      if (this.addInvoiceSelectedUser != undefined) {
        this.floattoredeem = this.addInvoiceSelectedUser.float;
      }

      if (this.allcoords.length) {
        this.disabled = false;
      }
    } else {
      var activeItem = this.coselect.activeOption;
      if (activeItem) {
        this.coselect.remove(activeItem)
      }
      this.allcoords = [];
      this.addInvoiceSelectedUser = null;
      this.floattoredeem = 0;
      this.disabled = true;
    }
  }

  oncostchange(val: any) {
    if (val.length) {
      this.invoicecost = val;
      this.netinvoicecost = this.invoicecost - this.floattoredeem;
    } else {
      this.invoicecost = null;
      this.netinvoicecost = 0;
    }
  }


  changeListener($event): void {
    //console.log($event.target.files[0]);
    this.file = $event.target.files[0];
    //console.log(this.file.type);
    this.uploadThis();
  }

  uploadThis() {
    var myReader: FileReader = new FileReader();
    myReader.onloadend = function (e) {
      // you can perform an action with readed data here
      //console.log(myReader.result);
      if (self.file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        self.encodedFile = myReader.result.replace(/^data:application\/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,/, "");
        //console.log(this.encodedFile);
        self.finalFileObject = {
          filename: self.file.name,
          filepath: "public://invoices/" + self.file.name,
          filesize: self.file.size,
          filemime: self.file.type,
          file: self.encodedFile
        };
      } else {
        self.encodedFile = myReader.result.replace(/^data:application\/pdf;base64,/, "");
        //console.log(this.encodedFile);
        self.finalFileObject = {
          filename: self.file.name,
          filesize: self.file.size,
          filepath: "public://invoices/" + self.file.name,
          file: self.encodedFile
        };
      }


    }
    myReader.readAsDataURL(this.file);
  }

  deleteInvoice(nid: string) {
    this.swalService.swal({
      title: 'Are you sure?',
      text: 'All user data will be erased !',
      type: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Yes, delete user!',
      cancelButtonText: 'No, keep it',
    }).then((button) => {
      if (button) {
        this.addToast('wait', 'Deleting Invoice', 'Thrashing Invoice Data', 30000);
        this.adService.deleteInvoice(nid, "invoice").then((res) => {
          this.toastyService.clear(this.waitToastID);
          this.refresInvoices();
          this.addToast('success', 'Success', 'Invoice Removed Successfully !!!', 8000);
        });
      }

    }, (dismiss) => {
    });

  }

  refresInvoices() {
    this.adService.getAllInvoices().subscribe((res) => {
      this.AllInvoices = this.adService.retrieveInvoices();
    });
  }


  addToast(type: any, rtitle: string, message: string, timeout: any) {
    // Just add default Toast with title only
    // Or create the instance of ToastOptions
    var toastOptions: ToastOptions = {
      title: rtitle,
      msg: message,
      showClose: false,
      theme: 'default',
      timeout: timeout,
      onAdd: (toast: ToastData) => {
        if (type == 'wait') {
          this.waitToastID = toast.id;
        } else if (type == 'success') {
          this.successToastID = toast.id;
        } else if (type == 'error') {
          this.errorToastID = toast.id;
        }

      },
      onRemove: function (toast: ToastData) {
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

  selected(value: any, type: string): void {
    if (type == 'status') {
      this.selectedStatus = value;
      this.newStatus = value.text;
    } else if (type == 'bookingfor') {

      if (value.text == 'Car' || value.text == 'Bus' || value.text == 'Train' || value.text == 'Flight') {
        this.fromTrue = true;
      } else {
        this.fromTrue = false;
      }
      this.selectedBookingfor = value;
    } else if (type == 'allcoords') {
      this.selectedCord = value;
      this.addInvoiceSelectedCord = this.adService.retrieveCordById(value.id);
    }
  }

  removed(value: any, type: string): void {
    if (type == 'status') {
      this.selectedStatus = '';
    } else if (type == 'bookingfor') {
      this.selectedBookingfor = '';
    } else if (type == 'allcoords') {
      this.selectedCord = '';
      this.addInvoiceSelectedCord = undefined;
    }
  }

  refreshValue(value: any, type: string): void {
    if (type == 'status') {
      this.selectedStatus = value;
      this.newStatus = value.text;
    } else if (type == 'bookingfor') {
      if (value.text == 'Car' || value.text == 'Bus' || value.text == 'Train' || value.text == 'Flight') {
        this.fromTrue = true;
      } else {
        this.fromTrue = false;
      }
      this.selectedBookingfor = value;
    } else if (type == 'allcoords') {
      this.selectedCord = value;
      this.addInvoiceSelectedCord = this.adService.retrieveCordById(value.id);
    }
  }

  totalRecievedMilage(user: any) {

    let promise = new Promise((resolve, reject) => {
      this.adService.getAllInvoices(user.id).subscribe((res) => {
        let Totals = {
          totalMilage: 0,
          totalRedeemed: 0
        }
        let totalMilage: number;
        this.adService.AllInvoicesByUser.forEach(element => {

          Totals.totalMilage = Totals.totalMilage + parseFloat(element.milage_recieved);
          Totals.totalRedeemed = Totals.totalRedeemed + parseFloat(element.milage_redeemed);

        });
        resolve(Totals);
      });
    });

    return promise;
  }

  getUserClaimedMilage(user: any): any {

    let promise = new Promise((resolve, reject) => {
      // console.log("User Claimed Milage"+ user.id);
      this.us.getUser(user.id, false).subscribe((res) => {
        console.log("Return user milage " + JSON.stringify(res));
        resolve(res.data.claimed || 0);
      });
    });

    return promise;
  }

  totalRedeemedMilage(user: any) {
    return this.adService.getAllInvoices(user).subscribe((res) => {
      let totalMilage: number;
      this.adService.AllInvoicesByUser.forEach(element => {
        totalMilage = totalMilage + parseFloat(element.milage_redeemed);
      });
      return totalMilage;
    });
  }


}
