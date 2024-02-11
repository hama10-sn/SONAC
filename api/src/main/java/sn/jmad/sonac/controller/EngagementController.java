package sn.jmad.sonac.controller;

import sn.jmad.sonac.model.Avenant;
import sn.jmad.sonac.model.Engagement;
import sn.jmad.sonac.model.Police;
import sn.jmad.sonac.repository.AvenantRepository;
import sn.jmad.sonac.repository.EngagementRepository;
import sn.jmad.sonac.repository.PoliceRepository;
import sn.jmad.sonac.security.service.UserPrinciple;
import sn.jmad.sonac.service.EngagementService;

import java.io.FileNotFoundException;
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
import sn.jmad.sonac.message.response.EngagementAcheteur;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.message.response.SinistreClient;
import sn.jmad.sonac.message.response.SureteEngagement;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/engagement/*")
public class EngagementController {

	@Autowired
	EngagementRepository engagRepository;
	@Autowired
	PoliceRepository policeRepository;
	@Autowired
	AvenantRepository avenantRepository;
	@Autowired
	EngagementService engagementService;

	/*
	 * cette methode nous permet d'ajouter un contact
	 *
	 */
	@PostMapping("/addEngagement")

	public ResponseEntity<?> savePay(@Valid @RequestBody Engagement engag) {
		Long numEngage;
		Optional<Engagement> c = engagRepository.findByNum(engag.getEngag_numeroengagement());
		if (!c.isPresent()) {
			engag.setActive(1);
			engag.setEngag_status("en cours");

			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			UserPrinciple u = (UserPrinciple) auth.getPrincipal();
			Police ancienPolice = policeRepository.findByPolice(engag.getEngag_numpoli());
			Avenant avenant = new Avenant(ancienPolice, 1L, u.getUtil_num());

			avenant.setAven_numeroavenant(avenantRepository.lastNumAvenant(ancienPolice.getPoli_numero())
					+ (ancienPolice.getPoli_numerodernieravenant() + 1)); // a faire avec diagne
			Avenant newAv = avenantRepository.save(avenant);
			engag.setEngag_numeroavenant(newAv.getAven_numeroavenant());
			engagRepository.save(engag);
			ancienPolice.setPoli_numerodernieravenant(ancienPolice.getPoli_numerodernieravenant() + 1);
			policeRepository.save(ancienPolice);

			numEngage = engag.getEngag_numeroengagement();
			return new ResponseEntity<>(engag, HttpStatus.OK);

		} else {
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("echec de l'enregistrement numero engagement existe deja "),
					HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping(value = "/delete/{id}")
	public ResponseEntity<?> deleteEngagement(@PathVariable(value = "id") Long id) {

		Optional<Engagement> c = engagRepository.findByNum(id);

		Engagement currentengag = c.get();
		currentengag.setActive(0);
		engagRepository.save(currentengag);
		return new ResponseEntity<ResponseMessage>(new ResponseMessage("Engagement supprimer "), HttpStatus.OK);

	}

	/*
	 * cette methode nous permet de lister les engagements
	 *
	 */

	@GetMapping(value = "/allEngagement")
	public ResponseEntity<?> getAllEngagement() {
		List<Engagement> engag = engagRepository.allEngagements(1);
		System.out.println("liste des engagements : " + engag);
		if (engag.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);

		return new ResponseEntity<List<Engagement>>(engag, HttpStatus.OK);
	}

	/*
	 * cette methode nous permet de modifier un Engagement
	 *
	 */

	@PutMapping(value = "/update")
	public ResponseEntity<?> updateEngagement(@RequestBody Engagement engag) {

		Optional<Engagement> c = engagRepository.findByNum(engag.getEngag_numeroengagement());
		if (c.isPresent()) {
			Engagement currentEngag = c.get();
			currentEngag.setEngag_numeroengagement(engag.getEngag_numeroengagement());
			currentEngag.setEngag_cautionsolidaire(engag.getEngag_cautionsolidaire());
			currentEngag.setEngag_codemarche(engag.getEngag_codemarche());
			currentEngag.setEngag_codeutilisateur(engag.getEngag_codeutilisateur());
			currentEngag.setEngag_datecomptabilisation(engag.getEngag_datecomptabilisation());
			currentEngag.setEngag_datedeposit(engag.getEngag_datedeposit());
			currentEngag.setEngag_dateengagement(engag.getEngag_dateengagement());
			currentEngag.setEngag_dateliberation(engag.getEngag_dateliberationdeposit());
			currentEngag.setEngag_dateliberationdeposit(engag.getEngag_dateliberationdeposit());
			currentEngag.setEngag_datemodification(engag.getEngag_datemodification());
			currentEngag.setEngag_retenudeposit(engag.getEngag_retenudeposit());
			currentEngag.setEngag_identificationtitre(engag.getEngag_identificationtitre());
			currentEngag.setEngag_kapassure(engag.getEngag_kapassure());
			currentEngag.setEngag_status(engag.getEngag_status());
			currentEngag.setEngag_capitalliberationengage(engag.getEngag_capitalliberationengage());
			currentEngag.setEngag_depositlibere(engag.getEngag_depositlibere());
			currentEngag.setEngag_numeroacte(engag.getEngag_numeroacte());
			currentEngag.setEngag_numeroavenant(engag.getEngag_numeroavenant());
			currentEngag.setEngag_numpoli(engag.getEngag_numpoli());
			currentEngag.setEngag_typesurete(engag.getEngag_typesurete());
			engagRepository.save(currentEngag);
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("engagement modifiée avec succès"),
					HttpStatus.OK);
		} else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de la modification"),
					HttpStatus.NOT_FOUND);
		}
	}

	// get engagement by police

	@GetMapping(value = "/allengagementByPolice/{id}")
	public ResponseEntity<?> getAllEngByPolice(@PathVariable(value = "id") Long id) {
		List<Engagement> eng = engagRepository.findEngByPolice(1, id);

		if (eng.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste des engagements vide"),
					HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<List<Engagement>>(eng, HttpStatus.OK);
	}

	@GetMapping(value = "/lastID/{acte}")
	public ResponseEntity<?> lastIdacte(@PathVariable("acte") Long acte) {
		Long lastid = engagRepository.lastIdgengagement(acte);
		if (lastid == null) {
			return new ResponseEntity<Integer>(0, HttpStatus.OK);
		}
		return new ResponseEntity<Long>(lastid, HttpStatus.OK);

	}

	@GetMapping(value = "/engagementbynumero/{numero}")
	public ResponseEntity<?> getEngagementByNumero(@PathVariable("numero") Long numero) {
		Engagement engagement = engagRepository.findEngagementByNumero(numero);
		if (engagement == null)
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "Cet engagement n'existe pas !", null), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "Engagement !", engagement),
				HttpStatus.OK);
	}

	/*
	 * @GetMapping(value = "/allSureteEngagement") public ResponseEntity<?>
	 * getallSureteEngagament() { List<SureteEngagement> sureteEngagements =
	 * engagRepository.getAllSureteEgagement(); if (sureteEngagements.isEmpty())
	 * return new ResponseEntity<ResponseMessage>(new
	 * ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
	 * 
	 * return new ResponseEntity<List<SureteEngagement>>(sureteEngagements,
	 * HttpStatus.OK); }
	 */

	@PostMapping("report/{format}")
	public @ResponseBody void generateReportCategorie(HttpServletResponse response, @PathVariable String format,
			@RequestParam("title") String title, @RequestParam("demandeur") String demandeur)
			throws JRException, FileNotFoundException {

		engagementService.generateReportEngagement(response, format, title, demandeur);
	}

	@GetMapping(value = "/listeAllEngagements")
	public ResponseEntity<?> getAllEngagements() {

		List<EngagementAcheteur> listeEngagements = engagRepository.getAllEngagements();

		return new ResponseEntity<List<EngagementAcheteur>>(listeEngagements, HttpStatus.OK);
	}
	
	@GetMapping(value = "/listeEngagementsByPolice/{engag_numpoli}")
	public ResponseEntity<?> getEngagementsByPolice(@PathVariable Long engag_numpoli) {

		List<EngagementAcheteur> listeEngagements = engagRepository.getEngagementsByPolice(engag_numpoli);

		return new ResponseEntity<List<EngagementAcheteur>>(listeEngagements, HttpStatus.OK);
	}
	
	@GetMapping(value = "/listeEngagementsByBranche/{branche_numero}")
	public ResponseEntity<?> getEngagementsByBranche(@PathVariable Long branche_numero) {

		List<EngagementAcheteur> listeEngagements = engagRepository.getEngagementsByBranche(branche_numero);

		return new ResponseEntity<List<EngagementAcheteur>>(listeEngagements, HttpStatus.OK);
	}
	
	@GetMapping(value = "/listeEngagementsByClient/{clien_numero}")
	public ResponseEntity<?> getEngagementsByClient(@PathVariable Long clien_numero) {

		List<EngagementAcheteur> listeEngagements = engagRepository.getEngagementsByClient(clien_numero);

		return new ResponseEntity<List<EngagementAcheteur>>(listeEngagements, HttpStatus.OK);
	}
	
	@GetMapping(value = "/listeEngagementsByPeriode/{debut}/{fin}")
	public ResponseEntity<?> getEngagementsByPeriode(@PathVariable String debut, @PathVariable String fin) {

		List<EngagementAcheteur> listeEngagements = engagRepository.getEngagementsByPeriode(debut, fin);

		return new ResponseEntity<List<EngagementAcheteur>>(listeEngagements, HttpStatus.OK);
	}
	
	@GetMapping(value = "/listeEngagementsByProduit/{poli_codeproduit}")
	public ResponseEntity<?> getEngagementsByProduit(@PathVariable Long poli_codeproduit) {

		List<EngagementAcheteur> listeEngagements = engagRepository.getEngagementsByProduit(poli_codeproduit);

		return new ResponseEntity<List<EngagementAcheteur>>(listeEngagements, HttpStatus.OK);
	}
	
	@GetMapping(value = "/listeEngagementsByPoliceAndBranche/{engag_numpoli}/{branche_numero}")
	public ResponseEntity<?> getEngagementsByPoliceAndBranche(@PathVariable Long engag_numpoli, @PathVariable Long branche_numero) {

		List<EngagementAcheteur> listeEngagements = engagRepository.getEngagementsByPoliceAndBranche(engag_numpoli, branche_numero);

		return new ResponseEntity<List<EngagementAcheteur>>(listeEngagements, HttpStatus.OK);
	}
	
	@GetMapping(value = "/listeEngagementsByPoliceAndClient/{engag_numpoli}/{clien_numero}")
	public ResponseEntity<?> getEngagementsByPoliceAndClient(@PathVariable Long engag_numpoli, @PathVariable Long clien_numero) {

		List<EngagementAcheteur> listeEngagements = engagRepository.getEngagementsByPoliceAndClient(engag_numpoli, clien_numero);

		return new ResponseEntity<List<EngagementAcheteur>>(listeEngagements, HttpStatus.OK);
	}
	
	@GetMapping(value = "/listeEngagementsByPoliceAndPeriode/{engag_numpoli}/{debut}/{fin}")
	public ResponseEntity<?> getEngagementsByPoliceAndPeriode(@PathVariable Long engag_numpoli, @PathVariable String debut, @PathVariable String fin) {

		List<EngagementAcheteur> listeEngagements = engagRepository.getEngagementsByPoliceAndPeriode(engag_numpoli, debut, fin);

		return new ResponseEntity<List<EngagementAcheteur>>(listeEngagements, HttpStatus.OK);
	}
	
	@GetMapping(value = "/listeEngagementsByPoliceAndProduit/{engag_numpoli}/{poli_codeproduit}")
	public ResponseEntity<?> getEngagementsByPoliceAndProduit(@PathVariable Long engag_numpoli, @PathVariable Long poli_codeproduit) {

		List<EngagementAcheteur> listeEngagements = engagRepository.getEngagementsByPoliceAndProduit(engag_numpoli, poli_codeproduit);

		return new ResponseEntity<List<EngagementAcheteur>>(listeEngagements, HttpStatus.OK);
	}
	
	@GetMapping(value = "/listeEngagementsByPoliceAndBrancheAndClientAndPeriodeAndProduit/{engag_numpoli}/{branche_numero}/{clien_numero}/{debut}/{fin}/{poli_codeproduit}")
	public ResponseEntity<?> getEngagementsByPoliceAndBrancheAndClientAndPeriode(@PathVariable Long engag_numpoli, @PathVariable Long branche_numero, @PathVariable Long clien_numero, @PathVariable String debut, @PathVariable String fin, @PathVariable Long poli_codeproduit) {

		List<EngagementAcheteur> listeEngagements = engagRepository.getEngagementsByPoliceAndBrancheAndClientAndPeriodeAndProduit(engag_numpoli, branche_numero, clien_numero, debut, fin, poli_codeproduit);

		return new ResponseEntity<List<EngagementAcheteur>>(listeEngagements, HttpStatus.OK);
	}
	
	@GetMapping("report/consultation/{format}/{title}/{demandeur}/{engag_numpoli}/{poli_branche}/{clien_numero}/{debut}/{fin}/{prod_numero}")
	public @ResponseBody void generateReportAnnulation(HttpServletResponse response, @PathVariable String format,
			@PathVariable String title, @PathVariable String demandeur, @PathVariable Long engag_numpoli, @PathVariable Long poli_branche,
			@PathVariable Long clien_numero, @PathVariable String debut, @PathVariable String fin, @PathVariable Long prod_numero) throws JRException, FileNotFoundException {

		engagementService.generateReportConsultationEngagement(response, format, title, demandeur, engag_numpoli, poli_branche, clien_numero, debut, fin, prod_numero);
	}
}
