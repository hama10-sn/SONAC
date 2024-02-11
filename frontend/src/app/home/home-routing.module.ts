import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { ExempleComponent } from '../exemple/exemple.component';
import { ProfilComponent } from './profil/profil.component';
import { GestionUtilisateurComponent } from './gestion-utilisateur/gestion-utilisateur.component';
import { FilialeComponent } from './parametrage/parametrage-general/filiale/filiale.component';
import { TypageComponent } from './parametrage/parametrage-systeme/typage/typage.component';
import { RoleComponent } from './gestion-utilisateur/gestion_role/role/role.component';
import { FonctionnaliteComponent } from './gestion-utilisateur/gestion_role/fonctionnalite/fonctionnalite.component';
import { GroupeComponent } from './parametrage/parametrage-general/groupe/groupe.component';
import { GestionPaysComponent } from './parametrage/parametrage-general/gestion-pays/gestion-pays.component';
import { GestionCategorieComponent } from './parametrage/parametrage-general/gestion-categorie/gestion-categorie.component';
import { GestionReassureurComponent } from './parametrage/parametrage-general/gestion-reassureur/gestion-reassureur.component';
import { GestionCiviliteComponent } from './parametrage/parametrage-general/gestion-civilite/gestion-civilite.component';
import { GestionCimacompagnieComponent } from './parametrage/parametrage-general/gestion-cimacompagnie/gestion-cimacompagnie.component';
import { GestionBrancheComponent } from './parametrage/parametrage-general/gestion-branche/gestion-branche.component';
import { GestionProduitComponent } from './parametrage/parametrage-general/gestion-produit/gestion-produit.component';
import { GestionAccessoireComponent } from './parametrage/parametrage-systeme/gestion-accessoire/gestion-accessoire.component';
import { GestionCategorieSocioprofessionnelleComponent } from './parametrage/parametrage-systeme/gestion-categorie-socioprofessionnelle/gestion-categorie-socioprofessionnelle.component';
import { GestionCommissionComponent } from './parametrage/parametrage-systeme/gestion-commission/gestion-commission.component';
import { CompagnieComponent } from './parametrage/parametrage-general/compagnie/compagnie.component';
import { TaxeComponent } from './parametrage/parametrage-general/taxe/taxe.component';
import { AjoutCompagnieComponent } from './parametrage/parametrage-general/compagnie/ajout-compagnie/ajout-compagnie.component';
import { ModifCompagnieComponent } from './parametrage/parametrage-general/compagnie/modif-compagnie/modif-compagnie.component';
import { AjoutTaxeComponent } from './parametrage/parametrage-general/taxe/ajout-taxe/ajout-taxe.component';
import { ModifTaxeComponent } from './parametrage/parametrage-general/taxe/modif-taxe/modif-taxe.component';
import { AgendaComponent } from './agenda/agenda.component';
import { AjoutUtilisateurComponent } from './gestion-utilisateur/ajout-utilisateur/ajout-utilisateur.component';
import { AjoutGroupeComponent } from './parametrage/parametrage-general/groupe/ajout-groupe/ajout-groupe.component';
import { ModifUtilisateurComponent } from './gestion-utilisateur/modif-utilisateur/modif-utilisateur.component';
import { ReassureurComponent } from './parametrage/parametrage-general/gestion-reassureur/reassureur/reassureur.component';
import { GestionIntermediaireComponent } from './parametrage/parametrage-general/gestion-intermediaire/gestion-intermediaire.component';
import { AddIntermediaireComponent } from './parametrage/parametrage-general/gestion-intermediaire/add-intermediaire/add-intermediaire.component';
import { ModifGroupeComponent } from './parametrage/parametrage-general/groupe/modif-groupe/modif-groupe.component';
import { DemandePhysiqueComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-physique/demande-physique.component';
import { AjoutPhysiqueComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-physique/ajout-physique/ajout-physique.component';
import { DemandeSocieteComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-societe/demande-societe.component';
import { AjoutSocieteComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-societe/ajout-societe/ajout-societe.component';
import { GestionContactComponent } from './gestion-commerciale/gestion-portefeuille/gestion-contact/gestion-contact.component';
import { AjoutContactComponent } from './gestion-commerciale/gestion-portefeuille/gestion-contact/ajout-contact/ajout-contact.component';
import { ModifContactComponent } from './gestion-commerciale/gestion-portefeuille/gestion-contact/modif-contact/modif-contact.component';
import { UpdateIntermediaireComponent } from './parametrage/parametrage-general/gestion-intermediaire/update-intermediaire/update-intermediaire.component';
import { AjoutFilialeComponent } from './parametrage/parametrage-general/filiale/ajout-filiale/ajout-filiale.component';
import { ModifFilialeComponent } from './parametrage/parametrage-general/filiale/modif-filiale/modif-filiale.component';
import { AddCategorieSocioprofessionnelleComponent } from './parametrage/parametrage-systeme/gestion-categorie-socioprofessionnelle/add-categorie-socioprofessionnelle/add-categorie-socioprofessionnelle.component';
import { UpdateCategorieSocioprofessionnelleComponent } from './parametrage/parametrage-systeme/gestion-categorie-socioprofessionnelle/update-categorie-socioprofessionnelle/update-categorie-socioprofessionnelle.component';
import { AddBrancheComponent } from './parametrage/parametrage-general/gestion-branche/add-branche/add-branche.component';
import { UpdateBrancheComponent } from './parametrage/parametrage-general/gestion-branche/update-branche/update-branche.component';
import { AddAccessoireComponent } from './parametrage/parametrage-systeme/gestion-accessoire/add-accessoire/add-accessoire.component';
import { UpdateAccessoireComponent } from './parametrage/parametrage-systeme/gestion-accessoire/update-accessoire/update-accessoire.component';
import { AddCommissionComponent } from './parametrage/parametrage-systeme/gestion-commission/add-commission/add-commission.component';
import { UpdateCommissionComponent } from './parametrage/parametrage-systeme/gestion-commission/update-commission/update-commission.component';
import { AddProduitComponent } from './parametrage/parametrage-general/gestion-produit/add-produit/add-produit.component';
import { UpdateProduitComponent } from './parametrage/parametrage-general/gestion-produit/update-produit/update-produit.component';
import { GestionProspectComponent } from './gestion-commerciale/gestion-portefeuille/gestion-prospect/gestion-prospect.component';
import { AddProspectComponent } from './gestion-commerciale/gestion-portefeuille/gestion-prospect/add-prospect/add-prospect.component';
import { UpdateProspectComponent } from './gestion-commerciale/gestion-portefeuille/gestion-prospect/update-prospect/update-prospect.component';
import { GestionClientComponent } from './gestion-commerciale/gestion-portefeuille/gestion-client/gestion-client.component';
import { AjoutClientComponent } from './gestion-commerciale/gestion-portefeuille/gestion-client/ajout-client/ajout-client.component';
import { ModifClientComponent } from './gestion-commerciale/gestion-portefeuille/gestion-client/modif-client/modif-client.component';
import { ModifReassureurComponent } from './parametrage/parametrage-general/gestion-reassureur/modif-reassureur/modif-reassureur.component';
import { AjoutPaysComponent } from './parametrage/parametrage-general/gestion-pays/ajout-pays/ajout-pays.component';
import { ModifPaysComponent } from './parametrage/parametrage-general/gestion-pays/modif-pays/modif-pays.component';
import { AjoutCategorieComponent } from './parametrage/parametrage-general/gestion-categorie/ajout-categorie/ajout-categorie.component';
import { ModifCategorieComponent } from './parametrage/parametrage-general/gestion-categorie/modif-categorie/modif-categorie.component';
import { EspaceClientComponent } from './espace-client/espace-client.component';
import { SimulerTarificationComponent } from './espace-client/simuler-tarification/simuler-tarification.component';
import { GestionDevisComponent } from './gestion-commerciale/gestion-portefeuille/gestion-devis/gestion-devis.component';
import { AjoutDevisComponent } from './gestion-commerciale/gestion-portefeuille/gestion-devis/ajout-devis/ajout-devis.component';
import { ModifDevisComponent } from './gestion-commerciale/gestion-portefeuille/gestion-devis/modif-devis/modif-devis.component';
import { ContactComponent } from './gestion-commerciale/gestion-portefeuille/gestion-client/contact/contact.component';
import { AddcontactClientComponent } from './gestion-commerciale/gestion-portefeuille/gestion-client/contact/addcontact-client/addcontact-client.component';
import { UpdatecontactClientComponent } from './gestion-commerciale/gestion-portefeuille/gestion-client/contact/updatecontact-client/updatecontact-client.component';
import { MesdossiersComponent } from './espace-client/mesdossiers/mesdossiers.component';
import { PageNotAutoriserComponent } from './page-not-autoriser/page-not-autoriser.component';
import { GestionDossierComponent } from './gestion-commerciale/gestion-portefeuille/gestion-dossier/gestion-dossier.component';
import { FilialeClientComponent } from './parametrage/parametrage-general/filiale-client/filiale-client.component';
import { AjoutFilialeClientComponent } from './parametrage/parametrage-general/filiale-client/ajout-filiale-client/ajout-filiale-client.component';
import { ModifFilialeClientComponent } from './parametrage/parametrage-general/filiale-client/modif-filiale-client/modif-filiale-client.component';
import { DossierIntermediaireComponent } from './parametrage/parametrage-general/gestion-intermediaire/dossier-intermediaire/dossier-intermediaire.component';
import { DossierRdvComponent } from './agenda/dossier-rdv/dossier-rdv.component';
import { AjoutRdvComponent } from './agenda/ajout-rdv/ajout-rdv.component';
import { MailRdvComponent } from './agenda/mail-rdv/mail-rdv/mail-rdv.component';
import { ModifRdvComponent } from './agenda/modif-rdv/modif-rdv.component';
import { ClientAttenteComponent } from './gestion-commerciale/gestion-portefeuille/gestion-client/client-attente/client-attente.component';
import { ConsultationComponent } from './gestion-commerciale/consultation/consultation.component';
import { DetailClientComponent } from './gestion-commerciale/gestion-portefeuille/gestion-client/detail-client/detail-client.component';
import { GestionPropositionComponent } from './gestion-production/gestion-proposition/gestion-proposition.component';
import { AjoutComponent } from './gestion-production/gestion-proposition/ajout/ajout.component';
import { ModifComponent } from './gestion-production/gestion-proposition/modif/modif.component';
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
// import { GestionQuittanceComponent } from './gestion-production/gestion-quittance/gestion-quittance.component';
import { ConsultationEmissionComponent } from './gestion-production/consultation-gestion-production/consultation-emission/consultation-emission.component';
import { GestionClauseComponent } from './gestion-production/gestion-clause/gestion-clause.component';
import { AddClauseComponent } from './gestion-production/gestion-clause/add-clause/add-clause.component';
import { AnnulerFactureComponent } from './gestion-production/gestion-factures/annuler-facture/annuler-facture.component';
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
import { ArbitragePhysiqueComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-physique/arbitrage-physique/arbitrage-physique.component';
import { GestionArbitrageComponent } from './gestion-arbitrage/gestion-arbitrage.component';
import { GestionAgrementComponent } from './gestion-arbitrage/gestion-agrement/gestion-agrement.component';
import { AjoutAgrementComponent } from './gestion-arbitrage/gestion-agrement/ajout-agrement/ajout-agrement.component';
import { GestionCreditExportComponent } from './gestion-arbitrage/gestion-credit-export/gestion-credit-export.component';
import { AjoutCreditExportComponent } from './gestion-arbitrage/gestion-credit-export/ajout-credit-export/ajout-credit-export.component';
import { ListeValideComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-physique/liste-valide/liste-valide.component';
import { ViewPdfComponent } from './gestion-commerciale/gestion-portefeuille/gestion-dossier/view-pdf/view-pdf.component';
import { ConsultationParamGeneralComponent } from './parametrage/parametrage-general/consultation-param-general/consultation-param-general.component';
import { AjoutPoliceComponent } from './gestion-production/police/gestion-police/ajout-police/ajout-police.component';
import { ViewPoliceComponent } from './gestion-production/police/gestion-police/view-police/view-police.component';
import { OuvertureCompteComponent } from './gestion-commerciale/gestion-portefeuille/ouverture-compte/ouverture-compte.component';
import { DemandeCautionComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-caution/demande-caution.component';
import { TestCompteComponent } from './gestion-commerciale/gestion-portefeuille/test-compte/test-compte.component';
import { ArbitrageSocieteComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-societe/arbitrage-societe/arbitrage-societe.component';
import { ListdemsocValideComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-societe/listdemsoc-valide/listdemsoc-valide.component';
import { ProspectAttenteComponent } from './gestion-commerciale/gestion-portefeuille/gestion-prospect/prospect-attente/prospect-attente.component';
import { UpdateProspectAttenteComponent } from './gestion-commerciale/gestion-portefeuille/gestion-prospect/prospect-attente/update-prospect-attente/update-prospect-attente.component';
import { TransformerProspectEnClientComponent } from './gestion-commerciale/gestion-portefeuille/gestion-prospect/transformer-prospect-en-client/transformer-prospect-en-client.component';
import { ProspectTransformerComponent } from './gestion-commerciale/gestion-portefeuille/gestion-prospect/prospect-transformer/prospect-transformer.component';
import { ModifPoliceComponent } from './gestion-production/modif-police/modif-police.component';
import { ModifEngagementComponent } from './gestion-production/gestion-engagements/modif-engagement/modif-engagement.component';
import { OuvertureComptephComponent } from './gestion-commerciale/gestion-portefeuille/ouverture-compteph/ouverture-compteph.component';
import { OuvertureComptesocComponent } from './gestion-commerciale/gestion-portefeuille/ouverture-comptesoc/ouverture-comptesoc.component';
import { GestionSureteDepositComponent } from './gestion-production/gestion-surete-deposit/gestion-surete-deposit.component';
import { UpdateSureteComponent } from './gestion-production/gestion-surete-deposit/update-surete/update-surete.component';
import { AddSureteComponent } from './gestion-production/gestion-surete-deposit/add-surete/add-surete.component';
import { AddSurete2Component } from './gestion-production/gestion-surete-deposit/add-surete2/add-surete2.component';
import { LiberationDepositComponent } from './gestion-production/gestion-surete-deposit/gestion-deposit/liberation-deposit/liberation-deposit.component';
import { TestGoogleMapsComponent } from './gestion-production/gestion-surete-deposit/test-google-maps/test-google-maps.component';
import { RealisationDepositComponent } from './gestion-production/gestion-surete-deposit/gestion-deposit/realisation-deposit/realisation-deposit.component';
import { LiberationTFComponent } from './gestion-production/gestion-surete-deposit/gestion-titre-foncier/liberation-tf/liberation-tf.component';
import { RealisationTFComponent } from './gestion-production/gestion-surete-deposit/gestion-titre-foncier/realisation-tf/realisation-tf.component';
import { LiberationCautionSolidaireComponent } from './gestion-production/gestion-surete-deposit/gestion-caution-solidaire/liberation-caution-solidaire/liberation-caution-solidaire.component';
import { RealisationCautionSolidaireComponent } from './gestion-production/gestion-surete-deposit/gestion-caution-solidaire/realisation-caution-solidaire/realisation-caution-solidaire.component';
import { ConsultationPoliceComponent } from './gestion-production/consultation-gestion-production/consultation-police/consultation-police.component';
import { LiberationAutresSuretesComponent } from './gestion-production/gestion-surete-deposit/gestion-autres-suretes/liberation-autres-suretes/liberation-autres-suretes.component';
import { VoirPdfComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-physique/voir-pdf/voir-pdf.component';
import { TestExportComponent } from './gestion-commerciale/gestion-portefeuille/test-export/test-export.component';
import { VoirpdfPhysiqueComponent } from './gestion-commerciale/gestion-portefeuille/voirpdf-physique/voirpdf-physique.component';
import { CocherdocPhysiqueComponent } from './gestion-commerciale/gestion-portefeuille/cocherdoc-physique/cocherdoc-physique.component';
import { CocherdocSocieteComponent } from './gestion-commerciale/gestion-portefeuille/cocherdoc-societe/cocherdoc-societe.component';
import { ConsultationProspectComponent } from './gestion-commerciale/consultation/consultation-prospect/consultation-prospect.component';
import { DeclarationMenaceSinistreComponent } from './gestion-sinistre/declaration-menace-sinistre/declaration-menace-sinistre.component';
import { DeclarationSinistreComponent } from './gestion-sinistre/declaration-sinistre/declaration-sinistre.component';
import { GestionAcheteursComponent } from './gestion-tiers/gestion-acheteurs/gestion-acheteurs.component';
import { ModifAcheteurComponent } from './gestion-tiers/gestion-acheteurs/modif-acheteur/modif-acheteur.component';
import { OtherUpdateComponent } from './gestion-production/gestion-factures/other-update/other-update.component';
import { AddDeclarationMenaceSinistreComponent } from './gestion-sinistre/declaration-menace-sinistre/add-declaration-menace-sinistre/add-declaration-menace-sinistre.component';
import { ConsultationGestionSinistreComponent } from './gestion-sinistre/consultation-gestion-sinistre/consultation-gestion-sinistre.component';
import { ConsultationSinistreComponent } from './gestion-sinistre/consultation-gestion-sinistre/consultation-sinistre/consultation-sinistre.component';
import { ViewDeclarationMenaceSinistreComponent } from './gestion-sinistre/declaration-menace-sinistre/view-declaration-menace-sinistre/view-declaration-menace-sinistre.component';
import { AddDeclarationSinistreComponent } from './gestion-sinistre/declaration-sinistre/add-declaration-sinistre/add-declaration-sinistre.component';
import { ViewDeclarationSinistreComponent } from './gestion-sinistre/declaration-sinistre/view-declaration-sinistre/view-declaration-sinistre.component';
import { StaticInstructionComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-societe/static-instruction/static-instruction.component';
import { UpdataAcheteurComponent } from './gestion-tiers/gestion-acheteurs/updata-acheteur/updata-acheteur.component';
import { ListeSinistreComponent } from './gestion-sinistre/liste-sinistre/liste-sinistre.component';
import { PropositionRecoursComponent } from './gestion-sinistre/proposition-recours/proposition-recours.component';
import { ListeMenaceSinistreComponent } from './gestion-sinistre/liste-menace-sinistre/liste-menace-sinistre.component';
import { ConsultationSinistraliteComponent } from './gestion-sinistre/consultation-gestion-sinistre/consultation-sinistralite/consultation-sinistralite.component';
import { ValidationRecoursComponent } from './gestion-sinistre/validation-recours/validation-recours.component';
import { AnnulationPropositionComponent } from './gestion-sinistre/annulation-proposition/annulation-proposition.component';
import { AnnulationValidationRecoursComponent } from './gestion-sinistre/annulation-validation-recours/annulation-validation-recours.component';
import { ValidationRecoursEncaisseComponent } from './gestion-sinistre/validation-recours-encaisse/validation-recours-encaisse.component';
import { AnnulationRecoursEncaisseComponent } from './gestion-sinistre/annulation-recours-encaisse/annulation-recours-encaisse.component';
import { ModificationEvaluationComponent } from './gestion-sinistre/modification-evaluation/modification-evaluation.component';
import { ModificationSapComponent } from './gestion-sinistre/modification-sap/modification-sap.component';
import { PropositionReglementComponent } from './gestion-sinistre/gestion-reglement/proposition-reglement/proposition-reglement.component';
import { ValidationReglementComponent } from './gestion-sinistre/gestion-reglement/validation-reglement/validation-reglement.component';
import { AnnulationPropositionReglementComponent } from './gestion-sinistre/gestion-reglement/annulation-proposition-reglement/annulation-proposition-reglement.component';
import { AnnulationValidationReglementComponent } from './gestion-sinistre/gestion-reglement/annulation-validation-reglement/annulation-validation-reglement.component';
import { ImprimerFactureautresComponent } from './gestion-production/gestion-factures/imprimer-factureautres/imprimer-factureautres.component';
import { InstructionStaticComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-physique/instruction-static/instruction-static.component';
import { StaticInstructionCreditComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-societe/static-instruction-credit/static-instruction-credit.component';
import { StaticInstructionPerteComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/demande-societe/static-instruction-perte/static-instruction-perte.component';
import { AllInstructionsComponent } from './gestion-commerciale/gestion-portefeuille/gestion-demande/all-instructions/all-instructions.component';
import { ViewPropositionRecoursComponent } from './gestion-sinistre/proposition-recours/view-proposition-recours/view-proposition-recours.component';
import { ViewEncaissementRecoursComponent } from './gestion-sinistre/validation-recours-encaisse/view-encaissement-recours/view-encaissement-recours.component';
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
import { TraitementMensuelComponent } from './gestion-sinistre/traitement-periodique/traitement-mensuel/traitement-mensuel.component';
// import { TraitementJournalierComponent } from './gestion-comptable/traitement-periodique/traitement-journalier/traitement-journalier.component';
import { GestionFinancierReglementComponent } from './gestion-comptable/gestion-financier-reglement/gestion-financier-reglement.component';
import { AnnulationEncaissementReglementComponent } from './gestion-comptable/gestion-financier-reglement/annulation-encaissement-reglement/annulation-encaissement-reglement.component';
import { DetailsReglementFinancierComponent } from './gestion-comptable/gestion-financier-reglement/details-reglement-financier/details-reglement-financier.component';
import { ListeMouvementComponent } from './gestion-sinistre/liste-mouvement/liste-mouvement.component';
import { ListeMouvementEvaluationComponent } from './gestion-sinistre/liste-mouvement/liste-mouvement-evaluation/liste-mouvement-evaluation.component';
import { ListeMouvementSapComponent } from './gestion-sinistre/liste-mouvement/liste-mouvement-sap/liste-mouvement-sap.component';
import { ListeMouvementPropositionReglementComponent } from './gestion-sinistre/liste-mouvement/liste-mouvement-proposition-reglement/liste-mouvement-proposition-reglement.component';
import { ListeMouvementValidationReglementComponent } from './gestion-sinistre/liste-mouvement/liste-mouvement-validation-reglement/liste-mouvement-validation-reglement.component';
import { ListeMouvementPropositionRecoursComponent } from './gestion-sinistre/liste-mouvement/liste-mouvement-proposition-recours/liste-mouvement-proposition-recours.component';
import { ListeMouvementEncaissementRecoursComponent } from './gestion-sinistre/liste-mouvement/liste-mouvement-encaissement-recours/liste-mouvement-encaissement-recours.component';
import { ListeMouvementValidationRecoursComponent } from './gestion-sinistre/liste-mouvement/liste-mouvement-validation-recours/liste-mouvement-validation-recours.component';
import { ListeReglementFinancierComponent } from './gestion-comptable/gestion-financier-reglement/liste-reglement-financier/liste-reglement-financier.component';
import { ViewReglementFinancierComponent } from './gestion-comptable/gestion-financier-reglement/view-reglement-financier/view-reglement-financier.component';
import { ReglementFinancierComponent } from './gestion-comptable/gestion-financier-reglement/reglement-financier/reglement-financier.component';
import { ChoixTypeReglementComponent } from './gestion-comptable/gestion-financier-reglement/choix-type-reglement/choix-type-reglement.component';
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
import { TraitementAnnuelComponent } from './gestion-sinistre/traitement-periodique/traitement-annuel/traitement-annuel.component';
import { TraitementJournalierComponent } from './gestion-sinistre/traitement-periodique/traitement-journalier/traitement-journalier.component';
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
import { AddPolice2Component } from './gestion-production/police-reprise/add-police2/add-police2.component';
import { AjoutEncaissementAvoirComponent } from './gestion-production/gestion-encaissement/ajout-encaissement-avoir/ajout-encaissement-avoir.component';


const routes: Routes = [{
  path: '',
  component: HomeComponent,
  children: [
    {
      path: 'exemple',
      component: ExempleComponent,
      pathMatch: 'full',
    },
    {
      path: 'exemple',
      component: ExempleComponent,
      pathMatch: 'full',
    },
    {
      path: 'typage',
      component: TypageComponent,
      pathMatch: 'full',
    },
    {
      path: 'role',
      component: RoleComponent,
      pathMatch: 'full',
    },
    {
      path: 'fonctionnalite',
      component: FonctionnaliteComponent,
      pathMatch: 'full',
    },
    {
      path: 'filiale',
      component: FilialeComponent,
      pathMatch: 'full',
    },
    {
      path: 'filiale_Client',
      component: FilialeClientComponent,
      pathMatch: 'full',
    },
    {
      path: 'filiale/ajout',
      component: AjoutFilialeComponent,
      pathMatch: 'full',
    },
    {
      path: 'filiale_Client/ajout',
      component: AjoutFilialeClientComponent,
      pathMatch: 'full',
    },
    {
      path: 'filiale/update',
      component: ModifFilialeComponent,
      pathMatch: 'full',
    },
    {
      path: 'filiale_Client/update',
      component: ModifFilialeClientComponent,
      pathMatch: 'full',
    },

    {
      path: 'gestion_utilisateur',
      component: GestionUtilisateurComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion_utilisateur/ajout',
      component: AjoutUtilisateurComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion_utilisateur/modif',
      component: ModifUtilisateurComponent,
      pathMatch: 'full',
    },
    {
      path: 'groupe',
      component: GroupeComponent,
      pathMatch: 'full',
    },
    {
      path: 'groupe/ajout',
      component: AjoutGroupeComponent,
      pathMatch: 'full',
    },
    {
      path: 'groupe/modif',
      component: ModifGroupeComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion_pays',
      component: GestionPaysComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion_pays/ajout',
      component: AjoutPaysComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion_pays/modif',
      component: ModifPaysComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion_categorie',
      component: GestionCategorieComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion_categorie/ajout',
      component: AjoutCategorieComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion_categorie/modif',
      component: ModifCategorieComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion_reassureur',
      component: GestionReassureurComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion_reassureur/modif',
      component: ModifReassureurComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage/parametrage-general/gestion-reassureur/reassureur',
      component: ReassureurComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion_civilite',
      component: GestionCiviliteComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion_cimacompagnie',
      component: GestionCimacompagnieComponent,
      pathMatch: 'full',
    },
    {
      path: 'profil',
      component: ProfilComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-general/branches',
      component: GestionBrancheComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-general/branches/ajout',
      component: AddBrancheComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-general/branches/modif',
      component: UpdateBrancheComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-general/produits',
      component: GestionProduitComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-general/produits/ajout',
      component: AddProduitComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-general/produits/modif',
      component: UpdateProduitComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-general/intermediaires',
      component: GestionIntermediaireComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-general/intermediaires/ajout',
      component: AddIntermediaireComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-general/intermediaires/modif',
      component: UpdateIntermediaireComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-general/consultation',
      component: ConsultationParamGeneralComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-general/consultation/branche',
      component: ConsultationBrancheComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-general/consultation/categorie',
      component: ConsultationCategorieComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-general/consultation/produit',
      component: ConsultationProduitComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-general/consultation/intermediaire',
      component: ConsultationIntermediaireComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-general/consultation/compagnie',
      component: ConsultationCompagnieComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-general/consultation/reassureur',
      component: ConsultationReassureurComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-systeme/categorie-socioprofessionnelle',
      component: GestionCategorieSocioprofessionnelleComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-systeme/categorie-socioprofessionnelle/ajout',
      component: AddCategorieSocioprofessionnelleComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-systeme/categorie-socioprofessionnelle/modif',
      component: UpdateCategorieSocioprofessionnelleComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-systeme/accessoire',
      component: GestionAccessoireComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-systeme/accessoire/ajout',
      component: AddAccessoireComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-systeme/accessoire/modif',
      component: UpdateAccessoireComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-systeme/commission',
      component: GestionCommissionComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-systeme/commission/ajout',
      component: AddCommissionComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-systeme/commission/modif',
      component: UpdateCommissionComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-general/compagnie',
      component: CompagnieComponent,
      pathMatch: 'full',
    },
    {
      path: 'compagnie/modif',
      component: ModifCompagnieComponent,
      pathMatch: 'full',
    },
    {
      path: 'compagnie/ajout',
      component: AjoutCompagnieComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-general/taxe',
      component: TaxeComponent,
      pathMatch: 'full',
    },

    {
      path: 'taxe/ajout',
      component: AjoutTaxeComponent,
      pathMatch: 'full',
    },

    {
      path: 'taxe/modif',
      component: ModifTaxeComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-client',
      component: GestionClientComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-client/ajout',
      component: AjoutClientComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-client/modif',
      component: ModifClientComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-client/client-attente',
      component: ClientAttenteComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-client/detailclient',
      component: DetailClientComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-client/client360',
      component: Client360Component,
      pathMatch: 'full',
    },
    {
      path: 'gestion-prospect/ouverturecompte',
      component: OuvertureCompteComponent,
      pathMatch: 'full',
    },

    {
      path: 'gestion-prospect/testcompte',
      component: TestCompteComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-contact',
      component: GestionContactComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-contact/ajout',
      component: AjoutContactComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-contact/modif',
      component: ModifContactComponent,
      pathMatch: 'full',
    },
    {
      path: 'contact',
      component: ContactComponent,
      pathMatch: 'full',
    },
    {
      path: 'contact/add',
      component: AddcontactClientComponent,
      pathMatch: 'full',
    },
    {
      path: 'contact/update',
      component: UpdatecontactClientComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-Instruction',
      component: AllInstructionsComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-Physique',
      component: DemandePhysiqueComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-Physique/ajout-Physique',
      component: AjoutPhysiqueComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-Physique/liste-demande-valide',
      component: ListeValideComponent,
      pathMatch: 'full',
    },
    {

      path: 'demande-Physique/demande-caution',
      component: DemandeCautionComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-Physique/arbitrage-Physique',
      component: ArbitragePhysiqueComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-Physique/instruction-static',
      component: InstructionStaticComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-Physique/instruction-static-credit',
      component: InstructionStaticCreditComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-Physique/instruction-static-perte',
      component: InstructionStaticPerteComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-Physique/caution-acte',
      component: CautionActeComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-Physique/credit-acte',
      component: CreditActeComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-Physique/perte-acte',
      component: PerteActeComponent,
      pathMatch: 'full',
    },
    {
      path: 'ouverture-compte/Physique',
      component: OuvertureComptephComponent,
      pathMatch: 'full',
    },
    {
      path: 'ouverture-compte/Physique',
      component: OuvertureComptephComponent,
      pathMatch: 'full',
    },
    {
      path: 'ouverture-compte/societe',
      component: OuvertureComptesocComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-commerciale/consultation',
      component: ConsultationComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-commerciale/consultation/consultation-prospect',
      component: ConsultationProspectComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-commerciale/gestion-portefeuille/prospects',
      component: GestionProspectComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-commerciale/gestion-portefeuille/prospects/ajout',
      component: AddProspectComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-commerciale/gestion-portefeuille/prospects/modif',
      component: UpdateProspectComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-prospect/prospect-attente',
      component: ProspectAttenteComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-prospect/prospect-attente/modif',
      component: UpdateProspectAttenteComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-commerciale/gestion-portefeuille/transformer-prospect',
      component: TransformerProspectEnClientComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-commerciale/gestion-portefeuille/prospects-transformes',
      component: ProspectTransformerComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-societe',
      component: DemandeSocieteComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-societe/static-instruction',
      component: StaticInstructionComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-societe/static-instruction-credit',
      component: StaticInstructionCreditComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-societe/static-instruction-perte',
      component: StaticInstructionPerteComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-societe/acte-caution',
      component: ActeCautionComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-societe/acte-credit',
      component: ActeCreditComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-societe/acte-perte',
      component: ActePerteComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-societe/acte-locassur',
      component: ActeLocassurComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-societe/ajout-Societe',
      component: AjoutSocieteComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-Societe/arbitrage-Societe',
      component: ArbitrageSocieteComponent,
      pathMatch: 'full',
    },
    {
      path: 'demande-Societe/liste-demande-valide',
      component: ListdemsocValideComponent,
      pathMatch: 'full',
    },
    {
      path: 'agenda',
      component: AgendaComponent,
      pathMatch: 'full',
    },
    {
      path: 'agenda/ajout',
      component: AjoutRdvComponent,
      pathMatch: 'full',
    },
    {
      path: 'agenda/modif',
      component: ModifRdvComponent,
      pathMatch: 'full',
    },
    {
      path: 'agenda/mail',
      component: MailRdvComponent,
      pathMatch: 'full',
    },
    {
      path: 'dossier-agenda',
      component: DossierRdvComponent,
      pathMatch: 'full',
    },
    {
      path: 'espace-client',
      component: EspaceClientComponent,
      pathMatch: 'full',
    },
    {
      path: 'espace-client/simuler-tarification',
      component: SimulerTarificationComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage/parametrage-general/gestion-reassureur/reassureur',
      component: ReassureurComponent,
      pathMatch: 'full',
    },
    {
      path: 'devis',
      component: GestionDevisComponent,
      pathMatch: 'full',
    },
    {
      path: 'devis/ajout',
      component: AjoutDevisComponent,
      pathMatch: 'full',
    },
    {
      path: 'devis/modif',
      component: ModifDevisComponent,
      pathMatch: 'full',
    },
    {
      path: 'espace-client/mesdossiers',
      component: MesdossiersComponent,
      pathMatch: 'full',
    },
    {
      path: 'dossiers',
      component: GestionDossierComponent,
      pathMatch: 'full',
    },
    {
      path: 'dossiers-intermediaire',
      component: DossierIntermediaireComponent,
      pathMatch: 'full',
    },

    {
      path: 'notautoriser',
      component: PageNotAutoriserComponent,
      pathMatch: 'full',
    },

    {
      path: '',
      redirectTo: 'exemple',
      pathMatch: 'full',
    },

    {
      path: 'parametrage-production/police',
      component: GestionPoliceComponent,
      pathMatch: 'full',
    },

    {
      path: 'search/policeclient',
      component: PoliceComponent,
      pathMatch: 'full',
    },
    

    {
      path: 'search-reprise/policeclient',
      component: PoliceRepriseComponent,
      pathMatch: 'full',
    },

    {
      path: 'parametrage-production/police/ajout',
      component: AddPoliceComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-proposition',
      component: GestionPropositionComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-proposition/modif',
      component: ModifComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-proposition/ajout',
      component: AjoutComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-production/police/modif',
      component: UpdatePoliceComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-encaissement',
      component: GestionEncaissementComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-comptabilite/gestion-encaissement',
      component: GestionEncaissementComponent,
      pathMatch: 'full',
    },
    {
      path: 'ajout-encaissement',
      component: AjoutEncaissementComponent,
      pathMatch: 'full',
    },
    {
      path: 'ajout-encaissement-avoir',
      component: AjoutEncaissementAvoirComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-engagement',
      component: GestionEngagementsComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-engagement/add-engagement',
      component: AddEngagementComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-engagement/modif-engagement',
      component: ModifEngagementComponent,
      pathMatch: 'full',
    },

    {
      path: 'engagement/consultation-engagement',
      component: ConsultationEngagementComponent,
      pathMatch: 'full'
    },

    {
      path: 'gestion-facture',
      component: GestionFacturesComponent,
      pathMatch: 'full',
    },

    {
      path: 'gestion-acte',
      component: GestionActeComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-acte/add-acte',
      component: AddActeComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-clause',
      component: GestionClauseComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-clause/add',
      component: AddClauseComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-quittance',
      component: GestionQuittanceComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-production/consultation',
      component: ConsultationGestionProductionComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-production/consultation/consultation-encaissement',
      component: ConsultationEncaissementComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-production/consultation/consultation-encaissement/encaissement-annule',
      component: ConsultationEncaissementAnnuleComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-production/consultation/consultation-emission',
      component: ConsultationEmissionComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-production/consultation/consultation-emission/emission-annulee',
      component: ConsultationEmissionAnnuleeComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-production/consultation/consultation-production',
      component: ConsultationProductionComponent,
      pathMatch: 'full',
    },
    // {
    //   path: 'gestion-production/consultation/consultation-production/production-annulee',
    //   component: ConsultationProductionAnnuleeComponent,
    //   pathMatch: 'full',
    // },
    {
      path: 'gestion-production/consultation/consultation-police',
      component: ConsultationPoliceComponent,
      pathMatch: 'full',
    },
    {
      path: 'annuler-facture',
      component: AnnulerFactureComponent,
      pathMatch: 'full',
    },
    {
      path: 'facture-annuler',
      component: FactureAnnulerComponent,
      pathMatch: 'full',
    },    
    {
      path: 'facture-production',
      component: FactureProductionComponent,
      pathMatch: 'full',
    },
    {
      path: 'annuler-encaissement',
      component: AnnulerEncaissementComponent,
      pathMatch: 'full',
    },
    {
      path: 'encaissement-annuler',
      component: EncaissementAnnulerComponent,
      pathMatch: 'full',
    },
    {

      path: 'payer-commissions',
      component: PayerCommissionsComponent,
      pathMatch: 'full',
    },
    {
      path: 'reemettre-facture',
      component: ReemetreFactureComponent,
      pathMatch: 'full',
    },
    {
      path: 'other-update',
      component: OtherUpdateComponent,
      pathMatch: 'full',
    },
    {
      path: 'liste-commissions',
      component: ListeCommissionComponent,
      pathMatch: 'full',
    },
    {
      path: 'affecter-clause',
      component: AddClauseacteComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-mainleve',
      component: GestionMainleveComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-mainleve/add-mainleve',
      component: AddMainleveComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-mainleve/modif-mainleve',
      component: ModifMainleveComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-mainleve/list-mainleve',
      component: ListMainleveComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion_arbitrage',
      component: GestionArbitrageComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion_agrement',
      component: GestionAgrementComponent,
      pathMatch: 'full',
    },
    {
      path: 'ajout_agrement',
      component: AjoutAgrementComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion_export',
      component: GestionCreditExportComponent,
      pathMatch: 'full',
    },
    {
      path: 'ajout_export',
      component: AjoutCreditExportComponent,
      pathMatch: 'full',
    },
    {
      path: 'viewpdf',
      component: ViewPdfComponent,
      pathMatch: 'full',
    },
    {
      path: 'voirPhysiquePdf',
      component: VoirpdfPhysiqueComponent,
      pathMatch: 'full',
    },
    {
      path: 'cocherPhysiqueDoc',
      component: CocherdocPhysiqueComponent,
      pathMatch: 'full',
    },
    {
      path: 'cocherSocieteDoc',
      component: CocherdocSocieteComponent,
      pathMatch: 'full',
    },
    {
      path: 'voirpdf',
      component: VoirPdfComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-production/police/ajout-police',
      component: AjoutPoliceComponent,
      pathMatch: 'full',
    },
    {
      path: 'reprise-production/police/ajout-police',
      component: AddPolice2Component,
      pathMatch: 'full',
    },
    {
      path: 'parametrage-production/police/view-police',
      component: ViewPoliceComponent,
      pathMatch: 'full',
    },
    {
      path: 'modif-police',
      component: ModifPoliceComponent,
      pathMatch: 'full',
    },
    {
      path: 'engagement/gestion-surete-deposit',
      component: GestionSureteDepositComponent,
      pathMatch: 'full',
    },
    {
      path: 'engagement/gestion-surete-deposit/add-surete',
      component: AddSureteComponent,
      pathMatch: 'full',
    },
    {
      path: 'engagement/gestion-surete-deposit/add-surete2',
      component: AddSurete2Component,
      pathMatch: 'full',
    },
    {
      path: 'engagement/gestion-surete-deposit/update-surete',
      component: UpdateSureteComponent,
      pathMatch: 'full',
    },
    {
      path: 'engagement/gestion-surete-deposit/liberation-tf',
      component: LiberationTFComponent,
      pathMatch: 'full',
    },
    {
      path: 'engagement/gestion-surete-deposit/realisation-tf',
      component: RealisationTFComponent,
      pathMatch: 'full',
    },
    {
      path: 'engagement/gestion-surete-deposit/liberation-deposit',
      component: LiberationDepositComponent,
      pathMatch: 'full',
    },
    {
      path: 'engagement/gestion-surete-deposit/realisation-deposit',
      component: RealisationDepositComponent,
      pathMatch: 'full',
    },
    {
      path: 'engagement/gestion-surete-deposit/liberation-caution-solidaire',
      component: LiberationCautionSolidaireComponent,
      pathMatch: 'full',
    },
    {
      path: 'engagement/gestion-surete-deposit/realisation-caution-solidaire',
      component: RealisationCautionSolidaireComponent,
      pathMatch: 'full',
    },
    {
      path: 'engagement/gestion-surete-deposit/liberation-autres-suretes',
      component: LiberationAutresSuretesComponent,
      pathMatch: 'full',
    },
    {
      path: 'engagement/gestion-surete-deposit/test-google-maps',
      component: TestGoogleMapsComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/declaration-menace-sinistre',
      component: DeclarationMenaceSinistreComponent,
      // component: AddDeclarationMenaceSinistreComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/declaration-menace-sinistre/ajout',
      component: AddDeclarationMenaceSinistreComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/declaration-menace-sinistre/view',
      component: ViewDeclarationMenaceSinistreComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/declaration-sinistre',
      component: DeclarationSinistreComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/declaration-sinistre/ajout',
      component: AddDeclarationSinistreComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/declaration-sinistre/view',
      component: ViewDeclarationSinistreComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/declaration-sinistre/add-documents',
      component: AddDocumentSinistreComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/liste-sinistre',
      component: ListeSinistreComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/liste-menace-sinistre',
      component: ListeMenaceSinistreComponent,
      pathMatch: 'full',
    },
    {
      path: 'test-export',
      component: TestExportComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-acheteurs',
      component: GestionAcheteursComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-tiers/gestion-beneficiaires',
      component: GestionBeneficiairesComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-tiers/gestion-tiers-debiteurs',
      component: GestionTiersDebiteursComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-acheteurs/modif-acheteurs',
      component: ModifAcheteurComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-acheteurs/update-acheteurs',
      component: UpdataAcheteurComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/proposition-recours',
      component: PropositionRecoursComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/view-proposition-recours',
      component: ViewPropositionRecoursComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/validation-recours',
      component: ValidationRecoursComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/annulation-proposition',
      component: AnnulationPropositionComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/annulation-validation-recours',
      component: AnnulationValidationRecoursComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/validation-recours-encaisse',
      component: ValidationRecoursEncaisseComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/veiw-encaissement-recours',
      component: ViewEncaissementRecoursComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/annulation-recours-encaisse',
      component: AnnulationRecoursEncaisseComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/liste-mouvement',
      component: ListeMouvementComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/liste-mouvement/liste-mouvement-evaluation',
      component: ListeMouvementEvaluationComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/liste-mouvement/liste-mouvement-sap',
      component: ListeMouvementSapComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/liste-mouvement/liste-mouvement-proposition-reglement',
      component: ListeMouvementPropositionReglementComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/liste-mouvement/liste-mouvement-reglement-valide',
      component: ListeMouvementValidationReglementComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/liste-mouvement/liste-mouvement-proposition-recours',
      component: ListeMouvementPropositionRecoursComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/liste-mouvement/liste-mouvement-recours-valide',
      component: ListeMouvementValidationRecoursComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/liste-mouvement/liste-mouvement-recours-encaisse',
      component: ListeMouvementEncaissementRecoursComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/consultation',
      component: ConsultationGestionSinistreComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/consultation/consultation-sinistre',
      component: ConsultationSinistreComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/consultation/consultation-sinistralite',
      component: ConsultationSinistraliteComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-sinistre/traitement-periodique',
      component: TraitementPeriodiqueComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/traitement-periodique/traitement-journalier',
      component: TraitementJournalierComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/traitement-periodique/traitement-mensuel',
      component: TraitementMensuelComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/traitement-periodique/traitement-annuel',
      component: TraitementAnnuelComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/modification-evaluation',
      component: ModificationEvaluationComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/modification-evaluation/view',
      component: ViewModificationEvaluationComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/modification-sap',
      component: ModificationSapComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/modification-sap/view',
      component: ViewModificationSapComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/gestion-reglement/proposition-reglement',
      component: PropositionReglementComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/gestion-reglement/validation-reglement',
      component: ValidationReglementComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/gestion-reglement/annulation-proposition-reglement',
      component: AnnulationPropositionReglementComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/gestion-reglement/annulation-validation-reglement',
      component: AnnulationValidationReglementComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/gestion-reglement/view-reglement',
      component: ViewReglementComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/cloture-sinistre',
      component: ClotureSinistreComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/view-cloture-sinistre',
      component: ViewClotureSinistreComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/reouvrir-sinistre',
      component: ReouvrirSinistreComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/ouvrir-sinistre',
      component: OuvrirSinistreComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/view-reouvrir-sinistre',
      component: ViewReouvrirSinistreComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/liste-menace-sinistre/modification-menace-sinistre',
      component: ModificationMenaceSinistreComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-sinistre/liste-menace-sinistre/declaration-sinistre',
      component: DeclarationSinistreDeLaMenaceComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-moratoire/liste-sinistre-recours',
      component: ListeSinistreRecoursComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-moratoire/ajouter-moratoire',
      component: AddMoratoireComponent,
      pathMatch: "full"
    },
    {
      path: 'gestion-moratoire/modifier-moratoire',
      component: ModifierMoratoireComponent,
      pathMatch: "full"
    },
    {
      path: 'gestion-moratoire/annuler-moratoire',
      component: AnnulerMoratoireComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-moratoire/encaisser-moratoire',
      component: EncaisserMoratoireComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-moratoire/ajouter-penalite',
      component: AddPenaliteComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-moratoire/encaisser-penalite',
      component: EncaisserPenaliteComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-comptable/gestion-reglement-financier',
      component: GestionFinancierReglementComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-comptable/gestion-reglement-financier/choix-type-reglement',
      component: ChoixTypeReglementComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-comptable/gestion-reglement-financier/reglement-financier',
      component: ReglementFinancierComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-comptable/gestion-reglement-financier/view-reglement-financier',
      component: ViewReglementFinancierComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-comptable/gestion-reglement-financier/annulation-reglement-financier',
      component: AnnulationReglementFinancierComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-comptable/gestion-reglement-financier/details',
      component: DetailsReglementFinancierComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-comptable/gestion-reglement-financier/liste-reglement-financier',
      component: ListeReglementFinancierComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-comptable/gestion-reglement-financier/liste-reglement-financier/details',
      component: DetailsListeReglementFinancierComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-comptable/encaissement-recours',
      component: EncaissementRecoursComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-comptable/annulation-encaissement-recours',
      component: AnnulationEncaissementRecoursComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-comptable/encaissement-moratoire-penalite',
      component: EncaissementMoratoirePenaliteComponent,
      pathMatch: 'full'
    },
    {
      path: 'gestion-comptable/traitement-periodique/traitement-journalier',
      // component: TraitementJournalierComponent,
      pathMatch: 'full'
    },
    {
      path: 'Imprimer-Facture',
      component: ImprimerFactureautresComponent,
      pathMatch: 'full'
    },
    {
      path: 'parametrage-comptable/parametrage-date-comptable',
      component: ParametrageDateComptableComponent,
      pathMatch: 'full'
    },
    {
      path: 'parametrage-comptable/parametrage-date-comptable/add-date-comptable',
      component: AddDateComptableComponent,
      pathMatch: 'full'
    },
    {
      path: 'parametrage-comptable/parametrage-date-comptable/update-date-comptable',
      component: UpdateDateComptableComponent,
      pathMatch: 'full'
    },
    {
      path: 'parametrage/parametrage-comptable/gestion-banque',
      component: GestionBanqueComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage/parametrage-comptable/gestion-banque/add-banque',
      component: AddBanqueComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage/parametrage-comptable/gestion-banque/update-banque',
      component: UpdateBanqueComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage/parametrage-comptable/gestion-pleins',
      component: GestionPleinsComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage/parametrage-comptable/gestion-pleins/add-pleins',
      component: AddPleinsComponent,
      pathMatch: 'full',
    },
    {
      path: 'parametrage/parametrage-comptable/gestion-pleins/update-pleins',
      component: UpdatePleinsComponent,
      pathMatch: 'full',
    },

    // ============================== POUR CORRECTION DE LA REPRISE ==========================
    {
      path: 'reprise/gestion-client-reprise',
      component: GestionClientRepriseComponent,
      pathMatch: 'full',
    },
    {
      path: 'gestion-client-reprise/modif',
      component: ModifClientRepriseComponent,
      pathMatch: 'full',
    },

    // ============================== FIN ==========================
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {
}
