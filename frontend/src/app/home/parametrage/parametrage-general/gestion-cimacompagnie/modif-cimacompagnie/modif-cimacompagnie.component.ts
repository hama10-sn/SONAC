import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbDialogRef } from '@nebular/theme';
import { Cimacodificationcompagnie } from '../../../../../model/Cimacodificationcompagnie';

@Component({
  selector: 'ngx-modif-cimacompagnie',
  templateUrl: './modif-cimacompagnie.component.html',
  styleUrls: ['./modif-cimacompagnie.component.scss']
})
export class ModifCimacompagnieComponent implements OnInit {  
  
  autorisation:[];
  modifForm = this.fb.group({
    id:[''],
    code_cima_compagnie: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    denomination: ['', [Validators.required]],
  });
  cimaCompagnie:Cimacodificationcompagnie;
  constructor(protected ref: NbDialogRef<ModifCimacompagnieComponent>,
    private fb: FormBuilder,private authService: NbAuthService) { }

  ngOnInit(): void {

    this.authService.onTokenChange()
   .subscribe((token: NbAuthJWTToken) => {

     if (token.isValid()) {
       this.autorisation = token.getPayload().fonctionnalite.split(',');
       console.log(this.autorisation);
     }

   });
        this.modifForm.controls['id'].setValue(this.cimaCompagnie.id);
        this.modifForm.controls['code_cima_compagnie'].setValue(this.cimaCompagnie.code_cima_compagnie);  
        this.modifForm.controls['denomination'].setValue(this.cimaCompagnie.denomination);  
  }
  cancel() {
    this.ref.close();
  }

  submit() {
    this.ref.close(this.modifForm.value);
  }
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;
  
  }

}
