import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { MainLeve } from '../../../../model/MainLeve';
import { Police } from '../../../../model/Police';
import { Produit } from '../../../../model/Produit';
import { MainLeveService } from '../../../../services/main-leve.service';
import { PoliceService } from '../../../../services/police.service';
import { TransfertDataService } from '../../../../services/transfertData.service';

@Component({
  selector: 'ngx-list-mainleve',
  templateUrl: './list-mainleve.component.html',
  styleUrls: ['./list-mainleve.component.scss']
})
export class ListMainleveComponent implements OnInit {

  mainLeves : Array<MainLeve> = new Array<MainLeve>();

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  public displayedColumns = ['mainl_numpoli', /* 'mainl_numeroavenant', */ 'mainl_numeroacte',/*  'mainl_numeroengagement', */
    'mainl_nummainlevee', 'mainl_mtnmainlevee','details'];
   public dataSource = new MatTableDataSource<MainLeve>();
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   autorisation=[];
   aff: Boolean = true;
   
 polices: Police;
 produits: Array<Produit> = new Array<Produit>();
  
  constructor(private mainLeveService: MainLeveService,private transfertData: TransfertDataService,
    private dialogService: NbDialogService,private toastrService: NbToastrService,
     private authService: NbAuthService, private router: Router,
     private policeService: PoliceService) { }
     numero:any;
  ngOnInit(): void {
    this.numero=this.transfertData.getData();
    this.onGetAlMainLeve();
    this.authService.onTokenChange()
     .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }
    });

    
   
    
  }
  onGetAlMainLeve(){
    this.mainLeveService.allMainLeveByEngagement(this.numero)
      .subscribe((data: MainLeve[]) => {
          this.mainLeves = data;
          this.dataSource.data = data as MainLeve[];
          console.log(this.mainLeves);
      });  
  }
  
  onGetAllPolice(num: Number) {
    this.policeService.getPolice(num)
      .subscribe((data: Police) => {
        this.polices = data ;
      //  console.log(this.polices);
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
    open(dialog: TemplateRef<any>, main:MainLeve ) {
     
      this.dialogService.open(
        dialog,
        { context: main 
            
        });
    }
    
    cancel() {
      this.router.navigateByUrl('/home/gestion-mainleve');
    }
onGetPoliceBySouscripeur(numero:number){
    
    return  this.polices?.poli_codeproduit ;
  }
  onGetLibelleByProduit(numero: Number) {
    
      return (this.produits?.find(b => b.prod_numero === numero))?.prod_denominationcourt ;  
     
    }
    
  /*
    *cette methode nous permet d'ouvrir une 
    * inserer un contact 
    */
  /* openAjout() {
    
    this.router.navigateByUrl('home/gestion-mainleve/add-mainleve');
  }  */
  /*
    *cette methode nous permet d'ouvrir une 
    *boite dialogue pour modifier un contact     
    */
  /* openModif(mainleve: MainLeve) {
    this.transfertData.setData(mainleve);
    this.router.navigateByUrl('home/gestion-mainleve/modif-mainleve');
  } */
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }

}
