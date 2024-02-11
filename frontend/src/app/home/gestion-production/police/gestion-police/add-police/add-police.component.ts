import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService, NbDialogService} from '@nebular/theme';
import { Accessoire } from '../../../../../model/Accessoire';
import { Branche } from '../../../../../model/Branche';
import { Categorie } from '../../../../../model/Categorie';
import { Cimacodificationcompagnie } from '../../../../../model/Cimacodificationcompagnie';
import { Client } from '../../../../../model/Client';
import { Commission } from '../../../../../model/Commission';
import { Filiale } from '../../../../../model/Filiale';
import { Groupe } from '../../../../../model/Groupe';
import { Intermediaire } from '../../../../../model/Intermediaire';
import { Produit } from '../../../../../model/Produit';
import { Taxe } from '../../../../../model/taxe';
import { User } from '../../../../../model/User';
import dateFormatter from 'date-format-conversion';
import { AccessoireService } from '../../../../../services/accessoire.service';
import { AcheteurService } from '../../../../../services/acheteur.service';
import { ActeService } from '../../../../../services/acte.service';
import { AvenantService } from '../../../../../services/avenant.service';
import { BeneficiaireService } from '../../../../../services/beneficiaire.service';
import { BrancheService } from '../../../../../services/branche.service';
import { CategorieService } from '../../../../../services/categorie.service';
import { ClientService } from '../../../../../services/client.service';
import { CommissionService } from '../../../../../services/commission.service';
import { CompagnieService } from '../../../../../services/compagnie.service';
import { CreditService } from '../../../../../services/credit.service';
import { EngagementService } from '../../../../../services/engagement.service';
import { FactureService } from '../../../../../services/facture.service';
import { FilialeService } from '../../../../../services/filiale.service';
import { GroupeService } from '../../../../../services/groupe.service';
import { IntermediaireService } from '../../../../../services/intermediaire.service';
import { LotService } from '../../../../../services/lot.service';
import { MarcheService } from '../../../../../services/marche.service';
import { PoliceService } from '../../../../../services/police.service';
import { ProduitService } from '../../../../../services/produit.service';
import { QuittanceService } from '../../../../../services/quittance.service';
import { RisqueService } from '../../../../../services/risque.service';
import { RisqueLocatifService } from '../../../../../services/risquelocatif.service';
import { RisqueReglementeService } from '../../../../../services/risquereglemente.service';
import { TaxeService } from '../../../../../services/taxe.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { UserService } from '../../../../../services/user.service';
import countries from '../../../../data/countries.json';
import type from '../../../../data/type.json';
import { PoliceForm } from '../../../../../model/PoliceForm';
import { FormatNumberService } from '../../../../../services/formatNumber.service';
@Component({
  selector: 'ngx-add-police',
  templateUrl: './add-police.component.html',
  styleUrls: ['./add-police.component.scss']
})
export class AddPoliceComponent implements OnInit {

//variable
polizei: any;
tauxAp:number = 0 ;

errorDomestique:boolean = false;

