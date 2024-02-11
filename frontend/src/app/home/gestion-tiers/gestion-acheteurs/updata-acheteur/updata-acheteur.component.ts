import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Acheteur } from '../../../../model/Acheteur';
import { Police } from '../../../../model/Police';
import { User } from '../../../../model/User';
import { AcheteurService } from '../../../../services/acheteur.service';
import { FormatNumberService } from '../../../../services/formatNumber.service';
import { PoliceService } from '../../../../services/police.service';
import { ProduitService } from '../../../../services/produit.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { UserService } from '../../../../services/user.service';
import { OtherAcheteurComponent } from '../../../gestion-production/gestion-factures/other-acheteur/other-acheteur.component';
import dateFormatter from 'date-format-conversion';

@Component({
  selector: 'ngx-updata-acheteur',
  templateUrl: './updata-acheteur.component.html',
  styleUrls: ['./updata-acheteur.component.scss']
})
export class UpdataAcheteurComponent implements OnInit {

  acheteurs: Array<Acheteur> = new Array<Acheteur>();
  public acheteurCtrl: FormControl = new FormControl();
  public acheteurFilterCtrl: FormControl  = new FormControl();
  public filteredAcheteur: ReplaySubject<Acheteur[]> = new ReplaySubject<Acheteur[]>();
  protected _onDestroy = new Subject<void>();
  
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  acheteur:FormGroup = this.fb.group({
  
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
    achet_prenom: ['', Validators.required],
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
     avis:string = "OUI";
     typeAcheteur:String;
     achet: Acheteur;
     police:Police;
     produitSelected: any;
     numPlolice:any;
     autorisation = [];
     code_utilisateur:String;
     typologie: any;
     public filteredPolices: ReplaySubject<Police[]> = new ReplaySubject<Police[]>();
  login:any;
  user: User;
  listeCodeUser: any[];
  poli: Police;
  
  achetdateavis:Date;
  achetdatefacture :Date;
  achetdatedebutcredit :Date;
  
    constructor(private fb: FormBuilder,
      private formatNumber: FormatNumberService,private transfertData: TransfertDataService,
      private acheteurService: AcheteurService, private authService: NbAuthService,
      private userService: UserService,private policeService: PoliceService, 
      private router: Router,private toastrService: NbToastrService,
      private produitService :ProduitService
      ) { }
  
    ngOnInit(): void {
    this.acheteur.get('achet_avis').setValue("OUI");
    //console.log(this.ref.componentRef.instance);
    
    //this.onGetAllAcheteur();
    this.onGetAllPolice();
    this.getlogin();
    this.achet = this.transfertData.getData();
    this.numPlolice=this.achet.achet_numeroaffaire;
    console.log(this.numPlolice);
    console.log(this.achet);
    //this.produitSelected=this.onGetPoliceByNumProd(this.numPlolice);
    console.log(this.achet);
    //this.onGetLibelle(this.numPlolice);
    //this.typeAcheteur = '2'; //this.onGetPoliceByNum();
    this.produitService.getProduitByPolice(this.numPlolice)
    .subscribe((data: any) => {
      this.poli=data;
      console.log(this.poli);
        console.log(this.poli?.poli_codeproduit);
        this.produitSelected= this.poli?.poli_codeproduit;
      
        if(this.produitSelected == '14002001'){
          this.typeAcheteur = '2';
        }else if(this.produitSelected == '14003001'){
          this.typeAcheteur = '3';
        }else if(this.produitSelected == '14001001'){
          this.typeAcheteur = '1';
        }else if(this.produitSelected == '16008001'){
          this.typeAcheteur = '4';
        }
        
        if(this.typeAcheteur == '4'){
          this.acheteur.get('achet_montantcredit').clearValidators();
          this.acheteur.get('achet_numclien_institu').clearValidators();
          this.acheteur.get('achet_montant_loyer').setValidators(Validators.required);
          this.acheteur.get('achet_bail').setValidators(Validators.required);
          this.acheteur.get('achet_duree_bail').setValidators(Validators.required);
          this.acheteur.updateValueAndValidity();
          console.log('fdf');
        }
      });
    console.log(this.produitSelected);

    /* if(this.produitSelected == '14002001'){
      this.typeAcheteur = '2';
    }else if(this.produitSelected == '14003001'){
      this.typeAcheteur = '3';
    }else if(this.produitSelected == '14001001'){
      this.typeAcheteur = '1';
    }else if(this.produitSelected == '16008001'){
      this.typeAcheteur = '4';
    }
    
    if(this.typeAcheteur == '4'){
      this.acheteur.get('achet_montantcredit').clearValidators();
      this.acheteur.get('achet_numclien_institu').clearValidators();
      this.acheteur.get('achet_montant_loyer').setValidators(Validators.required);
      this.acheteur.get('achet_bail').setValidators(Validators.required);
      this.acheteur.get('achet_duree_bail').setValidators(Validators.required);
      this.acheteur.updateValueAndValidity();
      console.log('fdf');
    } */
    this.acheteur.controls['achet_numero'].setValue(this.achet.achet_numero);
    this.acheteur.controls['achet_numeroclient'].setValue(this.achet.achet_numeroclient);
    this.acheteur.controls['achet_numeroaffaire'].setValue(this.achet.achet_numeroaffaire);
    this.acheteur.controls['achet_type'].setValue(this.achet.achet_type);
    this.acheteur.controls['achet_chiffreaffaire'].setValue(this.achet.achet_chiffreaffaire);
    this.acheteur.controls['achet_incidentpaiement'].setValue(this.achet.achet_incidentpaiement);
    this.acheteur.controls['achet_montantincidentpaiement'].setValue(this.achet.achet_montantincidentpaiement);
    this.acheteur.controls['achet_dispersion'].setValue(this.achet.achet_dispersion);
    this.acheteur.controls['achet_qualite'].setValue(this.achet.achet_qualite);
    this.acheteur.controls['achet_typologie'].setValue(this.achet.achet_typologie);
    this.typologie=this.achet.achet_typologie;
    this.acheteur.controls['achet_creditencours'].setValue(this.achet.achet_creditencours);
    this.acheteur.controls['achet_montantcredit'].setValue(this.achet.achet_montantcredit);
    this.acheteur.controls['achet_montantrembours'].setValue(this.achet.achet_montantrembours);
    this.acheteur.controls['achet_montantecheance'].setValue(this.achet.achet_montantecheance);
    this.acheteur.controls['achet_montantecheancecredit'].setValue(this.achet.achet_montantecheancecredit);
    this.acheteur.controls['achet_montantecheanceimpaye'].setValue(this.achet.achet_montantecheanceimpaye);
    this.acheteur.controls['achet_montantimpaye'].setValue(this.achet.achet_montantimpaye);
    this.acheteur.controls['achet_montantrecouvre'].setValue(this.achet.achet_montantrecouvre);
    this.acheteur.controls['achet_nom'].setValue(this.achet.achet_nom);
    this.acheteur.controls['achet_prenom'].setValue(this.achet.achet_prenom);
    this.acheteur.controls['achet_comptebancaire'].setValue(this.achet.achet_comptebancaire);
    this.acheteur.controls['achet_numclien_institu'].setValue(this.achet.achet_numclien_institu);
    this.acheteur.controls['achet_duree'].setValue(this.achet.achet_duree);
    this.acheteur.controls['achet_avis'].setValue(this.achet.achet_avis);
    this.achetdateavis = dateFormatter(this.achet.achet_date_avis, 'yyyy-MM-ddThh:mm');        
    console.log(this.achetdateavis );
    this.acheteur.controls['achet_date_avis'].setValue(this.achetdateavis);
    this.acheteur.controls['achet_bon_commande'].setValue(this.achet.achet_bon_commande);
    this.achetdatefacture = dateFormatter(this.achet.achet_date_facture, 'yyyy-MM-ddThh:mm');        
    console.log(this.achetdatefacture );
    this.acheteur.controls['achet_date_facture'].setValue(this.achetdatefacture );
    this.acheteur.controls['achet_numero_facture'].setValue(this.achet.achet_numero_facture);
    this.acheteur.controls['achet_chiffreaffaire_confie'].setValue(this.achet.achet_chiffreaffaire_confie);
    this.acheteur.controls['achet_typecouverture'].setValue(this.achet.achet_typecouverture);
    this.acheteur.controls['achet_bail'].setValue(this.achet.achet_bail);
    this.acheteur.controls['achet_duree_bail'].setValue(this.achet.achet_duree_bail);
    this.acheteur.controls['achet_montant_loyer'].setValue(this.achet.achet_montant_loyer);
    this.achetdatedebutcredit=dateFormatter(this.achet.achet_date_debut_credit, 'yyyy-MM-ddThh:mm')
    console.log(this.achetdatedebutcredit );
    this.acheteur.controls['achet_date_debut_credit'].setValue(this.achet.achet_date_debut_credit);
    
   
    }
   
     
  
  /* onGetAllAcheteur(){
    this.acheteurService.getAllAcheteurByPolice(this.numPlolice)
    .subscribe((data: Acheteur[]) => {
      this.acheteurs = data as Acheteur[];
      this.listeAcheteur= this.acheteurs;
      console.log(this.listeAcheteur);
      this.filteredAcheteur.next(this.acheteurs.slice());
      console.log( this.acheteurs);
    });
  } */
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
  onGetAllPolice() {
    this.policeService.getAllPolice()
      .subscribe((data: Police[]) => {
        this.polices = data as Police[];
        //this.polices = data ;
        this.filteredPolices.next(this.polices.slice());
        console.log(this.polices);
       // return this.polices;
      });
      console.log(this.polices);
      //return this.polices;
  }

  onGetLibelle(mun:any){
    this.produitService.getProduitByPolice(mun)
    .subscribe((data: any) => {
      this.poli=data;
      console.log(this.poli);
      //this.displayclient = true;
      //console.log(this.client);
      /* if(this.client.clien_prenom=="" || this.client.clien_prenom==null){
        console.log(this.client?.clien_prenom +" "+ this.client?.clien_nom);
        this.ClientByPolice=this.client?.clien_numero+": "+this.client?.clien_denomination;
      }else{ */
        console.log(this.poli?.poli_codeproduit);
        this.produitSelected= this.poli?.poli_codeproduit;
      /* } */
    });
  }

  onGetPoliceByNumProd(numero:number){
    //this.onGetAllPolice()
    console.log(this.polices);
    console.log(this.numPlolice);
    console.log((this.polices.find(c => c.poli_numero === numero))?.poli_codeproduit);
    return  (this.polices.find(c => c.poli_numero === numero))?.poli_codeproduit.toString();
 
  }
  
  
  
   /*  cancel() {
      this.ref.close();
    }
  
    submit() {
      this.ref.close(this.acheteur);
    } */
    cancel() {
      this.router.navigateByUrl('home/gestion-acheteurs');
    }
    getlogin(): any {
      this.authService.getToken()
        .subscribe((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            this.login = token.getPayload();
            this.userService.getUser(this.login.sub)
        .subscribe((data: User) => {
          this.user = data;
          console.log(this.user);
        });
          }
        });
    }
    onGetAllUser() {
      this.userService.getAllUsers()
        .subscribe((data: User[]) => {
          this.listeCodeUser = data as User[];
        });
    }
  onSubmit() {
    /* this.acheteur.controls['achet_numeroclient'].setValue(this.achet.achet_numero);
    this.acheteur.controls['achet_id'].setValue(this.achet.achet_id);
     */
    this.acheteur.controls['achet_codeutilisateur'].setValue(this.user.util_numero);
    this.acheteur.controls['achet_datemodification'].setValue(new Date());
   console.log(this.acheteur.value);
      this.acheteurService.modifAcheteur(this.acheteur.value)
        .subscribe((data) => {
          this.toastrService.show(
            'acheteur modifié avec succès !',
            'Notification',
            {
              status: this.statusSuccess,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
          this.router.navigateByUrl('home/gestion-acheteurs');
        },
          (error) => {
            this.toastrService.show(
              //"Echec de la modification du produit",
              error.error.message,
              'Erreur de Notification',
              {
                status: this.statusFail,
                destroyByClick: true,
                duration: 300000,
                hasIcon: true,
                position: this.position,
                preventDuplicates: false,
              });
          },
        );
    }
    onChangeTypologie(event) {
      //console.log(event);
      this.acheteur.controls['achet_typologie'].setValue(event);
    }
    onChangeMontantCredit(event){
      this.acheteur.get('achet_montantcredit').setValue(Number(this.formatNumber.replaceAll(event.target.value,' ','')));
  }
  
  onChangeMontantEcheance(event){
    this.acheteur.get('achet_montantecheance').setValue(Number(this.formatNumber.replaceAll(event.target.value,' ','')));
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
  
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;
  }
  
  
}
