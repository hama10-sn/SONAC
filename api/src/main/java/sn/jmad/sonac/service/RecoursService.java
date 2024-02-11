package sn.jmad.sonac.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.NumberFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sn.jmad.sonac.service.constantes.FrenchNumberToWords;

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
import sn.jmad.sonac.message.response.RecoursFront;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.message.response.SinistreMouvement;
import sn.jmad.sonac.message.response.ValidationsFront;
import sn.jmad.sonac.model.Acheteur;
import sn.jmad.sonac.model.Beneficiaire;
import sn.jmad.sonac.model.Branche;
import sn.jmad.sonac.model.Client;
import sn.jmad.sonac.model.Mvtsinistre;
import sn.jmad.sonac.model.Produit;
import sn.jmad.sonac.model.Recours;
import sn.jmad.sonac.model.Sinistre;
import sn.jmad.sonac.repository.AcheteurRepository;
import sn.jmad.sonac.repository.BeneficiaireRepository;
import sn.jmad.sonac.repository.BrancheRepository;
import sn.jmad.sonac.repository.ClientRepository;
import sn.jmad.sonac.repository.MvtsinistreRepository;
import sn.jmad.sonac.repository.ProduitRepository;
import sn.jmad.sonac.repository.RecoursRepository;
import sn.jmad.sonac.repository.SinistreRepository;
import sn.jmad.sonac.service.constantes.ParamConst;

@Service
public class RecoursService {
	@Autowired
	private RecoursRepository recoursRepository;
	@Autowired
	private SinistreRepository sinistreRepository;
	@Autowired
	private MvtsinistreRepository mvtsinistreRepository;
	@Autowired
	private ClientRepository clientRepository;
	@Autowired
	private AcheteurRepository acheteurRepository;
	@Autowired
	private BeneficiaireRepository beneficiaireRepository;
	@Autowired
	private BrancheRepository brancheRepository;
	@Autowired
	private ProduitRepository produitRepository;

	@Transactional(rollbackFor = Exception.class)
	public RecoursFront ajoutPropositionRecours(Long sini_id, RecoursFront recoursFront) {
		Mvtsinistre mvtsinistre = recoursFront.getMvtsinistreForm();

		// Recuperation du sinistre et mouvement selectionné
		SinistreMouvement sinmvt = sinistreRepository.getSinistreById(sini_id);

		sinistreRepository.updateSinistreStatus(9L, new Date(), sinmvt.getSini_id());

		// Saving mvtSinistre
		mvtsinistre.setMvts_poli(sinmvt.getSini_police());
		mvtsinistre.setMvts_numsinistre(sinmvt.getSini_num());
		mvtsinistre.setMvts_datesaisie(sinmvt.getSini_datesaisie());
		mvtsinistre.setMvts_montantprincipal(mvtsinistre.getMvts_montantprincipal() != null ? mvtsinistre.getMvts_montantprincipal() : 0L);
		mvtsinistre.setMvts_montantfrais(mvtsinistre.getMvts_montantfrais() != null ? mvtsinistre.getMvts_montantfrais() : 0L);
		mvtsinistre.setMvts_montanthonoraire(mvtsinistre.getMvts_montanthonoraire() != null ? mvtsinistre.getMvts_montanthonoraire() : 0L);
		mvtsinistre.setMvts_montantmvt(mvtsinistre.getMvts_montantprincipal() + mvtsinistre.getMvts_montantfrais()
				+ mvtsinistre.getMvts_montanthonoraire());
		mvtsinistre.setMvts_montantfinancier(0L);
		mvtsinistre.setMvts_status(1);
		mvtsinistre.setMvts_typegestionsinistre("N");
		mvtsinistre.setMvts_beneficiaire(sinmvt.getSini_beneficiaire());
		mvtsinistre.setMvts_tiers(sinmvt.getSini_tiersrecours());
		// utilisateur connecté au lieu de sinmvt.getSini_utilisateur()
		mvtsinistre.setMvts_codeutilisateur(mvtsinistre.getMvts_codeutilisateur());
		mvtsinistre.setMvts_datemodification(new Date());
		mvtsinistre.setMvts_datemvt(new Date());
		mvtsinistre.setMvts_nantissement(sinmvt.getMvts_nantissement());
		mvtsinistre.setMvts_benefnantissement(sinmvt.getMvts_benefnantissement());
		mvtsinistre.setMvts_montantnantissement(sinmvt.getMvts_montantnantissement());
		mvtsinistre.setMvts_autrebeneficiaire(sinmvt.getMvts_adresseautrebeneficiaire());
		mvtsinistre.setMvts_adresseautrebeneficiaire(sinmvt.getMvts_adresseautrebeneficiaire());
		
		// Champs ajouter recement
		mvtsinistre.setMvts_montantfinancierprincipal(sinmvt.getMvts_montantfinancierprincipal());
		mvtsinistre.setMvts_montantfinancierfrais(sinmvt.getMvts_montantfinancierfrais());
		mvtsinistre.setMvts_montantfinancierhonoraires(sinmvt.getMvts_montantfinancierhonoraires());
		
		Mvtsinistre mvtsinistreSave = mvtsinistreRepository.save(mvtsinistre);

		RecoursFront recoursFront2 = new RecoursFront(mvtsinistreSave);
		return recoursFront2;
	}

