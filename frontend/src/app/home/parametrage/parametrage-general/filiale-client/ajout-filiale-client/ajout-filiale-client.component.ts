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
import { Pays } from '../../../../../model/pays';
import { User } from '../../../../../model/User';
import { ClientService } from '../../../../../services/client.service';
import { Filiale_ClientService } from '../../../../../services/filiale_Client.service';
import { GroupeService } from '../../../../../services/groupe.service';
import { PaysService } from '../../../../../services/pays.service';
import { UserService } from '../../../../../services/user.service';
import countries from '../../../../data/countries.json';

@Component({
  selector: 'ngx-ajout-filiale-client',
  templateUrl: './ajout-filiale-client.component.html',
  styleUrls: ['./ajout-filiale-client.component.scss']
})
export class AjoutFilialeClientComponent implements OnInit , OnDestroy {

  addForm = this.fb.group({
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

   // ================ Déclarations des variables pour la recherche avec filtre ======================

   /** control for the selected classification */
   public clientCtrl: FormControl = new FormControl();
   public groupeCtrl: FormControl = new FormControl();
   public paysCtrl: FormControl = new FormControl();
 
   /** control for the MatSelect filter keyword */
   public clientFilterCtrl: FormControl = new FormControl();
   public groupeFilterCtrl: FormControl = new FormControl();
   public paysFilterCtrl: FormControl = new FormControl();
 
   /** list of classifications filtered by search keyword */
   public filteredclient: ReplaySubject<Client[]> = new ReplaySubject<Client[]>();
   public filteredgroupe: ReplaySubject<Groupe[]> = new ReplaySubject<Groupe[]>();
   public filteredpays: ReplaySubject<any[]> = new ReplaySubject<any[]>(countries);
   //filteredBanks: BehaviorSubject<Bank[]> = new BehaviorSubject<Bank[]>(BANKS);
 
   @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
 
   /** Subject that emits when the component has been destroyed. */
   protected _onDestroy = new Subject<void>();
 
   // ========================================== FIN Déclaration ======================================



  // tslint:disable-next-line:max-line-length
  constructor(private paysService: PaysService, private authService: NbAuthService, private filiale_ClientService: Filiale_ClientService, private toastrService: NbToastrService,
              private fb: FormBuilder, private groupeService: GroupeService, private userService: UserService,
               private clientService: ClientService, private router: Router) { }

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
   // this.onGetAllpays();
   this.filteredpays.next(this.listPays.slice());

           // =================== Listen for search field value changes =======================
           this.clientFilterCtrl.valueChanges
           .pipe(takeUntil(this._onDestroy))
           .subscribe(() => {
             this.filterBanks();
           });
           this.groupeFilterCtrl.valueChanges
           .pipe(takeUntil(this._onDestroy))
           .subscribe(() => {
             this.filterGroupes();
           });
           this.paysFilterCtrl.valueChanges
           .pipe(takeUntil(this._onDestroy))
           .subscribe(() => {
             this.filterPays();
           });

       }

       ngOnDestroy() {
         this._onDestroy.next();
         this._onDestroy.complete();
       }

       protected filterBanks() {
         if (!this.listClients) {
           return;
         }
         // get the search keyword
         let search = this.clientFilterCtrl.value;
         if (!search) {
           this.filteredclient.next(this.listClients.slice());
           return;
         } else {
           search = search.toLowerCase();
         }
         this.filteredclient.next(
           this.listClients.filter(c => c.clien_denomination.toLowerCase().indexOf(search) > -1 ||
           c.clien_numero.toString().indexOf(search) > -1),
         );
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

       protected filterPays() {
        if (!this.listPays) {
          return;
        }
        // get the search keyword
        let search = this.paysFilterCtrl.value;
        if (!search) {
          this.filteredpays.next(this.listPays.slice());
          return;
        } else {
          search = search.toLowerCase();
        }
        this.filteredpays.next(
          this.listPays.filter(p => p.callingCodes[0].toLowerCase().indexOf(search) > -1 ||
          p.name.toLowerCase().indexOf(search) > -1),
        );
      }

       // ================== FIN IMPLEMENTATION POUR LA RECHERCHE AVEC FILTRE =============================

  cancel() {
   // this.ref.close();
   this.router.navigateByUrl('home/filiale_Client');
  }

  submit() {
    this.addForm.controls['filcli_codeutilisateur'].setValue(this.user.util_numero);
    this.addForm.controls['filcli_datemodification'].setValue(new Date());
  //  this.ref.close(this.addForm.value);

  this.filiale_ClientService.addFiliale_Client(this.addForm.value)
    .subscribe(() => {
      this.toastrService.show(
        'Filiale_Client Enregistrée avec succes !',
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
    console.log(event.value);
    this.addForm.controls['filcli_codepays'].setValue(event.value);
    // tslint:disable-next-line:max-line-length
    this.addForm.controls['filcli_codedevise'].setValue((this.listPays.find(p => p.callingCodes[0] === event.value)).currencies[0].code);
  }

  /*onGetAllpays() {
    this.paysService.getAllPays()
      .subscribe((data: Pays[]) => {
          this.listPays = data;
          //console.log(data);
      });
     // console.log(this.listPays);
  }*/

  onGetAllGroupes () {
    this.groupeService.getAllGroupes()
    .subscribe((data: Groupe[]) => {
       this.listGroupes = data;
       this.filteredgroupe.next(this.listGroupes.slice());
    });
}
onChangeGroupe(event) {
  console.log(event.value);
  this.addForm.controls['fili_codegroupe'].setValue(event.value);
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
     this.filteredclient.next(this.listClients.slice());
  });
}
onChangeClient(event) {
  console.log(event.value);
  this.addForm.controls['filcli_numercli'].setValue(event.value);
}
/*onChangeClient(event) {
console.log(event);
this.addForm.controls['filcli_codeclient'].setValue(event);
// tslint:disable-next-line:semicolon
console.log(((this.listPays.find(p => p.alpha2Code === event.substring(0, 2)))?.callingCodes[0]));
// tslint:disable-next-line:max-line-length
this.addForm.controls['filcli_codepays'].setValue(((this.listPays.find(p => p.alpha2Code === event.substring(0, 2)))?.callingCodes[0]));
// tslint:disable-next-line:max-line-length
this.addForm.controls['filcli_codedevise'].setValue((this.listPays.find(p => p.alpha2Code === event.substring(0, 2))).currencies[0].code);
}*/

check_fonct(fonct: String) {

  let el = this.autorisation.findIndex(itm => itm === fonct);
  if (el === -1)
   return false;
  else
   return true;

}
// onchangeSigle () {
//   if (this.addForm.get('filcli_sigle').value === '' ) {
//     this.errorSigle = true;
//   } else {
//     this.errorSigle = false;
//   }
// }
// onchangeDenom () {
  
//   if (this.addForm.get('filcli_denomination').value === '' ) {
//    // console.log('tototot');
//     this.errorDenom = true;
//   } else {
//     this.errorDenom = false;
//   }
// }

}
