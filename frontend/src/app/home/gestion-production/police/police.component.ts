import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Client } from '../../../model/Client';
import type from '../../data/type.json';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { TransfertDataService } from '../../../services/transfertData.service';
import { Router } from '@angular/router';
import { Police } from '../../../model/Police';
import { PoliceService } from '../../../services/police.service';
import { Prospect } from '../../../model/Prospect';
import { ProspectService } from '../../../services/prospect.service';
@Component({
  selector: 'ngx-police',
  templateUrl: './police.component.html',
  styleUrls: ['./police.component.scss']
})
export class PoliceComponent implements OnInit {

  modifForm = this.fb.group({

    clien_numero: ['', [Validators.required]],
    clien_typeclient: [''],
    clien_numeroprospect:[''],
    clien_numerosolvabilite: [''],
    clien_nature: [''],
    clien_typesociete: [''], // obligatoire si personne morale
    clien_coderegroupgestion: [''],
    clien_titre: [''],
    clien_nom: [''], // obligatoire si personne physique
    clien_prenom: [''], // obligatoire si personne physique
    clien_denomination: [''],  // obligatoire si personne morale
    clien_sigle: [''],   // obligatoire si personne morale
    clien_adressenumero: [''],
    clien_adresserue: [''],
    clien_adresseville: [''],
    clien_datenaissance: [''],
    clien_datesouscription1: [''],
    clien_categsocioprof: [''],
    clien_telephone1: [''],
    clien_telephone2: [''],
    clien_portable: [''],
    clien_fax: [''],
    clien_email: [''],   // obligatoire si personne morale
    clien_website: [''],
    clien_ninea: [''],    // obligatoire si personne morale
    clien_registrecommerce: [''],    // obligatoire si personne morale
    clien_codeorigine: [''],
    clien_sexe: [''],
    //clien_formejuridique: [''],   // obligatoire si personne morale
    clien_effectif: [''],
    clien_chiffreaffaireannuel: [''],
    clien_chiffreaffaireprime: [''],
    clien_chargesinistre: [''],
    clien_contactprinci: [''],
    clien_utilisateur: [''],
    clien_datemodification: [''],
    clien_anciennumero: [''],
    clien_CIN: [''],// obligatoire si personne physique
    clien_capital_social: [''],// obligatoire si personne morale
    clien_date_relation: [''],
    clien_secteur_activite: [''],// obligatoire si personne morale
    clien_status: [''],
    typetr: [''],
  });

  //clients: Array<Client> = new Array<Client>();
  listType: any[];
  listTypeSociete: any[];
  autorisation = [];
  @Input() listTypeclient: any[] = type;
  listeClients: Array<Client> = new Array<Client>();
  listeProspects: Array<Prospect> = new Array<Prospect>();
  listeClient: Boolean;
  cl: Number;
  trclient: any;
  trprospect: any;
  nature: any;
  //typeNature: boolean = false;
  listePolices: Array<Police> = new Array<Police>();
  // ================ Déclarations des variables pour la recherche avec filtre ======================

  //classifications: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();

  /** control for the selected classification */
  public clientsCtrl: FormControl = new FormControl();
  public prospectCtrl: FormControl = new FormControl();
  //public classifCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public clientsFilterCtrl: FormControl = new FormControl();
  public prospectsFilterCtrl: FormControl = new FormControl();
 //public classifFilterCtrl: FormControl = new FormControl();

 /** list of classifications filtered by search keyword */prospect
  public filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>();
  public filteredProspects: ReplaySubject<Prospect[]> = new ReplaySubject<Prospect[]>();
  //public filteredClassif: ReplaySubject<ClassificationSecteur[]> = new ReplaySubject<ClassificationSecteur[]>();

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  proposi: Number = 0;
  natureClient: any;
  typeNature: any;


  constructor(private fb: FormBuilder, private clientService: ClientService, private authService: NbAuthService,
    private transfertData: TransfertDataService, private router: Router,
    private prospectService: ProspectService, private policeService: PoliceService) { }

