import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    configUrl = "http://192.168.3.35/andon_system/API/";
    configUrl_local = "http://127.0.0.1/andon_system/API/";
  
    modelsUrl = "http://192.168.3.35/produccion/API/";
    modelsUrl_local = "http://127.0.0.1/produccion/API/";

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(this.configUrl_local + "login.php", { username, password })
            .pipe(map(user => {
                if(user != "login failed" && user != "ERROR"){
                    var userAux = user as User;
                    console.log("User is logged in");
                    localStorage.setItem('currentUser', JSON.stringify(userAux));
                    this.currentUserSubject.next(userAux);
                }
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}