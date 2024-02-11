package sn.jmad.sonac.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.design.JasperDesign;
import net.sf.jasperreports.engine.xml.JRXmlLoader;
import sn.jmad.sonac.message.response.PropositionReglementFront;
import sn.jmad.sonac.message.response.ReglementFinancier;
import sn.jmad.sonac.message.response.ReglementFront;
import sn.jmad.sonac.message.response.SinistreFront;
import sn.jmad.sonac.message.response.SinistreMouvement;
import sn.jmad.sonac.message.response.ValidationReglementFront;
import sn.jmad.sonac.model.Acheteur;
import sn.jmad.sonac.model.Banque;
import sn.jmad.sonac.model.Beneficiaire;
import sn.jmad.sonac.model.Branche;
import sn.jmad.sonac.model.Client;
import sn.jmad.sonac.model.Mvtsinistre;
import sn.jmad.sonac.model.Produit;
import sn.jmad.sonac.model.Recours;
import sn.jmad.sonac.model.Reglement;
import sn.jmad.sonac.model.Sinistre;
import sn.jmad.sonac.repository.AcheteurRepository;
import sn.jmad.sonac.repository.BanqueRepository;
import sn.jmad.sonac.repository.BeneficiaireRepository;
import sn.jmad.sonac.repository.BrancheRepository;
import sn.jmad.sonac.repository.ClientRepository;
import sn.jmad.sonac.repository.MvtsinistreRepository;
import sn.jmad.sonac.repository.ProduitRepository;
import sn.jmad.sonac.repository.ReglementRepository;
import sn.jmad.sonac.repository.SinistreRepository;
import sn.jmad.sonac.service.constantes.FrenchNumberToWords;
import sn.jmad.sonac.service.constantes.ParamConst;

@Service
public class ReglementService {

	private Long typeMvtPropositionReglement = 5L;
	private Long typeMvtValidationPropositionReglement = 6L;
	private Long typeMvtAnnulationPropositionReglement = 7L;
	private Long typeMvtAnnulationValidationPropositionReglement = 8L;
	private Long typeMvtReglementFinancier = 19L;

	// Les types de reglement
	private Long reglementPrincipal = 1L;
	private Long reglementFrais = 2L;
	private Long reglementHonoraires = 3L;
	private Long reglementPrincipalEtFrais = 4L;
	private Long reglementPrincipalEtHonoraires = 5L;
	private Long reglementFraisEtHonoraires = 6L;
	private Long reglementGlobal = 7L;

	// Les status de mouvements
	private int mvtStatutActif = 1;
	private int mvtStatutComptabilise = 2;
	private int mvtStatutAnnuler = 3;
	private int mvtStatutAcompte = 4;
	private int mvtStatutSolde = 5;

	private int brancheCaution = 15;

	@Autowired
	private MvtsinistreRepository mvtsinistreRepository;

	@Autowired
	private SinistreRepository sinistreRepository;

	@Autowired
	private ReglementRepository reglementRepository;

	@Autowired
	private BeneficiaireRepository beneficiaireRepository;

	@Autowired
	private AcheteurRepository acheteurRepository;

	@Autowired
	private ClientRepository clientRepository;

	@Autowired
	private BrancheRepository brancheRepository;

	@Autowired
	private ProduitRepository produitRepository;

	@Autowired
	private BanqueRepository banqueRepository;

	@Transactional(rollbackFor = Exception.class)
	public PropositionReglementFront propositionReglementSinistre(ReglementFront reglementFront) {

		Mvtsinistre mvtsinistreFront = reglementFront.getMvtsinistreForm();

		mvtsinistreFront.setMvts_montantmvt(mvtsinistreFront.getMvts_montantprincipal()
				+ mvtsinistreFront.getMvts_montantfrais() + mvtsinistreFront.getMvts_montanthonoraire());
		mvtsinistreFront.setMvts_montantfinancier(0L);
		mvtsinistreFront.setMvts_montantfinancierprincipal(0L);
		mvtsinistreFront.setMvts_montantfinancierfrais(0L);
		mvtsinistreFront.setMvts_montantfinancierhonoraires(0L);
		mvtsinistreFront.setMvts_status(mvtStatutActif);
		mvtsinistreFront.setMvts_datemvt(new Date());
		mvtsinistreFront.setMvts_datemodification(new Date());
//		mvtsinistreFront.setMvts_datecomptabilisation(new Date());
		mvtsinistreFront.setMvts_datesaisie(new Date());
		mvtsinistreFront.setMvts_typemvt(typeMvtPropositionReglement);
		Mvtsinistre mvtsinistreRegelementSaved = mvtsinistreRepository.save(mvtsinistreFront);

		// On met à jour le status du sinistre correspondant
		Sinistre sinistreUpdated = sinistreRepository.findSinistreByNumero(mvtsinistreFront.getMvts_numsinistre());
		sinistreUpdated.setSini_status(typeMvtPropositionReglement);

		Sinistre sinistreUpdatedSaved = sinistreRepository.save(sinistreUpdated);

		PropositionReglementFront propositionReglement = new PropositionReglementFront(sinistreUpdatedSaved,
				mvtsinistreRegelementSaved);
		return propositionReglement;
	}

