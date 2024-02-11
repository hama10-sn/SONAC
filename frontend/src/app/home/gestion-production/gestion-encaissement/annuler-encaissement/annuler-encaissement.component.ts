import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Client } from '../../../../model/Client';
import { Encaissement } from '../../../../model/Encaissement';
import { Facture } from '../../../../model/Facture';
import { Police } from '../../../../model/Police';
import { Quittance } from '../../../../model/Quittance';
import { ClientService } from '../../../../services/client.service';
import { EncaissementService } from '../../../../services/encaissement.service';
import { FactureService } from '../../../../services/facture.service';
import { PoliceService } from '../../../../services/police.service';
import { QuittanceService } from '../../../../services/quittance.service';

@Component({
  selector: 'ngx-annuler-encaissement',
  templateUrl: './annuler-encaissement.component.html',
  styleUrls: ['./annuler-encaissement.component.scss']
})
export class AnnulerEncaissementComponent implements OnInit {

  clientss: Array<Client> = new Array<Client>();
  factures: Array<Facture> = new Array<Facture>();
  polices: Array<Police> = new Array<Police>();
  quittances: Array<Quittance> = new Array<Quittance>();
  encaissements: Array<Encaissement> = new Array<Encaissement>();

  facture: Facture;

  showFacture: boolean = false;
  showErrorProductionFacture: boolean = false;
  showListEncaissement: boolean = false;
  showPasEncaiss:boolean = false;
  validAnnul:boolean = false;

  numcli:any;
  numpol:any;
  numFact:any;
  numQuit:any;

  listEncAnnul = [];

  autorisation = [];

  addForm = this.fb.group({

    numerofacture:  ['', [Validators.required]],
    numeropolice:  ['', [Validators.required]],
    numeroclient :  ['', [Validators.required]],
    numeroquittance :  ['', [Validators.required]],
    typeAnnulation :  ['', [Validators.required]],


});



  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';


  public clientsCtrl: FormControl = new FormControl();
  public factureCtrl: FormControl = new FormControl();
  public policeCtrl: FormControl = new FormControl();
  public quittanceCtrl: FormControl = new FormControl();