	@Transactional(rollbackFor = Exception.class)
	public Mvtsinistre annulationPropositionRecours(Long sini_id, RecoursFront recoursFront) {
		Mvtsinistre mvtsinistre = recoursFront.getMvtsinistreForm();

		SinistreMouvement sinmvt = sinistreRepository.getSinistreById(sini_id);

		sinistreRepository.updateSinistreStatus(11L, new Date(), sinmvt.getSini_id());

		mvtsinistre.setMvts_poli(sinmvt.getSini_police());
		mvtsinistre.setMvts_numsinistre(sinmvt.getSini_num());
		mvtsinistre.setMvts_datesaisie(sinmvt.getSini_datesaisie());
		mvtsinistre.setMvts_montantmvt(0L);
		mvtsinistre.setMvts_montantprincipal(0L);
		mvtsinistre.setMvts_montantfrais(0L);
		mvtsinistre.setMvts_montanthonoraire(0L);
		mvtsinistre.setMvts_montantfinancier(0L);
		mvtsinistre.setMvts_status(3);
		mvtsinistre.setMvts_typegestionsinistre("N");
		mvtsinistre.setMvts_beneficiaire(sinmvt.getSini_beneficiaire());
		mvtsinistre.setMvts_tiers(sinmvt.getSini_tiersrecours());
		// utilisateur connecté au lieu de sinmvt.getSini_utilisateur()
		mvtsinistre.setMvts_codeutilisateur(mvtsinistre.getMvts_codeutilisateur());
		mvtsinistre.setMvts_datemodification(new Date());
		mvtsinistre.setMvts_datemvt(new Date());
		mvtsinistre.setMvts_nantissement(sinmvt.getMvts_nantissement());
		mvtsinistre.setMvts_benefnantissement(sinmvt.getMvts_benefnantissement());
		mvtsinistre.setMvts_montantnantissement(sinmvt.getMvts_montantnantissement());
		mvtsinistre.setMvts_autrebeneficiaire(sinmvt.getMvts_adresseautrebeneficiaire());
		mvtsinistre.setMvts_adresseautrebeneficiaire(sinmvt.getMvts_adresseautrebeneficiaire());
		
		// Champs ajouter recement
		mvtsinistre.setMvts_montantfinancierprincipal(sinmvt.getMvts_montantfinancierprincipal());
		mvtsinistre.setMvts_montantfinancierfrais(sinmvt.getMvts_montantfinancierfrais());
		mvtsinistre.setMvts_montantfinancierhonoraires(sinmvt.getMvts_montantfinancierhonoraires());
				
		return mvtsinistreRepository.save(mvtsinistre);
	}

	@Transactional(rollbackFor = Exception.class)
	public ValidationsFront validationRecours(Long sini_id, ValidationsFront validationFront) {
		Recours recours = validationFront.getRecoursForm();
		Sinistre sinistre = validationFront.getSinistreForm();
		Mvtsinistre mvtsinistre = validationFront.getMvtsinistreForm();

		// Recuperation du sinistre et mouvement selectionné
		SinistreMouvement sinmvt = sinistreRepository.getSinistreById(sini_id);

		// Saving mvtSinistre
		mvtsinistre.setMvts_poli(sinmvt.getSini_police());
		mvtsinistre.setMvts_numsinistre(sinmvt.getSini_num());
		mvtsinistre.setMvts_datesaisie(sinmvt.getSini_datesaisie());
		mvtsinistre.setMvts_montantprincipal(sinmvt.getMvts_montantprincipal());
		mvtsinistre.setMvts_montantfrais(sinmvt.getMvts_montantfrais());
		mvtsinistre.setMvts_montanthonoraire(sinmvt.getMvts_montanthonoraire());
		mvtsinistre.setMvts_montantmvt(sinmvt.getMvts_montantmvt());
		mvtsinistre.setMvts_montantfinancier(0L);
		mvtsinistre.setMvts_status(1);
		mvtsinistre.setMvts_typegestionsinistre("N");
		mvtsinistre.setMvts_beneficiaire(sinmvt.getSini_beneficiaire());
		mvtsinistre.setMvts_tiers(sinmvt.getSini_tiersrecours());
		// utilisateur connecté au lieu de sinmvt.getSini_utilisateur()
		mvtsinistre.setMvts_codeutilisateur(mvtsinistre.getMvts_codeutilisateur());
		mvtsinistre.setMvts_datemodification(new Date());
		mvtsinistre.setMvts_datemvt(new Date());
		mvtsinistre.setMvts_nantissement(sinmvt.getMvts_nantissement());
		mvtsinistre.setMvts_benefnantissement(sinmvt.getMvts_benefnantissement());
		mvtsinistre.setMvts_montantnantissement(sinmvt.getMvts_montantnantissement());
		mvtsinistre.setMvts_autrebeneficiaire(sinmvt.getMvts_adresseautrebeneficiaire());
		mvtsinistre.setMvts_adresseautrebeneficiaire(sinmvt.getMvts_adresseautrebeneficiaire());
		// Champs ajouter recement
		mvtsinistre.setMvts_montantfinancierprincipal(sinmvt.getMvts_montantfinancierprincipal());
		mvtsinistre.setMvts_montantfinancierfrais(sinmvt.getMvts_montantfinancierfrais());
		mvtsinistre.setMvts_montantfinancierhonoraires(sinmvt.getMvts_montantfinancierhonoraires());
				
		Mvtsinistre mvtsinistreSave = mvtsinistreRepository.save(mvtsinistre);

		// saving proposition recours
		recours.setRecou_mtnenc(null);
		recours.setRecou_sin(sinmvt.getSini_num());
		recours.setRecou_mvt(mvtsinistreSave.getMvts_num());
		recours.setRecou_mtnencp(sinmvt.getMvts_montantprincipal());
		recours.setRecou_mtnenfr(sinmvt.getMvts_montantfrais());
		recours.setRecou_mtnenho(sinmvt.getMvts_montanthonoraire());
		recours.setRecou_mtnrec(
				sinmvt.getMvts_montantprincipal() + sinmvt.getMvts_montantfrais() + sinmvt.getMvts_montanthonoraire());
		recours.setRecou_poli(sinmvt.getSini_police());
		recours.setRecou_nmarch(null);
		recours.setRecou_daterec(new Date());
		recours.setRecou_dateval(new Date());
		recours.setRecou_dateenc(null);
		recours.setRecou_typeenc(null);
		recours.setRecou_cbanq(null);
		recours.setRecou_numchq(null);
		// figure dans la déclaration de sinistre
		recours.setRecou_beneficiaire(sinmvt.getSini_beneficiaire());
		recours.setRecou_achdor(sinmvt.getSini_donneurdordre());
		recours.setRecou_dateco(null);
		recours.setRecou_typr("R");
		// utilisateur connecté au lieu de sinmvt.getSini_utilisateur()
		recours.setRecou_utilisateur(recours.getRecou_utilisateur());
		recours.setRecou_datemo(new Date());
		Recours saveRecours = recoursRepository.save(recours);

		// Updating sinistre
		if (sinmvt.getSini_recoursglobal() == 0 || sinmvt.getSini_recoursglobal() == null) {
			sinistre.setSini_recoursprincipal(saveRecours.getRecou_mtnencp());
			sinistre.setSini_recoursfrais(saveRecours.getRecou_mtnenfr());
			sinistre.setSini_recourshonoraires(saveRecours.getRecou_mtnenho());
			sinistre.setSini_recoursglobal(
					saveRecours.getRecou_mtnencp() + saveRecours.getRecou_mtnenfr() + saveRecours.getRecou_mtnenho());
			sinistreRepository.updateSinistreRecours(10L, new Date(), sinistre.getSini_recoursprincipal(),
					sinistre.getSini_recoursfrais(), sinistre.getSini_recourshonoraires(),
					sinistre.getSini_recoursglobal(), sinmvt.getSini_num());
		} else {
			sinistre.setSini_recoursprincipal(sinmvt.getSini_recoursprincipal() + saveRecours.getRecou_mtnencp());
			sinistre.setSini_recoursfrais(sinmvt.getSini_recoursfrais() + saveRecours.getRecou_mtnenfr());
			sinistre.setSini_recourshonoraires(sinmvt.getSini_recourshonoraires() + saveRecours.getRecou_mtnenho());
			sinistre.setSini_recoursglobal((sinmvt.getSini_recoursprincipal() + saveRecours.getRecou_mtnencp())
					+ (sinistre.getSini_recoursfrais() + saveRecours.getRecou_mtnenfr())
					+ (sinistre.getSini_recourshonoraires() + saveRecours.getRecou_mtnenho()));
			sinistreRepository.updateSinistreRecours(10L, new Date(), sinistre.getSini_recoursprincipal(),
					sinistre.getSini_recoursfrais(), sinistre.getSini_recourshonoraires(),
					sinistre.getSini_recoursglobal(), sinmvt.getSini_num());
		}

		ValidationsFront validationsFront2 = new ValidationsFront(saveRecours, null, mvtsinistreSave);
		return validationsFront2;
	}

