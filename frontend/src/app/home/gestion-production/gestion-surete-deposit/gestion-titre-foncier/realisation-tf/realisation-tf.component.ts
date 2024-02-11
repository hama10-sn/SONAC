import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Surete } from '../../../../../model/Surete';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Acte } from '../../../../../model/Acte';
import { Avenant } from '../../../../../model/Avenant';
import { Police } from '../../../../../model/Police';
import { EngagementService } from '../../../../../services/engagement.service';
import { PoliceService } from '../../../../../services/police.service';
import dateFormatter from 'date-format-conversion';
import { User } from '../../../../../model/User';
import { Client } from '../../../../../model/Client';
import { UserService } from '../../../../../services/user.service';
import type from '../../../../data/type.json';
import { ClientService } from '../../../../../services/client.service';
import { Marche } from '../../../../../model/Marche';
import { FormatNumberService } from '../../../../../services/formatNumber.service';
import { Engagement } from '../../../../../model/Engagement';
import { SureteService } from '../../../../../services/surete.service';

@Component({
  selector: 'ngx-realisation-tf',
  templateUrl: './realisation-tf.component.html',
  styleUrls: ['./realisation-tf.component.scss']
})
export class RealisationTFComponent implements OnInit {

  realisationForm = this.fb.group({

    surete_numero: ['', [Validators.required]],
    surete_numpoli: ['', [Validators.required]],
    surete_numeroavenant: ['', [Validators.required]],
    surete_numeroacte: ['', [Validators.required]],
    surete_numeroengagement: ['', [Validators.required]],
    surete_typesurete: ['', [Validators.required]],
    surete_identificationtitre: [''],
    surete_localisation: [''],
    surete_adressegeolocalisation: [''],
    surete_retenudeposit: [''],
    surete_datedeposit: [''],
    // surete_montantlibere: ['', [Validators.required]],
    surete_depositlibere: [''],
    surete_dateliberation: [''],
    surete_cautionsolidaire: [''],
    surete_datecomptabilisation: [''],
    surete_codeutilisateur: [''],
    surete_statutliberation: ['']
  });

  surete: Surete;
  login: any;
  user: User;
  user2: User;
  autorisation: [];
  numAvenant: Number;
  listActes: any[];
  lib: any;
  prod: any;

  dateComptabilisation: Date;
  dateEngagement: Date;
  souscripteur: any;
  displaytype: boolean = false;
  displayCaution: boolean = false;
  verifDeposite: boolean = true;
  verifEngag: boolean = true;
  verifLib: boolean = true;
  displaytypedepo: boolean = false;
  displaytypeNature: boolean = false;
  displaytypeNature1: boolean = false;
  displayclient: boolean = false;
  displayPro: boolean = false;
  displayProd: boolean = false;
  produit: any;
  pro: any;
  ClientByPolice: any = '';

  client: any;
  listTypes: any[];
  listTypeCausions: any[];
  echeance: Date;
  effet: Date;
  dateEcheance: Date;
  deposite: Date;
  // dateEng: Date;
  // dateLib: Date;
  // formatcapitalassure: Number;
  retenuDeposit: any;
  dateDeposit: Date;
  cautionSolidaire: String;
  value_typeSurete: any;
  value_CautionSolidaire: any;
  adminGeneral = "Administrateur Général";
  nonModifierChamps: boolean = true;
  dateLiberationDeposit: Date;
  montantLibere: any = '';
  depositLibere: any = '';
  problemeMontantLibere: boolean = false;
  montantLibereVide: boolean;

  avenants: Array<Avenant> = new Array<Avenant>();
  polices: Array<Police> = new Array<Police>();
  actes: Array<Acte> = new Array<Acte>();
  clientes: Array<Client> = new Array<Client>();
  marches: Array<Marche> = new Array<Marche>();
  engagements: Array<Engagement> = new Array<Engagement>();
  @Input() types: any[] = type;

  public typesCtrl: FormControl = new FormControl();
  public engagementCtrl: FormControl = new FormControl();

  public typesFilterCtrl: FormControl = new FormControl();
  public engagementFilterCtrl: FormControl = new FormControl();