  addForm = this.fb.group({

    //police
    poli_numero: [''],
    poli_codeproduit: ['', [Validators.required]],
    poli_intermediaire: ['', [Validators.required]],
    poli_compagnie: ['', [Validators.required]],
    poli_codepays: ['', [Validators.required]],
    poli_codegroupe: [''],
    poli_filiale: [''],
    poli_branche: ['', [Validators.required]],
    poli_categorie: ['', [Validators.required]],

    //(1' souscripteur, '2' assuré, '3' souscripteur & assuré, '4' autres)
    poli_souscripteur: ['', [Validators.required]],
    poli_client: ['', [Validators.required]],
    poli_dateeffet1: [''],
    poli_dateanniversaire: [''],
    poli_dateeffetencours: ['', [Validators.required]],
    poli_dateecheance: ['', [Validators.required]],
    poli_duree: [''], //(durée en mois)
    poli_daterevision: [''],
    poli_typecontrat: ['', [Validators.required]],
    poli_typerevision: [''],
    poli_typegestion: ['', [Validators.required]],
    poli_codefractionnement: ['', [Validators.required]],
    poli_primenetreference: [''],
    poli_primenettotal: [''],
    poli_primebruttotal: [''],
    poli_coefbonus: [''],
    poli_remisecommerciale: [''],
    poli_numeroattestation: [''],
    poli_numerocertificat: [''],
    poli_policeremplacee: [''], // oblig pour la reprisse des données
    poli_typefacultive: [''],
    poli_numeroplancoassur: [''],
    poli_numeroplanreassfac: [''],
    poli_numerodernieravenant: ['', [Validators.required]],
    poli_datesuspension: [''],
    poli_dateremisevigueur: [''],
    poli_dateresiliation: [''],
    poli_status: [''], // actif ou non actif
    poli_indice: [''],
    poli_typeindice: [''],
    poli_dateindice: [''], // (à revoir est-ce numérique ou Date)
    poli_valeurindice: [''],
    poli_clauseajustement: [''],
    poli_clauserevision: [''],
    poli_exonerationtaxeenr: [''], //(oui ou non)
    poli_codetaxe: [''],
    poli_exonerationtva: [''], //(oui ou non)
    poli_codetva: [''],
    poli_exonerationtps: ['' , [Validators.required]], // (oui ou non)
    poli_codetps: [''],
    poli_datexoneration: [''],
    poli_formulegarantie: [''],
    poli_participationbenef: [''], // (Oui/Non)
    poli_tauxparticipationbenef: [''],
    poli_codecutilisateur: [''], // obligatoire on l'ajout au moment du submit
    // poli_datemodification: ['', [Validators.required]],

   //acte
act_numero: [''],
act_numeropolice: [''],
act_typegarantie: ['', [Validators.required]],
act_typemarche: [''],
act_numeromarchepublic: [''],
act_codemarche: [''],
act_datemarche: [''],
act_idcontractante: [''],
act_idbeneficiaire: [''],
act_idcandidat: [''],
act_descriptionmarche: [''],
act_capitalassure: [''],
act_capitalsmp: [''],
act_capitallci: [''],
act_anciennumero: [''],
act_status: [''],
act_datecomptabilisation: [''],

//acte clause
Clact_numeroclause: [''],
clact_numeroacte: [''],

   //risque

risq_numeropolice: [''],
risq_numero: [''],
risq_numeroacte: [''],
risq_typerisque: [''],
risq_designation1: ['', [Validators.required]],
risq_designation2: [''],
risq_localisation1: ['', [Validators.required]],
risq_localisation2: [''],
risq_gps: [''],
risq_capitalassure: ['', [Validators.required]],
risq_capitalsmp: [''],
risq_capitallci: [''],
risq_pourcentfacultativeplacement: [''],
risq_pourcentfacultativen1: [''],
risq_pourcentfacultativen2: [''],
risq_formulegarantierisque: [''],
risq_codebienassurable: [''],
risq_mtnglobalcredit: [''],
risq_nbreecheances: [''],
risq_nbreecheanceimpayees: [''],
risq_codeutilisateur: [''],
risq_datemodification: [''],
risq_typedeclarationrevision: [''],
risq_valeurdeclarative: [''],
risq_typeindemnisationretenue: [''],
risq_typefranchise: [''],
risq_franchise: [''],
risq_typeprotection: [''],
risq_priseenchargeautorisee: [''],
risq_visitetechobligatoire: [''],
risq_visitetechperiodicite: [''],
risq_visitetechrapport: [''],
risq_visitetechdate: [''],
risq_status: [''],
risq_genrerisque: [''],

// credit
credit_numero: [''],
credit_numeroclient: [''],
credit_numeroachateur: [''],
credit_type: [''],
credit_typemarchandise: [''],
credit_mtncredit: [''],
credit_nbecheanceaccorde: [''],
credit_nbechenaceretard: [''],
credit_nbecheanceimpaye: [''],
credit_mntindemnite: [''],
credit_mtnrecours: [''],
credit_mtnrecoursencaisse: [''],
credit_chargerecouvrement: [''],
credit_codeutil: [''],
credit_datemodification: [''],

//risque locatif

riskl_numero: [''],
riskl_numerorisquegenerique: [''],
riskl_numeroclient: [''],
riskl_numeroacheteur: [''],
riskl_numeropolice: [''],
riskl_type: [''],
riskl_description: [''],
riskl_mtnloyer: [''],
riskl_nombreloyerimpaye: [''],
riskl_mtnloyerimpaye: [''],
riskl_mntloyerindemnite: [''],
riskl_mntloyerrecouvre: [''],
risql_codeutilisateur: [''],

//risque reglementes

riskr_numero: [''],
riskr_numerorisquegenerique: [''],
riskr_numeroclient: [''],
riskr_numeropolice: [''],
riskr_type: [''],
riskr_description: [''],
riskr_mtncaution: [''],
riskr_mtncouverturefinanciere: [''],
riskr_dateexigibilite: [''],
riskr_daterenouvellement: [''],
riskr_capitauxgaranti: [''],
riskr_beneficiaire: [''],
riskr_revision: [''],
riskr_daterevision: [''],
riskr_codeutilisateur: [''],

  //lot
  lot_numero: [''],
	lot_numeroacte: [''],
	lot_numeromarche: [''],
	lot_codeinternemarche: [''],
	lot_description: [''],
	lot_capitalass: [''],
	lot_capitalsmp: [''],
	lot_capitallci: [''],
	lot_dureetravaux: [''],

  //marché
  march_numero: [''],
	march_identification: [''],
	march_idcontractante: [''],
	march_donneurordre: [''],
	march_descriptionmarche1: [''],
	march_descriptionmarche2: [''],
	march_nombrelots: [''],
	march_dureeenmois: [''],
	march_capitalglobalmarche: [''],
	march_capitalglobalsmpmarche: [''],
	march_capitalglobalslcimarche: [''],
	march_status: [''],
	march_datemodification: [''],
	march_codeutil: [''],

  //acheteur
  achet_id: [''],
	achet_numero: [''],
	achet_numeroclient: [''],
	achet_numeroaffaire: [''],
	achet_type: [''],
	achet_chiffreaffaire: [''],
	achet_incidentpaiement: [''],
	achet_montantincidentpaiement: [''],
	achet_montantpaiementrecup: [''],
	achet_dispersion: [''],
	achet_qualite: [''],
	achet_typologie: [''],
	achet_creditencours: [''],
	achet_montantcredit: [''],
	achet_montantrembours: [''],
	achet_montantecheance: [''],
	achet_montantecheancecredit: [''],
	achet_montantecheanceimpaye: [''],
	achet_montantimpaye: [''],
	achet_montantrecouvre: [''],
	achet_codeutilisateur: [''],
	achet_datemodification: [''],

  //facture
  facture_id: [''],
fact_numacte: [''],
fact_datefacture: [''],
fact_numeropolice: [''],
fact_numeroacte: [''],
fact_numeroquittance: [''],
fact_marche: [''],
fact_numerosouscripteurcontrat: [''],
fact_numeoracheteur: [''],
fact_numeroassure: [''],
fact_numerobeneficiaire: [''],
fact_objetfacture: [''],
fact_montantprimenet: [''],
fact_montantaccescompagnie: [''],
fact_montantaccesapporteur: [''],
fact_montanttaxe: [''],
fact_montantarrondi: [''],
fact_commissionapporteur: [''],
fact_montantttc: [''],
fact_numerobranche: [''],
fact_numerocategorie: [''],
fact_dateeffetcontrat: [''],
fact_dateecheancecontrat: [''],
fact_capitalassure: [''],
fact_capitalsmp: [''],
fact_capitallci: [''],
fact_datecomptabilisation: [''],
fact_codeutilisateur: [''],
fact_datemodification: [''],
fact_etatfacture: [''],
fact_codeannulation: [''],
fact_dateannulation: [''],
fact_anciennumerofacture: [''],

//quittance
quit_id: [''],
quit_numero: [''],
quit_Facture: [''],
quit_numeropolice: [''],
quit_numavenant: [''],
quit_numerorisque: [''],
quit_numerocie: [''],
quit_numerointermedaire: [''],
quit_typequittance: [''],
quit_typeecriture: [''],
quit_typemvt: [''],
quit_dateemission: [''],
quit_datecomotable: [''],
quit_dateeffet: [''],
quit_dateecheance: [''],
quit_typologieannulation: [''],
quit_dateannulation: [''],
quit_numeroaperitrice: [''],
quit_primenette: [''],
quit_primeext: [''],
quit_commissionsapporteur1: [''],
quit_commissionsapporteur2: [''],
quit_accessoirecompagnie: [''],
quit_accessoireapporteur: [''],
quit_tauxte: [''],
quit_codetaxete: [''],
quit_tauxtva: [''],
quit_codetva: [''],
quit_tauxtps: [''],
quit_codetps: [''],
quit_mtntaxete: [''],
quit_mtntva: [''],
quit_mtntps: [''],
quit_mntreductionprime: [''],
quit_primettc: [''],
quit_mntprimencaisse: [''],
quit_dateencaissament: [''],
quit_tauxreductioncommer: [''],
quit_tauxbonus: [''],
quit_tauxreductionautres: [''],
quit_mtnreduction: [''],
quit_mtnbonus: [''],
quit_mtnreductionautres: [''],
quit_numeroattestationauto: [''],
quit_numeroressp: [''],
quit_numerocertif: [''],
quit_exoneration: [''],
quit_dateexoneration: [''],
quit_codeutilisateur: [''],
quit_numeroquittanceannul: [''],
quit_datemiseajour: [''],
quit_datecomptabilisation: [''],
quit_anciennumerofacture: [''],
quit_status: [''],

//engagement
engag_id: [''],
engag_numpoli: [''],
engag_numeroavenant: [''],
engag_numeroacte: [''],
engag_numeroengagement: [''],
engag_codemarche: [''],
engag_kapassure: [''],
engag_dateengagement: [''],
engag_capitalliberationengage: [''],
engag_dateliberation: [''],
engag_typesureté: [''],
engag_identificationtitre: [''],
engag_retenudeposit: [''],
engag_datedeposit: [''],
engag_depositlibere: [''],
engag_dateliberationdeposit: [''],
engag_cautionsolidaire: [''],
engag_datecomptabilisation: [''],
engag_status: [''],
engag_codeutilisateur: [''],
engag_datemodification: [''],

//avenant
aven_id: [''],
aven_numeropolice: [''],
aven_numeroavenant: [''],
aven_codeintermediare: [''],
aven_codecompagnie: [''],
aven_codemarche: [''],
aven_typavenant: [''],
aven_dateeffet: [''],
aven_dateecheance: [''],
aven_duree: [''],
aven_daterevision: [''],
aven_typerevision: [''],
aven_typecontrat: [''],
aven_typegestion: [''],
aven_typefraction: [''],
aven_montantprimenet: [''],
aven_montantprimebrut: [''],
aven_coefbonus: [''],
aven_coefremisecie: [''],
aven_numeroattestionauto: [''],
aven_numerocertificat: [''],
aven_numpoliceremplacee: [''],
aven_typefacultative: [''],
aven_numeroplancoassur: [''],
aven_numeroplanreassur: [''],
aven_numeroderniernavenant: [''],
aven_datesuspension: [''],
aven_dateremisevigueur: [''],
aven_dateresiliation: [''],
aven_statut: [''],
aven_indice: [''],
aven_typeindice: [''],
aven_dateindice: [''],
aven_valeurindice: [''],
aven_exonerationtaxe: [''],
aven_codetaxe: [''],
aven_exonerationtva: [''],
aven_codetva: [''],
aven_exonerationtps: [''],
aven_codetps: [''],
aven_dateexoneration: [''],
aven_formulegarantie: [''],
aven_utilisateur: [''],
aven_datemodification: [''],

//beneficiaire
benef_id: [''],
benef_Num: [''],
benef_typbenef: [''],
benef_nom: [''],
benef_prenoms: [''],
benef_denom: [''],
benef_status: [''],
benef_ccutil: [''],
benef_datemo: [''],

//variable à utiliser
type_traitement: [''],
type_risque: [''],
proratis: [''],
type_ca: [''],
//variable pour backend
lot: [''],
marche: [''],
credit: [''],
riskl: [''],
riskr: [''],
acheteur: [''],

  });
//taux
taux: any;
duree: any;
code_taxe: any;
taux_produit: Number;
primenette: Number;
taxeTE: Number;
primebrute: Number;
tauxcommission: Number;
tmp: Number;
commission: Commission;
accessoire: Accessoire;
accessoirecompagnie: Number = 0;
accessoireapporteur: Number = 0;
id_avenant: Number;
commissionsapporteur1: Number = 0;

//visibilité champ
riskr: Boolean = false;
riskl: Boolean = false;
riskc: Boolean = false;
risk: Boolean = false;
credit: Boolean = false;
soumission: Boolean = false;
natureClient: Boolean;
proratis: Boolean = false;
//json
listType: any[];
listTypeContrat: any[];
listTypeGestion: any[];
listTypeRevision: any[];
listTypeClauseRevision: any[];
listTypeFractionnement: any[];
listTypeActe: any[];
listTypeFacultative: any[];
listTypeIndice: any[];

codeProduitChoisi: Number=0;
codeApporteurChoisi: Number=0;
client: Client;
taxes: Array<Taxe> = new Array<Taxe>();
  // Pour gérer la liste déroulante pour les clés étrangères
  // listeCodeTaxe: any[];
  // listeCodeCommission: any[];
  listeNumeroIntermediaire: Array<Intermediaire> = new Array<Intermediaire>();
  listeCodeBranche: Array<Branche> = new Array<Branche>();
  listeNumeroCategorie: Array<Categorie> = new Array<Categorie>();
  listeCodeProduit: Array<Produit> = new Array<Produit>();
  codecimacomp: Array<Cimacodificationcompagnie> = new Array<Cimacodificationcompagnie>();
  commissions: Array<Commission> = new Array<Commission>() ;
  @Input() listPays: any[] = countries;
  listGroupes: Array<Groupe> = new Array<Groupe>();
  listeCodeFiliale_compagnie: Array<Filiale> = new Array<Filiale>() ;
  @Input() listTypeclient: any[] = type;
  codecompagnie: string;
  listeCompagnie: any[];
  accessoires: Array<Accessoire> = new Array<Accessoire>() ;
  pb: Number=0;
  autorisation = [];

  // variable pour le controle de validation
  // problemeLibelleLong: boolean = false;
  // problemeLibelleCourt: boolean = false;
  // problemeNumeroBranche: boolean = false;

  erreur: boolean = false;
  listeClients: Array<Client> = new Array<Client>();
  login: any;
  user: User;
  fact: Number;
  exo: boolean = false;

  // Vider les champs catgorie et produit quand on change Branche:
  poli_codecategorie: any;
  poli_codeproduit: any;
  formatcapitalassure: Number;

  ca:string = 'CA_GLOBAL';

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  showDateExo:Boolean = false;

