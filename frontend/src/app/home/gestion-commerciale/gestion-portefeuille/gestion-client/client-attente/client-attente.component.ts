import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogRef, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CategorieSocioprofessionnelle } from '../../../../../model/CategorieSocioprofessionnelle';
import { Civilite } from '../../../../../model/Civilite';
import { ClassificationSecteur } from '../../../../../model/ClassificationSecteur';
import { Client } from '../../../../../model/Client';
import { Groupe } from '../../../../../model/Groupe';
import { CategorieSocioprofessionnelleService } from '../../../../../services/categorieSocioProfessionnelle.service';
import { CiviliteService } from '../../../../../services/civilite.service';
import { ClassificationSecteurService } from '../../../../../services/classification-secteur.service';
import { ClientService } from '../../../../../services/client.service';
import { GroupeService } from '../../../../../services/groupe.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import type from '../../../../data/type.json';

@Component({
  selector: 'ngx-client-attente',
  templateUrl: './client-attente.component.html',
  styleUrls: ['./client-attente.component.scss']
})
export class ClientAttenteComponent implements OnInit {

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

  erreur: boolean = false;

  public displayedColumns = ['clien_numero', 'clien_typeclient', 'clien_nom',/*'clien_denomination','clien_sigle','clien_email','clien_ninea','clien_registrecommerce','clien_typesociete',*/ 'clien_prenom', 'details', 'update', 'delete'];
  // public displayedColumnsMoral = ['clien_numero', 'clien_denomination', 'clien_sigle', 'clien_email', 'clien_ninea', 'clien_registrecommerce', 'clien_typesociete', 'details', 'update', 'addContact', 'dossier', 'delete'];


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

  constructor(private clientService: ClientService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private authService: NbAuthService,
    private groupeService: GroupeService,
    private civiliteService: CiviliteService,
    private secteurService: ClassificationSecteurService,
    private categorieService: CategorieSocioprofessionnelleService,
    private router: Router, private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    this.onGetAllClientAttente();
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
          console.log(this.autorisation);
        }

      });

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onGetAllClientAttente() {
    this.clientService.getAllClientsAttente()
      .subscribe((data: Client[]) => {
        this.clients = data;
        this.dataSource.data = data as Client[];
        console.log(this.clients);
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

  // openAjout() {
  //   this.router.navigateByUrl('/home/gestion-client/ajout');
  // }

  // openAjoutContact(client: any) {
  //   this.transfertData.setData(client.clien_numero);
  //   this.router.navigateByUrl('/home/contact');
  // }

  //birane

  // openDossier(client: any) {
  //   this.transfertData.setData(client);
  //   this.router.navigateByUrl('/home/dossiers');

  // }

  openModif(client: Client) {

    this.transfertData.setData(client);
    console.log(client);
    this.router.navigateByUrl('/home/gestion-client/modif');
  }

  // openClientAttente() {
    
  //   this.router.navigateByUrl('/home/gestion-client/client-attente');
  // }

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
        this.onGetAllClientAttente();
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
    //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)

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
      return "En cours";
    } else if (status == this.statusEnattente) {
      return "En attente";
    }
  }

  cancel() {
    this.router.navigateByUrl('/home/gestion-client');
  }

}
