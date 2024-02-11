package sn.jmad.sonac.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.NumberFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
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
import sn.jmad.sonac.message.response.MoratoireFront;
import sn.jmad.sonac.message.response.SinistreMouvement;
import sn.jmad.sonac.model.Branche;
import sn.jmad.sonac.model.Client;
import sn.jmad.sonac.model.Moratoire;
import sn.jmad.sonac.model.Mvtsinistre;
import sn.jmad.sonac.model.Produit;
import sn.jmad.sonac.model.Recours;
import sn.jmad.sonac.model.Sinistre;
import sn.jmad.sonac.repository.BrancheRepository;
import sn.jmad.sonac.repository.ClientRepository;
import sn.jmad.sonac.repository.MoratoireRepository;
import sn.jmad.sonac.repository.MvtsinistreRepository;
import sn.jmad.sonac.repository.ProduitRepository;
import sn.jmad.sonac.repository.SinistreRepository;
import sn.jmad.sonac.service.constantes.FrenchNumberToWords;
import sn.jmad.sonac.service.constantes.ParamConst;

@Service
public class MoratoireService {
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
	public MoratoireFront ajouterMoratoire(Long sini_id, MoratoireFront moratoireFront) {
		Moratoire moratoire = moratoireFront.getMoratoireForm();
		Mvtsinistre mvtsinistre = moratoireFront.getMvtsinistreForm();

		// Recuperation du sinistre et mouvement selectionné
		SinistreMouvement sinmvt = sinistreRepository.getSinistreById(sini_id);

		// Saving mvtSinistre
		mvtsinistre.setMvts_poli(sinmvt.getSini_police());
		mvtsinistre.setMvts_numsinistre(sinmvt.getSini_num());
		mvtsinistre.setMvts_datesaisie(sinmvt.getSini_datesaisie());
		mvtsinistre.setMvts_montantprincipal(moratoire.getMorato_mtecheanc());
		mvtsinistre.setMvts_montantfrais(0L);
		mvtsinistre.setMvts_montanthonoraire(0L);
		mvtsinistre.setMvts_montantmvt(moratoire.getMorato_mtmoratoire());
		mvtsinistre.setMvts_status(1);
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

		// saving proposition moratoire
		moratoire.setMorato_mtmoratoire(moratoire.getMorato_mtmoratoire());
		moratoire.setMorato_typecheanc(moratoire.getMorato_typecheanc());
		moratoire.setMorato_nbrecheancacc(moratoire.getMorato_nbrecheancacc());
		moratoire.setMorato_mtecheanc(moratoire.getMorato_mtecheanc());
		moratoire.setMorato_nbrecheancimp(moratoire.getMorato_nbrecheancimp());
		moratoire.setMorato_mtnechimpayee(moratoire.getMorato_mtnechimpayee());
		moratoire.setMorato_status("A");
		moratoire.setMorato_mvt(mvtsinistreSave.getMvts_num());
		Moratoire savedMoratoire = moratoireRepository.save(moratoire);

		// Updating sinistre
		sinistreRepository.updateSinistreStatus(17L, new Date(), sini_id);

		MoratoireFront moratoireFront2 = new MoratoireFront(savedMoratoire, mvtsinistreSave);
		return moratoireFront2;
	}

	@Transactional(rollbackFor = Exception.class)
	public MoratoireFront annulerMoratoire(Long sini_id, MoratoireFront moratoireFront) {
		Moratoire moratoire = moratoireFront.getMoratoireForm();
		Mvtsinistre mvtsinistre = moratoireFront.getMvtsinistreForm();

		// Recuperation du sinistre et mouvement selectionné
		SinistreMouvement sinmvt = sinistreRepository.getSinistreById(sini_id);
		Moratoire morate = moratoireRepository.findMoratoireBySinistre(sini_id);

		// Saving mvtSinistre
		mvtsinistre.setMvts_poli(sinmvt.getSini_police());
		mvtsinistre.setMvts_numsinistre(sinmvt.getSini_num());
		mvtsinistre.setMvts_datesaisie(sinmvt.getSini_datesaisie());
		mvtsinistre.setMvts_montantprincipal(sinmvt.getMvts_montantprincipal());
		mvtsinistre.setMvts_montantfrais(sinmvt.getMvts_montantfrais());
		mvtsinistre.setMvts_montanthonoraire(sinmvt.getMvts_montanthonoraire());
		mvtsinistre.setMvts_montantmvt(sinmvt.getMvts_montantmvt());
		mvtsinistre.setMvts_status(3);
		mvtsinistre.setMvts_typegestionsinistre("N");
		mvtsinistre.setMvts_beneficiaire(sinmvt.getSini_beneficiaire());
		mvtsinistre.setMvts_tiers(sinmvt.getSini_tiersrecours());
		mvtsinistre.setMvts_typemvt(10L);
		mvtsinistre.setMvts_codeutilisateur(morate.getMorato_cutil());
		mvtsinistre.setMvts_datemodification(new Date());
		mvtsinistre.setMvts_datemvt(new Date());
		mvtsinistre.setMvts_dateannulation(new Date());
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

		// saving proposition moratoire
		moratoire.setMorato_mtmoratoire(morate.getMorato_mtmoratoire());
		moratoire.setMorato_typecheanc(morate.getMorato_typecheanc());
		moratoire.setMorato_nbrecheancacc(morate.getMorato_nbrecheancacc());
		moratoire.setMorato_mtecheanc(morate.getMorato_mtecheanc());
		moratoire.setMorato_nbrecheancimp(morate.getMorato_nbrecheancimp());
		moratoire.setMorato_mtnechimpayee(morate.getMorato_mtnechimpayee());
		moratoire.setMorato_sini(morate.getMorato_sini());
		moratoire.setMorato_cutil(morate.getMorato_cutil());
		moratoire.setMorato_status("N");
		moratoire.setMorato_mvt(mvtsinistreSave.getMvts_num());
		Moratoire savedMoratoire = moratoireRepository.save(moratoire);

		// Updating sinistre
		sinistreRepository.updateSinistreStatus(10L, new Date(), sini_id);

		MoratoireFront moratoireFront2 = new MoratoireFront(savedMoratoire, mvtsinistreSave);
		return moratoireFront2;
	}

