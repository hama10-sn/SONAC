import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Acte } from '../../../../model/Acte';
import { Avenant } from '../../../../model/Avenant';
import { Engagement } from '../../../../model/Engagement';
import { Police } from '../../../../model/Police';
import { User } from '../../../../model/User';
import { ActeService } from '../../../../services/acte.service';
import { AvenantService } from '../../../../services/avenant.service';
import { EngagementService } from '../../../../services/engagement.service';
import { MainLeveService } from '../../../../services/main-leve.service';
import { PoliceService } from '../../../../services/police.service';
import { UserService } from '../../../../services/user.service';
import dateFormatter from 'date-format-conversion';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { MainLeve } from '../../../../model/MainLeve';
import { FormatNumberService } from '../../../../services/formatNumber.service';

@Component({
  selector: 'ngx-add-mainleve',
  templateUrl: './add-mainleve.component.html',
  styleUrls: ['./add-mainleve.component.scss']
})
export class AddMainleveComponent implements OnInit {

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  login:any;
  user: User;
  autorisation: [];
  engage: Engagement;
  mainLeve: MainLeve;
eng:any;
mntt:any;
  montt:any;
  monttLib:any;
  verifLib: boolean = true;
  formatcapitalassure: Number;

  addForm = this.fb.group({
    
    mainl_id: [''],
    mainl_numpoli: ['',[Validators.required]],
    mainl_numeroavenant: ['',[Validators.required]],
    mainl_numeroacte: ['',[Validators.required]],
    mainl_numeroengagement: ['',[Validators.required]],
    mainl_nummainlevee: [''],
    mainl_mtnmainlevee: ['',[Validators.required]],
    mainl_datemainlevee: ['',[Validators.required]],
    mainl_ccutil: [''],
    mainl_datesasisie: [''],
    mainl_status: [''],
    });
 
    avenants: Array<Avenant> = new Array<Avenant>();
    polices: Array<Police> = new Array<Police>();
    actes: Array<Acte> = new Array<Acte>();
    engagements: Array<Engagement> = new Array<Engagement>();

    public actesCtrl: FormControl = new FormControl();
    public policesCtrl: FormControl = new FormControl();
    public avenantsCtrl: FormControl = new FormControl();
    public engagementsCtrl: FormControl = new FormControl();
    
 public actesFilterCtrl: FormControl = new FormControl();
 public policesFilterCtrl: FormControl = new FormControl();
 public avenantsFilterCtrl: FormControl = new FormControl();
 public engagementsFilterCtrl: FormControl = new FormControl();

 public filteredActes: ReplaySubject<Acte[]> = new ReplaySubject<Acte[]>();
 public filteredPolices: ReplaySubject<Police[]> = new ReplaySubject<Police[]>();
 public filteredAvenants: ReplaySubject<Avenant[]> = new ReplaySubject<Avenant[]>();
 public filteredEngagements: ReplaySubject<Engagement[]> = new ReplaySubject<Engagement[]>();

 @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

 dateSaisie: Date;
 protected _onDestroy = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: NbAuthService,private mainLeveService: MainLeveService,
    private toastrService: NbToastrService,private router: Router,
    private acteService: ActeService, private policeService: PoliceService,
    private userService: UserService, private avenantService: AvenantService,
    private engagementService: EngagementService, private mainleveService: MainLeveService,
    private transfertData: TransfertDataService,private formatNumberService: FormatNumberService
    ) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

     if (token.isValid()) {
       this.autorisation = token.getPayload().fonctionnalite.split(',');
       console.log(this.autorisation);
     }
   });
   this.getlogin();
   /* this.dateTraite = dateFormatter(new Date(),  'yyyy-MM-ddTHH:mm');
   //console.log(this.dateTraite);
   this.addForm.controls['reass_datetraite1'].setValue(this.dateTraite); */
   //this.dateSaisie= dateFormatter(new Date(),  'yyyy-MM-ddTHH:mm');
