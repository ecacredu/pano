import { Injectable } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { SecureService } from './secureservice';
import { Headers, Response, RequestOptions, Http } from '@angular/http';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import 'rxjs/Rx';
import { Observable } from "rxjs/Observable";
import { UserService } from './userservice';

@Injectable()
export class AdminService {

    public AllUsers: any = [];
    public AllInvoices: any = [];
    public AllInvoicesByUser: any = [];
    public AllCords: any = [];
    public path: string = "http://www.panoramaclubholidays.com/manage/rest/";
    public offermilage: any = {};


    public invoiceDetails: any = { total: 0, cost: 0, redeemed: 0, cancelled: 0 };
    public userDetails: any = { total: 0, balance: 0, float: 0 };

    constructor(public storage: LocalStorageService, private _http: Http, public sessionstorage: SessionStorageService, private us: UserService, private ss: SecureService) {


    }




    createUser(userForm: any) {

        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let formData = userForm;
        let options = new RequestOptions({ headers: headers });

        return this._http.post(this.path + 'user/register', formData, options)
            .map((result: Response) => {
                const datai = result.json();
                // console.log(JSON.stringify(datai));
                return { success: true, data: datai };
            }, err => {
                // console.log(err);
                return { success: false, data: err };
            });

    }

    createCoordinator(coForm: any) {

        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let formData = coForm;
        let options = new RequestOptions({ headers: headers });

        return this._http.post(this.path + 'node', formData, options)
            .map((result: Response) => {
                const datai = result.json();
                // console.log(JSON.stringify(datai));
                return { success: true, data: datai };
            }, err => {
                return { success: false, data: err };
            });

    }

    getCurrentUser() {
        return this.storage.retrieve('activeUser');
    }