	@Transactional(rollbackFor = Exception.class)
	public ValidationsFront annulationValidationRecours(Long sini_id, ValidationsFront validationFront) {
		Sinistre sinistre = validationFront.getSinistreForm();
		Mvtsinistre mvtsinistre = validationFront.getMvtsinistreForm();

		// Recuperation du sinistre et mouvement selectionné
		SinistreMouvement sinmvt = sinistreRepository.getSinistreById(sini_id);

		// Saving mvtSinistre
		mvtsinistre.setMvts_poli(sinmvt.getSini_police());
		mvtsinistre.setMvts_numsinistre(sinmvt.getSini_num());
		mvtsinistre.setMvts_datesaisie(sinmvt.getSini_datesaisie());
		mvtsinistre.setMvts_montantmvt(sinmvt.getMvts_montantmvt());
		mvtsinistre.setMvts_montantfinancier(0L);
		mvtsinistre.setMvts_status(3);
		mvtsinistre.setMvts_typegestionsinistre("N");
		mvtsinistre.setMvts_beneficiaire(sinmvt.getSini_beneficiaire());
		mvtsinistre.setMvts_tiers(sinmvt.getSini_tiersrecours());
		// utilisateur connecté au lieu de sinmvt.getSini_utilisateur()
		mvtsinistre.setMvts_codeutilisateur(mvtsinistre.getMvts_codeutilisateur());
		mvtsinistre.setMvts_datemodification(new Date());
		mvtsinistre.setMvts_datemvt(new Date());
		mvtsinistre.setMvts_nantissement(sinmvt.getMvts_nantissement());
		mvtsinistre.setMvts_benefnantissement(sinmvt.getMvts_benefnantissement());
		mvtsinistre.setMvts_montantnantissement(sinmvt.getMvts_montantnantissement());
		mvtsinistre.setMvts_autrebeneficiaire(sinmvt.getMvts_adresseautrebeneficiaire());
		mvtsinistre.setMvts_adresseautrebeneficiaire(sinmvt.getMvts_adresseautrebeneficiaire());
		// Champs ajouter recement
		mvtsinistre.setMvts_montantfinancierprincipal(sinmvt.getMvts_montantfinancierprincipal());
		mvtsinistre.setMvts_montantfinancierfrais(sinmvt.getMvts_montantfinancierfrais());
		mvtsinistre.setMvts_montantfinancierhonoraires(sinmvt.getMvts_montantfinancierhonoraires());
				
		Mvtsinistre mvtsinistreSave = mvtsinistreRepository.save(mvtsinistre);

		// Updating sinistre
		if (sinmvt.getSini_recoursglobal() - sinmvt.getMvts_montantmvt() == 0) {
			sinistre.setSini_recoursprincipal(0L);
			sinistre.setSini_recoursfrais(0L);
			sinistre.setSini_recourshonoraires(0L);
			sinistre.setSini_recoursglobal(0L);
			sinistreRepository.updateSinistreRecours(12L, new Date(), sinistre.getSini_recoursprincipal(),
					sinistre.getSini_recoursfrais(), sinistre.getSini_recourshonoraires(),
					sinistre.getSini_recoursglobal(), sinmvt.getSini_num());
		} else {
			sinistre.setSini_recoursprincipal(sinmvt.getSini_recoursprincipal() - sinmvt.getMvts_montantprincipal());
			sinistre.setSini_recoursfrais(sinmvt.getSini_recoursfrais() - sinmvt.getMvts_montantfrais());
			sinistre.setSini_recourshonoraires(sinmvt.getSini_recourshonoraires() - sinmvt.getMvts_montanthonoraire());
			sinistre.setSini_recoursglobal(sinmvt.getSini_recoursglobal() - sinmvt.getMvts_montantmvt());
			sinistreRepository.updateSinistreRecours(12L, new Date(), sinistre.getSini_recoursprincipal(),
					sinistre.getSini_recoursfrais(), sinistre.getSini_recourshonoraires(),
					sinistre.getSini_recoursglobal(), sinmvt.getSini_num());
		}

		ValidationsFront validationsFront2 = new ValidationsFront(null, null, mvtsinistreSave);
		return validationsFront2;
	}

