package sn.jmad.sonac.controller;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import net.sf.jasperreports.engine.JRException;
import sn.jmad.sonac.message.response.EmissionConsultation;
import sn.jmad.sonac.message.response.EncaissementClient;
import sn.jmad.sonac.message.response.ProductionConsultation;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Facture;
import sn.jmad.sonac.model.Quittance;
import sn.jmad.sonac.repository.FactureRepository;
import sn.jmad.sonac.repository.QuittanceRepository;
import sn.jmad.sonac.service.QuittanceService;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/quittance/*")
public class QuittanceController {

	@Autowired
	private QuittanceRepository quittanceRepository;
	@Autowired
	FactureRepository factureRepository;
	@Autowired
	private QuittanceService quittanceService;

	@GetMapping(value = "/allQuittances")
	public ResponseEntity<?> getAllQuittances() {
		List<Quittance> quittances = quittanceRepository.allQuittances();
		// System.out.println("liste des quittances : " + quittances);
		if (quittances.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);

		return new ResponseEntity<List<Quittance>>(quittances, HttpStatus.OK);
	}

	@GetMapping(value = "/allQuittancesClient/{numcli}")
	public ResponseEntity<?> getAllQuittancesClient(@PathVariable(value = "numcli") Long numcli) {
		List<Quittance> quittances = quittanceRepository.allQuittancesClient(numcli);
		// System.out.println("liste des quittances : " + quittances);

		return new ResponseEntity<List<Quittance>>(quittances, HttpStatus.OK);
	}

	@GetMapping(value = "/getQuittanceFact/{numfact}")
	public ResponseEntity<?> getAllQuittances(@PathVariable(value = "numfact") Long numfact) {
		Quittance quittance = quittanceRepository.findbyPolice(numfact);

		if (quittance == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage(" vide "), HttpStatus.NOT_FOUND);

		return new ResponseEntity<Quittance>(quittance, HttpStatus.OK);
	}

	/*
	 * @GetMapping(value =
	 * "/findQuittanceByNumFactEncaissement/{numFactEncaissement}") public
	 * ResponseEntity<?>
	 * findQuittanceByNumFactEncaissement(@PathVariable("numFactEncaissement") Long
	 * numFactEncaissement) { Quittance quittance =
	 * quittanceRepository.findQuittanceByNumFactEncaissement(numFactEncaissement);
	 * 
	 * if(quittance == null) { return new ResponseEntity<ResponseMessage>(new
	 * ResponseMessage("chao", "Cette quittance n'existe pas", quittance),
	 * HttpStatus.OK); }
	 * 
	 * return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
	 * "La quittance demandée", quittance), HttpStatus.OK); }
	 */

	@PostMapping("/addQuittance")
	public ResponseEntity<?> addQuittance(@RequestBody Quittance quittance) {

		quittance.setQuit_status(" ");
		quittance.setActive(1L);
		Quittance q = quittanceRepository.save(quittance);
		if (q == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);

		return new ResponseEntity<>(quittance, HttpStatus.OK);

	}

	// add for police
	@PostMapping("/addQuittanceForPolice")
	public ResponseEntity<?> addQuittanceForPolice(@RequestBody Quittance quittance) {

		quittance.setQuit_status(" ");
		quittance.setActive(1L);
		Quittance q = quittanceRepository.save(quittance);
		if (q == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);

		Optional<Facture> c = factureRepository.findByNum(quittance.getQuit_Facture());
		if (c.isPresent()) {
			Facture currentFacture = c.get();
			currentFacture.setFact_numeroquittance(quittance.getQuit_numero());
			System.out.println("***" + currentFacture);
			factureRepository.save(currentFacture);

		} else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de la modification"),
					HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<>(quittance, HttpStatus.OK);

	}
	// fin add for police

	@PutMapping("/editQuittance")
	public ResponseEntity<?> editQuittance(@RequestBody Quittance quittance) {
		Quittance qUpdate = quittanceRepository.findbyIdd(quittance.getQuit_id());
		quittance.setQuit_id(qUpdate.getQuit_id());
		Quittance q = quittanceRepository.save(quittance);
		if (q == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);

		return new ResponseEntity<>(new ResponseMessage("Quittance modifié"), HttpStatus.OK);

	}

	@GetMapping(value = "/getQuittance/{numQuit}")
	public ResponseEntity<?> getQuittance(@PathVariable(value = "numQuit") Long numQuit) {
		Quittance quittance = quittanceRepository.findbyIdd(numQuit);

		if (quittance == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage(" vide "), HttpStatus.NOT_FOUND);

		return new ResponseEntity<Quittance>(quittance, HttpStatus.OK);
	}

	/*
	 * Les méthodes suivantes servent essentiellement à faire la consultation et
	 * l'édition des quittance non payé = emission
	 */

	@GetMapping(value = "/allEmissionConsultation")
	public ResponseEntity<?> getAllEmissionsConsultation() {
		List<EmissionConsultation> emissionsConsultation = quittanceRepository.allEmissionConsultation();

		return new ResponseEntity<List<EmissionConsultation>>(emissionsConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allEmissionConsultationByPeriode/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllEmissionsConsultationByPeriode(@PathVariable String date_debut,
			@PathVariable String date_fin) {
		List<EmissionConsultation> emissionsConsultation = quittanceRepository
				.allEmissionConsultationByPeriode(date_debut, date_fin);

		return new ResponseEntity<List<EmissionConsultation>>(emissionsConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allEmissionConsultationByProduit/{numProd}")
	public ResponseEntity<?> getAllEmissionsConsultationByProduit(@PathVariable Long numProd) {
		List<EmissionConsultation> emissionsConsultation = quittanceRepository
				.allEmissionConsultationByProduit(numProd);

		return new ResponseEntity<List<EmissionConsultation>>(emissionsConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allEmissionConsultationByIntermediaire/{numInterm}")
	public ResponseEntity<?> getAllEmissionsByIntermediaire(@PathVariable Long numInterm) {
		List<EmissionConsultation> emissionsConsultation = quittanceRepository
				.allEmissionConsultationByIntermediaire(numInterm);

		return new ResponseEntity<List<EmissionConsultation>>(emissionsConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allEmissionConsultationByPeriodeAndProduit/{numProd}/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllEmissionsByPeriodeAndProduit(@PathVariable Long numProd,
			@PathVariable String date_debut, @PathVariable String date_fin) {

		List<EmissionConsultation> emissionsConsultation = quittanceRepository
				.allEmissionConsultationByPeriodeAndProduit(numProd, date_debut, date_fin);

		return new ResponseEntity<List<EmissionConsultation>>(emissionsConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allEmissionConsultationByPeriodeAndIntermediaire/{numInterm}/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllEmissionsByPeriodeAndIntermediaire(@PathVariable Long numInterm,
			@PathVariable String date_debut, @PathVariable String date_fin) {

		List<EmissionConsultation> emissionsConsultation = quittanceRepository
				.allEmissionConsultationByPeriodeAndIntermediaire(numInterm, date_debut, date_fin);

		return new ResponseEntity<List<EmissionConsultation>>(emissionsConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allEmissionConsultationByProduitAndIntermediaire/{numInterm}/{numProd}")
	public ResponseEntity<?> getAllEmissionsByProduitAndIntermediaire(@PathVariable Long numInterm,
			@PathVariable Long numProd) {
		List<EmissionConsultation> emissionsConsultation = quittanceRepository
				.allEmissionConsultationByProduitAndIntermediaire(numInterm, numProd);

		return new ResponseEntity<List<EmissionConsultation>>(emissionsConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allEmissionConsultationByCriteres/{numInterm}/{numProd}/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllEmissionsByAllCriteres(@PathVariable Long numInterm, @PathVariable Long numProd,
			@PathVariable String date_debut, @PathVariable String date_fin) {

		List<EmissionConsultation> emissionsConsultation = quittanceRepository
				.allEmissionConsultationByAllCriteres(numInterm, numProd, date_debut, date_fin);

		return new ResponseEntity<List<EmissionConsultation>>(emissionsConsultation, HttpStatus.OK);
	}

	@GetMapping("report/{format}/{title}/{demandeur}/{numInterm}/{numProd}/{dateDebut}/{dateFin}")
	public @ResponseBody void generateReportEmissions(HttpServletResponse response, @PathVariable String format,
			@PathVariable String title, @PathVariable String demandeur, @PathVariable Long numInterm,
			@PathVariable Long numProd, @PathVariable String dateDebut, @PathVariable String dateFin)
			throws JRException, FileNotFoundException {

		quittanceService.generateReportEmissions(response, format, title, demandeur, numInterm, numProd, dateDebut,
				dateFin);
	}

	/*
	 * Les méthodes suivantes servent essentiellement à faire la consultation et
	 * l'édition des emissions annulées
	 */

	@GetMapping(value = "/allEmissionAnnuleesConsultation")
	public ResponseEntity<?> getAllEmissionsAnnuleesConsultation() {
		List<EmissionConsultation> emissionsAnnuleesConsultation = quittanceRepository
				.allEmissionsAnnuleesConsultation();

		return new ResponseEntity<List<EmissionConsultation>>(emissionsAnnuleesConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allEmissionAnnuleesConsultationByPeriode/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllEmissionsAnnuleesConsultationByPeriode(@PathVariable String date_debut,
			@PathVariable String date_fin) {
		List<EmissionConsultation> emissionsAnnuleesConsultation = quittanceRepository
				.allEmissionsAnnuleesConsultationByPeriode(date_debut, date_fin);

		return new ResponseEntity<List<EmissionConsultation>>(emissionsAnnuleesConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allEmissionAnnuleesConsultationByProduit/{numProd}")
	public ResponseEntity<?> getAllEmissionsAnnuleesConsultationByProduit(@PathVariable Long numProd) {
		List<EmissionConsultation> emissionsAnnuleesConsultation = quittanceRepository
				.allEmissionsAnnuleesConsultationByProduit(numProd);

		return new ResponseEntity<List<EmissionConsultation>>(emissionsAnnuleesConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allEmissionAnnuleesConsultationByIntermediaire/{numInterm}")
	public ResponseEntity<?> getAllEmissionsAnnuleesConsultationByIntermediaire(@PathVariable Long numInterm) {
		List<EmissionConsultation> emissionsAnnuleesConsultation = quittanceRepository
				.allEmissionsAnnuleesConsultationByIntermediaire(numInterm);

		return new ResponseEntity<List<EmissionConsultation>>(emissionsAnnuleesConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allEmissionAnnuleesConsultationByPeriodeAndProduit/{numProd}/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllEmissionsAnnuleesConsultationByPeriodeAndProduit(@PathVariable Long numProd,
			@PathVariable String date_debut, @PathVariable String date_fin) {

		List<EmissionConsultation> emissionsAnnuleesConsultation = quittanceRepository
				.allEmissionsAnnuleesConsultationByPeriodeAndProduit(numProd, date_debut, date_fin);

		return new ResponseEntity<List<EmissionConsultation>>(emissionsAnnuleesConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allEmissionAnnuleesConsultationByPeriodeAndIntermediaire/{numInterm}/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllEmissionsAnnuleesConsultationByPeriodeAndIntermediaire(@PathVariable Long numInterm,
			@PathVariable String date_debut, @PathVariable String date_fin) {

		List<EmissionConsultation> emissionsAnnuleesConsultation = quittanceRepository
				.allEmissionsAnnuleesConsultationByPeriodeAndIntermediaire(numInterm, date_debut, date_fin);

		return new ResponseEntity<List<EmissionConsultation>>(emissionsAnnuleesConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allEmissionAnnuleesConsultationByProduitAndIntermediaire/{numInterm}/{numProd}")
	public ResponseEntity<?> getAllEmissionsAnnuleesConsultationByProduitAndIntermediaire(@PathVariable Long numInterm,
			@PathVariable Long numProd) {

		List<EmissionConsultation> emissionsAnnuleesConsultation = quittanceRepository
				.allEmissionsAnnuleesConsultationByProduitAndIntermediaire(numInterm, numProd);

		return new ResponseEntity<List<EmissionConsultation>>(emissionsAnnuleesConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allEmissionAnnuleesConsultationByCriteres/{numInterm}/{numProd}/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllEmissionsAnnuleesConsultationByAllCriteres(@PathVariable Long numInterm,
			@PathVariable Long numProd, @PathVariable String date_debut, @PathVariable String date_fin) {

		List<EmissionConsultation> emissionsAnnuleesConsultation = quittanceRepository
				.allEmissionsAnnuleesConsultationByAllCriteres(numInterm, numProd, date_debut, date_fin);

		return new ResponseEntity<List<EmissionConsultation>>(emissionsAnnuleesConsultation, HttpStatus.OK);
	}

	@GetMapping("reportEmissionsAnnulees/{format}/{title}/{demandeur}/{numInterm}/{numProd}/{dateDebut}/{dateFin}")
	public @ResponseBody void generateReportEmissionsAnnulees(HttpServletResponse response, @PathVariable String format,
			@PathVariable String title, @PathVariable String demandeur, @PathVariable Long numInterm,
			@PathVariable Long numProd, @PathVariable String dateDebut, @PathVariable String dateFin)
			throws JRException, FileNotFoundException {

		quittanceService.generateReportEmissionsAnnulees(response, format, title, demandeur, numInterm, numProd,
				dateDebut, dateFin);
	}

	/*
	 * Les méthodes suivantes servent essentiellement à faire la consultation et
	 * l'édition des quittances payées = production
	 */

	@GetMapping(value = "/allProductionConsultation")
	public ResponseEntity<?> getAllProductionConsultation() {
		List<ProductionConsultation> productionsConsultation = quittanceRepository.allProductionConsultation();

		return new ResponseEntity<List<ProductionConsultation>>(productionsConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allProductionConsultationByPeriode/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllProductionConsultationByPeriode(@PathVariable String date_debut,
			@PathVariable String date_fin) {
		List<ProductionConsultation> productionsConsultation = quittanceRepository
				.allProductionConsultationByPeriode(date_debut, date_fin);

		return new ResponseEntity<List<ProductionConsultation>>(productionsConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allProductionConsultationByProduit/{numProd}")
	public ResponseEntity<?> getAllProductionConsultationByProduit(@PathVariable Long numProd) {
		List<ProductionConsultation> productionsConsultation = quittanceRepository
				.allProductionConsultationByProduit(numProd);

		return new ResponseEntity<List<ProductionConsultation>>(productionsConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allProductionConsultationByIntermediaire/{numInterm}")
	public ResponseEntity<?> getAllProductionConsultationByIntermediaire(@PathVariable Long numInterm) {
		List<ProductionConsultation> productionsConsultation = quittanceRepository
				.allProductionConsultationByIntermediaire(numInterm);

		return new ResponseEntity<List<ProductionConsultation>>(productionsConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allProductionConsultationByPeriodeAndProduit/{numProd}/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllProductionConsultationByPeriodeAndProduit(@PathVariable Long numProd,
			@PathVariable String date_debut, @PathVariable String date_fin) {

		List<ProductionConsultation> productionsConsultation = quittanceRepository
				.allProductionConsultationByPeriodeAndProduit(numProd, date_debut, date_fin);

		return new ResponseEntity<List<ProductionConsultation>>(productionsConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allProductionConsultationByPeriodeAndIntermediaire/{numInterm}/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllProductionConsultationByPeriodeAndIntermdiaire(@PathVariable Long numInterm,
			@PathVariable String date_debut, @PathVariable String date_fin) {

		List<ProductionConsultation> productionsConsultation = quittanceRepository
				.allProductionConsultationByPeriodeAndIntermediaire(numInterm, date_debut, date_fin);

		return new ResponseEntity<List<ProductionConsultation>>(productionsConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allProductionConsultationByProduitAndIntermediaire/{numInterm}/{numProd}")
	public ResponseEntity<?> getAllProductionConsultationByAllCriteres(@PathVariable Long numInterm,
			@PathVariable Long numProd) {

		List<ProductionConsultation> productionsConsultation = quittanceRepository
				.allProductionConsultationByProduitAndIntermediaire(numInterm, numProd);

		return new ResponseEntity<List<ProductionConsultation>>(productionsConsultation, HttpStatus.OK);
	}

	@GetMapping(value = "/allProductionConsultationByCriteres/{numInterm}/{numProd}/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllProductionConsultationByAllCriteres(@PathVariable Long numInterm,
			@PathVariable Long numProd, @PathVariable String date_debut, @PathVariable String date_fin) {

		List<ProductionConsultation> productionsConsultation = quittanceRepository
				.allProductionConsultationByAllCriteres(numInterm, numProd, date_debut, date_fin);

		return new ResponseEntity<List<ProductionConsultation>>(productionsConsultation, HttpStatus.OK);
	}

	@GetMapping("report/production/{format}/{title}/{demandeur}/{numInterm}/{numProd}/{dateDebut}/{dateFin}")
	public @ResponseBody void generateReportProductions(HttpServletResponse response, @PathVariable String format,
			@PathVariable String title, @PathVariable String demandeur, @PathVariable Long numInterm,
			@PathVariable Long numProd, @PathVariable String dateDebut, @PathVariable String dateFin)
			throws JRException, FileNotFoundException {

		quittanceService.generateReportProduction(response, format, title, demandeur, numInterm, numProd, dateDebut,
				dateFin);
	}

	@GetMapping(value = "/getQuittanceP/{numPolice}")
	public ResponseEntity<?> getQuittanceByNumPolice(@PathVariable(value = "numPolice") Long numPolice) {
		Quittance quittance = quittanceRepository.findbyNumpol(numPolice);

		if (quittance == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage(" vide "), HttpStatus.NOT_FOUND);

		return new ResponseEntity<Quittance>(quittance, HttpStatus.OK);
	}

	@GetMapping(value = "/findQuittanceByPolice/{numPolice}")
	public ResponseEntity<?> findQuittanceByPolice(@PathVariable(value = "numPolice") Long numPolice) {
		List<Quittance> listeQuittances = quittanceRepository.findQuittancebyPolice(numPolice);

		if (listeQuittances.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("vide",
					"La liste des quittances pour la police " + numPolice + " est vide.", listeQuittances),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des quittances de la police " + numPolice, listeQuittances),
				HttpStatus.OK);
	}

	@GetMapping(value = "/findMaxQuittanceByPolice/{numPolice}")
	public ResponseEntity<?> findMaxQuittanceByPolice(@PathVariable(value = "numPolice") Long numPolice) {
		Quittance numQuittance = quittanceRepository.getDerniereQuitByPolice(numPolice);

		if (numQuittance == null)
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "Cette quittance n'existe pas", numQuittance), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La quittance demandée" + numPolice, numQuittance), HttpStatus.OK);
	}
}