	@Transactional(rollbackFor = Exception.class)
	public PropositionReglementFront validationPropositionReglementSinistre(ReglementFront reglementFront) {

		Mvtsinistre mvtsinistreFront = reglementFront.getMvtsinistreForm();

//		mvtsinistreFront.setMvts_num(mvtsinistreFront.getMvts_id()); // Pour vider le numero de mvt
		mvtsinistreFront.setMvts_montantfinancier(0L);
		mvtsinistreFront.setMvts_montantfinancierprincipal(0L);
		mvtsinistreFront.setMvts_montantfinancierfrais(0L);
		mvtsinistreFront.setMvts_montantfinancierhonoraires(0L);
		mvtsinistreFront.setMvts_status(mvtStatutActif);
		mvtsinistreFront.setMvts_datemvt(new Date());
		mvtsinistreFront.setMvts_datemodification(new Date());
//		mvtsinistreFront.setMvts_datecomptabilisation(new Date());
		mvtsinistreFront.setMvts_datesaisie(new Date());
		mvtsinistreFront.setMvts_typemvt(typeMvtValidationPropositionReglement);
		Mvtsinistre mvtsinistreValidationReglementSaved = mvtsinistreRepository.save(mvtsinistreFront);

		// ================ On met à jour maintenant le sinistre correspondant =======
		Sinistre sinistreUpdated = sinistreRepository.findSinistreByNumero(mvtsinistreFront.getMvts_numsinistre());

		sinistreUpdated.setSini_reglementprincipal(sinistreUpdated.getSini_reglementprincipal()
				+ mvtsinistreValidationReglementSaved.getMvts_montantprincipal());
		sinistreUpdated.setSini_reglementfrais(
				sinistreUpdated.getSini_reglementfrais() + mvtsinistreValidationReglementSaved.getMvts_montantfrais());
		sinistreUpdated.setSini_reglementhonoraires(sinistreUpdated.getSini_reglementhonoraires()
				+ mvtsinistreValidationReglementSaved.getMvts_montanthonoraire());
		sinistreUpdated.setSini_reglementglobal(sinistreUpdated.getSini_reglementprincipal()
				+ sinistreUpdated.getSini_reglementfrais() + sinistreUpdated.getSini_reglementhonoraires());

		sinistreUpdated.setSini_sapprincipale(sinistreUpdated.getSini_sapprincipale()
				- mvtsinistreValidationReglementSaved.getMvts_montantprincipal());
		sinistreUpdated.setSini_sapfrais(
				sinistreUpdated.getSini_sapfrais() - mvtsinistreValidationReglementSaved.getMvts_montantfrais());
		sinistreUpdated.setSini_saphonoraires(sinistreUpdated.getSini_saphonoraires()
				- mvtsinistreValidationReglementSaved.getMvts_montanthonoraire());
		sinistreUpdated.setSini_sapglobale(sinistreUpdated.getSini_sapprincipale() + sinistreUpdated.getSini_sapfrais()
				+ sinistreUpdated.getSini_saphonoraires());

		sinistreUpdated.setSini_status(mvtsinistreValidationReglementSaved.getMvts_typemvt());

		Sinistre sinistreValidationReglementMAJ = sinistreRepository.save(sinistreUpdated);

		PropositionReglementFront validationReglementFront = new PropositionReglementFront(
				sinistreValidationReglementMAJ, mvtsinistreValidationReglementSaved);

		return validationReglementFront;
	}

	@Transactional(rollbackFor = Exception.class)
	public ValidationReglementFront annulationPropositionReglementSinistre(ReglementFront reglementFront) {

		Mvtsinistre mvtsinistreFront = reglementFront.getMvtsinistreForm();

		/*
		 * Reglement reglementRecuperer =
		 * reglementRepository.findReglementByNumeroSinistreAndMvt(
		 * mvtsinistreFront.getMvts_numsinistre(), mvtsinistreFront.getMvts_num());
		 */

		mvtsinistreFront.setMvts_num(mvtsinistreFront.getMvts_id()); // Pour vider le numero de mvt
		mvtsinistreFront.setMvts_typemvt(typeMvtAnnulationPropositionReglement);
		mvtsinistreFront.setMvts_status(mvtStatutAnnuler);
		mvtsinistreFront.setMvts_dateannulation(new Date());
		Mvtsinistre mvtsinistreAnnulationPropositionRegelementSaved = mvtsinistreRepository.save(mvtsinistreFront);

		// ========== UPDATE REGLEMENT ==================

		/*
		 * reglementRecuperer.setRegl_nummvt(
		 * mvtsinistreAnnulationPropositionRegelementSaved.getMvts_num());
		 * reglementRecuperer.setRegl_status(
		 * mvtsinistreAnnulationPropositionRegelementSaved.getMvts_typemvt());
		 * reglementRecuperer
		 * .setRegl_codeutilisateur(mvtsinistreAnnulationPropositionRegelementSaved.
		 * getMvts_codeutilisateur()); reglementRecuperer.setRegl_datemodification(new
		 * Date()); reglementRecuperer.setActive(0);
		 * 
		 * reglementRecuperer.setRegl_status(
		 * mvtsinistreAnnulationPropositionRegelementSaved.getMvts_typemvt());
		 * reglementRecuperer.setRegl_datemodification(new Date()); Reglement
		 * reglementAnnulationPropositionSaved =
		 * reglementRepository.save(reglementRecuperer);
		 */

		// ================ On met à jour maintenant le sinistre correspondant
		// ===================
		Sinistre sinistreUpdated = sinistreRepository.findSinistreByNumero(mvtsinistreFront.getMvts_numsinistre());
		sinistreUpdated.setSini_status(mvtsinistreAnnulationPropositionRegelementSaved.getMvts_typemvt());

		Sinistre sinistreAnnulationPropositionReglementMAJ = sinistreRepository.save(sinistreUpdated);

		ValidationReglementFront annulationPropositionReglementFront = new ValidationReglementFront(null,
				mvtsinistreAnnulationPropositionRegelementSaved, sinistreAnnulationPropositionReglementMAJ);
		return annulationPropositionReglementFront;
	}

