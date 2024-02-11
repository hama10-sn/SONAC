package sn.jmad.sonac.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Beneficiaire;
import sn.jmad.sonac.model.Client;
import sn.jmad.sonac.model.Sinistre;
import sn.jmad.sonac.repository.BeneficiaireRepository;
import sn.jmad.sonac.repository.ClientRepository;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/beneficiaire/*")
public class BeneficiaireController {
	@Autowired
	private BeneficiaireRepository beneficiaireRepository;

	@Autowired
	private ClientRepository clientRepository;

	@GetMapping(value = "/allBeneficiaires")
	public ResponseEntity<?> getAllBeneficiaires() {
		List<Beneficiaire> beneficiaires = beneficiaireRepository.findAll();
		if (beneficiaires == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.FOUND);

		return new ResponseEntity<List<Beneficiaire>>(beneficiaires, HttpStatus.OK);
	}

	@GetMapping(value = "/findAllBeneficiaire")
	public ResponseEntity<?> findAllBeneficiaire() {
		List<Beneficiaire> beneficiaires = beneficiaireRepository.findAllBeneficiaire();
		if (beneficiaires.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("chao", "liste des bénéficiaires est vide !", null), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des bénéficiaires", beneficiaires), HttpStatus.OK);
	}

	@GetMapping(value = "/GetBeneficiaires/{numbenef}")
	public ResponseEntity<?> getBeneficiaires(@PathVariable(name = "numbenef") Long numbenef) {
		Optional<Beneficiaire> beneficiaire = beneficiaireRepository.findById(numbenef);
		if (!beneficiaire.isPresent())
			return new ResponseEntity<Beneficiaire>(new Beneficiaire(), HttpStatus.OK);

		return new ResponseEntity<Beneficiaire>(beneficiaire.get(), HttpStatus.OK);
	}

	@GetMapping(value = "/findBeneficiaireByNum/{numBenef}")
	public ResponseEntity<?> findBeneficiaireByNum(@PathVariable Long numBenef) {

		Beneficiaire beneficiaire = beneficiaireRepository.findByCode(numBenef);

		if (beneficiaire == null)
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("chao", "Bénéficiaire non trouvé", beneficiaire), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "Voici le beneficiaire que vous recherchez", beneficiaire), HttpStatus.OK);
	}

	/*
	 * @GetMapping(value = "/findBeneficiaireByDenominationOuPrenomNom/{numClient}")
	 * public ResponseEntity<?>
	 * findBeneficiaireByDenominationOuPrenomNom(@PathVariable Long numClient) {
	 * 
	 * Client client = clientRepository.findByNumClient(numClient); if(client !=
	 * null) {
	 * 
	 * }
	 * 
	 * Beneficiaire beneficiaire = beneficiaireRepository.findByCode(numClient);
	 * 
	 * if (beneficiaire == null) return new ResponseEntity<ResponseMessage>(new
	 * ResponseMessage("chao", "Bénéficiaire non trouvé", beneficiaire),
	 * HttpStatus.OK);
	 * 
	 * return new ResponseEntity<ResponseMessage>( new ResponseMessage("ok",
	 * "Voici le beneficiaire que vous recherchez", beneficiaire), HttpStatus.OK); }
	 */

	@PostMapping("/addBeneficiaire")
	public ResponseEntity<?> addBeneficiaires(@RequestBody Beneficiaire beneficiaire) {

		// beneficiaire.setAct_status("NON ACTIF");
		Beneficiaire act = beneficiaireRepository.save(beneficiaire);
		if (act == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);

		return new ResponseEntity<>(beneficiaire, HttpStatus.OK);

	}

	@DeleteMapping(value = "/delete/{id}")
	public ResponseEntity<?> deleteRole(@PathVariable(value = "id") Long id) {
		beneficiaireRepository.deleteById(id);
		return new ResponseEntity<ResponseMessage>(new ResponseMessage("Beneficiaire deleted "), HttpStatus.OK);
	}

	/*
	 * Dev By MBALLO
	 * 
	 */
	@GetMapping(value = "/findBeneficiaireWithActeByPolice/{numpolice}")
	public ResponseEntity<?> findBeneficiaireWithActeByPolice(@PathVariable Long numpolice) {

		Beneficiaire beneficiaire = beneficiaireRepository.findBeneficiaireWithActeByPolice(numpolice);

		if (beneficiaire == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "Pas de beneficiaire", null),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "Voici le beneficiaire que vous recherchez", beneficiaire), HttpStatus.OK);
	}

	@GetMapping(value = "/findBeneficiaireByDenomination/{denomination}")
	public ResponseEntity<?> findBeneficiaireByDenomination(@PathVariable("denomination") String denomination) {

		List<Beneficiaire> beneficiairesDenom = beneficiaireRepository
				.findBeneficiaireByDenomination(denomination.toUpperCase());
		
		if (beneficiairesDenom.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("chao", "liste des bénéficiaires est vide !", beneficiairesDenom),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des bénéficiaires", beneficiairesDenom), HttpStatus.OK);
	}

	@GetMapping(value = "/findBeneficiaireByNomAndPrenom/{nom}/{prenom}")
	public ResponseEntity<?> findBeneficiaireByNomAndPrenom(@PathVariable("nom") String nom,
			@PathVariable("prenom") String prenom) {

		List<Beneficiaire> beneficiairesPrenomAndNom = beneficiaireRepository
				.findBeneficiaireByPrenomAndNom(nom.toUpperCase(), prenom.toUpperCase());
		
		if (beneficiairesPrenomAndNom.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("chao", "liste des bénéficiaires est vide !", beneficiairesPrenomAndNom),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des bénéficiaires", beneficiairesPrenomAndNom), HttpStatus.OK);
	}
}
