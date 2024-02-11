import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Acheteur } from '../../../../model/Acheteur';
import { Client } from '../../../../model/Client';
import { Police } from '../../../../model/Police';
import { User } from '../../../../model/User';
import { AcheteurService } from '../../../../services/acheteur.service';
import { ClientService } from '../../../../services/client.service';
import { PoliceService } from '../../../../services/police.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { UserService } from '../../../../services/user.service';
import dateFormatter from 'date-format-conversion';

@Component({
  selector: 'ngx-modif-acheteur',
  templateUrl: './modif-acheteur.component.html',
  styleUrls: ['./modif-acheteur.component.scss']
})
export class ModifAcheteurComponent implements OnInit {

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  modifForm = this.fb.group({
    achet_numero: [''],
	achet_numeroclient: ['',[Validators.required]],
	achet_numeroaffaire: ['',[Validators.required]],
	achet_type: [''],
	achet_chiffreaffaire: [''],
	achet_incidentpaiement: [''],
	achet_montantincidentpaiement: [''],
	achet_montantpaiementrecup: [''],
	achet_dispersion: ['',[Validators.required]],
	achet_qualite: [''],
	achet_typologie: ['',[Validators.required]],
	achet_creditencours: [''],
	achet_montantcredit: [''],
	achet_montantrembours: [''],
	achet_montantecheance: [''],
	achet_montantecheancecredit: [''],
	achet_montantecheanceimpaye: [''],
	achet_montantimpaye: [''],
	achet_montantrecouvre: [''],
	achet_codeutilisateur: [''],
	achet_datemodification: [''],
  achet_nom:[''],
	achet_prenom:[''],
	achet_comptebancaire:[''],
	achet_numclien_institu:[''],
	achet_duree:[''],
	achet_avis:[''],
	achet_date_avis:[''],
	achet_bon_commande:[''],
	achet_date_facture:[''],
	achet_numero_facture:[''],
	achet_chiffreaffaire_confie:[''],
	achet_typecouverture:[''],
	achet_bail:[''],
	achet_duree_bail:[''],
	achet_montant_loyer:[''],
	achet_date_debut_credit:[''],
  });

  autorisation: [];
  login:any;
  user: User;
  listeCodeUser: any[];
  codeUser: String;
  cliendenom: any;
  typologie: any;
  achetdatefacture : Date;
  achetdateavis: Date;
  achetdatedebutcredit: Date;

  clients: Array<Client> = new Array<Client>();
  polices: Array<Police> = new Array<Police>();

acheteur: Acheteur;
  constructor(
    private fb: FormBuilder,private userService: UserService, private acheteurService: AcheteurService,
    private authService: NbAuthService,private activatedroute: ActivatedRoute,private toastrService: NbToastrService,
    private transfertData: TransfertDataService,private router: Router, private clientService : ClientService, private policeService: PoliceService
  ) { }