	@Transactional(rollbackFor = Exception.class)
	public ValidationReglementFront annulationReglementValiderSinistre(ReglementFront reglementFront) {

		Mvtsinistre mvtsinistreFront = reglementFront.getMvtsinistreForm();

		Reglement reglementRecuperer = reglementRepository.findReglementByNumeroSinistreAndMvt(
				mvtsinistreFront.getMvts_numsinistre(), mvtsinistreFront.getMvts_num());

		mvtsinistreFront.setMvts_num(mvtsinistreFront.getMvts_id()); // Pour vider le numero de mvt
		mvtsinistreFront.setMvts_typemvt(typeMvtAnnulationValidationPropositionReglement);
		mvtsinistreFront.setMvts_status(mvtStatutAnnuler);
		Mvtsinistre mvtsinistreSaved = mvtsinistreRepository.save(mvtsinistreFront);

		// ========== UPDATE REGLEMENT ==================

		reglementRecuperer.setRegl_nummvt(mvtsinistreSaved.getMvts_num());
		reglementRecuperer.setRegl_status(mvtsinistreSaved.getMvts_typemvt());
		reglementRecuperer.setRegl_codeutilisateur(mvtsinistreSaved.getMvts_codeutilisateur());
		reglementRecuperer.setRegl_datemodification(new Date());
		reglementRecuperer.setActive(0);

		Reglement reglementUpdated = reglementRepository.save(reglementRecuperer);

		// ================ On met à jour maintenant le sinistre correspondant =======
		Sinistre sinistreUpdated = sinistreRepository.findSinistreByNumero(mvtsinistreFront.getMvts_numsinistre());

		sinistreUpdated.setSini_sapprincipale(
				sinistreUpdated.getSini_sapprincipale() + sinistreUpdated.getSini_reglementprincipal());
		sinistreUpdated.setSini_sapfrais(sinistreUpdated.getSini_sapfrais() + sinistreUpdated.getSini_reglementfrais());
		sinistreUpdated.setSini_saphonoraires(
				sinistreUpdated.getSini_saphonoraires() + sinistreUpdated.getSini_reglementhonoraires());
		sinistreUpdated.setSini_sapglobale(sinistreUpdated.getSini_sapprincipale() + sinistreUpdated.getSini_sapfrais()
				+ sinistreUpdated.getSini_saphonoraires());
		sinistreUpdated.setSini_reglementprincipal(
				sinistreUpdated.getSini_reglementprincipal() - mvtsinistreSaved.getMvts_montantprincipal());
		sinistreUpdated.setSini_reglementfrais(
				sinistreUpdated.getSini_reglementfrais() - mvtsinistreSaved.getMvts_montantfrais());
		sinistreUpdated.setSini_reglementhonoraires(
				sinistreUpdated.getSini_reglementhonoraires() - mvtsinistreSaved.getMvts_montanthonoraire());
		sinistreUpdated.setSini_reglementglobal(
				sinistreUpdated.getSini_reglementglobal() - mvtsinistreSaved.getMvts_montantmvt());

		sinistreUpdated.setSini_status(mvtsinistreSaved.getMvts_typemvt());

		Sinistre sinistreAnnulationReglementValideMAJ = sinistreRepository.save(sinistreUpdated);

		ValidationReglementFront annulationReglementValideFront = new ValidationReglementFront(reglementUpdated,
				mvtsinistreSaved, sinistreAnnulationReglementValideMAJ);
		return annulationReglementValideFront;
	}

