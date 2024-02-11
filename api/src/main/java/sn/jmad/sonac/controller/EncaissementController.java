package sn.jmad.sonac.controller;

import java.io.FileNotFoundException;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import net.sf.jasperreports.engine.JRException;
import sn.jmad.sonac.message.response.ConsulationEncaissement;
import sn.jmad.sonac.message.response.EncaissementClient;
import sn.jmad.sonac.message.response.InfoCommission;
import sn.jmad.sonac.message.response.IntermediaireCom;
import sn.jmad.sonac.message.response.RecoursFront;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Encaissement;
import sn.jmad.sonac.model.Facture;
import sn.jmad.sonac.model.Quittance;
import sn.jmad.sonac.repository.EncaissementRepository;
import sn.jmad.sonac.repository.FactureRepository;
import sn.jmad.sonac.repository.QuittanceRepository;
import sn.jmad.sonac.security.service.UserPrinciple;
import sn.jmad.sonac.service.EncaissementService;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/encaissement/*")
public class EncaissementController {

	@Autowired
	private EncaissementRepository encaissementRepository;

	@Autowired
	private QuittanceRepository quittanceRepository;

	@Autowired
	private FactureRepository factureRepository;

	@Autowired
	private EncaissementService encaissementService;

	@GetMapping(value = "/allEncaissements")
	public ResponseEntity<?> getAllEncaissements() {
		List<Encaissement> encaissements = encaissementRepository.allEncaissements();
		// System.out.println("liste des encaissements : " + encaissements);
		if (encaissements.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);

		return new ResponseEntity<List<Encaissement>>(encaissements, HttpStatus.OK);
	}

	@GetMapping(value = "/GetEncaissements/{numfact}")
	public ResponseEntity<?> getEncaissements(@PathVariable Long numfact) {
		List<Encaissement> encaissements = encaissementRepository.getEncaissements(numfact);
		// System.out.println("liste des encaissements : " + encaissements);
		if (encaissements.isEmpty())
			return new ResponseEntity<List<Encaissement>>(encaissements, HttpStatus.OK);

		return new ResponseEntity<List<Encaissement>>(encaissements, HttpStatus.OK);
	}

	/*
	 * @PostMapping(value = "/annulerEncaissement") public ResponseEntity<?>
	 * annulerEncaissement(@RequestBody List<Long> numEncaiss) {
	 * System.out.println(numEncaiss); String str =
	 * encaissementService.annulerEncaissements(numEncaiss);
	 * 
	 * return new ResponseEntity<>(new ResponseMessage(str), HttpStatus.OK);
	 * 
	 * }
	 * 
	 * 
	 * @PostMapping(value = "/annulerEncaissement/{typeAnnulation}") public
	 * ResponseEntity<?> annulerEncaissement(@RequestBody List<Long>
	 * numEncaiss,@PathVariable String typeAnnulation) {
	 * System.out.println(numEncaiss+"------------"+typeAnnulation);
	 * 
	 * String str =
	 * encaissementService.annulerEncaissements(numEncaiss,typeAnnulation);
	 * 
	 */

	@PostMapping(value = "/annulerEncaissement/{typeAnnulation}")
	public ResponseEntity<?> annulerEncaissement(@RequestBody List<Long> numEncaiss,
			@PathVariable String typeAnnulation) {
		System.out.println(numEncaiss);
		String str = encaissementService.annulerEncaissements(numEncaiss, typeAnnulation);

		return new ResponseEntity<>(new ResponseMessage(str), HttpStatus.OK);

	}

	@PostMapping("/addEncaissement")
	public ResponseEntity<?> addGarantie(@RequestBody Encaissement encaissement) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		UserPrinciple u = (UserPrinciple) auth.getPrincipal();

		encaissement.setEncai_codeutilisateur(u.getUtil_num());
		
		if (encaissement.getEncai_numerocheque() != null && !encaissement.getEncai_numerocheque().equals("")) {
			List<Encaissement> listeEncaissement = encaissementRepository
					.existingChequeNumber(encaissement.getEncai_numerocheque());
			
			if (!listeEncaissement.isEmpty()) {

				Encaissement caisse = listeEncaissement.get(0);
				System.out.println("-------------" + caisse);

				if (caisse != null) {
					return new ResponseEntity<ResponseMessage>(
							new ResponseMessage("chao", "Le numéro de chèque est déjà utilisé!", caisse),
							HttpStatus.NOT_FOUND);
				}
			}

		}

		Encaissement enc = encaissementService.encaisser(encaissement);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok",
						"L'encaissement n° " + enc.getEncai_numeroencaissement() + " est enregistré avec succès", enc),
				HttpStatus.OK);
	}

	@PostMapping("/addEncaissementAvoir")
	public ResponseEntity<?> EncaissementAvoir(@RequestBody Encaissement encaissement) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		UserPrinciple u = (UserPrinciple) auth.getPrincipal();

		encaissement.setEncai_codeutilisateur(u.getUtil_num());
		Encaissement encaissementSaved = encaissementService.encaisser(encaissement);

		if (encaissementSaved != null)
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("ok", "L'encaissement n° " + encaissementSaved.getEncai_numeroencaissement()
							+ " est enregistré avec succès", encaissementSaved),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
				"Echec de l'enregistrement de l'encaissement, vérifiez vos informations", encaissementSaved),
				HttpStatus.NOT_FOUND);
	}

	@PostMapping("/payerCommission")
	public ResponseEntity<?> payerCommission(@RequestBody InfoCommission info) {
		if (info.getMode_paiement() == 1) {

			List<Facture> facts = factureRepository.allFacturesIntermediarePeriode(info.getIntermediaire(),
					info.getDate_debut(), info.getDate_fin());

			System.out.println(facts);
			return new ResponseEntity<List<Facture>>(facts, HttpStatus.OK);

		} else {
			List<IntermediaireCom> interCom = factureRepository.allFacturesAllIntermediarePeriode(info.getDate_debut(),
					info.getDate_fin());
			return new ResponseEntity<List<IntermediaireCom>>(interCom, HttpStatus.OK);
		}

	}

	@PostMapping(value = "/GetCommissions")
	public ResponseEntity<?> GetCommissions(@RequestBody InfoCommission info) {

		List<Facture> facts = factureRepository.allFacturesIntermediarePeriode(info.getIntermediaire(),
				info.getDate_debut(), info.getDate_fin());

		System.out.println(facts);
		return new ResponseEntity<List<Facture>>(facts, HttpStatus.OK);
	}

	@PutMapping("/editEncaissement")
	public ResponseEntity<?> editEncaissement(@RequestBody Encaissement encaissement) {
		Encaissement encaissementUpdate = encaissementRepository.findbyIdd(encaissement.getEncai_id());
		encaissement.setEncai_id(encaissementUpdate.getEncai_id());
		Encaissement en = encaissementRepository.save(encaissement);
		if (en == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);

		return new ResponseEntity<>(new ResponseMessage("encaissement modifié"), HttpStatus.OK);

	}

	@PostMapping("/addEncaissementMultiple/{montantTot}")
	public ResponseEntity<?> addEncaiss(@RequestBody List<Encaissement> encaissements,
			@PathVariable(value = "montantTot") Long montantTot) {
		String str = "";

		System.out.println("==================== AVANT BOUCLE MONTANT TOTAL ==================");
		System.out.println(montantTot);
		for (Encaissement enc : encaissements) {
			System.out.println(enc);
			Encaissement e = encaissementService.encaisserM(enc, montantTot);
			montantTot = Math.subtractExact(montantTot, e.getEncai_mtnpaye());
			System.out.println("==========Montant total = "+ montantTot);
			str = str + "Encaissement N° " + enc.getEncai_numeroencaissement() + " est enregistré ! \n";
		}
		
		System.out.println("==================== APRES BOUCLE MONTANT TOTAL ==================");
		System.out.println(montantTot);

		return new ResponseEntity<>(new ResponseMessage(str), HttpStatus.OK);

	}

	/*
	 * Les méthodes suivantes servent éssenetiellement à faire la consultation des
	 * encaissements
	 */

	@GetMapping(value = "/allEncaissementsandClient")
	public ResponseEntity<?> getAllEncaissementsAndClient() {
		List<EncaissementClient> encaissementsAndClient = encaissementRepository.allEncaissementAndClient();

		return new ResponseEntity<List<EncaissementClient>>(encaissementsAndClient, HttpStatus.OK);
	}

