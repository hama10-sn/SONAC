import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { NbGlobalPosition, NbGlobalPhysicalPosition, NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';

import { CategorieSocioprofessionnelle } from '../../../../../model/CategorieSocioprofessionnelle';
import { Civilite } from '../../../../../model/Civilite';
import { ClassificationSecteur } from '../../../../../model/ClassificationSecteur';
import { Client } from '../../../../../model/Client';
import { Groupe } from '../../../../../model/Groupe';
import { User } from '../../../../../model/User';
import { CategorieSocioprofessionnelleService } from '../../../../../services/categorieSocioProfessionnelle.service';
import { CiviliteService } from '../../../../../services/civilite.service';
import { ClassificationSecteurService } from '../../../../../services/classification-secteur.service';
import { ClientService } from '../../../../../services/client.service';
import { GroupeService } from '../../../../../services/groupe.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { UserService } from '../../../../../services/user.service';
import { saveAs } from 'file-saver';
import type from '../../../../data/type.json';

@Component({
  selector: 'ngx-client360',
  templateUrl: './client360.component.html',
  styleUrls: ['./client360.component.scss']
})
export class Client360Component implements OnInit {

  clients: Array<Client> = new Array<Client>();
  categories: Array<CategorieSocioprofessionnelle> = new Array<CategorieSocioprofessionnelle>();
  groupes: Array<Groupe> = new Array<Groupe>();
  civilite: Array<Civilite> = new Array<Civilite>();
  secteurs: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();

  client: Client;
  @Input() listTypeclient: any[] = type;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  clien_numero: Number;
  clien_typeclient: String;
  clien_numerosolvabilite: Number;
  clien_nature: String;
  clien_typesociete: Number;
  clien_coderegroupgestion: Number;
  clien_titre: String;
  clien_nom: String;
  clien_prenom: String;
  clien_denomination: String;
  clien_sigle: String;
  clien_adressenumero: String;
  clien_adresserue: String;
  clien_adresseville: String;
  clien_datenaissance: Date;
  // clien_datesouscription1: Date;
  clien_categsocioprof: Number;
  clien_telephone1: String;
  clien_telephone2: String;
  clien_portable: String;
  // clien_fax: String;
  clien_email: String;
  clien_website: String;
  clien_ninea: String;
  clien_registrecommerce: String;
  clien_codeorigine: String;
  clien_sexe: String;
  clien_CIN: String;// obligatoire si personne physique
  clien_capital_social: Number;// obligatoire si personne morale
  clien_date_relation: Date;
  clien_secteur_activite: Number;// obligatoire si personne morale

  erreur: boolean = false;

  public displayedColumns = ['clien_numero', 'clien_typeclient', 'clien_nom',/*'clien_denomination','clien_sigle','clien_email','clien_ninea','clien_registrecommerce','clien_typesociete',*/ 'clien_prenom', 'clien_status', '360', 'details'];
  public displayedColumnsMoral = ['clien_numero', 'clien_denomination', 'clien_sigle', 'clien_email', 'clien_ninea', 'clien_registrecommerce', 'clien_typesociete', 'details', 'update', 'addContact', 'dossier', 'delete'];


  public dataSource = new MatTableDataSource<Client>();
  public dataSourceClientPhysique = new MatTableDataSource<Client>();
  public dataSourceClientMorale = new MatTableDataSource<Client>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort) sort1: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginator1: MatPaginator;
  autorisation = [];
  listTypes: any[];
  listTypeSociete: any[];
  listCategoriSocio: any[];
  listGroupes: any[];
  listCivilite: any[];
  listSecteurs: any[];
  typePersonneChoisi: String;
  personnePhysique = "1";
  personneMorale = "2";
  civiliteNature: String;
  statusEncours = "1";
  statusEnattente = "2";

  // Variables booléan pour gerer l'affichage du détail selon le type de la personne choisie
  problemePersonnePhysique: boolean = false;
  problemePersonneMorale: boolean = false;
  problemePersonnePhysiCivilite: boolean = false;


  // status: NbComponentStatus = 'info';

   title = 'La liste des clients ' ;
   login_demandeur: string ;
   demandeur: string ;
   user: User ;

  constructor(private clientService: ClientService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private authService: NbAuthService,
    private groupeService: GroupeService,
    private civiliteService: CiviliteService,
    private secteurService: ClassificationSecteurService,
    private categorieService: CategorieSocioprofessionnelleService,
    private userService: UserService,
    private router: Router, private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    this.onGetALlClient();
    this.onGetAllCategorieSocio();
    this.onGetAllGroupe();
    this.onGetAllCivilite();
    this.onGetAllSecteurs();
    this.listTypes = this.listTypeclient['TYPE_CLIENT'];
    this.listTypeSociete = this.listTypeclient['TYPE_SOCIETE'];

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          // console.log(this.autorisation);

          this.login_demandeur = token.getPayload().sub ;
          this.onGetUser(this.login_demandeur) ;
        }



      });

  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    //this.dataSourceClientPhysique.sort=this.sort;
    //this.dataSourceClientMorale.sort=this.sort1;
    this.dataSource.paginator = this.paginator;
    //this.dataSourceClientPhysique.paginator = this.paginator;
    //this.dataSourceClientMorale.paginator = this.paginator1;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  // public doFilterClientPhysic = (value: string) => {
  //   this.dataSourceClientPhysique.filter = value.trim().toLocaleLowerCase();
  // }

  // public doFilterClientMoral = (value: string) => {
  //   this.dataSourceClientMorale.filter = value.trim().toLocaleLowerCase();
  // }
  onGetALlClient() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.clients = data;
        this.dataSource.data = data as Client[];
        console.log(this.clients);
      });
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom ;
      });
  }

  // onGetNomByUser(numero:String){
  //   return  (this.users.find(u => u.util_numero === numero))?.util_nom ;       
  // }
  onGetAllCiviliteByNature(nature: number) {
    this.civiliteService.getAllCiviliteByNature(nature)
      .subscribe((data: Civilite[]) => {
        this.civilite = data;
        this.listCivilite = data as Civilite[];
      });
  }

  onGetAllSecteurs() {
    this.secteurService.getAllClassificationSecteur()
      .subscribe((data: ClassificationSecteur[]) => {
        this.secteurs = data;
        this.listSecteurs = data as ClassificationSecteur[];
      });
  }
  onGetAllCivilite() {
    this.civiliteService.getAllCivilite()
      .subscribe((data: Civilite[]) => {
        this.civilite = data;
        this.listCivilite = data as Civilite[];
      });
  }

  onGetAllCategorieSocio() {
    this.categorieService.getAllCategorieSocioprofessionnelle()
      .subscribe((data: CategorieSocioprofessionnelle[]) => {
        this.categories = data;
        this.listCategoriSocio = data as CategorieSocioprofessionnelle[];
      });
  }
  // onGetALlClientPhysique() {
  //   this.clientService.getAllClientPhysique()
  //     .subscribe((data: Client[]) => {
  //         this.clients = data;
  //         this.dataSourceClientPhysique.data = data as Client[];
  //         console.log("clients physique"+this.clients);

  //     });
  // }

  // onGetALlClientMorale() {
  //   this.clientService.getAllClientMorale()
  //     .subscribe((data: Client[]) => {
  //         this.clients = data;
  //         this.dataSourceClientMorale.data = data as Client[];
  //         console.log("clients morale"+this.clients);
  //     });
  // }

  onGetLibelleByNaturePersonne(numero: any) {
    if (numero === this.personnePhysique) {
      return 'Personne physique';
    } else if (numero === this.personneMorale) {
      return 'Personne morale';
    }
  }
  onGetAllGroupe() {
    this.groupeService.getAllGroupes()
      .subscribe((data: Groupe[]) => {
        this.groupes = data;
        this.listGroupes = data as Groupe[];
      });
  }
  open(dialog: TemplateRef<any>, client: Client) {
    this.typePersonneChoisi = client.clien_nature;
    this.civiliteNature = client.clien_titre;
    console.log(typeof (this.civiliteNature));
    if (this.typePersonneChoisi === this.personnePhysique) {
      this.problemePersonnePhysique = true;
      this.problemePersonneMorale = false;
      this.problemePersonnePhysiCivilite = false;
      if (this.civiliteNature == "23") {
        console.log("OUIII");
        // this.problemePersonnePhysiCivilite = true ;
        this.problemePersonnePhysique = false;
        this.problemePersonneMorale = false;
        this.problemePersonnePhysiCivilite = true;
        this.erreur = false;
      }
    }
    else if (this.typePersonneChoisi === this.personneMorale) {
      this.problemePersonneMorale = true;
      this.problemePersonnePhysique = false;
      this.problemePersonnePhysiCivilite = false;

    }

    this.dialogService.open(
      dialog,
      {
        context: client,
      });
  }
  onOpen(dialog: TemplateRef<any>, client: Client) {
    this.dialogService.open(
      dialog,

      { context: client },

    );
  }

  
  open360(client: Client) {

    this.transfertData.setData(client);
    console.log(client);
    this.router.navigateByUrl('/home/gestion-client/detailclient');

  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;

  }
  

  onGetLibelleByTypeClient(type: String) {

    return (this.listTypes.find(p => p.id === type))?.value;
  }
  onGetLibelleByTypeSociete(type: String) {
    //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)

    return (this.listTypeSociete.find(p => p.id === type))?.value;
  }

  onGetLibelleByCategorie(categorie: String) {
    //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)

    return (this.listCategoriSocio.find(p => p.categs_code === categorie))?.categs_libcourt;
  }
  onGetLibelleBySecteur(secteur: any) {
    //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)
    console.log(this.listSecteurs);
    return (this.listSecteurs.find(s => s.code == secteur))?.libelle;
  }

  onGetLibelleByGroupe(groupe: number) {
    return (this.listGroupes.find(p => p.group_code == groupe))?.group_liblong;
  }

  onGetLibelleByCivilite(civilite: any) {
    console.log(this.listCivilite);
    return (this.listCivilite?.find(p => p.civ_code == civilite))?.civ_libellelong;
  }

  onGetLibelleByStatus(status: String) {
    if (status == this.statusEncours) {
      return "Valide";
    } else if (status == this.statusEnattente) {
      return "En attente";
    }
  }

  }