	@Transactional(rollbackFor = Exception.class)
	public ReglementFinancier reglementFinancierSinistre(ReglementFinancier reglementFinancierFront) {

		Sinistre sinistreFront = reglementFinancierFront.getSinistreForm();

		Mvtsinistre mvtsinistreFront = reglementFinancierFront.getMvtsinistreForm();

		Reglement reglementFormFront = reglementFinancierFront.getReglementForm();

		Long typeReglementFront = reglementFinancierFront.getTypeReglement();

		/*
		 * Récupérer le mouvement de reglement technique validé et MAJ du status
		 */

		Mvtsinistre mvtsinistreRecuperer = mvtsinistreRepository
				.findMvtsinistreByNumero(mvtsinistreFront.getMvts_num());
		if (typeReglementFront == reglementPrincipal) {
			mvtsinistreRecuperer.setMvts_montantfinancier(
					mvtsinistreRecuperer.getMvts_montantfinancier() + mvtsinistreFront.getMvts_montantprincipal());

			mvtsinistreRecuperer.setMvts_montantfinancierprincipal(mvtsinistreFront.getMvts_montantprincipal());
			System.out.println("=========== Reglement principal : " + typeReglementFront);

		} else if (typeReglementFront == reglementFrais) {
			mvtsinistreRecuperer.setMvts_montantfinancier(
					mvtsinistreRecuperer.getMvts_montantfinancier() + mvtsinistreFront.getMvts_montantfrais());

			mvtsinistreRecuperer.setMvts_montantfinancierfrais(mvtsinistreFront.getMvts_montantfrais());
			System.out.println("=========== Reglement frais : " + typeReglementFront);

		} else if (typeReglementFront == reglementHonoraires) {
			mvtsinistreRecuperer.setMvts_montantfinancier(
					mvtsinistreRecuperer.getMvts_montantfinancier() + mvtsinistreFront.getMvts_montanthonoraire());

			mvtsinistreRecuperer.setMvts_montantfinancierhonoraires(mvtsinistreFront.getMvts_montanthonoraire());
			System.out.println("=========== Reglement honoraires : " + typeReglementFront);

		} else if (typeReglementFront == reglementPrincipalEtFrais) {
			mvtsinistreRecuperer.setMvts_montantfinancier(mvtsinistreRecuperer.getMvts_montantfinancier()
					+ mvtsinistreFront.getMvts_montantprincipal() + mvtsinistreFront.getMvts_montantfrais());

			mvtsinistreRecuperer.setMvts_montantfinancierprincipal(mvtsinistreFront.getMvts_montantprincipal());
			mvtsinistreRecuperer.setMvts_montantfinancierfrais(mvtsinistreFront.getMvts_montantfrais());
			System.out.println("=========== Reglement Principal et Frais : " + typeReglementFront);

		} else if (typeReglementFront == reglementPrincipalEtHonoraires) {
			mvtsinistreRecuperer.setMvts_montantfinancier(mvtsinistreRecuperer.getMvts_montantfinancier()
					+ mvtsinistreFront.getMvts_montantprincipal() + mvtsinistreFront.getMvts_montanthonoraire());

			mvtsinistreRecuperer.setMvts_montantfinancierprincipal(mvtsinistreFront.getMvts_montantprincipal());
			mvtsinistreRecuperer.setMvts_montantfinancierhonoraires(mvtsinistreFront.getMvts_montanthonoraire());
			System.out.println("=========== Reglement Principal et honoraires : " + typeReglementFront);

		} else if (typeReglementFront == reglementFraisEtHonoraires) {
			mvtsinistreRecuperer.setMvts_montantfinancier(mvtsinistreRecuperer.getMvts_montantfinancier()
					+ mvtsinistreFront.getMvts_montantfrais() + mvtsinistreFront.getMvts_montanthonoraire());

			mvtsinistreRecuperer.setMvts_montantfinancierfrais(mvtsinistreFront.getMvts_montantfrais());
			mvtsinistreRecuperer.setMvts_montantfinancierhonoraires(mvtsinistreFront.getMvts_montanthonoraire());
			System.out.println("=========== Reglement Frais et honoraires : " + typeReglementFront);

		} else if (typeReglementFront == reglementGlobal) {
			mvtsinistreRecuperer.setMvts_montantfinancier(mvtsinistreFront.getMvts_montantprincipal()
					+ mvtsinistreFront.getMvts_montantfrais() + mvtsinistreFront.getMvts_montanthonoraire());

			mvtsinistreRecuperer.setMvts_montantfinancierprincipal(mvtsinistreFront.getMvts_montantprincipal());
			mvtsinistreRecuperer.setMvts_montantfinancierfrais(mvtsinistreFront.getMvts_montantfrais());
			mvtsinistreRecuperer.setMvts_montantfinancierhonoraires(mvtsinistreFront.getMvts_montanthonoraire());
			System.out.println("=========== Reglement Global : " + typeReglementFront);
		}

		Long sommeMontants = mvtsinistreRecuperer.getMvts_montantprincipal()
				+ mvtsinistreRecuperer.getMvts_montantfrais() + mvtsinistreRecuperer.getMvts_montanthonoraire();

		Long montantFinancier = mvtsinistreRecuperer.getMvts_montantfinancier();

		System.out.println("=========== Somme des montants : " + sommeMontants);
		System.out.println("=========== Montant Financier : " + montantFinancier);

		if (sommeMontants.equals(montantFinancier)) {
			mvtsinistreRecuperer.setMvts_status(mvtStatutSolde);
			System.out.println("=========== SOLDE ============= ");
		} else {
			mvtsinistreRecuperer.setMvts_status(mvtStatutAcompte);
			System.out.println("=========== ACOMPTE ============= ");
		}

		Mvtsinistre mvtsinistreRecupererSaved = mvtsinistreRepository.save(mvtsinistreRecuperer);
		System.out.println("======== Le nouveau mvt de sinistre recup enreg: " + mvtsinistreRecupererSaved);

		// Enregistrer un nouveau mvt de reglement financier
		mvtsinistreFront.setMvts_num(mvtsinistreFront.getMvts_id()); // Pour vider le numero de mvt
//		mvtsinistreFront.setMvts_montantprincipal(reglementFormFront.getRegl_montantprincipal());
//		mvtsinistreFront.setMvts_montantfrais(reglementFormFront.getRegl_montantfrais());
//		mvtsinistreFront.setMvts_montanthonoraire(reglementFormFront.getRegl_montanthonoraire());

		mvtsinistreFront.setMvts_montantmvt(mvtsinistreFront.getMvts_montantprincipal()
				+ mvtsinistreFront.getMvts_montantfrais() + mvtsinistreFront.getMvts_montanthonoraire());

		mvtsinistreFront.setMvts_montantfinancier(mvtsinistreFront.getMvts_montantprincipal()
				+ mvtsinistreFront.getMvts_montantfrais() + mvtsinistreFront.getMvts_montanthonoraire());

		mvtsinistreFront.setMvts_montantfinancierprincipal(mvtsinistreFront.getMvts_montantprincipal());
		mvtsinistreFront.setMvts_montantfinancierfrais(mvtsinistreFront.getMvts_montantfrais());
		mvtsinistreFront.setMvts_montantfinancierhonoraires(mvtsinistreFront.getMvts_montanthonoraire());

		mvtsinistreFront.setMvts_status(mvtStatutActif);
		mvtsinistreFront.setMvts_datemvt(new Date());
		mvtsinistreFront.setMvts_datemodification(new Date());
		mvtsinistreFront.setMvts_datecomptabilisation(new Date());
		mvtsinistreFront.setMvts_datesaisie(new Date());
		mvtsinistreFront.setMvts_typemvt(typeMvtReglementFinancier);
		Mvtsinistre mvtSinistreSaved = mvtsinistreRepository.save(mvtsinistreFront);

		// ========== Enregistrer un reglement sinistre (Reglement financier) dans la
		// table REGLEMENT

		reglementFormFront.setRegl_numsinistre(mvtSinistreSaved.getMvts_numsinistre());
		reglementFormFront.setRegl_nummvt(mvtSinistreSaved.getMvts_num());
		reglementFormFront.setRegl_numpoli(mvtSinistreSaved.getMvts_poli());
//		reglementFormFront.setRegl_datevaleur(new Date());
		reglementFormFront.setRegl_montantprincipal(mvtSinistreSaved.getMvts_montantprincipal());
		reglementFormFront.setRegl_montantfrais(mvtSinistreSaved.getMvts_montantfrais());
		reglementFormFront.setRegl_montanthonoraire(mvtSinistreSaved.getMvts_montanthonoraire());
		reglementFormFront.setRegl_montanttotal(mvtSinistreSaved.getMvts_montantprincipal()
				+ mvtSinistreSaved.getMvts_montantfrais() + mvtSinistreSaved.getMvts_montanthonoraire());

		reglementFormFront.setRegl_beneficiaire(mvtSinistreSaved.getMvts_beneficiaire());
		reglementFormFront.setRegl_debiteur(mvtSinistreSaved.getMvts_tiers());

		reglementFormFront.setRegl_nantissement(mvtSinistreSaved.getMvts_nantissement());
		reglementFormFront.setRegl_benefnantissement(mvtSinistreSaved.getMvts_benefnantissement());
		reglementFormFront.setRegl_montantnantissement(mvtSinistreSaved.getMvts_montantnantissement());

		reglementFormFront.setRegl_status(mvtSinistreSaved.getMvts_typemvt());
		reglementFormFront.setRegl_codeutilisateur(mvtSinistreSaved.getMvts_codeutilisateur());
		reglementFormFront.setRegl_datereglement(new Date());
		reglementFormFront.setRegl_datecomptabilisation(new Date());
		reglementFormFront.setRegl_datemodification(new Date());
		reglementFormFront.setActive(1);

		Reglement reglementSaved = reglementRepository.save(reglementFormFront);

		// On met à jour le status du sinistre correspondant
		Sinistre sinistreUpdated = sinistreRepository.findSinistreByNumero(sinistreFront.getSini_num());
		sinistreUpdated.setSini_status(typeMvtReglementFinancier);
		Sinistre sinistreUpdatedSaved = sinistreRepository.save(sinistreUpdated);

		ReglementFinancier reglementFinancierSaved = new ReglementFinancier(sinistreUpdatedSaved, mvtSinistreSaved,
				reglementSaved, typeReglementFront);

		return reglementFinancierSaved;
	}

	/*
	 * Edition Fiche
	 */

