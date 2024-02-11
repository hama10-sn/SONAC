import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Acte } from '../../../../model/Acte';
import { Police } from '../../../../model/Police';
import { ActeService } from '../../../../services/acte.service';
import { ClauseService } from '../../../../services/clause.service';
import { PoliceService } from '../../../../services/police.service';
import dateFormatter from 'date-format-conversion';
import { Lot } from '../../../../model/Lot';
import { Marche } from '../../../../model/Marche';
import { LotService } from '../../../../services/lot.service';
import { MarcheService } from '../../../../services/marche.service';
import type  from '../../../data/type.json';

@Component({
  selector: 'ngx-add-clause',
  templateUrl: './add-clause.component.html',
  styleUrls: ['./add-clause.component.scss']
})
export class AddClauseComponent implements OnInit {


  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
 

  autorisation: [];

  addForm = this.fb.group({
    cla_numeroclause: [''],
    cla_codemarche: [''],
    cla_type: ['',[Validators.required]],
    cla_numerolot: [''],
    cla_intituleclause: [''],
  });
  dateComptabilisation: Date;

 // ================ Déclarations des variables pour la recherche avec filtre ======================
// actes: Array<Acte> = new Array<Acte>();
 //polices: Array<Police> = new Array<Police>();
 lots: Array<Lot> = new Array<Lot>();
 marches: Array<Marche> = new Array<Marche>();
 @Input() types:any [] =type;

 /** control for the selected  */
 //public actesCtrl: FormControl = new FormControl();
 //public policesCtrl: FormControl = new FormControl();
 public marchesCtrl: FormControl = new FormControl();
 public lotsCtrl: FormControl = new FormControl();
 public typesCtrl: FormControl = new FormControl();

 /** control for the MatSelect filter keyword */
 //public actesFilterCtrl: FormControl = new FormControl();
 //public policesFilterCtrl: FormControl = new FormControl();
 public lotsFilterCtrl: FormControl = new FormControl();
 public marchesFilterCtrl: FormControl = new FormControl();
 public typesFilterCtrl: FormControl = new FormControl();

 /** list of classifications filtered by search keyword */
 //public filteredActes: ReplaySubject<Acte[]> = new ReplaySubject<Acte[]>();
 //public filteredPolices: ReplaySubject<Police[]> = new ReplaySubject<Police[]>();
 public filteredMarches: ReplaySubject<Marche[]> = new ReplaySubject<Marche[]>();
 public filteredLots: ReplaySubject<Lot[]> = new ReplaySubject<Lot[]>();
 public filteredTypes: ReplaySubject<any[]> = new ReplaySubject<any[]>();

 @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

 /** Subject that emits when the component has been destroyed. */
 protected _onDestroy = new Subject<void>();

 // ========================================== FIN Déclaration ======================================
 listTypes: any [];

  constructor(
    private fb: FormBuilder,
    private authService: NbAuthService,private clauseService: ClauseService,
    private toastrService: NbToastrService,private router: Router,
    private acteService: ActeService, private policeService: PoliceService,
    private lotService: LotService, private marcheService: MarcheService) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

     if (token.isValid()) {
       this.autorisation = token.getPayload().fonctionnalite.split(',');
       console.log(this.autorisation);
     }
   });

  // this.dateComptabilisation = dateFormatter(new Date(),  'yyyy-MM-ddTHH:mm');
   //console.log(this.dateTraite);
  // this.addForm.controls['clact_datecomptabilisation'].setValue(this.dateComptabilisation);

    //this.onGetAllActe();
    //this.onGetAllPolice();
    this.onGetAllMarche();
    this.onGetAllLot();
   this.listTypes=this.types['TYPE_CLAUSE'];
   this.filteredTypes.next(this.listTypes.slice());
   // =================== Listen for search field value changes =======================
   /*this.actesFilterCtrl.valueChanges
   .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
    this.filterActes();
   });

   this.policesFilterCtrl.valueChanges
   .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
    this.filterPolices();
   });*/
   this.lotsFilterCtrl.valueChanges
   .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
    this.filterLots();
   });
   this.marchesFilterCtrl.valueChanges
   .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
    this.filterMarches();
   });
   this.typesFilterCtrl.valueChanges
   .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
    this.filterTypes();
   });

}