  public filteredTypes: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  public filteredEngagement: ReplaySubject<Engagement[]> = new ReplaySubject<Engagement[]>();

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder,
    private authService: NbAuthService,
    private engagementService: EngagementService,
    private toastrService: NbToastrService,
    private router: Router,
    private sureteService: SureteService,
    private userService: UserService,
    private clientService: ClientService,
    private policeService: PoliceService,
    private formatNumberService: FormatNumberService,
    private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.onGetUser(token.getPayload().sub);
        }
      });

    this.surete = this.transfertData.getData()
    console.log(this.surete)

    this.getlogin();
    this.onGetAllClient();
    this.onGetAllEngagement();
    this.onGetAllPolice();

    this.listTypes = this.types['TYPE_SURETE'];
    this.listTypeCausions = this.types['TYPE_CAUTION_SOLIDAIRE'];

    this.realisationForm.controls['surete_numero'].setValue(this.surete.surete_numero);
    this.realisationForm.controls['surete_numeroengagement'].setValue(this.surete.surete_numeroengagement);
    this.realisationForm.controls['surete_numpoli'].setValue(this.surete.surete_numpoli);
    this.onGetClientByPolice(this.surete?.surete_numpoli);
    this.realisationForm.controls['surete_numeroavenant'].setValue(this.surete.surete_numeroavenant);
    this.realisationForm.controls['surete_numeroacte'].setValue(this.surete.surete_numeroacte);
    this.realisationForm.controls['surete_typesurete'].setValue(this.surete.surete_typesurete);
    // this.typesCtrl.setValue(this.surete.surete_typesurete);
    if (this.surete.surete_typesurete == null || this.surete.surete_typesurete === "") {
      this.value_typeSurete = "";
    } else {
      this.value_typeSurete = this.surete.surete_typesurete + " : " + (this.listTypes.find(p => p?.id == this.surete.surete_typesurete))?.value;
    }

    // Pour indiquer les champs obligatoires ou non de la sureté
    this.onControleByTypeSurete(this.surete.surete_typesurete);

    this.realisationForm.controls['surete_identificationtitre'].setValue(this.surete.surete_identificationtitre);
    this.realisationForm.controls['surete_localisation'].setValue(this.surete.surete_localisation);
    this.realisationForm.controls['surete_adressegeolocalisation'].setValue(this.surete.surete_adressegeolocalisation);
    
    this.retenuDeposit = this.formatNumberService.numberWithCommas2(Number(this.surete.surete_retenudeposit));
    this.realisationForm.controls['surete_retenudeposit'].setValue(this.surete.surete_retenudeposit);
    if (this.surete?.surete_datedeposit != null) {
      this.dateDeposit = dateFormatter(this.surete?.surete_datedeposit, 'yyyy-MM-ddTh:mm');
    }
    this.realisationForm.controls['surete_datedeposit'].setValue(this.dateDeposit);
    this.realisationForm.controls['surete_cautionsolidaire'].setValue(this.surete.surete_cautionsolidaire);
    this.cautionSolidaire = this.surete.surete_cautionsolidaire.toString();
    if (this.surete?.surete_cautionsolidaire === null || this.surete?.surete_cautionsolidaire === "") {
      this.value_CautionSolidaire = "";
    } else {
      this.value_CautionSolidaire = this.surete?.surete_cautionsolidaire + " : " + (this.listTypeCausions.find(p => p?.id == this.surete.surete_cautionsolidaire))?.value;
    }

    // Pour la fonctionnalité de libération
    this.montantLibereVide = true ;
    this.depositLibere = this.surete.surete_depositlibere;

    this.depositLibere = this.formatNumberService.numberWithCommas2(Number(this.surete.surete_depositlibere));
    this.realisationForm.controls['surete_depositlibere'].setValue(this.surete.surete_depositlibere);
    if (this.surete?.surete_dateliberation != null) {
      this.dateLiberationDeposit = dateFormatter(this.surete?.surete_dateliberation, 'yyyy-MM-ddTh:mm');
    }
    this.realisationForm.controls['surete_dateliberation'].setValue(this.dateLiberationDeposit);
    this.realisationForm.controls['surete_statutliberation'].setValue(this.surete.surete_statutliberation);

    this.filteredTypes.next(this.listTypes.slice());
    this.engagementFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterEngagement();
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

  getlogin(): any {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.login = token.getPayload();
          this.userService.getUser(this.login.sub)
            .subscribe((data: User) => {
              this.user = data;
            });
        }
      });
  }

  protected filterEngagement() {
    if (!this.engagements) {
      return;
    }
    // get the search keyword
    let search = this.engagementFilterCtrl.value;
    if (!search) {
      this.filteredEngagement.next(this.engagements.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredEngagement.next(
      this.engagements.filter(eng => eng.engag_numeroengagement.toString()?.toLowerCase().indexOf(search) > -1)

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

  onGetAllClient() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.clientes = data as Client[];
        //this.filteredActes.next(this.actes.slice());
      });
  }

  onGetAllEngagement() {
    this.engagementService.getAllEngagements()
      .subscribe((data: Engagement[]) => {
        this.engagements = data as Engagement[];
        this.filteredEngagement.next(this.engagements.slice());
      });
  }

  onGetAllPolice() {
    this.policeService.getAllPolice()
      .subscribe((data: Police[]) => {
        this.polices = data as Police[];
        console.log(this.polices)
        console.log(this.surete)

        this.dateEcheance = ((this.polices?.find(p => p.poli_numero == this.surete.surete_numpoli))?.poli_dateecheance) as Date;
        console.log(this.dateEcheance);
        this.effet = ((this.polices?.find(p => p.poli_numero == this.surete.surete_numpoli))?.poli_dateeffetencours) as Date;
        console.log(this.effet);
      });
  }

  /*
  onGetTypeByClient(code: number) {
    return (this.clientes.find(b => b.clien_numero === code))?.clien_nature;
  }
  */

  onGetClientByPolice(mun: any) {
    this.clientService.getClientByPolice(mun)
      .subscribe((data: any) => {
        this.client = data;
        this.displayclient = true;

        if (this.client.clien_prenom === "" || this.client.clien_prenom == null) {
          this.ClientByPolice = this.client?.clien_denomination;
        } else {
          this.ClientByPolice = this.client?.clien_prenom + " " + this.client?.clien_nom;
        }
      });
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        console.log(this.user);

        if (this.user.util_profil == this.adminGeneral) {
          this.nonModifierChamps = false;
        } else {
          this.nonModifierChamps = true;
        }

      });
  }

  onInsererChamps(numero: Number) {
    /*
    this.engagementService.getEngagementByNumero(numero)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          // this.addForm.controls['surete_numpoli'].setValue(data.data.engag_numpoli);
          // this.addForm.controls['surete_numeroavenant'].setValue(data.data.engag_numeroavenant);
          // this.addForm.controls['surete_numeroacte'].setValue(data.data.engag_numeroacte);

          console.log(this.polices)
          // On profite pour remplir la date d'echeance de la police et celle d'effet
          this.dateEcheance = ((this.polices.find(p => p.poli_numero == data.data.engag_numpoli))?.poli_dateecheance) as Date;
          console.log(this.dateEcheance);
          this.effet = ((this.polices.find(p => p.poli_numero == data.data.engag_numpoli))?.poli_dateeffetencours) as Date;
          console.log(this.effet);
        }
      });
      */
  }

  onChangeEngagement(event) {
    this.realisationForm.controls['surete_numeroengagement'].setValue(event.value);
    // this.onInsererChamps(event.value);
  }

  onChangeFocusDateDeposit(event: any) {
    console.log(this.dateEcheance);
    this.deposite = this.realisationForm.controls['surete_datedeposit'].value;
    //this.verifDeposite= true;
    if (dateFormatter(this.deposite, 'yyyy-MM-dd') >= dateFormatter(this.effet, 'yyyy-MM-dd') && dateFormatter(this.dateEcheance, 'yyyy-MM-dd') >= dateFormatter(this.deposite, 'yyyy-MM-dd')) {

      this.verifDeposite = true;
    } else {
      this.verifDeposite = false;
      this.realisationForm.controls['surete_datedeposit'].setValue("");
    }
  }

  onFocusOutEventMontantLibere(event) {

    this.montantLibere = event.target.value;
    this.montantLibere = this.montantLibere.replaceAll(' ', '');
    if (this.montantLibere !== '' && this.montantLibere < this.surete?.surete_retenudeposit) {
      // console.log("============  OK  ==================");
      this.montantLibereVide = false ;
      this.problemeMontantLibere = false;
      this.depositLibere = (Number(this.surete?.surete_depositlibere) + Number(this.montantLibere)).toString();
      this.realisationForm.controls['surete_depositlibere'].setValue(this.depositLibere);

      this.retenuDeposit = (Number(this.surete?.surete_retenudeposit) - Number(this.montantLibere)).toString()
      this.realisationForm.controls['surete_retenudeposit'].setValue(this.retenuDeposit);

      this.montantLibere = Number(this.formatNumberService.replaceAll(this.montantLibere, ' ', ''));
      this.montantLibere = this.formatNumberService.numberWithCommas2(this.montantLibere);

      this.depositLibere = Number(this.formatNumberService.replaceAll(this.depositLibere, ' ', ''));
      this.depositLibere = this.formatNumberService.numberWithCommas2(this.depositLibere);

      this.retenuDeposit = Number(this.formatNumberService.replaceAll(this.retenuDeposit, ' ', ''));
      this.retenuDeposit = this.formatNumberService.numberWithCommas2(this.retenuDeposit);
    } else {
      // console.log("============ IMPOSSIBLE ===============");
      this.problemeMontantLibere = true;
      this.montantLibereVide = true;
    }
  }

  /*
  onChangeFocusLibere(event: any) {
    this.dateEng = this.addForm.controls['engag_dateengagement'].value;
    this.dateLib = this.addForm.controls['engag_dateliberation'].value;
    //this.verifDeposite= true;
    if (dateFormatter(this.dateLib, 'yyyy-MM-dd') > dateFormatter(this.dateEng, 'yyyy-MM-dd')) {

      this.verifLib = true;
    } else {

      this.addForm.controls['engag_dateliberation'].setValue("");
      this.verifLib = false;
    }
  }
  */

  onControleByTypeSurete(type: any) {

    if (type == '1') {
      this.displaytype = true;
      this.displaytypedepo = false;
      this.displayCaution = false;
      this.realisationForm.controls['surete_identificationtitre'].setValidators(Validators.required);
      this.realisationForm.controls['surete_retenudeposit'].clearValidators();
      this.realisationForm.controls['surete_datedeposit'].clearValidators();
      this.realisationForm.controls['surete_cautionsolidaire'].clearValidators();
    } else if (type == '2') {
      this.displaytypedepo = true;
      this.displaytype = false;
      this.displayCaution = false;
      this.realisationForm.controls['surete_identificationtitre'].clearValidators();
      this.realisationForm.controls['surete_retenudeposit'].setValidators(Validators.required);
      this.realisationForm.controls['surete_datedeposit'].setValidators(Validators.required);
      this.realisationForm.controls['surete_cautionsolidaire'].clearValidators();
    } else if (type == '3') {
      this.displayCaution = true;
      this.displaytype = false;
      this.displaytypedepo = false;
      this.realisationForm.controls['surete_cautionsolidaire'].setValidators(Validators.required);
      this.realisationForm.controls['surete_retenudeposit'].clearValidators();
      this.realisationForm.controls['surete_datedeposit'].clearValidators();
      this.realisationForm.controls['surete_identificationtitre'].clearValidators();

    } else {
      this.displaytype = false;
      this.displaytypedepo = false;
      this.displayCaution = false;
      this.realisationForm.controls['surete_identificationtitre'].clearValidators();
      this.realisationForm.controls['surete_retenudeposit'].clearValidators();
      this.realisationForm.controls['surete_datedeposit'].clearValidators();
      this.realisationForm.controls['surete_cautionsolidaire'].clearValidators();
    }
    this.realisationForm.controls['surete_identificationtitre'].updateValueAndValidity();
    this.realisationForm.controls['surete_retenudeposit'].updateValueAndValidity();
    this.realisationForm.controls['surete_datedeposit'].updateValueAndValidity();
    this.realisationForm.controls['surete_cautionsolidaire'].updateValueAndValidity();
  }

  onChangeTypeSurete(event) {
    this.realisationForm.controls['surete_typesurete'].setValue(event.value);

    if (event.value == '1') {
      this.displaytype = true;
      this.displaytypedepo = false;
      this.displayCaution = false;
      this.realisationForm.controls['surete_identificationtitre'].setValidators(Validators.required);
      this.realisationForm.controls['surete_retenudeposit'].clearValidators();
      this.realisationForm.controls['surete_datedeposit'].clearValidators();
      this.realisationForm.controls['surete_cautionsolidaire'].clearValidators();
    } else if (event.value == '2') {
      this.displaytypedepo = true;
      this.displaytype = false;
      this.displayCaution = false;
      this.realisationForm.controls['surete_identificationtitre'].clearValidators();
      this.realisationForm.controls['surete_retenudeposit'].setValidators(Validators.required);
      this.realisationForm.controls['surete_datedeposit'].setValidators(Validators.required);
      this.realisationForm.controls['surete_cautionsolidaire'].clearValidators();
    } else if (event.value == '3') {
      this.displayCaution = true;
      this.displaytype = false;
      this.displaytypedepo = false;
      this.realisationForm.controls['surete_cautionsolidaire'].setValidators(Validators.required);
      this.realisationForm.controls['surete_retenudeposit'].clearValidators();
      this.realisationForm.controls['surete_datedeposit'].clearValidators();
      this.realisationForm.controls['surete_identificationtitre'].clearValidators();

    } else {
      this.displaytype = false;
      this.displaytypedepo = false;
      this.displayCaution = false;
      this.realisationForm.controls['surete_identificationtitre'].clearValidators();
      this.realisationForm.controls['surete_retenudeposit'].clearValidators();
      this.realisationForm.controls['surete_datedeposit'].clearValidators();
      this.realisationForm.controls['surete_cautionsolidaire'].clearValidators();
    }
    this.realisationForm.controls['surete_identificationtitre'].updateValueAndValidity();
    this.realisationForm.controls['surete_retenudeposit'].updateValueAndValidity();
    this.realisationForm.controls['surete_datedeposit'].updateValueAndValidity();
    this.realisationForm.controls['surete_cautionsolidaire'].updateValueAndValidity();
  }

  onChangeCaution(event) {
    this.realisationForm.controls['surete_cautionsolidaire'].setValue(event);
  }

  onFocusOutEventRetenuDeposit(event) {
    this.retenuDeposit = this.realisationForm.get("surete_retenudeposit").value;

    this.retenuDeposit = Number(this.formatNumberService.replaceAll(this.retenuDeposit, ' ', ''));
    this.retenuDeposit = this.formatNumberService.numberWithCommas2(this.retenuDeposit);

    // if (this.objectifCA === null || this.objectifCA === "") {
    //   this.addForm.controls['inter_objectifcaannuel'].setValue(0);
    //   this.objectifCA = 0;
    //   // this.problemeObjectifCA = true;
    //   // this.erreur = true;
    // } else {
  }

  getColorRetenuDeposit() {

  }

  getColorMontantLibere() {
    if (this.problemeMontantLibere) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  submit() {
    // this.modifForm.controls['surete_datecomptabilisation'].setValue(new Date());
    this.realisationForm.controls['surete_codeutilisateur'].setValue(this.user.util_numero);
    this.sureteService.modifSurete(this.realisationForm.value)
      .subscribe((data: any) => {
        if (data.code === "ok") {
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
          this.router.navigateByUrl('home/engagement/gestion-surete-deposit');
        } else {
          this.toastrService.show(
            data.message,
            'Notification d\'erreur',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
        }
      }
      );
  }

  cancel() {
    this.router.navigateByUrl('home/engagement/gestion-surete-deposit')
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

}
