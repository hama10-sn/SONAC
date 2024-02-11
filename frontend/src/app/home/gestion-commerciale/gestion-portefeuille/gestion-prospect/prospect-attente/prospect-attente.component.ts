import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CategorieSocioprofessionnelle } from '../../../../../model/CategorieSocioprofessionnelle';
import { Civilite } from '../../../../../model/Civilite';
import { ClassificationSecteur } from '../../../../../model/ClassificationSecteur';
import { Prospect } from '../../../../../model/Prospect';
import { User } from '../../../../../model/User';
import { CategorieSocioprofessionnelleService } from '../../../../../services/categorieSocioProfessionnelle.service';
import { CiviliteService } from '../../../../../services/civilite.service';
import { ClassificationSecteurService } from '../../../../../services/classification-secteur.service';
import { ProspectService } from '../../../../../services/prospect.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { UserService } from '../../../../../services/user.service';

import type from '../../../../data/type.json';

@Component({
  selector: 'ngx-prospect-attente',
  templateUrl: './prospect-attente.component.html',
  styleUrls: ['./prospect-attente.component.scss']
})
export class ProspectAttenteComponent implements OnInit {

  prospects: Array<Prospect> = new Array<Prospect>();
  //prospect: Prospect ;

  public displayedColumns = ['prospc_numero', 'prospc_nom', 'prospc_denomination', 'prospc_nature', 'action' /*'details', 'update', 'delete' */];
  public dataSource = new MatTableDataSource<Prospect>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  autorisation = [];

  typePersonneChoisi: String;
  personnePhysique = "1";
  personneMorale = "2";
  civilite: any;
  gerant = 23;

  listTypeSociete: any[];
  @Input() listTypeProspect: any[] = type;

  // Variables booléan pour gerer l'affichage du détail selon le type de la personne choisie
  problemePersonnePhysique: boolean = false;
  problemePersonneMorale: boolean = false;

  // affichage des libelle à la place des codes
  civilites: Array<Civilite> = new Array<Civilite>();
  categorieSociopro: Array<CategorieSocioprofessionnelle> = new Array<CategorieSocioprofessionnelle>();
  users: Array<User> = new Array<User>();
  classifications: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();

  OUI = "1";
  NON = "2";

