package sn.jmad.sonac.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

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
import sn.jmad.sonac.message.response.EmissionConsultation;
import sn.jmad.sonac.message.response.PoliceConsultation;
import sn.jmad.sonac.message.response.PoliceFront;
import sn.jmad.sonac.message.response.PoliceFront_P;
import sn.jmad.sonac.message.response.PoliceTarif;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.message.response.TarificationDisplay;
import sn.jmad.sonac.message.response.ajoutAcheteurFront;
import sn.jmad.sonac.model.Accessoire;
import sn.jmad.sonac.model.Acheteur;
import sn.jmad.sonac.model.Acte;
import sn.jmad.sonac.model.Acte_P;
import sn.jmad.sonac.model.Avenant;
import sn.jmad.sonac.model.Avenant_P;
import sn.jmad.sonac.model.Beneficiaire;
import sn.jmad.sonac.model.Beneficiaire_P;
import sn.jmad.sonac.model.Caution;
import sn.jmad.sonac.model.Commission;
import sn.jmad.sonac.model.Credit;
import sn.jmad.sonac.model.CreditExport;
import sn.jmad.sonac.model.Engagement;
import sn.jmad.sonac.model.Engagement_P;
import sn.jmad.sonac.model.Facture;
import sn.jmad.sonac.model.Facture_P;
import sn.jmad.sonac.model.Lot;
import sn.jmad.sonac.model.Lot_P;
import sn.jmad.sonac.model.MainLeve;
import sn.jmad.sonac.model.Marche;
import sn.jmad.sonac.model.Marche_P;
import sn.jmad.sonac.model.Police;
import sn.jmad.sonac.model.Police_P;
import sn.jmad.sonac.model.Quittance;
import sn.jmad.sonac.model.Quittance_P;
import sn.jmad.sonac.model.Risque;
import sn.jmad.sonac.model.Risque_P;
import sn.jmad.sonac.model.Risque_locatif;
import sn.jmad.sonac.model.Risque_reglementes;
import sn.jmad.sonac.model.Tarification;
import sn.jmad.sonac.model.Taxe;
import sn.jmad.sonac.model.Utilisateur;
import sn.jmad.sonac.repository.AccessoireRepository;
import sn.jmad.sonac.repository.AcheteurRepository;
import sn.jmad.sonac.repository.ActeRepository;
import sn.jmad.sonac.repository.ActeRepository_P;
import sn.jmad.sonac.repository.AvenantRepository;
import sn.jmad.sonac.repository.AvenantRepository_P;
import sn.jmad.sonac.repository.BeneficiaireRepository;
import sn.jmad.sonac.repository.BeneficiaireRepository_P;
import sn.jmad.sonac.repository.CautionRepository;
import sn.jmad.sonac.repository.CommissionRepository;
import sn.jmad.sonac.repository.CreditExportRepository;
import sn.jmad.sonac.repository.CreditRepository;
import sn.jmad.sonac.repository.EncaissementRepository;
import sn.jmad.sonac.repository.EngagementRepository;
import sn.jmad.sonac.repository.EngagementRepository_P;
import sn.jmad.sonac.repository.FactureRepository;
import sn.jmad.sonac.repository.FactureRepository_P;
import sn.jmad.sonac.repository.LotRepository;
import sn.jmad.sonac.repository.LotRepository_P;
import sn.jmad.sonac.repository.MarcheRepository;
import sn.jmad.sonac.repository.MarcheRepository_P;
import sn.jmad.sonac.repository.PoliceRepository;
import sn.jmad.sonac.repository.PoliceRepository_P;
import sn.jmad.sonac.repository.QuittanceRepository;
import sn.jmad.sonac.repository.QuittanceRepository_P;
import sn.jmad.sonac.repository.RisqueRepository;
import sn.jmad.sonac.repository.RisqueRepository_P;
import sn.jmad.sonac.repository.Risque_locatifRepository;
import sn.jmad.sonac.repository.Risque_reglementesRepository;
import sn.jmad.sonac.repository.TarificationRepository;
import sn.jmad.sonac.repository.TaxeRepository;
import sn.jmad.sonac.security.service.UserPrinciple;
import sn.jmad.sonac.service.constantes.ParamConst;

@Service
public class PoliceService {

	private static final String PDF = "pdf";
	private static final String EXCEL = "excel";

	@Autowired
	private CautionRepository cautionRepository;
	@Autowired
	private TaxeRepository taxeRepository;
	@Autowired
	private AccessoireRepository accessoireRepository;
	@Autowired
	private CommissionRepository commissionRepository;

	@Autowired
	private QuittanceRepository quittanceRepository;
	@Autowired
	private FactureRepository factureRepository;

	@Autowired
	private PoliceRepository policeRepository;
	@Autowired
	private AvenantRepository avenantRepository;

	@Autowired
	private RisqueRepository risqueRepository;

	@Autowired
	private ActeRepository acteRepository;

	@Autowired
	private QuittanceRepository_P quittanceRepository_P;
	@Autowired
	private FactureRepository_P factureRepository_P;

	@Autowired
	private PoliceRepository_P policeRepository_P;
	@Autowired
	private AvenantRepository_P avenantRepository_P;

	@Autowired
	private RisqueRepository_P risqueRepository_P;

	@Autowired
	private ActeRepository_P acteRepository_P;

	@Autowired
	private CreditExportRepository creditExportRepository;

	@Autowired
	private EngagementRepository engagementRepository;

	@Autowired
	private EngagementRepository_P engagementRepository_P;

	@Autowired
	private TarificationRepository tarificationRepository;

	@Autowired
	private BeneficiaireRepository beneficiaireRepository;

	@Autowired
	private MarcheRepository marcheRepository;

	@Autowired
	private LotRepository lotRepository;

	@Autowired
	private BeneficiaireRepository_P beneficiaireRepository_P;

	@Autowired
	private MarcheRepository_P marcheRepository_P;

	@Autowired
	private LotRepository_P lotRepository_P;

	@Autowired
	private EngagementRepository engagRepository;

	@Autowired
	private Risque_reglementesRepository risque_reglementesRepository;

	@Autowired
	private AcheteurRepository acheteurRepository;

	@Autowired
	private CreditRepository creditRepository;

	@Autowired
	private Risque_locatifRepository risque_locatifRepository;
	
	@Transactional(rollbackFor = Exception.class)
	public TarificationDisplay tariferNewFact(Long capital, String produit_id, Long inter, String typeCa,
			Long typeSoumission, String typeRisque, Long typeAvenant, Long duree) {

		TarificationDisplay td = new TarificationDisplay();
		Tarification tf;

		if (produit_id.substring(0, 2).equals("15")) {
			// Caution c = cautionRepository.getCaution(Long.parseLong(produit_id),
			// typeSoumission.intValue());
System.out.println("-------------------POLICE CMT---------------------------");
			if (typeSoumission == 2) {
				tf = tarificationRepository.getCautionExpress(Long.parseLong(produit_id));
				System.out.println(tf+"in-----type2----");
			} else {
				tf = tarificationRepository.getCaution(Long.parseLong(produit_id));
				System.out.println(tf+"in-----type----");
			}
			
			td.setTauxProduit(tf.getTaux_prime());
			td.setPrimeNette((capital * td.getTauxProduit()) / 100);
			
			System.out.println("in-----TAUX PRODUIT----"+td.getTauxProduit());
			if (typeAvenant == 3L || typeAvenant == 4L) {
				td.setPrimeNette(td.getPrimeNette() / 4);
			}

		} else if (produit_id.equals("14003001") && duree != 0) {

			tf = tarificationRepository.getTauxCreditDom(Long.parseLong(produit_id), duree.intValue());
			td.setTauxProduit(tf.getTaux_prime());
			td.setPrimeNette((capital * td.getTauxProduit()) / 100);
			if (typeAvenant == 3L  || typeAvenant == 4L) {
				td.setPrimeNette(td.getPrimeNette() / 4);
			}
		} else if (produit_id.equals("14003001") && duree == 0) {
			td.setPrimeNette(capital.doubleValue());
		} else if (produit_id.equals("14002001")) {
			// CreditExport ce = creditExportRepository.getCreditExport(typeCa.intValue(),
			// typeRisque);

			String[] tab = typeCa.split("-");
			String ca = tab[0];
			String acheteur = tab[1];

			if (ca.equals("CA_GLOBAL") && acheteur.equals("prive")) {
				tf = tarificationRepository.getTauxCreditExportCapital(Long.parseLong(produit_id), capital, ca,
						acheteur, typeRisque);
			} else {

				tf = tarificationRepository.getTauxCreditExport(Long.parseLong(produit_id), ca, acheteur, typeRisque);
			}

			td.setTauxProduit(tf.getTaux_prime());
			td.setPrimeNette((capital * td.getTauxProduit()) / 100);
			if (typeAvenant == 3L || typeAvenant == 4L) {
				td.setPrimeNette(td.getPrimeNette() / 4);
			}

		} else {

			tf = tarificationRepository.getTaux(Long.parseLong(produit_id));
			System.out.println(tf+"------------------------------");
			td.setTauxProduit(tf.getTaux_prime());
			td.setPrimeNette((capital * td.getTauxProduit()) / 100);
			if (typeAvenant == 3L || typeAvenant == 4L) {
				td.setPrimeNette(td.getPrimeNette() / 4);
			}
			
		}

		System.out.println(td.getPrimeNette());
		Taxe t = taxeRepository.findbyProduit(Long.parseLong(produit_id), new Date());
		System.out.println("----------TAXE Produit CMT--------"+t);
		System.out.println("----------TAXE APPLIQUE CMT--------"+t.getTaxe_txappliq());
		
		if (t != null) {
			td.setTauxTaxe(t.getTaxe_txappliq());
		} else {
			td.setTauxTaxe(0D);
		}
		System.out.println("----------TAXE APPLIQUE CMT--------"+t.getTaxe_txappliq());
		System.out.println(inter);
		Accessoire ac = accessoireRepository.findByProduitEtInter(Long.parseLong(produit_id), new Date(), inter);

		if (ac == null) {
			ac = accessoireRepository.findByProduitAllEtInter(Long.parseLong(produit_id.substring(0, 2) + "999999"),
					inter);

		}

		if (ac.getAcces_interv1() <= capital && capital <= ac.getAcces_interv2()) {
			System.out.println("----------INTERVALLE 1-2  --------"+capital);
			Long compagnie_accessoire = ac.getAcces_compagnie1();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur1() != null) {
				compagnie_apporteur = ac.getAcces_apporteur1();
			}
			
			if(typeAvenant==4L) {
				td.setAccessoireCompagnie(0D);
				td.setAccessoireapporteur(0D);				
			}else {
			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			}
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv3() <= capital && capital <= ac.getAcces_interv4()) {
			Long compagnie_accessoire = ac.getAcces_compagnie2();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur2() != null) {
				compagnie_apporteur = ac.getAcces_apporteur2();
			}
			
