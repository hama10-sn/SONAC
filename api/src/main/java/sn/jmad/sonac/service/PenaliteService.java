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
import sn.jmad.sonac.message.response.PenaliteFront;
import sn.jmad.sonac.message.response.SinistreMouvement;
import sn.jmad.sonac.model.Branche;
import sn.jmad.sonac.model.Client;
import sn.jmad.sonac.model.Moratoire;
import sn.jmad.sonac.model.Mvtsinistre;
import sn.jmad.sonac.model.Penalite;
import sn.jmad.sonac.model.Produit;
import sn.jmad.sonac.model.Sinistre;
import sn.jmad.sonac.repository.BrancheRepository;
import sn.jmad.sonac.repository.ClientRepository;
import sn.jmad.sonac.repository.MoratoireRepository;
import sn.jmad.sonac.repository.MvtsinistreRepository;
import sn.jmad.sonac.repository.PenaliteRepository;
import sn.jmad.sonac.repository.ProduitRepository;
import sn.jmad.sonac.repository.SinistreRepository;
import sn.jmad.sonac.service.constantes.FrenchNumberToWords;
import sn.jmad.sonac.service.constantes.ParamConst;

@Service
public class PenaliteService {
	@Autowired
	private PenaliteRepository penaliteRepository;
	@Autowired
	private MoratoireRepository moratoireRepository;
	@Autowired
	private SinistreRepository sinistreRepository;
	@Autowired
	private MvtsinistreRepository mvtsinistreRepository;
	@Autowired
	private ClientRepository clientRepository;
	@Autowired
	private BrancheRepository brancheRepository;
	@Autowired
	private ProduitRepository produitRepository;

	@Transactional(rollbackFor = Exception.class)
	public PenaliteFront ajouterPenalite(Long sini_id, PenaliteFront penaliteFront) {
		Penalite penalite = penaliteFront.getPenaliteForm();
		Mvtsinistre mvtsinistre = penaliteFront.getMvtsinistreForm();

		// Recuperation du sinistre et mouvement selectionné
		SinistreMouvement sinmvt = sinistreRepository.getSinistreById(sini_id);
		Moratoire morate = moratoireRepository.findMoratoireBySinistre(sini_id);

		// Saving mvtSinistre
		mvtsinistre.setMvts_poli(sinmvt.getSini_police());
		mvtsinistre.setMvts_numsinistre(sinmvt.getSini_num());
		mvtsinistre.setMvts_datesaisie(sinmvt.getSini_datesaisie());
		mvtsinistre.setMvts_montantprincipal(penalite.getPenalit_mtpenalitfac());
		mvtsinistre.setMvts_montantfrais(0L);
		mvtsinistre.setMvts_montanthonoraire(0L);
		mvtsinistre.setMvts_montantmvt(penalite.getPenalit_mtpenalitfac());
		mvtsinistre.setMvts_status(1);
		mvtsinistre.setMvts_typegestionsinistre("N");
		mvtsinistre.setMvts_beneficiaire(sinmvt.getSini_beneficiaire());
		mvtsinistre.setMvts_tiers(sinmvt.getSini_tiersrecours());
		mvtsinistre.setMvts_typemvt(18L);
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

		// saving proposition pénalité
		penalite.setPenalit_mtpenalitfac(penalite.getPenalit_mtpenalitfac());
		penalite.setPenalit_datepenalit(penalite.getPenalit_datepenalit());
		penalite.setPenalit_taux(penalite.getPenalit_taux());
		penalite.setPenalit_morat(morate.getMorato_num());
		penalite.setPenalit_sini(sinmvt.getSini_num());
		penalite.setPenalit_poli(sinmvt.getSini_police());
		penalite.setPenalit_dateval(new Date());
		penalite.setPenalit_mvt(mvtsinistreSave.getMvts_num());
		Penalite savedPenalite = penaliteRepository.save(penalite);

		// Update moratoire
		moratoireRepository.updateMoratoirePenalite(savedPenalite.getPenalit_id(), new Date(), morate.getMorato_id());

		// Updating sinistre
		sinistreRepository.updateSinistreStatus(18L, new Date(), sini_id);

		PenaliteFront penaliteFront2 = new PenaliteFront(savedPenalite, mvtsinistreSave);
		return penaliteFront2;
	}