	@Transactional(rollbackFor = Exception.class)
	public ValidationsFront validationRecoursEncaisse(Long sini_id, ValidationsFront validationFront) {
		Recours recours = validationFront.getRecoursForm();
		Sinistre sinistre = validationFront.getSinistreForm();
		Mvtsinistre mvtsinistre = validationFront.getMvtsinistreForm();
		
		// Recuperation du sinistre et mouvement selectionné
		SinistreMouvement sinmvt = sinistreRepository.getSinistreById(sini_id);

		Mvtsinistre mvts = mvtsinistreRepository.findMvtsinistreByNumero(sinmvt.getMvts_num());
		mvtsinistreRepository.updateMvtEncaisseRecours(5, new Date(), mvts.getMvts_num());

		// Saving mvtSinistre
		mvtsinistre.setMvts_poli(sinmvt.getSini_police());
		mvtsinistre.setMvts_numsinistre(sinmvt.getSini_num());
		mvtsinistre.setMvts_datesaisie(sinmvt.getSini_datesaisie());
		mvtsinistre.setMvts_montantprincipal(sinmvt.getMvts_montantprincipal());
		mvtsinistre.setMvts_montantfrais(sinmvt.getMvts_montantfrais());
		mvtsinistre.setMvts_montanthonoraire(sinmvt.getMvts_montanthonoraire());
		mvtsinistre.setMvts_montantmvt(sinmvt.getMvts_montantmvt());
		mvtsinistre.setMvts_montantfinancier(sinmvt.getMvts_montantmvt());
		mvtsinistre.setMvts_status(5);
		mvtsinistre.setMvts_typegestionsinistre("N");
		mvtsinistre.setMvts_beneficiaire(sinmvt.getSini_beneficiaire());
		mvtsinistre.setMvts_tiers(sinmvt.getSini_tiersrecours());
		// utilisateur connecté au lieu de sinmvt.getSini_utilisateur()
		mvtsinistre.setMvts_codeutilisateur(mvtsinistre.getMvts_codeutilisateur());
		mvtsinistre.setMvts_datemodification(new Date());
		mvtsinistre.setMvts_datemvt(new Date());
		mvtsinistre.setMvts_nantissement(sinmvt.getMvts_nantissement());
		mvtsinistre.setMvts_benefnantissement(sinmvt.getMvts_benefnantissement());
		mvtsinistre.setMvts_montantnantissement(sinmvt.getMvts_montantnantissement());
		mvtsinistre.setMvts_autrebeneficiaire(sinmvt.getMvts_adresseautrebeneficiaire());
		mvtsinistre.setMvts_adresseautrebeneficiaire(sinmvt.getMvts_adresseautrebeneficiaire());
		// Champs ajouter recement
		mvtsinistre.setMvts_montantfinancierprincipal(sinmvt.getMvts_montantfinancierprincipal());
		mvtsinistre.setMvts_montantfinancierfrais(sinmvt.getMvts_montantfinancierfrais());
		mvtsinistre.setMvts_montantfinancierhonoraires(sinmvt.getMvts_montantfinancierhonoraires());
				
		Mvtsinistre mvtsinistreSave = mvtsinistreRepository.save(mvtsinistre);

		// saving proposition recours
		recours.setRecou_mtnrec(null);
		recours.setRecou_sin(sinmvt.getSini_num());
		recours.setRecou_mvt(mvtsinistreSave.getMvts_num());
		recours.setRecou_mtnencp(sinmvt.getSini_recoursprincipal());
		recours.setRecou_mtnenfr(sinmvt.getSini_recoursfrais());
		recours.setRecou_mtnenho(sinmvt.getSini_recourshonoraires());
		recours.setRecou_mtnenc(mvtsinistreSave.getMvts_montantmvt());
		recours.setRecou_poli(sinmvt.getSini_police());
		recours.setRecou_nmarch(recours.getRecou_nmarch());
		recours.setRecou_daterec(new Date());
		recours.setRecou_dateval(new Date());
		recours.setRecou_cregl(recours.getRecou_cregl());
		recours.setRecou_dateenc(recours.getRecou_dateenc());
		recours.setRecou_typeenc(recours.getRecou_cregl());
		recours.setRecou_cbanq(recours.getRecou_cbanq());
		recours.setRecou_numchq(recours.getRecou_numchq());
		// figure dans la déclaration de sinistre
		recours.setRecou_beneficiaire(sinmvt.getSini_beneficiaire());
		recours.setRecou_achdor(sinmvt.getSini_donneurdordre());
		recours.setRecou_dateco(new Date());
		recours.setRecou_typr("E");
		// utilisateur connecté au lieu de sinmvt.getSini_utilisateur()
		recours.setRecou_utilisateur(recours.getRecou_utilisateur());
		recours.setRecou_datemo(new Date());
		Recours saveRecours = recoursRepository.save(recours);

		// Updating sinistre
		if (sinmvt.getSini_recoursglobalencaisse() == 0 || sinmvt.getSini_recoursglobalencaisse() == null) {
			sinistre.setSini_recoursprincipalencaisse(saveRecours.getRecou_mtnencp());
			sinistre.setSini_recoursfraisencaisse(saveRecours.getRecou_mtnenfr());
			sinistre.setSini_recourshonoraieencaisse(saveRecours.getRecou_mtnenho());
			sinistre.setSini_recoursglobalencaisse(
					saveRecours.getRecou_mtnencp() + saveRecours.getRecou_mtnenfr() + saveRecours.getRecou_mtnenho());
			sinistreRepository.updateSinistreRecoursEncaisse(13L, new Date(),
					sinistre.getSini_recoursprincipalencaisse(), sinistre.getSini_recoursfraisencaisse(),
					sinistre.getSini_recourshonoraieencaisse(), sinistre.getSini_recoursglobalencaisse(),
					sinmvt.getSini_num());
		} else {
			sinistre.setSini_recoursprincipalencaisse(
					sinmvt.getSini_recoursprincipalencaisse() + saveRecours.getRecou_mtnencp());
			sinistre.setSini_recoursfraisencaisse(
					sinmvt.getSini_recoursfraisencaisse() + saveRecours.getRecou_mtnenfr());
			sinistre.setSini_recourshonoraieencaisse(
					sinmvt.getSini_recourshonoraieencaisse() + saveRecours.getRecou_mtnenho());
			sinistre.setSini_recoursglobalencaisse(
					(sinmvt.getSini_recoursprincipalencaisse() + saveRecours.getRecou_mtnencp())
							+ (sinmvt.getSini_recourshonoraieencaisse() + saveRecours.getRecou_mtnenho())
							+ (sinmvt.getSini_recourshonoraieencaisse() + saveRecours.getRecou_mtnenho()));
			sinistreRepository.updateSinistreRecoursEncaisse(13L, new Date(),
					sinistre.getSini_recoursprincipalencaisse(), sinistre.getSini_recoursfraisencaisse(),
					sinistre.getSini_recourshonoraieencaisse(), sinistre.getSini_recoursglobalencaisse(),
					sinmvt.getSini_num());
		}

		ValidationsFront validationsFront2 = new ValidationsFront(saveRecours, null, mvtsinistreSave);
		return validationsFront2;
	}

