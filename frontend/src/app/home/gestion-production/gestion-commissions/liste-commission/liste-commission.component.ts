import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NbDialogService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Facture } from '../../../../model/Facture';
import { Intermediaire } from '../../../../model/Intermediaire';
import { EncaissementService } from '../../../../services/encaissement.service';
import { IntermediaireService } from '../../../../services/intermediaire.service';

@Component({
  selector: 'ngx-liste-commission',
  templateUrl: './liste-commission.component.html',
  styleUrls: ['./liste-commission.component.scss']
})
export class ListeCommissionComponent implements OnInit {
  intermediaires: Array<Intermediaire> = new Array<Intermediaire>();

  autorisation = [];

  showIntermediaire:boolean = false;
  showListFacture:boolean = false;
  showInterCom:boolean = false;

  MontantCom: number = 0;


  public intermediaireCtrl: FormControl = new FormControl();


  public intermediaireFilterCtrl: FormControl  = new FormControl();


  public filteredIntermediaire: ReplaySubject<Intermediaire[]> = new ReplaySubject<Intermediaire[]>();



  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();


  FormCom = this.fb.group({

    date_debut:  ['', [Validators.required]],
    date_fin:  ['', [Validators.required]],
    mode_paiement:  [''],
    //intermediaire:  ['', [Validators.required]],
  });
  
  public displayedColumns = ['fact_numacte', 'fact_numeropolice', 'fact_numeroacte',
  'fact_numerosouscripteurcontrat','fact_dateeffetcontrat','fact_dateecheancecontrat','fact_montantttc','fact_commissionapporteur','details'];
  public dataSource = new MatTableDataSource<Facture>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource2 = new MatTableDataSource<any>();
  public displayedColumns2 = ['quit_numerointermedaire','inter_denomination', 'somCommission'/* ,'ListeFactures' */];

  constructor(private dialogService: NbDialogService,private fb: FormBuilder,private intermediaireService: IntermediaireService,
    private encaissementService: EncaissementService) { }

  ngOnInit(): void {

    this.onGetAllItermediaire();


    this.FormCom.controls['mode_paiement'].setValue("2");


    this.intermediaireFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererIntermediaires();
      });

  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
   }



   protected filtererIntermediaires() {
    if (!this.intermediaires) {
      return;
    }
    // get the search keyword
    let search = this.intermediaireFilterCtrl.value;
    if (!search) {
      this.filteredIntermediaire.next(this.intermediaires.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredIntermediaire.next(
      this.intermediaires.filter(c => c.inter_denomination.toLowerCase().indexOf(search) > -1 ||
       c.inter_numero.toString().toLowerCase().indexOf(search) > -1 ) 
    );
  }

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


  open(dialog: TemplateRef<any>, fact:Facture ) {
     
    this.dialogService.open(
      dialog,
      { context: fact 
          
      });
  }
  openListFact(dialog: TemplateRef<any>, numInter){
    this.FormCom.controls['intermediaire'].setValue(numInter);
    this.encaissementService.GetCommission(this.FormCom.value)
    .subscribe((data: any) => {
      this.dataSource.data = data as Facture[];
      console.log(data);
      this.dialogService.open(dialog, { context : this.dataSource });
    });
    
  }


  onGetAllItermediaire(){
    this.intermediaireService.getAllIntermediaires()
    .subscribe((data: Intermediaire[]) => {
      this.intermediaires = data as Intermediaire[];      
      this.filteredIntermediaire.next(this.intermediaires.slice());
    });
  }


  


  /* onChangeIntermediaire(event){
    this.FormCom.controls['intermediaire'].setValue(event.value);
  }

  onChangeMode(event){
    console.log(event);
    this.FormCom.controls['mode_paiement'].setValue(event);
    if(event == "1"){
      this.showIntermediaire = true;
      this.FormCom.controls['intermediaire'].setValidators(Validators.required);
      this.FormCom.controls['intermediaire'].updateValueAndValidity();
    }else{
      this.showIntermediaire = false;
      this.FormCom.controls['intermediaire'].clearValidators();
      this.FormCom.controls['intermediaire'].updateValueAndValidity();
    }
  } */

  submit(){
    console.log(this.FormCom.value);
    //this.FormCom.controls['date_debut'].setValue(dateFormatter(this.FormCom.controls['date_debut'].value) , 'yyyy-MM-dd');
    //this.FormCom.controls['date_fin'].setValue(dateFormatter(this.FormCom.controls['date_fin'].value) , 'yyyy-MM-dd');
    this.encaissementService.payerCommission(this.FormCom.value)
    .subscribe((data: any) => {
      console.log(data);
      if(this.FormCom.controls['mode_paiement'].value == "1"){
        this.showListFacture = true;
        this.showInterCom = false;
      this.dataSource.data = data as Facture[];
      for (let i = 0; i < data.length; i++) {
        this.MontantCom += Number(data[i].fact_commissionapporteur);
        
      }
      }else{
        this.showListFacture = false;
        console.log("2");
        this.dataSource2.data = data ;
        this.showInterCom = true;
      }
     
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
