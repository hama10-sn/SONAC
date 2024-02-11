import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Clause } from '../../../model/Clause';
import { ClauseService } from '../../../services/clause.service';
import { TransfertDataService } from '../../../services/transfertData.service';
import type from '../../data/type.json';

@Component({
  selector: 'ngx-gestion-clause',
  templateUrl: './gestion-clause.component.html',
  styleUrls: ['./gestion-clause.component.scss']
})
export class GestionClauseComponent implements OnInit {

  clActes : Array<Clause> = new Array<Clause>();
acte:any;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  @Input() id_acte: Number;
  @Input() types:any [] =type;
  listTypes:any;
  
  aff: Boolean = true;

  public displayedColumns = [ 'clact_numeroclause',
   'clact_type',/* 'clact_numlot', */'details'/* , 'update', 'delete' */];
   public dataSource = new MatTableDataSource<Clause>();
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   autorisation=[];
  
  constructor(private clActeService: ClauseService, private transfertData: TransfertDataService,
    private dialogService: NbDialogService,private toastrService: NbToastrService,
     private authService: NbAuthService, private router: Router) { }

  ngOnInit(): void {
    
    this.listTypes=this.types['TYPE_CLAUSE'];
    this.authService.onTokenChange()
     .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }
    });

    console.log(this.id_acte);
    if(this.id_acte == null)
    this.onGetAllClause();
    else {
    this.onGetAllClauseByActe(this.id_acte);
    this.aff = false;
   }

  }
  onGetAllClause(){
    this.clActeService.getAllClauses()
      .subscribe((data: Clause[]) => {
          this.clActes = data;
          this.dataSource.data = data as Clause[];
          console.log(this.clActes);
      });  
  }
  onGetAllClauseByActe(id: Number){
    this.clActeService.getAllClausesByActe(id)
      .subscribe((data: Clause[]) => {
          this.clActes = data;
          this.dataSource.data = data as Clause[];
          console.log(this.clActes);
      });  
  }
  
  onGetLibelle(mun:any){
    this.clActeService.getProduitByActe(mun)
    .subscribe((data: any) => {
      this.acte=data;
      //this.displayclient = true
      //console.log(this.client);
     
        this.acte?.prod_denominationlong;
      
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
    open(dialog: TemplateRef<any>, clause:Clause ) {
     
      this.dialogService.open(
        dialog,
        { context: clause 
            
        });
    }
    onGetLibelleByType(type:String){​​​​​​​​
      //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)
         
       return  (this.listTypes.find(p=>p.id === type))?.value;       
         }​​​​​​​​
    
  /*
    *cette methode nous permet d'ouvrir une 
    * inserer clause acte 
    */
  openAjout() {
    
    this.router.navigateByUrl('home/gestion-clause/add');
  }
  /*
    *cette methode nous permet d'ouvrir une 
    *boite dialogue pour modifier un acte     
    */
  openModif(clActe: Clause) {
    this.transfertData.setData(clActe);
    this.router.navigateByUrl('home/gestion-clause/modif');
  }
  onDeleteContact(id: number) {
    this.clActeService.dellClause(id)
      .subscribe(() => {
        this.toastrService.show(
          'clause acte annulée avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });          
          this.onGetAllClause();
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