//	@GetMapping(value = "/encaissementsByClient/{numclient}")
//    public ResponseEntity<?> getAllEncaissementsByClient(@PathVariable Long numclient) {
//        List<EncaissementClient> encaissementsClient = encaissementRepository.allEncaissementByClient(numclient);
////        if (encaissementsClient.isEmpty())
////        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
//        
//        return new ResponseEntity<List<EncaissementClient>>(encaissementsClient, HttpStatus.OK);
//    }

	@GetMapping(value = "/encaissementsByPeriode/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllEncaissementsByPeriode(@PathVariable String date_debut,
			@PathVariable String date_fin) {
		List<EncaissementClient> encaissements = encaissementRepository.allEncaissementByPeriode(date_debut, date_fin);

		return new ResponseEntity<List<EncaissementClient>>(encaissements, HttpStatus.OK);
	}

	@GetMapping(value = "/encaissementsByProduit/{numProd}")
	public ResponseEntity<?> getAllEncaissementsByProduit(@PathVariable Long numProd) {
		List<EncaissementClient> encaissements = encaissementRepository.allEncaissementByProduit(numProd);

		return new ResponseEntity<List<EncaissementClient>>(encaissements, HttpStatus.OK);
	}

	@GetMapping(value = "/getEncaissement/{id}")
	public ResponseEntity<?> getFacture(@PathVariable(value = "id") Long id) {

		Optional<Encaissement> c = encaissementRepository.findbyNum(id);

		if (c.isPresent()) {
			return new ResponseEntity<Encaissement>(c.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("ce numero de encaissement n'existe pas "),
					HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping(value = "/encaissementsByIntermediaire/{numInterm}")
	public ResponseEntity<?> getAllEncaissementsByIntermediaire(@PathVariable Long numInterm) {
		List<EncaissementClient> encaissements = encaissementRepository.allEncaissementByIntermediaire(numInterm);

		return new ResponseEntity<List<EncaissementClient>>(encaissements, HttpStatus.OK);
	}

	@GetMapping(value = "/encaissementsByPeriodeAndProduit/{numProd}/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllEncaissementsByPeriodeAndProduit(@PathVariable Long numProd,
			@PathVariable String date_debut, @PathVariable String date_fin) {

		List<EncaissementClient> encaissements = encaissementRepository.allEncaissementByPeriodeAndProduit(numProd,
				date_debut, date_fin);

		return new ResponseEntity<List<EncaissementClient>>(encaissements, HttpStatus.OK);
	}

	@GetMapping(value = "/encaissementsByPeriodeAndIntermediaire/{numInterm}/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllEncaissementsByPeriodeAndIntermediaire(@PathVariable Long numInterm,
			@PathVariable String date_debut, @PathVariable String date_fin) {

		List<EncaissementClient> encaissements = encaissementRepository
				.allEncaissementByPeriodeAndIntermediaire(numInterm, date_debut, date_fin);

		return new ResponseEntity<List<EncaissementClient>>(encaissements, HttpStatus.OK);
	}

	@GetMapping(value = "/encaissementsByProduitAndIntermediaire/{numInterm}/{numProd}")
	public ResponseEntity<?> getAllEncaissementsByProduitAndIntermediaire(@PathVariable Long numInterm,
			@PathVariable Long numProd) {

		List<EncaissementClient> encaissements = encaissementRepository
				.allEncaissementByProduitAndIntermediaire(numInterm, numProd);

		return new ResponseEntity<List<EncaissementClient>>(encaissements, HttpStatus.OK);
	}

	@GetMapping(value = "/encaissementsByCriteres/{numInterm}/{numProd}/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllEncaissementsByCriteres(@PathVariable Long numInterm, @PathVariable Long numProd,
			@PathVariable String date_debut, @PathVariable String date_fin) {

		List<EncaissementClient> encaissements = encaissementRepository.allEncaissementByCriteres(numInterm, numProd,
				date_debut, date_fin);

		return new ResponseEntity<List<EncaissementClient>>(encaissements, HttpStatus.OK);
	}

	@GetMapping("report/{format}/{title}/{demandeur}/{numInterm}/{numProd}/{dateDebut}/{dateFin}")
	public @ResponseBody void generateReportEncaissement(HttpServletResponse response, @PathVariable String format,
			@PathVariable String title, @PathVariable String demandeur, @PathVariable Long numInterm,
			@PathVariable Long numProd, @PathVariable String dateDebut, @PathVariable String dateFin)
			throws JRException, FileNotFoundException {

		encaissementService.generateReportEncaissement(response, format, title, demandeur, numInterm, numProd,
				dateDebut, dateFin);
	}

	/*
	 * Les méthodes suivantes servent éssenetiellement à faire la consultation des
	 * encaissements annulées (productions annulées)
	 */
	@GetMapping(value = "/allEncaissementsAnnules")
	public ResponseEntity<?> getAllEncaissementsAnnulees() {
		List<EncaissementClient> encaissementsAnnulees = encaissementRepository.allEncaissementsAnnulees();

		return new ResponseEntity<List<EncaissementClient>>(encaissementsAnnulees, HttpStatus.OK);
	}

	@GetMapping(value = "/encaissementsAnnulesByPeriode/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllEncaissementsAnnuleesByPeriode(@PathVariable String date_debut,
			@PathVariable String date_fin) {
		List<EncaissementClient> encaissementsAnnulees = encaissementRepository
				.allEncaissementsAnnuleesByPeriode(date_debut, date_fin);

		return new ResponseEntity<List<EncaissementClient>>(encaissementsAnnulees, HttpStatus.OK);
	}

	@GetMapping(value = "/encaissementsAnnulesByProduit/{numProd}")
	public ResponseEntity<?> getAllEncaissementsAnnuleesByProduit(@PathVariable Long numProd) {
		List<EncaissementClient> encaissementsAnnulees = encaissementRepository
				.allEncaissementsAnnuleesByProduit(numProd);

		return new ResponseEntity<List<EncaissementClient>>(encaissementsAnnulees, HttpStatus.OK);
	}

	@GetMapping(value = "/encaissementsAnnulesByIntermediaire/{numInterm}")
	public ResponseEntity<?> getAllEncaissementsAnnuleesByIntermediaire(@PathVariable Long numInterm) {
		List<EncaissementClient> encaissementsAnnulees = encaissementRepository
				.allEncaissementsAnnuleesByIntermediaire(numInterm);

		return new ResponseEntity<List<EncaissementClient>>(encaissementsAnnulees, HttpStatus.OK);
	}

	@GetMapping(value = "/encaissementsAnnulesByPeriodeAndProduit/{numProd}/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllEncaissementsAnnuleesByPeriodeAndProduit(@PathVariable Long numProd,
			@PathVariable String date_debut, @PathVariable String date_fin) {

		List<EncaissementClient> encaissements = encaissementRepository
				.allEncaissementsAnnuleesByPeriodeAndProduit(numProd, date_debut, date_fin);

		return new ResponseEntity<List<EncaissementClient>>(encaissements, HttpStatus.OK);
	}

	@GetMapping(value = "/encaissementsAnnulesByPeriodeAndIntermediaire/{numInterm}/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllEncaissementsAnnuleesByPeriodeAndIntermediaire(@PathVariable Long numInterm,
			@PathVariable String date_debut, @PathVariable String date_fin) {

		List<EncaissementClient> encaissements = encaissementRepository
				.allEncaissementsAnnuleesByPeriodeAndIntermediaire(numInterm, date_debut, date_fin);

		return new ResponseEntity<List<EncaissementClient>>(encaissements, HttpStatus.OK);
	}

	@GetMapping(value = "/encaissementsAnnulesByProduitAndIntermediaire/{numInterm}/{numProd}")
	public ResponseEntity<?> getAllEncaissementsAnnuleesByCriteres(@PathVariable Long numInterm,
			@PathVariable Long numProd) {

		List<EncaissementClient> encaissements = encaissementRepository
				.allEncaissementsAnnuleesByProduitAndIntermediaire(numInterm, numProd);

		return new ResponseEntity<List<EncaissementClient>>(encaissements, HttpStatus.OK);
	}

	@GetMapping(value = "/encaissementsAnnulesByCriteres/{numInterm}/{numProd}/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllEncaissementsAnnuleesByCriteres(@PathVariable Long numInterm,
			@PathVariable Long numProd, @PathVariable String date_debut, @PathVariable String date_fin) {

		List<EncaissementClient> encaissements = encaissementRepository.allEncaissementsAnnuleesByCriteres(numInterm,
				numProd, date_debut, date_fin);

		return new ResponseEntity<List<EncaissementClient>>(encaissements, HttpStatus.OK);
	}

	@GetMapping("report/encaissementsAnnules/{format}/{title}/{demandeur}/{numInterm}/{numProd}/{dateDebut}/{dateFin}")
	public @ResponseBody void generateReportEncaissementsAnnulees(HttpServletResponse response,
			@PathVariable String format, @PathVariable String title, @PathVariable String demandeur,
			@PathVariable Long numInterm, @PathVariable Long numProd, @PathVariable String dateDebut,
			@PathVariable String dateFin) throws JRException, FileNotFoundException {

		encaissementService.generateReportEncaissementsAnnules(response, format, title, demandeur, numInterm, numProd,
				dateDebut, dateFin);
	}

	@PostMapping("/recuFactureSimple/{encai_numeroencaissement}")
	public @ResponseBody void downloadRecuFactureSimple(HttpServletResponse response,
			@RequestParam("demandeur") String demandeur, @PathVariable Long encai_numeroencaissement)
			throws JRException, FileNotFoundException {
		encaissementService.downloadRecuFactureSimple(response, demandeur, encai_numeroencaissement);
	}

	@PostMapping("/recuEncaissementAnnuler/{encai_numeroencaissement}")
	public @ResponseBody void downloadRecuEncaissementAnnuler(HttpServletResponse response,
			@RequestParam("demandeur") String demandeur, @PathVariable Long encai_numeroencaissement)
			throws JRException, FileNotFoundException {
		encaissementService.downloadRecuEncaissementAnnuler(response, demandeur, encai_numeroencaissement);
	}

	@PostMapping("/recuFactureMultiple/{encai_numeroencaissement}")
	public @ResponseBody void downloadFactureMultiple(HttpServletResponse response,
			@RequestParam("demandeur") String demandeur, @PathVariable Long encai_numeroencaissement)
			throws JRException, FileNotFoundException {
		encaissementService.downloadRecuFactureMultiple(response, demandeur, encai_numeroencaissement);
	}

	@GetMapping(value = "/journalProductionJournalier")
	public ResponseEntity<?> getJournalProductionJournalier() {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementJournalier();

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping(value = "/journalProductionParJour/{jour}")
	public ResponseEntity<?> getJournalProductionParJour(@PathVariable String jour) {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementParJour(jour);

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping(value = "/journalProductionJournalierByPolice/{jour}/{encai_numeropolice}")
	public ResponseEntity<?> getJournalProductionJournalierByPolice(@PathVariable String jour,
			@PathVariable Long encai_numeropolice) {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementJournalierByPolice(jour, encai_numeropolice);

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping(value = "/journalProductionJournalierByClient/{jour}/{encai_numerosouscripteur}")
	public ResponseEntity<?> getJournalProductionJournalierByClient(@PathVariable String jour,
			@PathVariable Long encai_numerosouscripteur) {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementJournalierByClient(jour, encai_numerosouscripteur);

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping(value = "/journalProductionJournalierByBranche/{jour}/{branche_numero}")
	public ResponseEntity<?> getJournalProductionJournalierByBranche(@PathVariable String jour,
			@PathVariable Long branche_numero) {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementJournalierByBranche(jour, branche_numero);

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping(value = "/journalProductionJournalierByProduit/{jour}/{prod_numero}")
	public ResponseEntity<?> getJournalProductionJournalierByProduit(@PathVariable String jour,
			@PathVariable Long prod_numero) {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementJournalierByProduit(jour, prod_numero);

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping(value = "/journalProductionJournalierByIntermediaire/{jour}/{encai_numerointermediaire}")
	public ResponseEntity<?> getJournalProductionJournalierByIntermediaire(@PathVariable String jour,
			@PathVariable Long encai_numerointermediaire) {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementJournalierByIntermediaire(jour, encai_numerointermediaire);

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping(value = "/journalProductionJournalierByPoliceAndClient/{jour}/{encai_numeropolice}/{encai_numerosouscripteur}")
	public ResponseEntity<?> getJournalProductionJournalierByPoliceAndClient(@PathVariable String jour,
			@PathVariable Long encai_numeropolice, @PathVariable Long encai_numerosouscripteur) {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementJournalierByPoliceAndClient(jour, encai_numeropolice, encai_numerosouscripteur);

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping(value = "/journalProductionJournalierByPoliceAndBranche/{jour}/{encai_numeropolice}/{branche_numero}")
	public ResponseEntity<?> getJournalProductionJournalierByPoliceAndBranche(@PathVariable String jour,
			@PathVariable Long encai_numeropolice, @PathVariable Long branche_numero) {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementJournalierByPoliceAndBranche(jour, encai_numeropolice, branche_numero);

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping(value = "/journalProductionJournalierByPoliceAndProduit/{jour}/{encai_numeropolice}/{prod_numero}")
	public ResponseEntity<?> getJournalProductionJournalierByPoliceAndProduit(@PathVariable String jour,
			@PathVariable Long encai_numeropolice, @PathVariable Long prod_numero) {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementJournalierByPoliceAndProduit(jour, encai_numeropolice, prod_numero);

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping(value = "/journalProductionJournalierByPoliceAndProduit/{jour}/{encai_numeropolice}/{encai_numerointermediaire}")
	public ResponseEntity<?> getJournalProductionJournalierByPoliceAndIntermediaire(@PathVariable String jour,
			@PathVariable Long encai_numeropolice, @PathVariable Long encai_numerointermediaire) {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementJournalierByPoliceAndIntermediaire(jour, encai_numeropolice,
						encai_numerointermediaire);

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping(value = "/journalProductionJournalierByClientAndBranche/{jour}/{encai_numerosouscripteur}/{branche_numero}")
	public ResponseEntity<?> getJournalProductionJournalierByClientAndBranche(@PathVariable String jour,
			@PathVariable Long encai_numerosouscripteur, @PathVariable Long branche_numero) {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementJournalierByClientAndBranche(jour, encai_numerosouscripteur, branche_numero);

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping(value = "/journalProductionJournalierByClientAndProduit/{jour}/{encai_numerosouscripteur}/{prod_numero}")
	public ResponseEntity<?> getJournalProductionJournalierByClientAndProduit(@PathVariable String jour,
			@PathVariable Long encai_numerosouscripteur, @PathVariable Long prod_numero) {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementJournalierByClientAndProduit(jour, encai_numerosouscripteur, prod_numero);

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping(value = "/journalProductionJournalierByClientAndIntermediaire/{jour}/{encai_numerosouscripteur}/{encai_numerointermediaire}")
	public ResponseEntity<?> getJournalProductionJournalierByClientAndIntermediaire(@PathVariable String jour,
			@PathVariable Long encai_numerosouscripteur, @PathVariable Long encai_numerointermediaire) {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementJournalierByClientAndIntermediaire(jour, encai_numerosouscripteur,
						encai_numerointermediaire);

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping(value = "/journalProductionJournalierByBrancheAndProduit/{jour}/{branche_numero}/{prod_numero}")
	public ResponseEntity<?> getJournalProductionJournalierByBrancheAndProduit(@PathVariable String jour,
			@PathVariable Long branche_numero, @PathVariable Long prod_numero) {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementJournalierByBrancheAndProduit(jour, branche_numero, prod_numero);

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping(value = "/journalProductionJournalierByBrancheAndIntermediaire/{jour}/{branche_numero}/{encai_numerointermediaire}")
	public ResponseEntity<?> getJournalProductionJournalierByBrancheAndIntermediaire(@PathVariable String jour,
			@PathVariable Long branche_numero, @PathVariable Long encai_numerointermediaire) {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementJournalierByBrancheAndIntermediaire(jour, branche_numero, encai_numerointermediaire);

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping(value = "/journalProductionJournalierByProduitAndIntermediaire/{jour}/{prod_numero}/{encai_numerointermediaire}")
	public ResponseEntity<?> getJournalProductionJournalierByProduitAndIntermediaire(@PathVariable String jour,
			@PathVariable Long prod_numero, @PathVariable Long encai_numerointermediaire) {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementJournalierByProduitAndIntermediaire(jour, prod_numero, encai_numerointermediaire);

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping(value = "/journalProductionJournalierByPoliceAndClientAndBranche/{jour}/{encai_numeropolice}/{encai_numerosouscripteur}/{branche_numero}")
	public ResponseEntity<?> getJournalProductionJournalierByPoliceAndClientAndBranche(@PathVariable String jour,
			@PathVariable Long encai_numeropolice, @PathVariable Long encai_numerosouscripteur,
			@PathVariable Long branche_numero) {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementJournalierByPoliceAndClientAndBranche(jour, encai_numeropolice,
						encai_numerosouscripteur, branche_numero);

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping(value = "/journalProductionJournalierByPoliceAndClientAndBrancheAndProduit/{jour}/{encai_numeropolice}/{encai_numerosouscripteur}/{branche_numero}/{prod_numero}")
	public ResponseEntity<?> getJournalProductionJournalierByPoliceAndClientAndBrancheAndProduit(
			@PathVariable String jour, @PathVariable Long encai_numeropolice,
			@PathVariable Long encai_numerosouscripteur, @PathVariable Long branche_numero,
			@PathVariable Long prod_numero) {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementJournalierByPoliceAndClientAndBrancheAndProduit(jour, encai_numeropolice,
						encai_numerosouscripteur, branche_numero, prod_numero);

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping(value = "/journalProductionJournalierByPoliceAndClientAndBrancheAndProduitAndIntermediaire/{jour}/{encai_numeropolice}/{encai_numerosouscripteur}/{branche_numero}/{prod_numero}/{encai_numerointermediaire}")
	public ResponseEntity<?> getJournalProductionJournalierByPoliceAndClientAndBrancheAndProduitAndIntermediaire(
			@PathVariable String jour, @PathVariable Long encai_numeropolice,
			@PathVariable Long encai_numerosouscripteur, @PathVariable Long branche_numero,
			@PathVariable Long prod_numero, @PathVariable Long encai_numerointermediaire) {
		List<ConsulationEncaissement> journalProductionJournalier = encaissementRepository
				.listeEncaissementJournalierByPoliceAndClientAndBrancheAndProduitAndIntermediaire(jour,
						encai_numeropolice, encai_numerosouscripteur, branche_numero, prod_numero,
						encai_numerointermediaire);

		return new ResponseEntity<List<ConsulationEncaissement>>(journalProductionJournalier, HttpStatus.OK);
	}

	@GetMapping("report/{format}/{title}/{demandeur}/{jour}/{numPolice}/{numClient}/{numBranche}/{numProduit}/{numIntermediaire}")
	public @ResponseBody void generateReportProductionJournalier(HttpServletResponse response,
			@PathVariable String format, @PathVariable String title, @PathVariable String demandeur,
			@PathVariable String jour, @PathVariable Long numPolice, @PathVariable Long numClient,
			@PathVariable Long numBranche, Long numProduit, Long numIntermediaire)
			throws JRException, FileNotFoundException {

		encaissementService.generateReportJournalProduction(response, format, title, demandeur, jour, numPolice,
				numClient, numBranche, numProduit, numIntermediaire);
	}
}
