import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { User } from '../../../model/User';

@Component({
  selector: 'ngx-modif-profil',
  templateUrl: './modif-profil.component.html',
  styleUrls: ['./modif-profil.component.scss']
})
export class ModifProfilComponent implements OnInit {

  user: User;
  confirm: Boolean = false;
  disable: Boolean = false;
  modifForm = this.fb.group({
    login: ['', Validators.required],
    passwordOld: ['', Validators.required],
    passwordNew: ['', [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]],
    
  });

  constructor(protected ref: NbDialogRef<ModifProfilComponent>,private fb: FormBuilder) { }

  ngOnInit(): void {
    this.modifForm.controls['login'].setValue(this.user.util_login);
      console.log(this.user);
  }

  cancel() {
    this.ref.close();
  }

  submit() {
    
    this.ref.close(this.modifForm.value);
  }

  checkpass(value: String) {
    if(this.modifForm.controls['passwordNew'].value === value && this.modifForm.controls['passwordOld'].value !=''){
      this.confirm = true;
      this.disable = true;
    } else {
      this.disable = false;
      this.confirm = false;
    }
  }
}
