import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

import { Typage } from '../../../../../model/Typage';


@Component({
  selector: 'ngx-ajout-typage',
  templateUrl: './ajout-typage.component.html',
  styleUrls: ['./ajout-typage.component.scss']
})
export class AjoutTypageComponent implements OnInit {


  addForm = this.fb.group({

    typ_libelle_long: ['', [Validators.required, Validators.minLength(2)]],
    typ_libelle_court: [''],
    typ_type: [''],


  });

  id: Number;
  typage: Typage;

  constructor(protected ref: NbDialogRef<AjoutTypageComponent>,
     private fb: FormBuilder) { }

ngOnInit(): void {


}
cancel() {
this.ref.close();
}

submit() {
this.ref.close(this.addForm.value);
}

onChange(event) {
console.log(event);
this.addForm.controls['typ_type'].setValue(event) ;
}

}
