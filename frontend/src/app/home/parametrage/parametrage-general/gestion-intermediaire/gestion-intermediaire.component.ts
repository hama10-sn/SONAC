import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ClassificationSecteur } from '../../../../model/ClassificationSecteur';
import { Intermediaire } from '../../../../model/Intermediaire';
import { User } from '../../../../model/User';
import { ClassificationSecteurService } from '../../../../services/classification-secteur.service';
import { IntermediaireService } from '../../../../services/intermediaire.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { UserService } from '../../../../services/user.service';
import { saveAs } from 'file-saver';


@Component({
  selector: 'ngx-gestion-intermediaire',
  templateUrl: './gestion-intermediaire.component.html',
  styleUrls: ['./gestion-intermediaire.component.scss']
})
export class GestionIntermediaireComponent implements OnInit {

  intermediaires: Array<Intermediaire> = new Array<Intermediaire>();
  intermediaire: Intermediaire;
  users: Array<User> = new Array<User>();
  classifications: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();
  classification: ClassificationSecteur;

  title = 'La liste des intermédiaires';
  login_demandeur: string;
  demandeur: string;
  user: User;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  public displayedColumns = ['inter_numero', 'inter_type', 'inter_denomination', 'inter_portable', 'action' /*,'details', 'update', 'dossier', 'delete' */];
  public dataSource = new MatTableDataSource<Intermediaire>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  autorisation = [];
  constructor(private intermediaireService: IntermediaireService,
    private userService: UserService,
    private dialogService: NbDialogService,
    private authService: NbAuthService,
    private router: Router,
    private transfertData: TransfertDataService,
    private classifService: ClassificationSecteurService,
    private toastrService: NbToastrService) { }

  ngOnInit(): void {
    this.onGetAllIntermediaires();
    this.onGetAllUsers();
    this.onGetAllClassificationSecteurs();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');

          this.login_demandeur = token.getPayload().sub;
          this.onGetUser(this.login_demandeur);
        }
      });
  }

  onGetAllIntermediaires() {
    this.intermediaireService.getAllIntermediaires()
      .subscribe((data: Intermediaire[]) => {
        this.intermediaires = data;
        this.dataSource.data = data as Intermediaire[];
      });
  }

  onGetAllUsers() {
    this.userService.getAllUsers()
      .subscribe((data: User[]) => {
        this.users = data;
      });
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
      });
  }

  onGetAllClassificationSecteurs() {
    this.classifService.getAllClassificationSecteur()
      .subscribe((data: ClassificationSecteur[]) => {
        this.classifications = data;
      });
  }

  onGetNomByUser(numero: String) {
    console.log("Numero: " + numero);
    return (this.users.find(u => u.util_numero === numero))?.util_nom;
  }

  onGetLibelleByClassification(code: any) {

    return code + " : " + (this.classifications?.find(c => c.code == code))?.libelle;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onOpen(dialog: TemplateRef<any>, intermediaire: Intermediaire) {

    this.dialogService.open(
      dialog,
      {
        context: intermediaire,
      });
  }

  onOpenAjout() {
    this.router.navigateByUrl('home/parametrage-general/intermediaires/ajout');
  }

  onOpenModif(intermediaire: Intermediaire) {
    this.transfertData.setData(intermediaire);
    this.router.navigateByUrl('home/parametrage-general/intermediaires/modif');
  }

  openTestDel(dialogEchec: TemplateRef<any>, dialogDel: TemplateRef<any>, intermediaire: Intermediaire) {

    this.intermediaireService.verifDeleteIntermediaire(intermediaire.inter_numero).subscribe((data) => {
      this.dialogService.open(
        dialogDel,
        { context: intermediaire });

    },
      (error) => {
        this.dialogService.open(
          dialogEchec);
      });
  }

  redirectToDelete(num: Number) {
    this.intermediaireService.delIntermediaire(num)
      .subscribe(() => {
        this.toastrService.show(
          'Intermédiaire supprimé avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
        this.onGetAllIntermediaires();
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


  OpenDossier(intermediaire){
    this.transfertData.setData(intermediaire);
    this.router.navigateByUrl('/home/dossiers-intermediaire');
  }

  onExport(format: String) {
    
    let titleNew = this.title.replace(/ /g, "_");
    let demandeurNew = this.demandeur.replace(/ /g, "_");

    const form = new FormData();
    form.append('title', titleNew);
    form.append('demandeur', demandeurNew);

    if (format === 'pdf') {
      this.intermediaireService.generateReportIntermediaire(format, form)
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
              saveAs(event.body, 'liste des intermediaires.pdf');
          }
        });
    }

    if (format === 'excel') {
      this.intermediaireService.generateReportIntermediaire(format, form)
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
              saveAs(event.body, 'liste des intermediaires.xlsx');
          }
        });
    }
  }
}