this.onGetAllEngagement();

   this.engage=this.transfertData.getData();
   
  
   this.addForm.controls['mainl_numeroengagement'].setValue(this.engage.engag_numeroengagement);
   //console.log((this.engagements.find(p => p.engag_numeroengagement == this.numero_engagement))?.engag_numpoli);
   this.addForm.controls['mainl_datemainlevee'].setValue(dateFormatter(new Date(), 'yyyy-MM-ddTHH:mm'));   
   if(this.engage.engag_kapassure==null){
    this.monttLib=0
   }else{
    
   this.monttLib=this.engage.engag_capitalliberationengage;

   }
   this.montt=this.engage.engag_kapassure;
   this.addForm.controls['mainl_numpoli'].setValue(this.engage.engag_numpoli);
      this.addForm.controls['mainl_numeroacte'].setValue(this.engage.engag_numeroacte);
      this.addForm.controls['mainl_numeroavenant'].setValue(this.engage.engag_numeroavenant);
       
    
    this.onGetAllActe();
    this.onGetAllPolice();
    this.onGetAllAvenant();
    this.actesFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
     this.filterActes();
    });
 
    this.policesFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
     this.filterPolices();
    });
 
    this.avenantsFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
     this.filterAvenants();
    });
    this.engagementsFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
     this.filterEngagements();
    });
 }
 
 ngOnDestroy() {
   this._onDestroy.next();
   this._onDestroy.complete();
 }
 getlogin(): any {
   this.authService.getToken()
     .subscribe((token: NbAuthJWTToken) => {
       if (token.isValid()) {
         this.login = token.getPayload();
         this.userService.getUser(this.login.sub)
     .subscribe((data: User) => {
       this.user = data;
       //console.log(this.user);
     });
       }
     });
 }
 
 protected filterEngagements() {
   if (!this.engagements) {
     return;
   }
   // get the search keyword
   let search = this.engagementsFilterCtrl.value;
   if (!search) {
     this.filteredEngagements.next(this.engagements.slice());
     return;
   } else {
     search = search.toLowerCase();
   }
   this.filteredEngagements.next(
     this.engagements.filter(eng => eng.engag_numeroengagement.toString().toLowerCase().indexOf(search) > -1 )
     
   );
 }
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
 }
 protected filterAvenants() {
   
   if (!this.avenants) {
     return;
   }
   // get the search keyword
   let search = this.avenantsFilterCtrl.value;
   if (!search) {
     this.filteredAvenants.next(this.avenants.slice());
     return;
   } else {
     search = search.toLowerCase();
   }
   this.filteredAvenants.next(
     this.avenants.filter(l => l.aven_numeroavenant.toString()?.toLowerCase().indexOf(search) > -1 )
     
   );
 }
 
 
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
 }
 
 onGetAllActe() {
  this.acteService.getAllActes()
    .subscribe((data: Acte[]) => {
      this.actes = data as Acte[];
      this.filteredActes.next(this.actes.slice());
    });
}
onGetAllEngagement() {
  this.engagementService.getAllEngagements()
    .subscribe((data: Engagement[]) => {
      this.engagements = data as Engagement[];
      this.filteredEngagements.next(this.engagements.slice());
      console.log(this.engagements);
    });
}
onGetAllPolice() {
  this.policeService.getAllPolice()
    .subscribe((data: Police[]) => {
      this.polices = data as Police[];
      this.filteredPolices.next(this.polices.slice());
    });
}

onGetAllAvenant() {
  this.avenantService.getAllAvenants()
    .subscribe((data: Avenant[]) => {
      this.avenants = data as Avenant[];
      this.filteredAvenants.next(this.avenants.slice());
      console.log(this.avenants);
    });
} 

onChangeFocusMontant(event: any){
  
  this.eng=event.target.value;
  console.log(event.target.value);
  //this.addForm.controls['mainl_mtnmainlevee'].setValue("");
  this.formatcapitalassure = Number(this.formatNumberService.replaceAll((event.target.value),' ',''));
  if(this.montt >=  this.formatcapitalassure && this.formatcapitalassure !=null){
    //this.addForm.controls['mainl_mtnmainlevee'].setValue(this.eng);
    console.log(this.formatcapitalassure);
    this.addForm.controls['mainl_mtnmainlevee'].setValue(this.formatNumberService.numberWithCommas2( this.formatcapitalassure));
    console.log(this.formatNumberService.numberWithCommas2( this.formatcapitalassure));
    this.verifLib= true;
  }else if(this.montt <  this.formatcapitalassure && this.formatcapitalassure !=null){
    this.addForm.controls['mainl_mtnmainlevee'].setValue(this.formatNumberService.numberWithCommas2( this.formatcapitalassure));
    this.verifLib= false;
  }
}
/* 
onFocusOutEventCapitalAssure() {
  this.formatcapitalassure = Number(this.formatNumberService.replaceAll((this.addForm.get("engag_kapassure").value),' ',''));
  console.log( this.formatcapitalassure);
  if (this.formatcapitalassure !=null){
    console.log( this.formatNumberService.numberWithCommas2( this.formatcapitalassure));
   this.addForm.controls['engag_kapassure'].setValue(this.formatNumberService.numberWithCommas2( this.formatcapitalassure));
  }
}  */
submit() { 
  this.addForm.controls['mainl_datesasisie'].setValue(new Date());
  this.addForm.controls['mainl_mtnmainlevee'].setValue(this.formatcapitalassure);
  this.addForm.controls['mainl_ccutil'].setValue(this.user.util_numero);
  this.mainleveService.addMainLeve(this.addForm.value)
  .subscribe((data:any) => {
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
      this.router.navigateByUrl('home/gestion-mainleve');
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
      this.router.navigateByUrl('home/gestion-mainleve')
    }
    onChangePolice(event) {
      this.addForm.controls['mainl_numpoli'].setValue(event.value);
    }
    onChangeEngagement(event) {
      //console.log(event.value);
     
      this.addForm.controls['mainl_numeroengagement'].setValue(event.value);

      this.addForm.controls['mainl_numpoli'].setValue((this.engagements.find(p => p.engag_numeroengagement == event.value))?.engag_numpoli);
      this.addForm.controls['mainl_numeroacte'].setValue((this.engagements.find(p => p.engag_numeroengagement == event.value))?.engag_numeroacte);
      this.addForm.controls['mainl_numeroavenant'].setValue((this.engagements.find(p => p.engag_numeroengagement == event.value))?.engag_numeroavenant);
          

    }
    
    onChangeActe(event) {

      this.addForm.controls['mainl_numeroacte'].setValue(event.value);
    }
    onChangeAvenant(event) {
      this.addForm.controls['mainl_numeroavenant'].setValue(event.value);
    }

    check_fonct(fonct: String) {

      let el = this.autorisation.findIndex(itm => itm === fonct);
      if (el === -1)
       return false;
      else
       return true;
  
    }
}
