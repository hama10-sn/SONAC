import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Encaissement } from '../../../../model/Encaissement';
import { Intermediaire } from '../../../../model/Intermediaire';
import { EncaissementService } from '../../../../services/encaissement.service';
import { IntermediaireService } from '../../../../services/intermediaire.service';
import dateFormatter from 'date-format-conversion';
import { MatTableDataSource } from '@angular/material/table';
import { Facture } from '../../../../model/Facture';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { PayerCommissionService } from '../../../../services/payerCommission.service';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

@Component({
  selector: 'ngx-payer-commissions',
  templateUrl: './payer-commissions.component.html',
  styleUrls: ['./payer-commissions.component.scss']
})
export class PayerCommissionsComponent implements OnInit {
  intermediaires: Array<Intermediaire> = new Array<Intermediaire>();



  showIntermediaire:boolean = false;
  showListFacture:boolean = false;
  showInterCom:boolean = false;
  showErrorMontantPay: boolean = false;

  error: String;

  MontantCom: number = 0;

  ListInter = [];
  montantPay:number = 0;


  public intermediaireCtrl: FormControl = new FormControl();


  public intermediaireFilterCtrl: FormControl  = new FormControl();


  public filteredIntermediaire: ReplaySubject<Intermediaire[]> = new ReplaySubject<Intermediaire[]>();



  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();


  FormCom = this.fb.group({

    date_debut:  ['', [Validators.required]],
    date_fin:  ['', [Validators.required]],
    mode_paiement:  ['', [Validators.required]],
    intermediaire:  ['', [Validators.required]],
  });

  FormPaiement = this.fb.group({

    typeEncaiss:  ['', [Validators.required]],
    codeBanque:  ['', [Validators.required]],
    numerocheque:  ['', [Validators.required]],
    montant:  ['', [Validators.required]],
  });
  
  public displayedColumns = ['fact_numacte', 'fact_numeropolice', 'fact_numeroacte',
  'fact_numerosouscripteurcontrat','fact_dateeffetcontrat','fact_dateecheancecontrat','fact_montantttc','fact_commissionapporteur','details'];
  public dataSource = new MatTableDataSource<Facture>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource2 = new MatTableDataSource<any>();
  public displayedColumns2 = ['quit_numerointermedaire','inter_denomination', 'somCommission','ListeFactures'];

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  autorisation = [];

  constructor(private dialogService: NbDialogService,private fb: FormBuilder,private intermediaireService: IntermediaireService,
    private encaissementService: EncaissementService, private PayerCommissionService: PayerCommissionService,private authService: NbAuthService,
    private toastrService: NbToastrService,private router: Router) { }

  ngOnInit(): void {

    this.onGetAllItermediaire();

    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }

    });



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


  


  onChangeIntermediaire(event){
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
  }

  submit(){
    this.FormCom.setErrors({'incorrect': true});
    this.MontantCom = 0 ;
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
      this.montantPay = this.MontantCom;
      this.onChangeMontPay(this.montantPay);
      this.FormPaiement.controls['montant'].setValue(this.montantPay);
      }else{
        this.showListFacture = false;
        console.log("2");
        this.dataSource2.data = data ;
        this.showInterCom = true;
        this.ListInter = [];
        for (let i = 0; i < data.length; i++) {
          if(data[i].somCommission != '0'){
          this.ListInter.push({ 'id':data[i].quit_numerointermedaire,'denom':data[i].inter_denomination,'com':data[i].somCommission});
          }
        }
        this.onChangeMontPay2(this.ListInter[0].com);
        this.FormPaiement.controls['montant'].setValue(this.ListInter[0].com);
        
      }
      console.log(this.ListInter);
    });
  }


  onChangeTypeEncaiss(event){
    console.log(event);
    if(event == 'espèce'){
      this.FormPaiement.controls['codeBanque'].clearValidators();
      this.FormPaiement.controls['numerocheque'].clearValidators();
      
      
    }else{
      this.FormPaiement.controls['codeBanque'].setValidators(Validators.required);
      this.FormPaiement.controls['numerocheque'].setValidators(Validators.required);
      
    }
    this.FormPaiement.controls['codeBanque'].updateValueAndValidity();
      this.FormPaiement.controls['numerocheque'].updateValueAndValidity();
    this.FormPaiement.controls['typeEncaiss'].setValue(event);

  }



  onChangeMontPay(montant){

    this.FormPaiement.controls['montant'].setValue('');
    console.log(montant+" "+this.MontantCom);
    if((Number(montant) > Number(this.MontantCom))){
      this.showErrorMontantPay = true;
      this.error = 'border: 1px solid red;';
      this.FormPaiement.controls['montant'].setErrors({});
    }else{
      this.showErrorMontantPay = false;
      this.error = '';
      this.FormPaiement.controls['montant'].setValue(montant);
    }

  }
  onChangeMontPay2(montant){
    console.log('pay2');
    
    console.log(montant+" "+this.MontantCom);
    if((Number(montant) > Number(this.ListInter[0].com))){
      this.showErrorMontantPay = true;
      this.error = 'border: 1px solid red;';
      this.FormPaiement.controls['montant'].setErrors({});
    }else{
      this.showErrorMontantPay = false;
      this.error = '';
      this.FormPaiement.controls['montant'].setValue(montant);
    }

  }

  payer1(){

    //console.log(this.FormPaiement);
    this.PayerCommissionService.PayerCommission(this.FormCom.value,this.FormPaiement.value)
    .subscribe((data : any) => {
      console.log(data);
      this.toastrService.show(
        data.message,
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 0,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('home/gestion-facture');
    },
    (error) => {
      this.toastrService.show(
        error.error.message,
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 0,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
    },
    );

  }

  payer2(){
    this.FormCom.controls['intermediaire'].setValue(this.ListInter[0].id);
    this.PayerCommissionService.PayerCommission(this.FormCom.value,this.FormPaiement.value)
    .subscribe((data : any) => {
      console.log(data);
      this.toastrService.show(
        data.message,
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 0,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        if(this.ListInter.length == 1){
          this.router.navigateByUrl('home/gestion-facture');
        }else{
          this.ListInter.shift();
          this.FormPaiement.controls['montant'].setValue(this.ListInter[0].com);
        this.FormPaiement.controls['montant'].setErrors({});
        }
        
        //this.FormPaiement.reset();
       
        this.FormPaiement.controls['codeBanque'].setValue('');
        this.FormPaiement.controls['numerocheque'].setValue('');
    },
    (error) => {
      this.toastrService.show(
        error.error.message,
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 0,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
    },
    );

  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;
  
  }

}
