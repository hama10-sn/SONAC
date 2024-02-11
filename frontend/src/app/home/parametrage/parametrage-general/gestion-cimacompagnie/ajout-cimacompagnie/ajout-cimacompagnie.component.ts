import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbDialogRef } from '@nebular/theme';
import { Cimacodificationcompagnie } from '../../../../../model/Cimacodificationcompagnie';

@Component({
  selector: 'ngx-ajout-cimacompagnie',
  templateUrl: './ajout-cimacompagnie.component.html',
  styleUrls: ['./ajout-cimacompagnie.component.scss']
})
export class AjoutCimacompagnieComponent implements OnInit {

  autorisation: [];

  addForm = this.fb.group({
    
    code_cima_compagnie: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    denomination: ['', [Validators.required]],
  });
  cimaCompagnie: Cimacodificationcompagnie;
  constructor(protected ref: NbDialogRef<AjoutCimacompagnieComponent>,private fb: FormBuilder,
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

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;
  
  }
}


