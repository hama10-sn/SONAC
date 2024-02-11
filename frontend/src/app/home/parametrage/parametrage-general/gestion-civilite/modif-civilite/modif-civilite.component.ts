import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbDialogRef } from '@nebular/theme';
import { Civilite } from '../../../../../model/Civilite';

@Component({
  selector: 'ngx-modif-civilite',
  templateUrl: './modif-civilite.component.html',
  styleUrls: ['./modif-civilite.component.scss']
})
export class ModifCiviliteComponent implements OnInit {

  nature: any;
  autorisation: [];

  modifForm = this.fb.group({
    civ_code:[''],
    civ_libellelong: ['', [Validators.required]],
    civ_libellecourt: ['', [Validators.required]],
    civ_nature: ['', [Validators.required, Validators.maxLength(1)]],
  });
  civilite:Civilite;
  constructor(protected ref: NbDialogRef<ModifCiviliteComponent>,
    private fb: FormBuilder,private authService: NbAuthService) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {
 
      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }
 
    });

        this.modifForm.controls['civ_code'].setValue(this.civilite.civ_code);
        this.modifForm.controls['civ_libellelong'].setValue(this.civilite.civ_libellelong); 
        this.modifForm.controls['civ_libellecourt'].setValue(this.civilite.civ_libellecourt);         
        this.modifForm.controls['civ_nature'].setValue(this.civilite.civ_nature); 
        this.nature = this.civilite.civ_nature.toString();
  }
  cancel() {
    this.ref.close();
  }

  submit() {
    this.ref.close(this.modifForm.value);
  }
  onChange(event) {
    //console.log(event);
    this.modifForm.controls['civ_nature'].setValue(event);
  }
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;
  
  }
}
