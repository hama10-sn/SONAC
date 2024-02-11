package sn.jmad.sonac.controller;

import java.io.FileNotFoundException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import net.sf.jasperreports.engine.JRException;
import sn.jmad.sonac.message.response.EncaissementClient;
import sn.jmad.sonac.message.response.PoliceConsultation;
import sn.jmad.sonac.message.response.PoliceForm;
import sn.jmad.sonac.message.response.PoliceFront;
import sn.jmad.sonac.message.response.PoliceFront_P;
import sn.jmad.sonac.message.response.PoliceTarif;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.message.response.TarifTrimestrielle;
import sn.jmad.sonac.message.response.TarificationDisplay;
import sn.jmad.sonac.message.response.ajoutAcheteurFront;
import sn.jmad.sonac.model.Acheteur;
import sn.jmad.sonac.model.Acte;
import sn.jmad.sonac.model.Avenant;
import sn.jmad.sonac.model.Beneficiaire;
import sn.jmad.sonac.model.Credit;
import sn.jmad.sonac.model.Engagement;
import sn.jmad.sonac.model.Facture;
import sn.jmad.sonac.model.Lot;
import sn.jmad.sonac.model.Marche;
import sn.jmad.sonac.model.Police;
import sn.jmad.sonac.model.Police_P;
import sn.jmad.sonac.model.Quittance;
import sn.jmad.sonac.model.Reassureur;
import sn.jmad.sonac.model.Risque;
import sn.jmad.sonac.model.Risque_locatif;
import sn.jmad.sonac.model.Risque_reglementes;
import sn.jmad.sonac.model.Utilisateur;
import sn.jmad.sonac.repository.AcheteurRepository;
import sn.jmad.sonac.repository.ActeRepository;
import sn.jmad.sonac.repository.AvenantRepository;
import sn.jmad.sonac.repository.BeneficiaireRepository;
import sn.jmad.sonac.repository.CreditRepository;
import sn.jmad.sonac.repository.EngagementRepository;
import sn.jmad.sonac.repository.FactureRepository;
import sn.jmad.sonac.repository.LotRepository;
import sn.jmad.sonac.repository.MarcheRepository;
import sn.jmad.sonac.repository.PoliceRepository;
import sn.jmad.sonac.repository.PoliceRepository_P;
import sn.jmad.sonac.repository.QuittanceRepository;
import sn.jmad.sonac.repository.RisqueRepository;
import sn.jmad.sonac.repository.Risque_locatifRepository;
import sn.jmad.sonac.repository.Risque_reglementesRepository;

import sn.jmad.sonac.security.service.UserPrinciple;