  ngOnInit(): void {

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          // console.log(this.autorisation);
        }

      });
    this.proposi = this.transfertData.getData() || 0;
      this.onGetAllClients();
    //this.onGetAllProspects();
    this.listType = this.listTypeclient['TYPE_CLIENT'];
    this.listTypeSociete = this.listTypeclient['TYPE_SOCIETE'];
    // =================== Listen for search field value changes =======================
    this.clientsFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterClients();
      });

    this.prospectsFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterProspects();
      });
    //this.onGetAllPolices();

  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterClients() {
    console.log(this.listeClients.filter(cl => cl.clien_nom));
    if (!this.listeClients) {
      return;
    }
    // get the search keyword
    let search = this.clientsFilterCtrl.value;
    if (!search) {
      this.filteredClients.next(this.listeClients.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredClients.next(
      this.listeClients.filter(cl => cl.clien_prenom?.toLowerCase().indexOf(search) > -1 ||
        cl.clien_denomination?.toLowerCase().indexOf(search) > -1 ||

        cl.clien_sigle?.toLowerCase().indexOf(search) > -1 ||
        cl.clien_nom?.toLowerCase().indexOf(search) > -1 ||
        cl.clien_numero.toString().indexOf(search) > -1
      ),

    );
  }

  protected filterProspects() {
    console.log(this.listeProspects.filter(cl => cl.prospc_nom));
    if (!this.listeProspects) {
      return;
    }
    // get the search keyword
    let search = this.prospectsFilterCtrl.value;
    if (!search) {
      this.filteredProspects.next(this.listeProspects.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredProspects.next(
      this.listeProspects.filter(cl => cl.prospc_prenom?.toLowerCase().indexOf(search) > -1 ||
        cl.prospc_denomination?.toLowerCase().indexOf(search) > -1 ||

        cl.prospc_sigle?.toLowerCase().indexOf(search) > -1 ||
        cl.prospc_nom?.toLowerCase().indexOf(search) > -1 ||
        cl.prospc_numero.toString().indexOf(search) > -1
      ),

    );
  }

  onGetAllProspects() {
    this.prospectService.getAllProspect()
      .subscribe((data: Prospect[]) => {
        this.listeProspects = data as Prospect[];
        this.filteredProspects.next(this.listeProspects.slice());
      });
  }

  onGetAllClients() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.listeClients = data as Client[];
        this.filteredClients.next(this.listeClients.slice());
      });
  }
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }
  
  onChangeNature(event) {
    //this.modifForm.controls['typetr'].setValue(event);
    console.log(event);
    if(this.proposi == 0){
      this.typeNature=="CL";
    }
    
    this.typeNature=event;
    console.log(this.typeNature);
    if(event=="PR"){
     // this.modifForm.controls['clientsCtrl'].setValue("");
      this.modifForm.controls['clien_nom'].setValue("");
      // tslint:disable-next-line:max-line-length
    this.modifForm.controls['clien_prenom'].setValue("");
    this.modifForm.controls['clien_telephone1'].setValue("");
    this.modifForm.controls['clien_email'].setValue("");
    //  this.modifForm.controls['clien_typeclient'].setValue((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_typeclient);
    this.modifForm.controls['clien_ninea'].setValue("");
    this.modifForm.controls['clien_registrecommerce'].setValue("");
    this.modifForm.controls['clien_denomination'].setValue("");
    this.modifForm.controls['clien_contactprinci'].setValue("");
    this.modifForm.controls['clien_typeclient'].setValue("");
      this.onGetAllProspects();
      this.typeNature=="PR";
      console.log(event);
      }else if(event=="CL"){
        this.modifForm.controls['clien_nom'].setValue("");
    // tslint:disable-next-line:max-line-length
    this.modifForm.controls['clien_prenom'].setValue("");
    this.modifForm.controls['clien_telephone1'].setValue("");
    this.modifForm.controls['clien_email'].setValue("");
    //  this.modifForm.controls['clien_typeclient'].setValue((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_typeclient);
    this.modifForm.controls['clien_ninea'].setValue("");
    this.modifForm.controls['clien_registrecommerce'].setValue("");
    this.modifForm.controls['clien_denomination'].setValue("");
    this.modifForm.controls['clien_contactprinci'].setValue("");
    this.modifForm.controls['clien_typeclient'].setValue("");
   
        this.onGetAllClients();
      this.typeNature=="CL";
      console.log(event);
    }
    
      console.log(event);
   
    //console.log(this.typeNature);
}