	@Transactional(rollbackFor = Exception.class)
	public MoratoireFront encaisserMoratoire(Long sini_id, MoratoireFront moratoireFront) {
		Moratoire moratoire = moratoireFront.getMoratoireForm();
		Mvtsinistre mvtsinistre = moratoireFront.getMvtsinistreForm();
		
		// Recuperation du sinistre et mouvement selectionné
		SinistreMouvement sinmvt = sinistreRepository.getSinistreById(sini_id);
		Moratoire morate = moratoireRepository.findMoratoireBySinistre(sini_id);

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
		mvtsinistre.setMvts_typemvt(10L);
		mvtsinistre.setMvts_codeutilisateur(morate.getMorato_cutil());
		mvtsinistre.setMvts_datemodification(new Date());
		mvtsinistre.setMvts_datemvt(new Date());
		mvtsinistre.setMvts_dateannulation(new Date());
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

		// saving proposition moratoire
		moratoire.setMorato_mtmoratoire(morate.getMorato_mtmoratoire());
		moratoire.setMorato_typecheanc(morate.getMorato_typecheanc());
		moratoire.setMorato_nbrecheancacc(morate.getMorato_nbrecheancacc());
		moratoire.setMorato_mtecheanc(morate.getMorato_mtecheanc());
		moratoire.setMorato_nbrecheancimp(morate.getMorato_nbrecheancimp());
		moratoire.setMorato_mtnechimpayee(morate.getMorato_mtnechimpayee());
		moratoire.setMorato_sini(morate.getMorato_sini());
		moratoire.setMorato_cutil(morate.getMorato_cutil());
		moratoire.setMorato_datemiseplace(morate.getMorato_datemiseplace());
		moratoire.setMorato_datech(morate.getMorato_datech());
		moratoire.setMorato_mvt(mvtsinistreSave.getMvts_num());
		// Encaissement du moratoire
		moratoire.setMorato_typencdern(moratoire.getMorato_typencdern());
		moratoire.setMorato_mtnencaiss(moratoire.getMorato_mtnencaiss());
		moratoire.setMorato_cbanq(moratoire.getMorato_cbanq());
		moratoire.setMorato_numchq(moratoire.getMorato_numchq());
		moratoire.setMorato_dateco(new Date());
		moratoire.setMorato_datemo(new Date());
		moratoire.setMorato_status("C");
		Moratoire savedMoratoire = moratoireRepository.save(moratoire);

		// Updating sinistre
		sinistreRepository.updateSinistreStatus(10L, new Date(), sini_id);

		MoratoireFront moratoireFront2 = new MoratoireFront(savedMoratoire, mvtsinistreSave);
		return moratoireFront2;
	}

	public void downloadRecuEncaissementMoratoire(HttpServletResponse response, String demandeur, Long sini_id) {
		String caractSup = "_";
		String demandeurNew = "";
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		SinistreMouvement sinistreForm = sinistreRepository.getSinistreById(sini_id);

		InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
				+ ParamConst.FILENAME_REPORT_RECU_ENCAISSEMENT_MORATOIRE + ParamConst.EXTENSION_REPORT);
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

			Moratoire moratoire = moratoireRepository.getMoratoireByMvt(sinistreForm.getMvts_num());
			if (moratoire != null) {
				parameterMap.put("numeroRecours", moratoire.getMorato_num());
				parameterMap.put("referenceReglement", "Type d'encaissement: "+moratoire.getMorato_typencdern());
				parameterMap.put("reglement", "Code banque: "+moratoire.getMorato_cbanq() + " / Numéro chèque: "+moratoire.getMorato_numchq());
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
					+ ParamConst.FILENAME_REPORT_RECU_ENCAISSEMENT_MORATOIRE + ParamConst.EXTENSION_PDF);
			response.addHeader(" Access-Control-Allow-Origin ", " * ");

			JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

		} catch (JRException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