import sn.jmad.sonac.service.PoliceService;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/police/*")

public class PoliceController {

	@Autowired
	private PoliceRepository policeRepository;
	@Autowired
	private PoliceService policeService;
	@Autowired
	private ActeRepository acteRepository;
	@Autowired
	FactureRepository factureRepository;
	@Autowired
	QuittanceRepository quittanceRepository;
	@Autowired
	private CreditRepository creditRepository;
	@Autowired
	EngagementRepository engagRepository;
	@Autowired
	private LotRepository lotRepository;
	@Autowired
	private MarcheRepository marcheRepository;
	@Autowired
	private Risque_locatifRepository risque_locatifRepository;
	@Autowired
	private Risque_reglementesRepository risque_reglementeRepository;
	@Autowired
	private RisqueRepository risqueRepository;
	@Autowired
	private AcheteurRepository acheteurRepository;
	@Autowired
	private BeneficiaireRepository beneficiaireRepository;
	@Autowired
	private AvenantRepository avenantRepository;
	@Autowired
	private PoliceRepository_P policeRepository_P;

	@GetMapping(value = "/allpolice")
	public ResponseEntity<?> getAllPolices() {
		List<Police> polices = policeRepository.findAllPolice();

		if (polices.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste des polices vide"), HttpStatus.OK);
		}

		return new ResponseEntity<List<Police>>(polices, HttpStatus.OK);
	}

	@GetMapping(value = "/allpoliceCred")
	public ResponseEntity<?> getAllPolicesCred() {
		List<Police> polices = policeRepository.findAllPoliceCred();

		if (polices.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste des polices vide"), HttpStatus.OK);
		}

		return new ResponseEntity<List<Police>>(polices, HttpStatus.OK);
	}

	@GetMapping(value = "/allpoliceByClient/{id}")
	public ResponseEntity<?> getAllPolicesByClient(@PathVariable(value = "id") Long id) {
		List<Police> polices = policeRepository.findPoliceByClient(id);

		if (polices.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste des polices vide"), HttpStatus.OK);
		}

		return new ResponseEntity<List<Police>>(polices, HttpStatus.OK);
	}

	@GetMapping(value = "/allpoliceByClientAndBranche/{id}")
	public ResponseEntity<?> getAllPolicesByClientAndBranche(@PathVariable(value = "id") Long id) {
		List<Police> polices = policeRepository.findPoliceByClientAndBranche(id);

		if (polices.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "liste des polices vide", polices),
					HttpStatus.OK);
		}

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "liste des polices", polices),
				HttpStatus.OK);
	}

	@GetMapping(value = "/allpoliceByClientAndBrancheCaution/{id}")
	public ResponseEntity<?> getAllPolicesByClientAndBrancheCaution(@PathVariable(value = "id") Long id) {
		List<Police> polices = policeRepository.findPoliceByClientAndBrancheCaution(id);

		if (polices.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("chao", "liste des polices caution pour ce client est vide", polices),
					HttpStatus.OK);
		}

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("chao", "liste des polices caution de ce client", polices), HttpStatus.OK);
	}

	@PostMapping(value = "/addpolice")
	public ResponseEntity<?> savePolice(@Valid @RequestBody Police police) {

//		Long branche_numero = branche.getBranche_numero();
//		Branche brancheExistant = brancheRepository.findbyCode(branche_numero) ;
//		if(brancheExistant != null) {
//			return new ResponseEntity<>(new ResponseMessage("Le numéro de cette branche existe déjà !"),
//					HttpStatus.BAD_REQUEST);
//		}
//		
		Date dateModification = new Date();
		police.setPoli_datemodification(dateModification);
		police.setPoli_status(1);
		policeRepository.save(police);
		return new ResponseEntity<>(police, HttpStatus.OK);
	}

	@PutMapping("/updatepolice")
	public ResponseEntity<?> updatePolice(@RequestBody Police police) {
		Police policeUpdate = policeRepository.findByPolice(police.getPoli_numero());
		police.setPoli_status(1);
		police.setPoli_num(policeUpdate.getPoli_num());
		police.setPoli_datemodification(new Date());
		police.setPoli_codecutilisateur(policeUpdate.getPoli_codecutilisateur());
		Police poli = policeRepository.save(police);
		if (poli == null) {
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue: vérifier le numéro de la police"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<>(new ResponseMessage("police modifiée avec succée"), HttpStatus.OK);
	}

	@GetMapping(value = "/allpoliceClient/{numcli}")
	public ResponseEntity<?> getAllPolicesCLient(@PathVariable(value = "numcli") Long id) {
		List<Police> polices = policeRepository.findPoliceByClient(id);

		return new ResponseEntity<List<Police>>(polices, HttpStatus.OK);
	}

	@GetMapping(value = "/getPolice/{numpol}")
	public ResponseEntity<?> getPolices(@PathVariable(value = "numpol") Long id) {
		Police police = policeRepository.findByPolice(id);

		return new ResponseEntity<Police>(police, HttpStatus.OK);
	}

	@DeleteMapping(value = "/delete/{id}")
	public ResponseEntity<?> deleteRole(@PathVariable(value = "id") Long id) {
		policeRepository.deleteById(id);
		return new ResponseEntity<ResponseMessage>(new ResponseMessage("police deleted "), HttpStatus.OK);
	}

	@GetMapping(value = "/getAvenantByPolice/{numpol}")
	public ResponseEntity<?> getAvenantByPolices(@PathVariable("numpol") Long numpol) {
		Long avena = policeRepository.findNumAvenantByPolice(numpol);
		if (avena == null) {
			return new ResponseEntity<Integer>(0, HttpStatus.OK);
		}
		return new ResponseEntity<Long>(avena, HttpStatus.OK);

	}

	@PostMapping(value = "/tarifer/{typeca}/{typeSoum}/{typeRisque}/{typeAvenant}")
	public ResponseEntity<?> tarifer(@RequestBody PoliceTarif pt, @PathVariable(value = "typeca") String typeca,
			@PathVariable(value = "typeSoum") Long typeSoum, @PathVariable(value = "typeRisque") String typeRisque,
			@PathVariable(value = "typeAvenant") Long typeAvenant) {

		Acte acte = pt.getActe();
		Long capital = acte.getAct_capitalassure() + acte.getAct_capitallci() + acte.getAct_capitalsmp();

		Long duree = 0L;
		if (pt.getPolice().getPoli_codeproduit().toString().equals("14003001")) {
			Date dateEffet = pt.getPolice().getPoli_dateeffetencours();
			Date dateEcheance = pt.getPolice().getPoli_dateecheance();
			Long diff = dateEcheance.getTime() - dateEffet.getTime();
			Float res = (float) (diff / (1000 * 60 * 60 * 24));
			System.out.println("------------------" + res);
			duree = res.longValue();

		}
		System.out.println("---------fiiiii---------" + duree);
		TarificationDisplay td = policeService.tariferNewFact(capital, pt.getPolice().getPoli_codeproduit().toString(),
				pt.getPolice().getPoli_intermediaire(), typeca, typeSoum, typeRisque, typeAvenant, duree);
//			
		return new ResponseEntity<>(td, HttpStatus.OK);
	}

	@PostMapping(value = "/tariferPeriodeique/{typeSoum}/{typeRisque}/{typeAvenant}/{periode}/{tauxPreferentiel}")
	public ResponseEntity<?> tariferPeriode(@RequestBody PoliceTarif pt,
			@PathVariable(value = "typeSoum") Long typeSoum, @PathVariable(value = "typeRisque") String typeRisque,
			@PathVariable(value = "typeAvenant") Long typeAvenant, @PathVariable(value = "periode") Double periode,
			@PathVariable(value = "tauxPreferentiel") Double tauxPreferentiel) {

		Acte acte = pt.getActe();
		Long capital = acte.getAct_capitalassure() + acte.getAct_capitallci() + acte.getAct_capitalsmp();

		Long duree = 0L;
		if (pt.getPolice().getPoli_codeproduit().toString().equals("14003001")) {
			Date dateEffet = pt.getPolice().getPoli_dateeffetencours();
			Date dateEcheance = pt.getPolice().getPoli_dateecheance();
			Long diff = dateEcheance.getTime() - dateEffet.getTime();
			Float res = (float) (diff / (1000 * 60 * 60 * 24));
			System.out.println("------------------" + res);
			duree = res.longValue();

		}
		System.out.println("---------fiiiii---------" + duree);
		TarificationDisplay td = policeService.tariferModifCMT(capital, pt.getPolice().getPoli_codeproduit().toString(),
				pt.getPolice().getPoli_intermediaire(), typeSoum, typeRisque, typeAvenant, duree, periode, tauxPreferentiel);
//			
		return new ResponseEntity<>(td, HttpStatus.OK);
	}
	
	@GetMapping(value = "/tariferPolice/{capital}/{codeProduit}/{inter}/{typeca}/{typeSoum}/{typeRisque}/{typeAvenant}/{duree}")
	public ResponseEntity<?> tariferPolice(@PathVariable(value = "capital") Long capital,
			@PathVariable(value = "codeProduit") Long CodeProduit, @PathVariable(value = "inter") Long inter,
			@PathVariable(value = "typeca") String typeca, @PathVariable(value = "typeSoum") Long typeSoum,
			@PathVariable(value = "typeRisque") String typeRisque,
			@PathVariable(value = "typeAvenant") Long typeAvenant, @PathVariable(value = "duree") Long duree) {

		TarificationDisplay td = policeService.tariferNewFact(capital, CodeProduit.toString(), inter, typeca, typeSoum,
				typeRisque, typeAvenant, duree);

		return new ResponseEntity<>(td, HttpStatus.OK);
	}

	@GetMapping(value = "/tariferPoliceTauxPref/{capital}/{codeProduit}/{inter}/{typeca}/{typeSoum}/{typeRisque}/{typeAvenant}/{duree}/{tauxPreferentiel}")
	public ResponseEntity<?> tariferPoliceTauxPref(@PathVariable(value = "capital") Long capital,
			@PathVariable(value = "codeProduit") Long CodeProduit, @PathVariable(value = "inter") Long inter,
			@PathVariable(value = "typeca") String typeca, @PathVariable(value = "typeSoum") Long typeSoum,
			@PathVariable(value = "typeRisque") String typeRisque,
			@PathVariable(value = "typeAvenant") Long typeAvenant, @PathVariable(value = "duree") Long duree,
			@PathVariable(value = "tauxPreferentiel") Double tauxPreferentiel) {

		TarificationDisplay td = policeService.tariferNewFactTauxPref(capital, CodeProduit.toString(), inter, typeca,
				typeSoum, typeRisque, typeAvenant, duree, tauxPreferentiel);

		return new ResponseEntity<>(td, HttpStatus.OK);
	}

	@PostMapping(value = "/tariferTarifTrimestrielTauxPref/{typeca}/{typeSoum}/{typeRisque}/{typeAvenant}/{tauxPreferentiel}")
	public ResponseEntity<?> tarifer(@RequestBody PoliceTarif pt, @PathVariable(value = "typeca") String typeca,
			@PathVariable(value = "typeSoum") Long typeSoum, @PathVariable(value = "typeRisque") String typeRisque,
			@PathVariable(value = "typeAvenant") Long typeAvenant,
			@PathVariable(value = "tauxPreferentiel") Double tauxPreferentiel) {

		Acte acte = pt.getActe();
		Long capital = acte.getAct_capitalassure() + acte.getAct_capitallci() + acte.getAct_capitalsmp();

		Long duree = 0L;
		if (pt.getPolice().getPoli_codeproduit().toString().equals("14003001")) {
			Date dateEffet = pt.getPolice().getPoli_dateeffetencours();
			Date dateEcheance = pt.getPolice().getPoli_dateecheance();
			Long diff = dateEcheance.getTime() - dateEffet.getTime();
			Float res = (float) (diff / (1000 * 60 * 60 * 24));
			System.out.println("------------------" + res);
			duree = res.longValue();

		}

		TarificationDisplay td = policeService.tariferNewFactTauxPref(capital,
				pt.getPolice().getPoli_codeproduit().toString(), pt.getPolice().getPoli_intermediaire(), typeca,
				typeSoum, typeRisque, typeAvenant, duree, tauxPreferentiel);

		return new ResponseEntity<>(td, HttpStatus.OK);
	}

	@PostMapping(value = "/modifPoliceEcheance2/{type}/{numFact}")
	public ResponseEntity<?> modifPoliceEcheance2(@RequestBody PoliceTarif td,
			@PathVariable(value = "numFact") Long numFact, @PathVariable(value = "type") Long type) {

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		UserPrinciple u = (UserPrinciple) auth.getPrincipal();
		// System.out.println("user connecté : " + u.getUtil_num());
		Facture f = policeService.modifPoliceEcheanceSeule2(td.getPolice(), 1L, u.getUtil_num(), numFact,
				td.getTarif());
		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("Emission d'une nouvelle facture N° " + f.getFact_numacte()), HttpStatus.OK);
	}

	@PostMapping(value = "/modifPoliceEcheance2Trimestrielle/{type}/{numFact}")
	public ResponseEntity<?> modifPoliceEcheance2Trimestrielle(@RequestBody TarifTrimestrielle td,
			@PathVariable(value = "numFact") Long numFact, @PathVariable(value = "type") Long type) {
		System.out.println("----------yooooo" + numFact + "oooooooooo--------------" + td + "-------------yaaaaaa-" + td
				+ "-aaaaaaaaaa---------------");

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		UserPrinciple u = (UserPrinciple) auth.getPrincipal();
		Date dateeffet = td.getAddForm().getDateeffetcontrat();
		// System.out.println("user connecté : " + u.getUtil_num());
		Facture f = policeService.modifPoliceEcheanceSeuleTrimestrielle(td.getPolice(), 1L, u.getUtil_num(), numFact,
				td.getTarif(), dateeffet);
		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("Emission d'une nouvelle facture N° " + f.getFact_numacte()), HttpStatus.OK);
	}

	@PostMapping(value = "/modifPoliceCorrectionEngag/{type}/{numFact}")
	public ResponseEntity<?> modifPoliceCorrectionEngag(@RequestBody PoliceTarif td,
			@PathVariable(value = "numFact") Long numFact, @PathVariable(value = "type") Long type) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		UserPrinciple u = (UserPrinciple) auth.getPrincipal();
		System.out.println(" filaaa nééééééééééééééééék");

		Facture f = policeService.modifPoliceCorrectionEngag(td, type, u.getUtil_num(), numFact);
		System.out.println(" filaaa nééééééééééééééééék" + f);
		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("Emission d'une nouvelle facture N° " + f.getFact_numacte()), HttpStatus.OK);
	}

	// birane

	@PostMapping(value = "/ajoutPolice")
	public ResponseEntity<?> ajoutPolice(@RequestBody PoliceFront police) {

		String result = policeService.ajoutPolice(police);
		return new ResponseEntity<ResponseMessage>(new ResponseMessage(result), HttpStatus.OK);

	}

	@PostMapping(value = "/ajoutProposition")
	public ResponseEntity<?> ajoutProposition(@RequestBody PoliceFront_P police) {

		String result = policeService.ajoutProposition(police);
		return new ResponseEntity<ResponseMessage>(new ResponseMessage(result), HttpStatus.OK);

	}

	@PostMapping(value = "/ajoutAcheteurPolice/{numpol}/{capiAssur}/{numFact}")
	public ResponseEntity<?> ajoutProposition(@RequestBody ajoutAcheteurFront acheteurFront,
			@PathVariable(value = "numpol") Long numpol,@PathVariable(value = "capiAssur") Long capiAssur,@PathVariable(value = "numFact") Long numFact) {

		String result = policeService.ajoutAcheteurPolice(acheteurFront, numpol, capiAssur, numFact);
		return new ResponseEntity<ResponseMessage>(new ResponseMessage(result), HttpStatus.OK);

	}

	@GetMapping(value = "/getPoliceAll/{numpol}")
	public ResponseEntity<?> getPolice(@PathVariable(value = "numpol") Long numpol) {

		PoliceFront police = policeService.getPolice(numpol);
		return new ResponseEntity<>(police, HttpStatus.OK);

	}

	@GetMapping(value = "/allProposition")
	public ResponseEntity<?> getAllProposition() {
		List<Police_P> propos = policeRepository_P.findAllPolice();
		System.out.println("liste des Proposition : " + propos);
		if (propos.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);

		return new ResponseEntity<List<Police_P>>(propos, HttpStatus.OK);
	}
	/*
	 * @DeleteMapping(value = "/delete/{id}") public ResponseEntity<?>
	 * deleteProposition(@PathVariable(value = "id") Long id) {
	 * 
	 * Police_P c = policeRepository_P.findByPolice(id);
	 * 
	 * Police_P currentPropo = c.get(); currentPropo.setPoli_status(0);
	 * policeRepository_P.save(currentPropo); return new
	 * ResponseEntity<ResponseMessage>(new ResponseMessage("Reassureur Supprier"),
	 * HttpStatus.OK); }
	 */

	@DeleteMapping(value = "/deleteProposition/{id}")
	public ResponseEntity<?> deleteProposition(@PathVariable(value = "id") Long id) {
		Police_P propo = policeRepository_P.findByPolice(id);
		propo.setPoli_status(0);
		policeRepository_P.save(propo);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("proposition deleted "), HttpStatus.OK);
	}

	@GetMapping(value = "/transformePropos/{numpropos}")
	public ResponseEntity<?> transformePropos(@PathVariable(value = "numpropos") Long numpropos) {

		PoliceFront police = policeService.getProposition(numpropos);

		String result = policeService.ajoutPolice(police);
		return new ResponseEntity<ResponseMessage>(new ResponseMessage(result), HttpStatus.OK);

	}

	/*
	 * Consultation et édition de la police
	 * 
	 */

