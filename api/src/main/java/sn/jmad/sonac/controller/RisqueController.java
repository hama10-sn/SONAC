package sn.jmad.sonac.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Risque;
import sn.jmad.sonac.repository.RisqueRepository;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/risque/*")
public class RisqueController {

	@Autowired
	private RisqueRepository risqueRepository;

	@GetMapping(value = "/allRisques")
	public ResponseEntity<?> getAllRisques() {
		List<Risque> risques = risqueRepository.allRisques("Actif");
		System.out.println("liste des risques : " + risques);
		if (risques == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);

		return new ResponseEntity<List<Risque>>(risques, HttpStatus.OK);
	}

	@PostMapping("/addRisque")
	public ResponseEntity<?> addRisque(@RequestBody Risque risque) {

		risque.setRisq_status("Actif");
		Risque gr = risqueRepository.save(risque);
		if (gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);

		return new ResponseEntity<>(risque, HttpStatus.OK);

	}

	@PutMapping("/editRisque")
	public ResponseEntity<?> editRisque(@RequestBody Risque risque) {
		Risque risqueUpdate = risqueRepository.findByIdd(risque.getRisq_numero());
		risque.setRisq_status("Actif");
		risque.setRisq_id(risqueUpdate.getRisq_id());
		Risque gr = risqueRepository.save(risque);
		if (gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);

		return new ResponseEntity<>(new ResponseMessage("risque modifié"), HttpStatus.OK);

	}

	/*
	 * @GetMapping("/delRisque/{code}") public ResponseEntity<?>
	 * delRisque(@PathVariable("code") Long code){
	 * 
	 * List<Filiale> filiales = filialeRepository.findbyRisque(code);
	 * List<Compagnie> compagnies = compagnieRepository.findbyRisque(code);
	 * if(filiales.isEmpty() && compagnies.isEmpty()) { Risque gr =
	 * risqueRepository.findbyCode(code); gr.setActive(0);
	 * risqueRepository.save(gr);
	 * 
	 * return new ResponseEntity<>(new ResponseMessage("risque supprimé"),
	 * HttpStatus.OK); }
	 * 
	 * 
	 * 
	 * return new ResponseEntity<>(new ResponseMessage("suppréssion impossible"),
	 * HttpStatus.INTERNAL_SERVER_ERROR);
	 * 
	 * }
	 */
	@DeleteMapping("/delete/{code}")
	public ResponseEntity<?> delCredit(@PathVariable("code") Long code) {

		risqueRepository.deleteById(code);
		return new ResponseEntity<>(new ResponseMessage("credit supprimé"), HttpStatus.OK);

	}

	@GetMapping(value = "/getRisquePolice/{numpol}")
	public ResponseEntity<?> getRisquePolice(@PathVariable("numpol") Long numpol) {
		Risque risque = risqueRepository.getRisquePolice(numpol);
		if (risque == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("ce risque n'existe pas "),
					HttpStatus.NOT_FOUND);

		return new ResponseEntity<Risque>(risque, HttpStatus.OK);
	}

	/*
	 * Mballo: Risque by id
	 */
	@GetMapping(value = "/risqueById/{id}")
	public ResponseEntity<?> getRisqueById(@PathVariable("id") Long id) {

		Risque risque = risqueRepository.findByIdd(id);
		if (risque == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "Ce risque n'existe pas !", risque),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "Le risque demandé", risque), HttpStatus.OK);
	}

}