ngOnDestroy() {
  this._onDestroy.next();
  this._onDestroy.complete();
}
/*
protected filterActes() {
  console.log(this.actes.filter(cl => cl.act_numero));
  if (!this.actes) {
    return;
  }
  // get the search keyword
  let search = this.actesFilterCtrl.value;
  if (!search) {
    this.filteredActes.next(this.actes.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredActes.next(
    this.actes.filter(cl => cl.act_numero.toString()?.toLowerCase().indexOf(search) > -1  )
    
  );
}*/
protected filterLots() {
  
  if (!this.lots) {
    return;
  }
  // get the search keyword
  let search = this.lotsFilterCtrl.value;
  if (!search) {
    this.filteredLots.next(this.lots.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredLots.next(
    this.lots.filter(l => l.lot_numero.toString()?.toLowerCase().indexOf(search) > -1 )
    
  );
}
protected filterTypes() {
  if (!this.listTypes) {
    return;
  }
  // get the search keyword
  let search = this.typesFilterCtrl.value;
  if (!search) {
    this.filteredTypes.next(this.listTypes.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredTypes.next(
    this.listTypes.filter(typ => typ.id.toLowerCase().indexOf(search) > -1 || 
    typ.value.toString().indexOf(search) > -1)
    
  );
}
protected filterMarches() {
  
  if (!this.marches) {
    return;
  }
  // get the search keyword
  let search = this.marchesFilterCtrl.value;
  if (!search) {
    this.filteredMarches.next(this.marches.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredMarches.next(
    this.marches.filter(ma => ma.march_numero.toString()?.toLowerCase().indexOf(search) > -1  )
    
  );
}
/*
protected filterPolices() {
  if (!this.polices) {
    return;
  }
  // get the search keyword
  let search = this.policesFilterCtrl.value;
  if (!search) {
    this.filteredPolices.next(this.polices.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredPolices.next(
    this.polices.filter(cl => cl.poli_numero.toString()?.toLowerCase().indexOf(search) > -1  )
    
  );
}*/

// ================== FIN IMPLEMENTATION POUR LA RECHERCHE AVEC FILTRE =============================

/*
  onGetAllActe() {
    this.acteService.getAllActes()
      .subscribe((data: Acte[]) => {
        this.actes = data as Acte[];
        this.filteredActes.next(this.actes.slice());
      });
  }
  onGetAllPolice() {
    this.policeService.getAllPolice()
      .subscribe((data: Police[]) => {
        this.polices = data as Police[];
        this.filteredPolices.next(this.polices.slice());
      });
  }*/
  
  onGetAllLot() {
    this.lotService.getAllLots()
      .subscribe((data: Lot[]) => {
        this.lots = data as Lot[];
        this.filteredLots.next(this.lots.slice());
      });
  } 
  onGetAllMarche() {
    this.marcheService.getAllMarches()
      .subscribe((data: Marche[]) => {
        this.marches = data as Marche[];
        this.filteredMarches.next(this.marches.slice());
      });
  }
  submit() { 
    this.clauseService.addClause(this.addForm.value)
    .subscribe((data) => {
      console.log(data);
      this.toastrService.show(
        data.message,
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('home/gestion-clause');
    },
    (error) => {
      this.toastrService.show(
        error.error.message,
        'Notification d\'erreur',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
    },
    );
      }
      cancel() {
        this.router.navigateByUrl('home/gestion-clause')
      }
      
      onChangePolice(event) {
        this.addForm.controls['clact_numeropolice'].setValue(event.value);
      }
      onChangeActe(event) {

        this.addForm.controls['clact_numeroacte'].setValue(event.value);
      }
      onChangeMarche(event){
        this.addForm.controls['cla_codemarche'].setValue(event.value)
      }      
      onChangeLot(event) {
        this.addForm.controls['cla_numerolot'].setValue(event.value);
      }
      onGetLibelleByType(type:String){​​​​​​​​
        //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)
           
         return  (this.listTypes.find(p=>p.id === type))?.value;       
           }​​​​​​​​

      onChangeClause(event) {
        this.addForm.controls['cla_type'].setValue(event.value);
      }
      onChangeText1(event){
        
        this.addForm.controls['clact_texteclause1'].setValue(event.target.value);
      }

      onChangeText2(event){
        
        this.addForm.controls['clact_texteclause2'].setValue(event.target.value);
      }


      check_fonct(fonct: String) {

        let el = this.autorisation.findIndex(itm => itm === fonct);
        if (el === -1)
         return false;
        else
         return true;
    
      }
}
