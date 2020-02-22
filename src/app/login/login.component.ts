import { Component, Inject , OnInit} from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../_services';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { User } from '../_models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  user: any;

  constructor(public dialog: MatDialog,  private authService: AuthenticationService) {}

  openDialog(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    console.log(JSON.stringify(this.user));
    localStorage.setItem('currentUser', null);
    const dialogRef = this.dialog.open(LoginDialog, {
      width: '250px',
    });
    this.dialog.afterAllClosed.subscribe(() => {
      // Do stuff after the dialog has closed
      this.user = JSON.parse(localStorage.getItem('currentUser'));
  });
  }

  ngOnInit(){
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  logout(){
    this.authService.logout();
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }
}

@Component({
  selector: 'login-dialog',
  templateUrl: 'login-dialog.html',
})
export class LoginDialog {

  constructor(private fb:FormBuilder, private authService: AuthenticationService, public dialogRef: MatDialogRef<LoginDialog>) {
    this.form = this.fb.group({
      email: ['',Validators.required],
      password: ['',Validators.required]
    });
  }

  form:FormGroup;
  onNoClick(): void {
    this.dialogRef.close();
  }
  login() {

    const val = this.form.value;

    if (val.email && val.password) {
      this.authService.login(val.email, val.password)
        .subscribe((data) => {
          if(data != "login failed" && data != "ERROR"){
            this.dialogRef.close();
          }
        });
      }
  }
}