	@Transactional(rollbackFor = Exception.class)
	public ValidationsFront annulationRecoursEncaisse(Long sini_id, ValidationsFront validationFront) {
		Sinistre sinistre = validationFront.getSinistreForm();
		Mvtsinistre mvtsinistre = validationFront.getMvtsinistreForm();

		// Recuperation du sinistre et mouvement selectionné
		SinistreMouvement sinmvt = sinistreRepository.getSinistreById(sini_id);

		// Saving mvtSinistre
		mvtsinistre.setMvts_poli(sinmvt.getSini_police());
		mvtsinistre.setMvts_numsinistre(sinmvt.getSini_num());
		mvtsinistre.setMvts_datesaisie(sinmvt.getSini_datesaisie());
		mvtsinistre.setMvts_montantprincipal(0L);
		mvtsinistre.setMvts_montantfrais(0L);
		mvtsinistre.setMvts_montanthonoraire(0L);
		mvtsinistre.setMvts_montantmvt(0L);
		mvtsinistre.setMvts_status(3);
		mvtsinistre.setMvts_typegestionsinistre("N");
		mvtsinistre.setMvts_beneficiaire(sinmvt.getSini_beneficiaire());
		mvtsinistre.setMvts_tiers(sinmvt.getSini_tiersrecours());
		// utilisateur connecté au lieu de sinmvt.getSini_utilisateur()
		mvtsinistre.setMvts_codeutilisateur(mvtsinistre.getMvts_codeutilisateur());
		mvtsinistre.setMvts_datemodification(new Date());
		mvtsinistre.setMvts_datemvt(new Date());
		mvtsinistre.setMvts_nantissement(sinmvt.getMvts_nantissement());
		mvtsinistre.setMvts_benefnantissement(sinmvt.getMvts_benefnantissement());
		mvtsinistre.setMvts_montantnantissement(sinmvt.getMvts_montantnantissement());
		mvtsinistre.setMvts_autrebeneficiaire(sinmvt.getMvts_adresseautrebeneficiaire());
		mvtsinistre.setMvts_adresseautrebeneficiaire(sinmvt.getMvts_adresseautrebeneficiaire());
		// Champs ajouter recement
		mvtsinistre.setMvts_montantfinancierprincipal(sinmvt.getMvts_montantfinancierprincipal());
		mvtsinistre.setMvts_montantfinancierfrais(sinmvt.getMvts_montantfinancierfrais());
		mvtsinistre.setMvts_montantfinancierhonoraires(sinmvt.getMvts_montantfinancierhonoraires());
				
		Mvtsinistre mvtsinistreSave = mvtsinistreRepository.save(mvtsinistre);

		// Updating sinistre
		if (sinmvt.getSini_recoursglobalencaisse() - sinmvt.getMvts_montantmvt() == 0) {
			sinistre.setSini_recoursprincipalencaisse(0L);
			sinistre.setSini_recoursfraisencaisse(0L);
			sinistre.setSini_recourshonoraieencaisse(0L);
			sinistre.setSini_recoursglobalencaisse(0L);
			sinistreRepository.updateSinistreRecoursEncaisse(14L, new Date(),
					sinistre.getSini_recoursprincipalencaisse(), sinistre.getSini_recoursfraisencaisse(),
					sinistre.getSini_recourshonoraieencaisse(), sinistre.getSini_recoursglobalencaisse(),
					sinmvt.getSini_num());
		} else {
			sinistre.setSini_recoursprincipalencaisse(
					sinmvt.getSini_recoursprincipalencaisse() - sinmvt.getMvts_montantprincipal());
			sinistre.setSini_recoursfraisencaisse(
					sinmvt.getSini_recoursfraisencaisse() - sinmvt.getMvts_montantfrais());
			sinistre.setSini_recourshonoraieencaisse(
					sinmvt.getSini_recourshonoraieencaisse() - sinmvt.getMvts_montanthonoraire());
			sinistre.setSini_recoursglobalencaisse(
					sinmvt.getSini_recoursglobalencaisse() - sinmvt.getMvts_montantmvt());
			sinistreRepository.updateSinistreRecoursEncaisse(14L, new Date(),
					sinistre.getSini_recoursprincipalencaisse(), sinistre.getSini_recoursfraisencaisse(),
					sinistre.getSini_recourshonoraieencaisse(), sinistre.getSini_recoursglobalencaisse(),
					sinmvt.getSini_num());
		}

		ValidationsFront validationsFront2 = new ValidationsFront(null, null, mvtsinistreSave);
		return validationsFront2;
	}

