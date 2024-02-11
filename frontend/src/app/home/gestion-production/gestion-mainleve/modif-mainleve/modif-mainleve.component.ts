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
import { MainLeve } from '../../../../model/MainLeve';
import { Police } from '../../../../model/Police';
import { User } from '../../../../model/User';
import { ActeService } from '../../../../services/acte.service';
import { AvenantService } from '../../../../services/avenant.service';
import { EngagementService } from '../../../../services/engagement.service';
import { MainLeveService } from '../../../../services/main-leve.service';
import { PoliceService } from '../../../../services/police.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { UserService } from '../../../../services/user.service';
import dateFormatter from 'date-format-conversion';

@Component({
  selector: 'ngx-modif-mainleve',
  templateUrl: './modif-mainleve.component.html',
  styleUrls: ['./modif-mainleve.component.scss']
})
export class ModifMainleveComponent implements OnInit {
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  mainleve: MainLeve;
  autorisation: [];
  login:any;
  user: User;

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

modifForm = this.fb.group({
    
  mainl_id: [''],
  mainl_numpoli: ['',[Validators.required]],
  mainl_numeroavenant: ['',[Validators.required]],
  mainl_numeroacte: ['',[Validators.required]],
  mainl_numeroengagement: ['',[Validators.required]],
  mainl_nummainlevee: ['',[Validators.required]],
  mainl_mtnmainlevee: ['',[Validators.required]],
  mainl_datemainlevee: ['',[Validators.required]],
  mainl_ccutil: [''],
  mainl_datesasisie: [''],
  mainl_status: [''],
  });

  constructor(
    private fb: FormBuilder,private transfertData: TransfertDataService,
    private authService: NbAuthService,private mainLeveService: MainLeveService,
    private toastrService: NbToastrService,private router: Router,
    private acteService: ActeService, private policeService: PoliceService,
    private userService: UserService, private avenantService: AvenantService,
    private engagementService: EngagementService, private mainleveService: MainLeveService
    ) { }

  ngOnInit(): void {
    this.mainleve = this.transfertData.getData();
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

     if (token.isValid()) {
       this.autorisation = token.getPayload().fonctionnalite.split(',');
       console.log(this.autorisation);
     }
   });
   this.onGetAllEngagement();
   this.onGetAllActe();
   this.onGetAllPolice();
   this.onGetAllAvenant();
   this.getlogin();

   this.policesCtrl.setValue(this.mainleve.mainl_numpoli.toString());
   this.modifForm.controls['mainl_numpoli'].setValue(this.mainleve.mainl_numpoli);
   this.avenantsCtrl.setValue(this.mainleve.mainl_numeroavenant.toString());
   this.modifForm.controls['mainl_numeroavenant'].setValue(this.mainleve.mainl_numeroavenant);
   this.actesCtrl.setValue(this.mainleve.mainl_numeroavenant.toString());
   this.modifForm.controls['mainl_numeroacte'].setValue(this.mainleve.mainl_numeroacte);
   this.engagementsCtrl.setValue(this.mainleve.mainl_numeroavenant.toString());
   this.modifForm.controls['mainl_numeroengagement'].setValue(this.mainleve.mainl_numeroengagement);
   this.modifForm.controls['mainl_nummainlevee'].setValue(this.mainleve.mainl_nummainlevee);
   this.dateSaisie = dateFormatter(this.mainleve.mainl_datemainlevee,  'yyyy-MM-ddThh:mm') ;
   this.modifForm.controls['mainl_datemainlevee'].setValue(this.dateSaisie);
   this.modifForm.controls['mainl_mtnmainlevee'].setValue(this.mainleve.mainl_mtnmainlevee);
   this.modifForm.controls['mainl_datesasisie'].setValue(this.mainleve.mainl_datesasisie);
  
  /* 
        this.datetraite = dateFormatter(this.reassureur.reass_datetraite1,  'yyyy-MM-ddThh:mm') ;
        this.modifForm.controls['reass_datetraite1'].setValue(this.datetraite);
  
  this.siegeCtrl.setValue(this.groupe.group_siege.toString());
   this.modifForm.controls['group_siege'].setValue(this.groupe.group_siege);
   */ 
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
}onGetAllEngagement() {
  this.engagementService.getAllEngagements()
    .subscribe((data: Engagement[]) => {
      this.engagements = data as Engagement[];
      this.filteredEngagements.next(this.engagements.slice());
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
submit() { 
  //this.modifForm.controls['mainl_datesasisie'].setValue(new Date());
  
  this.modifForm.controls['mainl_ccutil'].setValue(this.user.util_numero);
  this.mainleveService.modifMainLeve(this.modifForm.value)
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
      this.modifForm.controls['mainl_numpoli'].setValue(event.value);
    }
    onChangeEngagement(event) {
      //console.log(event.value);
      this.modifForm.controls['mainl_numeroengagement'].setValue(event.value);

    }
    
    onChangeActe(event) {

      this.modifForm.controls['mainl_numeroacte'].setValue(event.value);
    }
    onChangeAvenant(event) {
      this.modifForm.controls['mainl_numeroavenant'].setValue(event.value);
    }

    check_fonct(fonct: String) {

      let el = this.autorisation.findIndex(itm => itm === fonct);
      if (el === -1)
       return false;
      else
       return true;
  
    }
}
