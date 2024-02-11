import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogRef, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CategorieSocioprofessionnelle } from '../../../model/CategorieSocioprofessionnelle';
import { Civilite } from '../../../model/Civilite';
import { ClassificationSecteur } from '../../../model/ClassificationSecteur';
import { Client } from '../../../model/Client';
import { Groupe } from '../../../model/Groupe';
import { CategorieService } from '../../../services/categorie.service';
import { CategorieSocioprofessionnelleService } from '../../../services/categorieSocioProfessionnelle.service';
import { CiviliteService } from '../../../services/civilite.service';
import { ClassificationSecteurService } from '../../../services/classification-secteur.service';
import { ClientService } from '../../../services/client.service';
import { GroupeService } from '../../../services/groupe.service';
import { TransfertDataService } from '../../../services/transfertData.service';
import { saveAs } from 'file-saver';
import type from '../../data/type.json';
import { HttpEventType } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { User } from '../../../model/User';
import { ProspectService } from '../../../services/prospect.service';
import { Prospect } from '../../../model/Prospect';

@Component({
  selector: 'ngx-gestion-client-reprise',
  templateUrl: './gestion-client-reprise.component.html',
  styleUrls: ['./gestion-client-reprise.component.scss']
})
export class GestionClientRepriseComponent implements OnInit {

  clients: Array<Client> = new Array<Client>();
  categories: Array<CategorieSocioprofessionnelle> = new Array<CategorieSocioprofessionnelle>();
  groupes: Array<Groupe> = new Array<Groupe>();
  civilite: Array<Civilite> = new Array<Civilite>();
  secteurs: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();

  client: Client;
  @Input() listTypeclient: any[] = type;
  @Input() listeModeGouver: any[] = type;
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
  clien_datesouscription1: Date;
  clien_categsocioprof: Number;
  clien_telephone1: String;
  clien_telephone2: String;
  clien_portable: String;
  clien_fax: String;
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

  public displayedColumns = ['clien_numero', 'clien_nom', 'clien_prenom', 'clien_activitecommercante', /*'clien_typeclient', 'clien_denomination','clien_sigle','clien_email','clien_ninea','clien_registrecommerce','clien_typesociete',*/ 'action' /*'details', 'update', 'addContact', 'dossier', 'delete'*/];

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
  listeModeGouvernance: any[];
  typePersonneChoisi: String;
  personnePhysique = "1";
  personneMorale = "2";
  civiliteNature: String;
  statusValide = "1";
  statusEnattente = "2";
  OUI = "1";
  NON = "2";

  // Variables booléan pour gerer l'affichage du détail selon le type de la personne choisie
  problemePersonnePhysique: boolean = false;
  problemePersonneMorale: boolean = false;
  problemePersonnePhysiCivilite: boolean = false;


  // status: NbComponentStatus = 'info';

  // title = 'La_liste_des_clients_(par_ordre_de_numéro)';
  title = 'La liste des clients (par ordre de numéro)';
  login_demandeur: string;
  demandeur: string;
  user: User;
  prospect: Prospect;
  infoProspect: any = "";
  afficheInfoProspectTransforme: boolean = false;

  constructor(private clientService: ClientService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private authService: NbAuthService,
    private groupeService: GroupeService,
    private civiliteService: CiviliteService,
    private secteurService: ClassificationSecteurService,
    private categorieService: CategorieSocioprofessionnelleService,
    private userService: UserService,
    private router: Router,
    private transfertData: TransfertDataService,
    private prospectService: ProspectService) { }

