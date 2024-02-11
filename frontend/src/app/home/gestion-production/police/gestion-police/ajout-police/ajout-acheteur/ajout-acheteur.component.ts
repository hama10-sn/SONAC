import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Police } from '../../../../../../model/Police';
import { FormatNumberService } from '../../../../../../services/formatNumber.service';

@Component({
  selector: 'ngx-ajout-acheteur',
  templateUrl: './ajout-acheteur.component.html',
  styleUrls: ['./ajout-acheteur.component.scss']
})
export class AjoutAcheteurComponent implements OnInit {

  acheteur:FormGroup = this.fb.group({
  
	achet_numero: [''],
	achet_numeroclient: [''],
	achet_numeroaffaire: [''],
	achet_type: [''],
	achet_chiffreaffaire: [''],
	achet_incidentpaiement: [''],
	achet_montantincidentpaiement: [''],
	achet_montantpaiementrecup: [''],
	achet_dispersion: [''],
	achet_qualite: [''],
	achet_typologie: [''],
	achet_creditencours: [''],
	achet_montantcredit: ['', Validators.required],
	achet_montantrembours: [''],
	achet_montantecheance: [''],
	achet_montantecheancecredit: [''],
	achet_montantecheanceimpaye: [''],
	achet_montantimpaye: [''],
	achet_montantrecouvre: [''],
	achet_codeutilisateur: [''],
	achet_datemodification: [''],
  achet_nom: ['', Validators.required],
  achet_prenom: [''],
  achet_comptebancaire: [''],
  achet_numclien_institu: ['', Validators.required],
  achet_duree: [''],
  achet_avis: [''],
  achet_date_avis: [''],
  achet_bon_commande: [''],
  achet_date_facture: [''],
  achet_numero_facture: [''],
  achet_chiffreaffaire_confie: [''],
  achet_typecouverture: [''],
  achet_bail: [''],
  achet_duree_bail: [''],
  achet_montant_loyer: [''],
  achet_date_debut_credit: [''],
  
   });

   avis:string = "OUI";
   typeAcheteur:String;
   police:Police;

  constructor(protected ref: NbDialogRef<AjoutAcheteurComponent>,private fb: FormBuilder,
    private formatNumber: FormatNumberService) { }

  ngOnInit(): void {
  this.acheteur.get('achet_avis').setValue("OUI");
  this.typeAcheteur = this.ref.componentRef.instance[0];
  console.log(this.ref.componentRef.instance);
  if(this.typeAcheteur == '4'){
    this.acheteur.get('achet_montantcredit').clearValidators();
    this.acheteur.get('achet_numclien_institu').clearValidators();
    this.acheteur.get('achet_montant_loyer').setValidators(Validators.required);
    this.acheteur.get('achet_bail').setValidators(Validators.required);
    this.acheteur.get('achet_duree_bail').setValidators(Validators.required);
    this.acheteur.updateValueAndValidity();
    console.log('fdf');
  }else if(this.typeAcheteur == '1' && this.typeAcheteur == '2' && this.typeAcheteur == '3'){
    this.acheteur.get('achet_montantecheancecredit').setValidators(Validators.required);
    this.acheteur.updateValueAndValidity();
  }
  }

  cancel() {
    this.ref.close();
  }

  submit() {
    this.ref.close(this.acheteur);
  }
  montancredi: number;
  onChangeMontantCredit(event){
    this.acheteur.get('achet_montantcredit').setValue(Number(this.formatNumber.replaceAll(event.target.value,' ','')));
    this.montancredi= event.target.value;
    console.log(this.montancredi+"--------"+this.nbEcheance+"--------"+ event.target.value);
    if(this.nbEcheance!=Number('') && this.nbEcheance!=null && this.nbEcheance>0 ){
    
      this.acheteur.get('achet_montantecheance').setValue(this.montancredi/this.nbEcheance);
    }else{
      this.acheteur.get('achet_montantecheance').setValue('');
    }
    console.log(this.acheteur.get('achet_montantecheance').value);
}
nbEcheance:number;
//montantEcheance:number;
onChangeNbEcheance(event){
  this.acheteur.get('achet_montantecheancecredit').setValue(event.target.value);
  console.log(event.target.value);
  this.nbEcheance==event.target.value;
  console.log(this.nbEcheance);
  //this.montantEcheance=Number(this.montancredi/(event.target.value));
  //console.log(this.montantEcheance);
  if(event.target.value!='' && event.target.value!=0 && event.target.value!=null ){

    this.acheteur.get('achet_montantecheance').setValue(this.montancredi/(event.target.value));
  }else{
    this.acheteur.get('achet_montantecheance').setValue('');
  }
  console.log(this.acheteur.get('achet_montantecheance').value);
  }
onChangeMontantEcheance(event){
 // this.acheteur.get('achet_montantecheance').setValue(Number(this.formatNumber.replaceAll(event.target.value,' ','')));
}

onChangeTypeCouverture(event){
  this.acheteur.get('achet_typecouverture').setValue(event);
}

onChangeTypeAcheteur(event){
  this.acheteur.get('achet_type').setValue(event);
}
onChangeTypeBail(event){
  this.acheteur.get('achet_bail').setValue(event);
}

onChangeMontantLoyer(event){
  this.acheteur.get('achet_montant_loyer').setValue(Number(this.formatNumber.replaceAll(event.target.value,' ','')));
}


}
