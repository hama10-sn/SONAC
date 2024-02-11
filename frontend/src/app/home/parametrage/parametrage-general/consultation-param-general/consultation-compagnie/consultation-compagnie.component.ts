import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Compagnie } from '../../../../../model/Compagnie';
import { CompagnieService } from '../../../../../services/compagnie.service';
import type from '../../../../data/type.json';
import { User } from '../../../../../model/User';
import { UserService } from '../../../../../services/user.service';
import { HttpEventType } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'ngx-consultation-compagnie',
  templateUrl: './consultation-compagnie.component.html',
  styleUrls: ['./consultation-compagnie.component.scss']
})
export class ConsultationCompagnieComponent implements OnInit {

  compagnies: Array<Compagnie> = new Array<Compagnie>();
  compagnie: Compagnie;
  @Input() listTypecompagnie: any[] = type;

  title = 'La liste des compagnies';
  login_demandeur: string;
  demandeur: string;
  user: User;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  listTypes: any[];


  public displayedColumns = ['comp_numero', 'comp_type', 'comp_rangmarche', 'comp_carelation', 'comp_denomination', 'action' ];
  public dataSource = new MatTableDataSource<Compagnie>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  autorisation = [];

  constructor(private compagnieService: CompagnieService,
    private dialogService: NbDialogService,
    private authService: NbAuthService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.onGetALlCompagnies();
    this.listTypes = this.listTypecompagnie['TYPE_COMPAGNIE'];

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

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onGetALlCompagnies() {
    this.compagnieService.getAllCompagnies()
      .subscribe((data: Compagnie[]) => {
        this.compagnies = data;
        this.dataSource.data = data as Compagnie[];
        console.log(this.compagnies);
      });
  }

  open(dialog: TemplateRef<any>, compagnie: Compagnie) {
    this.dialogService.open(
      dialog,
      { context: compagnie });
  }

  numberWithCommas(x: number) {
    if (x == null)
      return null;
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(".");
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;

  }

  onGetLibelleByTypeCompagnie(type: String) {
    return (this.listTypes.find(p => p.id === type))?.value;
  }
  
  onExport(format: String) {
    console.log(this.demandeur);
    let titleNew = this.title.replace(/ /g, "_");
    let demandeurNew = this.demandeur.replace(/ /g, "_");

    const form = new FormData();
    form.append('title', titleNew);
    form.append('demandeur', demandeurNew);

    if (format === 'pdf') {
      this.compagnieService.generateReportCompagnie(format, form)
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
              saveAs(event.body, 'liste des compagnies.pdf');
          }
        });
    }

    if (format === 'excel') {
      this.compagnieService.generateReportCompagnie(format, form)
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
              saveAs(event.body, 'liste des compagnies.xlsx');
          }
        });
    }
  }

}
