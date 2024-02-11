import { NgModule } from '@angular/core';
import { NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbInputModule, NbListModule, NbMenuModule, NbProgressBarModule, NbRadioModule, NbSelectModule, NbSpinnerModule, NbTabsetModule, NbTagModule, NbTreeGridModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ProfilComponent } from './profil/profil.component';
import { GestionUtilisateurComponent } from './gestion-utilisateur/gestion-utilisateur.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MatTableModule } from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { AjoutUtilisateurComponent } from './gestion-utilisateur/ajout-utilisateur/ajout-utilisateur.component';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModifUtilisateurComponent } from './gestion-utilisateur/modif-utilisateur/modif-utilisateur.component';
import { TypageComponent } from './parametrage/parametrage-systeme/typage/typage.component';
import { AjoutTypageComponent } from './parametrage/parametrage-systeme/typage/ajout-typage/ajout-typage.component';
import { ModifTypageComponent } from './parametrage/parametrage-systeme/typage/modif-typage/modif-typage.component';
import { FilialeComponent } from './parametrage/parametrage-general/filiale/filiale.component';
import { AjoutFilialeComponent } from './parametrage/parametrage-general/filiale/ajout-filiale/ajout-filiale.component';
import { ModifFilialeComponent } from './parametrage/parametrage-general/filiale/modif-filiale/modif-filiale.component';
import { RoleComponent } from './gestion-utilisateur/gestion_role/role/role.component';
import { FonctionnaliteComponent } from './gestion-utilisateur/gestion_role/fonctionnalite/fonctionnalite.component';
import { AjoutRoleComponent } from './gestion-utilisateur/gestion_role/role/ajout-role/ajout-role.component';
import { ModifRoleComponent } from './gestion-utilisateur/gestion_role/role/modif-role/modif-role.component';
import { ModifFonctionnaliteComponent } from './gestion-utilisateur/gestion_role/fonctionnalite/modif-fonctionnalite/modif-fonctionnalite.component';
import { AjoutFonctionnaliteComponent } from './gestion-utilisateur/gestion_role/fonctionnalite/ajout-fonctionnalite/ajout-fonctionnalite.component';

import { GroupeComponent } from './parametrage/parametrage-general/groupe/groupe.component';
import { AjoutGroupeComponent } from './parametrage/parametrage-general/groupe/ajout-groupe/ajout-groupe.component';
import { ModifGroupeComponent } from './parametrage/parametrage-general/groupe/modif-groupe/modif-groupe.component';
import { ModifProfilComponent } from './profil/modif-profil/modif-profil.component';
import { ModifPhotoComponent } from './profil/modif-photo/modif-photo.component';
import { AjoutPaysComponent } from './parametrage/parametrage-general/gestion-pays/ajout-pays/ajout-pays.component';
import { ModifPaysComponent } from './parametrage/parametrage-general/gestion-pays/modif-pays/modif-pays.component';
import { GestionPaysComponent } from './parametrage/parametrage-general/gestion-pays/gestion-pays.component';
import { GestionCategorieComponent } from './parametrage/parametrage-general/gestion-categorie/gestion-categorie.component';
import { AjoutCategorieComponent } from './parametrage/parametrage-general/gestion-categorie/ajout-categorie/ajout-categorie.component';
import { ModifCategorieComponent } from './parametrage/parametrage-general/gestion-categorie/modif-categorie/modif-categorie.component';
import { GestionReassureurComponent } from './parametrage/parametrage-general/gestion-reassureur/gestion-reassureur.component';
import { ModifReassureurComponent } from './parametrage/parametrage-general/gestion-reassureur/modif-reassureur/modif-reassureur.component';
import { ReassureurComponent } from './parametrage/parametrage-general/gestion-reassureur/reassureur/reassureur.component';
// tslint:disable-next-line:max-line-length
import { GestionCiviliteComponent } from './parametrage/parametrage-general/gestion-civilite/gestion-civilite.component';
import { AjoutCiviliteComponent } from './parametrage/parametrage-general/gestion-civilite/ajout-civilite/ajout-civilite.component';
import { ModifCiviliteComponent } from './parametrage/parametrage-general/gestion-civilite/modif-civilite/modif-civilite.component';
import { GestionCimacompagnieComponent } from './parametrage/parametrage-general/gestion-cimacompagnie/gestion-cimacompagnie.component';
import { AjoutCimacompagnieComponent } from './parametrage/parametrage-general/gestion-cimacompagnie/ajout-cimacompagnie/ajout-cimacompagnie.component';
import { ModifCimacompagnieComponent } from './parametrage/parametrage-general/gestion-cimacompagnie/modif-cimacompagnie/modif-cimacompagnie.component';
import { AddBrancheComponent } from './parametrage/parametrage-general/gestion-branche/add-branche/add-branche.component';
import { GestionBrancheComponent } from './parametrage/parametrage-general/gestion-branche/gestion-branche.component';
import { UpdateBrancheComponent } from './parametrage/parametrage-general/gestion-branche/update-branche/update-branche.component';
import { AddProduitComponent } from './parametrage/parametrage-general/gestion-produit/add-produit/add-produit.component';
import { GestionProduitComponent } from './parametrage/parametrage-general/gestion-produit/gestion-produit.component';
import { UpdateProduitComponent } from './parametrage/parametrage-general/gestion-produit/update-produit/update-produit.component';
import { AddAccessoireComponent } from './parametrage/parametrage-systeme/gestion-accessoire/add-accessoire/add-accessoire.component';
import { GestionAccessoireComponent } from './parametrage/parametrage-systeme/gestion-accessoire/gestion-accessoire.component';
import { UpdateAccessoireComponent } from './parametrage/parametrage-systeme/gestion-accessoire/update-accessoire/update-accessoire.component';
import { AddCategorieSocioprofessionnelleComponent } from './parametrage/parametrage-systeme/gestion-categorie-socioprofessionnelle/add-categorie-socioprofessionnelle/add-categorie-socioprofessionnelle.component';
import { GestionCategorieSocioprofessionnelleComponent } from './parametrage/parametrage-systeme/gestion-categorie-socioprofessionnelle/gestion-categorie-socioprofessionnelle.component';
import { UpdateCategorieSocioprofessionnelleComponent } from './parametrage/parametrage-systeme/gestion-categorie-socioprofessionnelle/update-categorie-socioprofessionnelle/update-categorie-socioprofessionnelle.component';
import { AddCommissionComponent } from './parametrage/parametrage-systeme/gestion-commission/add-commission/add-commission.component';
import { GestionCommissionComponent } from './parametrage/parametrage-systeme/gestion-commission/gestion-commission.component';
import { UpdateCommissionComponent } from './parametrage/parametrage-systeme/gestion-commission/update-commission/update-commission.component';
import { CompagnieComponent } from './parametrage/parametrage-general/compagnie/compagnie.component';
import { AjoutCompagnieComponent } from './parametrage/parametrage-general/compagnie/ajout-compagnie/ajout-compagnie.component';
import { ModifCompagnieComponent } from './parametrage/parametrage-general/compagnie/modif-compagnie/modif-compagnie.component';
import { AjoutTaxeComponent } from './parametrage/parametrage-general/taxe/ajout-taxe/ajout-taxe.component';
import { ModifTaxeComponent } from './parametrage/parametrage-general/taxe/modif-taxe/modif-taxe.component';
import { TaxeComponent } from './parametrage/parametrage-general/taxe/taxe.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import {NgxPrintModule} from 'ngx-print';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';