  ngOnInit(): void {
    this.onGetALlClient();
    this.onGetAllCategorieSocio();
    this.onGetAllGroupe();
    this.onGetAllCivilite();
    this.onGetAllSecteurs();
    this.listTypes = this.listTypeclient['TYPE_CLIENT'];
    this.listTypeSociete = this.listTypeclient['TYPE_SOCIETE'];
    this.listeModeGouvernance = this.listeModeGouver['MODE_GOUVERNANCE'];

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          // console.log(this.autorisation);

          this.login_demandeur = token.getPayload().sub;
          this.onGetUser(this.login_demandeur);
        }
      });

  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  affiche: boolean;

  onGetALlClient() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.clients = data;
        this.dataSource.data = data as Client[];
        // console.log(data)
        // this.affiche = false;
        console.log(this.dataSource.data)
      });
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        // this.demandeur = this.user.util_prenom + " "+ "lamine" + " " + this.user.util_nom;
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
        // this.demandeur = this.demandeur.replace(/ /g, "_") ;
      });
  }

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

  onGetLibelleByNaturePersonne(numero: any) {
    if (numero === this.personnePhysique) {
      return 'Personne physique';
    } else if (numero === this.personneMorale) {
      return 'Personne morale';
    }
  }

  onGetLibelleByActiviteCommercante(numero: any) {
    if (numero === this.OUI) {
      return 'OUI';
    } else if (numero === this.NON) {
      return 'NON';
    }
  }

  onGetSeparation(var1: any, var2: any) {
    if (var1 !== null && var1 !== '' && var2 !== null && var2 !== '') {
      return '/'
    } else {
      return '';
    }
  }

  onGetAllGroupe() {
    this.groupeService.getAllGroupes()
      .subscribe((data: Groupe[]) => {
        this.groupes = data;
        this.listGroupes = data as Groupe[];
      });
  }

  onGetProspectByNumero(numero: Number) {
    this.prospectService.getProspectByNumero(numero)
      .subscribe((data) => {
        if (data.message === "ok") {
          this.prospect = data.data;

          if (this.prospect.prospc_nature === "1") {
            this.infoProspect = numero + " : " + this.prospect.prospc_prenom + " " + this.prospect.prospc_nom;
            this.afficheInfoProspectTransforme = true;

          } else if (this.prospect.prospc_nature === "2") {
            this.infoProspect = numero + " : " + this.prospect.prospc_denomination;
            this.afficheInfoProspectTransforme = true;
          }

        } else {

          this.afficheInfoProspectTransforme = false;
        }
      });
  }

  open(dialog: TemplateRef<any>, client: Client) {
    this.typePersonneChoisi = client.clien_nature;
    this.civiliteNature = client.clien_titre;
    if (this.typePersonneChoisi === this.personnePhysique) {
      this.problemePersonnePhysique = true;
      this.problemePersonneMorale = false;
      this.problemePersonnePhysiCivilite = false;
      if (this.civiliteNature == "23") {
        // this.problemePersonnePhysiCivilite = true ;
        this.problemePersonnePhysique = false;
        this.problemePersonneMorale = true;
        this.problemePersonnePhysiCivilite = true;
        this.erreur = false;
      }
    }
    else if (this.typePersonneChoisi === this.personneMorale) {
      this.problemePersonneMorale = true;
      this.problemePersonnePhysique = false;
      this.problemePersonnePhysiCivilite = false;

    }

    this.onGetProspectByNumero(client.clien_numeroprospect);

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

  openAjout() {
    this.router.navigateByUrl('/home/gestion-client/ajout');
  }

  openAjoutContact(client: any) {
    this.transfertData.setData(client.clien_numero);
    this.router.navigateByUrl('/home/contact');

  }

  //birane

  openDossier(client: any) {
    this.transfertData.setData(client);
    this.router.navigateByUrl('/home/dossiers');

  }

  open360(client: Client) {

    this.transfertData.setData(client);
    this.router.navigateByUrl('/home/gestion-client/detailclient');

  }

  openModif(client: Client) {

    this.transfertData.setData(client);
    this.router.navigateByUrl('/home/gestion-client-reprise/modif');

  }

  openClientAttente() {

    this.router.navigateByUrl('/home/gestion-client/client-attente');
  }

  // Metodes permettant de faire la suppression d'un client
  openTestDel(dialogEchec: TemplateRef<any>, dialogDel: TemplateRef<any>, client: Client) {

    this.clientService.verifDeleteClient(client.clien_numero).subscribe((data) => {
      this.dialogService.open(
        dialogDel,
        { context: client });

    },
      (error) => {
        this.dialogService.open(
          dialogEchec);
      });
  }

  redirectToDelete(num: Number) {
    this.clientService.deleteClient(num)
      .subscribe(() => {
        this.toastrService.show(
          'client supprimé avec succès !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
        this.onGetALlClient();
      },
        (error) => {
          this.toastrService.show(
            error.error.message,
            'Notification d\'erreur',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
        });
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;

  }

  onGetLibelleByTypeClient(type: String) {

    return type + " : " + (this.listTypes.find(p => p.id === type))?.value;
  }
  onGetLibelleByTypeSociete(type: String) {
    //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)

    return (this.listTypeSociete.find(p => p.id === type))?.value;
  }

  onGetLibelleByModeGouvernance(type: String) {

    return (this.listeModeGouvernance.find(p => p.id === type))?.value;
  }

  onGetLibelleByCategorie(categorie: String) {

    return (this.listCategoriSocio.find(p => p.categs_code === categorie))?.categs_libcourt;
  }
  onGetLibelleBySecteur(secteur: any) {
    if (secteur === null || secteur === '') {
      return '';
    } else {
      return secteur + " : " + (this.listSecteurs.find(s => s.code == secteur))?.libelle;
    }
  }

  onGetLibelleByGroupe(groupe: number) {
    return (this.listGroupes.find(p => p.group_code == groupe))?.group_liblong;
  }

  onGetLibelleByCivilite(civilite: any) {
    return (this.listCivilite?.find(p => p.civ_code == civilite))?.civ_libellelong;
  }

  onGetLibelleByStatus(status: String) {
    if (status == this.statusValide) {
      return "Valide";
    } else if (status == this.statusEnattente) {
      return "En attente";
    }
  }

}
