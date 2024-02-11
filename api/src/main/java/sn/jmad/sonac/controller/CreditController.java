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
import sn.jmad.sonac.model.Credit;
import sn.jmad.sonac.repository.CreditRepository;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/credit/*")
public class CreditController {

	@Autowired
	private CreditRepository creditRepository;

	@GetMapping(value = "/allCredits")
	public ResponseEntity<?> getAllCredits() {
		List<Credit> credits = creditRepository.allCredits();
		System.out.println("liste des credits : " + credits);
		if (credits == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);

		return new ResponseEntity<List<Credit>>(credits, HttpStatus.OK);
	}

	@PostMapping("/addCredit")
	public ResponseEntity<?> addCredit(@RequestBody Credit credit) {

		Credit gr = creditRepository.save(credit);
		if (gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);

		return new ResponseEntity<>(credit, HttpStatus.OK);

	}

	@PutMapping("/editCredit")
	public ResponseEntity<?> editCredit(@RequestBody Credit credit) {
		Credit creditUpdate = creditRepository.findByIdd(credit.getCredit_numero());
		credit.setCredit_id(creditUpdate.getCredit_id());
		Credit gr = creditRepository.save(credit);
		if (gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);

		return new ResponseEntity<>(new ResponseMessage("credit modifié"), HttpStatus.OK);

	}

	@DeleteMapping("/delete/{code}")
	public ResponseEntity<?> delCredit(@PathVariable("code") Long code) {

		creditRepository.deleteById(code);
		return new ResponseEntity<>(new ResponseMessage("credit supprimé"), HttpStatus.OK);

	}

	@GetMapping(value = "/findCreditByClientAndAcheteur/{client}/{acheteur}")
	public ResponseEntity<?> getCreditByClientAndAcheteur(@PathVariable("client") Long client,
			@PathVariable("acheteur") Long acheteur) {

		List<Credit> credits = creditRepository.findCreditByClientAndAcheteur(client, acheteur);
		if (credits.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "liste des crédit vide !", null),
					HttpStatus.OK);
		}

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "liste des crédits !", credits),
				HttpStatus.OK);
	}
	
	@GetMapping(value = "/findCreditById/{id}")
	public ResponseEntity<?> getCreditById(@PathVariable("id") Long id) {

		Credit credit = creditRepository.findByIdd(id);
		if (credit == null) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "Ce crédit n'existe pas !", credit),
					HttpStatus.OK);
		}

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "resultat crédit !", credit),
				HttpStatus.OK);
	}

}
