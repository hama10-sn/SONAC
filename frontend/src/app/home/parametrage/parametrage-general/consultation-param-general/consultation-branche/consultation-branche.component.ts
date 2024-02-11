import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition } from '@nebular/theme';
import { saveAs } from 'file-saver';
import { Branche } from '../../../../../model/Branche';
import { User } from '../../../../../model/User';
import { BrancheService } from '../../../../../services/branche.service';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'ngx-consultation-branche',
  templateUrl: './consultation-branche.component.html',
  styleUrls: ['./consultation-branche.component.scss']
})
export class ConsultationBrancheComponent implements OnInit {

  branches: Array<Branche> = new Array<Branche>();
  branche: Branche;

  title = 'La liste des branches';
  login_demandeur: string;
  demandeur: string;
  user: User;

  public displayedColumns = ['branche_numero', 'branche_libelleLong', 'branche_libellecourt', 'branch_periodicite_compabilisation', 'action' /*,'details', 'update', 'delete'*/];
  public dataSource = new MatTableDataSource<Branche>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  autorisation = [];

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private brancheService: BrancheService,
    private dialogService: NbDialogService,
    private authService: NbAuthService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.onGetAllBranches();
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
      this.brancheService.generateReportBranche(format, form)
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
              saveAs(event.body, 'liste des branches.pdf');
          }
        });
    }

    if (format === 'excel') {
      this.brancheService.generateReportBranche(format, form)
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
              saveAs(event.body, 'liste des branches.xlsx');
          }
        });
    }
  }
  onGetAllBranches() {
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
        this.branches = data;
        this.dataSource.data = data as Branche[];
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onOpen(dialog: TemplateRef<any>, branche: Branche) {

    this.dialogService.open(
      dialog,
      {
        context: branche,
      });
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;

  }
}
