import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { User } from '../../../model/User';
import dateFormatter from 'date-format-conversion';
import { FormatNumberService } from '../../../services/formatNumber.service';
import { sinistreService } from '../../../services/sinistre.service';
import { TransfertDataService } from '../../../services/transfertData.service';
import { UserService } from '../../../services/user.service';
import { Moratoire } from '../../../model/Moratoire';
import { Sinistre } from '../../../model/Sinistre';
import { Banque } from '../../../model/Banque';
import { BanqueService } from '../../../services/branque.service';
import { Subject, takeUntil, ReplaySubject } from 'rxjs';

@Component({
  selector: 'ngx-encaisser-moratoire',
  templateUrl: './encaisser-moratoire.component.html',
  styleUrls: ['./encaisser-moratoire.component.scss']
})
export class EncaisserMoratoireComponent implements OnInit {
  myMoratoireForm = this.fb.group({
    moratoireForm: this.fb.group({
      morato_num: [''],
      morato_sini: [''],
      morato_datemiseplace: [''],
      morato_mtmoratoire: [''],
      morato_typecheanc: [''],
      morato_nbrecheancacc: [''],
      morato_mtecheanc: [''],
      morato_datech: [''],
      morato_mtnechimpayee: [''],
      morato_nbrecheancimp: [''],
      morato_typencdern: ['', [Validators.required]],
      morato_mtnencaiss: [''],
      morato_cbanq: [''],
      morato_numchq: [''],
      morato_dateco: [''],
      morato_cutil: [''],
      morato_datemo: [''],
      morato_status: ['']
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
  moratoire: Moratoire;
  sinistre: Sinistre;
  autorisation: [];

  montantMoratoire: any = "";
  nbreEcheance: number = 0;
  montantEcheance: any = "";
  montantCumuleImpaye: any = "";
  nbreEcheanceImpaye: any = "";
  typeEcheance: any = "";
  dateEcheance: any = "";
  dateRelance: any = "";
  montantEncaisse: any = "";
  messageExistanceCheque: String = "";

  showObligatoireCodeBanque: boolean = false;
  showObligatoireNumCheque: boolean = false;
  problemeMemeNumCheque: boolean = false;
  erreur: boolean = false;

  banques: Array<Banque> = new Array<Banque>();

  public banqueCtrl: FormControl = new FormControl();
  public banqueFilterCtrl: FormControl = new FormControl();
  public filteredBanque: ReplaySubject<Banque[]> = new ReplaySubject<Banque[]>();

  protected _onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private authService: NbAuthService,
    private sinistreService: sinistreService,
    private router: Router,
    private banqueService: BanqueService,
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
        this.montantMoratoire = this.formatNumberService.numberWithCommas2(data.data.morato_mtmoratoire);
        this.typeEcheance = data.data.morato_typecheanc;
        if(this.typeEcheance === 'M') {
          this.typeEcheance = "Mensuel";
        } else if(this.typeEcheance === 'B') {
          this.typeEcheance = 'Bimestriel';
        } else if(this.typeEcheance === 'T') {
          this.typeEcheance = 'Trimestriel';
        } else {
          this.typeEcheance = '';
        }
        this.nbreEcheance = data.data.morato_nbrecheancacc;
        this.montantEcheance = this.formatNumberService.numberWithCommas2(data.data.morato_mtecheanc);
        this.nbreEcheanceImpaye = data.data.morato_nbrecheancimp;
        this.montantCumuleImpaye = data.data.morato_mtnechimpayee ? this.formatNumberService.numberWithCommas2(data.data.morato_mtnechimpayee) : 0;
        this.dateEcheance = dateFormatter(data.data.morato_datemiseplace, "dd/MM/yyyy");
        this.dateRelance = dateFormatter(data.data.morato_datech, "dd/MM/yyyy");
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

  onChangeCodeReglement(event) {
    if (event === 'C' || event === 'T') {
      this.myMoratoireForm.get('moratoireForm.morato_cbanq').setValidators(Validators.required);
      this.myMoratoireForm.get('moratoireForm.morato_numchq').setValidators(Validators.required);
      this.showObligatoireCodeBanque = true;
      this.showObligatoireNumCheque = true;
    } else {
      this.myMoratoireForm.get('moratoireForm.morato_cbanq').clearValidators();
      this.myMoratoireForm.get('moratoireForm.morato_numchq').clearValidators();
      this.showObligatoireCodeBanque = false;
      this.showObligatoireNumCheque = false;
    }

    this.myMoratoireForm.get('moratoireForm.morato_cbanq').updateValueAndValidity();
    this.myMoratoireForm.get('moratoireForm.morato_numchq').updateValueAndValidity();
  }

  onChangeBanque(event){
    this.myMoratoireForm.get('moratoireForm.morato_cbanq').setValue(event.value);
  }

  onChangeFocusMontantEncaisse(event) {
    this.montantEncaisse = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    this.myMoratoireForm.get('moratoireForm.morato_mtnencaiss').setValue(this.montantEncaisse);
    this.montantEncaisse = this.formatNumberService.numberWithCommas2(this.montantEncaisse);
  }

  onFocusOutEventNumCheque(event) {
    if (event.target.value !== null && event.target.value !== "") {
      this.sinistreService.getMoratoireByNumeroCheque(event.target.value)
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
    this.sinistreService.encaisserMoratoire(this.sinistre.sini_num, this.myMoratoireForm.value)
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
}
