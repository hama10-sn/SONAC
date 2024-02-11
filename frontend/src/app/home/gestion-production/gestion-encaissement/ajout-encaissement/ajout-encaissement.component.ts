import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Client } from '../../../../model/Client';
import { Facture } from '../../../../model/Facture';
import { Intermediaire } from '../../../../model/Intermediaire';
import { Police } from '../../../../model/Police';
import { Quittance } from '../../../../model/Quittance';
import { ClientService } from '../../../../services/client.service';
import { EncaissementService } from '../../../../services/encaissement.service';
import { FactureService } from '../../../../services/facture.service';
import { IntermediaireService } from '../../../../services/intermediaire.service';
import { PoliceService } from '../../../../services/police.service';
import { QuittanceService } from '../../../../services/quittance.service';
import dateFormatter from 'date-format-conversion';
import { User } from '../../../../model/User';
import { UserService } from '../../../../services/user.service';
import { FormatNumberService } from '../../../../services/formatNumber.service';
import { HttpEventType } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Banque } from '../../../../model/Banque';
import { BanqueService } from '../../../../services/branque.service';
import { RefEncaissementService } from '../../../../services/refEncaissement.service';

@Component({
  selector: 'ngx-ajout-encaissement',
  templateUrl: './ajout-encaissement.component.html',
  styleUrls: ['./ajout-encaissement.component.scss']
})
export class AjoutEncaissementComponent implements OnInit {
  clientss: Array<Client> = new Array<Client>();
  intermediaires: Array<Intermediaire> = new Array<Intermediaire>();
  factures: Array<Facture> = new Array<Facture>();
  quittances: Array<Quittance> = new Array<Quittance>();
  polices: Array<Police> = new Array<Police>();
  listFactures = [];
  listQuittances = [];

  facture: Facture;

  showFacture: boolean = false;
  showErrorProductionFacture: boolean = false;
  showErrorMontantPay: boolean = false;
  showEncaissementSimple: boolean = false;
  showEncaissementMultiple: boolean = false;
  showErrorPoliceSelect: boolean = false;
  showErrorFactQuit: boolean = false;
  showErrorChamps: boolean = false;
  showChoixEncaiss: boolean = true;
  showErrorMontantUp: boolean = false;
  showErrorMontantDown: boolean = false;
  showIntermediaire: boolean = false;
  showClient: boolean = false;

  noPermitAdd: boolean = false;
  textfacture: String;
  error: string;
  numcli: any;
  numpol: any;
  numFact: any;
  nbFact: number = 0;
  quittance: Quittance;
  SomFactures: number = 0;
  MontantCheque: number = 0;
  Rendu: number = 0;
  montantPrimeEncaisse: Number;

  showObligatoireBanque: boolean = false;
  // showObligatoireNumTitre: boolean = false;
  montantApayer: any = 0;

  autorisation = [];
  demandeur: string;

  addForm = this.fb.group({

    encai_numerofacture: ['', [Validators.required]],
    encai_numeroquittance: [''],
    encai_datepaiement: [''],
    encai_numerosouscripteur: ['', [Validators.required]],
    encai_numeropolice: ['', [Validators.required]],
    encai_numerointermediaire: [''],
    encai_typequittance: [''],
    encai_mtnquittance: ['', [Validators.required]],
    encai_mtnpaye: ['', [Validators.required]],
    encai_solde: [''],
    encai_typencaissement: ['', [Validators.required]],
    encai_codebanque: [''],
    encai_numerocheque: ['', [Validators.required]],
    encai_codetraitement: [''],
    encai_codeutilisateur: [''],
    encai_status: [''],

  });

  addFormMultipleEncaiss = this.fb.group({

    encai_numerofacture: [''],
    encai_numeroquittance: [''],
    encai_datepaiement: [''],
    encai_numerosouscripteur: [''],
    encai_numeropolice: [''],
    encai_numerointermediaire: [''],
    encai_typequittance: [''],
    encai_mtnquittance: [''],
    encai_mtnpaye: ['', [Validators.required]],
    encai_solde: [''],
    encai_typencaissement: ['', [Validators.required]],
    encai_codebanque: [''],
    encai_numerocheque: ['', [Validators.required]],
    encai_codetraitement: [''],
    encai_codeutilisateur: [''],
    encai_status: [''],

  });
  addFormMultiple = this.fb.group({

    ligne_factures: this.fb.array([]),

  });

