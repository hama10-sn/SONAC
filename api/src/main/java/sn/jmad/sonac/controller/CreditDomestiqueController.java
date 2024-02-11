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
//import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.CreditDomestique;
import sn.jmad.sonac.repository.CreditDomestiqueRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/creditDomestique/*")
public class CreditDomestiqueController {
	
	@Autowired
	private CreditDomestiqueRepository creditDomestiqueRepository;
	
	
	@GetMapping(value = "/allCreditDomestiques")
    public ResponseEntity<?> getAllCreditDomestiques() {
        List<CreditDomestique> creditDomestiques = creditDomestiqueRepository.findAll();
        System.out.println("liste des creditDomestiques : " + creditDomestiques);
        if (creditDomestiques==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
        
        
        return new ResponseEntity<List<CreditDomestique>>(creditDomestiques, HttpStatus.OK);
    }
	
	@PostMapping("/addCreditDomestique")
	public ResponseEntity<?> addCreditDomestique( @RequestBody CreditDomestique creditDomestique){
		
		CreditDomestique gr = creditDomestiqueRepository.save(creditDomestique);
		if(gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(creditDomestique,
				HttpStatus.OK);
		
	}
	
/*	@PutMapping("/editCreditDomestique")
	public ResponseEntity<?> editCreditDomestique( @RequestBody CreditDomestique creditDomestique){
		CreditDomestique creditDomestiqueUpdate = creditDomestiqueRepository.findByIdd(creditDomestique.getRisq_numero());
		creditDomestique.setRisq_status("Actif");
		creditDomestique.setRisq_id(creditDomestiqueUpdate.getRisq_id());
		CreditDomestique gr = creditDomestiqueRepository.save(creditDomestique);
		if(gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("creditDomestique modifié"),
				HttpStatus.OK);
		
	}*/

	@DeleteMapping("/delete/{code}")
	public ResponseEntity<?> delCredit(@PathVariable("code") Long code){
		
		
		creditDomestiqueRepository.deleteById(code);
			return new ResponseEntity<>(new ResponseMessage("credit supprimé"),
					HttpStatus.OK);		

	}

}
