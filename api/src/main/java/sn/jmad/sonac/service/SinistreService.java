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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRExporterParameter;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.design.JasperDesign;
import net.sf.jasperreports.engine.export.JRXlsExporterParameter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.engine.xml.JRXmlLoader;
import sn.jmad.sonac.message.response.AnnulationPeriodique;
import sn.jmad.sonac.message.response.ClientContact;
import sn.jmad.sonac.message.response.PoliceFront;
import sn.jmad.sonac.message.response.RecoursFront;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.message.response.SinistreClient;
import sn.jmad.sonac.message.response.SinistreFacture;
import sn.jmad.sonac.message.response.SinistreFront;
import sn.jmad.sonac.message.response.SinistreMouvement;
import sn.jmad.sonac.message.response.ValidationsFront;
import sn.jmad.sonac.model.Acheteur;
import sn.jmad.sonac.model.Acte;
import sn.jmad.sonac.model.Avenant;
import sn.jmad.sonac.model.Beneficiaire;
import sn.jmad.sonac.model.Branche;
import sn.jmad.sonac.model.Client;
import sn.jmad.sonac.model.Credit;
import sn.jmad.sonac.model.Engagement;
import sn.jmad.sonac.model.Facture;
import sn.jmad.sonac.model.Lot;
import sn.jmad.sonac.model.Mvtsinistre;
import sn.jmad.sonac.model.Marche;
import sn.jmad.sonac.model.Police;
import sn.jmad.sonac.model.Quittance;
import sn.jmad.sonac.model.Risque;
import sn.jmad.sonac.model.Risque_locatif;
import sn.jmad.sonac.model.Sinistre;
import sn.jmad.sonac.repository.AcheteurRepository;
import sn.jmad.sonac.repository.ActeRepository;
import sn.jmad.sonac.repository.BeneficiaireRepository;
import sn.jmad.sonac.repository.BrancheRepository;
import sn.jmad.sonac.repository.ClientRepository;
import sn.jmad.sonac.repository.CreditRepository;
import sn.jmad.sonac.repository.MvtsinistreRepository;
import sn.jmad.sonac.repository.RisqueRepository;
import sn.jmad.sonac.repository.Risque_locatifRepository;
import sn.jmad.sonac.repository.SinistreRepository;
import sn.jmad.sonac.service.constantes.FrenchNumberToWords;
import sn.jmad.sonac.service.constantes.ParamConst;

@Service
public class SinistreService {

	private static final String PDF = "pdf";
	private static final String EXCEL = "excel";
	private static final String SINISTRE = "sinistre";
	private static final String MENACE = "menace";
	Long typeMvtMenaceSinistre = 1L;
	Long typeMvtDeclarationSinistre = 2L;
	Long typeMvtModificationEvalution = 3L;
	Long typeMvtModificationSAP = 4L;

	private int brancheCaution = 15;

	@Autowired
	SinistreRepository sinistreRepository;

	@Autowired
	MvtsinistreRepository mvtsinistreRepository;

	@Autowired
	CreditRepository creditRepository;

	@Autowired
	Risque_locatifRepository risque_locatifRepository;

	@Autowired
	ClientRepository clientRepository;

	@Autowired
	BeneficiaireRepository beneficiaireRepository;

	@Autowired
	AcheteurRepository acheteurRepository;

	@Autowired
	BrancheRepository brancheRepository;

	@Autowired
	RisqueRepository risqueRepository;

	@Autowired
	ActeRepository acteRepository;

	@Transactional(rollbackFor = Exception.class)
	public SinistreFront ajoutDeclarionMenaceSinistre(SinistreFront sinistreFront) {

		Sinistre sinistre = sinistreFront.getSinistreForm();
		Mvtsinistre mvtsinistre = sinistreFront.getMvtsinistreForm();
		Credit credit = sinistreFront.getCreditForm();
		Risque_locatif risque_locatif = sinistreFront.getRisque_locatifForm();

		// ================ saving sinistre ===========================

		/*
		 * Les évaluations initiales sont renseignées en fonction du montant principal,
		 * frais et honoraires du mvt sinistre
		 */
		sinistre.setSini_evaluationprincipale(mvtsinistre.getMvts_montantprincipal());
		sinistre.setSini_evaluationfrais(mvtsinistre.getMvts_montantfrais());
		sinistre.setSini_evaluationhonoraires(mvtsinistre.getMvts_montanthonoraire());
		sinistre.setSini_evaluationglobale(sinistre.getSini_evaluationprincipale() + sinistre.getSini_evaluationfrais()
				+ sinistre.getSini_evaluationhonoraires());

		sinistre.setSini_coderesponsabilite(0L);
		sinistre.setSini_sapprincipale(0L);
		sinistre.setSini_sapfrais(0L);
		sinistre.setSini_saphonoraires(0L);
		sinistre.setSini_sapglobale(0L);
		sinistre.setSini_reglementprincipal(0L);
		sinistre.setSini_reglementfrais(0L);
		sinistre.setSini_reglementhonoraires(0L);
		sinistre.setSini_reglementglobal(0L);
		sinistre.setSini_recoursprincipal(0L);
		sinistre.setSini_recoursfrais(0L);
		sinistre.setSini_recourshonoraires(0L);
		sinistre.setSini_recoursglobal(0L);
		sinistre.setSini_recoursprincipalencaisse(0L);
		sinistre.setSini_recoursfraisencaisse(0L);
		sinistre.setSini_recourshonoraieencaisse(0L);
		sinistre.setSini_recoursglobalencaisse(0L);
		sinistre.setSini_datemodification(new Date());
//		sinistre.setSini_status(mvtsinistre.getMvts_typemvt());
		sinistre.setSini_status(typeMvtMenaceSinistre);
		Sinistre sinistreSave = sinistreRepository.save(sinistre);

		// =========== SAVING MVT SINISTRE ==================
		Long numSinistre = sinistreSave.getSini_num();
		mvtsinistre.setMvts_poli(sinistre.getSini_police());
		mvtsinistre.setMvts_numsinistre(numSinistre);
		mvtsinistre.setMvts_datemvt(sinistre.getSini_datesaisie());
		mvtsinistre.setMvts_datesaisie(sinistre.getSini_datesaisie());
		mvtsinistre.setMvts_montantmvt(mvtsinistre.getMvts_montantprincipal() + mvtsinistre.getMvts_montantfrais()
				+ mvtsinistre.getMvts_montanthonoraire());

		mvtsinistre.setMvts_typemvt(typeMvtMenaceSinistre);
		mvtsinistre.setMvts_montantfinancier(0L);
		mvtsinistre.setMvts_montantfinancierprincipal(0L);
		mvtsinistre.setMvts_montantfinancierfrais(0L);
		mvtsinistre.setMvts_montantfinancierhonoraires(0L);
		mvtsinistre.setMvts_status(1);
		mvtsinistre.setMvts_beneficiaire(sinistre.getSini_beneficiaire());
		mvtsinistre.setMvts_tiers(sinistre.getSini_tiersrecours());
		mvtsinistre.setMvts_codeutilisateur(sinistre.getSini_utilisateur());
		mvtsinistre.setMvts_datemodification(new Date());
		mvtsinistre.setMvts_datecomptabilisation(new Date());
		Mvtsinistre mvtsinistreSave = mvtsinistreRepository.save(mvtsinistre);

		// ================= SAVING CREDIT =============
		Credit creditUpdate = creditRepository.findByIdd(credit.getCredit_numero());
		Credit creditSave = null;
		if (creditUpdate != null) {
			creditUpdate.setCredit_nbechenaceretard(credit.getCredit_nbechenaceretard());
			creditUpdate.setCredit_nbecheanceimpaye(credit.getCredit_nbecheanceimpaye());
			creditSave = creditRepository.save(creditUpdate);
			System.out.println("=========== CREDIT =====================");
		}

		// ================ SAVING RISQUE LOCATIF ==============
		Risque_locatif risque_locatifUpdate = risque_locatifRepository.findByIdd(risque_locatif.getRiskl_numero());
		Risque_locatif riskLocatifSave = null;
		if (risque_locatifUpdate != null) {
			risque_locatifUpdate.setRiskl_mtnloyerimpaye(risque_locatif.getRiskl_mtnloyerimpaye());
			risque_locatifUpdate.setRiskl_nombreloyerimpaye(risque_locatif.getRiskl_nombreloyerimpaye());
			riskLocatifSave = risque_locatifRepository.save(risque_locatifUpdate);
			System.out.println("=========== RISQUE LOCATIF =====================");
		}

		SinistreFront sinistreFront2 = new SinistreFront(sinistreSave, mvtsinistreSave, creditSave, riskLocatifSave);

		return sinistreFront2;
//		return sinistreSave.getSini_num().toString();
	}

