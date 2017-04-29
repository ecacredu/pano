import { Injectable } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { SecureService } from './secureservice';
import { Headers, Response, RequestOptions, Http } from '@angular/http';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import 'rxjs/Rx';
import { Observable } from "rxjs/Observable";

@Injectable()
export class AdminService {

    public AllUsers: any = [];
    public AllInvoices: any = [];
    public AllCords: any = [];
    public path: string = "http://www.acecosmos.com/panorama/rest/";
    public offermilage: any = {};

    public invoiceDetails: any = { total: 0, cost: 0, redeemed: 0, cancelled: 0 };
    public userDetails: any = { total: 0, balance: 0, float: 0 };

    constructor(public storage: LocalStorageService, private _http: Http, public sessionstorage: SessionStorageService, private ss: SecureService) {


    }




    createUser(userForm: any) {

        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let formData = userForm;
        let options = new RequestOptions({ headers: headers });

        return this._http.post(this.path + 'user/register', formData, options)
            .map((result: Response) => {
                const datai = result.json();
                console.log(JSON.stringify(datai));
                return { success: true, data: datai };
            }, err => {
                console.log(err);
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
                console.log(JSON.stringify(datai));
                return { success: true, data: datai };
            }, err => {
                return { success: false, data: err };
            });

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
        return this.offermilage;
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

    getAllInvoices() {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });

        return this._http.get(this.path + 'invoice', options)
            .map((result: Response) => {
                const datai = result.json();
                this.AllInvoices = datai;
                return 'ok';
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
                console.log(JSON.stringify(result));
                return { success: result.ok, status: result.status, data: datai };
            }, err => {
                return { success: false, data: err };
            });
    }

    deleteNode(nodeID: string) {

        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let formData = '{}';
        let options = new RequestOptions({ headers: headers });

        return this._http.delete(this.path + 'node/' + nodeID, options)
            .map((result: Response) => {
                const data = result.json();
                return 'ok';
            }, err => {
                console.log(err);
            });

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
                console.log(err);
            });
    }

    updateMilage(value: any) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let formData = {
            field_milage_percent: {
                "und": [
                    { "value": value }
                ]
            }
        };

        let options = new RequestOptions({ headers: headers });

        return this._http.put(this.path + 'node/' + this.offermilage.nid, formData, options)
            .map((result: Response) => {
                const datai = result.json();
                return { status: result.status, data: datai };
            }, err => {
                console.log(err);
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
                console.log(JSON.stringify(data));
                return 'ok';
            }, err => {
                console.log(err);
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
        let cost: number = 0;
        for (var i = 0; i < this.AllInvoices.length; i++) {
            cost = cost + Number(this.AllInvoices[i]['net_invoice_amount']);
        }
        return cost;
    }

    totalInRedeem(key: string) {
        let redeem: number = 0;
        for (var i = 0; i < this.AllUsers.length; i++) {
            redeem += Number(this.AllUsers[i][key]);
        }
        return redeem;
    }

    totalInCancelled() {
        let cancelled: number = 0;
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
                console.log(err);
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
                console.log(err);
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