	public void generateEditionFichePropositionRecours(HttpServletResponse response, String demandeur, Long sini_id) {
		String caractSup = "_";
		String demandeurNew = "";
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		SinistreMouvement sinmvt = sinistreRepository.getSinistreById(sini_id);

		InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
				+ ParamConst.FILENAME_REPORT_PROPOSITION_RECOURS + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {
			design = JRXmlLoader.load(jasperStream);

			JasperReport report = JasperCompileManager.compileReport(design);

			Map<String, Object> parameterMap = new HashMap<String, Object>();

			parameterMap.put("demandeur", demandeurNew);
			parameterMap.put("dateEdition", sinmvt.getMvts_datesaisie());
			parameterMap.put("numeroRecours", sinmvt.getMvts_num());
			parameterMap.put("numeroSinistre", sinmvt.getMvts_numsinistre());
			parameterMap.put("dateSurvenance", sinmvt.getMvts_datesaisie());
			parameterMap.put("contrat", sinmvt.getMvts_poli());
			parameterMap.put("description", sinmvt.getSini_description());
			parameterMap.put("clientNumero", sinmvt.getSini_souscripteur());
			parameterMap.put("numeroRecours", sinmvt.getMvts_num());
			parameterMap.put("montantPrincipal", sinmvt.getMvts_montantprincipal());
			parameterMap.put("montantFrais", sinmvt.getMvts_montantfrais());
			parameterMap.put("montantHonoraires", sinmvt.getMvts_montanthonoraire());
			parameterMap.put("montantGlobal", sinmvt.getMvts_montantmvt());
			parameterMap.put("montantLettre", FrenchNumberToWords.convert(sinmvt.getMvts_montantmvt()));
			
			// Récupérer le tiers recours
			if (sinmvt.getSini_tiersrecours() == sinmvt.getSini_acheteur()) {
				Acheteur acheteur = acheteurRepository.findByIdd(sinmvt.getSini_tiersrecours());
				if (acheteur != null) {
					parameterMap.put("tiersPrenom", acheteur.getAchet_prenom());
					parameterMap.put("tiersNom", acheteur.getAchet_nom());
					parameterMap.put("tiersDenomination", "");
				}
			}

			if (sinmvt.getSini_tiersrecours() == sinmvt.getSini_souscripteur()) {
				Client tiers = clientRepository.findByNumClient(sinmvt.getSini_tiersrecours());
				if (tiers != null) {
					parameterMap.put("tiersPrenom", tiers.getClien_prenom());
					parameterMap.put("tiersNom", tiers.getClien_nom());
					parameterMap.put("tiersDenomination", tiers.getClien_denomination());
				}
			}

			// Recupéré le donneur d'ordre et remplir ses informations
			Client client = clientRepository.findByNumClient(sinmvt.getSini_souscripteur());
			if (client != null) {
				parameterMap.put("clientPrenom", client.getClien_prenom());
				parameterMap.put("clientNom", client.getClien_nom());
				parameterMap.put("clientDenomination", client.getClien_denomination());
				parameterMap.put("clientAdresse",
						client.getClien_adressenumero() + " / " + client.getClien_adresseville());
			}

			// Récupéré le bénéficiaire et remplir ses informations
			Optional<Beneficiaire> beneficiaireOptional = beneficiaireRepository
					.findById(sinmvt.getSini_beneficiaire());
			if (beneficiaireOptional.isPresent()) {
				Beneficiaire beneficiaire = beneficiaireOptional.get();
				parameterMap.put("beneficiairePrenom", beneficiaire.getBenef_prenoms());
				parameterMap.put("beneficiaireNom", beneficiaire.getBenef_nom());
				parameterMap.put("beneficiaireDenomination", beneficiaire.getBenef_denom());
			}
			
			Branche branche = brancheRepository.findBrancheByNumero(sinmvt.getSini_branche());
			if (branche != null) {
				parameterMap.put("branche", branche.getBranche_libelleLong());
			} else {
				parameterMap.put("branche", "");
			}


			List<Sinistre> sinistres = sinistreRepository.findAll();
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(sinistres);

			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
			final OutputStream outputStream = response.getOutputStream();

			response.setContentType("application/x-pdf");
			response.setHeader("Content-Disposition",
					"inline; filename=" + ParamConst.FILENAME_REPORT_PROPOSITION_RECOURS + ParamConst.EXTENSION_PDF);
			response.addHeader(" Access-Control-Allow-Origin ", " * ");

			JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

		} catch (JRException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void generateEditionFicheRecoursEncaisse(HttpServletResponse response, String demandeur, Long mvts_num) {
		String caractSup = "_";
		String demandeurNew = "";
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		Mvtsinistre mvts = mvtsinistreRepository.findMvtsinistreByNumero(mvts_num);
		SinistreMouvement sinmvt = sinistreRepository.getSinistreById(mvts.getMvts_numsinistre());

		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_RECOURS_ENCAISSE + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {
			design = JRXmlLoader.load(jasperStream);

			JasperReport report = JasperCompileManager.compileReport(design);

			Map<String, Object> parameterMap = new HashMap<String, Object>();

			parameterMap.put("demandeur", demandeurNew);
			parameterMap.put("dateEdition", sinmvt.getMvts_datesaisie());
			parameterMap.put("numeroSinistre", sinmvt.getMvts_numsinistre());
			parameterMap.put("dateSurvenance", sinmvt.getMvts_datesaisie());
			parameterMap.put("contrat", sinmvt.getMvts_poli());
			parameterMap.put("montantLettre", FrenchNumberToWords.convert(sinmvt.getMvts_montantmvt()));
			parameterMap.put("description", sinmvt.getSini_description());
			parameterMap.put("clientNumero", sinmvt.getSini_souscripteur());
			
			parameterMap.put("numeroRecours", sinmvt.getMvts_num());
			parameterMap.put("montantPrincipal", sinmvt.getMvts_montantprincipal());
			parameterMap.put("montantFrais", sinmvt.getMvts_montantfrais());
			parameterMap.put("montantHonoraires", sinmvt.getMvts_montanthonoraire());
			parameterMap.put("montantGlobal", sinmvt.getMvts_montantmvt());
			parameterMap.put("montantLettre", FrenchNumberToWords.convert(sinmvt.getMvts_montantmvt()));
			
			/*Recours recours = recoursRepository.getRecoursByMvt(mvts_num);
			
			if (recours != null) {
				parameterMap.put("numeroRecours", recours.getRecou_num());
				parameterMap.put("montantPrincipal", recours.getRecou_mtnencp());
				parameterMap.put("montantFrais", recours.getRecou_mtnenfr());
				parameterMap.put("montantHonoraires", recours.getRecou_mtnenho());
				parameterMap.put("montantGlobal", recours.getRecou_mtnenc());
				parameterMap.put("montantLettre", FrenchNumberToWords.convert(recours.getRecou_mtnenc()));
			}*/
			
			// Récupérer le tiers recours
			if (sinmvt.getSini_tiersrecours() == sinmvt.getSini_acheteur()) {
				Acheteur acheteur = acheteurRepository.findByIdd(sinmvt.getSini_tiersrecours());
				if (acheteur != null) {
					parameterMap.put("tiersPrenom", acheteur.getAchet_prenom());
					parameterMap.put("tiersNom", acheteur.getAchet_nom());
					parameterMap.put("tiersDenomination", "");
				}
			}

			if (sinmvt.getSini_tiersrecours() == sinmvt.getSini_souscripteur()) {
				Client tiers = clientRepository.findByNumClient(sinmvt.getSini_tiersrecours());
				if (tiers != null) {
					parameterMap.put("tiersPrenom", tiers.getClien_prenom());
					parameterMap.put("tiersNom", tiers.getClien_nom());
					parameterMap.put("tiersDenomination", tiers.getClien_denomination());
				}
			}

			// Recupéré le donneur d'ordre et remplir ses informations
			Client client = clientRepository.findByNumClient(sinmvt.getSini_souscripteur());
			if (client != null) {
				parameterMap.put("clientPrenom", client.getClien_prenom());
				parameterMap.put("clientNom", client.getClien_nom());
				parameterMap.put("clientDenomination", client.getClien_denomination());
				parameterMap.put("clientAdresse",
						client.getClien_adressenumero() + " / " + client.getClien_adresseville());
			}

			// Récupéré le bénéficiaire et remplir ses informations
			Optional<Beneficiaire> beneficiaireOptional = beneficiaireRepository
					.findById(sinmvt.getSini_beneficiaire());
			if (beneficiaireOptional.isPresent()) {
				Beneficiaire beneficiaire = beneficiaireOptional.get();
				parameterMap.put("beneficiairePrenom", beneficiaire.getBenef_prenoms());
				parameterMap.put("beneficiaireNom", beneficiaire.getBenef_nom());
				parameterMap.put("beneficiaireDenomination", beneficiaire.getBenef_denom());
			}
			
			Branche branche = brancheRepository.findBrancheByNumero(sinmvt.getSini_branche());
			if (branche != null) {
				parameterMap.put("branche", branche.getBranche_libelleLong());
			} else {
				parameterMap.put("branche", "");
			}

			List<Sinistre> sinistres = sinistreRepository.findAll();
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(sinistres);

			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
			final OutputStream outputStream = response.getOutputStream();

			response.setContentType("application/x-pdf");
			response.setHeader("Content-Disposition",
					"inline; filename=" + ParamConst.FILENAME_REPORT_RECOURS_ENCAISSE + ParamConst.EXTENSION_PDF);
			response.addHeader(" Access-Control-Allow-Origin ", " * ");

			JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

		} catch (JRException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void generateFichePropositionRecours(HttpServletResponse response, String demandeur,
			RecoursFront recoursFront) {
		String caractSup = "_";
		String demandeurNew = "";
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		Mvtsinistre mvtsinistreForm = recoursFront.getMvtsinistreForm();
		Sinistre sinistreForm = sinistreRepository.findSinistreByNumero(mvtsinistreForm.getMvts_numsinistre());

		InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
				+ ParamConst.FILENAME_REPORT_PROPOSITION_RECOURS + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {
			design = JRXmlLoader.load(jasperStream);

			JasperReport report = JasperCompileManager.compileReport(design);

			Map<String, Object> parameterMap = new HashMap<String, Object>();

			parameterMap.put("demandeur", demandeurNew);
			parameterMap.put("dateEdition", mvtsinistreForm.getMvts_datesaisie());
			parameterMap.put("numeroSinistre", mvtsinistreForm.getMvts_numsinistre());
			parameterMap.put("dateSurvenance", mvtsinistreForm.getMvts_datesaisie());
			parameterMap.put("contrat", mvtsinistreForm.getMvts_poli());
			parameterMap.put("compagnie", sinistreForm.getSini_codecompagnie());
			parameterMap.put("description", sinistreForm.getSini_description());
			parameterMap.put("clientNumero", sinistreForm.getSini_souscripteur());
			parameterMap.put("numeroRecours", mvtsinistreForm.getMvts_num());
			parameterMap.put("montantPrincipal", mvtsinistreForm.getMvts_montantprincipal());
			parameterMap.put("montantFrais", mvtsinistreForm.getMvts_montantfrais());
			parameterMap.put("montantHonoraires", mvtsinistreForm.getMvts_montanthonoraire());
			parameterMap.put("montantGlobal", mvtsinistreForm.getMvts_montantmvt());
			parameterMap.put("montantLettre", FrenchNumberToWords.convert(mvtsinistreForm.getMvts_montantmvt()));
			

			// Récupérer le tiers recours
			if (sinistreForm.getSini_tiersrecours() == sinistreForm.getSini_acheteur()) {
				Acheteur acheteur = acheteurRepository.findByIdd(sinistreForm.getSini_tiersrecours());
				if (acheteur != null) {
					parameterMap.put("tiersPrenom", acheteur.getAchet_prenom());
					parameterMap.put("tiersNom", acheteur.getAchet_nom());
					parameterMap.put("tiersDenomination", "");
				}
			}

			if (sinistreForm.getSini_tiersrecours() == sinistreForm.getSini_souscripteur()) {
				Client tiers = clientRepository.findByNumClient(sinistreForm.getSini_tiersrecours());
				if (tiers != null) {
					parameterMap.put("tiersPrenom", tiers.getClien_prenom());
					parameterMap.put("tiersNom", tiers.getClien_nom());
					parameterMap.put("tiersDenomination", tiers.getClien_denomination());
				}
			}

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
					"inline; filename=" + ParamConst.FILENAME_REPORT_PROPOSITION_RECOURS + ParamConst.EXTENSION_PDF);
			response.addHeader(" Access-Control-Allow-Origin ", " * ");

			JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

		} catch (JRException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void generateFicheRecoursEncaisse(HttpServletResponse response, String demandeur,
			ValidationsFront validationsFront) {
		String caractSup = "_";
		String demandeurNew = "";
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		Mvtsinistre mvtsinistreForm = validationsFront.getMvtsinistreForm();
		Sinistre sinistreForm = sinistreRepository.findSinistreByNumero(mvtsinistreForm.getMvts_numsinistre());

		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_RECOURS_ENCAISSE + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {
			design = JRXmlLoader.load(jasperStream);

			JasperReport report = JasperCompileManager.compileReport(design);

			Map<String, Object> parameterMap = new HashMap<String, Object>();

			parameterMap.put("demandeur", demandeurNew);
			parameterMap.put("dateEdition", mvtsinistreForm.getMvts_datesaisie());
			parameterMap.put("numeroSinistre", mvtsinistreForm.getMvts_numsinistre());
			parameterMap.put("dateSurvenance", mvtsinistreForm.getMvts_datesaisie());
			parameterMap.put("contrat", mvtsinistreForm.getMvts_poli());
			parameterMap.put("compagnie", sinistreForm.getSini_codecompagnie());
			parameterMap.put("description", sinistreForm.getSini_description());
			parameterMap.put("clientNumero", sinistreForm.getSini_souscripteur());
			
			parameterMap.put("numeroRecours", mvtsinistreForm.getMvts_num());
			parameterMap.put("montantPrincipal", mvtsinistreForm.getMvts_montantprincipal());
			parameterMap.put("montantFrais", mvtsinistreForm.getMvts_montantfrais());
			parameterMap.put("montantHonoraires", mvtsinistreForm.getMvts_montanthonoraire());
			parameterMap.put("montantGlobal", mvtsinistreForm.getMvts_montantmvt());
			parameterMap.put("montantLettre", FrenchNumberToWords.convert(mvtsinistreForm.getMvts_montantmvt()));
			
			Branche branche = brancheRepository.findBrancheByNumero(sinistreForm.getSini_branche());
			if (branche != null) {
				parameterMap.put("branche", branche.getBranche_libelleLong());
			} else {
				parameterMap.put("branche", "");
			}

			// Récupérer le tiers recours
			if (sinistreForm.getSini_tiersrecours() == sinistreForm.getSini_acheteur()) {
				Acheteur acheteur = acheteurRepository.findByIdd(sinistreForm.getSini_tiersrecours());
				if (acheteur != null) {
					parameterMap.put("tiersPrenom", acheteur.getAchet_prenom());
					parameterMap.put("tiersNom", acheteur.getAchet_nom());
					parameterMap.put("tiersDenomination", "");
				}
			}

			if (sinistreForm.getSini_tiersrecours() == sinistreForm.getSini_souscripteur()) {
				Client tiers = clientRepository.findByNumClient(sinistreForm.getSini_tiersrecours());
				if (tiers != null) {
					parameterMap.put("tiersPrenom", tiers.getClien_prenom());
					parameterMap.put("tiersNom", tiers.getClien_nom());
					parameterMap.put("tiersDenomination", tiers.getClien_denomination());
				}
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
					"inline; filename=" + ParamConst.FILENAME_REPORT_RECOURS_ENCAISSE + ParamConst.EXTENSION_PDF);
			response.addHeader(" Access-Control-Allow-Origin ", " * ");

			JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

		} catch (JRException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void downloadRecuEncaissementRecours(HttpServletResponse response, String demandeur, Long sini_id) {
		String caractSup = "_";
		String demandeurNew = "";
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		SinistreMouvement sinistreForm = sinistreRepository.getSinistreById(sini_id);

		InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
				+ ParamConst.FILENAME_REPORT_RECU_ENCAISSEMENT_RECOURS + ParamConst.EXTENSION_REPORT);
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
			
			Recours recours = recoursRepository.getRecoursByMvt(sinistreForm.getMvts_num());
			if(recours != null) {
				parameterMap.put("numeroRecours", recours.getRecou_num());
				parameterMap.put("referenceReglement", ": Type de réglement: "+recours.getRecou_typeenc());
				parameterMap.put("reglement", "Code banque: "+recours.getRecou_cbanq()+" / Numéro chèque: "+recours.getRecou_numchq());
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
				parameterMap.put("clientAdresse", client.getClien_adressenumero() + " / " + client.getClien_adresseville());
			}


			List<Sinistre> sinistres = sinistreRepository.findAll();
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(sinistres);

			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
			final OutputStream outputStream = response.getOutputStream();

			response.setContentType("application/x-pdf");
			response.setHeader("Content-Disposition",
					"inline; filename=" + ParamConst.FILENAME_REPORT_RECU_ENCAISSEMENT_RECOURS + ParamConst.EXTENSION_PDF);
			response.addHeader(" Access-Control-Allow-Origin ", " * ");

			JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

		} catch (JRException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
