import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CategorieSocioprofessionnelle } from '../../../../model/CategorieSocioprofessionnelle';
import { Civilite } from '../../../../model/Civilite';
import { ClassificationSecteur } from '../../../../model/ClassificationSecteur';
import { Prospect } from '../../../../model/Prospect';
import { User } from '../../../../model/User';
import { CategorieSocioprofessionnelleService } from '../../../../services/categorieSocioProfessionnelle.service';
import { CiviliteService } from '../../../../services/civilite.service';
import { ClassificationSecteurService } from '../../../../services/classification-secteur.service';
import { ProspectService } from '../../../../services/prospect.service';
import { UserService } from '../../../../services/user.service';
import type from '../../../data/type.json';
import dateFormatter from 'date-format-conversion';
import { HttpEventType } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'ngx-consultation-prospect',
  templateUrl: './consultation-prospect.component.html',
  styleUrls: ['./consultation-prospect.component.scss']
})
export class ConsultationProspectComponent implements OnInit {

  addForm = this.fb.group({

    date_debut: [''],
    date_fin: [''],
    periode_mois: ['']
  });

  prospects: Array<Prospect> = new Array<Prospect>();
  //prospect: Prospect ;

  public displayedColumns = ['prospc_numero', 'prospc_nom', 'prospc_denomination', 'prospc_rue_ville', 'action' /*'details', 'update', 'delete' */];
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
  // problemePersonnePhysiqueGerant: boolean = false;

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

  check: boolean = false;
  date_debut: any = '0';
  date_fin: any = '0';
  periodeNombreMois: number = 0;
  problemeDate: boolean = false;
  erreur: boolean = false;

