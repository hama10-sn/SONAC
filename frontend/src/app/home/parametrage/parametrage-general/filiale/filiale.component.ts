import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Compagnie } from '../../../../model/Compagnie';

import { Filiale } from '../../../../model/Filiale';
import { Groupe } from '../../../../model/Groupe';
import { Pays } from '../../../../model/pays';
import { CompagnieService } from '../../../../services/compagnie.service';
import { FilialeService } from '../../../../services/filiale.service';
import { GroupeService } from '../../../../services/groupe.service';
import { PaysService } from '../../../../services/pays.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import countries from '../../../data/countries.json';
@Component({
  selector: 'ngx-filiale',
  templateUrl: './filiale.component.html',
  styleUrls: ['./filiale.component.scss']
})
export class FilialeComponent implements OnInit {

  filiales: Array<Filiale> = new Array<Filiale>();
  filialesComp: any[];
  compagnies: Array<Compagnie> = new Array<Compagnie>();
  filiale: Filiale;
  autorisation = [];
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  payss: Array<Pays> = new Array<Pays>();
  listGroupes: Array<Groupe> = new Array<Groupe>();

  // tslint:disable-next-line:max-line-length
  public displayedColumns = ['fili_codecompagnie', 'fili_codepays', 'fili_denomination', 'fili_sigle', 'fili_telephone1','action']// 'details', 'update', 'delete'];
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() listPays: any [] = countries;

  // status: NbComponentStatus = 'info';

  constructor(private filialeService: FilialeService, private authService: NbAuthService, private router: Router,
    // tslint:disable-next-line:max-line-length
    private dialogService: NbDialogService, private compagnieService: CompagnieService, private paysService: PaysService,
    // tslint:disable-next-line:max-line-length
    private toastrService: NbToastrService, private transfertData: TransfertDataService, private groupeService: GroupeService) { }

  ngOnInit(): void {

    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }

    });
    this.onGetAllFiliales();
  // this.onGetCompagnieByCode(45);
  this.onGetAllFilialesComp();
  this.onGetALlCompagnies();
  this.onGetAllpays();
  this.onGetAllGroupes();

  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    console.log(this.dataSource);
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onGetAllFiliales() {
    this.filialeService.getAllFiliales()
      .subscribe((data: Filiale[]) => {
          this.filiales = data;
          this.dataSource.data = data as Filiale[];
          console.log(this.filiales);
      });
  }

  onGetAllFilialesComp() {
    this.filialeService.getAllFilialesComp()
      .subscribe((data: any[]) => {
          this.filialesComp = data;
        //  this.dataSource.data = data;
//console.log(this.filialesComp[0][1].comp_numero);
          console.log(this.filialesComp);
      });
  }


  onDeleteFiliale(id: number) {
    this.filialeService.deleteFiliale(id)
      .subscribe(() => {
        this.toastrService.show(
          'Filiale supprimée avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });

          this.onGetAllFiliales();
      });
  }


  open(dialog: TemplateRef<any>, filiale: Filiale) {
    this.dialogService.open(
      dialog,
      { context: filiale });
  }
  openAjout() {

    this.router.navigateByUrl('home/filiale/ajout');


   /* this.dialogService.open(AjoutFilialeComponent)
    .onClose.subscribe(data => data && this.filialeService.addFiliale(data)
    .subscribe(() => {
      this.toastrService.show(
        'Filiale Enregistrée avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
       this.onGetAllFiliales();
    },
    (error) => {
      this.toastrService.show(
        'une erreur est survenue',
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.onGetAllFiliales();
    },
    ));*/
  }

  openModif(filiale: Filiale, id) {

    this.transfertData.setData(filiale);
    this.router.navigateByUrl('home/filiale/update');
 /*   this.dialogService.open(ModifFilialeComponent, {
        context: {
          filiale: filiale,
        },
      })
    .onClose.subscribe(data => data && this.filialeService.updateFiliale(data, id)
    .subscribe(() => {
      this.toastrService.show(
        'filiale modifiée avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
       this.onGetAllFiliales();
    },
      (error) => {
        console.log(error);
        this.toastrService.show(
          'une erreur est survenue',
          'Notification',
          {
            status: this.statusFail,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
          this.onGetAllFiliales();
      },
    ));*/
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }


  public redirectToUpdate = (id: string) => {

  }
  public redirectToDelete = (id: string) => {

  }

    onGetdenom(code: String) {
    //  this.onGetCompagnieByCode(code);
     return (this.compagnies.find(p => p.comp_numero === code))?.comp_denomination ;
    }
    onGetPays(code: number) {
      //  this.onGetCompagnieByCode(code);
      return (this.listPays.find(p => p.callingCodes[0] === code.toString()))?.name;
       //return (this.payss.find(p => p.pays_code === code))?.pays_libellelong ;
      }


    onGetGroupe(code: number) {
      //  this.onGetCompagnieByCode(code);
       return (this.listGroupes.find(p => p.group_code === code))?.group_liblong;
      }


  onGetALlCompagnies() {
    this.compagnieService.getAllCompagnies()
      .subscribe((data: Compagnie[]) => {
          this.compagnies = data;
      });
  }

  onGetAllpays() {
    this.paysService.getAllPays()
      .subscribe((data: Pays[]) => {
          this.payss = data;
      });
  }

  onGetAllGroupes () {
    this.groupeService.getAllGroupes()
    .subscribe((data: Groupe[]) => {
       this.listGroupes = data;
    });
}


}
