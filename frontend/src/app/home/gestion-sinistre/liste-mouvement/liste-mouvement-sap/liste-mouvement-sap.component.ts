import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Beneficiaire } from '../../../../model/Beneficiaire';
import { Mvtsinistre } from '../../../../model/Mvtsinistre';
import { Sinistre } from '../../../../model/Sinistre';
import { User } from '../../../../model/User';
import { RecoursService } from '../../../../services/recours.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'ngx-liste-mouvement-sap',
  templateUrl: './liste-mouvement-sap.component.html',
  styleUrls: ['./liste-mouvement-sap.component.scss']
})
export class ListeMouvementSapComponent implements OnInit {
  sinistre: Sinistre;
  autorisation = [];
  login_demandeur: string;
  demandeur: string;
  user: User;

  beneficiaires: Array<Beneficiaire> = new Array<Beneficiaire>();

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusFail: NbComponentStatus = 'danger';

  public displayedColumns = ['mvts_poli', 'mvts_datemvt', 'mvts_num', 'mvts_montantprincipal', 'mvts_montantfrais', 'mvts_montanthonoraire', 'mvts_montantmvt', 'mvts_typemvt', 'action'];
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private recoursService: RecoursService,
    private authService: NbAuthService,
    private userService: UserService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    this.sinistre = this.transfertData.getData();
    this.onGetMouvementEvaluation();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.login_demandeur = token.getPayload().sub;
          this.onGetUser(this.login_demandeur);
        }
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
      });
  }

  onGetMouvementEvaluation() {
    if (this.sinistre != undefined || this.sinistre != null) {
      this.recoursService.listeMouvementParSinistreAndTypeMouvement(this.sinistre.sini_num, 4)
        .subscribe((data: any) => {
          this.dataSource.data = data.data;
        })
    } else {
      this.toastrService.show(
        "Aucun mouvement sap n'a été faite sur ce sinistre",
        'Notification d\'erreur',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
    }
  }

  onGetLibelleByStatus(num: any) {
    if (num == 4) {
      return 'Modification SAP';
    } else {
      return '';
    }
  }

  onGetBeneficiaireByCode(numero) {
    return numero + " : " + ((this.beneficiaires.find(b => b.benef_Num == numero))?.benef_prenoms ? (this.beneficiaires.find(b => b.benef_Num == numero))?.benef_prenoms : "") + " " + ((this.beneficiaires.find(b => b.benef_Num == numero))?.benef_nom ? (this.beneficiaires.find(b => b.benef_Num == numero))?.benef_nom : "") + " " + ((this.beneficiaires.find(b => b.benef_Num == numero))?.benef_denom ? (this.beneficiaires.find(b => b.benef_Num == numero))?.benef_denom : "");
  }

  onOpen(dialog: TemplateRef<any>, mvts: Mvtsinistre) {
    this.dialogService.open(
      dialog,
      {
        context: mvts,
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
