import { Component, OnInit } from '@angular/core';

import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

import { Role } from '../../../../../model/Role';

@Component({
  selector: 'ngx-modif-role',
  templateUrl: './modif-role.component.html',
  styleUrls: ['./modif-role.component.scss']
})
export class ModifRoleComponent implements OnInit {

  modifForm = this.fb.group({

    nom: ['', [Validators.required, Validators.minLength(2)]],
    autorisation: [''],
    date_create: [''],
    date_update: [''],


  });

  id: Number;
  role: Role;
  typ_type: String;

  constructor(protected ref: NbDialogRef<ModifRoleComponent>,
     private fb: FormBuilder) { }

ngOnInit(): void {

this.modifForm.controls['nom'].setValue(this.role.nom);
this.modifForm.controls['autorisation'].setValue(this.role.autorisation);
this.modifForm.controls['date_create'].setValue(this.role.date_create);
this.modifForm.controls['date_update'].setValue(this.role.date_update);

console.log(this.role);
}
cancel() {
this.ref.close();
}

submit() {
this.modifForm.controls['date_update'].setValue(new Date());
this.ref.close(this.modifForm.value);
}

/*onChange(event) {
console.log(event);
this.modifForm.controls['typ_type'].setValue( event);
}*/

}
