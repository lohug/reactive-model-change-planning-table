import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ticket } from '../all-tickets/all-tickets.component';

import { User } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) { }

  configUrl = "http://192.168.3.35/andon_system/API/"
  configUrl_local = "http://127.0.0.1/andon_system/API/"

  modelsUrl = "http://192.168.3.35/produccion/API/"
  modelsUrl_local = "http://127.0.0.1/produccion/API/"

  lang: any;
  getAllUsers() {
    return this.http.get<User[]>(`/users`);
  }
  get_all_tickets(line: string){
    return this.http.get(this.configUrl_local + "get_planned_changes.php?line=" + line);
  }
  update_count(data: Ticket){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    return this.http.post(this.configUrl_local + "update_planned_change.php", data, httpOptions);
  }
}