  public clientsFilterCtrl: FormControl = new FormControl();
  public factureFilterCtrl: FormControl  = new FormControl();
  public policeFilterCtrl: FormControl  = new FormControl();
  public quittanceFilterCtrl: FormControl  = new FormControl();

  
  public filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>();
  public filteredFacture: ReplaySubject<Facture[]> = new ReplaySubject<Facture[]>();
  public filteredPolice: ReplaySubject<Police[]> = new ReplaySubject<Police[]>();
  public filteredQuittance: ReplaySubject<Quittance[]> = new ReplaySubject<Quittance[]>();

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder,private authService:NbAuthService,private router: Router,
    private toastrService: NbToastrService,private dialogService: NbDialogService,
    private clientService:ClientService
    , private factureService: FactureService
    , private policeService: PoliceService
    , private quittanceService: QuittanceService,
    private encaissementService: EncaissementService) { }

  ngOnInit(): void {

    this.onGetAllClients();
    //this.onGetAllFacture();
    //this.onGetAllPolice();
      
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        
      }

    });
   

    this.clientsFilterCtrl.valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.filterClients();
  });



      this.factureFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererFactures();
      });

      this.policeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererPolices();
      });
      this.quittanceFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererQuittances();
      });

  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
   }

   protected filterClients() {
    
    if (!this.clientss) {
      return;
    }
    
    // get the search keyword
    let search = this.clientsFilterCtrl.value;
    if (!search) {
      this.filteredClients.next(this.clientss.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredClients.next(
      this.clientss.filter(cl => cl.clien_prenom?.toLowerCase().indexOf(search) > -1 ||
       cl.clien_nom?.toLowerCase().indexOf(search) > -1 ||
       cl.clien_sigle?.toLowerCase().indexOf(search) > -1 ||
       cl.clien_denomination?.toLowerCase().indexOf(search) > -1|| 
       cl.clien_numero?.toString().indexOf(search) > -1
      )
      
    );
   }

   protected filtererFactures() {
    if (!this.factures) {
      return;
    }
    // get the search keyword
    let search = this.factureFilterCtrl.value;
    if (!search) {
      this.filteredFacture.next(this.factures.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredFacture.next(
      this.factures.filter(c => c.fact_numacte.toString().indexOf(search) > -1 )
    );
  }


  protected filtererPolices() {
    if (!this.polices) {
      return;
    }
    // get the search keyword
    let search = this.policeFilterCtrl.value;
    if (!search) {
      this.filteredPolice.next(this.polices.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPolice.next(
      this.polices.filter(c => c.poli_numero.toString().indexOf(search) > -1 ) 
    );
  }

  protected filtererQuittances() {
    if (!this.quittances) {
      return;
    }
    // get the search keyword
    let search = this.quittanceFilterCtrl.value;
    if (!search) {
      this.filteredQuittance.next(this.quittances.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredQuittance.next(
      this.quittances.filter(c => c.quit_numero.toString().indexOf(search) > -1 ) 
    );
  }

  onChangeClient(event){
    this.policeCtrl.setValue("");
    this.showErrorProductionFacture = false;
    this.showFacture = false;
    this.polices = [];
    this.factures = [];
    this.numpol = 0;
    this.numFact = 0;
    this.numcli = event.value;
    this.addForm.controls['numeroclient'].setValue(event.value);
    this.addForm.controls['numerofacture'].setValue(null);
    this.addForm.controls['numeropolice'].setValue(null);
    this.onGetAllPolice(this.numcli);
    //this.onGetAllFacture(this.numpol);
    
  }
  onChangeFacture(event) {
    this.numFact = event.value;
    this.numpol = 0;
    this.numcli = 0;
    //this.onGetFacture(event.value);
    //this.isProductFacture(event.value);
    this.onGetAllQuittance(event.value);
    this.onGetEncaissements(event.value);
    this.addForm.controls['numerofacture'].setValue(event.value);
    
    
  }

  onChangeQuittance(event){
    //this.addForm.controls['numeroquittance'].setValue(event.value);
    //this.numQuit = event.value;
    
  }
  onChangeTypeAnnul(event){
    this.addForm.controls['typeAnnulation'].setValue(event);
  }


  onChangePolice(event) {
    this.factureCtrl.setValue("");
    this.quittanceCtrl.setValue("");
    this.showErrorProductionFacture = false;
    this.showFacture = false;
    this.factures = [];
    this.numcli = 0;
    this.numFact = 0;
    this.numpol = event.value;
    this.addForm.controls['numeropolice'].setValue(event.value);
    this.addForm.controls['numerofacture'].setValue(null);
    this.onGetAllFacture(this.numpol);
    this.showFacture = false;
    this.numFact = '';
    
  }

  onChecked(event,enc){
    if(event.target.checked){
      this.listEncAnnul.push(enc.encai_numeroencaissement);
    }else{
      const pos = this.listEncAnnul.indexOf(enc.encai_numeroencaissement);
      this.listEncAnnul.splice(pos,1);
    }
    if(this.listEncAnnul.length > 0 && this.addForm.controls['typeAnnulation'].value != ''){
      this.validAnnul = true;
    }else{
      this.validAnnul = false;
    }

    console.log(this.listEncAnnul);
    
  }


  onGetAllClients(){
    this.clientService.getAllClients()
    .subscribe((data: Client[]) => {
      this.clientss = data as Client[];      
      this.filteredClients.next(this.clientss.slice());
    });
  }
  onGetAllQuittance(numfact){
    this.quittanceService.getQuittanceFact(numfact)
    .subscribe((data: Quittance) => {
      this.quittances =[data];      
      
      this.filteredQuittance.next(this.quittances.slice());
    });
  }


  onGetAllFacture(numpol){
    this.factureService.getAllFacturesPolice(numpol)
    .subscribe((data: Facture[]) => {
      this.factures = data as Facture[];      
      this.filteredFacture.next(this.factures.slice());
    });
  }

  onGetAllPolice(numcli){
    this.policeService.getAllpoliceClient(numcli)
    .subscribe((data: Police[]) => {
      this.polices = data as Police[];      
      this.filteredPolice.next(this.polices.slice());
    });
  }

  onGetFacture(numerofacture){
    this.factureService.getFacture(numerofacture)
    .subscribe((data: Facture) => {
      this.facture = data;
      this.showFacture = true;
      console.log(this.facture);
    });
  }
 /* isProductFacture(numerofacture){
      this.factureService.isProductFacture(numerofacture)
      .subscribe((data)=> {
        if(data != 1){
          this.showErrorProductionFacture = true;
          this.addForm.controls['numerofacture'].setErrors({});
        }else{
          this.showErrorProductionFacture = false;
          this.addForm.controls['numerofacture'].setErrors(null);
          this.addForm.controls['numerofacture'].setValue(numerofacture);
        }
      });
  }*/

  onGetEncaissements(numFact){
    this.encaissementService.getAllEncaissementFact(numFact)
    .subscribe((data: Encaissement[]) => {
      if(data[0] == null){
        this.showListEncaissement = false;
        this.showPasEncaiss = true;
        this.addForm.controls['numeroquittance'].setValue(null);
      }else{
        this.addForm.controls['numeroquittance'].setValue(data[0].encai_numeroquittance);
        this.showPasEncaiss = false;
        this.encaissements = data ;
      this.showListEncaissement = true;
      }
      
      console.log(data);
    });
  }
  openDialog(dialog: TemplateRef<any>){
    this.dialogService.open(dialog);
  }


  /* submit(){
    this.encaissementService.annulerEncaiss(this.listEncAnnul)
    .subscribe((data: any) => {
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
        this.router.navigateByUrl('home/gestion-encaissement');
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
  } */
  
  submit(){
    console.log(this.addForm.controls['typeAnnulation'].value)
    this.encaissementService.annulerEncaiss(this.listEncAnnul, this.addForm.controls['typeAnnulation'].value)
    .subscribe((data: any) => {
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
        this.router.navigateByUrl('home/gestion-encaissement');
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
