import { Component, OnInit } from '@angular/core';

import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

import { Fonctionnalite } from '../../../../../model/Fonctionnalite';

@Component({
  selector: 'ngx-modif-fonctionnalite',
  templateUrl: './modif-fonctionnalite.component.html',
  styleUrls: ['./modif-fonctionnalite.component.scss']
})
export class ModifFonctionnaliteComponent implements OnInit {

  modifForm = this.fb.group({

    entite: ['', [Validators.required, Validators.minLength(2)]],
    modif: [''],
    creer: [''],
    listing: [''],
    sup: [''],

  });

  id: Number;
  fonctionnalite: Fonctionnalite;
  typ_type: String;

  constructor(protected ref: NbDialogRef<ModifFonctionnaliteComponent>,
     private fb: FormBuilder) { }

ngOnInit(): void {

this.modifForm.controls['entite'].setValue(this.fonctionnalite.entite);
this.modifForm.controls['modif'].setValue(this.fonctionnalite.modif);
this.modifForm.controls['creer'].setValue(this.fonctionnalite.creer);
this.modifForm.controls['listing'].setValue(this.fonctionnalite.listing);
this.modifForm.controls['sup'].setValue(this.fonctionnalite.sup);
console.log(this.fonctionnalite);
}
cancel() {
this.ref.close();
}

submit() {
//this.modifForm.controls['date_update'].setValue(new Date());
this.ref.close(this.modifForm.value);
}

/*onChange(event) {
console.log(event);
this.modifForm.controls['typ_type'].setValue( event);
}*/

}