  // tslint:disable-next-line:max-line-length
  constructor(private fb: FormBuilder, private factureService: FactureService, private beneficiaireService: BeneficiaireService,
    private policeService: PoliceService, private engagementService: EngagementService,
    private userService: UserService, private acheteurService: AcheteurService,
    private interService: IntermediaireService, private creditService: CreditService,
    private brancheService: BrancheService, private risqueLocatifService: RisqueLocatifService,
    private categorieService: CategorieService, private risqueReglementeService: RisqueReglementeService,
    private formatNumberService: FormatNumberService,
    // tslint:disable-next-line:max-line-length
    private produitService: ProduitService, private acteService: ActeService, private quittanceService: QuittanceService,
    private compagniService: CompagnieService, private lotService: LotService,
    private groupeService: GroupeService, private marcheService: MarcheService,private avenantService: AvenantService,
    // tslint:disable-next-line:max-line-length
    private filialeService: FilialeService, private risqueService: RisqueService,private accessoireService: AccessoireService,
    // tslint:disable-next-line:max-line-length
    private toastrService: NbToastrService, private clientService: ClientService, private commissionService: CommissionService,
    private authService: NbAuthService, private transfertData: TransfertDataService, private taxeService: TaxeService,
    private router: Router, private dialogService: NbDialogService) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
      }
    });

    this.getlogin();
    this.onGetAllIntermediaires();
    this.onGetAllBranches();
    this.onGetAllCodecimacompagnie();
    this.onGetAllGroupe();
    this.onGetAllFiliale() ;
    this.onGetAllClients();
    this.onGetALlTaxes();
    this.onGetAllCommissions();
    this.onGetAllAccessoires();

     this.client = this.transfertData.getData();
     if(this.client?.clien_denomination === '' || this.client?.clien_denomination === null){
      // tslint:disable-next-line:max-line-length
      this.addForm.controls['poli_client'].setValue(this.client?.clien_numero + ': ' + this.client?.clien_prenom + ' ' + this.client?.clien_nom);
      this.natureClient = true;
      // tslint:disable-next-line:max-line-length
      this.addForm.controls['march_donneurordre'].setValue(this.client?.clien_numero + ': ' + this.client?.clien_prenom + ' ' + this.client?.clien_nom);
    }
   else{
     // tslint:disable-next-line:max-line-length
    this.addForm.controls['poli_client'].setValue(this.client?.clien_numero + ': ' + this.client?.clien_denomination);
    this.natureClient = false;
    // tslint:disable-next-line:max-line-length
    this.addForm.controls['march_donneurordre'].setValue(this.client?.clien_numero + ': ' + this.client?.clien_denomination);
  }
    this.addForm.controls['act_idcandidat'].setValue(this.client?.clien_numero);
     this.listType = this.listTypeclient['TYPE_CLIENT'];
     this.listTypeContrat = this.listTypeclient['CLAUSES_CONTRAT'];
     this.listTypeRevision = this.listTypeclient['CLAUSES_REVISION'];
     this.listTypeGestion = this.listTypeclient['TYPE_GESTION'];
     this.listTypeClauseRevision = this.listTypeclient['CLAUSES_REVISION'];
     this.listTypeFractionnement = this.listTypeclient['TYPE_FRACTIONNEMENT'];
     this.listTypeActe = this.listTypeclient['TYPE_ACTE'];
     this.listTypeFacultative = this.listTypeclient['TYPE_FACULTATIVE'];
     this.listTypeIndice = this.listTypeclient['TYPE_INDICE'];
    this.addForm.controls['poli_numerodernieravenant'].setValue('0');
    this.addForm.controls['poli_remisecommerciale'].setValue('0');
    this.addForm.controls['achet_qualite'].setValue('0');
    this.addForm.controls['poli_exonerationtps'].setValue('non');
    // tslint:disable-next-line:max-line-length
    this.addForm.controls['poli_codepays'].setValue('221: Sénégal');
    this.addForm.controls['poli_compagnie'].setValue('SNNVIAS008: SONAC');
    this.addForm.controls['risq_capitalsmp'].setValue('0');
    this.addForm.controls['risq_capitallci'].setValue('0');
    
    this.addForm.controls['march_idcontractante'].setValue(this.client?.clien_numero);
    
    // tslint:disable-next-line:max-line-length
     this.addForm.controls['poli_souscripteur'].setValue(this.client.clien_typeclient + ': ' + (this.listType.find(p => p.id == this.client.clien_typeclient))?.value );
  }

  onCancel() {
    this.transfertData.setData(this.client.clien_numero);
    this.router.navigateByUrl('home/parametrage-production/police');
  }
  onOpenPolice(id: Number) {
    this.transfertData.setData(id);
    this.router.navigateByUrl('home/parametrage-production/police');
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

  onGetAllIntermediaires() {
    this.interService.getAllIntermediaires()
      .subscribe((data: Intermediaire[]) => {
        this.listeNumeroIntermediaire = data as Intermediaire[];
      });
  }

  onGetAllBranches() {
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
        this.listeCodeBranche = data as Branche[];
      });
  }

  onGetAllCategorieByBranche(branche: number) {
    this.categorieService.getAllCategorieBranche(branche)
      .subscribe((data: Categorie[]) => {
        this.listeNumeroCategorie = data as Categorie[];
      });
  }

  onGetAllProduitByCategorie(categorie: number) {
    this.produitService.getAllProduitByCategorie(categorie)
      .subscribe((data: Produit[]) => {
        this.listeCodeProduit = data as Produit[];
      });
  }

  onGetAllCodecimacompagnie() {
    this.compagniService.getAllCodecimacompagnies()
      .subscribe((data: Cimacodificationcompagnie[]) => {
        this.codecimacomp = data as Cimacodificationcompagnie[];
        // this.listecodecimacomp = data as Cimacodificationcompagnie[];
      });
  }

  onGetAllGroupe() {
    this.groupeService.getAllGroupes()
      .subscribe((data: Groupe[]) => {
        this.listGroupes = data as Groupe[];
      });
  }

  onGetAllFiliale() {
    this.filialeService.getAllFiliales()
      .subscribe((data: Filiale[]) => {
        this.listeCodeFiliale_compagnie = data as Filiale[];
      });
  }
  
  onChangeExoneration(event) {
    //this.codeApporteurChoisi = event;
    this.addForm.controls['poli_exonerationtaxeenr'].setValue(event);
    this.tarifer();
    if(event == "oui"){
      this.showDateExo = true;
    }else{
      this.showDateExo = false;
    }
  //this.tmp= this.taux_produit;
/* console.log(event);
   if (event == 'oui') {
    //this.taux_produit=0;
    this.exo = true;
    this.addForm.controls['quit_mtntaxete'].setValue('0');
    this.pb=Number(this.primebrute)-Number(this.taxeTE);
    this.addForm.controls['poli_primebruttotal'].setValue(Number(this.primebrute)-Number(this.taxeTE));
    }
    else{ 
      this.exo = false;
  //  this.taux_produit=this.tmp;
    this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
    this.addForm.controls['poli_primebruttotal'].setValue(Number(this.primebrute));
   } */
  }


  onChangeIntermediaire(event) {
    this.codeApporteurChoisi = event;
    this.addForm.controls['poli_intermediaire'].setValue(event);

    // if (this.codeProduitChoisi != null) {
    //   this.numConcat = this.codeApporteurChoisi + this.codeProduitChoisi;
    //   this.addForm.controls['comm_code'].setValue(this.numConcat.toString());
    // }
    /* this.taux = 0;
    this.addForm.controls['poli_primenettotal'].setValue('');
    this.code_taxe = this.listeCodeProduit.find(p => p.prod_numero == this.codeProduitChoisi)?.prod_codetaxe;
    this.taux_produit  = Number(this.taxes.find(p => p.taxe_codetaxe == this.code_taxe)?.taxe_txappliq) / 100;
    // tslint:disable-next-line:max-line-length
    this.commission= this.commissions.find(p => p.comm_codeproduit == this.codeProduitChoisi && p.comm_codeapporteur==event);
    this.accessoire= this.accessoires.find(p => p.acces_codeproduit == this.codeProduitChoisi);

    if(isNaN(Number(this.taux_produit)))
     this.taux_produit =0;
     if(this.addForm.get('poli_exonerationtps').value=='oui')
     this.taux_produit =0;
    if(this.codeProduitChoisi ==15001001 )
     this.soumission = true;
     else
     this.soumission = false;
    // this.numConcat = this.codeApporteurChoisi + this.codeProduitChoisi;
    // this.addForm.controls['comm_code'].setValue(this.numConcat.toString());
 */
    // tslint:disable-next-line:max-line-length
    if(this.codeProduitChoisi ==15001015||this.codeProduitChoisi ==15001012||this.codeProduitChoisi ==15001013||this.codeProduitChoisi ==15001014||this.codeProduitChoisi ==15001010||this.codeProduitChoisi ==15001011){
      this.risk = true;
      this.riskl= false;
      this.riskr= true;
      this.credit= false;
      this.riskc= false;
    }
    // tslint:disable-next-line:max-line-length
    else if(this.codeProduitChoisi ==15001001||this.codeProduitChoisi ==15001002||this.codeProduitChoisi ==15001003||this.codeProduitChoisi ==15001004||this.codeProduitChoisi ==15001005){
      this.riskl = false;
      this.risk = true;
      this.riskr= false;
      this.credit= false;
      this.riskc= true;
    }

 /*    
    if(this.codeProduitChoisi ==14003001){
      if (this.duree < 60) {
        this.taux = 1 / 100;
      }
      else if (this.duree  > 60 && this.duree < 90) {
        this.taux = 1.5 / 100;
      }
      else {
        this.taux = 2 / 100;
      }
      console.log('14003001');
      this.primenette = Number(this.formatcapitalassure) * this.taux;
     
  //pour commission
  this.pourcommission();
    //fin commission

    //pour accessoire
  this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);

    }
 */
   /*  if(this.codeProduitChoisi ==16008001){
        this.taux = 5 / 100;
     
        this.primenette = Number(this.formatcapitalassure) * this.taux;
        
    //pour commission
    this.pourcommission();
      //fin commission
      
    //pour accessoire
  this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
    } */

    /* if(this.codeProduitChoisi ==15001001){
      this.taux = 0;
      this.addForm.controls['poli_primenettotal'].setValue('');
      if(this.addForm.get('type_traitement').value =='express'){
      this.taux = 1.5 / 100;
    }
    if(this.addForm.get('type_traitement').value =='normal'){
      this.taux = 1 / 100;
    }
    this.primenette = Number(this.formatcapitalassure) * this.taux;
    
      //pour commission
  this.pourcommission();
    //fin commission
    //pour accessoire
  this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
  } */

  // tslint:disable-next-line:max-line-length
 /*  if(this.codeProduitChoisi ==15001002 || this.codeProduitChoisi ==15001003 || this.codeProduitChoisi ==15001004|| this.codeProduitChoisi ==15001005|| this.codeProduitChoisi ==15001006){
    this.taux = 3 / 100;
 
    this.primenette = Number(this.formatcapitalassure) * this.taux;
    
      //pour commission
  this.pourcommission();
    //fin commission
    //pour accessoire
  this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
} */
/* if(this.codeProduitChoisi ==15001007){
  this.taux = 5 / 100;

  this.primenette = Number(this.formatcapitalassure) * this.taux;
 
      //pour commission
  this.pourcommission();
    //fin commission
    //pour accessoire
  this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
}*/

  } 

  onChangeBranche(event) {

    this.onGetAllCategorieByBranche(event);
    this.addForm.controls['poli_branche'].setValue(event);
    this.addForm.controls['risq_typerisque'].setValue(event);

    this.poli_codecategorie = "".toString();
    this.poli_codeproduit = "".toString();
    this.addForm.controls['poli_categorie'].setValue(this.poli_codecategorie);
    this.addForm.controls['poli_codeproduit'].setValue(this.poli_codeproduit);
 
     if(event =='16'){
      this.riskl = true;
      this.risk = true;
      this.riskr= false;
      this.credit= false;
      this.riskc= false;
      this.listTypeFractionnement = this.listTypeclient['TYPE_FRACTIONNEMENT'];
      this.listTypeActe = [ 
{"id" : "15", "value":"ACTE Locassur"}
      ];
    }
      else if(event =='15'){
      this.riskr = false;
      this.riskl = false;
      this.risk = true;
      this.credit= false;
      this.riskc= false;
      this.listTypeFractionnement= [{"id" : "1", "value":"Annuel"},{"id" : "5", "value":"Prorata temporis"}]
      this.listTypeActe = [ 
        {"id" : "1", "value":"Caution CS"},
{"id" : "2", "value":"Caution AD"},
{"id" : "3", "value":"Caution de BE"},
{"id" : "4", "value":"Caution de RG"},
{"id" : "5", "value":"Caution DE"},
{"id" : "6", "value":"Caution CA"},
{"id" : "7", "value":"Caution CD"},
{"id" : "8", "value":"Caution CI"},
{"id" : "9", "value":"Caution AV"},
{"id" : "10", "value":"Caution SI"},
{"id" : "11", "value":"Caution CJ"}
      ];
    }
      else if(event =='14'){
      this.credit = true;
      this.riskr = false;
      this.riskl = false;
      this.risk = true;
      this.riskc= false;
      this.listTypeFractionnement = this.listTypeclient['TYPE_FRACTIONNEMENT'];
      this.listTypeActe = [
							  {"id" : "12", "value":"ACTE finanssur"},
							  {"id" : "13", "value":"ACTE KAP garanti Domestique"},  
							  {"id" : "14", "value":"ACTE KAP garanti Export"}
                        ];
    }
   
  }

  onChangeCategorie(event) {
    this.onGetAllProduitByCategorie(event);
    //this.numCategChoisi = event;
    this.addForm.controls['poli_categorie'].setValue(event);
    this.poli_codeproduit = "".toString();
    this.addForm.controls['poli_codeproduit'].setValue(this.poli_codeproduit);
    if(event =='15001'){
    this.risk = true;
    this.riskl= false;
    this.riskr= false;
    this.credit= false;
    this.riskc= false;
  }
    else if(event =='16008'){
    this.riskl = true;
    this.risk = true;
    this.riskr= false;
    this.credit= false;
    this.riskc= false;
  }
    else if(event =='15002'){
    this.riskr = false;
    this.riskl = false;
    this.risk = true;
    this.credit= false;
    this.riskc= false;
  }
    else if(event =='14003'){
    this.credit = true;
    this.riskr = false;
    this.riskl = false;
    this.risk = true;
    this.riskc= false;
    
  }

  }

  onChangeProduit(event) {
    this.codeProduitChoisi = event;
    this.addForm.controls['poli_codeproduit'].setValue(event);
    this.addForm.controls['poli_dateecheance'].setValue('');
    this.addForm.controls['poli_dateeffetencours'].setValue('');
    if(event == "15001001"){
      this.soumission = true;
    }else{
      this.soumission = false;
    }
   /*  this.taux = 0;
    this.addForm.controls['poli_primenettotal'].setValue('');
    this.code_taxe = this.listeCodeProduit.find(p => p.prod_numero == event)?.prod_codetaxe;
    this.taux_produit  = Number(this.taxes.find(p => p.taxe_codetaxe == this.code_taxe)?.taxe_txappliq) / 100;
    // tslint:disable-next-line:max-line-length
    this.commission= this.commissions.find(p => p.comm_codeproduit == event && p.comm_codeapporteur==this.codeApporteurChoisi);
    this.accessoire= this.accessoires.find(p => p.acces_codeproduit == event); */

  /*   if(isNaN(Number(this.taux_produit)))
     this.taux_produit =0;
     if(this.addForm.get('poli_exonerationtps').value=='oui')
     this.taux_produit =0;
    if(event ==='15001001' )
     this.soumission = true;
     else
     this.soumission = false;
    // this.numConcat = this.codeApporteurChoisi + event;
    // this.addForm.controls['comm_code'].setValue(this.numConcat.toString()); */

    if(event =='15001015'||event =='15001012'||event =='15001013'||event =='15001014'||event =='15001010'||event =='15001011'){
      this.risk = true;
      this.riskl= false;
      this.riskr= true;
      this.credit= false;
      this.riskc= false;
    }
    else if(event =='15001001'||event =='15001002'||event =='15001003'||event =='15001004'||event =='15001005'){
      this.riskl = false;
      this.risk = true;
      this.riskr= false;
      this.credit= false;
      this.riskc= true;
    }

    /* 
    if(event =='14003001'){
      if (this.duree < 60) {
        this.taux = 1 / 100;
      }
      else if (this.duree  > 60 && this.duree < 90) {
        this.taux = 1.5 / 100;
      }
      else {
        this.taux = 2 / 100;
      }
      console.log('14003001');
      this.primenette = Number(this.formatcapitalassure) * this.taux;
     
  //pour commission
  this.pourcommission();
    //fin commission

    //pour accessoire
  this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);

    } */

   /*  if(event =='16008001'){
        this.taux = 5 / 100;
     
        this.primenette = Number(this.formatcapitalassure) * this.taux;
        
    //pour commission
    this.pourcommission();
      //fin commission
      
    //pour accessoire
  this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
    }
 */
    /* if(event =='15001001'){
      this.taux = 0;
      this.addForm.controls['poli_primenettotal'].setValue('');
      if(this.addForm.get('type_traitement').value =='express'){
      this.taux = 1.5 / 100;
    }
    if(this.addForm.get('type_traitement').value =='normal'){
      this.taux = 1 / 100;
    }
    this.primenette = Number(this.formatcapitalassure) * this.taux;
    
      //pour commission
  this.pourcommission();
    //fin commission
    //pour accessoire
  this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
  } */

  /* if(event =='15001002' || event =='15001003' || event =='15001004'|| event =='15001005'|| event =='15001006'){
    this.taux = 3 / 100;
 
    this.primenette = Number(this.formatcapitalassure) * this.taux;
    
      //pour commission
  this.pourcommission();
    //fin commission
    //pour accessoire
  this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
} */
/* if(event =='15001007'){
  this.taux = 5 / 100;

  this.primenette = Number(this.formatcapitalassure) * this.taux;
 
      //pour commission
  this.pourcommission();
    //fin commission
    //pour accessoire
  this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
}
 */
  }

  onChangeTypeRisque(event) {
    this.addForm.controls['type_risque'].setValue(event);
    /* if(this.addForm.get('poli_codeproduit').value =='14002001' && this.addForm.get('achet_type').value =='prive'){
      this.taux = 0;
      this.addForm.controls['poli_primenettotal'].setValue('');
      // tslint:disable-next-line:max-line-length
      if (Number(this.formatcapitalassure) > 500000000 && (event === 'RISQUE COMMERCIAL (RC)' || event ==='RISQUE POLITIQUE (RP)')) {
        this.taux = 0.8 / 100;
      }
      // tslint:disable-next-line:max-line-length
      else if (Number(this.formatcapitalassure) < 500000000 && (event === 'RISQUE COMMERCIAL (RC)' || event === 'RISQUE POLITIQUE (RP)')) {
        this.taux = 0.9 / 100;
      }
      // tslint:disable-next-line:max-line-length
      else if (Number(this.formatcapitalassure) > 500000000 && event === 'RISQUE MIXTE (RC & RP)'){
        this.taux = 1.6 / 100;
      }
      // tslint:disable-next-line:max-line-length
      else if (Number(this.formatcapitalassure) < 500000000 && event === 'RISQUE MIXTE (RC & RP)'){
        this.taux = 1.8 / 100;
      }
      this.primenette = Number(this.formatcapitalassure) * this.taux;
     
      //pour commission
  this.pourcommission();
    //fin commission
    //pour accessoire
  this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 //console.log('abou ' + this.taux_produit);
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);

    }
 */
/*     // tslint:disable-next-line:max-line-length
    if(this.addForm.get('poli_codeproduit').value =='14002001' && this.addForm.get('achet_type').value =='public'){
      this.taux = 0;
      this.addForm.controls['poli_primenettotal'].setValue('');
      if (event === 'RISQUE POLITIQUE (RP)')
      this.taux = 1.5 / 100;
    
      this.primenette = Number(this.formatcapitalassure) * this.taux;
     
      //pour commission
  this.pourcommission();
    //fin commission
    //pour accessoire
  this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
    }*/
  } 
  onChangeTypeSoumission(event) {
    this.addForm.controls['type_traitement'].setValue(event);
    this.tarifer();

    /* if(this.addForm.get('poli_codeproduit').value =='15001001'){
      this.taux = 0;
      this.addForm.controls['poli_primenettotal'].setValue('');
      if(event =='express'){
      this.taux = 1.5 / 100;
    }
    if(event =='normal'){
      this.taux = 1 / 100;
    }
    this.primenette = Number(this.formatcapitalassure) * this.taux;
   
      //pour commission
  this.pourcommission();
    //fin commission
    //pour accessoire
  this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
  } */
  }
  
  onChangeTypeAcheteur(event) {
    this.addForm.controls['achet_type'].setValue(event);
    
/*     if(this.addForm.get('poli_codeproduit').value =='14002001' && this.addForm.get('achet_type').value =='prive'){
      this.taux = 0;
      this.addForm.controls['poli_primenettotal'].setValue('');
      // tslint:disable-next-line:max-line-length
      if (Number(this.formatcapitalassure) > 500000000 && (this.addForm.get('type_risque').value === 'RISQUE COMMERCIAL (RC)' || this.addForm.get('type_risque').value ==='RISQUE POLITIQUE (RP)')) {
        this.taux = 0.8 / 100;
      }
      // tslint:disable-next-line:max-line-length
      else if (Number(this.formatcapitalassure) < 500000000 && (this.addForm.get('type_risque').value === 'RISQUE COMMERCIAL (RC)' || this.addForm.get('type_risque').value ==='RISQUE POLITIQUE (RP)')) {
        this.taux = 0.9 / 100;
      }
      // tslint:disable-next-line:max-line-length
      else if (Number(this.formatcapitalassure) > 500000000 && this.addForm.get('type_risque').value === 'RISQUE MIXTE (RC & RP)'){
        this.taux = 1.6 / 100;
      }
      // tslint:disable-next-line:max-line-length
      else if (Number(this.formatcapitalassure) < 500000000 && this.addForm.get('type_risque').value === 'RISQUE MIXTE (RC & RP)'){
        this.taux = 1.8 / 100;
      }
      this.primenette = Number(this.formatcapitalassure) * this.taux;
   
      //pour commission
 this.pourcommission();
    //fin commission
    //pour accessoire
  this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
    }

    // tslint:disable-next-line:max-line-length
    if(this.addForm.get('poli_codeproduit').value =='14002001' && this.addForm.get('achet_type').value =='public') {
      this.taux = 0;
      this.addForm.controls['poli_primenettotal'].setValue('');
      if(this.addForm.get('type_risque').value === 'RISQUE POLITIQUE (RP)')
        this.taux = 1.5 / 100;
      
        this.primenette = Number(this.formatcapitalassure) * this.taux;
     
    //pour commission
    this.pourcommission();
      //fin commission
      //pour accessoire
 this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
    } */
  }
  onChangeCodeCimaCompagnie(event) {

    this.addForm.controls['poli_compagnie'].setValue(event);
    // tslint:disable-next-line:max-line-length
    this.addForm.controls['poli_codepays'].setValue(((this.listPays.find(p => p.alpha2Code === event.substring(0, 2)))?.callingCodes[0]) + ': ' + ((this.listPays.find(p => p.alpha2Code === event.substring(0, 2)))?.name));
  }

  onChangeGroupe(event) {
    this.addForm.controls['poli_codegroupe'].setValue(event);
  }
  onChangeTypeBeneficiaire(event) {
    this.addForm.controls['benef_typbenef'].setValue(event);
  }

  onChangeFiliale(event){
    this.addForm.controls['poli_filiale'].setValue(event) ;
  }

  onChangeTypeLocatif(event){
    this.addForm.controls['riskl_type'].setValue(event) ;
  }

  // onGetAllTaxes() {
  //   this.taxeService.getAllTaxes()
  //     .subscribe((data: Taxe[]) => {
  //       this.listeCodeTaxe = data as Taxe[];
  //     });
  // }

  // onChangeTaxe(event) {
  //   this.addForm.controls['branche_codetaxe'].setValue(event);
  // }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }
  onGetAllClients() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.listeClients = data as Client[];
        console.log(this.listeClients);
      });
     
  }
  onGetLibelleByTypeClient(type : String) {
    //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)

    return (this.listType.find(p => p.id === type))?.value;
  }

  onChangeLibeleTypeContrat(event) {
   // console.log(event);
    this.addForm.controls['poli_typecontrat'].setValue((this.listTypeContrat.find(p => p.id === event)).id);
  }

  onChangeLibeleTypeRevision(event) {
   // console.log(event);
    this.addForm.controls['poli_typerevision'].setValue((this.listTypeRevision.find(p => p.id === event)).id);
  }

  onChangeLibeleTypeGestion(event) {
    //console.log(event);
    this.addForm.controls['poli_typegestion'].setValue((this.listTypeGestion.find(p => p.id === event)).id);
  }

  onChangeLibeleTypeClauseRevision(event) {
    //console.log(event);
    this.addForm.controls['poli_clauserevision'].setValue((this.listTypeClauseRevision.find(p => p.id === event)).id);
  }

  onChangeLibeleTypeFractionnement(event) {
    this.errorDomestique = false;
    //console.log(event);
    this.addForm.controls['poli_codefractionnement'].setValue((this.listTypeFractionnement.find(p => p.id === event)).id);
   
    // tslint:disable-next-line:max-line-length
    const date : Date= new Date(this.addForm.get('poli_dateeffetencours').value);
    console.log(date);
     if(this.addForm.get('poli_codefractionnement').value ==='4') {
  //mensuel
      //this.erreur= true;
      date.setMonth(date.getMonth()+1);
        console.log(date);
        this.addForm.controls['poli_dateecheance'].setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
    }
    else if(this.addForm.get('poli_codefractionnement').value ==='1') {
  //annuel
     // this.erreur= true;
     if(this.codeProduitChoisi == 14003001){
      this.errorDomestique = true;
     }else{
     date.setFullYear(date.getFullYear()+1);
        console.log(date);
        this.addForm.controls['poli_dateecheance'].setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
     }
    }
    else if(this.addForm.get('poli_codefractionnement').value ==='2') {
  //semestriel
      //this.erreur= true;
    //  date.setMonth(date.getMonth()+6);
    date.setDate(date.getDate() + 180);
        console.log(date);
        this.addForm.controls['poli_dateecheance'].setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
    }
    else if(this.addForm.get('poli_codefractionnement').value ==='3') {
  //trimestriel
    //  this.erreur= true;
    //date.setMonth(date.getMonth()+3);
    date.setDate(date.getDate() + 90);
        console.log(date);
        this.addForm.controls['poli_dateecheance'].setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
    }
    else if(this.addForm.get('poli_codefractionnement').value ==='5') {
  //proratis
     // this.erreur= true;
     date.setDate(date.getDate()+Number(this.addForm.get('proratis').value));
        console.log(date);
        this.addForm.controls['poli_dateecheance'].setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
    }
    else{
     // this.erreur= false;
     }
   if(this.addForm.get('poli_codefractionnement').value ==='5')
    this.proratis= true;
    else
    this.proratis= false;
    this.getDifferenceInDays(new Date(this.addForm.get('poli_dateecheance').value), new Date(this.addForm.get('poli_dateeffetencours').value));

  }
  onChangeLibeleTypeActe(event) {
    //console.log(event);
    this.addForm.controls['act_typegarantie'].setValue((this.listTypeActe.find(p => p.id === event)).id);
  }

  onChangeLibeleTypeFacultative(event) {
    //console.log(event);
    this.addForm.controls['poli_typefacultive'].setValue((this.listTypeFacultative.find(p => p.id === event)).id);
  }
  
  onChangeTypeCredit(event) {
    //console.log(event);
    this.addForm.controls['credit_type'].setValue(event);
  }

  onChangeLibeleTypeIndice(event) {
    console.log(this.addForm.get('poli_dateecheance').value, this.addForm.get('poli_dateeffetencours').value);
    // tslint:disable-next-line:max-line-length
    console.log(this.getDifferenceInDays(new Date(this.addForm.get('poli_dateecheance').value), new Date(this.addForm.get('poli_dateeffetencours').value)));
    this.addForm.controls['poli_typeindice'].setValue((this.listTypeIndice.find(p => p.id === event)).id);
  }

  getDifferenceInDays(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    this.duree = Math.trunc(diffInMs / (1000 * 60 * 60 * 24));
   // console.log(this.duree);
    return Math.trunc(diffInMs / (1000 * 60 * 60 * 24 * 29));
  }

  onFocusOutEventProratis() {
    this.errorDomestique = false;
    if(this.addForm.get('poli_dateeffetencours').value !=null) {
    const date : Date= new Date(this.addForm.get('poli_dateeffetencours').value);
    console.log(date);
     if(this.addForm.get('poli_codefractionnement').value ==='4') {
  //mensuel
      //this.erreur= true;
      date.setMonth(date.getMonth()+1);
        console.log(date);
        this.addForm.controls['poli_dateecheance'].setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
    }
    else if(this.addForm.get('poli_codefractionnement').value ==='1') {
  //annuel
     // this.erreur= true;
     date.setFullYear(date.getFullYear()+1);
        console.log(date);
        this.addForm.controls['poli_dateecheance'].setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
    }
    else if(this.addForm.get('poli_codefractionnement').value ==='2') {
  //semestriel
      //this.erreur= true;
     // date.setMonth(date.getMonth()+6);
     date.setDate(date.getDate() + 180);
        console.log(date);
        this.addForm.controls['poli_dateecheance'].setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
    }
    else if(this.addForm.get('poli_codefractionnement').value ==='3') {
  //trimestriel
    //  this.erreur= true;
  //  date.setMonth(date.getMonth()+3);
    date.setDate(date.getDate() + 90);
        console.log(date);
        this.addForm.controls['poli_dateecheance'].setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
    }
    else if(this.addForm.get('poli_codefractionnement').value ==='5') {
  //proratis
     // this.erreur= true;
     if(this.codeProduitChoisi == 14003001 && this.addForm.get('proratis').value > 180){
      this.errorDomestique = true;
      this.addForm.controls['poli_dateecheance'].setValue('');
     }else{
     date.setDate(date.getDate()+Number(this.addForm.get('proratis').value));
        console.log(date);
        this.addForm.controls['poli_dateecheance'].setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
     }
    }
    else{
     // this.erreur= false;
     }
    }
    
  }

  onFocusOutEventDateEffetEnCours() {
    // tslint:disable-next-line:max-line-length
    //this.getDifferenceInDays(new Date(this.addForm.get('poli_dateecheance').value), new Date(this.addForm.get('poli_dateeffetencours').value));
    // console.log(d);
    if(this.addForm.get('poli_dateeffetencours').value !=null) {
    const date : Date= new Date(this.addForm.get('poli_dateeffetencours').value);
    console.log(date);
     if(this.addForm.get('poli_codefractionnement').value ==='4') {
  //mensuel
      //this.erreur= true;
      date.setMonth(date.getMonth()+1);
        console.log(date);
        this.addForm.controls['poli_dateecheance'].setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
    }
    else if(this.addForm.get('poli_codefractionnement').value ==='1') {
  //annuel
     // this.erreur= true;
     if(!this.errorDomestique){
     date.setFullYear(date.getFullYear()+1);
        console.log(date);
        this.addForm.controls['poli_dateecheance'].setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
     }
    }
    else if(this.addForm.get('poli_codefractionnement').value ==='2') {
  //semestriel
      //this.erreur= true;
     // date.setMonth(date.getMonth()+6);
      date.setDate(date.getDate() + 180);
        console.log(date);
        this.addForm.controls['poli_dateecheance'].setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
    }
    else if(this.addForm.get('poli_codefractionnement').value ==='3') {
  //trimestriel
    //  this.erreur= true;
    //date.setMonth(date.getMonth()+3);
    date.setDate(date.getDate() + 90);
        console.log(date);
        this.addForm.controls['poli_dateecheance'].setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
    }
    else if(this.addForm.get('poli_codefractionnement').value ==='5') {
  //proratis
     // this.erreur= true;
     if(!this.errorDomestique){
     date.setDate(date.getDate() +Number(this.addForm.get('proratis').value));
        console.log(date);
        this.addForm.controls['poli_dateecheance'].setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
     }
    }
    else{
     // this.erreur= false;
     }
    }
     this.getDifferenceInDays(new Date(this.addForm.get('poli_dateecheance').value), new Date(this.addForm.get('poli_dateeffetencours').value));
   
    if (this.addForm.get('poli_dateecheance').value != null && this.addForm.get('poli_dateeffetencours').value != null)
    // tslint:disable-next-line:max-line-length
    this.addForm.controls['poli_duree'].setValue(this.getDifferenceInDays(new Date(this.addForm.get('poli_dateecheance').value), new Date(this.addForm.get('poli_dateeffetencours').value)));
    /* if(this.addForm.get('poli_codeproduit').value =='14003001'){
      if (this.duree < 60) {
        this.taux = 1 / 100;
      }
      else if (this.duree  > 60 && this.duree < 90) {
        this.taux = 1.5 / 100;
      }
      else {
        this.taux = 2 / 100;
      }
      this.primenette = Number(this.formatcapitalassure) * this.taux;
     
      //pour commission
 this.pourcommission();
    //fin commission
    //pour accessoire
  this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
    } */
   
    
  }

  
  onFocusOutEventCapitalAssure() {
    
    // tslint:disable-next-line:max-line-length
    this.formatcapitalassure = Number(this.formatNumberService.replaceAll((this.addForm.get("risq_capitalassure").value),'.',''));
    console.log( this.formatcapitalassure);
    if (this.formatcapitalassure !=null){
  
      console.log( this.formatNumberService.numberWithCommas( this.formatcapitalassure));

     // tslint:disable-next-line:max-line-length
     this.addForm.controls['risq_capitalassure'].setValue(this.formatNumberService.numberWithCommas( this.formatcapitalassure));
    }
/*     this.taux = 0;
    this.addForm.controls['poli_primenettotal'].setValue('');
    if(this.addForm.get('poli_codeproduit').value =='14003001'){
      if (this.duree < 60) {
        this.taux = 1 / 100;
      }
      else if (this.duree  > 60 && this.duree < 90) {
        this.taux = 1.5 / 100;
      }
      else {
        this.taux = 2 / 100;
      }
      console.log( this.formatcapitalassure);
      this.primenette = Number(this.formatcapitalassure) * this.taux;
     
    //pour commission
   this.pourcommission();
      //fin commission
      //pour accessoire
 this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
    }
    if(this.addForm.get('poli_codeproduit').value =='14002001' && this.addForm.get('achet_type').value =='prive'){
      // tslint:disable-next-line:max-line-length
      if (Number(this.formatcapitalassure) > 500000000 && (this.addForm.get('type_risque').value === 'RISQUE COMMERCIAL (RC)' || this.addForm.get('type_risque').value ==='RISQUE POLITIQUE (RP)')) {
        this.taux = 0.8 / 100;
      }
      // tslint:disable-next-line:max-line-length
      else if (Number(this.formatcapitalassure) < 500000000 && (this.addForm.get('type_risque').value === 'RISQUE COMMERCIAL (RC)' || this.addForm.get('type_risque').value ==='RISQUE POLITIQUE (RP)')) {
        this.taux = 0.9 / 100;
      }
      // tslint:disable-next-line:max-line-length
      else if (Number(this.formatcapitalassure) > 500000000 && this.addForm.get('type_risque').value === 'RISQUE MIXTE (RC & RP)'){
        this.taux = 1.6 / 100;
      }
      // tslint:disable-next-line:max-line-length
      else if (Number(this.formatcapitalassure) < 500000000 && this.addForm.get('type_risque').value === 'RISQUE MIXTE (RC & RP)'){
        this.taux = 1.8 / 100;
      }
      this.primenette = Number(this.formatcapitalassure) * this.taux;
     
     //pour commission
  this.pourcommission();
    //fin commission
    //pour accessoire
  this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
    }

    // tslint:disable-next-line:max-line-length
    if(this.addForm.get('poli_codeproduit').value =='14002001' && this.addForm.get('achet_type').value =='public' && this.addForm.get('type_risque').value === 'RISQUE POLITIQUE (RP)') {
        this.taux = 1.5 / 100;
      
        this.primenette = Number(this.formatcapitalassure) * this.taux;
        
    //pour commission
    this.pourcommission();
      //fin commission
      //pour accessoire
this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
    }

    if ( this.addForm.get('poli_codeproduit').value =='16008001'){
      this.taux = 5 / 100;
   
      this.primenette = Number(this.formatcapitalassure) * this.taux;
     
    //pour commission
   this.pourcommission();
      //fin commission
        //pour accessoire
this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
  }

  if(this.addForm.get('poli_codeproduit').value =='15001001'){
    this.taux = 0;
    this.addForm.controls['poli_primenettotal'].setValue('');
    if(this.addForm.get('type_traitement').value =='express'){
    this.taux = 1.5 / 100;
  }
  if(this.addForm.get('type_traitement').value =='normal'){
    this.taux = 1 / 100;
  }
  this.primenette = Number(this.formatcapitalassure) * this.taux;
 
      //pour commission
  this.pourcommission();
    //fin commission
      //pour accessoire
  this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
 }
 // tslint:disable-next-line:max-line-length
 if(this.addForm.get('poli_codeproduit').value =='15001002' || this.addForm.get('poli_codeproduit').value =='15001003' || this.addForm.get('poli_codeproduit').value =='15001004'|| this.addForm.get('poli_codeproduit').value =='15001005'|| this.addForm.get('poli_codeproduit').value =='15001006'){
  this.taux = 3 / 100;

  this.primenette = Number(this.formatcapitalassure) * this.taux;
  
       //pour commission
this.pourcommission();
    //fin commission
      //pour accessoire
this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
}
if(this.addForm.get('poli_codeproduit').value =='15001007'){
this.taux = 5 / 100;

this.primenette = Number(this.formatcapitalassure) * this.taux;
   
      //pour commission
this.pourcommission();
    //fin commission
      //pour accessoire
this.pouraccessoire();
    //fin accessoire

 // tslint:disable-next-line:max-line-length
 this.taxeTE = (Number(this.primenette) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur)) * Number (this.taux_produit);
 this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
 this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);
   // tslint:disable-next-line:max-line-length
this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);
} */

}
onGetALlTaxes() {
  this.taxeService.getAllTaxes()
    .subscribe((data: Taxe[]) => {
      this.taxes = data;
    });

}