	public void generateEditionFichePropositionReglement(HttpServletResponse response, String demandeur, Long sini_num,
			Long mvts_num) {
		String caractSup = "_";
		String demandeurNew = "";
		demandeurNew = demandeur.replaceAll(caractSup, " ");

//		SinistreMouvement sinmvt = sinistreRepository.getSinistreById(sini_id);
		Sinistre sinistre = sinistreRepository.findSinistreByNumero(sini_num);
		Mvtsinistre mvtsinistre = mvtsinistreRepository.findMvtsinistreByNumero(mvts_num);

		InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
				+ ParamConst.FILENAME_REPORT_PROPOSITION_REGLEMENT + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {
			design = JRXmlLoader.load(jasperStream);

			JasperReport report = JasperCompileManager.compileReport(design);

			Map<String, Object> parameterMap = new HashMap<String, Object>();

			parameterMap.put("contrat", sinistre.getSini_police());
			parameterMap.put("numeroSinistre", sinistre.getSini_num());
			parameterMap.put("dateSurvenance", sinistre.getSini_datesurvenance());
			parameterMap.put("description", sinistre.getSini_description());
			parameterMap.put("demandeur", demandeurNew);
//			parameterMap.put("compagnie", sinistre.getSini_codecompagnie());

			// Récupérer le libellé de la branche
			Branche branche = brancheRepository.findBrancheByNumero(sinistre.getSini_branche());
			if (branche != null) {
				parameterMap.put("branche", branche.getBranche_libelleLong());
			} else {
				parameterMap.put("branche", "");
			}

			// Récupéré le bénéficiaire et remplir ses informations
			Optional<Beneficiaire> beneficiaireOptional = beneficiaireRepository
					.findById(sinistre.getSini_beneficiaire());
			if (beneficiaireOptional.isPresent()) {
				Beneficiaire beneficiaire = beneficiaireOptional.get();

				if (beneficiaire != null
						&& (beneficiaire.getBenef_denom() == null || beneficiaire.getBenef_denom().equals(""))
						&& beneficiaire.getBenef_prenoms() != null && !beneficiaire.getBenef_prenoms().equals("")
						&& beneficiaire.getBenef_nom() != null && !beneficiaire.getBenef_nom().equals("")) {

					parameterMap.put("beneficiaire",
							beneficiaire.getBenef_prenoms() + " " + beneficiaire.getBenef_nom());
					parameterMap.put("beneficiaireAdresse", "");

				} else if (beneficiaire != null
						&& (beneficiaire.getBenef_denom() != null && !beneficiaire.getBenef_denom().equals(""))
						&& (beneficiaire.getBenef_prenoms() == null || beneficiaire.getBenef_prenoms().equals(""))
						&& (beneficiaire.getBenef_nom() == null || beneficiaire.getBenef_nom().equals(""))) {

					parameterMap.put("beneficiaire", beneficiaire.getBenef_denom());
					parameterMap.put("beneficiaireAdresse", "");

				} else if (beneficiaire != null
						&& (beneficiaire.getBenef_denom() != null && !beneficiaire.getBenef_denom().equals(""))
						&& beneficiaire.getBenef_prenoms() != null && !beneficiaire.getBenef_prenoms().equals("")
						&& beneficiaire.getBenef_nom() != null && !beneficiaire.getBenef_nom().equals("")) {

					parameterMap.put("beneficiaire", beneficiaire.getBenef_prenoms() + " " + beneficiaire.getBenef_nom()
							+ " / " + beneficiaire.getBenef_denom());
					parameterMap.put("beneficiaireAdresse", "");

				} else {
					parameterMap.put("beneficiaire", "");
					parameterMap.put("beneficiaireAdresse", "");
				}
			}

			// Récupérer les infos du tiers recours et les remplir
			if (sinistre.getSini_branche() == brancheCaution) {
				// Le client est le tiers recours
				Client clientTiersRecours = clientRepository.findByNumClient(sinistre.getSini_tiersrecours());

				if (clientTiersRecours != null && clientTiersRecours.getClien_denomination() == null) {

					parameterMap.put("tiersRecoursDenomination",
							clientTiersRecours.getClien_prenom() + " " + clientTiersRecours.getClien_nom());
					parameterMap.put("tiersRecoursAdresse", clientTiersRecours.getClien_adressenumero());

				} else if (clientTiersRecours != null && clientTiersRecours.getClien_prenom() == null
						&& clientTiersRecours.getClien_nom() == null) {

					parameterMap.put("tiersRecoursDenomination", clientTiersRecours.getClien_denomination());
					parameterMap.put("tiersRecoursAdresse", clientTiersRecours.getClien_adressenumero());

				} else if (clientTiersRecours != null && clientTiersRecours.getClien_prenom() != null
						&& clientTiersRecours.getClien_nom() != null
						&& clientTiersRecours.getClien_denomination() != null) {

					parameterMap.put("tiersRecoursDenomination", clientTiersRecours.getClien_prenom() + " "
							+ clientTiersRecours.getClien_nom() + " / " + clientTiersRecours.getClien_denomination());
					parameterMap.put("tiersRecoursAdresse", clientTiersRecours.getClien_adressenumero());

				} else {
					parameterMap.put("tiersRecoursDenomination", "");
					parameterMap.put("tiersRecoursAdresse", "");
				}

			} else {
				// L'acheteur est le tiers recours
				Acheteur acheteurTiersRecours = acheteurRepository.findByIdd(sinistre.getSini_tiersrecours());
				if (acheteurTiersRecours != null) {
					parameterMap.put("tiersRecoursDenomination",
							acheteurTiersRecours.getAchet_prenom() + " " + acheteurTiersRecours.getAchet_nom());

					parameterMap.put("tiersRecoursAdresse", "");
				} else {
					parameterMap.put("tiersRecoursDenomination", "");
					parameterMap.put("tiersRecoursAdresse", "");
				}
			}

			// Remplir les infos du mvt de proposition de reglement
			parameterMap.put("numeroDeclaration", mvtsinistre.getMvts_num());
			parameterMap.put("dateReglement", mvtsinistre.getMvts_datemvt());
//			parameterMap.put("numeroReglement", "");
			parameterMap.put("montantPrincipal", mvtsinistre.getMvts_montantprincipal());
			parameterMap.put("montantFrais", mvtsinistre.getMvts_montantfrais());
			parameterMap.put("montantHonoraires", mvtsinistre.getMvts_montanthonoraire());
			parameterMap.put("montantGlobal", mvtsinistre.getMvts_montantmvt());
			parameterMap.put("montantLettre", FrenchNumberToWords.convert(mvtsinistre.getMvts_montantmvt()));

			List<SinistreMouvement> sinistres = sinistreRepository.getAllSinistresMouvement();
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(sinistres);

			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
			final OutputStream outputStream = response.getOutputStream();

			response.setContentType("application/x-pdf");
			response.setHeader("Content-Disposition",
					"inline; filename=" + ParamConst.FILENAME_REPORT_PROPOSITION_REGLEMENT + ParamConst.EXTENSION_PDF);
			response.addHeader(" Access-Control-Allow-Origin ", " * ");

			JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

		} catch (JRException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void generateEditionFicheValidationReglement(HttpServletResponse response, String demandeur, Long sini_num,
			Long mvts_num) {
		String caractSup = "_";
		String demandeurNew = "";
		demandeurNew = demandeur.replaceAll(caractSup, " ");

//		SinistreMouvement sinmvt = sinistreRepository.getSinistreById(sini_id);
		Sinistre sinistre = sinistreRepository.findSinistreByNumero(sini_num);
		Mvtsinistre mvtsinistre = mvtsinistreRepository.findMvtsinistreByNumero(mvts_num);

		InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
				+ ParamConst.FILENAME_REPORT_VALIDATION_REGLEMENT + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {
			design = JRXmlLoader.load(jasperStream);

			JasperReport report = JasperCompileManager.compileReport(design);

			Map<String, Object> parameterMap = new HashMap<String, Object>();

			parameterMap.put("contrat", sinistre.getSini_police());
			parameterMap.put("numeroSinistre", sinistre.getSini_num());
			parameterMap.put("dateSurvenance", sinistre.getSini_datesurvenance());
			parameterMap.put("description", sinistre.getSini_description());
			parameterMap.put("demandeur", demandeurNew);
//			parameterMap.put("compagnie", sinistre.getSini_codecompagnie());

			// Récupérer le libellé de la branche
			Branche branche = brancheRepository.findBrancheByNumero(sinistre.getSini_branche());
			if (branche != null) {
				parameterMap.put("branche", branche.getBranche_libelleLong());
			} else {
				parameterMap.put("branche", "");
			}

			// Récupéré le bénéficiaire et remplir ses informations
//			Optional<Beneficiaire> beneficiaireOptional = beneficiaireRepository
//					.findById(sinmvt.getSini_beneficiaire());
//			if (beneficiaireOptional.isPresent()) {
//				Beneficiaire beneficiaire = beneficiaireOptional.get();
//				parameterMap.put("beneficiairePrenom", beneficiaire.getBenef_prenoms());
//				parameterMap.put("beneficiaireNom", beneficiaire.getBenef_nom());
//				parameterMap.put("beneficiaireDenomination", beneficiaire.getBenef_denom());
//				parameterMap.put("beneficiaireAdresse", "");
//			}
			Optional<Beneficiaire> beneficiaireOptional = beneficiaireRepository
					.findById(sinistre.getSini_beneficiaire());
			if (beneficiaireOptional.isPresent()) {
				Beneficiaire beneficiaire = beneficiaireOptional.get();

				if (beneficiaire != null
						&& (beneficiaire.getBenef_denom() == null || beneficiaire.getBenef_denom().equals(""))
						&& beneficiaire.getBenef_prenoms() != null && !beneficiaire.getBenef_prenoms().equals("")
						&& beneficiaire.getBenef_nom() != null && !beneficiaire.getBenef_nom().equals("")) {

					parameterMap.put("beneficiaire",
							beneficiaire.getBenef_prenoms() + " " + beneficiaire.getBenef_nom());
					parameterMap.put("beneficiaireAdresse", "");

				} else if (beneficiaire != null
						&& (beneficiaire.getBenef_denom() != null && !beneficiaire.getBenef_denom().equals(""))
						&& (beneficiaire.getBenef_prenoms() == null || beneficiaire.getBenef_prenoms().equals(""))
						&& (beneficiaire.getBenef_nom() == null || beneficiaire.getBenef_nom().equals(""))) {

					parameterMap.put("beneficiaire", beneficiaire.getBenef_denom());
					parameterMap.put("beneficiaireAdresse", "");

				} else if (beneficiaire != null
						&& (beneficiaire.getBenef_denom() != null && !beneficiaire.getBenef_denom().equals(""))
						&& beneficiaire.getBenef_prenoms() != null && !beneficiaire.getBenef_prenoms().equals("")
						&& beneficiaire.getBenef_nom() != null && !beneficiaire.getBenef_nom().equals("")) {

					parameterMap.put("beneficiaire", beneficiaire.getBenef_prenoms() + " " + beneficiaire.getBenef_nom()
							+ " / " + beneficiaire.getBenef_denom());
					parameterMap.put("beneficiaireAdresse", "");

				} else {
					parameterMap.put("beneficiaire", "");
					parameterMap.put("beneficiaireAdresse", "");
				}
			}

			// Récupérer les infos du tiers recours et les remplir
			if (sinistre.getSini_branche() == brancheCaution) {
				// Le client est le tiers recours
				Client clientTiersRecours = clientRepository.findByNumClient(sinistre.getSini_tiersrecours());

				if (clientTiersRecours != null && clientTiersRecours.getClien_denomination() == null) {

					parameterMap.put("tiersRecoursDenomination",
							clientTiersRecours.getClien_prenom() + " " + clientTiersRecours.getClien_nom());
					parameterMap.put("tiersRecoursAdresse", clientTiersRecours.getClien_adressenumero());

				} else if (clientTiersRecours != null && clientTiersRecours.getClien_prenom() == null
						&& clientTiersRecours.getClien_nom() == null) {

					parameterMap.put("tiersRecoursDenomination", clientTiersRecours.getClien_denomination());
					parameterMap.put("tiersRecoursAdresse", clientTiersRecours.getClien_adressenumero());

				} else if (clientTiersRecours != null && clientTiersRecours.getClien_prenom() != null
						&& clientTiersRecours.getClien_nom() != null
						&& clientTiersRecours.getClien_denomination() != null) {

					parameterMap.put("tiersRecoursDenomination", clientTiersRecours.getClien_prenom() + " "
							+ clientTiersRecours.getClien_nom() + " / " + clientTiersRecours.getClien_denomination());
					parameterMap.put("tiersRecoursAdresse", clientTiersRecours.getClien_adressenumero());

				} else {
					parameterMap.put("tiersRecoursDenomination", "");
					parameterMap.put("tiersRecoursAdresse", "");
				}

			} else {
				// L'acheteur est le tiers recours
				Acheteur acheteurTiersRecours = acheteurRepository.findByIdd(sinistre.getSini_tiersrecours());
				if (acheteurTiersRecours != null) {
					parameterMap.put("tiersRecoursDenomination",
							acheteurTiersRecours.getAchet_prenom() + " " + acheteurTiersRecours.getAchet_nom());

					parameterMap.put("tiersRecoursAdresse", "");
				} else {
					parameterMap.put("tiersRecoursDenomination", "");
					parameterMap.put("tiersRecoursAdresse", "");
				}
			}

			// Remplir les infos du mvts de proposition de reglement
			parameterMap.put("numeroDeclaration", mvtsinistre.getMvts_num());
			parameterMap.put("dateReglement", mvtsinistre.getMvts_datemvt());
//			parameterMap.put("numeroReglement", "");
			parameterMap.put("montantPrincipal", mvtsinistre.getMvts_montantprincipal());
			parameterMap.put("montantFrais", mvtsinistre.getMvts_montantfrais());
			parameterMap.put("montantHonoraires", mvtsinistre.getMvts_montanthonoraire());
			parameterMap.put("montantGlobal", mvtsinistre.getMvts_montantmvt());
			parameterMap.put("montantLettre", FrenchNumberToWords.convert(mvtsinistre.getMvts_montantmvt()));

			List<SinistreMouvement> sinistres = sinistreRepository.getAllSinistresMouvement();
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(sinistres);

			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
			final OutputStream outputStream = response.getOutputStream();

			response.setContentType("application/x-pdf");
			response.setHeader("Content-Disposition",
					"inline; filename=" + ParamConst.FILENAME_REPORT_VALIDATION_REGLEMENT + ParamConst.EXTENSION_PDF);
			response.addHeader(" Access-Control-Allow-Origin ", " * ");

			JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

		} catch (JRException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void generateEditionFicheReglementFinancier(HttpServletResponse response, String demandeur, Long sini_num,
			Long mvts_num) {
		String caractSup = "_";
		String demandeurNew = "";
		demandeurNew = demandeur.replaceAll(caractSup, " ");

//		SinistreMouvement sinmvt = sinistreRepository.getSinistreById(sini_id);
		Sinistre sinistre = sinistreRepository.findSinistreByNumero(sini_num);
		Mvtsinistre mvtsinistre = mvtsinistreRepository.findMvtsinistreByNumero(mvts_num);

		InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
				+ ParamConst.FILENAME_REPORT_REGLEMENT_FINANCIER + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {
			design = JRXmlLoader.load(jasperStream);

			JasperReport report = JasperCompileManager.compileReport(design);

			Map<String, Object> parameterMap = new HashMap<String, Object>();

			parameterMap.put("contrat", sinistre.getSini_police());
			parameterMap.put("numeroSinistre", sinistre.getSini_num());
			parameterMap.put("dateSurvenance", sinistre.getSini_datesurvenance());
			parameterMap.put("description", sinistre.getSini_description());
			parameterMap.put("demandeur", demandeurNew);

			// Récupérer le libellé de la branche
			Branche branche = brancheRepository.findBrancheByNumero(sinistre.getSini_branche());
			if (branche != null) {
				parameterMap.put("branche", branche.getBranche_libelleLong());
			} else {
				parameterMap.put("branche", "");
			}

			// Récupéré le bénéficiaire et remplir ses informations
			if (mvtsinistre.getMvts_beneficiaire() == null || mvtsinistre.getMvts_beneficiaire().equals("")) {

				if (mvtsinistre.getMvts_autrebeneficiaire() != null
						&& !mvtsinistre.getMvts_autrebeneficiaire().equals("")
						&& mvtsinistre.getMvts_adresseautrebeneficiaire() != null
						&& !mvtsinistre.getMvts_adresseautrebeneficiaire().equals("")) {

					parameterMap.put("beneficiaire", mvtsinistre.getMvts_autrebeneficiaire());
					parameterMap.put("beneficiaireAdresse", mvtsinistre.getMvts_adresseautrebeneficiaire());

				} else {
					parameterMap.put("beneficiaire", "");
					parameterMap.put("beneficiaireAdresse", "");
				}

			} else {

				Optional<Beneficiaire> beneficiaireOptional = beneficiaireRepository
						.findById(mvtsinistre.getMvts_beneficiaire());
				if (beneficiaireOptional.isPresent()) {
					Beneficiaire beneficiaire = beneficiaireOptional.get();

					if (beneficiaire != null
							&& (beneficiaire.getBenef_denom() == null || beneficiaire.getBenef_denom().equals(""))
							&& beneficiaire.getBenef_prenoms() != null && !beneficiaire.getBenef_prenoms().equals("")
							&& beneficiaire.getBenef_nom() != null && !beneficiaire.getBenef_nom().equals("")) {

						parameterMap.put("beneficiaire",
								beneficiaire.getBenef_prenoms() + " " + beneficiaire.getBenef_nom());
						parameterMap.put("beneficiaireAdresse", "");

					} else if (beneficiaire != null
							&& (beneficiaire.getBenef_denom() != null && !beneficiaire.getBenef_denom().equals(""))
							&& (beneficiaire.getBenef_prenoms() == null || beneficiaire.getBenef_prenoms().equals(""))
							&& (beneficiaire.getBenef_nom() == null || beneficiaire.getBenef_nom().equals(""))) {

						parameterMap.put("beneficiaire", beneficiaire.getBenef_denom());
						parameterMap.put("beneficiaireAdresse", "");

					} else if (beneficiaire != null
							&& (beneficiaire.getBenef_denom() != null && !beneficiaire.getBenef_denom().equals(""))
							&& beneficiaire.getBenef_prenoms() != null && !beneficiaire.getBenef_prenoms().equals("")
							&& beneficiaire.getBenef_nom() != null && !beneficiaire.getBenef_nom().equals("")) {

						parameterMap.put("beneficiaire", beneficiaire.getBenef_prenoms() + " "
								+ beneficiaire.getBenef_nom() + " / " + beneficiaire.getBenef_denom());
						parameterMap.put("beneficiaireAdresse", "");

					} else {
						parameterMap.put("beneficiaire", "");
						parameterMap.put("beneficiaireAdresse", "");
					}
				}
			}

			// Récupérer les infos du reglement et les remplir
			Reglement reglement = reglementRepository.findReglementByNumeroSinistreAndMvt(sini_num, mvts_num);

			parameterMap.put("numeroDeclaration", reglement.getRegl_num());
			parameterMap.put("dateReglement", reglement.getRegl_datereglement());
			parameterMap.put("numeroReglement", reglement.getRegl_num());
			parameterMap.put("montantPrincipal", reglement.getRegl_montantprincipal());
			parameterMap.put("montantFrais", reglement.getRegl_montantfrais());
			parameterMap.put("montantHonoraires", reglement.getRegl_montanthonoraire());
			parameterMap.put("montantGlobal", reglement.getRegl_montanttotal());
			parameterMap.put("montantLettre", FrenchNumberToWords.convert(reglement.getRegl_montanttotal()));

			if (reglement.getRegl_numcheque() != null && !reglement.getRegl_numcheque().equals(""))
				parameterMap.put("numCheque", reglement.getRegl_numcheque());
			else
				parameterMap.put("numCheque", "");

			if (reglement.getRegl_codebanque() != null && !reglement.getRegl_codebanque().equals("")) {
				Banque banque = banqueRepository.findBanqueByCode(Long.parseLong(reglement.getRegl_codebanque()));
				if (banque != null) {
					if (banque.getBanq_codenormalise() != null
							&& !banque.getBanq_codenormalise().equalsIgnoreCase("")) {
						parameterMap.put("codeBanque", banque.getBanq_codebanque() + " / "
								+ banque.getBanq_codenormalise() + " / " + banque.getBanq_denomination());
					} else {
						parameterMap.put("codeBanque",
								banque.getBanq_codebanque() + " / " + banque.getBanq_denomination());
					}

				} else {
					parameterMap.put("codeBanque", "");
				}

			} else
				parameterMap.put("codeBanque", "");

			List<SinistreMouvement> sinistres = sinistreRepository.getAllSinistresMouvement(); // importe peu
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(sinistres);

			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
			final OutputStream outputStream = response.getOutputStream();

			response.setContentType("application/x-pdf");
			response.setHeader("Content-Disposition",
					"inline; filename=" + ParamConst.FILENAME_REPORT_REGLEMENT_FINANCIER + ParamConst.EXTENSION_PDF);
			response.addHeader(" Access-Control-Allow-Origin ", " * ");

			JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

		} catch (JRException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void downloadRecuAvisReglement(HttpServletResponse response, String demandeur, Long sini_id) {
		String caractSup = "_";
		String demandeurNew = "";
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		SinistreMouvement sinistreForm = sinistreRepository.getSinistreById(sini_id);

		InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
				+ ParamConst.FILENAME_REPORT_AVIS_REGLEMENT_SINISTRE + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {
			design = JRXmlLoader.load(jasperStream);

			JasperReport report = JasperCompileManager.compileReport(design);

			Map<String, Object> parameterMap = new HashMap<String, Object>();

			parameterMap.put("numeroEncaissement", null);
			parameterMap.put("contrat", sinistreForm.getMvts_poli());
			parameterMap.put("montantFacture", sinistreForm.getSini_recoursglobal());
			parameterMap.put("montantFactureLettre", FrenchNumberToWords.convert(sinistreForm.getSini_recoursglobal()));
			parameterMap.put("montantRegle", sinistreForm.getMvts_montantmvt());
			parameterMap.put("montantRegleLettre", FrenchNumberToWords.convert(sinistreForm.getMvts_montantmvt()));
			parameterMap.put("reference", demandeurNew);

			Reglement reglement = reglementRepository.getReglementByMvt(sinistreForm.getMvts_num());
			if (reglement != null) {
				parameterMap.put("numeroRecours", reglement.getRegl_num());
				if (reglement.getRegl_codereglement() == "C") {
					parameterMap.put("referenceReglement", "Chèque");
				} else if (reglement.getRegl_codereglement() == "T") {
					parameterMap.put("referenceReglement", "Traite");
				} else if (reglement.getRegl_codereglement() == "V") {
					parameterMap.put("referenceReglement", "Virement");
				} else if (reglement.getRegl_codereglement() == "E") {
					parameterMap.put("referenceReglement", "Espèce");
				} else {
					parameterMap.put("referenceReglement", "Autres");
				}

				parameterMap.put("reglement", "Code banque: " + reglement.getRegl_codebanque() + " / Numéro chèque: "
						+ reglement.getRegl_numcheque());
			}

			Branche branche = brancheRepository.findBrancheByNumero(sinistreForm.getSini_branche());
			if (branche != null) {
				parameterMap.put("branche", branche.getBranche_libelleLong());
			} else {
				parameterMap.put("branche", "");
			}

			Produit produit = produitRepository.getProduitByNumero(sinistreForm.getSini_produit());
			if (produit != null) {
				parameterMap.put("produit", produit.getProd_denominationlong());
			}

			// Recupéré le donneur d'ordre et remplir ses informations
			Client client = clientRepository.findByNumClient(sinistreForm.getSini_souscripteur());
			if (client != null) {
				parameterMap.put("clientPrenom", client.getClien_prenom());
				parameterMap.put("clientNom", client.getClien_nom());
				parameterMap.put("clientDenomination", client.getClien_denomination());
				parameterMap.put("clientAdresse",
						client.getClien_adressenumero() + " / " + client.getClien_adresseville());
			}

			List<Sinistre> sinistres = sinistreRepository.findAll();
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(sinistres);

			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
			final OutputStream outputStream = response.getOutputStream();

			response.setContentType("application/x-pdf");
			response.setHeader("Content-Disposition", "inline; filename="
					+ ParamConst.FILENAME_REPORT_AVIS_REGLEMENT_SINISTRE + ParamConst.EXTENSION_PDF);
			response.addHeader(" Access-Control-Allow-Origin ", " * ");

			JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

		} catch (JRException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