			if(typeAvenant==4L) {
				td.setAccessoireCompagnie(0D);
				td.setAccessoireapporteur(0D);				
			}else {
			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			}
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv5() <= capital && capital <= ac.getAcces_interv6()) {
			Long compagnie_accessoire = ac.getAcces_compagnie3();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur3() != null) {
				compagnie_apporteur = ac.getAcces_apporteur3();
			}
			
			if(typeAvenant==4L) {
				td.setAccessoireCompagnie(0D);
				td.setAccessoireapporteur(0D);				
			}else {
			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			}
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv7() <= capital && capital <= ac.getAcces_interv8()) {
			Long compagnie_accessoire = ac.getAcces_compagnie4();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur4() != null) {
				compagnie_apporteur = ac.getAcces_apporteur4();
			}
			
			if(typeAvenant==4L) {
				td.setAccessoireCompagnie(0D);
				td.setAccessoireapporteur(0D);				
			}else {
			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			}
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv9() <= capital && capital <= ac.getAcces_interv10()) {
			Long compagnie_accessoire = ac.getAcces_compagnie5();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur5() != null) {
				compagnie_apporteur = ac.getAcces_apporteur5();
			}

			if(typeAvenant==4L) {
				td.setAccessoireCompagnie(0D);
				td.setAccessoireapporteur(0D);				
			}else {
			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			}
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv11() <= capital && capital <= ac.getAcces_interv12()) {
			Long compagnie_accessoire = ac.getAcces_compagnie6();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur6() != null) {
				compagnie_apporteur = ac.getAcces_apporteur6();
			}

			if(typeAvenant==4L) {
				td.setAccessoireCompagnie(0D);
				td.setAccessoireapporteur(0D);				
			}else {
			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			}
			
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv13() <= capital && capital <= ac.getAcces_interv14()) {
			Long compagnie_accessoire = ac.getAcces_compagnie7();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur6() != null) {
				compagnie_apporteur = ac.getAcces_apporteur6();
			}
			
			if(typeAvenant==4L) {
				td.setAccessoireCompagnie(0D);
				td.setAccessoireapporteur(0D);				
			}else {
			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			}
			
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		}

		Commission com = commissionRepository.findbyProduitEtInter(Long.parseLong(produit_id), inter, new Date());
		System.out.println("COMMISSION---------"+com);
		if (com == null) {

			com = commissionRepository.findbyProduitAllEtInter(Long.parseLong(produit_id.substring(0, 2) + "999999"),
					inter);
			System.out.println("COMMISSION----99999999-----"+com);

		}
		

		if (com.getComm_interv1() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv2()) {
			td.setTauxCommission(com.getComm_tauxcommission12());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("COM-1---------"+td.getTauxCommission());
		} else if (com.getComm_interv3() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv4()) {
			td.setTauxCommission(com.getComm_tauxcommission34());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("2");
		} else if (com.getComm_interv5() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv6()) {
			td.setTauxCommission(com.getComm_tauxcommission56());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("3");
		} else if (com.getComm_interv7() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv8()) {
			td.setTauxCommission(com.getComm_tauxcommission78());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("4");
		} else if (com.getComm_interv9() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv9()) {

			td.setTauxCommission(com.getComm_tauxcommission910());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("5");
		}
		System.out.println("---------fiiiii---------"+duree);
		
		return td;

	}
	
	@Transactional(rollbackFor = Exception.class)
	public TarificationDisplay tariferNewFactTauxPref(Long capital, String produit_id, Long inter, String typeCa,
			Long typeSoumission, String typeRisque, Long typeAvenant, Long duree, Double tauxPreferentiel) {

		TarificationDisplay td = new TarificationDisplay();
		Tarification tf;

		if (produit_id.substring(0, 2).equals("15")) {
			// Caution c = cautionRepository.getCaution(Long.parseLong(produit_id),
			// typeSoumission.intValue());
			System.out.println("-------------------POLICE CMT---------------------------");
			if (typeSoumission == 2) {
				tf = tarificationRepository.getCautionExpress(Long.parseLong(produit_id));
				System.out.println(tf + "in-----type2----");
			} else {
				tf = tarificationRepository.getCaution(Long.parseLong(produit_id));
				System.out.println(tf + "in-----type----");
			}

//			td.setTauxProduit(tf.getTaux_prime());
			if(tauxPreferentiel != 0) {
				td.setTauxProduit(tauxPreferentiel);
			}else {
				td.setTauxProduit(tf.getTaux_prime());
			}
			td.setPrimeNette((capital * td.getTauxProduit()) / 100);

			System.out.println("in-----TAUX PRODUIT----" + td.getTauxProduit());
			if (typeAvenant == 3L || typeAvenant == 4L) {
				td.setPrimeNette(td.getPrimeNette() / 4);
			}

		} else if (produit_id.equals("14003001") && duree != 0) {
			
			System.out.println("================ DUREE de 14003001 =====================: "+ duree);

			tf = tarificationRepository.getTauxCreditDom(Long.parseLong(produit_id), duree.intValue());
			System.out.println("=====================TF===================");
			System.out.println(tf);
			System.out.println(tf.getTaux_prime());
//			td.setTauxProduit(tf.getTaux_prime());
			if(tauxPreferentiel != 0) {
				System.out.println("============ TAUX PREF: "+ tauxPreferentiel);
				td.setTauxProduit(tauxPreferentiel);
			}else {
				System.out.println("============= AMOULE TAUX PREF ==================");
				td.setTauxProduit(tf.getTaux_prime());
			}
			td.setPrimeNette((capital * td.getTauxProduit()) / 100);
			if (typeAvenant == 3L || typeAvenant == 4L) {
				td.setPrimeNette(td.getPrimeNette() / 4);
			}
		} else if (produit_id.equals("14003001") && duree == 0) {
			
			System.out.println("================ DUREE 0 de 14003001 =====================: "+ duree);
			td.setPrimeNette(capital.doubleValue());
			
		} else if (produit_id.equals("14002001")) {
			// CreditExport ce = creditExportRepository.getCreditExport(typeCa.intValue(),
			// typeRisque);

			String[] tab = typeCa.split("-");
			String ca = tab[0];
			String acheteur = tab[1];

			if (ca.equals("CA_GLOBAL") && acheteur.equals("prive")) {
				System.out.println("----prive CA_GLOBAL ----"+produit_id);
				tf = tarificationRepository.getTauxCreditExportCapital(Long.parseLong(produit_id), capital, ca,
						acheteur, typeRisque);
			} else {

				
				tf = tarificationRepository.getTauxCreditExport(Long.parseLong(produit_id), ca, acheteur, typeRisque);
			}
			System.out.println(tf+"--------"+produit_id);
//			td.setTauxProduit(tf.getTaux_prime());
			if(tauxPreferentiel != 0) {
				td.setTauxProduit(tauxPreferentiel);
			}else {
				td.setTauxProduit(tf.getTaux_prime());
			}
			td.setPrimeNette((capital * td.getTauxProduit()) / 100);
			if (typeAvenant == 3L || typeAvenant == 4L) {
				td.setPrimeNette(td.getPrimeNette() / 4);
			}

		} else {

			tf = tarificationRepository.getTaux(Long.parseLong(produit_id));
			System.out.println(tf + "------------------------------");
//			td.setTauxProduit(tf.getTaux_prime());
			if(tauxPreferentiel != 0) {
				td.setTauxProduit(tauxPreferentiel);
			}else {
				td.setTauxProduit(tf.getTaux_prime());
			}
			td.setPrimeNette((capital * td.getTauxProduit()) / 100);
			if (typeAvenant == 3L || typeAvenant == 4L) {
				td.setPrimeNette(td.getPrimeNette() / 4);
			}

		}

		System.out.println(td.getPrimeNette());
		Taxe t = taxeRepository.findbyProduit(Long.parseLong(produit_id), new Date());
		System.out.println("----------TAXE Produit CMT--------" + t);
		System.out.println("----------TAXE APPLIQUE CMT--------" + t.getTaxe_txappliq());

		if (t != null) {
			td.setTauxTaxe(t.getTaxe_txappliq());
		} else {
			td.setTauxTaxe(0D);
		}
		System.out.println("----------TAXE APPLIQUE CMT--------" + t.getTaxe_txappliq());
		System.out.println(inter);
		Accessoire ac = accessoireRepository.findByProduitEtInter(Long.parseLong(produit_id), new Date(), inter);

		if (ac == null) {
			ac = accessoireRepository.findByProduitAllEtInter(Long.parseLong(produit_id.substring(0, 2) + "999999"),
					inter);

		}

		if (ac.getAcces_interv1() <= capital && capital <= ac.getAcces_interv2()) {
			System.out.println("----------INTERVALLE 1-2  --------" + capital);
			Long compagnie_accessoire = ac.getAcces_compagnie1();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur1() != null) {
				compagnie_apporteur = ac.getAcces_apporteur1();
			}

			if (typeAvenant == 4L) {
				td.setAccessoireCompagnie(0D);
				td.setAccessoireapporteur(0D);
			} else {

				td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
				td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			}
			td.setMontantTaxe(((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur())
					* td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv3() <= capital && capital <= ac.getAcces_interv4()) {
			Long compagnie_accessoire = ac.getAcces_compagnie2();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur2() != null) {
				compagnie_apporteur = ac.getAcces_apporteur2();
			}

			if (typeAvenant == 4L) {
				td.setAccessoireCompagnie(0D);
				td.setAccessoireapporteur(0D);
			} else {

				td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
				td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			}
			td.setMontantTaxe(((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur())
					* td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv5() <= capital && capital <= ac.getAcces_interv6()) {
			Long compagnie_accessoire = ac.getAcces_compagnie3();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur3() != null) {
				compagnie_apporteur = ac.getAcces_apporteur3();
			}

			if (typeAvenant == 4L) {
				td.setAccessoireCompagnie(0D);
				td.setAccessoireapporteur(0D);
			} else {

				td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
				td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			}
			td.setMontantTaxe(((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur())
					* td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv7() <= capital && capital <= ac.getAcces_interv8()) {
			Long compagnie_accessoire = ac.getAcces_compagnie4();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur4() != null) {
				compagnie_apporteur = ac.getAcces_apporteur4();
			}

			if (typeAvenant == 4L) {
				td.setAccessoireCompagnie(0D);
				td.setAccessoireapporteur(0D);
			} else {

				td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
				td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			}
			td.setMontantTaxe(((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur())
					* td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv9() <= capital && capital <= ac.getAcces_interv10()) {
			Long compagnie_accessoire = ac.getAcces_compagnie5();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur5() != null) {
				compagnie_apporteur = ac.getAcces_apporteur5();
			}

			if (typeAvenant == 4L) {
				td.setAccessoireCompagnie(0D);
				td.setAccessoireapporteur(0D);
			} else {

				td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
				td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			}
			td.setMontantTaxe(((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur())
					* td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv11() <= capital && capital <= ac.getAcces_interv12()) {
			Long compagnie_accessoire = ac.getAcces_compagnie6();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur6() != null) {
				compagnie_apporteur = ac.getAcces_apporteur6();
			}

			if (typeAvenant == 4L) {
				td.setAccessoireCompagnie(0D);
				td.setAccessoireapporteur(0D);
			} else {

				td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
				td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			}

			td.setMontantTaxe(((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur())
					* td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv13() <= capital && capital <= ac.getAcces_interv14()) {
			Long compagnie_accessoire = ac.getAcces_compagnie7();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur6() != null) {
				compagnie_apporteur = ac.getAcces_apporteur6();
			}

			if (typeAvenant == 4L) {
				td.setAccessoireCompagnie(0D);
				td.setAccessoireapporteur(0D);
			} else {

				td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
				td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			}

			td.setMontantTaxe(((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur())
					* td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		}

		Commission com = commissionRepository.findbyProduitEtInter(Long.parseLong(produit_id), inter, new Date());
		System.out.println("COMMISSION---------" + com);
		if (com == null) {

			com = commissionRepository.findbyProduitAllEtInter(Long.parseLong(produit_id.substring(0, 2) + "999999"),
					inter);
			System.out.println("COMMISSION----99999999-----" + com);

		}

		if (com.getComm_interv1() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv2()) {
			td.setTauxCommission(com.getComm_tauxcommission12());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("COM-1---------" + td.getTauxCommission());
		} else if (com.getComm_interv3() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv4()) {
			td.setTauxCommission(com.getComm_tauxcommission34());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("2");
		} else if (com.getComm_interv5() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv6()) {
			td.setTauxCommission(com.getComm_tauxcommission56());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("3");
		} else if (com.getComm_interv7() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv8()) {
			td.setTauxCommission(com.getComm_tauxcommission78());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("4");
		} else if (com.getComm_interv9() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv9()) {

			td.setTauxCommission(com.getComm_tauxcommission910());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("5");
		}
		System.out.println("---------fiiiii---------" + duree);

		return td;

	}

	
	@Transactional(rollbackFor = Exception.class)
	public TarificationDisplay tariferNewFact(Long capital, String produit_id, Long inter, String typeCa,
			Long typeSoumission, String typeRisque, Long typeAvenant, Long duree, Double periode) {

		TarificationDisplay td = new TarificationDisplay();
		Tarification tf;

		if (produit_id.substring(0, 2).equals("15")) {
			// Caution c = cautionRepository.getCaution(Long.parseLong(produit_id),
			// typeSoumission.intValue());
System.out.println("-------------------POLICE CMT---------------------------");
			if (typeSoumission == 2) {
				tf = tarificationRepository.getCautionExpress(Long.parseLong(produit_id));
				System.out.println(tf+"in-----type2----");
			} else {
				tf = tarificationRepository.getCaution(Long.parseLong(produit_id));
				System.out.println(tf+"in-----type----");
			}
			
			td.setTauxProduit(tf.getTaux_prime());
			td.setPrimeNette((capital * td.getTauxProduit()) / 100);
			
			System.out.println("in-----TAUX PRODUIT----"+td.getTauxProduit());
			if (periode == 12L) {
				td.setPrimeNette(td.getPrimeNette() / 12);
			}else if(periode == 4L) {
				td.setPrimeNette(td.getPrimeNette() / 4);
			}else if(periode == 6L) {
				td.setPrimeNette(td.getPrimeNette() / 6);
				
			}else {

				td.setPrimeNette(td.getPrimeNette() / periode);
			}

		} else if (produit_id.equals("14003001") && duree != 0) {

			tf = tarificationRepository.getTauxCreditDom(Long.parseLong(produit_id), duree.intValue());
			td.setTauxProduit(tf.getTaux_prime());
			td.setPrimeNette((capital * td.getTauxProduit()) / 100);
			if (periode == 12L) {
				td.setPrimeNette(td.getPrimeNette() / 12);
			}else if(periode == 4L) {
				td.setPrimeNette(td.getPrimeNette() / 4);
			}else if(periode == 6L) {
				td.setPrimeNette(td.getPrimeNette() / 6);
				
			}else {

				td.setPrimeNette(td.getPrimeNette() / periode);
			}
		} else if (produit_id.equals("14003001") && duree == 0) {
			td.setPrimeNette(capital.doubleValue());
		} else if (produit_id.equals("14002001")) {
			// CreditExport ce = creditExportRepository.getCreditExport(typeCa.intValue(),
			// typeRisque);

			String[] tab = typeCa.split("-");
			String ca = tab[0];
			String acheteur = tab[1];

			if (ca.equals("CA_GLOBAL") && acheteur.equals("prive")) {
				tf = tarificationRepository.getTauxCreditExportCapital(Long.parseLong(produit_id), capital, ca,
						acheteur, typeRisque);
			} else {

				tf = tarificationRepository.getTauxCreditExport(Long.parseLong(produit_id), ca, acheteur, typeRisque);
			}

			td.setTauxProduit(tf.getTaux_prime());
			td.setPrimeNette((capital * td.getTauxProduit()) / 100);
			if (periode == 12L) {
				td.setPrimeNette(td.getPrimeNette() / 12);
			}else if(periode == 4L) {
				td.setPrimeNette(td.getPrimeNette() / 4);
			}else if(periode == 6L) {
				td.setPrimeNette(td.getPrimeNette() / 6);
				
			}else {

				td.setPrimeNette(td.getPrimeNette() / periode);
			}

		} else {

			tf = tarificationRepository.getTaux(Long.parseLong(produit_id));
			System.out.println(tf+"------------------------------");
			td.setTauxProduit(tf.getTaux_prime());
			td.setPrimeNette((capital * td.getTauxProduit()) / 100);
			if (periode == 12L) {
				td.setPrimeNette(td.getPrimeNette() / 12);
			}else if(periode == 4L) {
				td.setPrimeNette(td.getPrimeNette() / 4);
			}else if(periode == 6L) {
				td.setPrimeNette(td.getPrimeNette() / 6);
				
			}else {

				td.setPrimeNette(td.getPrimeNette() / periode);
			}
			
		}

		System.out.println(td.getPrimeNette());
		Taxe t = taxeRepository.findbyProduit(Long.parseLong(produit_id), new Date());
		System.out.println("----------TAXE Produit CMT--------"+t);
		System.out.println("----------TAXE APPLIQUE CMT--------"+t.getTaxe_txappliq());
		
		if (t != null) {
			td.setTauxTaxe(t.getTaxe_txappliq());
		} else {
			td.setTauxTaxe(0D);
		}
		System.out.println("----------TAXE APPLIQUE CMT--------"+t.getTaxe_txappliq());
		System.out.println(inter);
		Accessoire ac = accessoireRepository.findByProduitEtInter(Long.parseLong(produit_id), new Date(), inter);

		if (ac == null) {
			ac = accessoireRepository.findByProduitAllEtInter(Long.parseLong(produit_id.substring(0, 2) + "999999"),
					inter);

		}

		if (ac.getAcces_interv1() <= capital && capital <= ac.getAcces_interv2()) {
			System.out.println("----------INTERVALLE 1-2  --------"+capital);
			Long compagnie_accessoire = ac.getAcces_compagnie1();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur1() != null) {
				compagnie_apporteur = ac.getAcces_apporteur1();
			}
			
			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv3() <= capital && capital <= ac.getAcces_interv4()) {
			Long compagnie_accessoire = ac.getAcces_compagnie2();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur2() != null) {
				compagnie_apporteur = ac.getAcces_apporteur2();
			}
			
			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv5() <= capital && capital <= ac.getAcces_interv6()) {
			Long compagnie_accessoire = ac.getAcces_compagnie3();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur3() != null) {
				compagnie_apporteur = ac.getAcces_apporteur3();
			}
			
			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv7() <= capital && capital <= ac.getAcces_interv8()) {
			Long compagnie_accessoire = ac.getAcces_compagnie4();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur4() != null) {
				compagnie_apporteur = ac.getAcces_apporteur4();
			}
			
			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv9() <= capital && capital <= ac.getAcces_interv10()) {
			Long compagnie_accessoire = ac.getAcces_compagnie5();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur5() != null) {
				compagnie_apporteur = ac.getAcces_apporteur5();
			}

			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv11() <= capital && capital <= ac.getAcces_interv12()) {
			Long compagnie_accessoire = ac.getAcces_compagnie6();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur6() != null) {
				compagnie_apporteur = ac.getAcces_apporteur6();
			}

			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			
			
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv13() <= capital && capital <= ac.getAcces_interv14()) {
			Long compagnie_accessoire = ac.getAcces_compagnie7();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur6() != null) {
				compagnie_apporteur = ac.getAcces_apporteur6();
			}
			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			
			
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		}

		Commission com = commissionRepository.findbyProduitEtInter(Long.parseLong(produit_id), inter, new Date());
		System.out.println("COMMISSION---------"+com);
		if (com == null) {

			com = commissionRepository.findbyProduitAllEtInter(Long.parseLong(produit_id.substring(0, 2) + "999999"),
					inter);
			System.out.println("COMMISSION----99999999-----"+com);

		}
		

		if (com.getComm_interv1() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv2()) {
			td.setTauxCommission(com.getComm_tauxcommission12());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("COM-1---------"+td.getTauxCommission());
		} else if (com.getComm_interv3() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv4()) {
			td.setTauxCommission(com.getComm_tauxcommission34());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("2");
		} else if (com.getComm_interv5() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv6()) {
			td.setTauxCommission(com.getComm_tauxcommission56());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("3");
		} else if (com.getComm_interv7() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv8()) {
			td.setTauxCommission(com.getComm_tauxcommission78());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("4");
		} else if (com.getComm_interv9() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv9()) {

			td.setTauxCommission(com.getComm_tauxcommission910());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("5");
		}
		System.out.println("---------fiiiii---------"+duree);
		
		return td;

	}
	
	@Transactional(rollbackFor = Exception.class)
	public TarificationDisplay tariferModifCMT(Long capital, String produit_id, Long inter,
			Long typeSoumission, String typeRisque, Long typeAvenant, Long duree, Double periode, Double tauxPreferentiel) {

		TarificationDisplay td = new TarificationDisplay();
		Tarification tf;

		if (produit_id.substring(0, 2).equals("15")) {
			// Caution c = cautionRepository.getCaution(Long.parseLong(produit_id),
			// typeSoumission.intValue());
System.out.println("-------------------POLICE CMT---------------------------");
			if (typeSoumission == 2) {
				tf = tarificationRepository.getCautionExpress(Long.parseLong(produit_id));
				System.out.println(tf+"in-----type2----");
			} else {
				tf = tarificationRepository.getCaution(Long.parseLong(produit_id));
				System.out.println(tf+"in-----type----");
			}
			
			//td.setTauxProduit(tf.getTaux_prime());
			if(tauxPreferentiel != 0) {
				td.setTauxProduit(tauxPreferentiel);
			}else {
				td.setTauxProduit(tf.getTaux_prime());
			}
			td.setPrimeNette((capital * td.getTauxProduit()) / 100);
			
			System.out.println("in-----TAUX PRODUIT----"+td.getTauxProduit());
			if (periode == 12L) {
				td.setPrimeNette(td.getPrimeNette() / 12);
			}else if(periode == 4L) {
				td.setPrimeNette(td.getPrimeNette() / 4);
			}else if(periode == 6L) {
				td.setPrimeNette(td.getPrimeNette() / 2);
				
			}else if(periode == 0L) {
				td.setPrimeNette(td.getPrimeNette());
			}
			else{

				td.setPrimeNette(td.getPrimeNette() * (periode/12));
			}

		} 

		System.out.println(td.getPrimeNette());
		Taxe t = taxeRepository.findbyProduit(Long.parseLong(produit_id), new Date());
		System.out.println("----------TAXE Produit CMT--------"+t);
		System.out.println("----------TAXE APPLIQUE CMT--------"+t.getTaxe_txappliq());
		
		if (t != null) {
			td.setTauxTaxe(t.getTaxe_txappliq());
		} else {
			td.setTauxTaxe(0D);
		}
		System.out.println("----------TAXE APPLIQUE CMT--------"+t.getTaxe_txappliq());
		System.out.println(inter);
		Accessoire ac = accessoireRepository.findByProduitEtInter(Long.parseLong(produit_id), new Date(), inter);

		if (ac == null) {
			ac = accessoireRepository.findByProduitAllEtInter(Long.parseLong(produit_id.substring(0, 2) + "999999"),
					inter);

		}

		if (ac.getAcces_interv1() <= capital && capital <= ac.getAcces_interv2()) {
			System.out.println("----------INTERVALLE 1-2  --------"+capital);
			Long compagnie_accessoire = ac.getAcces_compagnie1();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur1() != null) {
				compagnie_apporteur = ac.getAcces_apporteur1();
			}
			
			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv3() <= capital && capital <= ac.getAcces_interv4()) {
			Long compagnie_accessoire = ac.getAcces_compagnie2();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur2() != null) {
				compagnie_apporteur = ac.getAcces_apporteur2();
			}
			
			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv5() <= capital && capital <= ac.getAcces_interv6()) {
			Long compagnie_accessoire = ac.getAcces_compagnie3();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur3() != null) {
				compagnie_apporteur = ac.getAcces_apporteur3();
			}
			
			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv7() <= capital && capital <= ac.getAcces_interv8()) {
			Long compagnie_accessoire = ac.getAcces_compagnie4();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur4() != null) {
				compagnie_apporteur = ac.getAcces_apporteur4();
			}
			
			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv9() <= capital && capital <= ac.getAcces_interv10()) {
			Long compagnie_accessoire = ac.getAcces_compagnie5();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur5() != null) {
				compagnie_apporteur = ac.getAcces_apporteur5();
			}

			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv11() <= capital && capital <= ac.getAcces_interv12()) {
			Long compagnie_accessoire = ac.getAcces_compagnie6();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur6() != null) {
				compagnie_apporteur = ac.getAcces_apporteur6();
			}

			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			
			
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		} else if (ac.getAcces_interv13() <= capital && capital <= ac.getAcces_interv14()) {
			Long compagnie_accessoire = ac.getAcces_compagnie7();
			Long compagnie_apporteur = 0L;
			if (ac.getAcces_apporteur6() != null) {
				compagnie_apporteur = ac.getAcces_apporteur6();
			}
			
			td.setAccessoireCompagnie(compagnie_accessoire.doubleValue());
			td.setAccessoireapporteur(compagnie_apporteur.doubleValue());
			
			
			td.setMontantTaxe(
					((td.getPrimeNette() + td.getAccessoireCompagnie() + td.getAccessoireapporteur()) * td.getTauxTaxe()) / 100);
			td.setPrimeTTC(td.getPrimeNette() + td.getAccessoireapporteur() + td.getAccessoireCompagnie()
					+ td.getMontantTaxe());

		}

		Commission com = commissionRepository.findbyProduitEtInter(Long.parseLong(produit_id), inter, new Date());
		System.out.println("COMMISSION---------"+com);
		if (com == null) {

			com = commissionRepository.findbyProduitAllEtInter(Long.parseLong(produit_id.substring(0, 2) + "999999"),
					inter);
			System.out.println("COMMISSION----99999999-----"+com);

		}
		

		if (com.getComm_interv1() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv2()) {
			td.setTauxCommission(com.getComm_tauxcommission12());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("COM-1---------"+td.getTauxCommission());
		} else if (com.getComm_interv3() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv4()) {
			td.setTauxCommission(com.getComm_tauxcommission34());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("2");
		} else if (com.getComm_interv5() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv6()) {
			td.setTauxCommission(com.getComm_tauxcommission56());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("3");
		} else if (com.getComm_interv7() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv8()) {
			td.setTauxCommission(com.getComm_tauxcommission78());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("4");
		} else if (com.getComm_interv9() <= td.getPrimeNette() && td.getPrimeNette() <= com.getComm_interv9()) {

			td.setTauxCommission(com.getComm_tauxcommission910());
			td.setMontantCommission((td.getPrimeNette() * td.getTauxCommission()) / 100);
			System.out.println("5");
		}
		System.out.println("---------fiiiii---------"+duree);
		
		return td;

	}

	@Transactional(rollbackFor = Exception.class)
	public Facture modifPoliceEcheanceSeule2(Police police, Long typeAvenant, String user, Long numFact,
			TarificationDisplay td) {

		Police ancienPolice = policeRepository.findByPolice(police.getPoli_numero());
		Avenant avenant = new Avenant(ancienPolice, typeAvenant, user);
		Long i = ancienPolice.getPoli_numerodernieravenant() + 1;

		avenant.setAven_numeroavenant(
				Long.valueOf(ancienPolice.getPoli_numero().toString() + StringUtils.leftPad(i.toString(), 9, "0"))
						.longValue());
		System.out.println(avenant.toString());
		Avenant newAv = avenantRepository.save(avenant);
		police.setPoli_numerodernieravenant(i);

		Optional<Facture> f = factureRepository.findByNum(numFact);
		Facture fact = f.get();
		Long idFact = fact.getFact_numacte();
		// fact.setFact_dateecheancecontrat(police.getPoli_dateecheance());
		Facture facture = new Facture(fact);
		// fact.setActive(0);
		// factureRepository.save(fact);
		facture.setFact_montantprimenet(td.getPrimeNette().longValue());
		facture.setFact_montantaccesapporteur(td.getAccessoireapporteur().longValue());
		facture.setFact_montantaccescompagnie(td.getAccessoireCompagnie().longValue());
		facture.setFact_montanttaxe(td.getMontantTaxe().longValue());
		facture.setFact_montantttc(td.getPrimeTTC().longValue());
		facture.setFact_commissionapporteur(td.getMontantCommission().longValue());
		facture.setFact_dateeffetcontrat(police.getPoli_dateeffetencours());
		facture.setFact_dateecheancecontrat(police.getPoli_dateecheance());

		// int t = fact.getFact_numeropolice().toString().length();

		facture.setFact_numacte(fact.getFact_numacte() + 1);

		Facture newFact = factureRepository.saveAndFlush(facture);

		Quittance q = quittanceRepository.findbyPolice(idFact);

		// q.setQuit_anciennumerofacture(idFactAnnul.toString());
		Quittance quittance = new Quittance(q);
		quittance.setQuit_dateecheance(police.getPoli_dateecheance());
		quittance.setQuit_dateeffet(police.getPoli_dateeffetencours());
		// q.setActive(0L);
		// quittanceRepository.save(q);
		quittance.setQuit_Facture(newFact.getFact_numacte());
		quittance.setQuit_primenette(td.getPrimeNette().longValue());
		quittance.setQuit_primettc(td.getPrimeTTC().longValue());
		quittance.setQuit_commissionsapporteur1(td.getMontantCommission().longValue());
		quittance.setQuit_accessoireapporteur(td.getAccessoireapporteur().longValue());
		quittance.setQuit_accessoirecompagnie(td.getAccessoireCompagnie().longValue());
		quittance.setQuit_mtntaxete(td.getMontantTaxe().longValue());
		quittance.setQuit_dateemission(new Date());
		quittance.setQuit_codeutilisateur(user);
		quittance.setQuit_dateencaissament(null);
		quittance.setQuit_mntprimencaisse(0L);
		quittance.setQuit_numero(q.getQuit_numero() + 1);

		Quittance newQuit = quittanceRepository.save(quittance);
		newFact.setFact_numeroquittance(newQuit.getQuit_numero());
		newFact.setFact_dateannulation(null);
		newFact.setFact_codeannulation(null);
		newFact.setFact_etatfacture("V");
		newFact.setFact_datefacture(new Date());
		newFact.setFact_codeutilisateur(user);
		factureRepository.save(newFact);
		// police.setPoli_dateeffetencours(newAv.getAven_dateeffet());
		policeRepository.save(police);
		return newFact;
	}

	@Transactional(rollbackFor = Exception.class)
	public Facture modifPoliceEcheanceSeuleTrimestrielle(Police police, Long typeAvenant, String user, Long numFact,
			TarificationDisplay td, Date dateffect) {
		System.out.println("----------yooooooooooooooo--------------" + dateffect
				+ "-------------yaaaaaaaaaaaaaaaa---------------");
		Police ancienPolice = policeRepository.findByPolice(police.getPoli_numero());
		Avenant avenant = new Avenant(ancienPolice, typeAvenant, user);
		Long i = ancienPolice.getPoli_numerodernieravenant() + 1;

		avenant.setAven_numeroavenant(
				Long.valueOf(ancienPolice.getPoli_numero().toString() + StringUtils.leftPad(i.toString(), 9, "0"))
						.longValue());
		System.out.println(avenant.toString());
		Avenant newAv = avenantRepository.save(avenant);
		police.setPoli_numerodernieravenant(i);

		Optional<Facture> f = factureRepository.findByNum(numFact);
		Facture fact = f.get();
		Long idFact = fact.getFact_numacte();
		// fact.setFact_dateecheancecontrat(police.getPoli_dateecheance());
		Facture facture = new Facture(fact);
		// fact.setActive(0);
		// factureRepository.save(fact);
		facture.setFact_montantprimenet(td.getPrimeNette().longValue());
		facture.setFact_montantaccesapporteur(td.getAccessoireapporteur().longValue());
		facture.setFact_montantaccescompagnie(td.getAccessoireCompagnie().longValue());
		facture.setFact_montanttaxe(td.getMontantTaxe().longValue());
		facture.setFact_montantttc(td.getPrimeTTC().longValue());
		facture.setFact_commissionapporteur(td.getMontantCommission().longValue());
		facture.setFact_dateeffetcontrat(dateffect);
		facture.setFact_dateecheancecontrat(police.getPoli_dateecheance());

		// int t = fact.getFact_numeropolice().toString().length();

		facture.setFact_numacte(fact.getFact_numacte() + 1);

		Facture newFact = factureRepository.saveAndFlush(facture);

		Quittance q = quittanceRepository.findbyPolice(idFact);

		// q.setQuit_anciennumerofacture(idFactAnnul.toString());
		Quittance quittance = new Quittance(q);
		quittance.setQuit_dateecheance(police.getPoli_dateecheance());
		quittance.setQuit_dateeffet(dateffect);
		// q.setActive(0L);
		// quittanceRepository.save(q);
		quittance.setQuit_Facture(newFact.getFact_numacte());
		quittance.setQuit_primenette(td.getPrimeNette().longValue());
		quittance.setQuit_primettc(td.getPrimeTTC().longValue());
		quittance.setQuit_commissionsapporteur1(td.getMontantCommission().longValue());
		quittance.setQuit_accessoireapporteur(td.getAccessoireapporteur().longValue());
		quittance.setQuit_accessoirecompagnie(td.getAccessoireCompagnie().longValue());
		quittance.setQuit_mtntaxete(td.getMontantTaxe().longValue());
		quittance.setQuit_dateemission(new Date());
		quittance.setQuit_codeutilisateur(user);
		quittance.setQuit_dateencaissament(null);
		quittance.setQuit_mntprimencaisse(0L);
		quittance.setQuit_numero(q.getQuit_numero() + 1);

		Quittance newQuit = quittanceRepository.save(quittance);
		newFact.setFact_numeroquittance(newQuit.getQuit_numero());
		newFact.setFact_dateannulation(null);
		newFact.setFact_codeannulation(null);
		newFact.setFact_etatfacture("V");
		newFact.setFact_datefacture(new Date());
		newFact.setFact_codeutilisateur(user);
		factureRepository.save(newFact);
		// police.setPoli_dateeffetencours(newAv.getAven_dateeffet());
		policeRepository.save(police);
		return newFact;
	}

	@Transactional(rollbackFor = Exception.class)
	public Facture modifPoliceCorrectionEngag(PoliceTarif pt, Long typeAvenant, String user, Long numFact) {
		Facture newFact = this.modifPoliceEcheanceSeule2(pt.getPolice(), typeAvenant, user, numFact, pt.getTarif());
		Risque r = risqueRepository.getRisquePolice(pt.getPolice().getPoli_numero());
		r.setRisq_capitalassure(pt.getActe().getAct_capitalassure());
		r.setRisq_capitallci(pt.getActe().getAct_capitallci());
		r.setRisq_capitalsmp(pt.getActe().getAct_capitalsmp());
		Engagement engag = engagementRepository.findEngByPolice1(1, pt.getPolice().getPoli_numero());
		engag.setEngag_kapassure(pt.getActe().getAct_capitalassure() + pt.getActe().getAct_capitallci()
				+ pt.getActe().getAct_capitalsmp());
		engagementRepository.save(engag);

		newFact.setFact_anciennumerofacture(numFact.toString());
		newFact.setFact_dateannulation(null);
		newFact.setFact_codeannulation(null);
		newFact.setFact_etatfacture("V");
		newFact.setFact_capitalassure(pt.getActe().getAct_capitalassure());
		newFact.setFact_capitallci(pt.getActe().getAct_capitallci());
		newFact.setFact_capitalsmp(pt.getActe().getAct_capitalsmp());

		factureRepository.save(newFact);
		System.out.println("--------------la-----------");
		//Quittance q = quittanceRepository.findbyPolice(numFact);
		Quittance q = quittanceRepository.findbyIdd(newFact.getFact_numeroquittance());
		System.out.println("---------------ici-----------");
		q.setQuit_typologieannulation(null);
		q.setQuit_dateannulation(null);
		q.setQuit_numeroquittanceannul(null);
		//q.setQuit_id(65008L);
		quittanceRepository.save(q);
		acteRepository.save(pt.getActe());

		return newFact;
	}
	/*
	@Transactional(rollbackFor = Exception.class)
	public Facture modifPoliceCorrectionEngag1(PoliceTarif pt, Long typeAvenant, String user, Long numFact) {
		
		Facture newFact = this.modifPoliceEcheanceSeule2(pt.getPolice(), typeAvenant, user, numFact, pt.getTarif());
		Risque r = risqueRepository.getRisquePolice(pt.getPolice().getPoli_numero());
		r.setRisq_capitalassure(pt.getActe().getAct_capitalassure());
		r.setRisq_capitallci(pt.getActe().getAct_capitallci());
		r.setRisq_capitalsmp(pt.getActe().getAct_capitalsmp());
		Engagement engag = engagementRepository.findEngByPolice1(1, pt.getPolice().getPoli_numero());
		engag.setEngag_kapassure(pt.getActe().getAct_capitalassure() + pt.getActe().getAct_capitallci()
				+ pt.getActe().getAct_capitalsmp());
		engagementRepository.save(engag);

		newFact.setFact_anciennumerofacture(numFact.toString());
		newFact.setFact_dateannulation(null);
		newFact.setFact_codeannulation(null);
		newFact.setFact_etatfacture("V");
		newFact.setFact_capitalassure(pt.getActe().getAct_capitalassure());
		newFact.setFact_capitallci(pt.getActe().getAct_capitallci());
		newFact.setFact_capitalsmp(pt.getActe().getAct_capitalsmp());

		factureRepository.save(newFact);

		Quittance q = quittanceRepository.findbyPolice(numFact);
		q.setQuit_typologieannulation(null);
		q.setQuit_dateannulation(null);
		q.setQuit_numeroquittanceannul(null);

		quittanceRepository.save(q);
		acteRepository.save(pt.getActe());

		return newFact;
	}
	*/

	@Transactional(rollbackFor = Exception.class)
	public String ajoutPolice(PoliceFront policeFront) {

		Long brancheCredit = 14L;

		Police police = policeFront.getPoliceForm();
		Risque risque = policeFront.getRisque();
		Acte acte = policeFront.getActe();
		Beneficiaire beneficiaire = policeFront.getBeneficiaire();
		System.out.println(beneficiaire.getBenef_Num() + "--------------------------------");
		Quittance quittance = policeFront.getQuittance();
		List<Lot> lots = policeFront.getLots();
		Marche marche = policeFront.getMarche();
		Risque_reglementes risqueR = policeFront.getRisqueR();
		Credit credit = policeFront.getCredit();
		List<Acheteur> acheteurs = policeFront.getAcheteurs();
		Risque_locatif risque_locatif = policeFront.getRisqueLocatif();

		// saving police
		Date dateModification = new Date();
		police.setPoli_datemodification(dateModification);
		police.setPoli_status(1);
		policeRepository.save(police);
		police.setPoli_numero(police.getPoli_numero());
		// end saving police

		// saving avenant
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		UserPrinciple u = (UserPrinciple) auth.getPrincipal();

		
		Avenant avenant = new Avenant(police, 1L,  u.getUtil_num());
		avenant.setAven_statut("Actif");
		avenant.setAven_numeropolice(police.getPoli_numero());
		avenant.setAven_numeroavenant(Long.parseLong((police.getPoli_numero()) + "000000001"));
		avenantRepository.save(avenant);
		police.setPoli_numerodernieravenant(avenant.getAven_numeroavenant());
		// end saving avenant

		// saving beneficiaire
		if (beneficiaire.getBenef_Num() == null || beneficiaire.getBenef_Num().equals("")) {

			// C'est un nouveau bénéficiaire
			if (police.getPoli_branche() == brancheCredit) {
				beneficiaireRepository.save(beneficiaire);
			} else {
				
				if (!beneficiaire.getBenef_prenoms().equals("")) {
					beneficiaire.setBenef_nom(beneficiaire.getBenef_denom());
					beneficiaire.setBenef_denom("");
					beneficiaireRepository.save(beneficiaire);
				} else {
					beneficiaireRepository.save(beneficiaire);
				}
			}
		} 
		

		// saving acte
		acte.setAct_status("en cours");
		acte.setAct_numeropolice(police.getPoli_numero());
		acte.setAct_numero(Long.parseLong((police.getPoli_numero()) + "0000001"));
		acte.setAct_idbeneficiaire(beneficiaire.getBenef_Num());
		acte.setAct_capitallci(0L);
		acte.setAct_capitalsmp(0L);
		// acte.setAct_status("Inactif");
		acteRepository.save(acte);
		// end saving acte

		// saving risque
		risque.setRisq_status("Actif");
		risque.setRisq_numeropolice(police.getPoli_numero());
		risque.setRisq_numeroacte(acte.getAct_numero());
		risque.setRisq_numero(Long.parseLong((police.getPoli_numero()) + "0001"));
		risqueRepository.save(risque);
		// end saving risque

		if (police.getPoli_codeproduit() >= 15001001 && police.getPoli_codeproduit() <= 15001005) {

			// saving marche
			marche.setMarch_idcontractante(beneficiaire.getBenef_Num());
			marche.setMarch_numeroacte(acte.getAct_numero());
			marcheRepository.save(marche);
			// end saving marche
			// saving lot
			for (Lot lot : lots) {

				lot.setLot_numeroacte(acte.getAct_numero());
				lot.setLot_numeromarche(String.valueOf(marche.getMarch_numero()));
				lotRepository.save(lot);

			}
			// end saving lot
		} else if (police.getPoli_codeproduit() >= 15001006 && police.getPoli_codeproduit() <= 15001009) {
			risqueR.setRiskr_beneficiaire(beneficiaire.getBenef_Num());
			risqueR.setRiskr_description(risque.getRisq_designation1());
			risqueR.setRiskr_numeroclient(police.getPoli_client());
			risqueR.setRiskr_numeropolice(police.getPoli_numero());
			risqueR.setRiskr_numerorisquegenerique(risque.getRisq_numero());
			risque_reglementesRepository.save(risqueR);
		} else if (police.getPoli_codeproduit() == 14001001 || police.getPoli_codeproduit() == 14003001
				|| police.getPoli_codeproduit() == 14002001) {

			for (Acheteur a : acheteurs) {
				a.setAchet_numeroaffaire(police.getPoli_numero());
				a.setAchet_numeroclient(police.getPoli_client());
				a.setActive(1);
				acheteurRepository.save(a);
				Credit credit1 = new Credit();
				credit1.setCredit_numpol(police.getPoli_numero());
				credit1.setCredit_numeroclient(police.getPoli_client());
				credit1.setCredit_mtncredit(a.getAchet_montantcredit());
				credit1.setCredit_numeroachateur(a.getAchet_numero());
				credit1.setCredit_type(credit.getCredit_type());
				credit1.setCredit_nbecheanceaccorde(a.getAchet_montantecheancecredit());
				creditRepository.save(credit1);
				// credit1 = null;
				System.out.println("credit-------------------------");
			}
			/*
			 * if(police.getPoli_codeproduit() == 16008001) {
			 * risque_locatif.setRiskl_numeroclient(police.getPoli_client());
			 * risque_locatif.setRiskl_numeropolice(police.getPoli_numero());
			 * risque_locatif.setRiskl_numerorisquegenerique(risque.getRisq_numero());
			 * risque_locatifRepository.save(risque_locatif); }
			 */
		} else if (police.getPoli_codeproduit() == 16008001) {
			for (Acheteur a : acheteurs) {
				a.setAchet_numeroaffaire(police.getPoli_numero());
				a.setAchet_numeroclient(police.getPoli_client());
				a.setActive(1);
				acheteurRepository.save(a);
				Risque_locatif risque1 = new Risque_locatif();
				risque1.setRiskl_numeroclient(police.getPoli_client());
				risque1.setRiskl_numeropolice(police.getPoli_numero());
				risque1.setRiskl_numerorisquegenerique(risque.getRisq_numero());
				risque1.setRiskl_numeroacheteur(a.getAchet_numero());
				risque1.setRiskl_description(risque_locatif.getRiskl_description());
				risque1.setRiskl_type(risque_locatif.getRiskl_type());
				risque1.setRiskl_mtnloyer(a.getAchet_montant_loyer());
				risque_locatifRepository.save(risque1);
				System.out.println("credit-------------------------");
			}

		}

		// saving engagement
		Engagement engag = new Engagement();
		engag.setActive(1);
		engag.setEngag_status("en cours");
		engag.setEngag_numeroacte(acte.getAct_numero());
		engag.setEngag_numpoli(police.getPoli_numero());
		engag.setEngag_numeroavenant(avenant.getAven_numeroavenant());
		engag.setEngag_numeroengagement(Long.parseLong((acte.getAct_numero()) + "000001"));
		if (police.getPoli_codeproduit() >= 15001001 && police.getPoli_codeproduit() <= 15001005) {
			engag.setEngag_codemarche(marche.getMarch_numero());
		}
		engag.setEngag_kapassure(acte.getAct_capitalassure());
		engag.setEngag_dateengagement(new Date());

		engagRepository.save(engag);
		// end saving engagement

		// saving quittance
		quittance.setQuit_status(" ");
		quittance.setActive(1L);
		quittance.setQuit_numeropolice(police.getPoli_numero());
		quittance.setQuit_numerorisque(risque.getRisq_numero());
		// quittance.setQuit_Facture(facture.getFact_numacte());
		quittance.setQuit_numero(Long.parseLong((police.getPoli_numero()) + "00000001"));
		quittance.setQuit_typequittance("N");
		quittance.setQuit_numeroaperitrice("SONAC");
		quittance.setQuit_typeecriture("emission");
		quittance.setQuit_numavenant(avenant.getAven_numeroavenant());
		quittance.setQuit_dateemission(new Date());
		quittance.setQuit_dateeffet(police.getPoli_dateeffetencours());
		quittance.setQuit_dateecheance(police.getPoli_dateecheance());
		quittance.setQuit_numerointermedaire(police.getPoli_intermediaire());
		quittance.setQuit_codeutilisateur(u.getUtil_num());
		quittance.setQuit_numerocie("SNNVIAS008");
		quittanceRepository.save(quittance);
		// end saving quittance

		// saving facture

		Facture facture = new Facture();
		facture.setFact_numacte(Long.parseLong((police.getPoli_numero()) + "00000001"));
		facture.setActive(1);
		facture.setFact_etatfacture("V");
		facture.setFact_numeropolice(police.getPoli_numero());
		facture.setFact_numeroacte(acte.getAct_numero());
		facture.setFact_numerobeneficiaire(beneficiaire.getBenef_Num());
		facture.setFact_numeroquittance(quittance.getQuit_numero());
		facture.setFact_marche(String.valueOf(marche.getMarch_numero()));
		facture.setFact_numerosouscripteurcontrat(police.getPoli_client());
		facture.setFact_numerobeneficiaire(beneficiaire.getBenef_Num());
		facture.setFact_montantprimenet(quittance.getQuit_primenette());
		facture.setFact_montantaccesapporteur(quittance.getQuit_accessoireapporteur());
		facture.setFact_montantaccescompagnie(quittance.getQuit_accessoirecompagnie());
		facture.setFact_montanttaxe(quittance.getQuit_mtntaxete());
		facture.setFact_commissionapporteur(quittance.getQuit_commissionsapporteur1());
		facture.setFact_montantttc(quittance.getQuit_primettc());
		facture.setFact_numerobranche(police.getPoli_branche());
		facture.setFact_numerocategorie(police.getPoli_categorie());
		facture.setFact_dateeffetcontrat(police.getPoli_dateeffetencours());
		facture.setFact_dateecheancecontrat(police.getPoli_dateecheance());
		facture.setFact_datefacture(new Date());
		facture.setFact_codeutilisateur(u.getUtil_num());
		facture.setFact_capitalassure(acte.getAct_capitalassure());
		factureRepository.save(facture);
		// end saving facture
		Quittance newQuittance = quittanceRepository.findbyIdd(quittance.getQuit_numero());
		newQuittance.setQuit_Facture(facture.getFact_numacte());
		quittanceRepository.save(newQuittance);

		return police.getPoli_numero().toString();

	}

	public PoliceFront getPolice(Long numpol) {

		PoliceFront police = new PoliceFront();
		police.setPoliceForm(policeRepository.findByPolice(numpol));
		police.setActe(acteRepository.getActePolice(numpol));
		police.setRisque(risqueRepository.getRisquePolice(numpol));
		police.setQuittance(quittanceRepository.findbyNumpol(numpol));
		police.setEngagement(engagementRepository.findEngByPolice1(1, numpol));
		police.setBeneficiaire(beneficiaireRepository.findByCode(police.getActe().getAct_idbeneficiaire()));
		;

		if (police.getPoliceForm().getPoli_branche() == 15) {

			police.setMarche(marcheRepository.findbyActe(police.getActe().getAct_numero()));
			police.setLots(lotRepository.findbyActe(police.getActe().getAct_numero()));
			police.setRisqueR(risque_reglementesRepository.findByPolice(numpol));
			;
		} else if (police.getPoliceForm().getPoli_branche() == 14) {
			List<Credit> credits = creditRepository.findByPolice(numpol);
			List<Acheteur> acheteurs = new ArrayList<Acheteur>();
			police.setAcheteurs(acheteurs);
			for (Credit credit : credits) {
				police.getAcheteurs().add(acheteurRepository.findByIdd(credit.getCredit_numeroachateur()));
			}
			police.setCredit(credits.get(0));

		} else if (police.getPoliceForm().getPoli_branche() == 16) {
			List<Risque_locatif> riskls = risque_locatifRepository.findByPolice(numpol);
			List<Acheteur> acheteurs = new ArrayList<Acheteur>();
			police.setAcheteurs(acheteurs);
			for (Risque_locatif riskl : riskls) {
				police.getAcheteurs().add(acheteurRepository.findByIdd(riskl.getRiskl_numeroacheteur()));
			}
			police.setRisqueLocatif(riskls.get(0));

		}
		return police;
	}

	public PoliceFront getProposition(Long numpol) {

		PoliceFront police = new PoliceFront();
		police.setPoliceForm(new Police(policeRepository_P.findByPolice(numpol)));
		police.setActe(new Acte(acteRepository_P.getActe_PPolice(numpol)));
		police.setRisque(new Risque(risqueRepository_P.getRisque_PPolice(numpol)));
		police.setQuittance(new Quittance(quittanceRepository_P.findbyNumpol(numpol)));
		// police.setEngagement(new
		// Engagement(engagementRepository_P.findEngByPolice1(1, numpol)));
		police.setBeneficiaire(
				new Beneficiaire(beneficiaireRepository_P.findByCode(police.getActe().getAct_idbeneficiaire())));

		if (police.getPoliceForm().getPoli_branche() == 15) {
			System.out.println(police.getActe().getAct_numero());
			police.setMarche(new Marche(
					marcheRepository_P.findbyActe(acteRepository_P.getActe_PPolice(numpol).getAct_numero())));
			System.out.println(police.getMarche());
			List<Lot> lots = new ArrayList<Lot>();
			for (Lot_P l : lotRepository_P.findbyActe(police.getActe().getAct_numero())) {
				lots.add(new Lot(l));
			}
			police.setLots(lots);
			// police.setRisqueR(risque_reglementesRepository.findByPolice(numpol));
			;
		} /*
			 * else if (police.getPoliceForm().getPoli_branche() == 14) { List<Credit>
			 * credits = creditRepository.findByPolice(numpol); List<Acheteur> acheteurs =
			 * new ArrayList<Acheteur>(); police.setAcheteurs(acheteurs); for (Credit credit
			 * : credits) { police.getAcheteurs().add(acheteurRepository.findByIdd(credit.
			 * getCredit_numeroachateur())); } police.setCredit(credits.get(0));
			 * 
			 * } else if (police.getPoliceForm().getPoli_branche() == 16) {
			 * List<Risque_locatif> riskls = risque_locatifRepository.findByPolice(numpol);
			 * List<Acheteur> acheteurs = new ArrayList<Acheteur>();
			 * police.setAcheteurs(acheteurs); for (Risque_locatif riskl : riskls) {
			 * police.getAcheteurs().add(acheteurRepository.findByIdd(riskl.
			 * getRiskl_numeroacheteur())); } police.setRisqueLocatif(riskls.get(0));
			 * 
			 * }
			 */

		return police;
	}

	@Transactional(rollbackFor = Exception.class)
	public String ajoutAcheteurPolice(ajoutAcheteurFront acheteurFront, Long numpol) {

		Police police = policeRepository.findByPolice(numpol);
		// Risque_locatif risque_locatif =
		// risque_locatifRepository.findByPolice(numpol);
		Risque risque = risqueRepository.getRisquePolice(numpol);
		Quittance quittance = acheteurFront.getQuittance();
		Acte acte = acteRepository.getActePolice(numpol);

		if (police.getPoli_codeproduit() == 14001001 || police.getPoli_codeproduit() == 14003001
				|| police.getPoli_codeproduit() == 14002001) {

			for (Acheteur a : acheteurFront.getAcheteurs()) {
				System.out.println(a);
				System.out.println(a.getAchet_numero());
				
				a.setAchet_numeroaffaire(police.getPoli_numero());
				a.setAchet_numeroclient(police.getPoli_client());
				a.setActive(1);
				Credit credit1 = new Credit();
				credit1.setCredit_numpol(police.getPoli_numero());
				credit1.setCredit_numeroclient(police.getPoli_client());
				credit1.setCredit_mtncredit(a.getAchet_montantcredit());
				credit1.setCredit_numeroachateur(a.getAchet_numero());
				credit1.setCredit_nbecheanceaccorde(a.getAchet_montantecheancecredit());
				// credit1.setCredit_type(credit.getCredit_type());
				creditRepository.save(credit1);
				if (a.getAchet_numero() == null) {
					
//					acheteurRepository.save(a);
					Acheteur achetSaved = acheteurRepository.save(a);
					credit1.setCredit_numeroachateur(achetSaved.getAchet_numero());

				} else {
					Acheteur ach = acheteurRepository.findByIdd(a.getAchet_numero());
					// a.setAchet_numero(a.getAchet_numero());
					a.setAchet_id(ach.getAchet_id());
					acheteurRepository.save(a);

//					System.out.println(a);
					// acheteurRepository.save(ach);
				}

				// credit1 = null;
				System.out.println("credit-------------------------");
			}

		} else if (police.getPoli_codeproduit() == 16008001) {
			for (Acheteur a : acheteurFront.getAcheteurs()) {
				a.setAchet_numeroaffaire(police.getPoli_numero());
				a.setAchet_numeroclient(police.getPoli_client());
				a.setActive(1);

				// acheteurRepository.save(a);
				Risque_locatif risque1 = new Risque_locatif();
				risque1.setRiskl_numeroclient(police.getPoli_client());
				risque1.setRiskl_numeropolice(police.getPoli_numero());
				risque1.setRiskl_numerorisquegenerique(risque.getRisq_numero());
//				risque1.setRiskl_numeroacheteur(a.getAchet_numero());
				// risque1.setRiskl_description(risque_locatif.getRiskl_description());
				// risque1.setRiskl_type(risque_locatif.getRiskl_type());
				risque1.setRiskl_mtnloyer(a.getAchet_montant_loyer());
				risque_locatifRepository.save(risque1);

				if (a.getAchet_numero() == null) {
					Acheteur achetSaved = acheteurRepository.save(a);
					risque1.setRiskl_numeroacheteur(achetSaved.getAchet_numero());

				} else {
					Acheteur ach = acheteurRepository.findByIdd(a.getAchet_numero());
					// a.setAchet_numero(a.getAchet_numero());
					a.setAchet_id(ach.getAchet_id());
					acheteurRepository.save(a);

//					System.out.println(a);
					// acheteurRepository.save(ach);
				}

				System.out.println("credit-------------------------");
			}

		}

		// saving quittance
		quittance.setQuit_status(" ");
		quittance.setActive(1L);
		quittance.setQuit_numeropolice(police.getPoli_numero());
		quittance.setQuit_numerorisque(risque.getRisq_numero());
		// quittance.setQuit_Facture(facture.getFact_numacte());
//		quittance.setQuit_numero(Long.parseLong((police.getPoli_numero()) + "00000002"));
		Quittance derniereQuittance = quittanceRepository.getDerniereQuitByPolice(police.getPoli_numero());
		if(derniereQuittance != null) {
			quittance.setQuit_numero(derniereQuittance.getQuit_numero() + 1);
		}
//		System.out.println(quittance.getQuit_numero());
		quittance.setQuit_typequittance("N");
		quittance.setQuit_typeecriture("emission");
		// quittance.setQuit_numavenant(avenant.getAven_numeroavenant());
		quittance.setQuit_dateemission(new Date());
		quittance.setQuit_dateeffet(police.getPoli_dateeffetencours());
		quittance.setQuit_dateecheance(police.getPoli_dateecheance());
		quittance.setQuit_numerointermedaire(police.getPoli_intermediaire());
//		quittance.setQuit_id(null);
		quittanceRepository.save(quittance);
		// end saving quittance

		// saving facture

		Facture facture = new Facture();
		Facture derniereFacture = factureRepository.getMaxNumFactureByPolice(police.getPoli_numero());
		if(derniereFacture != null) {
			facture.setFact_numacte(derniereFacture.getFact_numacte() + 1);
		}

		System.out.println(facture.getFact_numacte());
//		facture.setFact_numacte(Long.parseLong((police.getPoli_numero()) + "00000003"));
		facture.setActive(1);
		facture.setFact_etatfacture("V");
		facture.setFact_numeropolice(police.getPoli_numero());
		facture.setFact_numeroacte(acte.getAct_numero());
		// facture.setFact_numerobeneficiaire(beneficiaire.getBenef_Num());
		facture.setFact_numeroquittance(quittance.getQuit_numero());
		// facture.setFact_marche(String.valueOf(marche.getMarch_numero()));
		facture.setFact_numerosouscripteurcontrat(police.getPoli_client());
		// facture.setFact_numerobeneficiaire(beneficiaire.getBenef_Num());
		facture.setFact_montantprimenet(quittance.getQuit_primenette());
		facture.setFact_montantaccesapporteur(quittance.getQuit_accessoireapporteur());
		facture.setFact_montantaccescompagnie(quittance.getQuit_accessoirecompagnie());
		facture.setFact_montanttaxe(quittance.getQuit_mtntaxete());
		facture.setFact_commissionapporteur(quittance.getQuit_commissionsapporteur1());
		facture.setFact_montantttc(quittance.getQuit_primettc());
		facture.setFact_numerobranche(police.getPoli_branche());
		facture.setFact_numerocategorie(police.getPoli_categorie());
		facture.setFact_dateeffetcontrat(police.getPoli_dateeffetencours());
		facture.setFact_dateecheancecontrat(police.getPoli_dateecheance());
		facture.setFact_datefacture(new Date());
		facture.setFact_capitalassure(acte.getAct_capitalassure());
		factureRepository.save(facture);
		// end saving facture
		Quittance newQuittance = quittanceRepository.findbyIdd(quittance.getQuit_numero());
		newQuittance.setQuit_Facture(facture.getFact_numacte());
		quittanceRepository.save(newQuittance);

		return "acheteurs enregistrés avec succes";
	}

	@Transactional(rollbackFor = Exception.class)
	public String ajoutAcheteurPolice(ajoutAcheteurFront acheteurFront, Long numpol, Long capiAct, Long numFact) {
		System.out.println("-----test------");
		Police police = policeRepository.findByPolice(numpol);
		// Risque_locatif risque_locatif =
		// risque_locatifRepository.findByPolice(numpol);
		System.out.println("-----test2------");
		Risque risque = risqueRepository.getRisquePolice(numpol);
		Quittance quittance = acheteurFront.getQuittance();
		System.out.println("-----test3------");
		Long numAct = factureRepository.findByNumFacture(numFact);
		Acte acte = acteRepository.findbyCode(numAct);
		
		//Long Long numAct=acteRepository.lastIdgActeByPolice(numpol);
		System.out.println("-----numero acte------------------"+numAct);
		System.out.println("-----espace------------------");
		Acte newAct = new Acte();
		System.out.println("-----acte------------------"+acte);
		newAct.setAct_capitalassure(capiAct);
		newAct.setAct_numero(numAct+1);
		newAct.setAct_numeropolice(numpol);
		newAct.setAct_typegarantie(acte.getAct_typegarantie());
		newAct.setAct_capitalsmp(acte.getAct_capitalsmp());
		newAct.setAct_capitallci(acte.getAct_capitallci());
		newAct.setAct_anciennumero(acte.getAct_anciennumero());
		newAct.setAct_status(acte.getAct_status());
		newAct.setAct_descriptionmarche(acte.getAct_descriptionmarche());
		newAct.setAct_idcandidat(acte.getAct_idcandidat());
		newAct.setAct_idbeneficiaire(acte.getAct_idbeneficiaire());
		newAct.setAct_idcontractante(acte.getAct_idcontractante());
		newAct.setAct_datemarche(acte.getAct_datemarche());
		newAct.setAct_codemarche(acte.getAct_codemarche());
		newAct.setAct_numeromarchepublic(acte.getAct_numeromarchepublic());
		newAct.setAct_typemarche(acte.getAct_typemarche());
		
		
		//newAct.setAct_id(null);
		System.out.println("-----------"+ newAct);
		Acte acteSave = acteRepository.saveAndFlush(newAct);
		System.out.println("-----test------");

		if (police.getPoli_codeproduit() == 14001001 || police.getPoli_codeproduit() == 14003001
				|| police.getPoli_codeproduit() == 14002001) {

			for (Acheteur a : acheteurFront.getAcheteurs()) {
				System.out.println(a);
				System.out.println(a.getAchet_numero());
				
				a.setAchet_numeroaffaire(police.getPoli_numero());
				a.setAchet_numeroclient(police.getPoli_client());
				a.setActive(1);
				Credit credit1 = new Credit();
				credit1.setCredit_numpol(police.getPoli_numero());
				credit1.setCredit_numeroclient(police.getPoli_client());
				credit1.setCredit_mtncredit(a.getAchet_montantcredit());
				credit1.setCredit_numeroachateur(a.getAchet_numero());
				credit1.setCredit_nbecheanceaccorde(a.getAchet_montantecheancecredit());
				// credit1.setCredit_type(credit.getCredit_type());
				creditRepository.save(credit1);
				if (a.getAchet_numero() == null) {
					
//					acheteurRepository.save(a);
					Acheteur achetSaved = acheteurRepository.save(a);
					credit1.setCredit_numeroachateur(achetSaved.getAchet_numero());

				} else {
					Acheteur ach = acheteurRepository.findByIdd(a.getAchet_numero());
					// a.setAchet_numero(a.getAchet_numero());
					a.setAchet_id(ach.getAchet_id());
					acheteurRepository.save(a);

//					System.out.println(a);
					// acheteurRepository.save(ach);
				}

				// credit1 = null;
				System.out.println("credit-------------------------");
			}

		} else if (police.getPoli_codeproduit() == 16008001) {
			for (Acheteur a : acheteurFront.getAcheteurs()) {
				a.setAchet_numeroaffaire(police.getPoli_numero());
				a.setAchet_numeroclient(police.getPoli_client());
				a.setActive(1);

				// acheteurRepository.save(a);
				Risque_locatif risque1 = new Risque_locatif();
				risque1.setRiskl_numeroclient(police.getPoli_client());
				risque1.setRiskl_numeropolice(police.getPoli_numero());
				risque1.setRiskl_numerorisquegenerique(risque.getRisq_numero());
//				risque1.setRiskl_numeroacheteur(a.getAchet_numero());
				// risque1.setRiskl_description(risque_locatif.getRiskl_description());
				// risque1.setRiskl_type(risque_locatif.getRiskl_type());
				risque1.setRiskl_mtnloyer(a.getAchet_montant_loyer());
				risque_locatifRepository.save(risque1);

				if (a.getAchet_numero() == null) {
					Acheteur achetSaved = acheteurRepository.save(a);
					risque1.setRiskl_numeroacheteur(achetSaved.getAchet_numero());

				} else {
					Acheteur ach = acheteurRepository.findByIdd(a.getAchet_numero());
					// a.setAchet_numero(a.getAchet_numero());
					a.setAchet_id(ach.getAchet_id());
					acheteurRepository.save(a);

//					System.out.println(a);
					// acheteurRepository.save(ach);
				}

				System.out.println("credit-------------------------");
			}

		}

		// saving quittance
		quittance.setQuit_status(" ");
		quittance.setActive(1L);
		quittance.setQuit_numeropolice(police.getPoli_numero());
		quittance.setQuit_numerorisque(risque.getRisq_numero());
		// quittance.setQuit_Facture(facture.getFact_numacte());
//		quittance.setQuit_numero(Long.parseLong((police.getPoli_numero()) + "00000002"));
		Quittance derniereQuittance = quittanceRepository.getDerniereQuitByPolice(police.getPoli_numero());
		if(derniereQuittance != null) {
			quittance.setQuit_numero(derniereQuittance.getQuit_numero() + 1);
		}
//		System.out.println(quittance.getQuit_numero());
		quittance.setQuit_typequittance("N");
		quittance.setQuit_typeecriture("emission");
		// quittance.setQuit_numavenant(avenant.getAven_numeroavenant());
		quittance.setQuit_dateemission(new Date());
		quittance.setQuit_dateeffet(police.getPoli_dateeffetencours());
		quittance.setQuit_dateecheance(police.getPoli_dateecheance());
		quittance.setQuit_numerointermedaire(police.getPoli_intermediaire());
//		quittance.setQuit_id(null);
		quittanceRepository.save(quittance);
		// end saving quittance

		// saving facture

		Facture facture = new Facture();
		Facture derniereFacture = factureRepository.getMaxNumFactureByPolice(police.getPoli_numero());
		if(derniereFacture != null) {
			facture.setFact_numacte(derniereFacture.getFact_numacte() + 1);
		}

		System.out.println(facture.getFact_numacte());
//		facture.setFact_numacte(Long.parseLong((police.getPoli_numero()) + "00000003"));
		facture.setActive(1);
		facture.setFact_etatfacture("V");
		facture.setFact_numeropolice(police.getPoli_numero());
		facture.setFact_numeroacte(acteSave.getAct_numero());
		// facture.setFact_numerobeneficiaire(beneficiaire.getBenef_Num());
		facture.setFact_numeroquittance(quittance.getQuit_numero());
		// facture.setFact_marche(String.valueOf(marche.getMarch_numero()));
		facture.setFact_numerosouscripteurcontrat(police.getPoli_client());
		// facture.setFact_numerobeneficiaire(beneficiaire.getBenef_Num());
		facture.setFact_montantprimenet(quittance.getQuit_primenette());
		facture.setFact_montantaccesapporteur(quittance.getQuit_accessoireapporteur());
		facture.setFact_montantaccescompagnie(quittance.getQuit_accessoirecompagnie());
		facture.setFact_montanttaxe(quittance.getQuit_mtntaxete());
		facture.setFact_commissionapporteur(quittance.getQuit_commissionsapporteur1());
		facture.setFact_montantttc(quittance.getQuit_primettc());
		facture.setFact_numerobranche(police.getPoli_branche());
		facture.setFact_numerocategorie(police.getPoli_categorie());
		facture.setFact_dateeffetcontrat(police.getPoli_dateeffetencours());
		facture.setFact_dateecheancecontrat(police.getPoli_dateecheance());
		facture.setFact_datefacture(new Date());
		facture.setFact_capitalassure(capiAct);
		factureRepository.save(facture);
		// end saving facture
		Quittance newQuittance = quittanceRepository.findbyIdd(quittance.getQuit_numero());
		newQuittance.setQuit_Facture(facture.getFact_numacte());
		quittanceRepository.save(newQuittance);

		return "acheteurs enregistrés avec succes";
	}
	
	// proposition
	@Transactional(rollbackFor = Exception.class)
	public String ajoutProposition(PoliceFront_P policeFront) {

		Police_P police = policeFront.getPoliceForm();
		Risque_P risque = policeFront.getRisque();
		Acte_P acte = policeFront.getActe();
		Beneficiaire_P beneficiaire = policeFront.getBeneficiaire();
		Quittance_P quittance = policeFront.getQuittance();
		List<Lot_P> lots = policeFront.getLots();
		Marche_P marche = policeFront.getMarche();
		Risque_reglementes risqueR = policeFront.getRisqueR();
		Credit credit = policeFront.getCredit();
		List<Acheteur> acheteurs = policeFront.getAcheteurs();
		Risque_locatif risque_locatif = policeFront.getRisqueLocatif();

		// saving police
		Date dateModification = new Date();
		police.setPoli_datemodification(dateModification);
		police.setPoli_status(1);
		police.setPoli_primenettotal(quittance.getQuit_primenette());
		police.setPoli_primebruttotal(quittance.getQuit_primettc());
		policeRepository_P.save(police);
		police.setPoli_numero(police.getPoli_numero());
		// end saving police

		// saving avenant
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		UserPrinciple u = (UserPrinciple) auth.getPrincipal();


		Avenant_P avenant = new Avenant_P(police, 1L, u.getUtil_num());
		avenant.setAven_statut("Actif");
		avenant.setAven_numeropolice(police.getPoli_numero());
		avenant.setAven_numeroavenant(Long.parseLong((police.getPoli_numero()) + "000000001"));
		avenantRepository_P.save(avenant);
		police.setPoli_numerodernieravenant(avenant.getAven_numeroavenant());
		// end saving avenant

		// saving beneficiaire
		beneficiaireRepository_P.save(beneficiaire);
		// end saving beneficiaire

		// saving acte
		acte.setAct_status("en cours");
		acte.setAct_numeropolice(police.getPoli_numero());
		acte.setAct_numero(Long.parseLong((police.getPoli_numero()) + "0000001"));
		acte.setAct_idbeneficiaire(beneficiaire.getBenef_Num());
		// acte.setAct_status("Inactif");
		acteRepository_P.save(acte);
		// end saving acte

		// saving risque
		risque.setRisq_status("Actif");
		risque.setRisq_numeropolice(police.getPoli_numero());
		risque.setRisq_numeroacte(acte.getAct_numero());
		risque.setRisq_numero(Long.parseLong((police.getPoli_numero()) + "0001"));
		risqueRepository_P.save(risque);
		// end saving risque

		if (police.getPoli_codeproduit() >= 15001001 && police.getPoli_codeproduit() <= 15001005) {

			// saving marche
			marche.setMarch_idcontractante(beneficiaire.getBenef_Num());
			marche.setMarch_numeroacte(acte.getAct_numero());
			marcheRepository_P.save(marche);
			// end saving marche
			// saving lot
			for (Lot_P lot : lots) {

				lot.setLot_numeroacte(acte.getAct_numero());
				lot.setLot_numeromarche(String.valueOf(marche.getMarch_numero()));
				lotRepository_P.save(lot);

			}
			// end saving lot
		} else if (police.getPoli_codeproduit() >= 15001006 && police.getPoli_codeproduit() <= 15001009) {
			risqueR.setRiskr_beneficiaire(beneficiaire.getBenef_Num());
			risqueR.setRiskr_description(risque.getRisq_designation1());
			risqueR.setRiskr_numeroclient(police.getPoli_client());
			risqueR.setRiskr_numeropolice(police.getPoli_numero());
			risqueR.setRiskr_numerorisquegenerique(risque.getRisq_numero());
			risque_reglementesRepository.save(risqueR);
		} else if (police.getPoli_codeproduit() == 14001001 || police.getPoli_codeproduit() == 14003001
				|| police.getPoli_codeproduit() == 14002001) {

			for (Acheteur a : acheteurs) {
				a.setAchet_numeroaffaire(police.getPoli_numero());
				a.setAchet_numeroclient(police.getPoli_client());
				a.setActive(1);
				acheteurRepository.save(a);
				Credit credit1 = new Credit();
				credit1.setCredit_numpol(police.getPoli_numero());
				credit1.setCredit_numeroclient(police.getPoli_client());
				credit1.setCredit_mtncredit(a.getAchet_montantcredit());
				credit1.setCredit_numeroachateur(a.getAchet_numero());
				credit1.setCredit_type(credit.getCredit_type());
				credit1.setCredit_nbecheanceaccorde(a.getAchet_montantecheancecredit());
				creditRepository.save(credit1);
				// credit1 = null;
				System.out.println("credit-------------------------");
			}
			/*
			 * if(police.getPoli_codeproduit() == 16008001) {
			 * risque_locatif.setRiskl_numeroclient(police.getPoli_client());
			 * risque_locatif.setRiskl_numeropolice(police.getPoli_numero());
			 * risque_locatif.setRiskl_numerorisquegenerique(risque.getRisq_numero());
			 * risque_locatifRepository.save(risque_locatif); }
			 */
		} else if (police.getPoli_codeproduit() == 16008001) {
			for (Acheteur a : acheteurs) {
				a.setAchet_numeroaffaire(police.getPoli_numero());
				a.setAchet_numeroclient(police.getPoli_client());
				a.setActive(1);
				acheteurRepository.save(a);
				Risque_locatif risque1 = new Risque_locatif();
				risque1.setRiskl_numeroclient(police.getPoli_client());
				risque1.setRiskl_numeropolice(police.getPoli_numero());
				risque1.setRiskl_numerorisquegenerique(risque.getRisq_numero());
				risque1.setRiskl_numeroacheteur(a.getAchet_numero());
				risque1.setRiskl_description(risque_locatif.getRiskl_description());
				risque1.setRiskl_type(risque_locatif.getRiskl_type());
				risque1.setRiskl_mtnloyer(a.getAchet_montant_loyer());
				risque_locatifRepository.save(risque1);
				System.out.println("credit-------------------------");
			}

		}

		// saving engagement
		Engagement_P engag = new Engagement_P();
		engag.setActive(1);
		engag.setEngag_status("en cours");
		engag.setEngag_numeroacte(acte.getAct_numero());
		engag.setEngag_numpoli(police.getPoli_numero());
		engag.setEngag_numeroavenant(avenant.getAven_numeroavenant());
		engag.setEngag_numeroengagement(Long.parseLong((acte.getAct_numero()) + "000001"));
		if (police.getPoli_codeproduit() >= 15001001 && police.getPoli_codeproduit() <= 15001005) {
			engag.setEngag_codemarche(marche.getMarch_numero());
		}
		engag.setEngag_kapassure(acte.getAct_capitalassure());
		engag.setEngag_dateengagement(new Date());

		engagementRepository_P.save(engag);
		// end saving engagement

		// saving quittance
		quittance.setQuit_status(" ");
		quittance.setActive(1L);
		quittance.setQuit_numeropolice(police.getPoli_numero());
		quittance.setQuit_numerorisque(risque.getRisq_numero());
		// quittance.setQuit_Facture(facture.getFact_numacte());
		quittance.setQuit_numero(Long.parseLong((police.getPoli_numero()) + "00000001"));
		quittance.setQuit_typequittance("N");
		quittance.setQuit_typeecriture("emission");
		quittance.setQuit_numavenant(avenant.getAven_numeroavenant());
		quittance.setQuit_dateemission(new Date());
		quittance.setQuit_dateeffet(police.getPoli_dateeffetencours());
		quittance.setQuit_dateecheance(police.getPoli_dateecheance());
		quittance.setQuit_numerointermedaire(police.getPoli_intermediaire());
		quittanceRepository_P.save(quittance);
		// end saving quittance

		// saving facture

		Facture_P facture = new Facture_P();
		facture.setFact_numacte(Long.parseLong((police.getPoli_numero()) + "00000001"));
		facture.setActive(1);
		facture.setFact_etatfacture("V");
		facture.setFact_numeropolice(police.getPoli_numero());
		facture.setFact_numeroacte(acte.getAct_numero());
		facture.setFact_numerobeneficiaire(beneficiaire.getBenef_Num());
		facture.setFact_numeroquittance(quittance.getQuit_numero());
		facture.setFact_marche(String.valueOf(marche.getMarch_numero()));
		facture.setFact_numerosouscripteurcontrat(police.getPoli_client());
		facture.setFact_numerobeneficiaire(beneficiaire.getBenef_Num());
		facture.setFact_montantprimenet(quittance.getQuit_primenette());
		facture.setFact_montantaccesapporteur(quittance.getQuit_accessoireapporteur());
		facture.setFact_montantaccescompagnie(quittance.getQuit_accessoirecompagnie());
		facture.setFact_montanttaxe(quittance.getQuit_mtntaxete());
		facture.setFact_commissionapporteur(quittance.getQuit_commissionsapporteur1());
		facture.setFact_montantttc(quittance.getQuit_primettc());
		facture.setFact_numerobranche(police.getPoli_branche());
		facture.setFact_numerocategorie(police.getPoli_categorie());
		facture.setFact_dateeffetcontrat(police.getPoli_dateeffetencours());
		facture.setFact_dateecheancecontrat(police.getPoli_dateecheance());
		facture.setFact_datefacture(new Date());
		facture.setFact_capitalassure(acte.getAct_capitalassure());
		factureRepository_P.save(facture);
		// end saving facture
		Quittance_P newQuittance = quittanceRepository_P.findbyIdd(quittance.getQuit_numero());
		newQuittance.setQuit_Facture(facture.getFact_numacte());
		quittanceRepository_P.save(newQuittance);

		return police.getPoli_numero().toString();

	}

	/*
	 * Consultation et édition de la Police
	 * 
	 */

	public void generateReportPolice(HttpServletResponse response, String reportFormat, String title, String demandeur,
			Long numClient, Long numProduit, Long numIntermediaire) {

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
					ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_POLICE_PDF + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

//				List<Police> polices = policeRepository.findAllPolice();
//				List<PoliceConsultation> polices = policeRepository.findAllPoliceConsultation();
				List<PoliceConsultation> polices;

				if (numClient != 0 && numProduit == 0 && numIntermediaire == 0) {

					polices = policeRepository.findAllPoliceConsultationByClient(numClient);
					System.out.println(" =============== Police by client ===================");

				} else if (numClient == 0 && numProduit != 0 && numIntermediaire == 0) {
					polices = policeRepository.findAllPoliceConsultationByProduit(numProduit);
					System.out.println(" =============== Police by produit ===================");

				} else if (numClient == 0 && numProduit == 0 && numIntermediaire != 0) {
					polices = policeRepository.findAllPoliceConsultationByIntermediaire(numIntermediaire);
					System.out.println(" =============== Police by intermediaire ===================");
				} else if (numClient != 0 && numProduit != 0 && numIntermediaire == 0) {
					polices = policeRepository.findAllPoliceConsultationByClientAndProduit(numClient, numProduit);
					System.out.println(" =============== Police by client and produit ===================");
				} else if (numClient != 0 && numProduit == 0 && numIntermediaire != 0) {
					polices = policeRepository.findAllPoliceConsultationByClientAndIntermediaire(numClient,
							numIntermediaire);
					System.out.println(" =============== Police by client and intermédiaire ===================");
				} else if (numClient == 0 && numProduit != 0 && numIntermediaire != 0) {
					polices = policeRepository.findAllPoliceConsultationByProduitAndIntermediaire(numProduit,
							numIntermediaire);
					System.out.println(" =============== Police by produit and intermédiaire ===================");
				} else if (numClient != 0 && numProduit != 0 && numIntermediaire != 0) {
					polices = policeRepository.findAllPoliceConsultationByCriteres(numClient, numProduit,
							numIntermediaire);
					System.out.println(" =============== Police by all critères ===================");
				} else {
					polices = policeRepository.findAllPoliceConsultation();
					System.out.println(" =============== Toutes les Polices ===================");
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(polices);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_POLICE_PDF + ParamConst.EXTENSION_PDF);
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

			InputStream jasperStream = this.getClass().getResourceAsStream(
					ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_POLICE_EXCEL + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<PoliceConsultation> polices;

				if (numClient != 0 && numProduit == 0 && numIntermediaire == 0) {

					polices = policeRepository.findAllPoliceConsultationByClient(numClient);
					System.out.println(" =============== Police by client ===================");

				} else if (numClient == 0 && numProduit != 0 && numIntermediaire == 0) {
					polices = policeRepository.findAllPoliceConsultationByProduit(numProduit);
					System.out.println(" =============== Police by produit ===================");

				} else if (numClient == 0 && numProduit == 0 && numIntermediaire != 0) {
					polices = policeRepository.findAllPoliceConsultationByIntermediaire(numIntermediaire);
					System.out.println(" =============== Police by intermediaire ===================");
				} else if (numClient != 0 && numProduit != 0 && numIntermediaire == 0) {
					polices = policeRepository.findAllPoliceConsultationByClientAndProduit(numClient, numProduit);
					System.out.println(" =============== Police by client and produit ===================");
				} else if (numClient != 0 && numProduit == 0 && numIntermediaire != 0) {
					polices = policeRepository.findAllPoliceConsultationByClientAndIntermediaire(numClient,
							numIntermediaire);
					System.out.println(" =============== Police by client and intermédiaire ===================");
				} else if (numClient == 0 && numProduit != 0 && numIntermediaire != 0) {
					polices = policeRepository.findAllPoliceConsultationByProduitAndIntermediaire(numProduit,
							numIntermediaire);
					System.out.println(" =============== Police by produit and intermédiaire ===================");
				} else if (numClient != 0 && numProduit != 0 && numIntermediaire != 0) {
					polices = policeRepository.findAllPoliceConsultationByCriteres(numClient, numProduit,
							numIntermediaire);
					System.out.println(" =============== Police by all critères ===================");
				} else {
					polices = policeRepository.findAllPoliceConsultation();
					System.out.println(" =============== Toutes les Polices ===================");
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(polices);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				jasperPrint.setProperty("net.sf.jasperreports.export.xls.detect.cell.type", "true");
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-xlsx");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_POLICE_EXCEL + ParamConst.EXTENSION_EXCEL);

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

	/*
	 * Generate reporte all porte feuille police
	 * 
	 */

	public void generateReportAllPorteFeuillePolice(HttpServletResponse response, String reportFormat, String title,
			String demandeur) {

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
					ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_POLICE_PDF + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<PoliceConsultation> polices = policeRepository.findAllPorteFeuillePoliceConsultation();

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(polices);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_POLICE_PDF + ParamConst.EXTENSION_PDF);
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

			InputStream jasperStream = this.getClass().getResourceAsStream(
					ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_POLICE_EXCEL + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<PoliceConsultation> polices = policeRepository.findAllPorteFeuillePoliceConsultation();

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(polices);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				jasperPrint.setProperty("net.sf.jasperreports.export.xls.detect.cell.type", "true");
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-xlsx");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_POLICE_EXCEL + ParamConst.EXTENSION_EXCEL);

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
	}/*
		 * public ResponseEntity<?> editAvenant( @RequestBody Avenant avenant){ Avenant
		 * avenantUpdate = avenantRepository.findByIdd(avenant.getAven_numeroavenant());
		 * avenant.setAven_statut("Actif");
		 * avenant.setAven_id(avenantUpdate.getAven_id()); Avenant gr =
		 * avenantRepository.save(avenant); if(gr == null) return new
		 * ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
		 * HttpStatus.INTERNAL_SERVER_ERROR);
		 * 
		 * 
		 * return new ResponseEntity<>(new ResponseMessage("avenant modifié"),
		 * HttpStatus.OK);
		 * 
		 * }
		 */

	@Transactional(rollbackFor = Exception.class)
	public String resilierPolice(PoliceFront policeFront) {

		Police policeUpdate = policeRepository.findByPolice(policeFront.getPoliceForm().getPoli_numero());

		// Police police = policeFront.getPoliceForm();
		Risque risqueUpdate = risqueRepository.getRisquePolice(policeFront.getRisque().getRisq_numeropolice());
		// Risque = policeFront.getRisque();
		Acte acteUpdate = acteRepository.getActePolice(policeFront.getActe().getAct_numeropolice());
		// Acte acte = policeFront.getActe();
		// Beneficiaire beneficiaire = policeFront.getBeneficiaire();
		Quittance quittance = quittanceRepository.findbyPolice(policeFront.getQuittance().getQuit_numeropolice());
		// Quittance quittanceUpdate = policeFront.getQuittance();
		// List<Lot> lots = policeFront.getLots();
		// Marche marche = policeFront.getMarche();
		// Risque_reglementes risqueR = policeFront.getRisqueR();
		/// Credit credit = policeFront.getCredit();
		// List<Acheteur> acheteurs = policeFront.getAcheteurs();
		Risque_locatif risque_locatif = policeFront.getRisqueLocatif();
		// Risque_locatif risque_locatifUpdate =
		// risque_locatifRepository.findByPolice(policeFront.getRisqueLocatif().getRiskl_numeropolice());
		// saving police
		Date dateModification = new Date();
		policeUpdate.setPoli_datemodification(dateModification);
		policeUpdate.setPoli_status(0);
		policeRepository.save(policeUpdate);
		policeUpdate.setPoli_numero(policeUpdate.getPoli_numero());
		// end saving police

		// saving avenant

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		UserPrinciple u = (UserPrinciple) auth.getPrincipal();

		Avenant avenant = new Avenant(policeUpdate, 1L, u.getUtil_num());
		// Avenant avenant = new Avenant(police, 1L, "AG11111");
		avenant.setAven_statut("Actif");
		avenant.setAven_numeropolice(policeUpdate.getPoli_numero());
		avenant.setAven_numeroavenant(Long.parseLong((policeUpdate.getPoli_numero()) + "000000001"));
		avenantRepository.save(avenant);
		policeUpdate.setPoli_numerodernieravenant(avenant.getAven_numeroavenant());
		// end saving avenant

		// saving beneficiaire
		// beneficiaireRepository.save(beneficiaire);
		// end saving beneficiaire

		// saving acte
		acteUpdate.setAct_status("Inactif");
		// acteUpdate.setAct_numeropolice(policeUpdate.getPoli_numero());
		// acteUpdate.setAct_numero(Long.parseLong((policeUpdate.getPoli_numero()) +
		// "0000001"));
		// acteUpdate.setAct_idbeneficiaire(beneficiaire.getBenef_Num());
		// acte.setAct_status("Inactif");
		acteRepository.save(acteUpdate);
		// end saving acte

		// saving risque
		// risque.setRisq_status(" non actif");
		// risque.setRisq_numeropolice(policeUpdate.getPoli_numero());
		// risque.setRisq_numeroacte(acteUpdate.getAct_numero());
		// risque.setRisq_numero(Long.parseLong((policeUpdate.getPoli_numero()) +
		// "0001"));
		// risqueRepository.save(risque);
		// end saving risque

		// if (policeUpdate.getPoli_codeproduit() >= 15001006 &&
		// policeUpdate.getPoli_codeproduit() <= 15001009) {
		// risqueR.setRiskr_beneficiaire(beneficiaire.getBenef_Num());
		// risqueR.setRiskr_description(risque.getRisq_designation1());
		/*
		 * risqueR.setRiskr_numeroclient(police.getPoli_client());
		 * risqueR.setRiskr_numeropolice(police.getPoli_numero());
		 * risqueR.setRiskr_numerorisquegenerique(risque.getRisq_numero());
		 * risque_reglementesRepository.save(risqueR);
		 */
		/*
		 * } else if (police.getPoli_codeproduit() == 14001001 ||
		 * police.getPoli_codeproduit() == 14003001 || police.getPoli_codeproduit() ==
		 * 14002001) {
		 * 
		 * for (Acheteur a : acheteurs) {
		 * a.setAchet_numeroaffaire(police.getPoli_numero());
		 * a.setAchet_numeroclient(police.getPoli_client()); acheteurRepository.save(a);
		 * Credit credit1 = new Credit();
		 * credit1.setCredit_numpol(police.getPoli_numero());
		 * credit1.setCredit_numeroclient(police.getPoli_client());
		 * credit1.setCredit_mtncredit(a.getAchet_montantcredit());
		 * credit1.setCredit_numeroachateur(a.getAchet_numero());
		 * credit1.setCredit_type(credit.getCredit_type());
		 * creditRepository.save(credit1); // credit1 = null;
		 * System.out.println("credit-------------------------"); }
		 */
		/*
		 * if(police.getPoli_codeproduit() == 16008001) {
		 * risque_locatif.setRiskl_numeroclient(police.getPoli_client());
		 * risque_locatif.setRiskl_numeropolice(police.getPoli_numero());
		 * risque_locatif.setRiskl_numerorisquegenerique(risque.getRisq_numero());
		 * risque_locatifRepository.save(risque_locatif); }
		 */
		/*
		 * } else if (police.getPoli_codeproduit() == 16008001) { for (Acheteur a :
		 * acheteurs) { a.setAchet_numeroaffaire(police.getPoli_numero());
		 * a.setAchet_numeroclient(police.getPoli_client()); acheteurRepository.save(a);
		 * Risque_locatif risque1 = new Risque_locatif();
		 * risque1.setRiskl_numeroclient(police.getPoli_client());
		 * risque1.setRiskl_numeropolice(police.getPoli_numero());
		 * risque1.setRiskl_numerorisquegenerique(risque.getRisq_numero());
		 * risque1.setRiskl_numeroacheteur(a.getAchet_numero());
		 * risque1.setRiskl_description(risque_locatif.getRiskl_description());
		 * risque1.setRiskl_type(risque_locatif.getRiskl_type());
		 * risque1.setRiskl_mtnloyer(a.getAchet_montant_loyer());
		 * risque_locatifRepository.save(risque1);
		 * System.out.println("credit-------------------------"); }
		 * 
		 * }
		 */

		// saving engagement
		/*
		 * Engagement engag = new Engagement(); engag.setActive(1);
		 * engag.setEngag_status("en cours");
		 * engag.setEngag_numeroacte(acte.getAct_numero());
		 * engag.setEngag_numpoli(police.getPoli_numero());
		 * engag.setEngag_numeroavenant(avenant.getAven_numeroavenant());
		 * engag.setEngag_numeroengagement(Long.parseLong((acte.getAct_numero()) +
		 * "000001")); if (police.getPoli_codeproduit() >= 15001001 &&
		 * police.getPoli_codeproduit() <= 15001005) {
		 * engag.setEngag_codemarche(marche.getMarch_numero()); }
		 * engag.setEngag_kapassure(acte.getAct_capitalassure());
		 * engag.setEngag_dateengagement(new Date());
		 * 
		 * engagRepository.save(engag); // end saving engagement
		 * 
		 * // saving quittance quittance.setQuit_status(" "); quittance.setActive(1L);
		 * quittance.setQuit_numeropolice(police.getPoli_numero());
		 * quittance.setQuit_numerorisque(risque.getRisq_numero()); //
		 * quittance.setQuit_Facture(facture.getFact_numacte());
		 * quittance.setQuit_numero(Long.parseLong((police.getPoli_numero()) +
		 * "00000001")); quittance.setQuit_typequittance("N");
		 * quittance.setQuit_typeecriture("emission");
		 * quittance.setQuit_numavenant(avenant.getAven_numeroavenant());
		 * quittance.setQuit_dateemission(new Date());
		 * quittance.setQuit_dateeffet(police.getPoli_dateeffetencours());
		 * quittance.setQuit_dateecheance(police.getPoli_dateecheance());
		 * quittance.setQuit_numerointermedaire(police.getPoli_intermediaire());
		 * quittanceRepository.save(quittance); // end saving quittance
		 * 
		 * // saving facture
		 * 
		 * Facture facture = new Facture();
		 * facture.setFact_numacte(Long.parseLong((police.getPoli_numero()) +
		 * "00000001")); facture.setActive(1); facture.setFact_etatfacture("V");
		 * facture.setFact_numeropolice(police.getPoli_numero());
		 * facture.setFact_numeroacte(acte.getAct_numero());
		 * facture.setFact_numerobeneficiaire(beneficiaire.getBenef_Num());
		 * facture.setFact_numeroquittance(quittance.getQuit_numero());
		 * facture.setFact_marche(String.valueOf(marche.getMarch_numero()));
		 * facture.setFact_numerosouscripteurcontrat(police.getPoli_client());
		 * facture.setFact_numerobeneficiaire(beneficiaire.getBenef_Num());
		 * facture.setFact_montantprimenet(quittance.getQuit_primenette());
		 * facture.setFact_montantaccesapporteur(quittance.getQuit_accessoireapporteur()
		 * );
		 * facture.setFact_montantaccescompagnie(quittance.getQuit_accessoirecompagnie()
		 * ); facture.setFact_montanttaxe(quittance.getQuit_mtntaxete());
		 * facture.setFact_commissionapporteur(quittance.getQuit_commissionsapporteur1()
		 * ); facture.setFact_montantttc(quittance.getQuit_primettc());
		 * facture.setFact_numerobranche(police.getPoli_branche());
		 * facture.setFact_numerocategorie(police.getPoli_categorie());
		 * facture.setFact_dateeffetcontrat(police.getPoli_dateeffetencours());
		 * facture.setFact_dateecheancecontrat(police.getPoli_dateecheance());
		 * facture.setFact_datefacture(new Date());
		 * facture.setFact_capitalassure(acte.getAct_capitalassure());
		 * factureRepository.save(facture); // end saving facture Quittance newQuittance
		 * = quittanceRepository.findbyIdd(quittance.getQuit_numero());
		 * newQuittance.setQuit_Facture(facture.getFact_numacte());
		 * quittanceRepository.save(newQuittance);
		 */
		return policeUpdate.getPoli_numero().toString();

	}

}