	@Transactional(rollbackFor = Exception.class)
	public SinistreFront ajoutDeclarionSinistre(SinistreFront sinistreFront) {

		Sinistre sinistre = sinistreFront.getSinistreForm();
		Mvtsinistre mvtsinistre = sinistreFront.getMvtsinistreForm();
		Credit credit = sinistreFront.getCreditForm();
		Risque_locatif risque_locatif = sinistreFront.getRisque_locatifForm();

		// ================ saving sinistre ===========================

		/*
		 * Les évaluations initiales sont renseignées en fonction du montant principal,
		 * frais et honoraires du mvt sinistre
		 */

		System.out.println("Numéro de la menace de sinistre: " + sinistre.getSini_num());

		Sinistre sinistreSave = null;
		if (sinistre.getSini_num() == 0) {
			// Y'avait pas de déclaration de menace de sinistre... donc c'est un nouvel
			// enregistrement (pour les cautions pas de declaration de menace de sinistre)
			sinistre.setSini_evaluationprincipale(mvtsinistre.getMvts_montantprincipal());
			sinistre.setSini_evaluationfrais(mvtsinistre.getMvts_montantfrais());
			sinistre.setSini_evaluationhonoraires(mvtsinistre.getMvts_montanthonoraire());
			sinistre.setSini_evaluationglobale(sinistre.getSini_evaluationprincipale()
					+ sinistre.getSini_evaluationfrais() + sinistre.getSini_evaluationhonoraires());

			sinistre.setSini_coderesponsabilite(0L);
			sinistre.setSini_sapprincipale(sinistre.getSini_evaluationprincipale());
			sinistre.setSini_sapfrais(sinistre.getSini_evaluationfrais());
			sinistre.setSini_saphonoraires(sinistre.getSini_evaluationhonoraires());
			sinistre.setSini_sapglobale(
					sinistre.getSini_sapprincipale() + sinistre.getSini_sapfrais() + sinistre.getSini_saphonoraires());

			sinistre.setSini_reglementprincipal(0L);
			sinistre.setSini_reglementfrais(0L);
			sinistre.setSini_reglementhonoraires(0L);
			sinistre.setSini_reglementglobal(0L);
			sinistre.setSini_recoursprincipal(0L);
			sinistre.setSini_recoursfrais(0L);
			sinistre.setSini_recourshonoraires(0L);
			sinistre.setSini_recoursglobal(0L);
			sinistre.setSini_recoursprincipalencaisse(0L);
			sinistre.setSini_recoursfraisencaisse(0L);
			sinistre.setSini_recourshonoraieencaisse(0L);
			sinistre.setSini_recoursglobalencaisse(0L);
			sinistre.setSini_datemodification(new Date());
//			sinistre.setSini_status("A");
			sinistre.setSini_status(mvtsinistre.getMvts_typemvt());
			sinistreSave = sinistreRepository.save(sinistre);
		} else {
			// Il existait déjà une menace de sinistre donc on met à jour certaines
			// informtions
			Sinistre sinistreUpdated = sinistreRepository.findSinistreByNumero(sinistre.getSini_num());

			sinistreUpdated.setSini_evaluationprincipale(mvtsinistre.getMvts_montantprincipal());
			sinistreUpdated.setSini_evaluationfrais(mvtsinistre.getMvts_montantfrais());
			sinistreUpdated.setSini_evaluationhonoraires(mvtsinistre.getMvts_montanthonoraire());
			sinistreUpdated.setSini_evaluationglobale(sinistreUpdated.getSini_evaluationprincipale()
					+ sinistreUpdated.getSini_evaluationfrais() + sinistreUpdated.getSini_evaluationhonoraires());

			sinistreUpdated.setSini_sapprincipale(sinistreUpdated.getSini_evaluationprincipale());
			sinistreUpdated.setSini_sapfrais(sinistreUpdated.getSini_evaluationfrais());
			sinistreUpdated.setSini_saphonoraires(sinistreUpdated.getSini_evaluationhonoraires());
			sinistreUpdated.setSini_sapglobale(sinistreUpdated.getSini_sapprincipale()
					+ sinistreUpdated.getSini_sapfrais() + sinistreUpdated.getSini_saphonoraires());

			sinistreUpdated.setSini_lieu(sinistre.getSini_lieu());
			sinistreUpdated.setSini_datedeclaration(sinistre.getSini_datedeclaration());
			sinistreUpdated.setSini_datesurvenance(sinistre.getSini_datesurvenance());
			sinistreUpdated.setSini_datesaisie(sinistre.getSini_datesaisie());
			sinistreUpdated.setSini_description(sinistre.getSini_description());
			sinistreUpdated.setSini_datemodification(new Date());
			sinistreUpdated.setSini_utilisateur(sinistre.getSini_utilisateur());
			sinistreUpdated.setSini_status(typeMvtDeclarationSinistre);
			sinistreSave = sinistreRepository.save(sinistreUpdated);
		}

		// =========== SAVING MVT SINISTRE ==================
//		Long numSinistre = sinistreSave.getSini_num();
		mvtsinistre.setMvts_poli(sinistreSave.getSini_police());
		mvtsinistre.setMvts_numsinistre(sinistreSave.getSini_num());
//		mvtsinistre.setMvts_datemvt(sinistre.getSini_datesaisie());
		mvtsinistre.setMvts_datemvt(new Date());
		mvtsinistre.setMvts_datesaisie(sinistreSave.getSini_datesaisie());
		mvtsinistre.setMvts_montantmvt(mvtsinistre.getMvts_montantprincipal() + mvtsinistre.getMvts_montantfrais()
				+ mvtsinistre.getMvts_montanthonoraire());

		mvtsinistre.setMvts_montantfinancier(0L);
		mvtsinistre.setMvts_montantfinancierprincipal(0L);
		mvtsinistre.setMvts_montantfinancierfrais(0L);
		mvtsinistre.setMvts_montantfinancierhonoraires(0L);
		mvtsinistre.setMvts_typemvt(typeMvtDeclarationSinistre);
		mvtsinistre.setMvts_status(1);
		mvtsinistre.setMvts_beneficiaire(sinistreSave.getSini_beneficiaire());
		mvtsinistre.setMvts_tiers(sinistreSave.getSini_tiersrecours());
		mvtsinistre.setMvts_motifannulation(null);
		mvtsinistre.setMvts_dateannulation(null);
		mvtsinistre.setMvts_codeutilisateur(sinistreSave.getSini_utilisateur());
		mvtsinistre.setMvts_datemodification(new Date());
		mvtsinistre.setMvts_datecomptabilisation(new Date());

		Mvtsinistre mvtsinistreSave = mvtsinistreRepository.save(mvtsinistre);

		// ================= SAVING CREDIT =============
		Credit creditUpdate = creditRepository.findByIdd(credit.getCredit_numero());
		Credit creditSave = null;
		if (creditUpdate != null) {
			creditUpdate.setCredit_nbechenaceretard(credit.getCredit_nbechenaceretard());
			creditUpdate.setCredit_nbecheanceimpaye(credit.getCredit_nbecheanceimpaye());
			creditSave = creditRepository.save(creditUpdate);
			System.out.println("=========== CREDIT =====================");
		}

		// ================ SAVING RISQUE LOCATIF ==============
		Risque_locatif risque_locatifUpdate = risque_locatifRepository.findByIdd(risque_locatif.getRiskl_numero());
		Risque_locatif riskLocatifSave = null;
		if (risque_locatifUpdate != null) {
			risque_locatifUpdate.setRiskl_mtnloyerimpaye(risque_locatif.getRiskl_mtnloyerimpaye());
			risque_locatifUpdate.setRiskl_nombreloyerimpaye(risque_locatif.getRiskl_nombreloyerimpaye());
			riskLocatifSave = risque_locatifRepository.save(risque_locatifUpdate);
			System.out.println("=========== RISQUE LOCATIF =====================");
		}

		SinistreFront sinistreFront2 = new SinistreFront(sinistreSave, mvtsinistreSave, creditSave, riskLocatifSave);

		return sinistreFront2;

	}

	@Transactional(rollbackFor = Exception.class)
	public SinistreFront modificationMenaceSinistre(SinistreFront sinistreFront) {

//		Sinistre sinistre = sinistreFront.getSinistreForm();
//		Mvtsinistre mvtsinistre = sinistreFront.getMvtsinistreForm();
		Credit credit = sinistreFront.getCreditForm();
		Risque_locatif risque_locatif = sinistreFront.getRisque_locatifForm();

		// ================= UPDATING CREDIT =============
		Credit creditSave = null;
		if (credit.getCredit_numero() != 0) {
			System.out.println("============ MANGUI THIY CREDIT BI ====================");
			Credit creditUpdate = creditRepository.findByIdd(credit.getCredit_numero());
			if (creditUpdate != null) {
				creditUpdate.setCredit_nbechenaceretard(credit.getCredit_nbechenaceretard());
				creditUpdate.setCredit_nbecheanceimpaye(credit.getCredit_nbecheanceimpaye());
				creditSave = creditRepository.save(creditUpdate);
			}
		}

		// ================ SAVING RISQUE LOCATIF ==============
		Risque_locatif riskLocatifSave = null;
		if (risque_locatif.getRiskl_numero() != 0) {
			System.out.println("============ MANGUI THIY RISKE LOCATIF BI ====================");
			Risque_locatif risque_locatifUpdate = risque_locatifRepository.findByIdd(risque_locatif.getRiskl_numero());
			if (risque_locatifUpdate != null) {
				risque_locatifUpdate.setRiskl_nombreloyerimpaye(risque_locatif.getRiskl_nombreloyerimpaye());
				risque_locatifUpdate.setRiskl_mtnloyerimpaye(risque_locatif.getRiskl_mtnloyerimpaye());
				riskLocatifSave = risque_locatifRepository.save(risque_locatifUpdate);
			}
		}

		SinistreFront sinistreFront2 = new SinistreFront(null, null, creditSave, riskLocatifSave);

		return sinistreFront2;
	}

	@Transactional(rollbackFor = Exception.class)
	public SinistreFront leveeMenaceSinistre(Long numSinistre, Long numMvtSinistre, Long numAcheteur) {

		Sinistre sinistreUpdated = sinistreRepository.findSinistreByNumero(numSinistre);
		if (sinistreUpdated == null)
			return null;

		sinistreUpdated.setSini_status(0L);
		Sinistre sinistreMAJ = sinistreRepository.save(sinistreUpdated);

		// Update Mouvement_sinistre
		Mvtsinistre mvtsinistreUpdated = mvtsinistreRepository.findMvtsinistreByNumero(numMvtSinistre);
		if (mvtsinistreUpdated == null)
			return null;

		mvtsinistreUpdated.setMvts_status(3);
		Mvtsinistre mvtsinistreMAJ = mvtsinistreRepository.save(mvtsinistreUpdated);

		// Update Acheteur
		Acheteur acheteurUpdated = acheteurRepository.findByIdd(numAcheteur);
		if (acheteurUpdated == null)
			return null;

		if (acheteurUpdated.getAchet_incidentpaiement() == null)
			acheteurUpdated.setAchet_incidentpaiement(1L);
		else
			acheteurUpdated.setAchet_incidentpaiement(acheteurUpdated.getAchet_incidentpaiement() + 1L);

		Acheteur acheteurMAJ = acheteurRepository.save(acheteurUpdated);

		SinistreFront sinistreFront = new SinistreFront(sinistreMAJ, mvtsinistreMAJ, null, null);
		return sinistreFront;
	}

	@Transactional(rollbackFor = Exception.class)
	public SinistreFront confirmeMenaceSinistre(Long numSinistre, Long numMvtSinistre) {

		Sinistre sinistreUpdated = sinistreRepository.findSinistreByNumero(numSinistre);
		if (sinistreUpdated == null)
			return null;

		sinistreUpdated.setSini_status(typeMvtDeclarationSinistre);
		sinistreUpdated.setSini_sapprincipale(sinistreUpdated.getSini_evaluationprincipale());
		sinistreUpdated.setSini_sapfrais(sinistreUpdated.getSini_evaluationfrais());
		sinistreUpdated.setSini_saphonoraires(sinistreUpdated.getSini_evaluationhonoraires());
		sinistreUpdated.setSini_sapglobale(sinistreUpdated.getSini_sapprincipale() + sinistreUpdated.getSini_sapfrais()
				+ sinistreUpdated.getSini_saphonoraires());
		Sinistre sinistreMAJ = sinistreRepository.save(sinistreUpdated);

		// Saving new Mouvement sinistre
		Mvtsinistre mvtsinistreUpdated = mvtsinistreRepository.findMvtsinistreByNumero(numMvtSinistre);
		if (mvtsinistreUpdated == null)
			return null;

//		mvtsinistreUpdated.setMvts_status("N");
		Mvtsinistre mvtsinistreNew = new Mvtsinistre();
		mvtsinistreNew.setMvts_beneficiaire(mvtsinistreUpdated.getMvts_beneficiaire());
		mvtsinistreNew.setMvts_codeutilisateur(mvtsinistreUpdated.getMvts_codeutilisateur());
		mvtsinistreNew.setMvts_dateannulation(mvtsinistreUpdated.getMvts_dateannulation());
		mvtsinistreNew.setMvts_datecomptabilisation(mvtsinistreUpdated.getMvts_datecomptabilisation());
		mvtsinistreNew.setMvts_datemodification(mvtsinistreUpdated.getMvts_datemodification());
		mvtsinistreNew.setMvts_datemvt(mvtsinistreUpdated.getMvts_datemvt());
		mvtsinistreNew.setMvts_datesaisie(mvtsinistreUpdated.getMvts_datesaisie());
		mvtsinistreNew.setMvts_montantfinancier(mvtsinistreUpdated.getMvts_montantfinancier());
		mvtsinistreNew.setMvts_montantfinancierprincipal(mvtsinistreUpdated.getMvts_montantfinancierprincipal());
		mvtsinistreNew.setMvts_montantfinancierfrais(mvtsinistreUpdated.getMvts_montantfinancierfrais());
		mvtsinistreNew.setMvts_montantfinancierhonoraires(mvtsinistreUpdated.getMvts_montantfinancierhonoraires());
		mvtsinistreNew.setMvts_montantfrais(mvtsinistreUpdated.getMvts_montantfrais());
		mvtsinistreNew.setMvts_montanthonoraire(mvtsinistreUpdated.getMvts_montanthonoraire());
		mvtsinistreNew.setMvts_montantprincipal(mvtsinistreUpdated.getMvts_montantprincipal());
		mvtsinistreNew.setMvts_montantmvt(mvtsinistreUpdated.getMvts_montantmvt());
		mvtsinistreNew.setMvts_motifannulation(mvtsinistreUpdated.getMvts_motifannulation());
		mvtsinistreNew.setMvts_numsinistre(mvtsinistreUpdated.getMvts_numsinistre());
		mvtsinistreNew.setMvts_poli(mvtsinistreUpdated.getMvts_poli());
		mvtsinistreNew.setMvts_status(mvtsinistreUpdated.getMvts_status());
		mvtsinistreNew.setMvts_tiers(mvtsinistreUpdated.getMvts_tiers());
		mvtsinistreNew.setMvts_typegestionsinistre(mvtsinistreUpdated.getMvts_typegestionsinistre());
		mvtsinistreNew.setMvts_typemvt(typeMvtDeclarationSinistre);
		Mvtsinistre mvtsinistreNewAdded = mvtsinistreRepository.save(mvtsinistreNew);

		SinistreFront sinistreFront = new SinistreFront(sinistreMAJ, mvtsinistreNewAdded, null, null);
		return sinistreFront;
	}

