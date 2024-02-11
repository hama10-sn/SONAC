import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbGlobalPosition, NbGlobalPhysicalPosition, NbComponentStatus } from '@nebular/theme';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'ngx-reset-pwd',
  templateUrl: './reset-pwd.component.html',
  styleUrls: ['./reset-pwd.component.scss']
})
export class ResetPwdComponent implements OnInit {

  addForm = this.fb.group({
    password: ['', [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]],
  });
  passwordOk: string;
  passwordCOk: string;
  passwordC: string;

  constructor(private fb: FormBuilder, private userService: UserService, private route: ActivatedRoute,
    private toastrService: NbToastrService, private router: Router) { }

    position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
    statusSuccess: NbComponentStatus = 'success';
    statusFail: NbComponentStatus = 'danger';
    token: any;
  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.token = params.token;
        console.log(this.token);
      },
    );
  }
  submit() {
//console.log('rrr' +  this.addForm.controls['email'].value);
    this.userService.resetPWD(this.addForm.controls['password'].value, this.token)
    .subscribe((data) => {
      console.log(data);
      this.toastrService.show(
        'Mot de passe changé !',
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
  onchangepassword () {
    //this.displayMDPCError = true;
    //this.onchangepasswordC(null);
    if (this.addForm.controls['password'].valid == true ){
      this.passwordOk = 'success';
    }
    else {
      this.passwordOk = 'danger';
    }

  }

  isIdentique: boolean = false;
  displayNumeroError: boolean = false;
  displayMDPCError: boolean = false;
  onchangepasswordC (event) {
    this.displayMDPCError = true;

    if (event != null){
    this.passwordC = event.target.value;
    }
    if (this.addForm.controls['password'].value == this.passwordC) {
      this.isIdentique = true;
      this.passwordCOk = 'success';
    }
    else  {
      this.passwordCOk = 'danger';
      this.isIdentique = false;
    }

  }
}
