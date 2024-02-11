import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';

import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CategorieSocioprofessionnelle } from '../../../../../model/categorieSocioprofessionnelle';
import { Civilite } from '../../../../../model/Civilite';
import { Client } from '../../../../../model/Client';
import { User } from '../../../../../model/User';
import { CategorieSocioprofessionnelleService } from '../../../../../services/categorieSocioProfessionnelle.service';
import { CiviliteService } from '../../../../../services/civilite.service';
import { ClientService } from '../../../../../services/client.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { UserService } from '../../../../../services/user.service';
import type from '../../../../data/type.json';
import { GroupeService } from '../../../../../services/groupe.service';
import { Groupe } from '../../../../../model/Groupe';
import { ClassificationSecteurService } from '../../../../../services/classification-secteur.service';
import { ClassificationSecteur } from '../../../../../model/ClassificationSecteur';
import dateFormatter from 'date-format-conversion';


@Component({
  selector: 'ngx-detail-client',
  templateUrl: './detail-client.component.html',
  styleUrls: ['./detail-client.component.scss']
})
export class DetailClientComponent implements OnInit {

  modifForm = this.fb.group({
    client_id: [''],
    clien_numero: [''],
    clien_typeclient: [''],
    clien_numerosolvabilite: [''],
    clien_nature: [''],
    clien_typesociete: [''], // obligatoire si personne morale
    clien_coderegroupgestion: [''],
    clien_titre: ['', [Validators.required]],
    clien_nom: [''], // obligatoire si personne physique
    clien_prenom: [''], // obligatoire si personne physique
    clien_denomination: [''],  // obligatoire si personne morale
    clien_sigle: [''],   // obligatoire si personne morale
    clien_adressenumero: ['', [Validators.required]],
    clien_adresserue: [''],
    clien_adresseville: ['', [Validators.required]],
    clien_datenaissance: [''],
    // clien_datesouscription1: [''],
    clien_categsocioprof: ['', [Validators.required]],
    clien_telephone1: ['', [Validators.required]],
    clien_telephone2: [''],
    clien_portable: ['', [Validators.required]],
    // clien_fax: [''],
    clien_email: ['', [ Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],   // obligatoire si personne morale
    clien_website: [''],
    clien_ninea: [''],    // obligatoire si personne morale
    clien_registrecommerce: [''],    // obligatoire si personne morale
    clien_codeorigine: ['',],
    clien_sexe: [''],
    //clien_formejuridique: [''],   // obligatoire si personne morale
    clien_effectif: [''],
    clien_chiffreaffaireannuel: [''],
    clien_chiffreaffaireprime: ['', [Validators.required]],
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

  });



  typePersonneChoisi: any;
  personnePhysique = "1";
  personneMorale = "2";
  contactPrincip: string;
  telephone1: string;
  portable: string;
  typeSociete: any;
  code_secteur: any;

  // Variables booléan pour gerer le problème de controle de saisi
  

  // Vider le champs titre civilité quand on change nature personne:
  clien_titreCivilite: any;

  // Les variables à gerer pour type personne = personne physique
  prenom: string;
  nom: string;
  gerant = "23";

  // Les variables à gerer pour type personne = personne morale
  denomination: string;
  sigle: string;
  site: string;
  codeNinea: string;
  registreCommerce: string;
  telephone: string;
  adresse: string;
  email: string;



  categorie: CategorieSocioprofessionnelle;
  civilite: Civilite;
  listCivilite: any[];
  listCategoriSocio: any[];
  listType: any[];
  listTypeSociete: any[];
  listGroupes: any[];
  listesecteurs: any[];

  //listecodecimacomp: Cimacodificationcompagnie [];

  login: any;
  user: User;

  categories: Array<CategorieSocioprofessionnelle> = new Array<CategorieSocioprofessionnelle>();
  civilites: Array<Civilite> = new Array<Civilite>();
  clients: Array<Client> = new Array<Client>();
  groupes: Array<Groupe> = new Array<Groupe>();
  secteurs: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();

  type_client: String;
  code_Civilite: String;
  code_categorie: String;
  code_typeSociete: any;
  natureClient: Boolean;
  code_groupe: String;
  civiliteNature: String;
  cliendatenaissance: Date;
  cliensouscription: Date;
  numRue: any;
  ville: string;
  civile: string;
  cin: string;
  code_sexe: any;
  value_status: String;
  client_status: String;

  client: Client;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  autorisation = [];
  listeClients: any[];
  listeClients2: any[];

  numClient: any ;

  @Input() listTypeclient: any[] = type;
  constructor(private fb: FormBuilder,
    private categorieService: CategorieSocioprofessionnelleService, private clientService: ClientService,
    private userService: UserService,
    private civiliteService: CiviliteService,
    private groupeService: GroupeService,
    private secteurService: ClassificationSecteurService,
    private authService: NbAuthService,
    private router: Router,
    private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          console.log(this.autorisation);
        }

      });


    this.client = this.transfertData.getData();
    this.onGetAllClients2();
    this.onGetAllCategorieSocio();
    console.log(this.client);
    
    this.onGetAllGroupe();
    this.getlogin();

   // this.client =  this.transfertData.getData();
    this.numClient = this.client.clien_numero;