	@Transactional(rollbackFor = Exception.class)
	public SinistreFront modificationEvaluationSinistre(SinistreFront sinistreFront) {

		Mvtsinistre mvtsinistreFront = sinistreFront.getMvtsinistreForm();

		// Si validation evaluation: on enregistre un nouveau mouvement de sinistre de
		// type modification évaluation et on MAJ le sinistre

		mvtsinistreFront.setMvts_montantmvt(mvtsinistreFront.getMvts_montantprincipal()
				+ mvtsinistreFront.getMvts_montantfrais() + mvtsinistreFront.getMvts_montanthonoraire());
		mvtsinistreFront.setMvts_typemvt(typeMvtModificationEvalution);
		mvtsinistreFront.setMvts_datemvt(new Date());
		mvtsinistreFront.setMvts_datemodification(new Date());
		mvtsinistreFront.setMvts_datecomptabilisation(new Date());
		mvtsinistreFront.setMvts_datesaisie(new Date());
		Mvtsinistre mvtsinistreEvaluationSaved = mvtsinistreRepository.save(mvtsinistreFront);

		// On met à jour maintenant le sinistre correspondant
		Sinistre sinistreUpdated = sinistreRepository.findSinistreByNumero(mvtsinistreFront.getMvts_numsinistre());

		if (sinistreUpdated == null)
			return null;

		sinistreUpdated.setSini_evaluationprincipale(mvtsinistreFront.getMvts_montantprincipal());
		sinistreUpdated.setSini_evaluationfrais(mvtsinistreFront.getMvts_montantfrais());
		sinistreUpdated.setSini_evaluationhonoraires(mvtsinistreFront.getMvts_montanthonoraire());
		sinistreUpdated.setSini_evaluationglobale(sinistreUpdated.getSini_evaluationprincipale()
				+ sinistreUpdated.getSini_evaluationfrais() + sinistreUpdated.getSini_evaluationhonoraires());

		sinistreUpdated.setSini_sapprincipale(sinistreUpdated.getSini_evaluationprincipale());
		sinistreUpdated.setSini_sapfrais(sinistreUpdated.getSini_evaluationfrais());
		sinistreUpdated.setSini_saphonoraires(sinistreUpdated.getSini_evaluationhonoraires());
		sinistreUpdated.setSini_sapglobale(sinistreUpdated.getSini_sapprincipale() + sinistreUpdated.getSini_sapfrais()
				+ sinistreUpdated.getSini_saphonoraires());

		sinistreUpdated.setSini_status(typeMvtModificationEvalution);
		sinistreUpdated.setSini_utilisateur(mvtsinistreFront.getMvts_codeutilisateur());
		sinistreUpdated.setSini_datemodification(new Date());
		sinistreUpdated.setSini_beneficiaire(mvtsinistreEvaluationSaved.getMvts_beneficiaire());
		sinistreUpdated.setSini_tiersrecours(mvtsinistreEvaluationSaved.getMvts_tiers());
		Sinistre sinistreEvaluationMAJ = sinistreRepository.save(sinistreUpdated);

		SinistreFront sinistreFront2 = new SinistreFront(sinistreEvaluationMAJ, mvtsinistreEvaluationSaved, null, null);
		return sinistreFront2;
	}

	@Transactional(rollbackFor = Exception.class)
	public SinistreFront modificationSAPSinistre(SinistreFront sinistreFront) {

		Mvtsinistre mvtsinistreFront = sinistreFront.getMvtsinistreForm();

		// Si validation SAP: on enregistre un nouveau mouvement de sinistre avec type
		// mvt =
		// modification SAP et on MAJ le sinistre sur la partie SAP

		mvtsinistreFront.setMvts_montantmvt(mvtsinistreFront.getMvts_montantprincipal()
				+ mvtsinistreFront.getMvts_montantfrais() + mvtsinistreFront.getMvts_montanthonoraire());
		mvtsinistreFront.setMvts_typemvt(typeMvtModificationSAP);
		mvtsinistreFront.setMvts_datemvt(new Date());
		mvtsinistreFront.setMvts_datemodification(new Date());
		mvtsinistreFront.setMvts_datecomptabilisation(new Date());
		mvtsinistreFront.setMvts_datesaisie(new Date());
		Mvtsinistre mvtsinistreSAPSaved = mvtsinistreRepository.save(mvtsinistreFront);
//		}

		// On met à jour maintenant le sinistre correspondant
		Sinistre sinistreUpdated = sinistreRepository.findSinistreByNumero(mvtsinistreFront.getMvts_numsinistre());

		if (sinistreUpdated == null)
			return null;

		sinistreUpdated.setSini_sapprincipale(mvtsinistreFront.getMvts_montantprincipal());
		sinistreUpdated.setSini_sapfrais(mvtsinistreFront.getMvts_montantfrais());
		sinistreUpdated.setSini_saphonoraires(mvtsinistreFront.getMvts_montanthonoraire());
		sinistreUpdated.setSini_sapglobale(sinistreUpdated.getSini_sapprincipale() + sinistreUpdated.getSini_sapfrais()
				+ sinistreUpdated.getSini_saphonoraires());

		sinistreUpdated.setSini_status(typeMvtModificationSAP);
		sinistreUpdated.setSini_utilisateur(mvtsinistreFront.getMvts_codeutilisateur());
		sinistreUpdated.setSini_datemodification(new Date());
		sinistreUpdated.setSini_beneficiaire(mvtsinistreSAPSaved.getMvts_beneficiaire());
		sinistreUpdated.setSini_tiersrecours(mvtsinistreSAPSaved.getMvts_tiers());
		Sinistre sinistreSAPMAJ = sinistreRepository.save(sinistreUpdated);

		SinistreFront sinistreFront2 = new SinistreFront(sinistreSAPMAJ, mvtsinistreSAPSaved, null, null);
		return sinistreFront2;
	}

	@Transactional(rollbackFor = Exception.class)
	public RecoursFront clotureSinistre(Long sini_id, RecoursFront recoursFront) {
		Mvtsinistre mvtsinistre = recoursFront.getMvtsinistreForm();

		// Recuperation du sinistre et mouvement selectionné
		SinistreMouvement sinmvt = sinistreRepository.getSinistreById(sini_id);

		sinistreRepository.updateSinistreStatusCloture(15L, new Date(), new Date(), sinmvt.getSini_id());

		// Saving mvtSinistre
		mvtsinistre.setMvts_poli(sinmvt.getSini_police());
		mvtsinistre.setMvts_numsinistre(sinmvt.getSini_num());
		mvtsinistre.setMvts_datesaisie(sinmvt.getSini_datesaisie());
		mvtsinistre.setMvts_montantprincipal(sinmvt.getMvts_montantprincipal());
		mvtsinistre.setMvts_montantfrais(sinmvt.getMvts_montantfrais());
		mvtsinistre.setMvts_montanthonoraire(sinmvt.getMvts_montanthonoraire());
		mvtsinistre.setMvts_montantmvt(sinmvt.getMvts_montantmvt());
		mvtsinistre.setMvts_status(1);
		mvtsinistre.setMvts_typegestionsinistre("N");
		mvtsinistre.setMvts_beneficiaire(sinmvt.getSini_beneficiaire());
		mvtsinistre.setMvts_tiers(sinmvt.getSini_tiersrecours());
		mvtsinistre.setMvts_typemvt(15L);
		// utilisateur connecté au lieu de sinmvt.getSini_utilisateur()
		mvtsinistre.setMvts_codeutilisateur(mvtsinistre.getMvts_codeutilisateur());
		mvtsinistre.setMvts_datemodification(new Date());
		mvtsinistre.setMvts_datemvt(new Date());
		Mvtsinistre mvtsinistreSave = mvtsinistreRepository.save(mvtsinistre);

		RecoursFront recoursFront2 = new RecoursFront(mvtsinistreSave);
		return recoursFront2;
	}

	@Transactional(rollbackFor = Exception.class)
	public RecoursFront reOuvrirSinistre(Long sini_id, RecoursFront recoursFront) {
		Mvtsinistre mvtsinistre = recoursFront.getMvtsinistreForm();

		// Recuperation du sinistre et mouvement selectionné
		SinistreMouvement sinmvt = sinistreRepository.getSinistreById(sini_id);

		// Saving mvtSinistre
		mvtsinistre.setMvts_poli(sinmvt.getSini_police());
		mvtsinistre.setMvts_numsinistre(sinmvt.getSini_num());
		mvtsinistre.setMvts_typemvt(16L);
		mvtsinistre.setMvts_datesaisie(sinmvt.getSini_datesaisie());
		mvtsinistre.setMvts_montantprincipal(mvtsinistre.getMvts_montantprincipal());
		mvtsinistre.setMvts_montantfrais(mvtsinistre.getMvts_montantfrais());
		mvtsinistre.setMvts_montanthonoraire(mvtsinistre.getMvts_montanthonoraire());
		mvtsinistre.setMvts_montantmvt(mvtsinistre.getMvts_montantprincipal() + mvtsinistre.getMvts_montantfrais()
				+ mvtsinistre.getMvts_montanthonoraire());
		mvtsinistre.setMvts_status(1);
		mvtsinistre.setMvts_typegestionsinistre("N");
		mvtsinistre.setMvts_beneficiaire(sinmvt.getSini_beneficiaire());
		mvtsinistre.setMvts_tiers(sinmvt.getSini_tiersrecours());
		// utilisateur connecté au lieu de sinmvt.getSini_utilisateur()
		mvtsinistre.setMvts_codeutilisateur(mvtsinistre.getMvts_codeutilisateur());
		mvtsinistre.setMvts_datemodification(new Date());
		mvtsinistre.setMvts_datemvt(new Date());
		Mvtsinistre mvtsinistreSave = mvtsinistreRepository.save(mvtsinistre);

		sinistreRepository.updateSinistreEvaluationAndSAP(16L, new Date(), (sinmvt.getSini_evaluationprincipale() + mvtsinistreSave.getMvts_montantprincipal()),
				(sinmvt.getSini_evaluationfrais() + mvtsinistreSave.getMvts_montantfrais()), (sinmvt.getSini_evaluationhonoraires() + mvtsinistreSave.getMvts_montanthonoraire()),
				(sinmvt.getSini_evaluationglobale() + mvtsinistreSave.getMvts_montantmvt()), mvtsinistreSave.getMvts_montantprincipal(), mvtsinistreSave.getMvts_montantfrais(), mvtsinistreSave.getMvts_montanthonoraire(),
				mvtsinistreSave.getMvts_montantmvt(), sini_id);

		RecoursFront recoursFront2 = new RecoursFront(mvtsinistreSave);
		return recoursFront2;
	}