  ngOnInit(): void {
    this.acheteur = this.transfertData.getData();
    this.getlogin();
    this.onGetAllUser();
    this.onGetAllclients();
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }
 
    });

    console.log(this.acheteur);
  this.modifForm.controls['achet_numero'].setValue(this.acheteur.achet_numero);
  this.modifForm.controls['achet_numeroclient'].setValue(this.acheteur.achet_numeroclient); 
  this.cliendenom=(this.onGetLibelleByClient(this.acheteur.achet_numeroclient));
  //console.log(this.onGetLibelleByClient(this.acheteur.achet_numeroclient));
  console.log(this.acheteur.achet_numeroclient);
  this.modifForm.controls['achet_numeroaffaire'].setValue(this.acheteur.achet_numeroaffaire);
  console.log(this.acheteur.achet_numeroaffaire);
  this.modifForm.controls['achet_type'].setValue(this.acheteur.achet_type);
  this.modifForm.controls['achet_chiffreaffaire'].setValue(this.acheteur.achet_chiffreaffaire);
  this.modifForm.controls['achet_incidentpaiement'].setValue(this.acheteur.achet_incidentpaiement);
  this.modifForm.controls['achet_montantincidentpaiement'].setValue(this.acheteur.achet_montantincidentpaiement);
  this.modifForm.controls['achet_montantpaiementrecup'].setValue(this.acheteur.achet_montantpaiementrecup);
  this.modifForm.controls['achet_dispersion'].setValue(this.acheteur.achet_dispersion);
  this.modifForm.controls['achet_qualite'].setValue(this.acheteur.achet_qualite);
  this.modifForm.controls['achet_typologie'].setValue(this.acheteur.achet_typologie);
  this.typologie=this.acheteur.achet_typologie;
  this.modifForm.controls['achet_creditencours'].setValue(this.acheteur.achet_creditencours);
  this.modifForm.controls['achet_montantrembours'].setValue(this.acheteur.achet_montantrembours);
  this.modifForm.controls['achet_montantecheance'].setValue(this.acheteur.achet_montantecheance);
  this.modifForm.controls['achet_montantecheancecredit'].setValue(this.acheteur.achet_montantecheancecredit);
  this.modifForm.controls['achet_montantecheanceimpaye'].setValue(this.acheteur.achet_montantecheanceimpaye);
  this.modifForm.controls['achet_montantimpaye'].setValue(this.acheteur.achet_montantimpaye);
  this.modifForm.controls['achet_montantrecouvre'].setValue(this.acheteur.achet_montantrecouvre);
  this.modifForm.controls['achet_prenom'].setValue(this.acheteur.achet_prenom);
  this.modifForm.controls['achet_nom'].setValue(this.acheteur.achet_nom);
  this.modifForm.controls['achet_comptebancaire'].setValue(this.acheteur.achet_comptebancaire);
  this.modifForm.controls['achet_numclien_institu'].setValue(this.acheteur.achet_numclien_institu);
  this.modifForm.controls['achet_duree'].setValue(this.acheteur.achet_duree);
  this.modifForm.controls['achet_avis'].setValue(this.acheteur.achet_avis);
  this.achetdateavis = dateFormatter(this.acheteur.achet_date_avis, 'yyyy-MM-ddThh:mm');
  this.modifForm.controls['achet_date_avis'].setValue(this.acheteur.achet_date_avis);
  this.modifForm.controls['achet_bon_commande'].setValue(this.acheteur.achet_bon_commande);  
  this.achetdatefacture = dateFormatter(this.acheteur.achet_date_facture, 'yyyy-MM-ddThh:mm');        
  this.modifForm.controls['achet_date_facture'].setValue(this.achetdatefacture);
  this.modifForm.controls['achet_numero_facture'].setValue(this.acheteur.achet_numero_facture);
  this.modifForm.controls['achet_chiffreaffaire_confie'].setValue(this.acheteur.achet_chiffreaffaire_confie);
  this.modifForm.controls['achet_typecouverture'].setValue(this.acheteur.achet_typecouverture);
  this.modifForm.controls['achet_bail'].setValue(this.acheteur.achet_bail);
  this.modifForm.controls['achet_duree_bail'].setValue(this.acheteur.achet_duree_bail);
  this.modifForm.controls['achet_montant_loyer'].setValue(this.acheteur.achet_montant_loyer);
  this.achetdatedebutcredit = dateFormatter(this.acheteur.achet_date_debut_credit, 'yyyy-MM-ddThh:mm'); 
  this.modifForm.controls['achet_date_debut_credit'].setValue(this.achetdatedebutcredit);

  }
 /*  getLibelleClient(){
    if(this.client?.clien_denomination === '' || this.client?.clien_denomination === null){
      // tslint:disable-next-line:max-line-length
      this.myForm.get('policeForm.poli_client').setValue(this.client?.clien_numero + ': ' + this.client?.clien_prenom + ' ' + this.client?.clien_nom);
      this.myForm.get('marche.march_donneurordre').setValue(this.client?.clien_numero + ': ' + this.client?.clien_prenom + ' ' + this.client?.clien_nom);
    }
   else{
     // tslint:disable-next-line:max-line-length
    this.myForm.get('policeForm.poli_client').setValue(this.client?.clien_numero + ': ' + this.client?.clien_denomination);
    this.myForm.get('marche.march_donneurordre').setValue(this.client?.clien_numero + ': ' + this.client?.clien_prenom + ' ' + this.client?.clien_nom);
    
  } 
  }*/
  onGetAllUser() {
    this.userService.getAllUsers()
      .subscribe((data: User[]) => {
        this.listeCodeUser = data as User[];
      });
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
  Cancel() {
    this.router.navigateByUrl('home/gestion-acheteurs');
  }
  onChangeTypologie(event) {
    //console.log(event);
    this.modifForm.controls['achet_typologie'].setValue(event);
  }
  onGetAllclients() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.clients = data as Client[];
      });
  }

  onGetAllpolices() {
    this.policeService.getAllPolice()
      .subscribe((data: Police[]) => {
        this.polices = data as Police[];
      });
  }

  
  onGetLibelleByClient(numero: any) {
   
    if(((this.clients?.find(b => b.clien_numero === numero))?.clien_nature) == "1"){
       return (this.clients?.find(b => b.clien_numero === numero))?.clien_nom + " " + (this.clients?.find(b => b.clien_numero === numero))?.clien_prenom;  
     }else
       return (this.clients?.find(b => b.clien_numero === numero))?.clien_denomination;  
     }

  onSubmit() {

    this.modifForm.controls['achet_codeutilisateur'].setValue(this.user.util_numero);
    this.modifForm.controls['achet_datemodification'].setValue(new Date());
   
      this.acheteurService.modifAcheteur(this.modifForm.value)
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
    check_fonct(fonct: String) {

      let el = this.autorisation.findIndex(itm => itm === fonct);
      if (el === -1)
       return false;
      else
       return true;
    }
    
  }