onGetAllCommissions() {
  this.commissionService.getAllCommissions()
  .subscribe( (data: Commission[]) => {
    this.commissions = data ;
  }) ;
}
onGetAllAccessoires() {
  this.accessoireService.getAllAccessoires()
  .subscribe( (data: Accessoire[]) => {
    this.accessoires = data ;
  }) ;
}

//submit2
onSubmit2(dialog: TemplateRef<any>) {
  this.erreur= true;
//variable 
this.addForm.controls['marche'].setValue('false');
this.addForm.controls['credit'].setValue('false');
this.addForm.controls['acheteur'].setValue('false');
this.addForm.controls['lot'].setValue('false');
this.addForm.controls['riskl'].setValue('false');
this.addForm.controls['riskr'].setValue('false');
  //ajout police
  this.addForm.controls['poli_souscripteur'].setValue(this.client.clien_typeclient);
  this.addForm.controls['poli_client'].setValue(this.client.clien_numero);
  this.addForm.controls['poli_codecutilisateur'].setValue(this.user.util_numero);
  this.addForm.controls['poli_codepays'].setValue('221');
  this.addForm.controls['poli_compagnie'].setValue('SNNVIAS008');
  this.addForm.controls['poli_codetaxe'].setValue(this.taux);
  this.addForm.controls['poli_numerodernieravenant'].setValue('1');
  // tslint:disable-next-line:max-line-length
 // this.addForm.controls['poli_primenettotal'].setValue(Number(this.formatNumberService.replaceAll((this.addForm.get("poli_primenettotal").value),'.','')));
  //this.addForm.controls['poli_primebruttotal'].setValue(Number(this.formatNumberService.replaceAll((this.addForm.get("poli_primebruttotal").value),'.','')));
  this.addForm.controls['march_donneurordre'].setValue(this.client?.clien_numero);
//ajout avenant

//this.addForm.controls['aven_numeropolice'].setValue(this.polizei);
//this.addForm.controls['aven_numeroavenant'].setValue(this.polizei.toString() + "001");
this.addForm.controls['aven_codeintermediare'].setValue(this.addForm.get('poli_intermediaire').value);
this.addForm.controls['aven_codecompagnie'].setValue(this.addForm.get('poli_compagnie').value);
//this.addForm.controls['aven_codemarche'].setValue(this.addForm.get('risq_capitallci').value);
this.addForm.controls['aven_dateeffet'].setValue(this.addForm.get('poli_dateeffetencours').value);
this.addForm.controls['aven_dateecheance'].setValue(this.addForm.get('poli_dateecheance').value);
this.addForm.controls['aven_duree'].setValue(this.addForm.get('poli_duree').value);
this.addForm.controls['aven_daterevision'].setValue(this.addForm.get('poli_daterevision').value);
this.addForm.controls['aven_typerevision'].setValue(this.addForm.get('poli_typerevision').value);
this.addForm.controls['aven_typecontrat'].setValue(this.addForm.get('poli_typecontrat').value);
this.addForm.controls['aven_typegestion'].setValue(this.addForm.get('poli_typegestion').value);
//this.addForm.controls['aven_typefraction'].setValue(this.formatcapitalassure);
this.addForm.controls['aven_montantprimenet'].setValue(this.addForm.get('poli_primenettotal').value);
this.addForm.controls['aven_montantprimebrut'].setValue(this.addForm.get('poli_primebruttotal').value);
this.addForm.controls['aven_coefbonus'].setValue(this.addForm.get('poli_coefbonus').value);
this.addForm.controls['aven_numeroattestionauto'].setValue(this.addForm.get('poli_numeroattestation').value);
this.addForm.controls['aven_coefremisecie'].setValue(this.addForm.get('poli_remisecommerciale').value);

this.addForm.controls['aven_numerocertificat'].setValue(this.addForm.get('poli_numerocertificat').value);
this.addForm.controls['aven_numpoliceremplacee'].setValue(this.addForm.get('poli_policeremplacee').value);
this.addForm.controls['aven_typefacultative'].setValue(this.addForm.get('poli_typefacultive').value);
this.addForm.controls['aven_numeroplancoassur'].setValue(this.addForm.get('poli_numeroplancoassur').value);
this.addForm.controls['aven_numeroplanreassur'].setValue(this.addForm.get('poli_numeroplanreassfac').value);
this.addForm.controls['aven_numeroderniernavenant'].setValue(this.addForm.get('poli_numerodernieravenant').value);
this.addForm.controls['aven_codetaxe'].setValue(this.addForm.get('poli_codetva').value);
this.addForm.controls['aven_formulegarantie'].setValue(this.addForm.get('poli_formulegarantie').value);
this.addForm.controls['aven_utilisateur'].setValue(this.user.util_numero);

//fin avenant

//ajout beneficiaire
this.addForm.controls['benef_ccutil'].setValue(this.user.util_numero);

      //ajout table  acte
//this.addForm.controls['act_numero'].setValue(this.polizei.toString() + "0000001");
//this.addForm.controls['act_numeropolice'].setValue(this.polizei);
this.addForm.controls['act_capitalassure'].setValue(this.formatcapitalassure);
//this.addForm.controls['act_idbeneficiaire'].setValue(databeneficiaire.benef_Num);
this.addForm.controls['act_capitalsmp'].setValue(this.addForm.get('risq_capitalsmp').value);
this.addForm.controls['act_capitallci'].setValue(this.addForm.get('risq_capitallci').value);
this.addForm.controls['act_descriptionmarche'].setValue(this.addForm.get('march_descriptionmarche1').value);

//ajout facture
//this.addForm.controls['fact_numeropolice'].setValue(this.polizei);
//this.addForm.controls['fact_numeroacte'].setValue(dataacte.act_numero);
this.addForm.controls['fact_numerosouscripteurcontrat'].setValue(this.client.clien_numero);
this.addForm.controls['fact_codeutilisateur'].setValue(this.user.util_numero);
this.addForm.controls['fact_capitalassure'].setValue(this.formatcapitalassure);
this.addForm.controls['fact_capitalsmp'].setValue(this.addForm.get('risq_capitalsmp').value);
this.addForm.controls['fact_capitallci'].setValue(this.addForm.get('risq_capitallci').value);
this.addForm.controls['fact_montanttaxe'].setValue(this.addForm.get('quit_mtntaxete').value);
this.addForm.controls['fact_montantprimenet'].setValue(this.addForm.get('poli_primenettotal').value);
this.addForm.controls['fact_montantaccescompagnie'].setValue(this.addForm.get('quit_accessoirecompagnie').value);
this.addForm.controls['fact_montantaccesapporteur'].setValue(this.addForm.get('quit_accessoireapporteur').value);
this.addForm.controls['fact_commissionapporteur'].setValue(this.addForm.get('quit_commissionsapporteur1').value);
this.addForm.controls['fact_numerobranche'].setValue(this.addForm.get('poli_branche').value);
this.addForm.controls['fact_numerocategorie'].setValue(this.addForm.get('poli_categorie').value);
this.addForm.controls['fact_dateeffetcontrat'].setValue(this.addForm.get('poli_dateeffetencours').value);
this.addForm.controls['fact_dateecheancecontrat'].setValue(this.addForm.get('poli_dateecheance').value);
this.addForm.controls['fact_montantttc'].setValue(this.addForm.get('poli_primebruttotal').value);
this.addForm.controls['fact_datefacture'].setValue(new Date());


      
  // ajout risque
  //this.addForm.controls['risq_numeropolice'].setValue(datapolice.poli_numero);
  //this.addForm.controls['risq_numeroacte'].setValue(dataacte.act_numero );
  this.addForm.controls['risq_codeutilisateur'].setValue(this.user.util_numero);
  this.addForm.controls['risq_capitalassure'].setValue(this.formatcapitalassure);

 //ajout quittance
        
      
 //this.addForm.controls['quit_numeropolice'].setValue(this.polizei);
 //this.addForm.controls['quit_numerorisque'].setValue(datarisque.risq_numero);
 this.addForm.controls['quit_codeutilisateur'].setValue(this.user.util_numero);
 //this.addForm.controls['quit_Facture'].setValue(this.fact);
 this.addForm.controls['quit_numerocie'].setValue(this.addForm.get('poli_compagnie').value);
 this.addForm.controls['quit_numerointermedaire'].setValue(this.addForm.get('poli_intermediaire').value);
this.addForm.controls['quit_primenette'].setValue(this.addForm.get('poli_primenettotal').value);
this.addForm.controls['quit_dateeffet'].setValue(this.addForm.get('poli_dateeffetencours').value);
this.addForm.controls['quit_dateecheance'].setValue(this.addForm.get('poli_dateecheance').value);
this.addForm.controls['quit_primettc'].setValue(this.addForm.get('poli_primebruttotal').value);
this.addForm.controls['quit_numavenant'].setValue(this.id_avenant);
//this.addForm.controls['quit_primettc'].setValue(this.addForm.get('poli_primebruttotal').value);
this.addForm.controls['quit_typeecriture'].setValue('emission');
this.addForm.controls['quit_typequittance'].setValue('N');
this.addForm.controls['quit_dateemission'].setValue(new Date());
         //fin quittance

      //caution
      if (this.riskc) {
        //ajout marché
        this.addForm.controls['marche'].setValue('true');
        this.addForm.controls['march_donneurordre'].setValue(this.client?.clien_numero);

// ajout lot
//this.addForm.controls['lot_numeroacte'].setValue(dataacte.act_numero );
//this.addForm.controls['lot_numeromarche'].setValue(datamarche.march_numero );
this.addForm.controls['lot'].setValue('true');


//fin ajout lot
        
    
        //fin ajout marche
      }
      
      //fin caution

      //debut risque reglemente
      if (this.riskr) {
       
        this.addForm.controls['riskr'].setValue('true');
       this.addForm.controls['riskr_numeroclient'].setValue(this.client.clien_numero);
       // this.addForm.controls['riskr_numeropolice'].setValue(datapolice.poli_numero);
      }
      //fin risque reglemente

      //debut risque locatif
      if (this.riskl) {
      //ajout acheteur locatif
      this.addForm.controls['achet_numeroclient'].setValue(this.client.clien_numero);
      this.addForm.controls['achet_codeutilisateur'].setValue(this.user.util_numero);
      this.addForm.controls['acheteur'].setValue('true');

      //ajout risque locatif

      //this.addForm.controls['riskl_numeroacheteur'].setValue(dataacheteur.achet_numero);
      this.addForm.controls['riskl_numeroclient'].setValue(this.client.clien_numero);
      //this.addForm.controls['riskl_numeropolice'].setValue(datapolice.poli_numero);
      this.addForm.controls['risql_codeutilisateur'].setValue(this.user.util_numero);
      this.addForm.controls['riskl'].setValue('true');
    }
         //ajout acheteur
         if (this.credit) {
      this.addForm.controls['achet_numeroclient'].setValue(this.client.clien_numero);
      this.addForm.controls['achet_codeutilisateur'].setValue(this.user.util_numero);
      this.addForm.controls['acheteur'].setValue('true');
    
      //ajout credit
      this.addForm.controls['credit_numeroclient'].setValue(this.client.clien_numero);
      //this.addForm.controls['credit_numeroachateur'].setValue(dataacheteur.achet_numero);
      this.addForm.controls['credit_codeutil'].setValue(this.user.util_numero);
      this.addForm.controls['credit'].setValue('true');
    }
//fin facture
//debut engagement
//this.addForm.controls['engag_numpoli'].setValue(datapolice.poli_numero);
//this.addForm.controls['engag_numeroacte'].setValue(dataacte.act_numero );
this.addForm.controls['engag_dateengagement'].setValue(this.addForm.get('poli_dateeffetencours').value);
this.addForm.controls['engag_codeutilisateur'].setValue(this.user.util_numero);
this.addForm.controls['engag_kapassure'].setValue(this.formatcapitalassure);
this.policeService.addpoliceForm(this.addForm.value)
    .subscribe((datapolice:any) => {
      //this.polizei = datapolice.poli_numero;
      this.toastrService.show(
       'police '+ datapolice.poli_numero,
        
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.open(dialog, datapolice)
     // this.router.navigateByUrl('home/parametrage-production/police');
    },
      (error) => {
        this.toastrService.show(
          //"Echec de l'ajout d'une branche",
          error.error.message,
          'Erreur de Notification',
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

open(dialog: TemplateRef<any>, policeForm: PoliceForm) {
  this.dialogService.open(
    dialog,
    { context: policeForm });
    console.log('open dialog');
}

/* pourcommission(){
    //pour commission
    this.tauxcommission =0;
    if (this.primenette > this.commission?.comm_interv1 && this.primenette < this.commission?.comm_interv2) {

      this.tauxcommission = this.commission?.comm_tauxcommission12/100;

      this.addForm.controls['quit_commissionsapporteur1'].setValue(Number(this.primenette) * Number(this.tauxcommission));
    }
    // tslint:disable-next-line:max-line-length
    else if (this.primenette > this.commission?.comm_interv3 && this.primenette < this.commission?.comm_interv4) {
  
      this.tauxcommission = this.commission?.comm_tauxcommission34/100;
      this.addForm.controls['quit_commissionsapporteur1'].setValue(Number(this.primenette) * Number(this.tauxcommission));
    }
       // tslint:disable-next-line:max-line-length
    else if (this.primenette > this.commission?.comm_interv5 && this.primenette < this.commission?.comm_interv6) {
  
      this.tauxcommission = this.commission?.comm_tauxcommission56/100;
      this.addForm.controls['quit_commissionsapporteur1'].setValue(Number(this.primenette) * Number(this.tauxcommission));
    }
      // tslint:disable-next-line:max-line-length
      else if (this.primenette > this.commission?.comm_interv7 && this.primenette < this.commission?.comm_interv8) {
  
        this.tauxcommission = this.commission?.comm_tauxcommission78/100;
        // tslint:disable-next-line:max-line-length
        this.addForm.controls['quit_commissionsapporteur1'].setValue(Number(this.primenette) * Number(this.tauxcommission));
      }
     // tslint:disable-next-line:max-line-length
     else if (this.primenette > this.commission?.comm_interv9 && this.primenette < this.commission?.comm_interv10) {
  
        this.tauxcommission = this.commission?.comm_tauxcommission910/100;
        // tslint:disable-next-line:max-line-length
        this.addForm.controls['quit_commissionsapporteur1'].setValue(Number(this.primenette) * Number(this.tauxcommission));
      }
      this.commissionsapporteur1 = Number(this.primenette) * Number(this.tauxcommission);
      //fin commission
    }
    pouraccessoire(){
    //pour accessoire
  if (this.primenette > this.accessoire?.acces_interv1 && this.primenette < this.accessoire?.acces_interv2) {

    this.accessoirecompagnie = this.accessoire?.acces_compagnie1;
    if(isNaN(Number(this.accessoirecompagnie)))
     this.accessoirecompagnie =0;
    this.addForm.controls['quit_accessoirecompagnie'].setValue(this.accessoirecompagnie);
    this.accessoireapporteur = this.accessoire?.acces_apporteur1;
    if(isNaN(Number(this.accessoireapporteur)))
     this.accessoireapporteur=0;
    this.addForm.controls['quit_accessoireapporteur'].setValue(this.accessoireapporteur);

  }
  // tslint:disable-next-line:max-line-length
  else if (this.primenette > this.accessoire?.acces_interv3 && this.primenette < this.accessoire?.acces_interv4) {
 
    this.accessoirecompagnie = this.accessoire?.acces_compagnie2;
    if(isNaN(Number(this.accessoirecompagnie)))
     this.accessoirecompagnie =0;
    this.addForm.controls['quit_accessoirecompagnie'].setValue(this.accessoirecompagnie);
    this.accessoireapporteur = this.accessoire?.acces_apporteur2;
    if(isNaN(Number(this.accessoireapporteur)))
     this.accessoireapporteur=0;
    this.addForm.controls['quit_accessoireapporteur'].setValue(this.accessoireapporteur);
  }
     // tslint:disable-next-line:max-line-length
  else if (this.primenette > this.accessoire?.acces_interv5 && this.primenette < this.accessoire?.acces_interv6) {

   
    this.accessoirecompagnie = this.accessoire?.acces_compagnie3;
    if(isNaN(Number(this.accessoirecompagnie)))
     this.accessoirecompagnie =0;
    this.addForm.controls['quit_accessoirecompagnie'].setValue(this.accessoirecompagnie);
    this.accessoireapporteur = this.accessoire?.acces_apporteur3;
    if(isNaN(Number(this.accessoireapporteur)))
     this.accessoireapporteur=0;
    this.addForm.controls['quit_accessoireapporteur'].setValue(this.accessoireapporteur);  }
    // tslint:disable-next-line:max-line-length
    else if (this.primenette >this.accessoire?.acces_interv7 && this.primenette < this.accessoire?.acces_interv8) {
     
    this.accessoirecompagnie = this.accessoire?.acces_compagnie3;
    if(isNaN(Number(this.accessoirecompagnie)))
     this.accessoirecompagnie =0;
    this.addForm.controls['quit_accessoirecompagnie'].setValue(this.accessoirecompagnie);
    this.accessoireapporteur = this.accessoire?.acces_apporteur3;
    if(isNaN(Number(this.accessoireapporteur)))
    this.accessoireapporteur=0;
    this.addForm.controls['quit_accessoireapporteur'].setValue(this.accessoireapporteur);
    }
   // tslint:disable-next-line:max-line-length
   else if (this.primenette > this.accessoire?.acces_interv9 && this.primenette < this.accessoire?.acces_interv10) {

    this.accessoirecompagnie = this.accessoire?.acces_compagnie4;
    if(isNaN(Number(this.accessoirecompagnie)))
     this.accessoirecompagnie =0;
    this.addForm.controls['quit_accessoirecompagnie'].setValue(this.accessoirecompagnie);
    this.accessoireapporteur = this.accessoire?.acces_apporteur4;
    if(isNaN(Number(this.accessoireapporteur)))
    this.accessoireapporteur=0;
    this.addForm.controls['quit_accessoireapporteur'].setValue(this.accessoireapporteur);   
   }
   else if (this.primenette > this.accessoire?.acces_interv13 && this.primenette < this.accessoire?.acces_interv14) {

    this.accessoirecompagnie = this.accessoire?.acces_compagnie5;
    if(isNaN(Number(this.accessoirecompagnie)))
    this.accessoirecompagnie =0;
    this.addForm.controls['quit_accessoirecompagnie'].setValue(this.accessoirecompagnie);
    this.accessoireapporteur = this.accessoire?.acces_apporteur5;
    if(isNaN(Number(this.accessoireapporteur)))
    this.accessoireapporteur=0;
    this.addForm.controls['quit_accessoireapporteur'].setValue(this.accessoireapporteur);
   }
    //fin accessoire
  }
 */



//new tarification

onChangeCA(event){
this.addForm.controls['risq_genrerisque'].setValue(event);
this.ca = event;
console.log(this.addForm.value);
}

tarifer (){
let type_traitement: number = 1 ;
const type_risque: string = this.addForm.controls['type_risque'].value || 'RC' ;
const acheteur:string = this.addForm.controls['achet_type'].value || 'prive';
const typeCa:string = this.ca+'-'+acheteur;

this.getDifferenceInDays(new Date(this.addForm.get('poli_dateecheance').value), new Date(this.addForm.get('poli_dateeffetencours').value));

if(this.addForm.controls['type_traitement'].value == 'express'){
  type_traitement = 2;
}


  console.log(this.duree);
  // tslint:disable-next-line:max-line-length
  this.policeService.tariferPolice(Number(this.formatcapitalassure),this.addForm.get('poli_codeproduit').value,this.addForm.get('poli_intermediaire').value,typeCa,type_traitement,type_risque,1,this.duree)
  .subscribe((data:any) => {
    console.log(data);
    this.accessoirecompagnie = data.accessoireCompagnie;
    this.addForm.controls['quit_accessoirecompagnie'].setValue(this.accessoirecompagnie);
    this.accessoireapporteur = data.accessoireapporteur;
    this.addForm.controls['quit_accessoireapporteur'].setValue(this.accessoireapporteur);
    this.commissionsapporteur1 = data.montantCommission;
    this.addForm.controls['quit_commissionsapporteur1'].setValue(this.commissionsapporteur1);
    this.primenette = data.primeNette;
    this.addForm.controls['poli_primenettotal'].setValue(this.primenette);
    this.tauxAp = data.tauxProduit;
    if(this.addForm.controls['poli_exonerationtaxeenr'].value == 'oui'){
      this.taxeTE = 0;
    }else{
      this.taxeTE = data.montantTaxe;
    }
    this.addForm.controls['quit_mtntaxete'].setValue(this.taxeTE);

    this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
    this.addForm.controls['poli_primebruttotal'].setValue(this.primebrute);

  })




}



}
