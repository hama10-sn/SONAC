import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

import { Role } from '../../../../../model/Role';

@Component({
  selector: 'ngx-ajout-role',
  templateUrl: './ajout-role.component.html',
  styleUrls: ['./ajout-role.component.scss']
})
export class AjoutRoleComponent implements OnInit {

  addForm = this.fb.group({

    nom: ['', [Validators.required, Validators.minLength(2)]],
   // autorisation: [''],
    date_create: [''],
    date_update: [''],


  });


  role: Role;

  constructor(protected ref: NbDialogRef<AjoutRoleComponent>,
     private fb: FormBuilder) { }

ngOnInit(): void {


}
cancel() {
this.ref.close();
}

submit() {
this.addForm.controls['date_update'].setValue(new Date());
this.addForm.controls['date_create'].setValue(new Date());
this.ref.close(this.addForm.value);
}

/*onChange(event) {
console.log(event);
this.addForm.controls['typ_type'].setValue(event) ;
}*/

}
