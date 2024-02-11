import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Pays } from '../../../../model/pays';
import { Reassureur } from '../../../../model/Reassureur';
import { PaysService } from '../../../../services/pays.service';
import { ReassureurService } from '../../../../services/reassureur.service';
import countries from '../../../data/countries.json';
import type from '../../../data/type.json';
import { Router } from '@angular/router';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { User } from '../../../../model/User';
import { UserService } from '../../../../services/user.service';
import { HttpEventType } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'ngx-gestion-reassureur',
  templateUrl: './gestion-reassureur.component.html',
  styleUrls: ['./gestion-reassureur.component.scss']
})
export class GestionReassureurComponent implements OnInit {

  reassureurs: Array<Reassureur> = new Array<Reassureur>();
  reassureur: Reassureur;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  payss: Array<Pays> = new Array<Pays>();
  libelle: String;
  @Input() listPays: any[] = countries;

  @Input() listTypeReassureur: any[] = type;
  listTypes: any;


  title = 'La liste des reassureurs';
  login_demandeur: string;
  demandeur: string;
  user: User;


  public displayedColumns = ['reass_code', 'reass_codeidentificateur', 'reass_codepays', 'reass_type', 'reass_denomination', 'details'];
  public dataSource = new MatTableDataSource<Reassureur>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  autorisation = [];


  constructor(private reassureurService: ReassureurService, 
    private dialogService: NbDialogService,
    private transfertData: TransfertDataService, 
    private authService: NbAuthService,
    private payService: PaysService, 
    private router: Router, 
    private toastrService: NbToastrService,
    private userService: UserService) { }

  ngOnInit(): void {

    this.onGetAllReassureur();
    this.onGetAllPays();
    this.listTypes = this.listTypeReassureur['TYPE_REASSUREUR'];
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          console.log(this.autorisation);
          this.login_demandeur = token.getPayload().sub;
          this.onGetUser(this.login_demandeur);
        }
      });
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        console.log(this.user);
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
      });
  }

  onExport(format: String) {
    console.log(this.demandeur);
    let titleNew = this.title.replace(/ /g, "_");
    let demandeurNew = this.demandeur.replace(/ /g, "_");

    const form = new FormData();
    form.append('title', titleNew);
    form.append('demandeur', demandeurNew);

    if (format === 'pdf') {
      this.reassureurService.generateReportReassureur(format, form)
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
              saveAs(event.body, 'liste des reassureurs.pdf');
          }
        });
    }

    if (format === 'excel') {
      this.reassureurService.generateReportReassureur(format, form)
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
              saveAs(event.body, 'liste des reassureurs.xlsx');
          }
        });
    }
  }
  onDeleteReassureur(id: String) {
    this.reassureurService.deleteReassureur(id)
      .subscribe(() => {
        this.toastrService.show(
          'Reassureur supprimée avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
        this.onGetAllReassureur();
      });
  }

  onGetAllPays() {
    this.payService.getAllPays()
      .subscribe((data: Pays[]) => {
        this.payss = data;
      });
  }
  onGetLibelleByPays(code: number) {
    return (this.listPays.find(p => p.callingCodes[0] === code.toString()))?.name;

  }

  onGetNationaliteByCode(code: number) {
    //console.log((this.listPays.find(p => p.callingCodes[0]))) ; 
    //
    //this.OnGetListe();

  }

  OnGetListe(code: String) {
    return (this.listPays.find(p => p.callingCodes[0] === code))?.demonym;
  }
  /*
  cette methode nous permet de d'avoir la liste les Reassureur
  */
  onGetAllReassureur() {
    this.reassureurService.getAllReassureur()
      .subscribe((data: Reassureur[]) => {
        this.reassureurs = data;
        this.dataSource.data = data as Reassureur[];
      });
    //console.log(this.reassureurs);
  }
  /*
    cette methode nous permet de faire des paginations
    */
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  /*
    cette methode nous permet de faire des filtre au niveau 
    de la recherche dans la liste
    */
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  /*
    *cette methode nous permet d'ouvrir une boite dialogue
    */
  open(dialog: TemplateRef<any>, reassureur: Reassureur) {

    this.dialogService.open(
      dialog,
      {
        context: reassureur

      });
  }
  /*
    *cette methode nous permet d'ouvrir une 
    *boite dialogue pour inserer un reassureur reassureur et de lever une exeption s'il a erreur
    */
  openAjout() {

    this.router.navigateByUrl('home/parametrage/parametrage-general/gestion-reassureur/reassureur');
  }
  /*
    *cette methode nous permet d'ouvrir une 
    *boite dialogue pour modifier un reassureur     
    */
  openModif(reassureur: Reassureur) {
    this.transfertData.setData(reassureur);
    this.router.navigateByUrl('home/gestion_reassureur/modif');
  }
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;

  }
  onGetLibelleByTypeReassureur(type: String) {

    return (this.listTypes.find(p => p.id === type))?.value;
  }
}