  title = 'Liste des prospects valides';
  login_demandeur: string;
  demandeur: string;
  user: User;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(
    private fb: FormBuilder,
    private prospectService: ProspectService,
    private dialogService: NbDialogService,
    private authService: NbAuthService,
    private civiliteService: CiviliteService,
    private categorieSocioproService: CategorieSocioprofessionnelleService,
    private classifService: ClassificationSecteurService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.onGetAllProspects()
    this.onGetAllCategorieSociopro();
    this.onGetAllCivilites();
    this.onGetAllUsers();
    this.onGetAllClassificationMetier();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');

          this.login_demandeur = token.getPayload().sub;
          this.onGetUser(this.login_demandeur);
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

  onGetAllProspects() {
    this.prospectService.getAllProspect()
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

  onGetLibelleByStatut(statut: number) {

    if (statut == this.prospect_statut1) {
      return this.valueStatut1;
    } else if (statut == this.prospect_statut2) {
      return this.valueStatut2;
    } else if (statut == this.prospect_statut3) {
      return this.valueStatut3;
    } else {
      return 'pas bon';
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

  onGetAllProspectNonTransformesApartirDuMois(dateDebut: string) {
    this.prospectService.getAllProspectNonTransformesApartirDuMois(dateDebut)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllProspectNonTransformesParPeriode(dateDebut: string, dateFin: string) {
    this.prospectService.getAllProspectNonTransformesParPeriode(dateDebut, dateFin)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllProspectNonTransformesDepuisXMois(nbreMois: any) {
    this.prospectService.getAllProspectNonTransformesDepuisXMois(nbreMois)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
      });
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
    // if (this.typePersonneChoisi === this.personnePhysique && this.civilite != this.gerant) {
    if (this.typePersonneChoisi === this.personnePhysique) {
      this.problemePersonnePhysique = true;
      this.problemePersonneMorale = false;
      // this.problemePersonnePhysiqueGerant = false;
    } else if (this.typePersonneChoisi === this.personneMorale) {
      this.problemePersonneMorale = true;
      this.problemePersonnePhysique = false;
      // this.problemePersonnePhysiqueGerant = false;
    } //else if (this.typePersonneChoisi == this.personnePhysique && this.civilite == this.gerant) {
    //   // this.problemePersonnePhysiqueGerant = true;
    //   this.problemePersonnePhysique = false;
    //   this.problemePersonneMorale = false;
    // }
    this.dialogService.open(
      dialog,
      {
        context: prospect,
      });
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

  // Les 3 méthodes suivantes permettent de réinitialser la variable check à false
  onClickPeriodeApartirDe() {
    this.check = false;
  }

  onClickPeriodeDepuisXmois() {
    this.check = false;
  }


  onFocusOutEventDate(event: any) {

    this.date_debut = this.addForm.get("date_debut").value;
    this.date_fin = this.addForm.get("date_fin").value;

    this.addForm.controls['periode_mois'].setValue("");
    this.periodeNombreMois = 0;

    if ((this.date_debut != null && this.date_debut != '') && (this.date_fin != null && this.date_fin != '')) {
      if (this.date_debut > this.date_fin) {
        this.problemeDate = true;
        this.erreur = true;
      } else {
        this.problemeDate = false;
        this.erreur = false;

        var date_finRecuperer = new Date(this.date_fin);
        date_finRecuperer.setDate(date_finRecuperer.getDate() + 1);

        this.date_fin = dateFormatter(date_finRecuperer, 'yyyy-MM-dd');

      }
    }
  }

  onFocusOutEventPeriodeDepuisXmois(event: any) {
    this.periodeNombreMois = this.addForm.get('periode_mois').value;

    this.addForm.controls['date_debut'].setValue("");
    this.addForm.controls['date_fin'].setValue("");
    this.date_debut = '0';
    this.date_fin = '0';
  }

  getColorDate() {
    if (this.problemeDate) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorPeriodeDepuisXmois() {

  }

  getToday(): string {
    return dateFormatter(new Date(), 'yyyy-MM-dd')
  }

  onConsulter() {
    
    /*
    console.log("periodeMois: " + this.periodeNombreMois);
    console.log("type periodeMois: " + typeof(this.periodeNombreMois));

    console.log("date début: " + this.date_debut);
    console.log("type date début: " + typeof (this.date_debut));

    console.log("date Fin: " + this.date_fin);
    console.log("type date Fin: " + typeof (this.date_fin));
    */
    

    if (((this.date_debut != '0' && this.date_debut !== '') && (this.date_fin == '0' || this.date_fin === '')) && this.periodeNombreMois == 0) {
      this.onGetAllProspectNonTransformesApartirDuMois(this.date_debut);
      this.date_fin = '0';
      this.title = 'La liste des prospects valides non transformés à partir du ' + dateFormatter(this.date_debut, 'dd-MM-yyyy');
    }
    else if ((this.date_debut != '0' && this.date_debut !== '') && (this.date_fin != '0' && this.date_fin !== '') && this.periodeNombreMois == 0) {
      this.onGetAllProspectNonTransformesParPeriode(this.date_debut, this.date_fin);
      var dateFin = (new Date(this.date_fin)).setDate(new Date(this.date_fin).getDate() - 1); // Juste pour l'affichage
      this.title = 'La liste des prospects valides non transformés du '+ dateFormatter(this.date_debut, 'dd-MM-yyyy') + ' au '+ dateFormatter(dateFin, 'dd-MM-yyyy');
    }
    else if (this.periodeNombreMois != 0 && (this.date_debut == '0' || this.date_debut === '') && (this.date_fin == '0' || this.date_fin === '')) {
      this.onGetAllProspectNonTransformesDepuisXMois(this.periodeNombreMois);
      this.title = 'La liste des prospects valides non transformés dépuis ' + this.periodeNombreMois + ' mois';

    } else {
      this.onGetAllProspects();
      this.title = 'La liste des prospects valides';
    }

    this.check = true;
  }

  onReinitialiser() {

    this.addForm.controls['date_debut'].setValue("");
    this.addForm.controls['date_fin'].setValue("");
    this.addForm.controls['periode_mois'].setValue("");

    this.date_debut = '0';
    this.date_fin = '0';
    this.periodeNombreMois = 0;

    this.problemeDate = false;
    this.erreur = false;
  }

  onExport(format: String) {

    let titleNew = this.title.replace(/ /g, "_");
    let demandeurNew = this.demandeur.replace(/ /g, "_");

    // console.log(titleNew);
    // console.log(demandeurNew);

    if (format === 'pdf') {
      this.prospectService.generateReportProspect(format, titleNew, demandeurNew, this.date_debut, this.date_fin, this.periodeNombreMois)
        .subscribe(event => {
          switch (event.type) {
            case HttpEventType.Sent:
              console.log('Request has been made!');
              break;
            case HttpEventType.ResponseHeader:
              console.log('Response header has been received!');
              break;
            case HttpEventType.UploadProgress:
              break;
            case HttpEventType.Response:
              saveAs(event.body, 'liste des prospects.pdf');
          }
        });
    }

    if (format === 'excel') {
      this.prospectService.generateReportProspect(format, titleNew, demandeurNew, this.date_debut,this.date_fin, this.periodeNombreMois)
        .subscribe(event => {
          switch (event.type) {
            case HttpEventType.Sent:
              console.log('Request has been made!');
              break;
            case HttpEventType.ResponseHeader:
              console.log('Response header has been received!');
              break;
            case HttpEventType.UploadProgress:
              break;
            case HttpEventType.Response:
              // console.log(event);
              // var fileURL = URL.createObjectURL(event.body) ;
              // window.open(fileURL) ;
              saveAs(event.body, 'liste des prospects.xlsx');
          }
        });
    }

  }

}
