import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { forkJoin, from } from 'rxjs';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../_services';
import { tick } from '@angular/core/testing';
import { isUndefined } from 'util';

export interface Ticket{
  line: any;
  model: any;
  estimate: any;
  real: any;
  balance: any;
  dj: any;
  bin: any;
  rate: any;
  duration: any;
  column8: any;
  start: string;
  end: string;
  type: any;
  realAdd: number;
}

@Component({
  selector: 'app-all-tickets',
  templateUrl: './all-tickets.component.html',
  styleUrls: ['./all-tickets.component.css']
})
export class AllTicketsComponent implements OnInit {

  dataSource: any;
  tickets: Ticket[];
  ticketsAux: Ticket[];
  realAdd: number;
  selected: string;
  user: any;

  constructor(public configService: ConfigService, private _snackBar: MatSnackBar, public authenticationService: AuthenticationService) {
  }


  ngOnInit() {
    this.selected = "SMT-1";
    this.configService.get_all_tickets("SMT-1").subscribe(data => {
      this.tickets = data as Ticket[];
      this.tickets.sort(this.compare);
      this.tickets.map((ticket) => {
        ticket.real = parseInt(ticket.real);
        ticket.estimate = parseInt(ticket.estimate);
      });
      this.ticketsAux = this.tickets.slice();
      this.timeUpdate(false);
      this.addModelChanges();
      this.timeUpdate(false);
    });
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.authenticationService.currentUser.subscribe(user => this.user = user);
  }

  gapMaker(i: number){
    try{
      let start = this.tickets[i].start.split(' ');
      let start2 = this.tickets[i - 1].start.split(' ');
      let date = start[0].split('-');
      let date2 = start2[0].split('-');
      return (date[2] != date2[2]);
    }catch{

    }
    
  }
  