  addFormRefEncaissement = this.fb.group({

    refencai_code: [''],
    refencai_typepaiement: [''],
    refencai_codebanque: [''],
    refencai_numerotitre: [''],
    refencai_montanttitre: [''],
    refencai_montantutiliser: [''],
    refencai_montantavoir: [''],
    refencai_dateoperation: [''],
    refencai_status: ['']
  });


  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  public clientsCtrl: FormControl = new FormControl();
  public intermediaireCtrl: FormControl = new FormControl();
  public factureCtrl: FormControl = new FormControl();
  public quittanceCtrl: FormControl = new FormControl();
  public policeCtrl: FormControl = new FormControl();

  public clientsFilterCtrl: FormControl = new FormControl();
  public intermediaireFilterCtrl: FormControl = new FormControl();
  public factureFilterCtrl: FormControl = new FormControl();
  public quittanceFilterCtrl: FormControl = new FormControl();
  public policeFilterCtrl: FormControl = new FormControl();


  public filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>();
  public filteredIntermediaire: ReplaySubject<Intermediaire[]> = new ReplaySubject<Intermediaire[]>();
  public filteredFacture: ReplaySubject<Facture[]> = new ReplaySubject<Facture[]>();
  public filteredQuittance: ReplaySubject<Quittance[]> = new ReplaySubject<Quittance[]>();
  public filteredPolice: ReplaySubject<Police[]> = new ReplaySubject<Police[]>();

  banques: Array<Banque> = new Array<Banque>();

  public banqueCtrl: FormControl = new FormControl();
  public banqueFilterCtrl: FormControl = new FormControl();
  public filteredBanque: ReplaySubject<Banque[]> = new ReplaySubject<Banque[]>();

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  code_utilisateur: String;

  constructor(private fb: FormBuilder,
    private authService: NbAuthService,
    private router: Router,
    private toastrService: NbToastrService,
    private encaissementService: EncaissementService,
    private clientService: ClientService,
    private intermediaireService: IntermediaireService,
    private factureService: FactureService,
    private quittanceService: QuittanceService,
    private policeService: PoliceService,
    private userService: UserService,
    private formatNumber: FormatNumberService,
    private banqueService: BanqueService,
    private dialogService: NbDialogService,
    private refEncaissementService: RefEncaissementService) { }

