import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Acte } from '../../../model/Acte';
import { Police } from '../../../model/Police';
import { Produit } from '../../../model/Produit';
import { ActeService } from '../../../services/acte.service';
import { ClientService } from '../../../services/client.service';
import { PoliceService } from '../../../services/police.service';
import { ProduitService } from '../../../services/produit.service';
import { TransfertDataService } from '../../../services/transfertData.service';
import type  from '../../data/type.json';

@Component({
  selector: 'ngx-gestion-acte',
  templateUrl: './gestion-acte.component.html',
  styleUrls: ['./gestion-acte.component.scss']
})
export class GestionActeComponent implements OnInit {

  poli: any;
  polices: Array<Police> = new Array<Police>();
  produits: Array<Produit> = new Array<Produit>();
  actes : Array<Acte> = new Array<Acte>();

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  @Input() types:any [] =type;
  listActes:any[];
// ne pas mettre garantie dans ces interface descrition marcher aussi
  public displayedColumns = ['act_numeropolice', 'act_numero', 'act_typemarche',
   /* 'act_idcontractante', */'act_capitalassure','details'/* , 'update','affecter', 'clause' */];
   public dataSource = new MatTableDataSource<Acte>();
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   autorisation=[];
  
  constructor(private acteService: ActeService, private transfertData: TransfertDataService,
    private dialogService: NbDialogService,private toastrService: NbToastrService,
     private authService: NbAuthService, private router: Router,private clientService: ClientService,
     private policeService: PoliceService,private produitService: ProduitService) { }

  ngOnInit(): void {
    
    this.authService.onTokenChange()
     .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }
    });
    this.listActes=this.types['TYPE_ACTE'];
    this.onGetAllActe();
    console.log();
    this.onGetAllPolice();
    this.onGetAllProduits();
  }
  onGetAllActe(){
    this.acteService.getAllActes()
      .subscribe((data: Acte[]) => {
          this.actes = data;
          this.dataSource.data = data as Acte[];
          console.log(this.actes);
      });  
  }
  onGetAllPolice() {
    this.policeService.getAllPolice()
      .subscribe((data: Police[]) => {
        this.polices = data as Police[];
        this.polices = data ;
      //  console.log(this.polices);
      });
  }
  /* onGetProduitByPolice(polic: Number) {
    this.produitService.getProduitByPolice(polic)
      .subscribe((data: any) => {
         // console.log(data.prod_denominationcourt);
        return data.prod_denominationcourt ;
      });
  } */
  onGetTypeByActe(type:Number){​​​​​​​​
    //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)
     //  console.log((this.polices.find(p=>p.poli_numero === type))?.poli_codeproduit);
      // console.log(type);
     return  (this.listActes.find(p=>p.id === type))?.value;       
       }
  onGetProduitByPolice(type:Number){​​​​​​​​
    //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)
     //  console.log((this.polices.find(p=>p.poli_numero === type))?.poli_codeproduit);
       //console.log(this.polices);
     return  (this.polices.find(p=>p.poli_numero === type))?.poli_codeproduit;       
       }
      /*  onGetLibelleByacte(type:Number){​​​​​​​​
        //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)
         //  console.log((this.polices.find(p=>p.poli_numero === type))?.poli_codeproduit);
         //  console.log(this.polices);
         return  (this.actes.find(p=>p.poli_numero === type))?.poli_codeproduit;       
           } */
       
             onGetAllProduits() {
              this.produitService.getAllProduits()
              .subscribe( (data: Produit[]) => {
                this.produits = data ;
              }) ;
            }
          
            onGetLibelleByProduit(numero:number){
             // console.log((this.produits.find(c => c.prod_numero === numero))?.prod_denominationlong);
              return  (this.produits.find(c => c.prod_numero === numero))?.prod_denominationlong ;
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
    open(dialog: TemplateRef<any>, acte:any ) {
     
      this.produitService.getProduitByPolice(acte.act_numeropolice)
      .subscribe((data: any) => {
        acte.p=data;
      });

      this.clientService.getClientByPolice(acte.act_numeropolice)
      .subscribe((data: any) => {
        acte.cl=data;
      });

      this.dialogService.open(
        dialog,
        { context: acte 
            
        });
    }
    onOpenActe(dialog: TemplateRef<any>, acte: Acte) {
      
      this.dialogService.open(
        dialog,
        { context: acte,
         });
    }

    
  /*
    *cette methode nous permet d'ouvrir une 
    * inserer un acte 
    */
  openAjout() {
    
    this.router.navigateByUrl('home/gestion-acte/add-acte');
  }
  
  openCheck(acte: any) {
    this.transfertData.setData(acte.act_numero);    
    this.router.navigateByUrl('home/affecter-clause');
  }
  /*
    *cette methode nous permet d'ouvrir une 
    *boite dialogue pour modifier un acte     
    */
  openModif(acte: Acte) {
    this.transfertData.setData(acte);
    //this.router.navigateByUrl('home/gestion-acte/modif-acte');
  }
  onDeleteContact(id: number) {
    this.acteService.dellActe(id)
      .subscribe(() => {
        this.toastrService.show(
          'Acte annulée avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });          
          this.onGetAllActe();
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
