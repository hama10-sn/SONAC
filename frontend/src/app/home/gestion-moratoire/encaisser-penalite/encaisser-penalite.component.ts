import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import dateFormatter from 'date-format-conversion';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { User } from '../../../model/User';
import { FormatNumberService } from '../../../services/formatNumber.service';
import { TransfertDataService } from '../../../services/transfertData.service';
import { UserService } from '../../../services/user.service';
import { sinistreService } from '../../../services/sinistre.service';
import { Moratoire } from '../../../model/Moratoire';
import { Banque } from '../../../model/Banque';
import { BanqueService } from '../../../services/branque.service';

@Component({
  selector: 'ngx-encaisser-penalite',
  templateUrl: './encaisser-penalite.component.html',
  styleUrls: ['./encaisser-penalite.component.scss']
})
export class EncaisserPenaliteComponent implements OnInit {
  myPenaliteForm = this.fb.group({
    penaliteForm: this.fb.group({
      penalit_num: [''],
	    penalit_sini: [''],
	    penalit_morat: [''],
	    penalit_enc: [''],
	    penalit_poli: [''],
	    penalit_nmarch: [''],
	    penalit_datepenalit: [''],
	    penalit_codenc: [''],
	    penalit_dateval: [''],
	    penalit_taux: [''],
	    penalit_mtpenalitfac: [''],
	    penalit_mtpenalitenc: ['', [Validators.required]],
	    penalit_datenc: [''],
	    penalit_typenc: ['', [Validators.required]],
	    penalit_cbanq: [''],
	    penalit_numchq: [''],
	    penalit_dateco: [''],
	    penalit_cutil: [''],
	    penalit_datemo: ['']
    }),
    mvtsinistreForm: this.fb.group({
      mvts_num: [''],
      mvts_poli: [''],
      mvts_numsinistre: [''],
      mvts_datemvt: [''],
      mvts_typemvt: [''],
      mvts_typegestionsinistre: [''],
      mvts_datesaisie: [''],
      mvts_montantmvt: [''],
      mvts_montantfinancier: [''],
      mvts_status: [''],
      mvts_montantprincipal: [''],
      mvts_montantfrais: [''],
      mvts_montanthonoraire: [''],
      mvts_beneficiaire: [''],
      mvts_tiers: [''],
      mvts_motifannulation: [''],
      mvts_dateannulation: [''],
      mvts_codeutilisateur: [''],
      mvts_datemodification: [''],
      mvts_datecomptabilisation: ['']
    }),
  })

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  login: any;
  user: User;
  sinistre: any;
  moratoire: Moratoire;
  autorisation: [];

  montantPenalite: any = "";
  montantEncaisse: any = "";
  typeEcheance: any = "";
  datePenalite: any = "";
  tauxPenalite: any = "";
  messageExistanceCheque: String = "";

  showObligatoireCodeBanque: boolean = false;
  showObligatoireNumCheque: boolean = false;
  problemeMemeNumCheque: boolean = false;
  erreur: boolean = false;

  banques: Array<Banque> = new Array<Banque>();

  public banqueCtrl: FormControl = new FormControl();
  public banqueFilterCtrl: FormControl = new FormControl();
  public filteredBanque: ReplaySubject<Banque[]> = new ReplaySubject<Banque[]>();

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private authService: NbAuthService,
    private sinistreService: sinistreService,
    private banqueService: BanqueService,
    private router: Router,
    private toastrService: NbToastrService,
    private formatNumberService: FormatNumberService,
    private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    this.sinistre = this.transfertData.getData();
    this.onGetAllBanques();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.login = token.getPayload().sub;
          this.onGetUser(this.login);
        }
      });
    this.sinistreService.getMoratoireBySinistre(this.sinistre.sini_num)
      .subscribe((data: any) => {
        this.moratoire = data.data;
        this.sinistreService.getPenaliteByMoratoire(this.moratoire.morato_num)
          .subscribe((data: any) => {
            this.montantPenalite = this.formatNumberService.numberWithCommas2(data.data.penalit_mtpenalitfac);
            this.datePenalite = dateFormatter(data.data.penalit_datepenalit, "dd/MM/yyyy");
            this.tauxPenalite = data.data.penalit_taux;
          })
      })
    this.banqueFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanques();
      });    
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
      });
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
      bq.banq_denomination.toString().toLowerCase().indexOf(search) > -1 )

    );
  }

  onGetAllBanques() {
    this.banqueService.getAllBanques()
      .subscribe((data: any) => {
        if(data.code === "ok"){
          this.banques = data.data as Banque[];
          this.filteredBanque.next(this.banques.slice());
        }else{
          this.banques = data.data;
        }
      });
  }

  onChangeFocusMontantPenalite(event) {
    this.montantEncaisse = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    this.myPenaliteForm.get('penaliteForm.penalit_mtpenalitenc').setValue(this.montantEncaisse);
    this.montantEncaisse = this.formatNumberService.numberWithCommas2(this.montantEncaisse);
  }

  onChangeCodeReglement(event) {
    if (event === 'C' || event === 'T') {
      this.myPenaliteForm.get('penaliteForm.penalit_cbanq').setValidators(Validators.required);
      this.myPenaliteForm.get('penaliteForm.peanlit_numchq').setValidators(Validators.required);
      this.showObligatoireCodeBanque = true;
      this.showObligatoireNumCheque = true;
    } else {
      this.myPenaliteForm.get('penaliteForm.penalit_cbanq').clearValidators();
      this.myPenaliteForm.get('penaliteForm.penalit_numchq').clearValidators();
      this.showObligatoireCodeBanque = false;
      this.showObligatoireNumCheque = false;
    }

    this.myPenaliteForm.get('penaliteForm.penalit_cbanq').updateValueAndValidity();
    this.myPenaliteForm.get('penaliteForm.penalit_numchq').updateValueAndValidity();
  }

  onChangeBanque(event){
    this.myPenaliteForm.get('penaliteForm.penalit_cbanq').setValue(event.value);
  }

  onFocusOutEventNumCheque(event) {
    if (event.target.value !== null && event.target.value !== "") {
      this.sinistreService.getPenaliteByNumeroCheque(event.target.value)
        .subscribe((data: any) => {
          if (data.code === "ok") {
            // Le numéro de cheque est déjà utilisé
            this.problemeMemeNumCheque = true;
            this.messageExistanceCheque = data.message;
            this.erreur = true;
          } else {
            this.problemeMemeNumCheque = false;
            this.erreur = false;
          }
        });
    }
  }

  getColorNumCheque() {
    if (this.problemeMemeNumCheque) {
      return '1px solid red';
    }
    else {
      return '';
    }
  }


  onSubmit() {
    this.myPenaliteForm.get('penaliteForm.penalit_cutil').setValue(this.user.util_numero);
    this.sinistreService.encaisserPenalite(this.sinistre.sini_num, this.myPenaliteForm.value)
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
          this.transfertData.setData(data.data);
          this.router.navigateByUrl("/home/gestion-comptable/encaissement-moratoire-penalite");

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
      });
  }

  cancel() {
    this.router.navigateByUrl("/home/gestion-moratoire/liste-sinistre-recours")
  }
}
