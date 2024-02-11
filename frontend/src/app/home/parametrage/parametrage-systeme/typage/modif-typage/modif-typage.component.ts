import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

import { Typage } from '../../../../../model/Typage';

@Component({
  selector: 'ngx-modif-typage',
  templateUrl: './modif-typage.component.html',
  styleUrls: ['./modif-typage.component.scss']
})
export class ModifTypageComponent implements OnInit {


  modifForm = this.fb.group({

    typ_libelle_long: ['', [Validators.required, Validators.minLength(2)]],
    typ_libelle_court: [''],
    typ_type: [''],


  });

  id: Number;
  typage: Typage;
  typ_type: String;

  constructor(protected ref: NbDialogRef<ModifTypageComponent>,
     private fb: FormBuilder) { }

ngOnInit(): void {

this.modifForm.controls['typ_libelle_long'].setValue(this.typage.typ_libelle_long);
this.modifForm.controls['typ_libelle_court'].setValue(this.typage.typ_libelle_court);
this.modifForm.controls['typ_type'].setValue(this.typage.typ_type);
this.typ_type = this.typage.typ_type;

console.log(this.typage);
}
cancel() {
this.ref.close();
}

submit() {
this.ref.close(this.modifForm.value);
}

onChange(event) {
console.log(event);
this.modifForm.controls['typ_type'].setValue( event);
}
}