//		@GetMapping("report/production/{format}/{title}/{demandeur}")
//		public @ResponseBody void generateReportPolice(HttpServletResponse response, @PathVariable String format,
//				@PathVariable String title, @PathVariable String demandeur)
//				throws JRException, FileNotFoundException {
//
//			policeService.generateReportPolice(response, format, title, demandeur);
//		}

	@GetMapping(value = "/allPoliceConsultation")
	public ResponseEntity<?> getAllPoliceConsultation() {
		List<PoliceConsultation> policeConsultations = policeRepository.findAllPoliceConsultation();

		return new ResponseEntity<List<PoliceConsultation>>(policeConsultations, HttpStatus.OK);
	}

	@GetMapping(value = "/allPoliceConsultationByClient/{numClient}")
	public ResponseEntity<?> getAllPoliceConsultationByClient(@PathVariable Long numClient) {

		List<PoliceConsultation> policeConsultations = policeRepository.findAllPoliceConsultationByClient(numClient);

		return new ResponseEntity<List<PoliceConsultation>>(policeConsultations, HttpStatus.OK);
	}

	@GetMapping(value = "/allPoliceConsultationByProduit/{numProduit}")
	public ResponseEntity<?> getAllPoliceConsultationByProduit(@PathVariable Long numProduit) {

		List<PoliceConsultation> policeConsultations = policeRepository.findAllPoliceConsultationByProduit(numProduit);

		return new ResponseEntity<List<PoliceConsultation>>(policeConsultations, HttpStatus.OK);
	}

	@GetMapping(value = "/allPoliceConsultationByIntermediaire/{numIntermediaire}")
	public ResponseEntity<?> getAllPoliceConsultationByIntermediaire(@PathVariable Long numIntermediaire) {

		List<PoliceConsultation> policeConsultations = policeRepository
				.findAllPoliceConsultationByIntermediaire(numIntermediaire);

		return new ResponseEntity<List<PoliceConsultation>>(policeConsultations, HttpStatus.OK);
	}

	@GetMapping(value = "/allPoliceConsultationByClientAndProduit/{numClient}/{numProd}")
	public ResponseEntity<?> getAllPoliceConsultationByClientAndProduit(@PathVariable Long numClient,
			@PathVariable Long numProd) {

		List<PoliceConsultation> policeConsultations = policeRepository
				.findAllPoliceConsultationByClientAndProduit(numClient, numProd);

		return new ResponseEntity<List<PoliceConsultation>>(policeConsultations, HttpStatus.OK);
	}

	@GetMapping(value = "/allPoliceConsultationByClientAndIntermediaire/{numClient}/{numInterm}")
	public ResponseEntity<?> getAllPoliceConsultationByClientAndIntermediaire(@PathVariable Long numClient,
			@PathVariable Long numInterm) {

		List<PoliceConsultation> policeConsultations = policeRepository
				.findAllPoliceConsultationByClientAndIntermediaire(numClient, numInterm);

		return new ResponseEntity<List<PoliceConsultation>>(policeConsultations, HttpStatus.OK);
	}

	@GetMapping(value = "/allPoliceConsultationByProduitAndIntermediaire/{numProd}/{numInterm}")
	public ResponseEntity<?> getAllPoliceConsultationByProduitAndIntermediaire(@PathVariable Long numProd,
			@PathVariable Long numInterm) {

		List<PoliceConsultation> policeConsultations = policeRepository
				.findAllPoliceConsultationByProduitAndIntermediaire(numProd, numInterm);

		return new ResponseEntity<List<PoliceConsultation>>(policeConsultations, HttpStatus.OK);
	}

	@GetMapping(value = "/allPoliceConsultationByAllCriteres/{numClient}/{numProd}/{numInterm}")
	public ResponseEntity<?> getAllPoliceConsultationByAllCriteres(@PathVariable Long numClient,
			@PathVariable Long numProd, @PathVariable Long numInterm) {

		List<PoliceConsultation> policeConsultations = policeRepository.findAllPoliceConsultationByCriteres(numClient,
				numProd, numInterm);

		return new ResponseEntity<List<PoliceConsultation>>(policeConsultations, HttpStatus.OK);
	}

	@PostMapping("report/{format}")
	public @ResponseBody void generateReportPolice(HttpServletResponse response, @PathVariable String format,
			@RequestParam("title") String title, @RequestParam("demandeur") String demandeur,
			@RequestParam("numClient") Long numClient, @RequestParam("numProduit") Long numProduit,
			@RequestParam("numIntermediaire") Long numIntermediaire) throws JRException, FileNotFoundException {

		policeService.generateReportPolice(response, format, title, demandeur, numClient, numProduit, numIntermediaire);
	}

	@PostMapping("report/allportefeuille/{format}")
	public @ResponseBody void generateReportAllPorteFeuillePolice(HttpServletResponse response,
			@PathVariable String format, @RequestParam("title") String title,
			@RequestParam("demandeur") String demandeur) throws JRException, FileNotFoundException {

		policeService.generateReportAllPorteFeuillePolice(response, format, title, demandeur);
	}

	@GetMapping(value = "/allpoliceClientCred/{numcli}")
	public ResponseEntity<?> getAllPolicesCLientCred(@PathVariable(value = "numcli") Long id) {
		List<Police> polices = policeRepository.findPoliceByClientCred(id);
		System.out.println(polices);
		return new ResponseEntity<List<Police>>(polices, HttpStatus.OK);
	}

	@GetMapping(value = "/allpoliceClientCMT/{numcli}")
	public ResponseEntity<?> allpoliceClientCMT(@PathVariable(value = "numcli") Long id) {
		List<Police> polices = policeRepository.findPoliceByClientCMT(id);
		System.out.println(polices);
		return new ResponseEntity<List<Police>>(polices, HttpStatus.OK);
	}

	@GetMapping(value = "/allpoliceClientAutre/{numcli}")
	public ResponseEntity<?> allpoliceClientAutre(@PathVariable(value = "numcli") Long id) {
		List<Police> polices = policeRepository.findPoliceByClientAUTRE(id);
		System.out.println(polices);
		return new ResponseEntity<List<Police>>(polices, HttpStatus.OK);
	}
}