  tableUpdate(){
    console.log(this.selected)
    this.configService.get_all_tickets(this.selected).subscribe(data => {
      this.tickets = data as Ticket[];
      this.tickets.sort(this.compare);
      this.ticketsAux = this.tickets.slice();
      this.timeUpdate(false);
      this.addModelChanges();
      this.timeUpdate(false);
    });
  }
  realAddition(i: number){
    if(i)
    {
      this.tickets[i].real = this.tickets[i].real + this.tickets[i].realAdd;
      this.tickets[i].realAdd = undefined;
    }
  }
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.tickets, event.previousIndex, event.currentIndex);
    this.timeUpdate(true);
  }

  addModelChanges()
  {
    for(let i = 0; i < this.tickets.length; i++)
    {
      let modelChange: Ticket = {
        line: this.selected,
        model: "",
        estimate: 0,
        real: 0,
        balance: 0,
        dj: 0,
        bin: 0,
        rate: 0,
        duration: 0,
        column8: "",
        start: "",
        end: "",
        type: 1,
        realAdd: 0,
      };
      if(this.tickets[i + 1] && this.tickets[i + 1].type != 1 && this.tickets[i].type != 1 && this.tickets[i].model != this.tickets[i + 1].model)
      {
        
        modelChange.model = this.tickets[i + 1].model;
        modelChange.type = 1;
        modelChange.start = this.tickets[i].end;
        this.tickets.splice(i + 1, 0, modelChange);
        this.tickets[i + 2].start = this.tickets[i + 1].end;
        i++;
      }
    }
    let modelChange2: Ticket = {
      line: this.selected,
      model: "PARO DE PRODUCCION",
      estimate: 0,
      real: 0,
      balance: 0,
      dj: 0,
      bin: 0,
      rate: 0,
      duration: 0,
      column8: "",
      start: "",
      end: "",
      type: 2,
      realAdd: 0,
    };
    this.tickets.push(modelChange2);
  }
  toFormat(data: Date){
    let year: string;
    let month: string;
    let day: string;
    let hours: string;
    let minutes: string;
    let seconds: string; 
    year = data.getFullYear().toString();
    month = (data.getMonth() + 1).toString();
    day = data.getDate().toString();
    hours = data.getHours().toString();
    minutes = data.getMinutes().toString();
    seconds = data.getSeconds().toString();
    
    if(data.getMonth() + 1 < 10)
      month = "0" + month;
    if(data.getDate() < 10)
      day = "0" + day;
    if(data.getHours() < 10)
      hours = "0" + hours;
    if(data.getMinutes() < 10)
      minutes = "0" + minutes;
    if(data.getSeconds() < 10)
      seconds = "0" + seconds;

    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  
  switching: boolean = true;

  timeUpdate(willPost: boolean, ind?: number, newObj?: any)
  {
    let now = new Date();
    let week = {
      monday: Math.floor((now.getTime() - 392400000)/604800000) * 604800000 + 392400000,
      tuesday: Math.floor((now.getTime() - 392400000)/604800000) * 604800000 + 392400000 + 3600000 * 17,
      wednesday: Math.floor((now.getTime() - 392400000)/604800000) * 604800000 + 392400000 + 3600000 * (17 + 24),
      thursday: Math.floor((now.getTime() - 392400000)/604800000) * 604800000 + 392400000 + 3600000 * (17 + 48),
      friday: Math.floor((now.getTime() - 392400000)/604800000) * 604800000 + 392400000 + 3600000 * (17 + 72),
      saturday: Math.floor((now.getTime() - 392400000)/604800000) * 604800000 + 392400000 + 3600000 * (17 + 96),
      sunday: Math.floor((now.getTime() - 392400000)/604800000) * 604800000 + 392400000 + 3600000 * (17 + 120),
    }
    try{
      this.tickets[ind].estimate = newObj;
      if(!isUndefined(ind) && !isUndefined(newObj) && newObj > 99999){
        this.switching = !this.switching;
        this.tickets[ind].estimate = (this.switching) ?  99999: 99998;
        console.log(this.tickets[ind].estimate);
      }
    }catch{}
    
    for(let i = 0; i < this.tickets.length; i++)
    {
      let endAux: Date;
      if(i == 0){
        let now = new Date();
        let monday = Math.floor((now.getTime() - 392400000)/604800000) * 604800000 + 392400000;
        let startAux = new Date(monday);
        this.tickets[i].start = this.toFormat(startAux);
        endAux = new Date(startAux.getTime() + Math.round((this.tickets[i].estimate / this.tickets[i].rate) * 3600000));

        this.tickets[i].end = this.toFormat(endAux);
        if(willPost)
          this.configService.update_count(this.tickets[i]).subscribe(data => console.log(data));
        continue;
      }
      
      this.tickets[i].start = this.tickets[i - 1].end;
      let startAux = new Date(this.tickets[i - 1].end);
      
      if(this.tickets[i].type == 0){
        endAux = new Date(startAux.getTime() + Math.round((this.tickets[i].estimate / this.tickets[i].rate) * 3600000));
      }
      else{
        endAux = new Date(startAux.getTime() + 45 * 60000);
      }
      this.tickets[i].end = this.toFormat(endAux);
      if(willPost)
        this.configService.update_count(this.tickets[i]).subscribe(data => console.log(data));                                                                     
    }

  }
  saveTable()
  {
    let obs = [];

    for(let i = 0; i < this.tickets.length; i++)
    {
      obs.push(this.configService.update_count(this.tickets[i]));
    }
    forkJoin(obs).subscribe(datas => {
      let isSuccesfull = true;
      for(let i = 0; i < datas.length; i++)
      {
        if(datas[i] != "SUCCESS"){
          isSuccesfull = false;
          break;
        }
      }
      (isSuccesfull) ? this.openSnackBar("Tabla guardada", "OK"): this.openSnackBar("Error al guardar la tabla", "OK"); 
    });
  }

  compare(a, b)
  {
    if ( a.start < b.start ){
      return -1;
    }
    if ( a.start > b.start ){
      return 1;
    }
    return 0;
  }
  recalculateTime()
  {
    let format: Date;
  }
}