    getAllUsers() {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });

        return this._http.get(this.path + 'users', options)
            .map((result: Response) => {
                const datai = result.json();
                this.AllUsers = datai;
                return 'ok';
            }, err => {
                return { success: false, data: err };
            });
    }

    getAllCords() {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });

        return this._http.get(this.path + 'coordinator', options)
            .map((result: Response) => {
                const datai = result.json();
                this.AllCords = datai;
                return 'ok';
            }, err => {
                return { success: false, data: err };
            });
    }

    getOfferMilage() {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });

        return this._http.get(this.path + 'offermilage', options)
            .map((result: Response) => {
                const datai = result.json();
                this.offermilage = datai[0];
                return 'ok';
            }, err => {
                return { success: false, data: err };
            });
    }

    retrieveOfferMilage() {
        return this.offermilage.percent;
    }

    retrieveOfferMilageAccordingToType(type: any) {
        console.log('retrieve Milage Funtion ' + type);
        if (type == "Hotel") {
            return this.offermilage.percent_hotel;
        }
        else if (type == "Package") {
            return this.offermilage.percent_package;
        }
        else {
            return this.offermilage.percent;
        }
    }

    retrieveCords() {
        return this.AllCords;
    }

    retrieveCordsForUser(ruid: any) {
        let arr: any = [];
        if (this.AllCords.length) {
            for (var i = 0; i < this.AllCords.length; i++) {
                if (this.AllCords[i].auth_uid == ruid) {
                    arr.push(this.AllCords[i]);
                }
            }
            return arr;
        } else {
            return this.AllCords;
        }
    }

    getLastCord(ruid: any) {
        let arr: any = [];
        if (this.AllCords.length) {
            for (var i = 0; i < this.AllCords.length; i++) {
                if (this.AllCords[i].auth_uid == ruid) {
                    arr.push(this.AllCords[i]);
                }
            }
            return arr[arr.length - 1];
        } else {
            return this.AllCords;
        }
    }

    retrieveCordById(id: any) {
        for (var i = 0; i < this.AllCords.length; i++) {
            if (this.AllCords[i].id == id) {
                return this.AllCords[i];
            }
        }
    }

    retrieveUserByUnique(ruid: any) {
        for (var i = 0; i < this.AllUsers.length; i++) {
            if (this.AllUsers[i].unique == ruid) {
                return this.AllUsers[i];
            }
        }
    }

    getAllInvoices(user?) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });

        let url = this.path + 'invoice';

        if (user) {
            url = this.path + 'invoice?args[0]=all&args[1]=all&args[2]=' + user;
        }

        return this._http.get(url, options)
            .map((result: Response) => {
                const datai = result.json();
                if (user) {
                    this.AllInvoicesByUser = datai;
                    return datai;
                } else {
                    this.AllInvoices = datai;
                    return 'ok';
                }
            }, err => {
                return { success: false, data: err };
            });
    }

    retrieveUsers() {
        return this.AllUsers;
    }

    retrieveInvoices() {
        return this.AllInvoices;
    }

    updateInvoice(coForm: any, id: any) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let formData = coForm;

        let options = new RequestOptions({ headers: headers });

        return this._http.put(this.path + 'node/' + id, formData, options)
            .map((result: Response) => {
                const datai = result.json();
                return { status: result.status, data: datai };
            }, err => {
                return { status: err.status, data: err };
            });
    }

    uploadInvoice(coForm: any) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let formData = coForm;
        let options = new RequestOptions({ headers: headers });

        return this._http.post(this.path + 'node', formData, options)
            .map((result: Response) => {
                const datai = result.json();
                return { success: result.ok, status: result.status, data: datai };
            }, err => {
                return { success: false, data: err };
            });
    }

    createStatement(coForm: any) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let formData = coForm;
        let options = new RequestOptions({ headers: headers });

        return this._http.post(this.path + 'node', formData, options)
            .map((result: Response) => {
                const datai = result.json();
                return { success: result.ok, status: result.status, data: datai };
            }, err => {
                return { success: false, data: err };
            });
    }

    uploadInvoiceFile(coForm: any) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let formData = coForm;
        let options = new RequestOptions({ headers: headers });

        return this._http.post(this.path + 'file', formData, options)
            .map((result: Response) => {
                const datai = result.json();
                // console.log(JSON.stringify(result));
                return { success: result.ok, status: result.status, data: datai };
            }, err => {
                return { success: false, data: err };
            });
    }

    deleteNode(nodeID: string, type: any) {

        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let formData = '{}';
        let options = new RequestOptions({ headers: headers });

        return this._http.delete(this.path + 'node/' + nodeID, options)
            .map((result: Response) => {
                const data = result.json();
                return 'ok';
            }, err => {
                // console.log(err);
            });

    }

    deleteInvoice(nodeID: string, type: any) {

        let statementsLength = 0;
        let tempStatements = [];

        var promise = new Promise((resolve, reject) => {

            this.us.getStatements(nodeID, "fromInvoiceID").subscribe((res) => {

                tempStatements = res['data'];
                if (tempStatements != null && tempStatements.length) {
                    tempStatements.forEach(element => {
                        // console.log("State delete :"+element.againstid+" == "+nodeID)
                        if (element.againstid == nodeID) {
                            this.deleteNode(element.nid, "fromDeleteInvoice").subscribe(() => {
                                statementsLength++;
                                if (statementsLength == tempStatements.length) {
                                    this.deleteNode(nodeID, "fromInvoiceDelete").subscribe(res => {
                                        resolve('ok');
                                    });
                                }
                            });
                        }
                    });
                } else {
                    this.deleteNode(nodeID, "fromInvoiceDelete").subscribe(res => {
                        resolve('ok');
                    });

                }
            });


        })
        return promise;

    }

    deleteUser(uid: string) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let formData = '{}';
        let options = new RequestOptions({ headers: headers });

        return this._http.delete(this.path + 'user/' + uid, options)
            .map((result: Response) => {
                const data = result.json();
                return data;
            }, err => {
                // console.log(err);
            });
    }

    updateMilage(value: any, type: any) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);

        let formData;
        if (type == "Normal") {
            formData = {
                field_milage_percent: {
                    "und": [
                        { "value": value }
                    ]
                }
            };
        }
        if (type == "Hotel") {
            formData = {
                field_milage_percent_hotel: {
                    "und": [
                        { "value": value }
                    ]
                }
            };
        }
        if (type == "Package") {
            formData = {
                field_milage_percent_package: {
                    "und": [
                        { "value": value }
                    ]
                }
            };
        }

        let options = new RequestOptions({ headers: headers });

        return this._http.put(this.path + 'node/' + this.offermilage.nid, formData, options)
            .map((result: Response) => {
                const datai = result.json();
                return { status: result.status, data: datai };
            }, err => {
                // console.log(err);
            });
    }

    updateNode(toFile: any) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);

        let formData = {
            "title": "ghjg",
            "type": "invoice",
            "name": "user378",
            "field_booked_by": {
                "und": "[uid (27)]"
            },
            "field_co_ordinator": {
                "und": "[nid (3)]"
            },
            "field_booking_for": {
                "und": [
                    "Bus"
                ]
            },
            "field_journey_date": {
                "und": [
                    {
                        "value": {
                            "day": "17",
                            "month": "9",
                            "year": "2014",
                            "hour": "9",
                            "minute": "15",
                            "ampm": "am"
                        }
                    }
                ]
            },
            "field_invoice_cost": {
                "und": [
                    { "value": "277" }
                ]
            },
            "field_net_invoice_amount": {
                "und": [
                    { "value": "277" }
                ]
            },
            "field_status": {
                "und": [
                    "On-Going"
                ]
            }
        };
        let options = new RequestOptions({ headers: headers });

        return this._http.post(this.path + 'node', formData, options)
            .map((result: Response) => {
                const data = result.json();
                // console.log(JSON.stringify(data));
                return 'ok';
            }, err => {
                // console.log(err);
            });
    }


    refreshInvoiceDetails() {
        this.invoiceDetails.total = this.AllInvoices.length;
        this.invoiceDetails.cost = this.totalInCost();
        this.invoiceDetails.redeemed = this.totalInRedeem('redeemed');
        this.invoiceDetails.cancelled = this.totalInCancelled();
        return this.invoiceDetails;
    }

    refreshUserDetails() {
        this.userDetails.total = this.AllUsers.length;
        this.userDetails.balance = this.totalInRedeem('balance');
        this.userDetails.float = this.totalInRedeem('float');
        return this.userDetails;
    }

    totalInCost() {
        let cost: any = 0;

        for (var i = 0; i < this.AllInvoices.length; i++) {
            // console.log("Invoices : "+this.AllInvoices.length+" String cost :"+this.AllInvoices[i]['net_invoice_amount']+" COST:  "+parseFloat(this.AllInvoices[i]['net_invoice_amount'].replace(/,/g, '')));
            cost = cost + parseFloat(this.AllInvoices[i]['net_invoice_amount'].replace(/,/g, ''));
        }
        return cost;
    }

    totalInRedeem(key: string) {
        let redeem: any = 0;
        for (var i = 0; i < this.AllUsers.length; i++) {
            redeem += parseFloat(this.AllUsers[i][key].replace(/,/g, ''));
        }
        return redeem;
    }

    totalInCancelled() {
        let cancelled: any = 0;
        for (var i = 0; i < this.AllInvoices.length; i++) {
            if (this.AllInvoices[i].status == 'Cancelled') {
                cancelled++;
            }
        }
        return cancelled;
    }

    updateUserPoints(id: any, coForm: any) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let formData = coForm;

        let options = new RequestOptions({ headers: headers });

        return this._http.put(this.path + 'user/' + id, formData, options)
            .map((result: Response) => {
                const datai = result.json();
                return { status: result.status, data: datai };
            }, err => {
                // console.log(err);
            });
    }

    updateUser(coForm: any, id: any) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let formData = coForm;

        let options = new RequestOptions({ headers: headers });

        return this._http.put(this.path + 'user/' + id, formData, options)
            .map((result: Response) => {
                const datai = result.json();
                return { status: result.status, data: datai };
            }, err => {
                return { data: err };
            });
    }

    updateCord(coForm: any, id: any) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let formData = coForm;

        let options = new RequestOptions({ headers: headers });

        return this._http.put(this.path + 'node/' + id, formData, options)
            .map((result: Response) => {
                const datai = result.json();
                return { status: result.status, data: datai };
            }, err => {
                // console.log(err);
            });
    }


    sendOfferNoti(coForm: any) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let formData = coForm;
        let options = new RequestOptions({ headers: headers });

        return this._http.post(this.path + 'node', formData, options)
            .map((result: Response) => {
                const datai = result.json();
                return { success: result.ok, status: result.status, data: datai };
            }, err => {
                return { success: false, data: err };
            });
    }



}
