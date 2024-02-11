import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService, NbGlobalPosition, NbGlobalPhysicalPosition, NbComponentStatus } from '@nebular/theme';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'ngx-forget-pwd',
  templateUrl: './forget-pwd.component.html',
  styleUrls: ['./forget-pwd.component.scss']
})
export class ForgetPwdComponent implements OnInit {

  addForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],

  });

  constructor(private fb: FormBuilder, private userService: UserService,
    private toastrService: NbToastrService, private router: Router) { }

    position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
    statusSuccess: NbComponentStatus = 'success';
    statusFail: NbComponentStatus = 'danger';
  ngOnInit(): void {
  }
  submit() {
//console.log('rrr' +  this.addForm.controls['email'].value);
    this.userService.sendMailForPWD(this.addForm.controls['email'].value)
    .subscribe((data) => {
      console.log(data);
      this.toastrService.show(
        'Mail envoyé !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 0,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('auth/login');
    },
    (error) => {
      this.toastrService.show(
        error.error.message,
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 0,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
    },
    );
  }

  cancel() {
    this.router.navigateByUrl('auth/login');

  }
  errorEmail: boolean;
  displayMailError: boolean = false;
  onchangeMail () {
    this.displayMailError = true;
    if(this.addForm.controls['email'].valid == true ){
      this.errorEmail = true;
    }else{
      this.errorEmail = false;
    }

  }
}