  prospect_statut1 = 1;
  prospect_statut2 = 2;
  prospect_statut3 = 3;
  valueStatut1 = "Information obligatoire manquante";
  valueStatut2 = "Piece justificative manquante";
  valueStatut3 = "Valide pour tranformation en client";

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private prospectService: ProspectService,
    private dialogService: NbDialogService,
    private authService: NbAuthService,
    private civiliteService: CiviliteService,
    private categorieSocioproService: CategorieSocioprofessionnelleService,
    private classifService: ClassificationSecteurService,
    private userService: UserService,
    private router: Router,
    private transfertData: TransfertDataService,
    private toastrService: NbToastrService) { }

  ngOnInit(): void {
    this.onGetAllProspectsAttente();
    this.onGetAllCategorieSociopro();
    this.onGetAllCivilites();
    this.onGetAllUsers();
    this.onGetAllClassificationMetier();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
        }
      });
  }

  onGetAllCivilites() {
    this.civiliteService.getAllCivilite()
      .subscribe((data: Civilite[]) => {
        this.civilites = data;
      });
  }

  onGetAllUsers() {
    this.userService.getAllUsers()
      .subscribe((data: User[]) => {
        this.users = data;
      });
  }

  onGetAllCategorieSociopro() {
    this.categorieSocioproService.getAllCategorieSocioprofessionnelle()
      .subscribe((data: CategorieSocioprofessionnelle[]) => {
        this.categorieSociopro = data;
      });
  }

  onGetAllProspectsAttente() {
    this.prospectService.getAllProspectAttente()
      .subscribe((data: Prospect[]) => {
        this.prospects = data;
        this.dataSource.data = data as Prospect[];
      });
  }

  onGetAllClassificationMetier() {
    this.classifService.getAllClassificationSecteur()
      .subscribe((data: ClassificationSecteur[]) => {
        this.classifications = data;
      });
  }

  onGetLibelleByCivilite(numero: number) {
    return (this.civilites.find(c => c.civ_code === numero))?.civ_libellecourt;
  }

  onGetLibelleByCategorieSociopro(code: any) {
    // return code + " : " + (this.categorieSociopro.find(c => c.categs_code === code))?.categs_libcourt;
    return (this.categorieSociopro.find(c => c.categs_code === code))?.categs_libcourt;
  }

  onGetLibelleByClassification(code: any) {
    if (code === null || code === "") {
      return "";
    } else {
      return code + " : " + (this.classifications.find(c => c.code == code))?.libelle;
    }
  }

  onGetNomByUser(numero: String) {
    return (this.users.find(u => u.util_numero === numero))?.util_nom;
  }

  onGetLibelleByNaturePersonne(numero: any) {
    if (numero === this.personnePhysique) {
      return 'Personne physique';
    } else if (numero === this.personneMorale) {
      return 'Personne morale';
    }
  }

  onGetLibelleByStatut(statut: any) {

    console.log(statut) ;
    console.log(typeof(statut));
    
    if(statut == this.prospect_statut1){
      return this.valueStatut1 ;
    } else if(statut == this.prospect_statut2){
      return this.valueStatut2 ;
    } else if(statut == this.prospect_statut3){
      return this.valueStatut3 ;
    } 
  }

  onGetLibelleByActiviteCommercante(numero: any) {
    if (numero === this.OUI) {
      return 'OUI';
    } else if (numero === this.NON) {
      return 'NON';
    }
  }

  onGetValueofSociete(codesociete: any) {
    this.listTypeSociete = this.listTypeProspect['TYPE_SOCIETE'];
    return (this.listTypeSociete.find(p => p.id == codesociete))?.value;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }


  onOpen(dialog: TemplateRef<any>, prospect: Prospect) {
    this.typePersonneChoisi = prospect.prospc_nature;
    this.civilite = prospect.prospc_titre;
    console.log("civilite: " + typeof (this.civilite));
    if (this.typePersonneChoisi === this.personnePhysique) {
      this.problemePersonnePhysique = true;
      this.problemePersonneMorale = false;
    } else if (this.typePersonneChoisi === this.personneMorale) {
      this.problemePersonneMorale = true;
      this.problemePersonnePhysique = false;
    }
    this.dialogService.open(
      dialog,
      {
        context: prospect,
      });
  }

  onOpenModif(prospect: Prospect) {
    this.transfertData.setData(prospect);
    // this.router.navigateByUrl('home/gestion-commerciale/gestion-portefeuille/prospects/modif');
    this.router.navigateByUrl('/home/gestion-prospect/prospect-attente/modif');
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

  openTestDel(dialogEchec: TemplateRef<any>, dialogDel: TemplateRef<any>, prospect: Prospect) {

    if (prospect.prospc_nature == this.personnePhysique) {
      this.prospectService.verifDeleteProspectPhysique(prospect.prospc_numero).subscribe((data) => {
        this.dialogService.open(
          dialogDel,
          { context: prospect });

      },
        (error) => {
          this.dialogService.open(
            dialogEchec);
        });
    }

    if (prospect.prospc_nature == this.personneMorale) {
      this.prospectService.verifDeleteProspectMorale(prospect.prospc_numero).subscribe((data) => {
        this.dialogService.open(
          dialogDel,
          { context: prospect });

      },
        (error) => {
          this.dialogService.open(
            dialogEchec);
        });
    }
  }

  redirectToDelete(num: number) {
    this.prospectService.delProspect(num)
      .subscribe(() => {
        this.toastrService.show(
          'Prospect supprimé avec succès !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
        this.onGetAllProspectsAttente();
      },
        (error) => {
          this.toastrService.show(
            "Echec de la suppression du prospect",
            'Notification',
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

  openProspectsValide() {
    this.router.navigateByUrl('home/gestion-commerciale/gestion-portefeuille/prospects');
  }

}
