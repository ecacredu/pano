import { Injectable } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { Http, Headers } from '@angular/http';

@Injectable()
export class SecureService {

    private headers = {};
    public variable: String;

    constructor(public storage: LocalStorageService) { }
    

    encrypt(data) {
        let u = JSON.parse(data);
        this.storage.store('session', btoa(btoa(u.username + ":" + u.password)));
    }

    getBasic() {
        return atob(this.storage.retrieve('session'));
    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('withCredentials', 'true');
        headers.append('Authorization', 'Basic ' +
            this.getBasic());
    }

    getValue() {
        return this.variable;
    }

    setValue() {
        this.variable = "This Value";
    }

}
