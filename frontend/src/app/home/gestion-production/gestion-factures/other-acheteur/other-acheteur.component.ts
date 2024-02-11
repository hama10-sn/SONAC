import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbDialogRef } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Acheteur } from '../../../../model/Acheteur';
import { Police } from '../../../../model/Police';
import { User } from '../../../../model/User';
import { AcheteurService } from '../../../../services/acheteur.service';
import { FormatNumberService } from '../../../../services/formatNumber.service';
import { PoliceService } from '../../../../services/police.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { UserService } from '../../../../services/user.service';
import dateFormatter from 'date-format-conversion';

@Component({
  selector: 'ngx-other-acheteur',
  templateUrl: './other-acheteur.component.html',
  styleUrls: ['./other-acheteur.component.scss']
})
export class OtherAcheteurComponent implements OnInit {

  acheteurs: Array<Acheteur> = new Array<Acheteur>();
  public acheteurCtrl: FormControl = new FormControl();
  public acheteurFilterCtrl: FormControl = new FormControl();
  public filteredAcheteur: ReplaySubject<Acheteur[]> = new ReplaySubject<Acheteur[]>();
  protected _onDestroy = new Subject<void>();

  acheteur: FormGroup = this.fb.group({

    achet_id: [''],
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
  listeAcheteur: Array<Acheteur> = new Array<Acheteur>();
  polices: Array<Police> = new Array<Police>();

  avis: string = "OUI";
  typeAcheteur: String;
  police: Police;
  produitSelected: any;
  numPlolice: any;
  autorisation = [];
  code_utilisateur: String;
  achetdateavis: Date;
  achetdatefacture: Date;
  achetdatedebutcredit: Date;

  montancredi: any;
  nbreEcheance: any;

  constructor(protected ref: NbDialogRef<OtherAcheteurComponent>, private fb: FormBuilder,
    private formatNumber: FormatNumberService, private transfertData: TransfertDataService,
    private acheteurService: AcheteurService, private authService: NbAuthService,
    private userService: UserService, private policeService: PoliceService
  ) { }

  ngOnInit(): void {
    this.acheteur.get('achet_avis').setValue("OUI");
    this.typeAcheteur = this.ref.componentRef.instance[0];
    this.numPlolice = this.transfertData.getData();
    console.log(this.ref.componentRef.instance);
    console.log(this.numPlolice);
    this.onGetAllAcheteur();
    this.onGetPolice(this.numPlolice)
    /* this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        this.userService.getUser(token.getPayload().sub)
      .subscribe((data: User) => {
        this.code_utilisateur = data.util_numero;
        console.log(this.code_utilisateur);
      });
      }

    }); */

    if (this.typeAcheteur == '4') {
      this.acheteur.get('achet_montantcredit').clearValidators();
      this.acheteur.get('achet_numclien_institu').clearValidators();
      this.acheteur.get('achet_montant_loyer').setValidators(Validators.required);
      this.acheteur.get('achet_bail').setValidators(Validators.required);
      this.acheteur.get('achet_duree_bail').setValidators(Validators.required);
      this.acheteur.updateValueAndValidity();
      console.log('fdf');
    }
    this.acheteurFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererAcheteurs();
      });
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filtererAcheteurs() {
    if (!this.acheteurs) {
      return;
    }
    // get the search keyword
    let search = this.acheteurFilterCtrl.value;
    if (!search) {
      this.filteredAcheteur.next(this.acheteurs.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredAcheteur.next(
      this.acheteurs.filter(c => c.achet_numero.toString().indexOf(search) > -1 ||
        c.achet_nom.toLowerCase().indexOf(search) > -1 ||
        c.achet_prenom.toLowerCase().indexOf(search) > -1)
    );
  }
  onGetAllAcheteur() {
    this.acheteurService.getAllAcheteurByPolice(this.numPlolice)
      .subscribe((data: Acheteur[]) => {
        this.acheteurs = data as Acheteur[];
        this.listeAcheteur = this.acheteurs;
        console.log(this.listeAcheteur);
        this.filteredAcheteur.next(this.acheteurs.slice());
        console.log(this.acheteurs);
      });
  }
  /* achet:Acheteur;
  onGetAcheteur(num:number){
    this.acheteurService.getAcheteurByNum(num)
    .subscribe((data: Acheteur) => {
      this.achet = data;
      //this.listeAcheteur= this.acheteurs;
      
    });
    return this.achet;
  }
   */
  onChangeAcheteur(event) {
    console.log(event);
    //this.ach=this.onGetAcheteur(event);
    this.acheteur.controls['achet_numero'].setValue(event);
    //console.log(this.onGetAcheteur(event));
    // console.log(this.ach);
    console.log(this.listeAcheteur);
    console.log(this.acheteurs);
    console.log((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_numeroaffaire);

    /* this.acheteur.controls['achet_numeroclient'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_numeroclient);
    this.acheteur.controls['achet_numeroaffaire'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_numeroaffaire);
    this.acheteur.controls['achet_type'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_type);
    this.acheteur.controls['achet_chiffreaffaire'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_chiffreaffaire);
    this.acheteur.controls['achet_incidentpaiement'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_incidentpaiement);
    this.acheteur.controls['achet_montantincidentpaiement'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_montantincidentpaiement);
    this.acheteur.controls['achet_dispersion'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_dispersion);
    this.acheteur.controls['achet_qualite'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_qualite);
    this.acheteur.controls['achet_typologie'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_typologie);
    this.acheteur.controls['achet_creditencours'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_creditencours);
    this.montancredi = (this.listeAcheteur.find(p => p.achet_numero == event))?.achet_montantcredit;
    this.acheteur.controls['achet_montantcredit'].setValue(this.montancredi);
    this.acheteur.controls['achet_montantrembours'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_montantrembours);
    this.acheteur.controls['achet_montantecheance'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_montantecheance);
    this.nbreEcheance = (this.listeAcheteur.find(p => p.achet_numero == event))?.achet_montantecheancecredit;
    this.acheteur.controls['achet_montantecheancecredit'].setValue(this.nbreEcheance);
    this.acheteur.controls['achet_montantecheanceimpaye'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_montantecheanceimpaye);
    this.acheteur.controls['achet_montantimpaye'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_montantimpaye);
    this.acheteur.controls['achet_montantrecouvre'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_montantrecouvre);
    */ this.acheteur.controls['achet_nom'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_nom);
    this.acheteur.controls['achet_prenom'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_prenom);
    this.acheteur.controls['achet_comptebancaire'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_comptebancaire);
   /*  this.acheteur.controls['achet_numclien_institu'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_numclien_institu);
    this.acheteur.controls['achet_duree'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_duree);
    this.acheteur.controls['achet_avis'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_avis);
    var dateAvis = ((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_date_avis);
    if (dateAvis !== null) {
      this.achetdateavis = dateFormatter(dateAvis, 'yyyy-MM-ddThh:mm');
      this.acheteur.controls['achet_date_avis'].setValue(this.achetdateavis);
    } else {
      this.acheteur.controls['achet_date_avis'].setValue("");
    } */
    // this.achetdateavis = dateFormatter(((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_date_avis), 'yyyy-MM-ddThh:mm');

    //console.log(this.acheteur.controls['achet_date_avis'].value);

   // this.acheteur.controls['achet_bon_commande'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_bon_commande);
    // this.achetdatefacture = dateFormatter(((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_date_facture), 'yyyy-MM-ddThh:mm');
    /* var dateFacture = ((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_date_facture);
    console.log(dateFacture);
    if (dateFacture != null) {
      this.achetdatefacture = dateFormatter(dateFacture, 'yyyy-MM-ddThh:mm');
      this.acheteur.controls['achet_date_facture'].setValue(this.achetdatefacture);
    } else {
      this.acheteur.controls['achet_date_facture'].setValue('');
    }
    this.acheteur.controls['achet_numero_facture'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_numero_facture);
    this.acheteur.controls['achet_chiffreaffaire_confie'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_chiffreaffaire_confie);
    this.acheteur.controls['achet_typecouverture'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_typecouverture);
    this.acheteur.controls['achet_bail'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_bail);
    this.acheteur.controls['achet_duree_bail'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_duree_bail);
    this.acheteur.controls['achet_montant_loyer'].setValue((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_montant_loyer);
    
    var date_debut_credit = ((this.listeAcheteur.find(p => p.achet_numero == event))?.achet_date_debut_credit);
    if (date_debut_credit != null) {
      this.achetdatedebutcredit = dateFormatter(date_debut_credit, 'yyyy-MM-ddThh:mm');
      this.acheteur.controls['achet_date_debut_credit'].setValue(this.achetdatedebutcredit);

    } else {
      this.acheteur.controls['achet_date_debut_credit'].setValue('');
    }
    console.log(this.achetdatedebutcredit);
 */
  }
  onGetDateDeffe() {

  }
  dateEffet: Date;
  dateEcheance: Date;
  onGetPolice(numpol) {
    this.policeService.getPolice(numpol)
      .subscribe((data: Police) => {
        console.log(data.poli_codeproduit);
        this.dateEffet = data.poli_dateeffetencours;
        this.dateEcheance = data.poli_dateecheance;
        console.log(this.dateEffet);
        console.log(this.dateEcheance);
      });
  }
  errorDateAcheteur: boolean = true;
  onChangeFocus() {
    this.onGetPolice(this.numPlolice)
    //let dateEffet = new Date();
    //let dateSoumission = new Date();
    console.log(this.dateEffet);
    console.log(this.dateEcheance);
    this.achetdatedebutcredit = this.acheteur.get('achet_date_debut_credit').value;
    //this.dateEffet=this.myForm.get('policeForm.poli_dateeffetencours').value;
    //this.verifDeposite= true; dateEcheance
    console.log(this.achetdatedebutcredit);
    console.log(this.dateEffet);
    if (dateFormatter(this.dateEffet, 'yyyy-MM-dd') <= dateFormatter(this.achetdatedebutcredit, 'yyyy-MM-dd') && dateFormatter(this.dateEcheance, 'yyyy-MM-dd') >= dateFormatter(this.achetdatedebutcredit, 'yyyy-MM-dd')) {


      console.log("yagui ci");
      this.errorDateAcheteur = true;
    } else {
      console.log("dou bou baxbi");
      this.errorDateAcheteur = false;
      this.acheteur.get('achet_date_debut_credit').setValue('');
    }
  }

  cancel() {
    this.ref.close();
  }

  submit() {
    this.ref.close(this.acheteur);
  }

  // onChangeMontantCredit(event) {
  //   this.acheteur.get('achet_montantcredit').setValue(Number(this.formatNumber.replaceAll(event.target.value, ' ', '')));
  // }

  onChangeMontantEcheance(event) {
    this.acheteur.get('achet_montantecheance').setValue(Number(this.formatNumber.replaceAll(event.target.value, ' ', '')));
  }

  onChangeTypeCouverture(event) {
    this.acheteur.get('achet_typecouverture').setValue(event);
  }

  onChangeTypeAcheteur(event) {
    this.acheteur.get('achet_type').setValue(event);
  }
  onChangeTypeBail(event) {
    this.acheteur.get('achet_bail').setValue(event);
  }

  onChangeMontantLoyer(event) {
    this.acheteur.get('achet_montant_loyer').setValue(Number(this.formatNumber.replaceAll(event.target.value, ' ', '')));
  }


  onChangeMontantCredit(event) {
    this.montancredi = event.target.value;
    console.log(this.montancredi);
    this.acheteur.get('achet_montantcredit').setValue(Number(this.formatNumber.replaceAll(this.montancredi, ' ', '')));

    console.log("montant credit = " + this.montancredi + "--------nbreEcheance = " + this.nbreEcheance + "--------");
    if (this.nbreEcheance != '' && this.nbreEcheance != null && this.nbreEcheance > 0) {

      this.acheteur.get('achet_montantecheance').setValue(Number(this.montancredi / this.nbreEcheance));
    } else {
      this.acheteur.get('achet_montantecheance').setValue('');
    }
    console.log(this.acheteur.get('achet_montantecheance').value);
  }

  // nbEcheance:any;
  //montantEcheance:number;
  onChangeNbEcheance(event) {
    this.nbreEcheance = event.target.value;
    // console.log(this.nbreEcheance);
    this.acheteur.get('achet_montantecheancecredit').setValue(this.nbreEcheance);
    // console.log(event.target.value);
    if (this.nbreEcheance != '' && this.nbreEcheance != 0 && this.nbreEcheance != null) {

      this.acheteur.get('achet_montantecheance').setValue(Number(this.montancredi / (this.nbreEcheance)));
    } else {
      this.acheteur.get('achet_montantecheance').setValue('');
    }
    console.log(this.acheteur.get('achet_montantecheance').value);
  }


}