  ngOnInit(): void {
    this.onGetAllClients();
    this.onGetAllItermediaire();
    // this.onGetAllQuittance();
    this.onGetAllBanques();

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.userService.getUser(token.getPayload().sub)
            .subscribe((data: User) => {
              this.code_utilisateur = data.util_numero;
              this.demandeur = data.util_prenom + " " + data.util_nom;
            });
        }
      });

    this.banqueFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanques();
      });

    this.clientsFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterClients();
      });

    this.intermediaireFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererIntermediaires();
      });

    this.factureFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererFactures();
      });

    this.quittanceFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererQuittances();
      });

    this.policeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererPolices();
      });
  }

  cancel() {
    window.location.reload();
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
        cl.clien_denomination?.toLowerCase().indexOf(search) > -1 ||
        cl.clien_numero?.toString().indexOf(search) > -1
      )

    );
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
        c.inter_numero.toString().toLowerCase().indexOf(search) > -1)
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
      this.factures.filter(c => c.fact_numacte.toString().indexOf(search) > -1)
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
      this.quittances.filter(c => c.quit_numero.toString().indexOf(search) > -1)
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
      this.polices.filter(c => c.poli_numero.toString().indexOf(search) > -1)
    );
  }
  protected filterBanques() {
    if (!this.banques) {
      return;
    }
    // get the search keyword
    let search = this.banqueFilterCtrl.value;
    if (!search) {
      this.filteredBanque.next(this.banques.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBanque.next(
      this.banques.filter(bq => bq.banq_codebanque.toString()?.toLowerCase().indexOf(search) > -1 ||
        bq.banq_codenormalise.toString().toLowerCase().indexOf(search) > -1 ||
        bq.banq_denomination.toString().toLowerCase().indexOf(search) > -1)

    );
  }

  onChangeCodeTraite(event) {
    this.addForm.controls['encai_codetraitement'].setValue(event);
  }

  /* onChangeSolde(event) {
    this.addForm.controls['encai_solde'].setValue(event);
    this.checkMontantPay(this.addForm.controls['encai_mtnpaye'].value);
  } */

  /* onChangeTypeEncaiss(event) {
    if (event == 'espèce') {
      this.addForm.controls['encai_codebanque'].clearValidators();
      this.addForm.controls['encai_numerocheque'].clearValidators();
    } else {
      this.addForm.controls['encai_codebanque'].setValidators(Validators.required);
      this.addForm.controls['encai_numerocheque'].setValidators(Validators.required);

    }
    this.addForm.controls['encai_codebanque'].updateValueAndValidity();
    this.addForm.controls['encai_numerocheque'].updateValueAndValidity();
    this.addForm.controls['encai_typencaissement'].setValue(event);
  } */


  onChangeTypeEncaiss(event) {
    if (event == 'Op Marchand' || event == 'espèce') {
      this.addForm.controls['encai_codebanque'].setValue('');
      this.banqueCtrl.setValue('');
      this.addForm.controls['encai_numerocheque'].setValue('');
      this.addForm.controls['encai_codebanque'].clearValidators();

      this.showObligatoireBanque = false;

    } else {
      this.addForm.controls['encai_codebanque'].setValue('');
      this.banqueCtrl.setValue('');
      this.addForm.controls['encai_numerocheque'].setValue('');
      this.addForm.controls['encai_codebanque'].setValidators(Validators.required);

      this.showObligatoireBanque = true;
    }
    this.addForm.controls['encai_codebanque'].updateValueAndValidity();
    this.addForm.controls['encai_typencaissement'].setValue(event);
  }

  onChangeTypeQuit(event) {
    this.addForm.controls['encai_typequittance'].setValue(event);
  }

  onChangeEncaissement(event) {
    this.showChoixEncaiss = false;
    if (event == 1) {
      this.showEncaissementSimple = true;
      this.showEncaissementMultiple = false;
    } else {
      this.showEncaissementSimple = false;
      this.showEncaissementMultiple = true;
    }
  }

  onChangeIntermediaire(event) {
    //this.addForm.controls['encai_numerointermediaire'].setValue(event.value);
    this.onGetAllFactureIntermediaire(event.value);
  }

  onChangeChoix(event) {
    this.factures = null;
    this.clientsCtrl.setValue("");
    this.intermediaireCtrl.setValue("");
    if (event == '1') {
      this.showClient = true;
      this.showIntermediaire = false;

    } else {
      this.showClient = false;
      this.showIntermediaire = true;
    }
    // this.addFormMultipleEncaiss.controls['encai_numerointermediaire'].updateValueAndValidity();
  }

  onChangeQuittance(event) {
    this.addForm.controls['encai_numeroquittance'].setValue(event.value);
  }

  onChangeQuittance2(event) {
    this.onGetQuittance(this.quittanceCtrl.value);
  }

  onChangeMontPay(event) {
    this.addForm.controls['encai_mtnpaye'].setValue(Number(event.target.value));
    this.checkMontantPay(event.target.value);
  }

  open(dialog: TemplateRef<any>) {

    this.dialogService.open(
      dialog);
  }

  // mntPaye: any;
  /* onFocusOutEventMntPaye(event) {
    this.mntPaye = this.addForm.get('encai_mtnquittance').value;
    this.mntPaye = this.mntPaye.replaceAll(' ', '');
    if (this.mntPaye !== '') {
      this.mntPaye = Number(this.formatNumber.replaceAll(this.mntPaye, ' ', ''));
      this.addForm.controls["encai_mtnpaye"].setValue(Number(this.mntPaye));
      this.checkMontantPay(this.mntPaye);
      this.mntPaye = this.formatNumber.numberWithCommas2(this.mntPaye);
    }
  } */

  /* checkMontantPay(montant) {
    //this.addForm.controls['encai_mtnpaye'].setValue('');
    if ((Number(montant) > Number(this.addForm.controls['encai_mtnquittance'].value))) {
      this.showErrorMontantPay = true;
      this.error = 'border: 1px solid red;';
      this.addForm.controls['encai_mtnpaye'].setErrors({});
    } else {
      this.showErrorMontantPay = false;
      this.error = '';
      this.addForm.controls['encai_mtnpaye'].setValue(Number(montant));
    }
  } */

  checkMontantPay(montant) {

    console.log(Number(this.montantApayer));
    // if ((Number(montant) > Number(this.addForm.controls['encai_mtnquittance'].value))) {
    if ((Number(montant) > Number(this.montantApayer))) {
      this.showErrorMontantPay = true;
    } else {
      this.showErrorMontantPay = false;
    }
  }

  onChangeClient(event) {
    this.facture = null;
    this.policeCtrl.setValue("");
    this.showErrorProductionFacture = false;
    this.showFacture = false;
    this.polices = [];
    this.factures = [];
    this.numpol = 0;
    this.numFact = 0;
    this.numcli = event.value;
    this.addForm.controls['encai_numerosouscripteur'].setValue(event.value);
    this.addForm.controls['encai_numerofacture'].setValue(null);
    this.addForm.controls['encai_numeropolice'].setValue(null);
    this.onGetAllPolice(this.numcli);
    this.onGetAllFactureClient(this.numcli);
  }

  onChangeFacture(event) {
    this.numFact = event.value;
    this.numpol = 0;
    this.numcli = 0;
    this.onGetFacture(event.value);
    this.addForm.controls['encai_numerofacture'].setValue(event.value);
    this.onGetAllQuittance(event.value);
  }

  onChangePolice(event) {
    this.facture = null;
    this.factureCtrl.setValue("");
    this.showErrorProductionFacture = false;
    this.showFacture = false;
    this.factures = [];
    this.numcli = 0;
    this.numFact = 0;
    this.numpol = event.value;
    this.addForm.controls['encai_numeropolice'].setValue(event.value);
    this.addForm.controls['encai_numerofacture'].setValue(null);
    this.onGetAllFacture(this.numpol);
    this.showFacture = false;
    this.numFact = '';
  }

  onGetAllClients() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.clientss = data as Client[];
        this.filteredClients.next(this.clientss.slice());
      });
  }

  onGetAllBanques() {
    this.banqueService.getAllBanques()
      .subscribe((data: any) => {
        if (data.code === "ok") {
          this.banques = data.data as Banque[];
          this.filteredBanque.next(this.banques.slice());
        } else {
          this.banques = data.data;
        }
      });
  }


  onGetAllFacture(numpol) {
    this.factureService.getAllFacturesPoliceaEnc(numpol)
      .subscribe((data: Facture[]) => {
        this.factures = data as Facture[];
        this.filteredFacture.next(this.factures.slice());
      });
  }

  onGetAllFactureClient(numcli) {
    this.factureService.getAllFacturesClient(numcli)
      .subscribe((data: Facture[]) => {
        this.factures = data as Facture[];
      });
  }

  onGetAllFactureIntermediaire(numInter) {
    this.factureService.getAllFacturesIntermediaire(numInter)
      .subscribe((data: Facture[]) => {
        this.factures = data as Facture[];
      });
  }

  onGetAllPolice(numcli) {
    this.policeService.getAllpoliceClient(numcli)
      .subscribe((data: Police[]) => {
        this.polices = data as Police[];
        this.filteredPolice.next(this.polices.slice());
      });
  }

  onGetFacture(numerofacture) {
    this.factureService.getFacture(numerofacture)
      .subscribe((data: Facture) => {
        this.facture = data;
        this.showFacture = true;
        //console.log(this.facture);
      });
  }

  onGetQuittance(numQuit) {
    this.quittanceService.getQuittance(numQuit)
      .subscribe((data: Quittance) => {
        this.quittance = data;
      });
  }

  onGetAllQuittance(numfact) {
    this.quittanceService.getQuittanceFact(numfact)
      .subscribe((data: Quittance) => {
        this.quittance = data;
        this.addForm.controls['encai_mtnquittance'].setValue(Number(data.quit_primettc) - Number(data.quit_mntprimencaisse));
        this.montantApayer = Number(data.quit_primettc) - Number(data.quit_mntprimencaisse);
        this.addForm.controls['encai_typequittance'].setValue(data.quit_typequittance);
        this.intermediaireService.getIntemediaire(data.quit_numerointermedaire)
          .subscribe((data: Intermediaire) => {
            this.addForm.controls['encai_numerointermediaire'].setValue(data.inter_numero + " : " + data.inter_denomination);
          })
        this.addForm.controls['encai_numeroquittance'].setValue(data.quit_numero);
        this.textfacture = "Date d'effet : " + dateFormatter(data.quit_dateeffet, "dd-MM-yyyy HH:mm") + " / Date d'echeance : " + dateFormatter(data.quit_dateecheance, "dd-MM-yyyy HH:mm") + " / Montant Facture : " + data.quit_primettc + " F CFA / Montant encaissé : " + Number(data.quit_mntprimencaisse) + " F / Reste à payer : " + (Number(data.quit_primettc) - Number(data.quit_mntprimencaisse)) + " F CFA";
        this.montantPrimeEncaisse = Number(data.quit_mntprimencaisse);
        this.quittances = [data];
        //console.log(this.quittances);     
        this.filteredQuittance.next(this.quittances.slice());
      });
  }

  onGetAllQuittance2(numfact) {
    this.quittanceService.getQuittanceFact(numfact)
      .subscribe((data: Quittance) => {
        this.quittance = data;
        this.validerFacture();
      });
  }

  onGetAllItermediaire() {
    this.intermediaireService.getAllIntermediaires()
      .subscribe((data: Intermediaire[]) => {
        this.intermediaires = data as Intermediaire[];
        this.filteredIntermediaire.next(this.intermediaires.slice());
      });
  }

  submit() {
    this.addForm.controls['encai_numerointermediaire'].setValue(this.quittance.quit_numerointermedaire);
    this.addForm.controls['encai_mtnquittance'].setValue(this.quittance.quit_primettc);
    this.addForm.controls['encai_datepaiement'].setValue(new Date());
    this.addForm.controls['encai_codeutilisateur'].setValue(this.code_utilisateur);
    console.log(this.addForm.value);

    // Les références de l'encaissement

    this.addFormRefEncaissement.controls['refencai_typepaiement'].setValue(this.addForm.controls['encai_typencaissement'].value);
    this.addFormRefEncaissement.controls['refencai_codebanque'].setValue(this.addForm.controls['encai_codebanque'].value);
    this.addFormRefEncaissement.controls['refencai_numerotitre'].setValue(this.addForm.controls['encai_numerocheque'].value);
    this.addFormRefEncaissement.controls['refencai_montanttitre'].setValue(this.addForm.controls['encai_mtnpaye'].value);

    var montantNormalPaye = this.addForm.controls['encai_mtnpaye'].value;

    if (this.addForm.controls['encai_mtnpaye'].value > this.montantApayer) {
      // On a affaire à un avoir
      this.addFormRefEncaissement.controls['refencai_montantutiliser'].setValue(this.montantApayer);
      this.addForm.controls['encai_mtnpaye'].setValue(this.montantApayer);
    } else {
      // On a affaire à un ACCOMPTE ou SOLDE
      this.addFormRefEncaissement.controls['refencai_montantutiliser'].setValue(this.addForm.controls['encai_mtnpaye'].value);
    }

    this.addFormRefEncaissement.controls['refencai_montantavoir'].setValue(this.addFormRefEncaissement.controls['refencai_montanttitre'].value - this.addFormRefEncaissement.controls['refencai_montantutiliser'].value);

    // console.log("================== REF ENCAISSEMENT =====================");
    // console.log(this.addFormRefEncaissement.value);

    this.encaissementService.addEncaissement(this.addForm.value)
      .subscribe((data: any) => {
        console.log(data)
        let demandeurNew = this.demandeur.replace(/ /g, "_");
        const form = new FormData();
        form.append("demandeur", demandeurNew);
        this.encaissementService.downloadRecuFactureSimple(data.data.encai_numeroencaissement, form)
          .subscribe(event => {
            switch (event.type) {
              case HttpEventType.Sent:
                console.log('Request has been made!');
                break;
              case HttpEventType.ResponseHeader:
                console.log('Response header has been received!');
                break;
              case HttpEventType.UploadProgress:
                break;
              case HttpEventType.Response:
                saveAs(event.body, 'reçu encaissement simple.pdf');
            }
          });
        this.toastrService.show(
          data.message,
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 60000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });

        // Maintenant on peut ajouter les références de l'encaissement
        this.refEncaissementService.saveRefEncaissement(this.addFormRefEncaissement.value)
          .subscribe((data: any) => {
            console.log(data)
            if (data.code === 'ok') {

              this.toastrService.show(
                data.message,
                'Notification',
                {
                  status: this.statusSuccess,
                  destroyByClick: true,
                  duration: 60000,
                  hasIcon: true,
                  position: this.position,
                  preventDuplicates: false,
                });

            } else {
              this.toastrService.show(
                data.message,
                'Notification',
                {
                  status: this.statusFail,
                  destroyByClick: true,
                  duration: 60000,
                  hasIcon: true,
                  position: this.position,
                  preventDuplicates: false,
                });
            }
          });
        this.router.navigateByUrl('home/gestion-comptabilite/gestion-encaissement');
      },
        (error) => {
          this.toastrService.show(
            error.error.message,
            'Notification',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 60000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
        },
      );
    // remettre le montant que l'utilisateur a saisie
    this.addForm.controls['encai_mtnpaye'].setValue(montantNormalPaye);
  }

  check_fonct(fonct: String) {
    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

  //ajout multiple 
  createLignefactureFb(): FormGroup {
    return new FormGroup({
      'encai_numerofacture': new FormControl(),
      'encai_numeropolice': new FormControl(),
      'encai_numerosouscripteur': new FormControl(),
      'encai_numeroquittance': new FormControl(),
      'encai_mtnquittance': new FormControl(),
      'encai_datepaiement': new FormControl(),
      'encai_numerointermediaire': new FormControl(),
      'encai_typequittance': new FormControl(),
      'encai_mtnpaye': new FormControl(),
      'encai_solde': new FormControl(),
      'encai_typencaissement': new FormControl(),
      'encai_codebanque': new FormControl(),
      'encai_numerocheque': new FormControl(),
      'encai_codetraitement': new FormControl(),
      'encai_status': new FormControl(),
      'encai_codeutilisateur': new FormControl(),
    })
  }

  addLigneFactureTogroup() {
    const ligneFactures = this.addFormMultiple.get('ligne_factures') as FormArray;
    ligneFactures.push(this.createLignefactureFb());
  }

  checked(event, f, i) {
    if (event.target.checked) {
      this.factureCtrl.setValue(f.fact_numacte);
      this.quittanceCtrl.setValue(f.fact_numeroquittance);
      this.policeCtrl.setValue(f.fact_numeropolice);
      this.clientsCtrl.setValue(f.fact_numerosouscripteurcontrat);
      this.onGetAllQuittance2(f.fact_numacte);
    } else {
      this.removeOrClearFacture(i);
    }
  }

  ischecked(f) {
    if (this.listFactures.indexOf(f.fact_numacte) > -1) {
      return true;
    } else {
      return false;
    }
  }

  validerFacture() {
    if ((this.policeCtrl.value == '') ||/*(this.clientsCtrl.value =='')||*/
      (this.quittanceCtrl.value == '') || (this.factureCtrl.value == '')) {
      this.showErrorChamps = true;
    } else {
      this.showErrorChamps = false;
      if ((this.listFactures.indexOf(this.factureCtrl.value) > -1) ||
        (this.listQuittances.indexOf(this.quittanceCtrl.value) > -1)) {
        this.showErrorFactQuit = true;
      } else {
        this.showErrorFactQuit = false;
        this.addLigneFactureTogroup();
        const ligneFactures = this.addFormMultiple.get('ligne_factures') as FormArray;
        const ligneFact = ligneFactures.at(this.nbFact) as FormGroup;
        ligneFact.controls['encai_numeropolice'].setValue(this.policeCtrl.value);
        ligneFact.controls['encai_numerosouscripteur'].setValue(this.clientsCtrl.value);
        ligneFact.controls['encai_numerofacture'].setValue(this.factureCtrl.value);
        ligneFact.controls['encai_numeroquittance'].setValue(this.quittanceCtrl.value);
        ligneFact.controls['encai_mtnquittance'].setValue(this.quittance.quit_primettc);
        ligneFact.controls['encai_numerointermediaire'].setValue(this.quittance.quit_numerointermedaire);
        ligneFact.controls['encai_typequittance'].setValue(this.quittance.quit_typequittance);
        ligneFact.controls['encai_codeutilisateur'].setValue(this.code_utilisateur);
        if (this.quittance.quit_mntprimencaisse != null) {
          ligneFact.controls['encai_mtnpaye'].setValue(Number(this.quittance.quit_primettc) - Number(this.quittance.quit_mntprimencaisse));
          this.SomFactures += Number(this.quittance.quit_primettc) - Number(this.quittance.quit_mntprimencaisse);
          console.log(ligneFact.controls['encai_mtnpaye']);
        } else {
          ligneFact.controls['encai_mtnpaye'].setValue(this.quittance.quit_primettc);
          this.SomFactures += this.quittance.quit_primettc;
        }

        this.listFactures.push(this.factureCtrl.value);
        this.listQuittances.push(this.quittanceCtrl.value);

        this.quittance = null;

        this.nbFact++;
        this.checkMontant();
      }
      //this.policeCtrl.setValue('');
      //this.clientsCtrl.setValue('');
      //this.factureCtrl.setValue('');
      //this.quittanceCtrl.setValue('');
    }
  }

  checkMontant() {
    if (this.SomFactures > this.MontantCheque) {
      this.showErrorMontantUp = true;
    } else {
      this.showErrorMontantUp = false;
    }
    if (this.SomFactures < this.MontantCheque) {
      this.Rendu = this.MontantCheque - this.SomFactures;
      this.showErrorMontantDown = true;
    } else {
      this.showErrorMontantDown = false;
    }
    if (this.MontantCheque == 0 || this.SomFactures == 0) {
      this.showErrorMontantDown = false;
      this.showErrorMontantUp = false;
    }
  }

  public removeOrClearFacture(n: number) {
    const ligneFactures = this.addFormMultiple.get('ligne_factures') as FormArray;
    if (ligneFactures.length > 1) {
      this.listFactures.splice(n, 1);
      this.listQuittances.splice(n, 1);
      const ligneFact = ligneFactures.at(n) as FormGroup;
      this.SomFactures = this.SomFactures - ligneFact.controls['encai_mtnquittance'].value;
      ligneFactures.removeAt(n);
      this.nbFact--;
    } else {
      ligneFactures.clear();
      this.listFactures = [];
      this.listQuittances = [];
      this.nbFact = 0;
      this.SomFactures = 0;
      this.showErrorMontantDown = false;
      this.showErrorMontantUp = false;
    }
    this.checkMontant();
  }

  onChangeBanqueSimple(event) {
    console.log("========== Banque: " + event.value);
    this.addForm.controls['encai_codebanque'].setValue(event.value);

  }
  onChangeBanqueMultiple(event) {
    console.log("========== Banque: " + event.value);
    this.addFormMultipleEncaiss.controls['encai_codebanque'].setValue(event.value);

  }
  onChangeMontPay2(event) {
    this.addFormMultipleEncaiss.controls['encai_mtnpaye'].setValue(Number(event.target.value));
    this.MontantCheque = event.target.value;
    this.checkMontant();
  }

  onChangeCodeTraite2(event) {
    this.addFormMultipleEncaiss.controls['encai_codetraitement'].setValue(event);
  }

  /* onChangeTypeEncaiss2(event) {
    if (event == 'espèce') {
      this.addFormMultipleEncaiss.controls['encai_codebanque'].clearValidators();
      this.addFormMultipleEncaiss.controls['encai_numerocheque'].clearValidators();
    } else {
      this.addFormMultipleEncaiss.controls['encai_codebanque'].setValidators(Validators.required);
      this.addFormMultipleEncaiss.controls['encai_numerocheque'].setValidators(Validators.required);
    }
    this.addFormMultipleEncaiss.controls['encai_codebanque'].updateValueAndValidity();
    this.addFormMultipleEncaiss.controls['encai_numerocheque'].updateValueAndValidity();
    this.addFormMultipleEncaiss.controls['encai_typencaissement'].setValue(event);
  } */

  onChangeTypeEncaiss2(event) {
    if (event == 'Op Marchand' || event == 'espèce') {
      this.addFormMultipleEncaiss.controls['encai_codebanque'].setValue('');
      this.banqueCtrl.setValue('');
      this.addFormMultipleEncaiss.controls['encai_numerocheque'].setValue('');
      this.addFormMultipleEncaiss.controls['encai_codebanque'].clearValidators();

      this.showObligatoireBanque = false;

    } else {
      this.addFormMultipleEncaiss.controls['encai_codebanque'].setValue('');
      this.banqueCtrl.setValue('');
      this.addFormMultipleEncaiss.controls['encai_numerocheque'].setValue('');
      this.addFormMultipleEncaiss.controls['encai_codebanque'].setValidators(Validators.required);

      this.showObligatoireBanque = true;
    }
    this.addFormMultipleEncaiss.controls['encai_codebanque'].updateValueAndValidity();
    this.addFormMultipleEncaiss.controls['encai_typencaissement'].setValue(event);
  }

  onChangeTypeQuit2(event) {
    this.addFormMultipleEncaiss.controls['encai_typequittance'].setValue(event);
  }

  /*  submit2() {
     if (this.MontantCheque != 0 && this.SomFactures != 0) {
       this.noPermitAdd = false;
       // let montantFact = this.SomFactures;
       const ligneFactures = this.addFormMultiple.get('ligne_factures') as FormArray;
 
       for (let i = 0; i < this.nbFact; i++) {
         const ligneFact = ligneFactures.at(i) as FormGroup;
         ligneFact.controls['encai_datepaiement'].setValue(new Date());
         ligneFact.controls['encai_typencaissement'].setValue(this.addFormMultipleEncaiss.controls['encai_typencaissement'].value);
         ligneFact.controls['encai_codebanque'].setValue(this.addFormMultipleEncaiss.controls['encai_codebanque'].value);
         ligneFact.controls['encai_numerocheque'].setValue(this.addFormMultipleEncaiss.controls['encai_numerocheque'].value);
 
         ligneFact.controls['encai_status'].setValue(this.addFormMultipleEncaiss.controls['encai_status'].value);
 
         //si on accepte un cheque inferieur au montant total des factures
         //  if(montantFact > ligneFact.controls['encai_mtnquittance'].value){
         //  ligneFact.controls['encai_mtnpaye'].setValue(ligneFact.controls['encai_mtnquittance'].value);
         //  montantFact = montantFact - ligneFact.controls['encai_mtnquittance'].value;
         //  }else{
         //    ligneFact.controls['encai_mtnpaye'].setValue(montantFact);
         //  }
       }
 
       this.encaissementService.addEncaissementMultiple(ligneFactures.value, this.MontantCheque)
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
     } else {
       this.noPermitAdd = true;
     }
   } */

  submit2() {
    if (this.MontantCheque != 0 && this.SomFactures != 0) {
      this.noPermitAdd = false;
      // let montantFact = this.SomFactures;
      const ligneFactures = this.addFormMultiple.get('ligne_factures') as FormArray;

      for (let i = 0; i < this.nbFact; i++) {
        const ligneFact = ligneFactures.at(i) as FormGroup;
        ligneFact.controls['encai_datepaiement'].setValue(new Date());
        ligneFact.controls['encai_typencaissement'].setValue(this.addFormMultipleEncaiss.controls['encai_typencaissement'].value);
        ligneFact.controls['encai_codebanque'].setValue(this.addFormMultipleEncaiss.controls['encai_codebanque'].value);
        ligneFact.controls['encai_numerocheque'].setValue(this.addFormMultipleEncaiss.controls['encai_numerocheque'].value);

        ligneFact.controls['encai_status'].setValue(this.addFormMultipleEncaiss.controls['encai_status'].value);
      }

      // console.log(this.addFormMultiple.value);
      // console.log(ligneFactures.value);
      // console.log(this.MontantCheque);

      // Les références de l'encaissement

      this.addFormRefEncaissement.controls['refencai_typepaiement'].setValue(this.addFormMultipleEncaiss.controls['encai_typencaissement'].value);
      this.addFormRefEncaissement.controls['refencai_codebanque'].setValue(this.addFormMultipleEncaiss.controls['encai_codebanque'].value);
      this.addFormRefEncaissement.controls['refencai_numerotitre'].setValue(this.addFormMultipleEncaiss.controls['encai_numerocheque'].value);
      this.addFormRefEncaissement.controls['refencai_montanttitre'].setValue(Number(this.MontantCheque));

      if (this.MontantCheque > this.SomFactures) {
        // On a affaire à un avoir
        this.addFormRefEncaissement.controls['refencai_montantutiliser'].setValue(Number(this.SomFactures));
      } else {
        // On a affire à un ACCOMPTE ou SOLDE
        this.addFormRefEncaissement.controls['refencai_montantutiliser'].setValue(Number(this.MontantCheque));
      }

      this.addFormRefEncaissement.controls['refencai_montantavoir'].setValue(this.addFormRefEncaissement.controls['refencai_montanttitre'].value - this.addFormRefEncaissement.controls['refencai_montantutiliser'].value);

      // console.log("================== REF ENCAISSEMENT =====================");
      // console.log(this.addFormRefEncaissement.value);

      // =========================================================================================

      // Ajouter les références de l'encaissement
      this.refEncaissementService.saveRefEncaissement(this.addFormRefEncaissement.value)
        .subscribe((data: any) => {
          console.log(data)
          if (data.code === 'ok') {

            this.toastrService.show(
              data.message,
              'Notification',
              {
                status: this.statusSuccess,
                destroyByClick: true,
                duration: 60000,
                hasIcon: true,
                position: this.position,
                preventDuplicates: false,
              });

            //==================Maintenant on peut ajouter l'encaissement multiple ==========

            this.encaissementService.addEncaissementMultiple(ligneFactures.value, this.MontantCheque)
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

                this.router.navigateByUrl('home/gestion-comptabilite/gestion-encaissement');
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

          } else {
            this.toastrService.show(
              data.message,
              'Notification',
              {
                status: this.statusFail,
                destroyByClick: true,
                duration: 60000,
                hasIcon: true,
                position: this.position,
                preventDuplicates: false,
              });
          }
        });

    } else {
      this.noPermitAdd = true;
    }
  }
}