	@Transactional(rollbackFor = Exception.class)
	public PenaliteFront encaisserPenalite(Long sini_id, PenaliteFront penaliteFront) {
		Penalite penalite = penaliteFront.getPenaliteForm();
		Mvtsinistre mvtsinistre = penaliteFront.getMvtsinistreForm();
		
		// Recuperation du sinistre et mouvement selectionné
		SinistreMouvement sinmvt = sinistreRepository.getSinistreById(sini_id);
		Moratoire morate = moratoireRepository.findMoratoireBySinistre(sini_id);
		Penalite updatePenalite = penaliteRepository.findPenaliteByMoratoire(morate.getMorato_id());

		Mvtsinistre mvts = mvtsinistreRepository.findMvtsinistreByNumero(sinmvt.getMvts_num());
		mvtsinistreRepository.updateMvtEncaisseRecours(3, new Date(), mvts.getMvts_num());

		// Saving mvtSinistre
		mvtsinistre.setMvts_poli(sinmvt.getSini_police());
		mvtsinistre.setMvts_numsinistre(sinmvt.getSini_num());
		mvtsinistre.setMvts_datesaisie(sinmvt.getSini_datesaisie());
		mvtsinistre.setMvts_montantprincipal(sinmvt.getMvts_montantprincipal());
		mvtsinistre.setMvts_montantfrais(sinmvt.getMvts_montantfrais());
		mvtsinistre.setMvts_montanthonoraire(sinmvt.getMvts_montanthonoraire());
		mvtsinistre.setMvts_montantmvt(sinmvt.getMvts_montantmvt());
		mvtsinistre.setMvts_montantfinancier(sini_id);
		mvtsinistre.setMvts_status(3);
		mvtsinistre.setMvts_typegestionsinistre("N");
		mvtsinistre.setMvts_beneficiaire(sinmvt.getSini_beneficiaire());
		mvtsinistre.setMvts_tiers(sinmvt.getSini_tiersrecours());
		mvtsinistre.setMvts_typemvt(17L);
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

		// saving proposition pénalité
		penalite.setPenalit_mtpenalitfac(updatePenalite.getPenalit_mtpenalitfac());
		penalite.setPenalit_datepenalit(updatePenalite.getPenalit_datepenalit());
		penalite.setPenalit_taux(updatePenalite.getPenalit_taux());
		penalite.setPenalit_morat(updatePenalite.getPenalit_morat());
		penalite.setPenalit_dateval(updatePenalite.getPenalit_dateval());
		penalite.setPenalit_typenc(penalite.getPenalit_typenc());
		penalite.setPenalit_mtpenalitenc(penalite.getPenalit_mtpenalitenc());
		penalite.setPenalit_enc(penalite.getPenalit_mtpenalitenc());
		penalite.setPenalit_cbanq(penalite.getPenalit_cbanq());
		penalite.setPenalit_codenc(penalite.getPenalit_typenc());
		penalite.setPenalit_numchq(penalite.getPenalit_numchq());
		penalite.setPenalit_sini(sinmvt.getSini_num());
		penalite.setPenalit_poli(sinmvt.getSini_police());
		penalite.setPenalit_mvt(sinmvt.getMvts_num());
		penalite.setPenalit_dateco(new Date());
		penalite.setPenalit_datemo(new Date());
		penalite.setPenalit_datenc(new Date());
		Penalite savedPenalite = penaliteRepository.save(penalite);

		// Updating sinistre
		sinistreRepository.updateSinistreStatus(17L, new Date(), sini_id);

		PenaliteFront penaliteFront2 = new PenaliteFront(savedPenalite, mvtsinistreSave);
		return penaliteFront2;
	}

	public void downloadRecuEncaissementPenalite(HttpServletResponse response, String demandeur, Long sini_id) {
		String caractSup = "_";
		String demandeurNew = "";
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		SinistreMouvement sinistreForm = sinistreRepository.getSinistreById(sini_id);

		InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
				+ ParamConst.FILENAME_REPORT_RECU_ENCAISSEMENT_PENALITE + ParamConst.EXTENSION_REPORT);
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

			Penalite penalite = penaliteRepository.getPenaliteByMvt(sinistreForm.getMvts_num());
			if (penalite != null) {
				parameterMap.put("numeroRecours", penalite.getPenalit_num());
				parameterMap.put("referenceReglement", penalite.getPenalit_typenc());
				parameterMap.put("reglement", penalite.getPenalit_cbanq() + " " + penalite.getPenalit_codenc() + " " + penalite.getPenalit_numchq());
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
					+ ParamConst.FILENAME_REPORT_RECU_ENCAISSEMENT_PENALITE + ParamConst.EXTENSION_PDF);
			response.addHeader(" Access-Control-Allow-Origin ", " * ");

			JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

		} catch (JRException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
