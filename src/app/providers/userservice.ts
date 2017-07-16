import { Injectable } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { SecureService } from './secureservice';
import { Headers, Response, RequestOptions, Http } from '@angular/http';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import 'rxjs/Rx';
import { Observable } from "rxjs/Observable";

@Injectable()
export class UserService {

    private loggedin = false;
    public userDetails: any = {};
    public maskDetails: any = {};
    public allStatesments: any = [];
    public allInterPackages: any = [];
    public allDomPackages: any = [];
    public allSlides: any = [];
    public allCords: any = [];
    public maskUser: any = {};
    public path: string = "http://www.panoramaclubholidays.com/manage/rest/";
    // private activeUser = {'uid':'','name':'','mail':'','timezone':'','roles':{}};

    //this.storage.retrieve('activeUser') this.storage.store('usecookie',this.usecookie);

    constructor(public storage: LocalStorageService, private _http: Http, public sessionstorage: SessionStorageService, private ss: SecureService) {


    }

    initMyApp(): Promise<boolean> {
        return new Promise<boolean>(resolve => {
        setTimeout(() => {
            console.log('AppInit -> done');
            resolve(true);
        }, 3000);
        });
    }

    getAllInterPackages() {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });

        return this._http.get(this.path + 'packages?args[0]=International')
            .map((result: Response) => {
                const datai = result.json();
                this.allInterPackages = datai;
                //console.log(JSON.stringify(this.allInterPackages));
                return { success: result.ok, status: result.status, data: this.allInterPackages };
            }, err => {
                return { success: false, data: err };
            });
    }

    getAllDomPackages() {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });

        return this._http.get(this.path + 'packages?args[0]=Domestic')
            .map((result: Response) => {
                const datai = result.json();
                this.allDomPackages = datai;
                return { success: result.ok, status: result.status, data: this.allDomPackages };
            }, err => {
                return { success: false, data: err };
            });
    }

    getUser(id: any, mask: boolean) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });

        return this._http.get(this.path + 'user/' + id, options)
            .map((result: Response) => {
                const datai = result.json();
                if (mask == true) {
                    this.maskDetails = { "mail": datai.mail, "name": datai.name, "roles": datai.roles, "unique": (datai.field_unique_number.und ? datai.field_unique_number.und[0].value : null), "text": datai.name, "id": datai.uid, "balance": ((datai.field_balance.und) ? datai.field_balance.und[0].value : null), "charged": ((datai.field_charged.und) ? datai.field_charged.und[0].value : null), "float": ((datai.field_claimed_milage.und) ? datai.field_claimed_milage.und[0].value : null), "redeemed": ((datai.field_redeemed.und) ? datai.field_redeemed.und[0].value : null), "claimed": ((datai.field_claimed_milage.und) ? datai.field_claimed_milage.und[0].value : null), "uid": datai.uid };

                    console.log(JSON.stringify(this.maskDetails));
                    return { success: result.ok, status: result.status, data: this.maskDetails };
                } else {
                    this.userDetails = { "mail": datai.mail, "name": datai.name, "roles": datai.roles, "unique": (datai.field_unique_number.und ? datai.field_unique_number.und[0].value : null), "text": datai.name, "id": datai.uid, "balance": ((datai.field_balance.und) ? datai.field_balance.und[0].value : null), "charged": ((datai.field_charged.und) ? datai.field_charged.und[0].value : null), "float": ((datai.field_claimed_milage.und) ? datai.field_claimed_milage.und[0].value : null), "redeemed": ((datai.field_redeemed.und) ? datai.field_redeemed.und[0].value : null), "claimed": ((datai.field_claimed_milage.und) ? datai.field_claimed_milage.und[0].value : null), "uid": datai.uid };

                    console.log(JSON.stringify(this.userDetails));
                    return { success: result.ok, status: result.status, data: this.userDetails };
                }

            }, err => {
                const datai = err.json();
                return { success: false, status: err.status, data: datai };
            });
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

    userLogin(formData: String) {

        //const body = JSON.stringify(message);
        const headers = new Headers({ 'Content-Type': 'application/json' });

        return this._http.post('http://www.panoramaclubholidays.com/manage/rest/user/login', formData, { headers: headers })
            .map((result: Response) => {
                const data = result.json();
                this.ss.encrypt(formData);
                this.saveSession(data);
                return 'ok';
            }, err => {
                console.log(err);
            });

    }

    getStatements(id: any,type:any) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });

        let query;

        if(type== "fromInvoiceID"){
            query = 'loyalty?args[0]=all&args[1]='
        }else{
            query = 'loyalty?args[0]=';
        }

        return this._http.get(this.path + query + id, options)
            .map((result: Response) => {
                const datai = result.json();
                this.allStatesments = datai;
                return { success: result.ok, status: result.status, data: this.allStatesments };
            }, err => {
                return { success: false, data: err };
            });
    }

    getSlides() {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });

        return this._http.get(this.path + 'slideshow')
            .map((result: Response) => {
                const datai = result.json();
                this.allSlides = datai;
                return { success: result.ok, status: result.status, data: this.allSlides };
            }, err => {
                return { success: false, data: err };
            });
    }

    getEmployees(id: any) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });

        return this._http.get(this.path + 'coordinator?args[0]=' + id, options)
            .map((result: Response) => {
                const datai = result.json();
                this.allCords = datai;
                return { success: result.ok, status: result.status, data: this.allCords };
            }, err => {
                return { success: false, data: err };
            });
    }

    deleteCord(nodeID: string) {
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

    userLogout() {

        // Send X-csrf
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.ss.createAuthorizationHeader(headers);
        console.log(JSON.stringify(headers));
        let formData = '{}';
        let options = new RequestOptions({ headers: headers });
        return this._http.post('http://www.panoramaclubholidays.com/manage/rest/user/logout', formData, options)
            .map((result: Response) => {
                const data = result.json();
                // console.log(JSON.stringify(data));
                this.clearSession(data);
                return "ok";
            }, err => {
                // console.log(err);
            });

    }

    getToken() {

        return this._http.get('http://www.panoramaclubholidays.com/manage/services/session/token')
            .map((result: Response) => {
                const data = result.json();

            }, err => {
                // console.log(err);
            });

    }

    loggedInToken() {

        return this._http.get('http://www.panoramaclubholidays.com/manage/rest/system/connect')
            .map((result: Response) => {
                const data = result.json();

                return 'ok';
            }, err => {
                // console.log(err);
            });
    }

    isLoggedIn() {
        return this.loggedin;
    }

    saveSession(data) {
        var access = 'user';
        if (data.user.roles['3'] != null && data.user.roles['3'] != undefined && data.user.roles['3'] == 'administrator') {
            access = 'admin';
        }
        var temp = { 'uid': data.user.uid, 'name': data.user.name, 'mail': data.user.mail, 'timezone': data.user.timezone, 'roles': data.user.roles, 'access': access };
        this.storage.store('activeUser', temp);
    }

    clearSession(data) {
        this.storage.clear('activeUser');
        this.storage.clear('session');
        this.maskUser = {};
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
                // console.log(err);
            });

    }

}