import { GestionIntermediaireComponent } from './parametrage/parametrage-general/gestion-intermediaire/gestion-intermediaire.component';
import { AddIntermediaireComponent } from './parametrage/parametrage-general/gestion-intermediaire/add-intermediaire/add-intermediaire.component';
import { UpdateIntermediaireComponent } from './parametrage/parametrage-general/gestion-intermediaire/update-intermediaire/update-intermediaire.component';
import { AgendaComponent } from './agenda/agenda.component';
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AjoutPhysiqueComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-physique/ajout-physique/ajout-physique.component';
import { DemandeSocieteComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-societe/demande-societe.component';
import { AjoutSocieteComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-societe/ajout-societe/ajout-societe.component';
import { GestionContactComponent } from './gestion-commerciale/gestion-portefeuille/gestion-contact/gestion-contact.component';
import { AjoutContactComponent } from './gestion-commerciale/gestion-portefeuille/gestion-contact/ajout-contact/ajout-contact.component';
import { ModifContactComponent } from './gestion-commerciale/gestion-portefeuille/gestion-contact/modif-contact/modif-contact.component';
import { AjoutRdvComponent } from './agenda/ajout-rdv/ajout-rdv.component';
import { ModifRdvComponent } from './agenda/modif-rdv/modif-rdv.component';
import { GestionClientComponent } from './gestion-commerciale/gestion-portefeuille/gestion-client/gestion-client.component';
import { AjoutClientComponent } from './gestion-commerciale/gestion-portefeuille/gestion-client/ajout-client/ajout-client.component';
import { ModifClientComponent } from './gestion-commerciale/gestion-portefeuille/gestion-client/modif-client/modif-client.component';
import { DemandePhysiqueComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-physique/demande-physique.component';
import { GestionProspectComponent } from './gestion-commerciale/gestion-portefeuille/gestion-prospect/gestion-prospect.component';
import { AddProspectComponent } from './gestion-commerciale/gestion-portefeuille/gestion-prospect/add-prospect/add-prospect.component';
import { UpdateProspectComponent } from './gestion-commerciale/gestion-portefeuille/gestion-prospect/update-prospect/update-prospect.component';
import { EspaceClientComponent } from './espace-client/espace-client.component';
import { SimulerTarificationComponent } from './espace-client/simuler-tarification/simuler-tarification.component';
// tslint:disable-next-line:max-line-length
import { GestionDevisComponent } from './gestion-commerciale/gestion-portefeuille/gestion-devis/gestion-devis.component';
import { AjoutDevisComponent } from './gestion-commerciale/gestion-portefeuille/gestion-devis/ajout-devis/ajout-devis.component';
import { ModifDevisComponent } from './gestion-commerciale/gestion-portefeuille/gestion-devis/modif-devis/modif-devis.component';
import { ContactComponent } from './gestion-commerciale/gestion-portefeuille/gestion-client/contact/contact.component';
import { AddcontactClientComponent } from './gestion-commerciale/gestion-portefeuille/gestion-client/contact/addcontact-client/addcontact-client.component';
import { UpdatecontactClientComponent } from './gestion-commerciale/gestion-portefeuille/gestion-client/contact/updatecontact-client/updatecontact-client.component';
import { MesdossiersComponent } from './espace-client/mesdossiers/mesdossiers.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { PageNotAutoriserComponent } from './page-not-autoriser/page-not-autoriser.component';
import { GestionDossierComponent } from './gestion-commerciale/gestion-portefeuille/gestion-dossier/gestion-dossier.component';
import { FilialeClientComponent } from './parametrage/parametrage-general/filiale-client/filiale-client.component';
import { AjoutFilialeClientComponent } from './parametrage/parametrage-general/filiale-client/ajout-filiale-client/ajout-filiale-client.component';
import { ModifFilialeClientComponent } from './parametrage/parametrage-general/filiale-client/modif-filiale-client/modif-filiale-client.component';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
// import { MatSelectSearchModule } from 'mat-select-search';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { DossierIntermediaireComponent } from './parametrage/parametrage-general/gestion-intermediaire/dossier-intermediaire/dossier-intermediaire.component';
import { DossierRdvComponent } from './agenda/dossier-rdv/dossier-rdv.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { ClientAttenteComponent } from './gestion-commerciale/gestion-portefeuille/gestion-client/client-attente/client-attente.component';
import { ConsultationComponent } from './gestion-commerciale/consultation/consultation.component';
import { GestionPropositionComponent } from './gestion-production/gestion-proposition/gestion-proposition.component';
import { AjoutComponent } from './gestion-production/gestion-proposition/ajout/ajout.component';
import { ModifComponent } from './gestion-production/gestion-proposition/modif/modif.component';
// import {MatMenu} from '@angular/material/menu';
import {MatMenuModule} from '@angular/material/menu';
import { DetailClientComponent } from './gestion-commerciale/gestion-portefeuille/gestion-client/detail-client/detail-client.component';
// tslint:disable-next-line:max-line-length
import { ProductionProjectModule } from './production-project/production-project.module';
import { GestionEncaissementComponent } from './gestion-production/gestion-encaissement/gestion-encaissement.component';
import { AjoutEncaissementComponent } from './gestion-production/gestion-encaissement/ajout-encaissement/ajout-encaissement.component';
import { GestionEngagementsComponent } from './gestion-production/gestion-engagements/gestion-engagements.component';
import { GestionFacturesComponent } from './gestion-production/gestion-factures/gestion-factures.component';
import { GestionQuittanceComponent } from './gestion-production/gestion-quittance/gestion-quittance.component';
import { ConsultationGestionProductionComponent } from './gestion-production/consultation-gestion-production/consultation-gestion-production.component';
import { ConsultationEncaissementComponent } from './gestion-production/consultation-gestion-production/consultation-encaissement/consultation-encaissement.component';
import { GestionPoliceComponent } from './gestion-production/police/gestion-police/gestion-police.component';
import { AddPoliceComponent } from './gestion-production/police/gestion-police/add-police/add-police.component';
import { UpdatePoliceComponent } from './gestion-production/police/gestion-police/update-police/update-police.component';
import { PoliceComponent } from './gestion-production/police/police.component';
import { GestionActeComponent } from './gestion-production/gestion-acte/gestion-acte.component';
import { GestionClauseComponent } from './gestion-production/gestion-clause/gestion-clause.component';
import { AddClauseComponent } from './gestion-production/gestion-clause/add-clause/add-clause.component';
import { AnnulerFactureComponent } from './gestion-production/gestion-factures/annuler-facture/annuler-facture.component';
import { ConsultationEmissionComponent } from './gestion-production/consultation-gestion-production/consultation-emission/consultation-emission.component';
import { AddEngagementComponent } from './gestion-production/gestion-engagements/add-engagement/add-engagement.component';
import { Client360Component } from './gestion-commerciale/gestion-portefeuille/gestion-client/client360/client360.component';
import { AnnulerEncaissementComponent } from './gestion-production/gestion-encaissement/annuler-encaissement/annuler-encaissement.component';
import { AddActeComponent } from './gestion-production/gestion-acte/add-acte/add-acte.component';
import { PayerCommissionsComponent } from './gestion-production/gestion-commissions/payer-commissions/payer-commissions.component';
import { ReemetreFactureComponent } from './gestion-production/gestion-factures/reemetre-facture/reemetre-facture.component';
import { ListeCommissionComponent } from './gestion-production/gestion-commissions/liste-commission/liste-commission.component';
import { AddClauseacteComponent } from './gestion-production/gestion-acte/add-clauseacte/add-clauseacte.component';
import { ConsultationEmissionAnnuleeComponent } from './gestion-production/consultation-gestion-production/consultation-emission/consultation-emission-annulee/consultation-emission-annulee.component';
import { GestionMainleveComponent } from './gestion-production/gestion-mainleve/gestion-mainleve.component';
import { AddMainleveComponent } from './gestion-production/gestion-mainleve/add-mainleve/add-mainleve.component';
import { ModifMainleveComponent } from './gestion-production/gestion-mainleve/modif-mainleve/modif-mainleve.component';
import { ConsultationProductionComponent } from './gestion-production/consultation-gestion-production/consultation-production/consultation-production.component';
import { ConsultationEncaissementAnnuleComponent } from './gestion-production/consultation-gestion-production/consultation-encaissement/consultation-encaissement-annule/consultation-encaissement-annule.component';
import { ListMainleveComponent } from './gestion-production/gestion-mainleve/list-mainleve/list-mainleve.component';
import { ImprimerFactureComponent } from './gestion-production/gestion-factures/imprimer-facture/imprimer-facture.component';
import { GestionArbitrageComponent } from './gestion-arbitrage/gestion-arbitrage.component';
import { GestionAgrementComponent } from './gestion-arbitrage/gestion-agrement/gestion-agrement.component';
import { AjoutAgrementComponent } from './gestion-arbitrage/gestion-agrement/ajout-agrement/ajout-agrement.component';
import { GestionCreditExportComponent } from './gestion-arbitrage/gestion-credit-export/gestion-credit-export.component';
import { AjoutCreditExportComponent } from './gestion-arbitrage/gestion-credit-export/ajout-credit-export/ajout-credit-export.component';
import { ListeValideComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-physique/liste-valide/liste-valide.component';
import { ViewPdfComponent } from './gestion-commerciale/gestion-portefeuille/gestion-dossier/view-pdf/view-pdf.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ConsultationParamGeneralComponent } from './parametrage/parametrage-general/consultation-param-general/consultation-param-general.component';
import { AjoutPoliceComponent } from './gestion-production/police/gestion-police/ajout-police/ajout-police.component';
import { AjoutLotComponent } from './gestion-production/police/gestion-police/ajout-police/ajout-lot/ajout-lot.component';
import { ViewPoliceComponent } from './gestion-production/police/gestion-police/view-police/view-police.component';
import { AjoutAcheteurComponent } from './gestion-production/police/gestion-police/ajout-police/ajout-acheteur/ajout-acheteur.component';
import { MailRdvComponent } from './agenda/mail-rdv/mail-rdv/mail-rdv.component';
import { OuvertureCompteComponent } from './gestion-commerciale/gestion-portefeuille/ouverture-compte/ouverture-compte.component';
import { DemandeCautionComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-caution/demande-caution.component';
import { TestCompteComponent } from './gestion-commerciale/gestion-portefeuille/test-compte/test-compte.component';
import { ProspectAttenteComponent } from './gestion-commerciale/gestion-portefeuille/gestion-prospect/prospect-attente/prospect-attente.component';
import { UpdateProspectAttenteComponent } from './gestion-commerciale/gestion-portefeuille/gestion-prospect/prospect-attente/update-prospect-attente/update-prospect-attente.component';
import { ArbitragePhysiqueComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-physique/arbitrage-physique/arbitrage-physique.component';
import { ArbitrageSocieteComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-societe/arbitrage-societe/arbitrage-societe.component';
import { ListdemsocValideComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-societe/listdemsoc-valide/listdemsoc-valide.component';
import { TransformerProspectEnClientComponent } from './gestion-commerciale/gestion-portefeuille/gestion-prospect/transformer-prospect-en-client/transformer-prospect-en-client.component';
import { ProspectTransformerComponent } from './gestion-commerciale/gestion-portefeuille/gestion-prospect/prospect-transformer/prospect-transformer.component';
import { ModifPoliceComponent } from './gestion-production/modif-police/modif-police.component';
import { ModifEngagementComponent } from './gestion-production/gestion-engagements/modif-engagement/modif-engagement.component';
import { OuvertureComptephComponent } from './gestion-commerciale/gestion-portefeuille/ouverture-compteph/ouverture-compteph.component';
import { OuvertureComptesocComponent } from './gestion-commerciale/gestion-portefeuille/ouverture-comptesoc/ouverture-comptesoc.component';
import { GestionSureteDepositComponent } from './gestion-production/gestion-surete-deposit/gestion-surete-deposit.component';
import { AddSureteComponent } from './gestion-production/gestion-surete-deposit/add-surete/add-surete.component';
import { UpdateSureteComponent } from './gestion-production/gestion-surete-deposit/update-surete/update-surete.component';
import { AddSurete2Component } from './gestion-production/gestion-surete-deposit/add-surete2/add-surete2.component';
import { LiberationDepositComponent } from './gestion-production/gestion-surete-deposit/gestion-deposit/liberation-deposit/liberation-deposit.component';
import { AgmCoreModule } from '@agm/core';
import { TestGoogleMapsComponent } from './gestion-production/gestion-surete-deposit/test-google-maps/test-google-maps.component';
import { RealisationDepositComponent } from './gestion-production/gestion-surete-deposit/gestion-deposit/realisation-deposit/realisation-deposit.component';
import { LiberationTFComponent } from './gestion-production/gestion-surete-deposit/gestion-titre-foncier/liberation-tf/liberation-tf.component';
import { RealisationTFComponent } from './gestion-production/gestion-surete-deposit/gestion-titre-foncier/realisation-tf/realisation-tf.component';
import { LiberationCautionSolidaireComponent } from './gestion-production/gestion-surete-deposit/gestion-caution-solidaire/liberation-caution-solidaire/liberation-caution-solidaire.component';
import { RealisationCautionSolidaireComponent } from './gestion-production/gestion-surete-deposit/gestion-caution-solidaire/realisation-caution-solidaire/realisation-caution-solidaire.component';
import { ConsultationPoliceComponent } from './gestion-production/consultation-gestion-production/consultation-police/consultation-police.component';
import { LiberationAutresSuretesComponent } from './gestion-production/gestion-surete-deposit/gestion-autres-suretes/liberation-autres-suretes/liberation-autres-suretes.component';
import { RealisationAutresSuretesComponent } from './gestion-production/gestion-surete-deposit/gestion-autres-suretes/realisation-autres-suretes/realisation-autres-suretes.component';
import { VoirPdfComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-physique/voir-pdf/voir-pdf.component';
import { TestExportComponent } from './gestion-commerciale/gestion-portefeuille/test-export/test-export.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { VoirpdfComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-societe/voirpdf/voirpdf.component';
import { VoirpdfSocieteComponent } from './gestion-commerciale/gestion-portefeuille/voirpdf-societe/voirpdf-societe.component';
import { VoirpdfPhysiqueComponent } from './gestion-commerciale/gestion-portefeuille/voirpdf-physique/voirpdf-physique.component';
import { CocherdocPhysiqueComponent } from './gestion-commerciale/gestion-portefeuille/cocherdoc-physique/cocherdoc-physique.component';
import { CocherdocSocieteComponent } from './gestion-commerciale/gestion-portefeuille/cocherdoc-societe/cocherdoc-societe.component';
import { ConsultationProspectComponent } from './gestion-commerciale/consultation/consultation-prospect/consultation-prospect.component';
import { DeclarationMenaceSinistreComponent } from './gestion-sinistre/declaration-menace-sinistre/declaration-menace-sinistre.component';
import { DeclarationSinistreComponent } from './gestion-sinistre/declaration-sinistre/declaration-sinistre.component';
import { GestionAcheteursComponent } from './gestion-tiers/gestion-acheteurs/gestion-acheteurs.component';
import { ModifAcheteurComponent } from './gestion-tiers/gestion-acheteurs/modif-acheteur/modif-acheteur.component';
import { OtherAcheteurComponent } from './gestion-production/gestion-factures/other-acheteur/other-acheteur.component';
import { OtherUpdateComponent } from './gestion-production/gestion-factures/other-update/other-update.component';
import { MatDialogModule } from '@angular/material/dialog';
//import { MatMenuModule } from '@angular/material/menu';
import { AddDeclarationMenaceSinistreComponent } from './gestion-sinistre/declaration-menace-sinistre/add-declaration-menace-sinistre/add-declaration-menace-sinistre.component';
import { ConsultationGestionSinistreComponent } from './gestion-sinistre/consultation-gestion-sinistre/consultation-gestion-sinistre.component';
import { ConsultationSinistreComponent } from './gestion-sinistre/consultation-gestion-sinistre/consultation-sinistre/consultation-sinistre.component';
import { ViewDeclarationMenaceSinistreComponent } from './gestion-sinistre/declaration-menace-sinistre/view-declaration-menace-sinistre/view-declaration-menace-sinistre.component';
import { AddDeclarationSinistreComponent } from './gestion-sinistre/declaration-sinistre/add-declaration-sinistre/add-declaration-sinistre.component';
import { ViewDeclarationSinistreComponent } from './gestion-sinistre/declaration-sinistre/view-declaration-sinistre/view-declaration-sinistre.component';
import { UpdataAcheteurComponent } from './gestion-tiers/gestion-acheteurs/updata-acheteur/updata-acheteur.component';
//import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ListeSinistreComponent } from './gestion-sinistre/liste-sinistre/liste-sinistre.component';
import { PropositionRecoursComponent } from './gestion-sinistre/proposition-recours/proposition-recours.component';
import { ListeMenaceSinistreComponent } from './gestion-sinistre/liste-menace-sinistre/liste-menace-sinistre.component';
import { ValidationRecoursComponent } from './gestion-sinistre/validation-recours/validation-recours.component';
import { ModificationEvaluationComponent } from './gestion-sinistre/modification-evaluation/modification-evaluation.component';
import { ModificationSapComponent } from './gestion-sinistre/modification-sap/modification-sap.component';
import { AnnulationPropositionComponent } from './gestion-sinistre/annulation-proposition/annulation-proposition.component';
import { AnnulationValidationRecoursComponent } from './gestion-sinistre/annulation-validation-recours/annulation-validation-recours.component';
import { ValidationRecoursEncaisseComponent } from './gestion-sinistre/validation-recours-encaisse/validation-recours-encaisse.component';
import { AnnulationRecoursEncaisseComponent } from './gestion-sinistre/annulation-recours-encaisse/annulation-recours-encaisse.component';
import { GestionReglementComponent } from './gestion-sinistre/gestion-reglement/gestion-reglement.component';
import { PropositionReglementComponent } from './gestion-sinistre/gestion-reglement/proposition-reglement/proposition-reglement.component';
import { ValidationReglementComponent } from './gestion-sinistre/gestion-reglement/validation-reglement/validation-reglement.component';
import { AnnulationPropositionReglementComponent } from './gestion-sinistre/gestion-reglement/annulation-proposition-reglement/annulation-proposition-reglement.component';
import { AnnulationValidationReglementComponent } from './gestion-sinistre/gestion-reglement/annulation-validation-reglement/annulation-validation-reglement.component';
import { ConsultationSinistraliteComponent } from './gestion-sinistre/consultation-gestion-sinistre/consultation-sinistralite/consultation-sinistralite.component';
import { ImprimerFactureautresComponent } from './gestion-production/gestion-factures/imprimer-factureautres/imprimer-factureautres.component';
import { ImprimerFacturecmtComponent } from './gestion-production/gestion-factures/imprimer-facturecmt/imprimer-facturecmt.component';
import { StaticInstructionComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-societe/static-instruction/static-instruction.component';
import { InstructionStaticComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-physique/instruction-static/instruction-static.component';
import { StaticInstructionCreditComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-societe/static-instruction-credit/static-instruction-credit.component';
import { StaticInstructionPerteComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-societe/static-instruction-perte/static-instruction-perte.component';
import { AllInstructionsComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/all-instructions/all-instructions.component';
import { ClotureSinistreComponent } from './gestion-sinistre/cloture-sinistre/cloture-sinistre.component';
import { ReouvrirSinistreComponent } from './gestion-sinistre/reouvrir-sinistre/reouvrir-sinistre.component';
import { OuvrirSinistreComponent } from './gestion-sinistre/reouvrir-sinistre/ouvrir-sinistre/ouvrir-sinistre.component';
import { ModificationMenaceSinistreComponent } from './gestion-sinistre/liste-menace-sinistre/modification-menace-sinistre/modification-menace-sinistre.component';
import { DeclarationSinistreDeLaMenaceComponent } from './gestion-sinistre/liste-menace-sinistre/declaration-sinistre-de-la-menace/declaration-sinistre-de-la-menace.component';
import { ViewReglementComponent } from './gestion-sinistre/gestion-reglement/view-reglement/view-reglement.component';
import { ListeSinistreRecoursComponent } from './gestion-moratoire/liste-sinistre/liste-sinistre-recours.component';
import { AddMoratoireComponent } from './gestion-moratoire/add-moratoire/add-moratoire.component';
import { ModifierMoratoireComponent } from './gestion-moratoire/modifier-moratoire/modifier-moratoire.component';
import { AnnulerMoratoireComponent } from './gestion-moratoire/annuler-moratoire/annuler-moratoire.component';
import { EncaisserMoratoireComponent } from './gestion-moratoire/encaisser-moratoire/encaisser-moratoire.component';
import { AddPenaliteComponent } from './gestion-moratoire/add-penalite/add-penalite.component';
import { EncaisserPenaliteComponent } from './gestion-moratoire/encaisser-penalite/encaisser-penalite.component';
import { ViewEncaissementRecoursComponent } from './gestion-sinistre/validation-recours-encaisse/view-encaissement-recours/view-encaissement-recours.component';
import { ViewPropositionRecoursComponent } from './gestion-sinistre/proposition-recours/view-proposition-recours/view-proposition-recours.component';
import { InstructionStaticCreditComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-physique/instruction-static-credit/instruction-static-credit.component';
import { InstructionStaticPerteComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-physique/instruction-static-perte/instruction-static-perte.component';
import { ActeCautionComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-societe/acte-caution/acte-caution.component';
import { ActeCreditComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-societe/acte-credit/acte-credit.component';
import { ActePerteComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-societe/acte-perte/acte-perte.component';
import { ViewClotureSinistreComponent } from './gestion-sinistre/cloture-sinistre/view-cloture-sinistre/view-cloture-sinistre.component';
import { ViewReouvrirSinistreComponent } from './gestion-sinistre/reouvrir-sinistre/view-reouvrir-sinistre/view-reouvrir-sinistre.component';

import { ActeLocassurComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-societe/acte-locassur/acte-locassur.component';
import { CautionActeComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-physique/caution-acte/caution-acte.component';
import { CreditActeComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-physique/credit-acte/credit-acte.component';
import { PerteActeComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-physique/perte-acte/perte-acte.component';

import { EncaissementRecoursComponent } from './gestion-comptable/encaissement-recours/encaissement-recours.component';
import { AnnulationEncaissementRecoursComponent } from './gestion-comptable/annulation-encaissement-recours/annulation-encaissement-recours.component';
import { EncaissementMoratoirePenaliteComponent } from './gestion-comptable/encaissement-moratoire-penalite/encaissement-moratoire-penalite.component';
import { AddDocumentSinistreComponent } from './gestion-sinistre/declaration-sinistre/add-document-sinistre/add-document-sinistre.component';
import { TraitementPeriodiqueComponent } from './gestion-sinistre/traitement-periodique/traitement-periodique.component';
import { TraitementJournalierComponent } from './gestion-sinistre/traitement-periodique/traitement-journalier/traitement-journalier.component';
import { TraitementMensuelComponent } from './gestion-sinistre/traitement-periodique/traitement-mensuel/traitement-mensuel.component';
import { TraitementAnnuelComponent } from './gestion-sinistre/traitement-periodique/traitement-annuel/traitement-annuel.component';
import { GestionFinancierReglementComponent } from './gestion-comptable/gestion-financier-reglement/gestion-financier-reglement.component';
import { AnnulationEncaissementReglementComponent } from './gestion-comptable/gestion-financier-reglement/annulation-encaissement-reglement/annulation-encaissement-reglement.component';
import { DetailsReglementFinancierComponent } from './gestion-comptable/gestion-financier-reglement/details-reglement-financier/details-reglement-financier.component';
import { ReglementFinancierComponent } from './gestion-comptable/gestion-financier-reglement/reglement-financier/reglement-financier.component';
import { ChoixTypeReglementComponent } from './gestion-comptable/gestion-financier-reglement/choix-type-reglement/choix-type-reglement.component';
import { ListeMouvementComponent } from './gestion-sinistre/liste-mouvement/liste-mouvement.component';
import { ListeMouvementEvaluationComponent } from './gestion-sinistre/liste-mouvement/liste-mouvement-evaluation/liste-mouvement-evaluation.component';
import { ListeMouvementSapComponent } from './gestion-sinistre/liste-mouvement/liste-mouvement-sap/liste-mouvement-sap.component';
import { ListeMouvementPropositionReglementComponent } from './gestion-sinistre/liste-mouvement/liste-mouvement-proposition-reglement/liste-mouvement-proposition-reglement.component';
import { ListeMouvementValidationReglementComponent } from './gestion-sinistre/liste-mouvement/liste-mouvement-validation-reglement/liste-mouvement-validation-reglement.component';
import { ListeMouvementPropositionRecoursComponent } from './gestion-sinistre/liste-mouvement/liste-mouvement-proposition-recours/liste-mouvement-proposition-recours.component';
import { ListeMouvementValidationRecoursComponent } from './gestion-sinistre/liste-mouvement/liste-mouvement-validation-recours/liste-mouvement-validation-recours.component';
import { ListeMouvementEncaissementRecoursComponent } from './gestion-sinistre/liste-mouvement/liste-mouvement-encaissement-recours/liste-mouvement-encaissement-recours.component';
import { ViewReglementFinancierComponent } from './gestion-comptable/gestion-financier-reglement/view-reglement-financier/view-reglement-financier.component';
import { ListeReglementFinancierComponent } from './gestion-comptable/gestion-financier-reglement/liste-reglement-financier/liste-reglement-financier.component';
import { DetailsListeReglementFinancierComponent } from './gestion-comptable/gestion-financier-reglement/liste-reglement-financier/details-liste-reglement-financier/details-liste-reglement-financier.component';
import { ParametrageDateComptableComponent } from './parametrage/parametrage-general/parametrage-date-comptable/parametrage-date-comptable.component';
import { AddDateComptableComponent } from './parametrage/parametrage-general/parametrage-date-comptable/add-date-comptable/add-date-comptable.component';
import { UpdateDateComptableComponent } from './parametrage/parametrage-general/parametrage-date-comptable/update-date-comptable/update-date-comptable.component';
import { ConsultationEngagementComponent } from './gestion-production/gestion-engagements/consultation-engagement/consultation-engagement.component';
import { GestionBanqueComponent } from './parametrage/parametrage-comptable/gestion-banque/gestion-banque.component';
import { AddBanqueComponent } from './parametrage/parametrage-comptable/gestion-banque/add-banque/add-banque.component';
import { UpdateBanqueComponent } from './parametrage/parametrage-comptable/gestion-banque/update-banque/update-banque.component';
import { FactureAnnulerComponent } from './gestion-production/gestion-factures/facture-annuler/facture-annuler.component';
import { GestionPleinsComponent } from './parametrage/parametrage-comptable/gestion-pleins/gestion-pleins.component';
import { AddPleinsComponent } from './parametrage/parametrage-comptable/gestion-pleins/add-pleins/add-pleins.component';
import { UpdatePleinsComponent } from './parametrage/parametrage-comptable/gestion-pleins/update-pleins/update-pleins.component';
import { EncaissementAnnulerComponent } from './gestion-production/gestion-encaissement/encaissement-annuler/encaissement-annuler.component';
import { ViewModificationEvaluationComponent } from './gestion-sinistre/modification-evaluation/view-modification-evaluation/view-modification-evaluation.component';
import { ViewModificationSapComponent } from './gestion-sinistre/modification-sap/view-modification-sap/view-modification-sap.component';
import { GestionBeneficiairesComponent } from './gestion-tiers/gestion-acheteurs/gestion-beneficiaires/gestion-beneficiaires.component';
import { GestionTiersDebiteursComponent } from './gestion-tiers/gestion-acheteurs/gestion-tiers-debiteurs/gestion-tiers-debiteurs.component';
import { AnnulationReglementFinancierComponent } from './gestion-comptable/gestion-financier-reglement/annulation-reglement-financier/annulation-reglement-financier.component';
import { ConsultationBrancheComponent } from './parametrage/parametrage-general/consultation-param-general/consultation-branche/consultation-branche.component';
import { ConsultationCategorieComponent } from './parametrage/parametrage-general/consultation-param-general/consultation-categorie/consultation-categorie.component';
import { ConsultationProduitComponent } from './parametrage/parametrage-general/consultation-param-general/consultation-produit/consultation-produit.component';
import { ConsultationIntermediaireComponent } from './parametrage/parametrage-general/consultation-param-general/consultation-intermediaire/consultation-intermediaire.component';
import { ConsultationCompagnieComponent } from './parametrage/parametrage-general/consultation-param-general/consultation-compagnie/consultation-compagnie.component';
import { ConsultationReassureurComponent } from './parametrage/parametrage-general/consultation-param-general/consultation-reassureur/consultation-reassureur.component';
import { GestionClientRepriseComponent } from './reprise-existant/gestion-client-reprise/gestion-client-reprise.component';
import { ModifClientRepriseComponent } from './reprise-existant/gestion-client-reprise/modif-client-reprise/modif-client-reprise.component';
import { FactureProductionComponent } from './gestion-production/gestion-factures/facture-production/facture-production.component';
import { PoliceRepriseComponent } from './gestion-production/police-reprise/police-reprise.component';
import { AddAcheteurComponent } from './gestion-production/police-reprise/add-acheteur/add-acheteur.component';
import { AddPolice2Component } from './gestion-production/police-reprise/add-police2/add-police2.component';
import { AjoutAcheteur2Component } from './gestion-production/police-reprise/add-police2/ajout-acheteur2/ajout-acheteur2.component';
import { AjoutLot2Component } from './gestion-production/police-reprise/add-police2/ajout-lot2/ajout-lot2.component';
import { AjoutEncaissementAvoirComponent } from './gestion-production/gestion-encaissement/ajout-encaissement-avoir/ajout-encaissement-avoir.component';

@NgModule({
  imports: [
    NbSpinnerModule,
    ThemeModule,
    NbMenuModule,
    HomeRoutingModule,
    NbCardModule,
    CKEditorModule,
    Ng2SmartTableModule,
    NbButtonModule,
    NbTabsetModule,
    NbInputModule,
    NbSelectModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    NbTreeGridModule,
    NbAlertModule,
    MatInputModule,
    NbListModule,
    NbProgressBarModule,
    NgxIntlTelInputModule,
    NbEvaIconsModule,
    MatPaginatorModule,
    //Module pour la premiere recherche
    //MatSelectSearchModule,
    //Moudles pour la recherche
    MatMenuModule,
    FormsModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
    NgxPrintModule,
    NbCheckboxModule,
    NbTagModule,
    NbRadioModule,
    PdfViewerModule,
    MatTableExporterModule,
    MatDialogModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  //  AgendaComponent,

    CommonModule,
    //NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    ProductionProjectModule,
     AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBQIlOvzYl1pcVh6WC2SE7a827XJDd4HUQ'
    })

  ],

  exports: [
    TranslateModule,
    AgendaComponent,
  ],

  declarations: [
    HomeComponent,
    ProfilComponent,
    GestionUtilisateurComponent,
    AjoutUtilisateurComponent,
    ModifUtilisateurComponent,
    TypageComponent,
    AjoutTypageComponent,
    ModifTypageComponent,
    FilialeComponent,
    AjoutFilialeComponent,
    ModifFilialeComponent,
    RoleComponent,
    FonctionnaliteComponent,
    AjoutRoleComponent,
    ModifRoleComponent,
    ModifFonctionnaliteComponent,
    AjoutFonctionnaliteComponent,
    GroupeComponent,
    AjoutGroupeComponent,
    ModifGroupeComponent,
    ModifProfilComponent,
    ModifPhotoComponent,
    AjoutPaysComponent,
    ModifPaysComponent,
    GestionPaysComponent,
    GestionCategorieComponent,
    AjoutCategorieComponent,
    ModifCategorieComponent,
    GestionReassureurComponent,
    ModifReassureurComponent,
    GestionCiviliteComponent,
    AjoutCiviliteComponent,
    ModifCiviliteComponent,
    GestionCimacompagnieComponent,
    AjoutCimacompagnieComponent,
    ModifCimacompagnieComponent,
    GestionBrancheComponent,
    AddBrancheComponent,
    UpdateBrancheComponent,
    GestionCategorieSocioprofessionnelleComponent,
    AddCategorieSocioprofessionnelleComponent,
    UpdateCategorieSocioprofessionnelleComponent,
    GestionAccessoireComponent,
    AddAccessoireComponent,
    UpdateAccessoireComponent,
    GestionCommissionComponent,
    AddCommissionComponent,
    UpdateCommissionComponent,
    GestionProduitComponent,
    AddProduitComponent,
    UpdateProduitComponent,
    CompagnieComponent,
    AjoutCompagnieComponent,
    ModifCompagnieComponent,
    TaxeComponent,
    AjoutTaxeComponent,
    ModifTaxeComponent,
    AgendaComponent,
    ReassureurComponent,
    GestionContactComponent,
    AjoutContactComponent,
    ModifContactComponent,
    GestionIntermediaireComponent,
    AddIntermediaireComponent,
    UpdateIntermediaireComponent,
    AjoutRdvComponent,
    ModifRdvComponent,
    DemandePhysiqueComponent,
    AjoutPhysiqueComponent,
    DemandeSocieteComponent,
    AjoutSocieteComponent,
    GestionClientComponent,
    AjoutClientComponent,
    ModifClientComponent,
    GestionProspectComponent,
    AddProspectComponent,
    UpdateProspectComponent,
    EspaceClientComponent,
    SimulerTarificationComponent,
    GestionDevisComponent,
    AjoutDevisComponent,
    ModifDevisComponent,
    ContactComponent,
    AddcontactClientComponent,
    UpdatecontactClientComponent,
    MesdossiersComponent,
    PageNotAutoriserComponent,
    GestionDossierComponent,
    FilialeClientComponent,
    AjoutFilialeClientComponent,
    ModifFilialeClientComponent,
    DossierIntermediaireComponent,
    DossierRdvComponent,
    GestionPoliceComponent,
    AddPoliceComponent,
    UpdatePoliceComponent,
    ClientAttenteComponent,
    ConsultationComponent,
    DetailClientComponent,
    GestionPropositionComponent,
    AjoutComponent,
    ModifComponent,
    GestionEncaissementComponent,
    AjoutEncaissementComponent,
    GestionEngagementsComponent,
    GestionFacturesComponent,
    PoliceComponent,
    GestionActeComponent,
    GestionClauseComponent,
    AddClauseComponent,
    GestionQuittanceComponent,
    ConsultationGestionProductionComponent,
    ConsultationEncaissementComponent,
    AnnulerFactureComponent,
    ConsultationEmissionComponent,
    AddEngagementComponent,
    Client360Component,
    AnnulerEncaissementComponent,
    AddActeComponent,
    PayerCommissionsComponent,
    ReemetreFactureComponent,
    ListeCommissionComponent,
    AddClauseacteComponent,
    ConsultationEmissionAnnuleeComponent,
    GestionMainleveComponent,
    AddMainleveComponent,
    ModifMainleveComponent,
    ConsultationProductionComponent,
    ConsultationEncaissementAnnuleComponent,
    ListMainleveComponent,
    ImprimerFactureComponent,
    GestionArbitrageComponent,
    GestionAgrementComponent,
    AjoutAgrementComponent,
    GestionCreditExportComponent,
    AjoutCreditExportComponent,
    ListeValideComponent,
    ViewPdfComponent,
    ConsultationParamGeneralComponent,
    AjoutPoliceComponent,
    AjoutLotComponent,
    ViewPoliceComponent,
    AjoutAcheteurComponent,
    OuvertureCompteComponent,
    DemandeCautionComponent,
    MailRdvComponent,
    TestCompteComponent,
    ProspectAttenteComponent,
    UpdateProspectAttenteComponent,
    ArbitragePhysiqueComponent,
    TransformerProspectEnClientComponent,
    ProspectTransformerComponent,
    ArbitrageSocieteComponent,
    ListdemsocValideComponent,
    ModifPoliceComponent,
    ModifEngagementComponent,
    OuvertureComptephComponent,
    OuvertureComptesocComponent,
    GestionSureteDepositComponent,
    AddSureteComponent,
    UpdateSureteComponent,
    AddSurete2Component,
    LiberationDepositComponent,
    TestGoogleMapsComponent,
    RealisationDepositComponent,
    LiberationTFComponent,
    RealisationTFComponent,
    LiberationCautionSolidaireComponent,
    RealisationCautionSolidaireComponent,
    ConsultationPoliceComponent,
    LiberationAutresSuretesComponent,
    RealisationAutresSuretesComponent,
    VoirPdfComponent,
    VoirpdfComponent,
    VoirpdfSocieteComponent,
    VoirpdfPhysiqueComponent,
    CocherdocPhysiqueComponent,
    CocherdocSocieteComponent,
    TestExportComponent,
    ConsultationProspectComponent,
    DeclarationMenaceSinistreComponent,
    DeclarationSinistreComponent,
    GestionAcheteursComponent,
    ModifAcheteurComponent,
    OtherUpdateComponent,
    OtherAcheteurComponent,
    AddDeclarationMenaceSinistreComponent,
    ConsultationGestionSinistreComponent,
    ConsultationSinistreComponent,
    ConsultationComponent,
    ConsultationSinistraliteComponent,
    ViewDeclarationMenaceSinistreComponent,
    AddDeclarationSinistreComponent,
    ViewDeclarationSinistreComponent,
    StaticInstructionComponent,
    ConsultationSinistraliteComponent,
    UpdataAcheteurComponent,
    PropositionRecoursComponent,
    ListeSinistreComponent,
    ListeMenaceSinistreComponent,
    ValidationRecoursComponent,
    ModificationEvaluationComponent,
    ModificationSapComponent,
    AnnulationPropositionComponent,
    AnnulationValidationRecoursComponent,
    ValidationRecoursEncaisseComponent,
    AnnulationRecoursEncaisseComponent,
    GestionReglementComponent,
    PropositionReglementComponent,
    ValidationReglementComponent,
    AnnulationPropositionReglementComponent,
    AnnulationValidationReglementComponent,
    ListeMouvementComponent,
    InstructionStaticComponent,
    ClotureSinistreComponent,
    ReouvrirSinistreComponent,
    OuvrirSinistreComponent,
    ModificationMenaceSinistreComponent,
    DeclarationSinistreDeLaMenaceComponent,
    ViewReglementComponent,
    ListeSinistreRecoursComponent,
    AddMoratoireComponent,
    ModifierMoratoireComponent,
    AnnulerMoratoireComponent,
    EncaisserMoratoireComponent,
    AddPenaliteComponent,
    EncaisserPenaliteComponent,
    ViewEncaissementRecoursComponent,
    ViewPropositionRecoursComponent,
    ViewEncaissementRecoursComponent,
    InstructionStaticComponent,
    StaticInstructionCreditComponent,
    StaticInstructionPerteComponent,
    AllInstructionsComponent,
    ImprimerFactureautresComponent,
    ImprimerFacturecmtComponent,
    InstructionStaticCreditComponent,
    InstructionStaticPerteComponent,
    ActeCautionComponent,
    ActeCreditComponent,
    ActePerteComponent,
    ViewClotureSinistreComponent,
    ViewReouvrirSinistreComponent,
    ActeLocassurComponent,
    CautionActeComponent,
    CreditActeComponent,
    PerteActeComponent,
    EncaissementRecoursComponent,
    AnnulationEncaissementRecoursComponent,
    EncaissementMoratoirePenaliteComponent,
    AddDocumentSinistreComponent,
    TraitementPeriodiqueComponent,
    TraitementMensuelComponent,
    TraitementJournalierComponent,
    GestionFinancierReglementComponent,
    AnnulationEncaissementReglementComponent,
    DetailsReglementFinancierComponent,
    ReglementFinancierComponent,
    ChoixTypeReglementComponent,
    ListeMouvementEvaluationComponent,
    ListeMouvementSapComponent,
    ListeMouvementPropositionReglementComponent,
    ListeMouvementValidationReglementComponent,
    ListeMouvementPropositionRecoursComponent,
    ListeMouvementValidationRecoursComponent,
    ListeMouvementEncaissementRecoursComponent,
    ViewReglementFinancierComponent,
    ListeReglementFinancierComponent,
    DetailsListeReglementFinancierComponent,
    ParametrageDateComptableComponent,
    AddDateComptableComponent,
    UpdateDateComptableComponent,
    ConsultationEngagementComponent,
    GestionBanqueComponent,
    AddBanqueComponent,
    UpdateBanqueComponent,
    FactureAnnulerComponent,
    GestionPleinsComponent,
    AddPleinsComponent,
    UpdatePleinsComponent,
    EncaissementAnnulerComponent,
    ViewModificationEvaluationComponent,
    ViewModificationSapComponent,
    GestionBeneficiairesComponent,
    GestionTiersDebiteursComponent,
    TraitementAnnuelComponent,
    AnnulationReglementFinancierComponent,
    ConsultationBrancheComponent,
    ConsultationCategorieComponent,
    ConsultationProduitComponent,
    ConsultationIntermediaireComponent,
    ConsultationCompagnieComponent,
    ConsultationReassureurComponent,
    GestionClientRepriseComponent,
    ModifClientRepriseComponent,
    FactureProductionComponent,
    PoliceRepriseComponent,
    AddAcheteurComponent,
    AddPolice2Component,
    AjoutAcheteur2Component,
    AjoutLot2Component,
    AjoutEncaissementAvoirComponent
  ],
})
export class HomeModule {
  constructor(
    private translate: TranslateService,
  ) {
    // Gets Default language from browser if available, otherwise set English ad default
    this.translate.addLangs(['en', 'fr']);
    this.translate.setDefaultLang('fr');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr/) ? browserLang : 'fr');
    console.log('traduction');
  }
}
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