onChangeNumPR(event) {
    console.log(event.value);
    this.cl = event.value;
    this.modifForm.controls['clien_numero'].setValue(0+""+this.cl);
    // tslint:disable-next-line:semicolon
    // console.log(((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_telephone1));   clien_numeroprospect
    // tslint:disable-next-line:max-line-length
    this.modifForm.controls['clien_nom'].setValue(((this.listeProspects.find(p => p.prospc_numero == this.cl))?.prospc_nom));
    // tslint:disable-next-line:max-line-length
    this.modifForm.controls['clien_prenom'].setValue((this.listeProspects.find(p => p.prospc_numero == this.cl))?.prospc_prenom);
    this.modifForm.controls['clien_telephone1'].setValue((this.listeProspects.find(p => p.prospc_numero == this.cl))?.prospc_telephone1);
    this.modifForm.controls['clien_email'].setValue((this.listeProspects.find(p => p.prospc_numero == this.cl))?.prospc_email);
    //  this.modifForm.controls['clien_typeclient'].setValue((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_typeclient);
    this.modifForm.controls['clien_ninea'].setValue((this.listeProspects.find(p => p.prospc_numero == this.cl))?.prospc_ninea);
    this.modifForm.controls['clien_registrecommerce'].setValue((this.listeProspects.find(p => p.prospc_numero == this.cl))?.prospc_registrecommerce);
    this.modifForm.controls['clien_denomination'].setValue((this.listeProspects.find(p => p.prospc_numero == this.cl))?.prospc_denomination);
    this.modifForm.controls['clien_contactprinci'].setValue((this.listeProspects.find(p => p.prospc_numero == this.cl))?.prospc_portable);
    // this.type_client = this.cl + " : " + this.onGetLibelleByTypeClient(this.cl);
    //console.log(this.type_client);
    // tslint:disable-next-line:max-line-length
    //this.modifForm.controls['clien_typeclient'].setValue((this.listeProspect.find(p => p.prospc_numero == this.cl))?.clien_typeclient + ':' + this.onGetLibelleByTypeClient((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_typeclient));
    if ((this.listeProspects.find(p => p.prospc_numero == this.cl))?.prospc_nature == '1')
      this.natureClient = false;
    else
      this.natureClient = true;
    this.trprospect = this.listeProspects.find(p => p.prospc_numero == this.cl);
  }

  onChangeNumCL(event) {
    console.log(event.value);
    this.cl = event.value;
    this.modifForm.controls['clien_numero'].setValue(this.cl);
    console.log(0+""+this.cl);
    // tslint:disable-next-line:semicolon
    // console.log(((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_telephone1));
    // tslint:disable-next-line:max-line-length
    this.modifForm.controls['clien_nom'].setValue(((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_nom));
    // tslint:disable-next-line:max-line-length
    this.modifForm.controls['clien_prenom'].setValue((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_prenom);
    this.modifForm.controls['clien_telephone1'].setValue((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_telephone1);
    this.modifForm.controls['clien_email'].setValue((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_email);
    //  this.modifForm.controls['clien_typeclient'].setValue((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_typeclient);
    this.modifForm.controls['clien_ninea'].setValue((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_ninea);
    this.modifForm.controls['clien_registrecommerce'].setValue((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_registrecommerce);
    this.modifForm.controls['clien_denomination'].setValue((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_denomination);
    this.modifForm.controls['clien_contactprinci'].setValue((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_contactprinci);
    // this.type_client = this.cl + " : " + this.onGetLibelleByTypeClient(this.cl);
    //console.log(this.type_client);
    // tslint:disable-next-line:max-line-length
    console.log((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_typeclient + ':' + this.onGetLibelleByTypeClient((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_typeclient));
    this.modifForm.controls['clien_typeclient'].setValue((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_typeclient /* + ':' + this.onGetLibelleByTypeClient((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_typeclient )*/);
    if ((this.listeClients.find(p => p.clien_numero == this.cl))?.clien_nature == '1')
      this.natureClient = false;
    else
      this.natureClient = true;
    this.trclient = this.listeClients.find(p => p.clien_numero == this.cl);
  }
  onGetLibelleByTypeClient(type: String) {
    //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)

    return (this.listType.find(p => p.id === type))?.value;
  }

  // findContrat() {

  //   if ((this.listePolices.filter(p => p.poli_client == this.cl)).length == 0) {

  //     this.transfertData.setData(this.trclient);
  //     this.router.navigateByUrl('home/parametrage-production/police/ajout');
  //   }
  //   else {
  //     this.transfertData.setData(this.cl);
  //     this.router.navigateByUrl('home/parametrage-production/police');
  //   }

  // }
  findContrat() {
    this.transfertData.setData(this.trclient);
    this.router.navigateByUrl('home/parametrage-production/police/ajout');

  }
  findContrat2() {
    this.transfertData.setData({ client: this.trclient, type: 1 });
    this.router.navigateByUrl('home/parametrage-production/police/ajout-police');

  }
  proposition() {
    this.transfertData.setData({ client: this.trclient, type: 2, prospect: this.trprospect});
    this.router.navigateByUrl('home/parametrage-production/police/ajout-police');

  }

  onGetAllPolices() {
    this.policeService.getAllPolice()
      .subscribe((data: Police[]) => {
        this.listePolices = data;
      });
  }

}
