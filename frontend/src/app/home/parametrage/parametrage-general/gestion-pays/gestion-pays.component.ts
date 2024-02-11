import {TranslateService} from '@ngx-translate/core';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Pays } from '../../../../model/pays';
import { PaysService } from '../../../../services/pays.service';
import countries from '../../../data/countries.json';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Router } from '@angular/router';
import { TransfertDataService } from '../../../../services/transfertData.service';

@Component({
  selector: 'ngx-gestion-pays',
  templateUrl: './gestion-pays.component.html',
  styleUrls: ['./gestion-pays.component.scss']
})
export class GestionPaysComponent implements OnInit {

  public listPays:any [] =countries;

 // console.log(this.listPays);
  payss: Array<Pays> = new Array<Pays>();
  pays: Pays;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  //status: NbComponentStatus = 'success';
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';


  public displayedColumns = [/*'pays_code', */'pays_codecima', 'pays_libellelong'/*, 'pays_libellecourt'*/, 'pays_devise', 'pays_multidevise','pays_multillangue','pays_nationalite'/*,'pays_codeutilisateur','pays_datemodification'*/, 'details'/*, 'update', 'delete'*/];
  public dataSource = new MatTableDataSource<Pays>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  autorisation= [];

  constructor(private paysService: PaysService, private dialogService: NbDialogService,
    private toastrService: NbToastrService, private authService: NbAuthService,
    private translate: TranslateService,private router: Router,
    private transfertData: TransfertDataService) { 
      //translate.setDefaultLang('en');
      // Gets Default language from browser if available, otherwise set English ad default

    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);

    this.translate.setDefaultLang('fr');

    const browserLang = this.translate.getBrowserLang();

    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'fr');

  }
    


  ngOnInit(): void {
    this.onGetAllpays();

    this.authService.onTokenChange()
     .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }

    });
    //console.log(this.listPays);
  }
 
  /*
  cette methode nous permet de d'avoir la liste des pays
  */
  onGetAllpays(){
    this.paysService.getAllPays()
      .subscribe((data: Pays[]) => {
          this.payss = data;
          this.dataSource.data = data as Pays[];
          //console.log(this.payss);
      });
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
  open(dialog: TemplateRef<any>, pays:Pays ) {
   /* this.paysService.getPays(id)
      .subscribe((data: Pays) => {
        this.pays = data;
      });*/
    this.dialogService.open(
      dialog,
      { context: pays 
          
      });
  }

    /*
    *cette methode nous permet d'ouvrir une 
    *boite dialogue pour inserer un pays pays et de lever une exeption s'il a erreur
    */

  openAjout() {
    this.router.navigateByUrl('home/gestion_pays/ajout');
    /*this.dialogService.open(AjoutPaysComponent)
    .onClose.subscribe(data => data && this.paysService.addPays(data)
    .subscribe(() => {
      this.toastrService.show(
        'Pays Enregistré avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
       this.onGetAllpays();
    },
    (error) => {
      this.toastrService.show(
        'une erreur est survenue numero pays existe deja',
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 7000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });       
        
        this.openAjout();
    },
    ));*/
  }
  /*
    *cette methode nous permet d'ouvrir une 
    *boite dialogue pour modifier un pays     
    */
  openModif(pays: Pays) {
    this.transfertData.setData(pays);
    this.router.navigateByUrl('home/gestion_pays/modif');
    /*
    this.dialogService.open(ModifPaysComponent, {
        context: {
          pays: pays,
        },
      })
    .onClose.subscribe(data => data && this.paysService.update(data)
    .subscribe(() => {
      this.toastrService.show(
        'Pays modifié avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
       this.onGetAllpays();
    },
    (error) => {
      this.toastrService.show(
        'une erreur est survenue',
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 7000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
    },
    ));
    */
  }

  
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }
}
