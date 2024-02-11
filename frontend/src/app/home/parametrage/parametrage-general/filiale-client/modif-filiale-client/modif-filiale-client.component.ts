import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { NbGlobalPosition, NbGlobalPhysicalPosition, NbComponentStatus, NbToastrService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Client } from '../../../../../model/Client';
import { Filiale_Client } from '../../../../../model/Filiale_Client';
import { Groupe } from '../../../../../model/Groupe';
import { User } from '../../../../../model/User';
import { ClientService } from '../../../../../services/client.service';
import { Filiale_ClientService } from '../../../../../services/filiale_Client.service';
import { GroupeService } from '../../../../../services/groupe.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { UserService } from '../../../../../services/user.service';
import countries from '../../../../data/countries.json';

@Component({
  selector: 'ngx-modif-filiale-client',
  templateUrl: './modif-filiale-client.component.html',
  styleUrls: ['./modif-filiale-client.component.scss']
})
export class ModifFilialeClientComponent implements OnInit , OnDestroy{

  
  modifForm = this.fb.group({
    filcli_id: [''],
    filcli_numero: [''],
    filcli_numercli: ['', [Validators.required]],
    filcli_codepays: ['', [Validators.required]],
    fili_codegroupe: [''],
    filcli_codedevise: ['', [Validators.required]],
    filcli_codeutilisateur: [''],
    filcli_datemodification: [''],
     });

  filiale_Client: Filiale_Client;
  autorisation = [];
  //listPays: Array<Pays> = new Array<Pays>();
  @Input() listPays: any [] = countries;
  listGroupes: Array<Groupe> = new Array<Groupe>();
  listClients: Array<Client> = new Array<Client>();
  login: any;
  user: User;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  filcli_codepays: String;
  filcli_codegroupe: String;
  filcli_numercli: String;

  
  // ================ Déclarations des variables pour la recherche avec filtre ======================

  /** control for the selected classification */
  public groupeCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public groupeFilterCtrl: FormControl = new FormControl();

  /** list of classifications filtered by search keyword */
  public filteredgroupe: ReplaySubject<Groupe[]> = new ReplaySubject<Groupe[]>();
  //filteredBanks: BehaviorSubject<Bank[]> = new BehaviorSubject<Bank[]>(BANKS);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  // ========================================== FIN Déclaration ======================================

  // tslint:disable-next-line:max-line-length
  constructor(private authService: NbAuthService, private filiale_ClientService: Filiale_ClientService, private toastrService: NbToastrService,
              private fb: FormBuilder, private groupeService: GroupeService, private userService: UserService,
               // tslint:disable-next-line:max-line-length
               private clientService: ClientService, private router: Router, private transfertData: TransfertDataService) { }

  ngOnInit(): void {
   // this.onGetAllpays();
   this.authService.onTokenChange()
   .subscribe((token: NbAuthJWTToken) => {

     if (token.isValid()) {
       this.autorisation = token.getPayload().fonctionnalite.split(',');
       console.log(this.autorisation);
     }

   });
    this.onGetAllGroupes();
    this.getlogin();
    this.onGetAllClients();

    this.filiale_Client = this.transfertData.getData();

    this.modifForm.controls['filcli_id'].setValue(this.filiale_Client.filcli_id);
    this.modifForm.controls['filcli_numero'].setValue(this.filiale_Client.filcli_numero);
    this.modifForm.controls['filcli_numercli'].setValue(this.filiale_Client.filcli_numercli);
    this.filcli_numercli = this.filiale_Client.filcli_numercli.toString();
    this.modifForm.controls['filcli_codepays'].setValue(this.filiale_Client.filcli_codepays);
    this.filcli_codepays = this.filiale_Client.filcli_codepays.toString();
    this.modifForm.controls['fili_codegroupe'].setValue(this.filiale_Client.fili_codegroupe);
    if (this.filiale_Client.fili_codegroupe != null){
      this.filcli_codegroupe = this.filiale_Client.fili_codegroupe.toString();
      this.groupeCtrl.setValue(this.filiale_Client.fili_codegroupe.toString());
    } else {
      this.filcli_codegroupe = this.filiale_Client.fili_codegroupe;
      this.groupeCtrl.setValue(this.filiale_Client.fili_codegroupe);
    }

    this.modifForm.controls['filcli_codedevise'].setValue(this.filiale_Client.filcli_codedevise);
    this.modifForm.controls['filcli_codeutilisateur'].setValue(this.filiale_Client.filcli_codeutilisateur);
    
    this.groupeFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterGroupes();
    });

  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  protected filterGroupes() {
    if (!this.listGroupes) {
      return;
    }
    // get the search keyword
    let search = this.groupeFilterCtrl.value;
    if (!search) {
      this.filteredgroupe.next(this.listGroupes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredgroupe.next(
      this.listGroupes.filter(g => g.group_liblong.toLowerCase().indexOf(search) > -1 ||
      g.group_code.toString().indexOf(search) > -1),
    );
  }
  cancel() {
   // this.ref.close();
   this.router.navigateByUrl('home/filiale_Client');
  }

  submit() {
    this.modifForm.controls['filcli_codeutilisateur'].setValue(this.user.util_numero);
    this.modifForm.controls['filcli_datemodification'].setValue(new Date());
  //  this.ref.close(this.addForm.value);

  this.filiale_ClientService.updateFiliale_Client(this.modifForm.value, this.modifForm.controls['filcli_numero'].value)
    .subscribe(() => {
      this.toastrService.show(
        'Client Filiale modifié avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('home/filiale_Client');
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

  onChangeCodePays(event) {
    console.log(event);
    this.modifForm.controls['filcli_codepays'].setValue(event);
    // tslint:disable-next-line:max-line-length
    this.modifForm.controls['filcli_codedevise'].setValue((this.listPays.find(p => p.callingCodes[0] === event)).currencies[0].code);
  }


  onGetAllGroupes () {
    this.groupeService.getAllGroupes()
    .subscribe((data: Groupe[]) => {
       this.listGroupes = data;
       this.filteredgroupe.next(this.listGroupes.slice());
    });
}
onChangeGroupe(event) {
  console.log(event.value);
  this.modifForm.controls['fili_codegroupe'].setValue(event.value);
}


getlogin(): any {
  this.authService.getToken()
    .subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.login = token.getPayload();
        this.userService.getUser(this.login.sub)
    .subscribe((data: User) => {
      this.user = data;
      console.log(this.user);
    });
      }
    });
}

onGetAllClients () {
  this.clientService.getAllClientMorale()
  .subscribe((data: Client[]) => {
     this.listClients = data;
  });
}

check_fonct(fonct: String) {

  let el = this.autorisation.findIndex(itm => itm === fonct);
  if (el === -1)
   return false;
  else
   return true;

}
onChangeClient(event) {
  console.log(event);
  this.modifForm.controls['filcli_numercli'].setValue(event);
}
}
