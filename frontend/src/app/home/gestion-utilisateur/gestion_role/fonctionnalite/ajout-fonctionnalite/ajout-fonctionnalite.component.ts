import { Component, OnInit } from '@angular/core';

import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

import { Fonctionnalite } from '../../../../../model/Fonctionnalite';
@Component({
  selector: 'ngx-ajout-fonctionnalite',
  templateUrl: './ajout-fonctionnalite.component.html',
  styleUrls: ['./ajout-fonctionnalite.component.scss']
})
export class AjoutFonctionnaliteComponent implements OnInit {

  addForm = this.fb.group({

    entite: ['', [Validators.required, Validators.minLength(2)]],
    ajout: [''],
    creer: [''],
    listing: [''],
    sup: [''],

  });

  id: Number;
  fonctionnalite: Fonctionnalite;
  typ_type: String;

  constructor(protected ref: NbDialogRef<AjoutFonctionnaliteComponent>,
     private fb: FormBuilder) { }

ngOnInit(): void {


}
cancel() {
this.ref.close();
}

submit() {
//this.ajoutForm.controls['date_update'].setValue(new Date());
this.ref.close(this.addForm.value);
}

/*onChange(event) {
console.log(event);
this.ajoutForm.controls['typ_type'].setValue( event);
}*/

}
