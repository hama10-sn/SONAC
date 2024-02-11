import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { FormatNumberService } from '../../../../../services/formatNumber.service';

@Component({
  selector: 'ngx-ajout-lot2',
  templateUrl: './ajout-lot2.component.html',
  styleUrls: ['./ajout-lot2.component.scss']
})
export class AjoutLot2Component implements OnInit {

  lot:FormGroup = this.fb.group({
    lot_numero: [''],
	lot_numeroacte: [''],
	lot_numeromarche: [''],
	lot_codeinternemarche: [''],
	lot_description: ['', Validators.required],
	lot_capitalass: ['', Validators.required],
	lot_capitalsmp: [''],
	lot_capitallci: [''],
	lot_dureetravaux: ['', Validators.required],
   });

  constructor(protected ref: NbDialogRef<AjoutLot2Component>,private fb: FormBuilder,
    private formatNumber: FormatNumberService) { }

  ngOnInit(): void {
  }

  cancel() {
    this.ref.close();
  }

  submit() {
    this.ref.close(this.lot);
  }


  onChangeCapAss(event){
      this.lot.get('lot_capitalass').setValue(Number(this.formatNumber.replaceAll(event.target.value,' ','')));
  }

}