console.log(this.numClient);
    this.listType = this.listTypeclient['TYPE_CLIENT'];
    this.listTypeSociete = this.listTypeclient['TYPE_SOCIETE'];

    this.modifForm.controls['clien_numero'].setValue(this.client.clien_numero);
    this.type_client = this.client.clien_typeclient + " : " + this.onGetLibelleByTypeClient(this.client.clien_typeclient);
    console.log(this.type_client);
    this.modifForm.controls['clien_typeclient'].setValue(this.type_client);

    this.modifForm.controls['clien_numerosolvabilite'].setValue(this.client.clien_numerosolvabilite);

    if (this.client.clien_nature == this.personnePhysique) {

      this.natureClient = false;
      console.log(this.natureClient);


    } else if (this.client.clien_nature == this.personneMorale) {

      this.natureClient = true;
      console.log(this.natureClient);
    }

    // this.modifForm.controls['prospc_nature'].setValue(this.prospect.prospc_nature);
    this.modifForm.controls['clien_nature'].setValue(this.client.clien_nature);
    // this.code_natureClient =this.onGetLibelleByNaturePersonne(this.client.clien_nature);
    this.typePersonneChoisi = this.client.clien_nature;
    this.civiliteNature = this.client.clien_titre;
    console.log(this.client.clien_nature);
    this.modifForm.controls['clien_coderegroupgestion'].setValue(this.client.clien_coderegroupgestion);
    this.code_groupe = this.client?.clien_coderegroupgestion?.toString();

    this.onGetAllCiviliteByNature(Number(this.typePersonneChoisi));
    this.modifForm.controls['clien_titre'].setValue(this.client.clien_titre);
    this.code_Civilite = this.client.clien_titre.toString();
    console.log(this.code_Civilite);
    this.modifForm.controls['clien_nom'].setValue(this.client.clien_nom);
    this.modifForm.controls['clien_prenom'].setValue(this.client.clien_prenom);
    this.modifForm.controls['clien_denomination'].setValue(this.client.clien_denomination);
    this.modifForm.controls['clien_sigle'].setValue(this.client.clien_sigle);
    this.modifForm.controls['clien_adressenumero'].setValue(this.client.clien_adressenumero);
    this.modifForm.controls['clien_adresserue'].setValue(this.client.clien_adresserue);
    this.modifForm.controls['clien_adresseville'].setValue(this.client.clien_adresseville);
    // this.modifForm.controls['clien_datenaissance'].setValue(this.cliendatenaissance);
    //this.modifForm.controls['clien_datesouscription1'].setValue(this.cliensouscription);
    this.modifForm.controls['clien_categsocioprof'].setValue(this.client.clien_categsocioprof);
    this.code_categorie = this.client?.clien_categsocioprof?.toString();
    this.modifForm.controls['clien_telephone1'].setValue(this.client.clien_telephone1);
    this.modifForm.controls['clien_telephone2'].setValue(this.client.clien_telephone2);
    this.modifForm.controls['clien_portable'].setValue(this.client.clien_portable);

    // this.modifForm.controls['clien_telephone1'].setValue(this.modifForm.controls['clien_telephone1'].value.internationalNumber);
    // this.modifForm.controls['clien_telephone2'].setValue(this.modifForm.controls['clien_telephone2'].value?.internationalNumber);
    // this.modifForm.controls['clien_portable'].setValue(this.modifForm.controls['clien_portable'].value?.internationalNumber);

    // this.modifForm.controls['clien_fax'].setValue(this.client.clien_fax);
    this.modifForm.controls['clien_website'].setValue(this.client.clien_website);
    this.modifForm.controls['clien_email'].setValue(this.client.clien_email);
    this.modifForm.controls['clien_ninea'].setValue(this.client.clien_ninea);
    this.modifForm.controls['clien_registrecommerce'].setValue(this.client.clien_registrecommerce);

    this.modifForm.controls['clien_status'].setValue(this.client.clien_status);
    if (this.client.clien_status != null) {
      this.value_status = this.client.clien_status.toString();
    }

    this.modifForm.controls['clien_codeorigine'].setValue(this.client.clien_codeorigine);
    this.modifForm.controls['clien_sexe'].setValue(this.client.clien_sexe);
    this.code_sexe = this.client.clien_sexe.toString();
    //  this.modifForm.controls['clien_formejuridique'].setValue(this.client.clien_fax);
    this.modifForm.controls['clien_effectif'].setValue(this.client.clien_effectif);
    this.modifForm.controls['clien_chiffreaffaireannuel'].setValue(this.client.clien_chiffreaffaireannuel);
    this.modifForm.controls['clien_chiffreaffaireprime'].setValue(this.client.clien_chiffreaffaireprime);
    this.modifForm.controls['clien_chargesinistre'].setValue(this.client.clien_chargesinistre);
    this.modifForm.controls['clien_contactprinci'].setValue(this.client.clien_contactprinci);
    this.modifForm.controls['clien_anciennumero'].setValue(this.client.clien_anciennumero);
    //console.log(this.client.clien_CIN);
    this.modifForm.controls['clien_CIN'].setValue(this.client.clien_CIN);
    this.modifForm.controls['clien_date_relation'].setValue(dateFormatter(this.client.clien_date_relation, 'yyyy-MM-ddThh:mm'));
    this.modifForm.controls['clien_capital_social'].setValue(this.client.clien_capital_social);
  //  this.modifForm.controls['clien_secteur_activite'].setValue(this.client?.clien_secteur_activite);
    this.code_secteur = this.client?.clien_secteur_activite?.toString();

    // tslint:disable-next-line:max-line-length
    this.modifForm.controls['clien_typesociete'].setValue((this.listTypeSociete.find(p => p.id == this.client?.clien_typesociete))?.value);
   // console.log((this.listTypeSociete.find(p => p.id == this.client?.clien_typesociete))?.value);
   // console.log('999' + this.client?.clien_typesociete);

   this.onGetAllSecteurs();
  }
  onGetLibelleByTypeClient(type: String) {
    //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)

    return (this.listType.find(p => p.id === type))?.value;
  }
  onGetAllCategorieSocio() {
    this.categorieService.getAllCategorieSocioprofessionnelle()
      .subscribe((data: CategorieSocioprofessionnelle[]) => {
        this.categories = data;
        this.listCategoriSocio = data as CategorieSocioprofessionnelle[];
      });
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;

  }

  onGetAllCiviliteByNature(nature: number) {
    this.civiliteService.getAllCiviliteByNature(nature)
      .subscribe((data: Civilite[]) => {
        this.listCivilite = data as Civilite[];
      });
  }
  onGetAllGroupe() {
    this.groupeService.getAllGroupes()
      .subscribe((data: Groupe[]) => {
        this.groupes = data;
        this.listGroupes = data as Groupe[];
      });
  }
  onGetAllClients() {
    this.clientService.getAllClientPhysique()
      .subscribe((data: Client[]) => {
        this.clients = data;
        this.listeClients = data as Client[];
      });
  }

  onGetAllClients2() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.listeClients2 = data as Client[];
      });
  }

    onGetLibelleByNaturePersonne(numero: any) {
    if (numero === this.personnePhysique) {
      return 'Personne physique';
    } else if (numero === this.personneMorale) {
      return 'Personne morale';
    }
  }

  
  cancel() {
    this.router.navigateByUrl('/home/gestion-client/client360');
    // this.ref.close();
  }
  onGetAllSecteurs() {
    this.secteurService.getAllClassificationSecteur()
      .subscribe((data: ClassificationSecteur[]) => {
        this.secteurs = data;
        this.listesecteurs = data as ClassificationSecteur[];
        // tslint:disable-next-line:max-line-length
        this.modifForm.controls['clien_secteur_activite'].setValue((this.listesecteurs.find(p => p.code === this.client?.clien_secteur_activite))?.libelle);
      });
  }
  onGetLibelleByCivilite(civilite: number) {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.onGetAllCiviliteByNature(Number(this.typePersonneChoisi));
    console.log(this.listCivilite);
    return (this.listCivilite.find(p => p.civ_code === civilite))?.civ_libellelong;
  }
  onGetLibelleByTypeSociete(type: String) {
    //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)
    return (this.listTypeSociete.find(p => p.id === type))?.value;
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


  
  }