	/*
	 * Edition fiche menace de sinistre et declartion de sinistre
	 */

	public void generateEditionFicheMenaceAndSinistre(HttpServletResponse response, String typeDeclaration,
			String demandeur, String document, SinistreFront sinistreFront) {

		String caractSup = "_";
		String demandeurNew = "";
		String documentFinale = "";

		demandeurNew = demandeur.replaceAll(caractSup, " ");

		Sinistre sinistreForm = sinistreFront.getSinistreForm();
		Mvtsinistre mvtsinistreForm = sinistreFront.getMvtsinistreForm();

		/*
		 * Traitement pour un fichier de déclaration de menace de sinistre
		 */
		if (typeDeclaration.equalsIgnoreCase(MENACE)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
					+ ParamConst.FILENAME_REPORT_MENACE_SINISTRE + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

				parameterMap.put("demandeur", demandeurNew);
				parameterMap.put("dateEdition", sinistreForm.getSini_datesaisie());
				parameterMap.put("dateDeclarationMenace", sinistreForm.getSini_datedeclaration());
				parameterMap.put("numeroDeclaration", mvtsinistreForm.getMvts_num());
				parameterMap.put("numeroSinistre", sinistreForm.getSini_num());
				parameterMap.put("contrat", sinistreForm.getSini_police());
				parameterMap.put("description", sinistreForm.getSini_description());

				parameterMap.put("montantPrincipal", sinistreForm.getSini_evaluationprincipale());
				parameterMap.put("montantFrais", sinistreForm.getSini_evaluationfrais());
				parameterMap.put("montantHonoraires", sinistreForm.getSini_evaluationhonoraires());
				parameterMap.put("montantGlobal", sinistreForm.getSini_evaluationglobale());
				parameterMap.put("montantLettre",
						FrenchNumberToWords.convert(sinistreForm.getSini_evaluationglobale()));

				// Récupérer le libellé de la branche
				Branche branche = brancheRepository.findBrancheByNumero(sinistreForm.getSini_branche());
				if (branche != null) {
					parameterMap.put("branche", branche.getBranche_libelleLong());
				} else {
					parameterMap.put("branche", "");
				}

				// Recupéré le client et remplir ses informations
				Client client = clientRepository.findByNumClient(sinistreForm.getSini_souscripteur());

				if (client != null
						&& (client.getClien_denomination() == null || client.getClien_denomination().equals(""))) {

					parameterMap.put("client", client.getClien_prenom() + " " + client.getClien_nom());
					parameterMap.put("clientAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());

				} else if (client != null && (client.getClien_prenom() == null || client.getClien_prenom().equals(""))
						&& (client.getClien_nom() == null || client.getClien_nom().equals(""))) {

					parameterMap.put("client", client.getClien_denomination());
					parameterMap.put("clientAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());

				} else if (client != null && client.getClien_prenom() != null && !client.getClien_prenom().equals("")
						&& client.getClien_nom() != null && !client.getClien_nom().equals("")
						&& client.getClien_denomination() != null && !client.getClien_denomination().equals("")) {

					parameterMap.put("client", client.getClien_prenom() + " " + client.getClien_nom() + " / "
							+ client.getClien_denomination());
					parameterMap.put("clientAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());

				} else {
					parameterMap.put("client", "");
					parameterMap.put("clientAdresse", "");
				}

				/*
				 * Récupérer le tiers recours Etant donné qu'on est en menace de sinistre
				 * (credit et perte pecun) ==> tiers recours = acheteur
				 */
				Acheteur acheteur = acheteurRepository.findByIdd(sinistreForm.getSini_acheteur());
				if (acheteur != null) {
					parameterMap.put("acheteur", acheteur.getAchet_prenom() + " " + acheteur.getAchet_nom());
				} else {
					parameterMap.put("acheteur", "");
				}

				/*
				 * if (acheteurTiersRecours != null) {
				 * parameterMap.put("tiersRecoursDenomination",
				 * acheteurTiersRecours.getAchet_prenom() + " " +
				 * acheteurTiersRecours.getAchet_nom()); } else {
				 * parameterMap.put("tiersRecoursDenomination", ""); //
				 * parameterMap.put("tiersRecoursAdresse", ""); }
				 */

				// Mettre les informations de l'option: pour le moment il y'a un seul acheteur
				// donc seule l'option1 est valable

				parameterMap.put("option", "Votre client " + parameterMap.get("acheteur"));

				List<Sinistre> sinistres = sinistreRepository.findAll();
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(sinistres);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_MENACE_SINISTRE + ParamConst.EXTENSION_PDF);
				response.addHeader(" Access-Control-Allow-Origin ", " * ");

				JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		/*
		 * Traitement pour un fichier de déclaration de sinistre
		 */
		if (typeDeclaration.equalsIgnoreCase(SINISTRE)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(
					ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_SINISTRE + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

				parameterMap.put("demandeur", demandeurNew);
				parameterMap.put("dateEdition", sinistreForm.getSini_datesaisie());
				parameterMap.put("numeroSinistre", sinistreForm.getSini_num());
				parameterMap.put("numeroDeclaration", mvtsinistreForm.getMvts_num());
				parameterMap.put("dateDeclarationSinistre", sinistreForm.getSini_datedeclaration());
				parameterMap.put("dateSurvenance", sinistreForm.getSini_datesurvenance());
				parameterMap.put("contrat", sinistreForm.getSini_police());

				parameterMap.put("montantPrincipal", sinistreForm.getSini_evaluationprincipale());
				parameterMap.put("montantFrais", sinistreForm.getSini_evaluationfrais());
				parameterMap.put("montantHonoraires", sinistreForm.getSini_evaluationhonoraires());
				parameterMap.put("montantGlobal", sinistreForm.getSini_evaluationglobale());
				parameterMap.put("montantLettre",
						FrenchNumberToWords.convert(sinistreForm.getSini_evaluationglobale()));

				// Récupérer l'acte et le mettre dans l'affaire:
				Acte acte = acteRepository.getActePolice(sinistreForm.getSini_police());
				if (acte != null) {
					parameterMap.put("description",
							sinistreForm.getSini_description() + " : numéro acte " + acte.getAct_numero());
				} else {
					parameterMap.put("description", sinistreForm.getSini_description());
				}

				// Récupérer le libellé de la branche
				Branche branche = brancheRepository.findBrancheByNumero(sinistreForm.getSini_branche());
				if (branche != null) {
					parameterMap.put("branche", branche.getBranche_libelleLong());
				} else {
					parameterMap.put("branche", "");
				}
				
				

				// En fonction de la branche definir les infos du bénéficiaire
				if (sinistreForm.getSini_branche() == brancheCaution) {

					// =================================================================================
					// Recupérer le client et remplir ses informations
					Client client = clientRepository.findByNumClient(sinistreForm.getSini_souscripteur());
					if (client != null
							&& (client.getClien_denomination() == null || client.getClien_denomination().equals(""))) {

						parameterMap.put("client", client.getClien_prenom() + " " + client.getClien_nom());
						parameterMap.put("clientAdresse",
								client.getClien_adressenumero() + " / " + client.getClien_adresseville());

					} else if (client != null
							&& (client.getClien_prenom() == null || client.getClien_prenom().equals(""))
							&& (client.getClien_nom() == null || client.getClien_nom().equals(""))) {

						parameterMap.put("client", client.getClien_denomination());
						parameterMap.put("clientAdresse",
								client.getClien_adressenumero() + " / " + client.getClien_adresseville());

					} else if (client != null && client.getClien_prenom() != null
							&& !client.getClien_prenom().equals("") && client.getClien_nom() != null
							&& !client.getClien_nom().equals("") && client.getClien_denomination() != null
							&& !client.getClien_denomination().equals("")) {

						parameterMap.put("client", client.getClien_prenom() + " " + client.getClien_nom() + " / "
								+ client.getClien_denomination());
						parameterMap.put("clientAdresse",
								client.getClien_adressenumero() + " / " + client.getClien_adresseville());

					} else {
						parameterMap.put("client", "");
						parameterMap.put("clientAdresse", "");
					}
					
					
					// ==============================================================================
					// Récupéré le bénéficiaire et remplir ses informations car on est en CAUTION
					Optional<Beneficiaire> beneficiaireOptional = beneficiaireRepository
							.findById(sinistreForm.getSini_beneficiaire());
					if (beneficiaireOptional.isPresent()) {
						Beneficiaire beneficiaire = beneficiaireOptional.get();

						if (beneficiaire != null
								&& (beneficiaire.getBenef_denom() == null || beneficiaire.getBenef_denom().equals(""))
								&& beneficiaire.getBenef_prenoms() != null && !beneficiaire.getBenef_prenoms().equals("")
								&& beneficiaire.getBenef_nom() != null && !beneficiaire.getBenef_nom().equals("")) {

							parameterMap.put("beneficiaire",
									beneficiaire.getBenef_prenoms() + " " + beneficiaire.getBenef_nom());

						} else if (beneficiaire != null
								&& (beneficiaire.getBenef_denom() != null && !beneficiaire.getBenef_denom().equals(""))
								&& (beneficiaire.getBenef_prenoms() == null || beneficiaire.getBenef_prenoms().equals(""))
								&& (beneficiaire.getBenef_nom() == null || beneficiaire.getBenef_nom().equals(""))) {

							parameterMap.put("beneficiaire", beneficiaire.getBenef_denom());

						} else if (beneficiaire != null
								&& (beneficiaire.getBenef_denom() != null && !beneficiaire.getBenef_denom().equals(""))
								&& beneficiaire.getBenef_prenoms() != null && !beneficiaire.getBenef_prenoms().equals("")
								&& beneficiaire.getBenef_nom() != null && !beneficiaire.getBenef_nom().equals("")) {

							parameterMap.put("beneficiaire", beneficiaire.getBenef_prenoms() + " "
									+ beneficiaire.getBenef_nom() + " / " + beneficiaire.getBenef_denom());

						} else {
							parameterMap.put("beneficiaire", "");
						}
					}

					// Le bénéficiaire est la contractante et son adresse = adresse de localisation
					// du risque
					Risque risque = risqueRepository.findByIdd(sinistreForm.getSini_risque());
					if (risque != null && !risque.getRisq_localisation1().equals("")) {
						parameterMap.put("beneficiaireAdresse", risque.getRisq_localisation1());
					} else {
						parameterMap.put("beneficiaireAdresse", "");
					}
					

				} else {

					// ============== ON EST EN CREDIT OU PERTE PECUNIAIRE ==========================
					// Recupérer le client et remplir ses informations
					// Le bénéficiaire est le client et son adresse = adresse du client

					Client client = clientRepository.findByNumClient(sinistreForm.getSini_souscripteur());
					if (client != null
							&& (client.getClien_denomination() == null || client.getClien_denomination().equals(""))) {

						parameterMap.put("client", client.getClien_prenom() + " " + client.getClien_nom());
						parameterMap.put("clientAdresse",
								client.getClien_adressenumero() + " / " + client.getClien_adresseville());
						
						parameterMap.put("beneficiaire", client.getClien_prenom() + " " + client.getClien_nom());
						parameterMap.put("beneficiaireAdresse",
								client.getClien_adressenumero() + " / " + client.getClien_adresseville());

					} else if (client != null
							&& (client.getClien_prenom() == null || client.getClien_prenom().equals(""))
							&& (client.getClien_nom() == null || client.getClien_nom().equals(""))) {

						parameterMap.put("client", client.getClien_denomination());
						parameterMap.put("clientAdresse",
								client.getClien_adressenumero() + " / " + client.getClien_adresseville());
						
						parameterMap.put("beneficiaire", client.getClien_denomination());
						parameterMap.put("beneficiaireAdresse",
								client.getClien_adressenumero() + " / " + client.getClien_adresseville());

					} else if (client != null && client.getClien_prenom() != null
							&& !client.getClien_prenom().equals("") && client.getClien_nom() != null
							&& !client.getClien_nom().equals("") && client.getClien_denomination() != null
							&& !client.getClien_denomination().equals("")) {

						parameterMap.put("client", client.getClien_prenom() + " " + client.getClien_nom() + " / "
								+ client.getClien_denomination());
						parameterMap.put("clientAdresse",
								client.getClien_adressenumero() + " / " + client.getClien_adresseville());
						
						parameterMap.put("beneficiaire", client.getClien_prenom() + " " + client.getClien_nom() + " / "
								+ client.getClien_denomination());
						parameterMap.put("beneficiaireAdresse",
								client.getClien_adressenumero() + " / " + client.getClien_adresseville());

					} else {
						parameterMap.put("client", "");
						parameterMap.put("clientAdresse", "");
						parameterMap.put("beneficiaireAdresse", "");
					}
				}

				
				/*
				 * Récupérer les infos de l'acheteur
				 */
				Acheteur acheteur = acheteurRepository.findByIdd(sinistreForm.getSini_acheteur());
				if (acheteur != null) {
					parameterMap.put("acheteur", acheteur.getAchet_prenom() + " " + acheteur.getAchet_nom());
				} else {
					parameterMap.put("acheteur", "");
				}

				// Mettre les informations de l'option en fonction de la branche
				if (sinistreForm.getSini_branche() == brancheCaution) {
//					parameterMap.put("option", "Voir objet du sinistre " + parameterMap.get("beneficiaire"));
					parameterMap.put("option", "Voir objet du sinistre ");

				} else {
					parameterMap.put("option", "Votre client " + parameterMap.get("acheteur"));
				}

				// Mettre les documents manquants
				if (document.equalsIgnoreCase("vide")) {
					documentFinale = document.replaceAll(document, " ");
					parameterMap.put("documents", documentFinale);
				} else {
					documentFinale = document.replaceAll(caractSup, "  /  ");
					parameterMap.put("documents",
							"Veuillez nous faire parvenir dans les meilleurs délais possibles les documents suivants : \n"
									+ documentFinale);
				}

				List<Sinistre> sinistres = sinistreRepository.findAll();
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(sinistres);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_SINISTRE + ParamConst.EXTENSION_PDF);
				response.addHeader(" Access-Control-Allow-Origin ", " * ");

				JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	/*
	 ******* Génération edition fiche modification évaluation ********
	 */
	public void generateEditionFicheModificationEvaluation(HttpServletResponse response, String demandeur,
			String document, SinistreFront sinistreFront) {

		String caractSup = "_";
		String demandeurNew = "";
		String documentFinale = "";

		demandeurNew = demandeur.replaceAll(caractSup, " ");

		Sinistre sinistreForm = sinistreFront.getSinistreForm();
		Mvtsinistre mvtsinistreForm = sinistreFront.getMvtsinistreForm();

		InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
				+ ParamConst.FILENAME_REPORT_MODIFICATION_EVALUATION + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {
			design = JRXmlLoader.load(jasperStream);

			JasperReport report = JasperCompileManager.compileReport(design);

			Map<String, Object> parameterMap = new HashMap<String, Object>();

			parameterMap.put("demandeur", demandeurNew);
			parameterMap.put("numeroSinistre", sinistreForm.getSini_num());
			parameterMap.put("dateDeclarationSinistre", sinistreForm.getSini_datedeclaration());
			parameterMap.put("dateSurvenance", sinistreForm.getSini_datesurvenance());
			parameterMap.put("contrat", sinistreForm.getSini_police());

			parameterMap.put("montantPrincipal", sinistreForm.getSini_evaluationprincipale());
			parameterMap.put("montantFrais", sinistreForm.getSini_evaluationfrais());
			parameterMap.put("montantHonoraires", sinistreForm.getSini_evaluationhonoraires());
			parameterMap.put("montantGlobal", sinistreForm.getSini_evaluationglobale());
			parameterMap.put("montantLettre", FrenchNumberToWords.convert(sinistreForm.getSini_evaluationglobale()));

			// Récupérer l'acte et le mettre dans l'affaire:
			Acte acte = acteRepository.getActePolice(sinistreForm.getSini_police());
			if (acte != null) {
				parameterMap.put("description",
						sinistreForm.getSini_description() + " : numéro acte " + acte.getAct_numero());
			} else {
				parameterMap.put("description", sinistreForm.getSini_description());
			}

			// Récupérer le libellé de la branche
			/*
			 * Branche branche =
			 * brancheRepository.findBrancheByNumero(sinistreForm.getSini_branche()); if
			 * (branche != null) { parameterMap.put("branche",
			 * branche.getBranche_libelleLong()); } else { parameterMap.put("branche", "");
			 * }
			 */

			// En fonction de la branche definir l'adresse du bénéficiaire
			if (sinistreForm.getSini_branche() == brancheCaution) {

				// Recupérer le client et remplir ses informations
				Client client = clientRepository.findByNumClient(sinistreForm.getSini_souscripteur());
				if (client != null
						&& (client.getClien_denomination() == null || client.getClien_denomination().equals(""))) {

					parameterMap.put("client", client.getClien_prenom() + " " + client.getClien_nom());
					parameterMap.put("clientAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());

				} else if (client != null && (client.getClien_prenom() == null || client.getClien_prenom().equals(""))
						&& (client.getClien_nom() == null || client.getClien_nom().equals(""))) {

					parameterMap.put("client", client.getClien_denomination());
					parameterMap.put("clientAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());

				} else if (client != null && client.getClien_prenom() != null && !client.getClien_prenom().equals("")
						&& client.getClien_nom() != null && !client.getClien_nom().equals("")
						&& client.getClien_denomination() != null && !client.getClien_denomination().equals("")) {

					parameterMap.put("client", client.getClien_prenom() + " " + client.getClien_nom() + " / "
							+ client.getClien_denomination());
					parameterMap.put("clientAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());

				} else {
					parameterMap.put("client", "");
					parameterMap.put("clientAdresse", "");
				}

				// Le bénéficiaire est la contractante et son adresse = adresse de localisation
				// du risque
				Risque risque = risqueRepository.findByIdd(sinistreForm.getSini_risque());
				if (risque != null && !risque.getRisq_localisation1().equals("")) {
					parameterMap.put("beneficiaireAdresse", risque.getRisq_localisation1());
				} else {
					parameterMap.put("beneficiaireAdresse", "");
				}

			} else {

				// Recupérer le client et remplir ses informations
				// Le bénéficiaire est le client et son adresse = adresse du client

				Client client = clientRepository.findByNumClient(sinistreForm.getSini_souscripteur());
				if (client != null
						&& (client.getClien_denomination() == null || client.getClien_denomination().equals(""))) {

					parameterMap.put("client", client.getClien_prenom() + " " + client.getClien_nom());
					parameterMap.put("clientAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());
					parameterMap.put("beneficiaireAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());

				} else if (client != null && (client.getClien_prenom() == null || client.getClien_prenom().equals(""))
						&& (client.getClien_nom() == null || client.getClien_nom().equals(""))) {

					parameterMap.put("client", client.getClien_denomination());
					parameterMap.put("clientAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());
					parameterMap.put("beneficiaireAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());

				} else if (client != null && client.getClien_prenom() != null && !client.getClien_prenom().equals("")
						&& client.getClien_nom() != null && !client.getClien_nom().equals("")
						&& client.getClien_denomination() != null && !client.getClien_denomination().equals("")) {

					parameterMap.put("client", client.getClien_prenom() + " " + client.getClien_nom() + " / "
							+ client.getClien_denomination());
					parameterMap.put("clientAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());
					parameterMap.put("beneficiaireAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());

				} else {
					parameterMap.put("client", "");
					parameterMap.put("clientAdresse", "");
					parameterMap.put("beneficiaireAdresse", "");
				}
			}

			// Récupéré le bénéficiaire et remplir ses informations
			Optional<Beneficiaire> beneficiaireOptional = beneficiaireRepository
					.findById(sinistreForm.getSini_beneficiaire());
			if (beneficiaireOptional.isPresent()) {
				Beneficiaire beneficiaire = beneficiaireOptional.get();

				if (beneficiaire != null
						&& (beneficiaire.getBenef_denom() == null || beneficiaire.getBenef_denom().equals(""))
						&& beneficiaire.getBenef_prenoms() != null && !beneficiaire.getBenef_prenoms().equals("")
						&& beneficiaire.getBenef_nom() != null && !beneficiaire.getBenef_nom().equals("")) {

					parameterMap.put("beneficiaire",
							beneficiaire.getBenef_prenoms() + " " + beneficiaire.getBenef_nom());

				} else if (beneficiaire != null
						&& (beneficiaire.getBenef_denom() != null && !beneficiaire.getBenef_denom().equals(""))
						&& (beneficiaire.getBenef_prenoms() == null || beneficiaire.getBenef_prenoms().equals(""))
						&& (beneficiaire.getBenef_nom() == null || beneficiaire.getBenef_nom().equals(""))) {

					parameterMap.put("beneficiaire", beneficiaire.getBenef_denom());

				} else if (beneficiaire != null
						&& (beneficiaire.getBenef_denom() != null && !beneficiaire.getBenef_denom().equals(""))
						&& beneficiaire.getBenef_prenoms() != null && !beneficiaire.getBenef_prenoms().equals("")
						&& beneficiaire.getBenef_nom() != null && !beneficiaire.getBenef_nom().equals("")) {

					parameterMap.put("beneficiaire", beneficiaire.getBenef_prenoms() + " " + beneficiaire.getBenef_nom()
							+ " / " + beneficiaire.getBenef_denom());

				} else {
					parameterMap.put("beneficiaire", "");
				}
			}

			/*
			 * Récupérer les infos de l'acheteur
			 */
			Acheteur acheteur = acheteurRepository.findByIdd(sinistreForm.getSini_acheteur());
			if (acheteur != null) {
				parameterMap.put("acheteur", acheteur.getAchet_prenom() + " " + acheteur.getAchet_nom());
			} else {
				parameterMap.put("acheteur", "");
			}

			// Mettre les informations de l'option en fonction de la branche
			if (sinistreForm.getSini_branche() == brancheCaution) {
				parameterMap.put("option", "Voir objet du sinistre ");

			} else {
				parameterMap.put("option", "Votre client " + parameterMap.get("acheteur"));
			}

			// Mettre les documents manquants
			if (document.equalsIgnoreCase("vide")) {
				documentFinale = document.replaceAll(document, " ");
				parameterMap.put("documents", documentFinale);
			} else {
				documentFinale = document.replaceAll(caractSup, "  /  ");
				parameterMap.put("documents",
						"Veuillez nous faire parvenir dans les meilleurs délais possibles les documents suivants : \n\n"
								+ documentFinale);
			}

			List<Sinistre> sinistres = sinistreRepository.findAll();
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(sinistres);

			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
			final OutputStream outputStream = response.getOutputStream();

			response.setContentType("application/x-pdf");
			response.setHeader("Content-Disposition", "inline; filename="
					+ ParamConst.FILENAME_REPORT_MODIFICATION_EVALUATION + ParamConst.EXTENSION_PDF);
			response.addHeader(" Access-Control-Allow-Origin ", " * ");

			JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

		} catch (

		JRException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	/*
	 ******* Génération edition fiche modification SAP ********
	 */
	public void generateEditionFicheModificationSAP(HttpServletResponse response, String demandeur, String document,
			SinistreFront sinistreFront) {

		String caractSup = "_";
		String demandeurNew = "";
		String documentFinale = "";

		demandeurNew = demandeur.replaceAll(caractSup, " ");

		Sinistre sinistreForm = sinistreFront.getSinistreForm();
		Mvtsinistre mvtsinistreForm = sinistreFront.getMvtsinistreForm();

		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_MODIFICATION_SAP + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {
			design = JRXmlLoader.load(jasperStream);

			JasperReport report = JasperCompileManager.compileReport(design);

			Map<String, Object> parameterMap = new HashMap<String, Object>();

			parameterMap.put("demandeur", demandeurNew);
			parameterMap.put("numeroSinistre", sinistreForm.getSini_num());
			parameterMap.put("dateDeclarationSinistre", sinistreForm.getSini_datedeclaration());
			parameterMap.put("dateSurvenance", sinistreForm.getSini_datesurvenance());
			parameterMap.put("contrat", sinistreForm.getSini_police());

			parameterMap.put("montantPrincipal", sinistreForm.getSini_sapprincipale());
			parameterMap.put("montantFrais", sinistreForm.getSini_sapfrais());
			parameterMap.put("montantHonoraires", sinistreForm.getSini_saphonoraires());
			parameterMap.put("montantGlobal", sinistreForm.getSini_sapglobale());
			parameterMap.put("montantLettre", FrenchNumberToWords.convert(sinistreForm.getSini_sapglobale()));

			// Récupérer l'acte et le mettre dans l'affaire:
			Acte acte = acteRepository.getActePolice(sinistreForm.getSini_police());
			if (acte != null) {
				parameterMap.put("description",
						sinistreForm.getSini_description() + " : numéro acte " + acte.getAct_numero());
			} else {
				parameterMap.put("description", sinistreForm.getSini_description());
			}

			// Récupérer le libellé de la branche
			/*
			 * Branche branche =
			 * brancheRepository.findBrancheByNumero(sinistreForm.getSini_branche()); if
			 * (branche != null) { parameterMap.put("branche",
			 * branche.getBranche_libelleLong()); } else { parameterMap.put("branche", "");
			 * }
			 */

			// En fonction de la branche definir l'adresse du bénéficiaire
			if (sinistreForm.getSini_branche() == brancheCaution) {

				// Recupérer le client et remplir ses informations
				Client client = clientRepository.findByNumClient(sinistreForm.getSini_souscripteur());
				if (client != null
						&& (client.getClien_denomination() == null || client.getClien_denomination().equals(""))) {

					parameterMap.put("client", client.getClien_prenom() + " " + client.getClien_nom());
					parameterMap.put("clientAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());

				} else if (client != null && (client.getClien_prenom() == null || client.getClien_prenom().equals(""))
						&& (client.getClien_nom() == null || client.getClien_nom().equals(""))) {

					parameterMap.put("client", client.getClien_denomination());
					parameterMap.put("clientAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());

				} else if (client != null && client.getClien_prenom() != null && !client.getClien_prenom().equals("")
						&& client.getClien_nom() != null && !client.getClien_nom().equals("")
						&& client.getClien_denomination() != null && !client.getClien_denomination().equals("")) {

					parameterMap.put("client", client.getClien_prenom() + " " + client.getClien_nom() + " / "
							+ client.getClien_denomination());
					parameterMap.put("clientAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());

				} else {
					parameterMap.put("client", "");
					parameterMap.put("clientAdresse", "");
				}

				// Le bénéficiaire est la contractante et son adresse = adresse de localisation
				// du risque
				Risque risque = risqueRepository.findByIdd(sinistreForm.getSini_risque());
				if (risque != null && !risque.getRisq_localisation1().equals("")) {
					parameterMap.put("beneficiaireAdresse", risque.getRisq_localisation1());
				} else {
					parameterMap.put("beneficiaireAdresse", "");
				}

			} else {

				// Recupérer le client et remplir ses informations
				// Le bénéficiaire est le client et son adresse = adresse du client

				Client client = clientRepository.findByNumClient(sinistreForm.getSini_souscripteur());
				if (client != null
						&& (client.getClien_denomination() == null || client.getClien_denomination().equals(""))) {

					parameterMap.put("client", client.getClien_prenom() + " " + client.getClien_nom());
					parameterMap.put("clientAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());
					parameterMap.put("beneficiaireAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());

				} else if (client != null && (client.getClien_prenom() == null || client.getClien_prenom().equals(""))
						&& (client.getClien_nom() == null || client.getClien_nom().equals(""))) {

					parameterMap.put("client", client.getClien_denomination());
					parameterMap.put("clientAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());
					parameterMap.put("beneficiaireAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());

				} else if (client != null && client.getClien_prenom() != null && !client.getClien_prenom().equals("")
						&& client.getClien_nom() != null && !client.getClien_nom().equals("")
						&& client.getClien_denomination() != null && !client.getClien_denomination().equals("")) {

					parameterMap.put("client", client.getClien_prenom() + " " + client.getClien_nom() + " / "
							+ client.getClien_denomination());
					parameterMap.put("clientAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());
					parameterMap.put("beneficiaireAdresse",
							client.getClien_adressenumero() + " / " + client.getClien_adresseville());

				} else {
					parameterMap.put("client", "");
					parameterMap.put("clientAdresse", "");
					parameterMap.put("beneficiaireAdresse", "");
				}
			}

			// Récupéré le bénéficiaire et remplir ses informations
			Optional<Beneficiaire> beneficiaireOptional = beneficiaireRepository
					.findById(sinistreForm.getSini_beneficiaire());
			if (beneficiaireOptional.isPresent()) {
				Beneficiaire beneficiaire = beneficiaireOptional.get();

				if (beneficiaire != null
						&& (beneficiaire.getBenef_denom() == null || beneficiaire.getBenef_denom().equals(""))
						&& beneficiaire.getBenef_prenoms() != null && !beneficiaire.getBenef_prenoms().equals("")
						&& beneficiaire.getBenef_nom() != null && !beneficiaire.getBenef_nom().equals("")) {

					parameterMap.put("beneficiaire",
							beneficiaire.getBenef_prenoms() + " " + beneficiaire.getBenef_nom());

				} else if (beneficiaire != null
						&& (beneficiaire.getBenef_denom() != null && !beneficiaire.getBenef_denom().equals(""))
						&& (beneficiaire.getBenef_prenoms() == null || beneficiaire.getBenef_prenoms().equals(""))
						&& (beneficiaire.getBenef_nom() == null || beneficiaire.getBenef_nom().equals(""))) {

					parameterMap.put("beneficiaire", beneficiaire.getBenef_denom());

				} else if (beneficiaire != null
						&& (beneficiaire.getBenef_denom() != null && !beneficiaire.getBenef_denom().equals(""))
						&& beneficiaire.getBenef_prenoms() != null && !beneficiaire.getBenef_prenoms().equals("")
						&& beneficiaire.getBenef_nom() != null && !beneficiaire.getBenef_nom().equals("")) {

					parameterMap.put("beneficiaire", beneficiaire.getBenef_prenoms() + " " + beneficiaire.getBenef_nom()
							+ " / " + beneficiaire.getBenef_denom());

				} else {
					parameterMap.put("beneficiaire", "");
				}
			}

			/*
			 * Récupérer les infos de l'acheteur
			 */
			Acheteur acheteur = acheteurRepository.findByIdd(sinistreForm.getSini_acheteur());
			if (acheteur != null) {
				parameterMap.put("acheteur", acheteur.getAchet_prenom() + " " + acheteur.getAchet_nom());
			} else {
				parameterMap.put("acheteur", "");
			}

			// Mettre les informations de l'option en fonction de la branche
			if (sinistreForm.getSini_branche() == brancheCaution) {
				parameterMap.put("option", "Voir objet du sinistre ");

			} else {
				parameterMap.put("option", "Votre client " + parameterMap.get("acheteur"));
			}

			// Mettre les documents manquants
			if (document.equalsIgnoreCase("vide")) {
				documentFinale = document.replaceAll(document, " ");
				parameterMap.put("documents", documentFinale);
			} else {
				documentFinale = document.replaceAll(caractSup, "  /  ");
				parameterMap.put("documents",
						"Veuillez nous faire parvenir dans les meilleurs délais possibles les documents suivants : \n\n"
								+ documentFinale);
			}

			List<Sinistre> sinistres = sinistreRepository.findAll();
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(sinistres);

			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
			final OutputStream outputStream = response.getOutputStream();

			response.setContentType("application/x-pdf");
			response.setHeader("Content-Disposition", "inline; filename="
					+ ParamConst.FILENAME_REPORT_MODIFICATION_EVALUATION + ParamConst.EXTENSION_PDF);
			response.addHeader(" Access-Control-Allow-Origin ", " * ");

			JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

		} catch (

		JRException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	public void generateReportSinistre(HttpServletResponse response, String reportFormat, String title,
			String demandeur, Long numBranche, Long numProduit, String debut, String fin, Long numClient,
			Long numPolice) {

		String caractSup = "_";
		String titleNew = "";
		String demandeurNew = "";

		titleNew = title.replaceAll(caractSup, " ");
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		/*
		 * Traitement pour un fichier PDF
		 */
		if (reportFormat.equalsIgnoreCase(PDF)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(
					ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_SINISTRES_PDF + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<SinistreClient> sinistreConsulte;

				if (numBranche != 0 && numProduit == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numClient == 0 && numPolice == 0) {
					sinistreConsulte = sinistreRepository.listeSinistreParBranche(numBranche);
				} else if (numBranche == 0 && numProduit != 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numClient == 0 && numPolice == 0) {
					sinistreConsulte = sinistreRepository.listeSinistreParProduit(numProduit);
				} else if (numBranche == 0 && numProduit == 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numClient == 0 && numPolice == 0) {
					sinistreConsulte = sinistreRepository.listeSinistreParPeriode(debut, fin);
				} else if (numBranche == 0 && numProduit == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numClient != 0 && numPolice == 0) {
					sinistreConsulte = sinistreRepository.listeSinistreParClient(numClient);
				} else if (numBranche == 0 && numProduit == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numClient == 0 && numPolice != 0) {
					sinistreConsulte = sinistreRepository.listeSinistreParPolice(numPolice);
				} else if (numBranche != 0 && numProduit != 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numClient == 0 && numPolice == 0) {
					sinistreConsulte = sinistreRepository.listeSinistreParBrancheAndProduit(numBranche, numProduit);
				} else if (numBranche != 0 && numProduit != 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numClient == 0 && numPolice == 0) {
					sinistreConsulte = sinistreRepository.listeSinistreParBrancheAndProduitAndPeriode(numBranche,
							numProduit, debut, fin);
				} else if (numBranche != 0 && numProduit != 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numClient != 0 && numPolice == 0) {
					sinistreConsulte = sinistreRepository.listeSinistreParBrancheAndProduitAndPeriodeAndClient(
							numBranche, numProduit, debut, fin, numClient);
				} else if (numBranche != 0 && numProduit != 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numClient != 0 && numPolice != 0) {
					sinistreConsulte = sinistreRepository.listeSinistreParBrancheAndProduitAndPeriodeAndClientAndPolice(
							numBranche, numProduit, debut, fin, numClient, numPolice);
				} else {
					sinistreConsulte = sinistreRepository.getAllSinistre();
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(sinistreConsulte);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_SINISTRES_PDF + ParamConst.EXTENSION_PDF);
				response.addHeader(" Access-Control-Allow-Origin ", " * ");

				JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		/*
		 * Traitement pour un fichier excel (XLS)
		 */
		if (reportFormat.equalsIgnoreCase(EXCEL)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
					+ ParamConst.FILENAME_REPORT_SINISTRES_EXCEL + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<SinistreClient> sinistreConsulte;

				if (numBranche != 0 && numProduit == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numClient == 0 && numPolice == 0) {
					sinistreConsulte = sinistreRepository.listeSinistreParBranche(numBranche);
				} else if (numBranche == 0 && numProduit != 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numClient == 0 && numPolice == 0) {
					sinistreConsulte = sinistreRepository.listeSinistreParProduit(numProduit);
				} else if (numBranche == 0 && numProduit == 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numClient == 0 && numPolice == 0) {
					sinistreConsulte = sinistreRepository.listeSinistreParPeriode(debut, fin);
				} else if (numBranche == 0 && numProduit == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numClient != 0 && numPolice == 0) {
					sinistreConsulte = sinistreRepository.listeSinistreParClient(numClient);
				} else if (numBranche == 0 && numProduit == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numClient == 0 && numPolice != 0) {
					sinistreConsulte = sinistreRepository.listeSinistreParPolice(numPolice);
				} else if (numBranche != 0 && numProduit != 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numClient == 0 && numPolice == 0) {
					sinistreConsulte = sinistreRepository.listeSinistreParBrancheAndProduit(numBranche, numProduit);
				} else if (numBranche != 0 && numProduit != 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numClient == 0 && numPolice == 0) {
					sinistreConsulte = sinistreRepository.listeSinistreParBrancheAndProduitAndPeriode(numBranche,
							numProduit, debut, fin);
				} else if (numBranche != 0 && numProduit != 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numClient != 0 && numPolice == 0) {
					sinistreConsulte = sinistreRepository.listeSinistreParBrancheAndProduitAndPeriodeAndClient(
							numBranche, numProduit, debut, fin, numClient);
				} else if (numBranche != 0 && numProduit != 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numClient != 0 && numPolice != 0) {
					sinistreConsulte = sinistreRepository.listeSinistreParBrancheAndProduitAndPeriodeAndClientAndPolice(
							numBranche, numProduit, debut, fin, numClient, numPolice);
				} else {
					sinistreConsulte = sinistreRepository.getAllSinistre();
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(sinistreConsulte);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-xlsx");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_SINISTRES_EXCEL + ParamConst.EXTENSION_EXCEL);

				JRXlsxExporter exporterXLS = new JRXlsxExporter();
				exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT, jasperPrint);
				exporterXLS.setParameter(JRExporterParameter.OUTPUT_STREAM, outputStream);

				// Supprimer les sauts de ligne sur excel
				exporterXLS.setParameter(JRXlsExporterParameter.IS_ONE_PAGE_PER_SHEET, Boolean.FALSE);
				exporterXLS.setParameter(JRXlsExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS, Boolean.TRUE);

				exporterXLS.exportReport();

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public List<SinistreFacture> getAllSinistralite() {
		return sinistreRepository.getAllSinistralite();
	}

	public void generateReportSinistralite(HttpServletResponse response, String reportFormat, String title,
			String demandeur, Long numBranche, String debut, String fin, Long numClient, Long numPolice) {

		String caractSup = "_";
		String titleNew = "";
		String demandeurNew = "";

		titleNew = title.replaceAll(caractSup, " ");
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		/*
		 * Traitement pour un fichier PDF
		 */
		if (reportFormat.equalsIgnoreCase(PDF)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
					+ ParamConst.FILENAME_REPORT_SINISTRALITE_PDF + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<SinistreFacture> sinistreConsulte = null;

				if (numBranche != 0 && (debut.equals("0") || debut.equals("")) && (fin.equals("0") || fin.equals(""))
						&& numClient == 0 && numPolice == 0) {
					// sinistreConsulte = sinistreRepository.listeSinistreParBranche(numBranche);
				} else if (numBranche == 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numClient == 0 && numPolice == 0) {
					// sinistreConsulte = sinistreRepository.listeSinistreParPeriode(debut, fin);
				} else if (numBranche == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numClient != 0 && numPolice == 0) {
					// sinistreConsulte = sinistreRepository.listeSinistreParClient(numClient);
				} else if (numBranche == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numClient == 0 && numPolice != 0) {
					// sinistreConsulte = sinistreRepository.listeSinistreParPolice(numPolice);
				} else if (numBranche != 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numClient == 0 && numPolice == 0) {
					// sinistreConsulte =
					// sinistreRepository.listeSinistreParBrancheAndProduitAndPeriode(numBranche,
					// debut, fin);
				} else if (numBranche != 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numClient != 0 && numPolice == 0) {
					// sinistreConsulte =
					// sinistreRepository.listeSinistreParBrancheAndProduitAndPeriodeAndClient(
					// numBranche, debut, fin, numClient);
				} else if (numBranche != 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numClient != 0 && numPolice != 0) {
					// sinistreConsulte =
					// sinistreRepository.listeSinistreParBrancheAndProduitAndPeriodeAndClientAndPolice(
					// numBranche, numProduit, debut, fin, numClient, numPolice);
				} else {
					sinistreConsulte = sinistreRepository.getAllSinistralite();
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(sinistreConsulte);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_SINISTRES_PDF + ParamConst.EXTENSION_PDF);
				response.addHeader(" Access-Control-Allow-Origin ", " * ");

				JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		/*
		 * Traitement pour un fichier excel (XLS)
		 */
		if (reportFormat.equalsIgnoreCase(EXCEL)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
					+ ParamConst.FILENAME_REPORT_SINISTRALITE_EXCEL + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<SinistreFacture> sinistreConsulte = null;

				if (numBranche != 0 && (debut.equals("0") || debut.equals("")) && (fin.equals("0") || fin.equals(""))
						&& numClient == 0 && numPolice == 0) {
					// sinistreConsulte = sinistreRepository.listeSinistreParBranche(numBranche);
				} else if (numBranche == 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numClient == 0 && numPolice == 0) {
					// sinistreConsulte = sinistreRepository.listeSinistreParPeriode(debut, fin);
				} else if (numBranche == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numClient != 0 && numPolice == 0) {
					// sinistreConsulte = sinistreRepository.listeSinistreParClient(numClient);
				} else if (numBranche == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numClient == 0 && numPolice != 0) {
					// sinistreConsulte = sinistreRepository.listeSinistreParPolice(numPolice);
				} else if (numBranche != 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numClient == 0 && numPolice == 0) {
					// sinistreConsulte =
					// sinistreRepository.listeSinistreParBrancheAndProduitAndPeriode(numBranche,
					// debut, fin);
				} else if (numBranche != 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numClient != 0 && numPolice == 0) {
					// sinistreConsulte =
					// sinistreRepository.listeSinistreParBrancheAndProduitAndPeriodeAndClient(
					// numBranche, debut, fin, numClient);
				} else if (numBranche != 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numClient != 0 && numPolice != 0) {
					// sinistreConsulte =
					// sinistreRepository.listeSinistreParBrancheAndProduitAndPeriodeAndClientAndPolice(
					// numBranche, numProduit, debut, fin, numClient, numPolice);
				} else {
					sinistreConsulte = sinistreRepository.getAllSinistralite();
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(sinistreConsulte);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-xlsx");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_SINISTRES_EXCEL + ParamConst.EXTENSION_EXCEL);

				JRXlsxExporter exporterXLS = new JRXlsxExporter();
				exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT, jasperPrint);
				exporterXLS.setParameter(JRExporterParameter.OUTPUT_STREAM, outputStream);

				// Supprimer les sauts de ligne sur excel
				exporterXLS.setParameter(JRXlsExporterParameter.IS_ONE_PAGE_PER_SHEET, Boolean.FALSE);
				exporterXLS.setParameter(JRXlsExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS, Boolean.TRUE);

				exporterXLS.exportReport();

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public void generateFicheSinistreCloture(HttpServletResponse response, String demandeur,
			RecoursFront recoursFront) {
		String caractSup = "_";
		String demandeurNew = "";
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		Mvtsinistre mvtsinistreForm = recoursFront.getMvtsinistreForm();
		Sinistre sinistreForm = sinistreRepository.findSinistreByNumero(mvtsinistreForm.getMvts_numsinistre());

		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_CLOTURE_SINISTRE + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {
			design = JRXmlLoader.load(jasperStream);

			JasperReport report = JasperCompileManager.compileReport(design);

			Map<String, Object> parameterMap = new HashMap<String, Object>();

			parameterMap.put("demandeur", demandeurNew);
			parameterMap.put("dateEdition", mvtsinistreForm.getMvts_datesaisie());
			parameterMap.put("numeroSinistre", sinistreForm.getSini_num());
			parameterMap.put("dateSurvenance", mvtsinistreForm.getMvts_datesaisie());
			parameterMap.put("contrat", mvtsinistreForm.getMvts_poli());
			parameterMap.put("description", sinistreForm.getSini_description());
			parameterMap.put("clientNumero", sinistreForm.getSini_souscripteur());
			parameterMap.put("dateCloture", sinistreForm.getSini_datecloture());
			parameterMap.put("sap", sinistreForm.getSini_sapglobale());
			parameterMap.put("reglement", sinistreForm.getSini_reglementglobal());
			parameterMap.put("recours", sinistreForm.getSini_recoursglobalencaisse());
			parameterMap.put("sinistralite", (sinistreForm.getSini_sapglobale() + sinistreForm.getSini_reglementglobal()
					- sinistreForm.getSini_recoursglobalencaisse()));

			Branche branche = brancheRepository.findBrancheByNumero(sinistreForm.getSini_branche());
			if (branche != null) {
				parameterMap.put("branche", branche.getBranche_libelleLong());
			} else {
				parameterMap.put("branche", "");
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

			// Récupéré le bénéficiaire et remplir ses informations
			Optional<Beneficiaire> beneficiaireOptional = beneficiaireRepository
					.findById(sinistreForm.getSini_beneficiaire());
			if (beneficiaireOptional.isPresent()) {
				Beneficiaire beneficiaire = beneficiaireOptional.get();
				parameterMap.put("beneficiairePrenom", beneficiaire.getBenef_prenoms());
				parameterMap.put("beneficiaireNom", beneficiaire.getBenef_nom());
				parameterMap.put("beneficiaireDenomination", beneficiaire.getBenef_denom());
			}

			List<Sinistre> sinistres = sinistreRepository.findAll();
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(sinistres);

			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
			final OutputStream outputStream = response.getOutputStream();

			response.setContentType("application/x-pdf");
			response.setHeader("Content-Disposition",
					"inline; filename=" + ParamConst.FILENAME_REPORT_CLOTURE_SINISTRE + ParamConst.EXTENSION_PDF);
			response.addHeader(" Access-Control-Allow-Origin ", " * ");

			JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

		} catch (JRException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void generateFicheReouvertureSinistre(HttpServletResponse response, String demandeur,
			RecoursFront recoursFront) {
		String caractSup = "_";
		String demandeurNew = "";
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		Mvtsinistre mvtsinistreForm = recoursFront.getMvtsinistreForm();
		Sinistre sinistreForm = sinistreRepository.findSinistreByNumero(mvtsinistreForm.getMvts_numsinistre());

		InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
				+ ParamConst.FILENAME_REPORT_REOUVERTURE_SINISTRE + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {
			design = JRXmlLoader.load(jasperStream);

			JasperReport report = JasperCompileManager.compileReport(design);

			Map<String, Object> parameterMap = new HashMap<String, Object>();

			parameterMap.put("demandeur", demandeurNew);
			parameterMap.put("dateEdition", mvtsinistreForm.getMvts_datemvt());
			parameterMap.put("numeroSinistre", mvtsinistreForm.getMvts_numsinistre());
			parameterMap.put("dateSurvenance", mvtsinistreForm.getMvts_datesaisie());
			parameterMap.put("contrat", mvtsinistreForm.getMvts_poli());
			parameterMap.put("description", sinistreForm.getSini_description());
			parameterMap.put("clientNumero", sinistreForm.getSini_souscripteur());
			parameterMap.put("dateCloture", sinistreForm.getSini_datecloture());
			parameterMap.put("sap", sinistreForm.getSini_sapglobale());
			parameterMap.put("reglement", sinistreForm.getSini_reglementglobal());
			parameterMap.put("recours", sinistreForm.getSini_recoursglobalencaisse());
			parameterMap.put("sinistralite", (sinistreForm.getSini_sapglobale() + sinistreForm.getSini_reglementglobal()
					- sinistreForm.getSini_recoursglobalencaisse()));

			Branche branche = brancheRepository.findBrancheByNumero(sinistreForm.getSini_branche());
			if (branche != null) {
				parameterMap.put("branche", branche.getBranche_libelleLong());
			} else {
				parameterMap.put("branche", "");
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

			// Récupéré le bénéficiaire et remplir ses informations
			Optional<Beneficiaire> beneficiaireOptional = beneficiaireRepository
					.findById(sinistreForm.getSini_beneficiaire());
			if (beneficiaireOptional.isPresent()) {
				Beneficiaire beneficiaire = beneficiaireOptional.get();
				parameterMap.put("beneficiairePrenom", beneficiaire.getBenef_prenoms());
				parameterMap.put("beneficiaireNom", beneficiaire.getBenef_nom());
				parameterMap.put("beneficiaireDenomination", beneficiaire.getBenef_denom());
			}

			List<Sinistre> sinistres = sinistreRepository.findAll();
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(sinistres);

			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
			final OutputStream outputStream = response.getOutputStream();

			response.setContentType("application/x-pdf");
			response.setHeader("Content-Disposition",
					"inline; filename=" + ParamConst.FILENAME_REPORT_REOUVERTURE_SINISTRE + ParamConst.EXTENSION_PDF);
			response.addHeader(" Access-Control-Allow-Origin ", " * ");

			JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

		} catch (JRException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void generateReportAnnulation(HttpServletResponse response, String reportFormat, String title,
			String demandeur, String debut, String fin, Long numProduit, Long numBranche) {

		String caractSup = "_";
		String titleNew = "";
		String demandeurNew = "";

		titleNew = title.replaceAll(caractSup, " ");
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		/*
		 * Traitement pour un fichier PDF
		 */
		if (reportFormat.equalsIgnoreCase(PDF)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(
					ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_SINISTRES_PDF + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<AnnulationPeriodique> sinistreConsulte;

				if (!(debut.equals("0") || debut.equals("")) && !(fin.equals("0") || fin.equals("")) && numProduit == 0
						&& numBranche == 0) {
					sinistreConsulte = sinistreRepository.consultationAnnulation(debut, fin);
				} else if ((debut.equals("0") || debut.equals("")) && (fin.equals("0") || fin.equals(""))
						&& numProduit != 0 && numBranche == 0) {
					sinistreConsulte = sinistreRepository.consultationAnnulationParProduit(numProduit);
				} else if ((debut.equals("0") || debut.equals("")) && (fin.equals("0") || fin.equals(""))
						&& numProduit == 0 && numBranche != 0) {
					sinistreConsulte = sinistreRepository.consultationAnnulationParBranche(numBranche);
				} else if (!(debut.equals("0") || debut.equals("")) && !(fin.equals("0") || fin.equals(""))
						&& numProduit != 0 && numBranche == 0) {
					sinistreConsulte = sinistreRepository.consultationAnnulationParPeriodeAndProduit(debut, fin,
							numProduit);
				} else if (!(debut.equals("0") || debut.equals("")) && !(fin.equals("0") || fin.equals(""))
						&& numProduit != 0 && numBranche != 0) {
					sinistreConsulte = sinistreRepository.consultationAnnulationParPeriodeAndProduitAndBranche(debut,
							fin, numProduit, numBranche);
				} else {
					sinistreConsulte = sinistreRepository.findAllAnnulation();
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(sinistreConsulte);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_SINISTRES_PDF + ParamConst.EXTENSION_PDF);
				response.addHeader(" Access-Control-Allow-Origin ", " * ");

				JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		/*
		 * Traitement pour un fichier excel (XLS)
		 */
		if (reportFormat.equalsIgnoreCase(EXCEL)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
					+ ParamConst.FILENAME_REPORT_SINISTRES_EXCEL + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<AnnulationPeriodique> sinistreConsulte;

				if (!(debut.equals("0") || debut.equals("")) && !(fin.equals("0") || fin.equals("")) && numProduit == 0
						&& numBranche == 0) {
					sinistreConsulte = sinistreRepository.consultationAnnulation(debut, fin);
				} else if ((debut.equals("0") || debut.equals("")) && (fin.equals("0") || fin.equals(""))
						&& numProduit != 0 && numBranche == 0) {
					sinistreConsulte = sinistreRepository.consultationAnnulationParProduit(numProduit);
				} else if ((debut.equals("0") || debut.equals("")) && (fin.equals("0") || fin.equals(""))
						&& numProduit == 0 && numBranche != 0) {
					sinistreConsulte = sinistreRepository.consultationAnnulationParBranche(numBranche);
				} else if (!(debut.equals("0") || debut.equals("")) && !(fin.equals("0") || fin.equals(""))
						&& numProduit != 0 && numBranche == 0) {
					sinistreConsulte = sinistreRepository.consultationAnnulationParPeriodeAndProduit(debut, fin,
							numProduit);
				} else if (!(debut.equals("0") || debut.equals("")) && !(fin.equals("0") || fin.equals(""))
						&& numProduit != 0 && numBranche != 0) {
					sinistreConsulte = sinistreRepository.consultationAnnulationParPeriodeAndProduitAndBranche(debut,
							fin, numProduit, numBranche);
				} else {
					sinistreConsulte = sinistreRepository.findAllAnnulation();
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(sinistreConsulte);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-xlsx");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_SINISTRES_EXCEL + ParamConst.EXTENSION_EXCEL);

				JRXlsxExporter exporterXLS = new JRXlsxExporter();
				exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT, jasperPrint);
				exporterXLS.setParameter(JRExporterParameter.OUTPUT_STREAM, outputStream);

				// Supprimer les sauts de ligne sur excel
				exporterXLS.setParameter(JRXlsExporterParameter.IS_ONE_PAGE_PER_SHEET, Boolean.FALSE);
				exporterXLS.setParameter(JRXlsExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS, Boolean.TRUE);

				exporterXLS.exportReport();

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public List<SinistreClient> rechercheParCritere(Long sini_branche, Long sini_produit, Long sini_souscripteur,
			Long sini_police) {
		String valeur = "select s.sini_num, s.sini_souscripteur, s.sini_branche, s.sini_produit, s.sini_datedeclaration, s.sini_datesurvenance, s.sini_datesaisie, s.sini_lieu, s.sini_typesinistre, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, s.sini_police, b.branche_libelle_long, p.prod_denominationlong, a.achet_prenom, a.achet_nom, m.mvts_typemvt from sinistre as s "
				+ "inner join client as cl on s.sini_souscripteur=cl.clien_numero "
				+ "inner join branche as b on s.sini_branche = b.branche_id "
				+ "inner join produit as p on s.sini_produit = p.prod_numero "
				+ "inner join acheteur as a on s.sini_acheteur = a.achet_numero "
				+ "inner join mvtsinistre as m on m.mvts_numsinistre = s.sini_num ";

		String condition = "where 1 = 1";

		if (sini_branche != 0) {
			condition = condition + " AND s.sini_branche =:sini_branche";
		}

		if (sini_produit != 0) {
			condition = condition + " AND s.sini_produit =:sini_produit";
		}

		/*
		 * if(sini_datedeclaration != null) { condition = condition +
		 * " AND CAST(s.sini_datedeclaration AS VARCHAR) BETWEEN SYMMETRIC :debut AND :fin"
		 * ; }
		 */

		if (sini_souscripteur != 0) {
			condition = condition + " AND s.sini_souscripteur =:sini_souscripteur";
		}

		if (sini_police != 0) {
			condition = condition + " AND s.sini_police =:sini_police";
		}

		String requete = valeur + condition;
		return sinistreRepository.rechercheParCritere(requete);
	}

}
