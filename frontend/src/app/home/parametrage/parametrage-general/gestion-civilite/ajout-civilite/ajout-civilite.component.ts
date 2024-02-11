import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbDialogRef } from '@nebular/theme';
import { Civilite } from '../../../../../model/Civilite';

@Component({
  selector: 'ngx-ajout-civilite',
  templateUrl: './ajout-civilite.component.html',
  styleUrls: ['./ajout-civilite.component.scss']
})
export class AjoutCiviliteComponent implements OnInit {

  autorisation: [];
  addForm = this.fb.group({
    
    civ_libellelong: ['', [Validators.required]],
    civ_libellecourt: ['', [Validators.required]],
    civ_nature: ['', [Validators.required, Validators.maxLength(1)]],
  });
  civilite: Civilite;
  constructor(protected ref: NbDialogRef<AjoutCiviliteComponent>,private fb: FormBuilder,
    private authService: NbAuthService) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
   .subscribe((token: NbAuthJWTToken) => {

     if (token.isValid()) {
       this.autorisation = token.getPayload().fonctionnalite.split(',');
       console.log(this.autorisation);
     }

   });
  }
  cancel() {
    this.ref.close();
  }

  submit() {
    this.ref.close(this.addForm.value);
  }
  onChange(event) {
    //console.log(event);
    this.addForm.controls['civ_nature'].setValue(event);
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;
  
  }
}
