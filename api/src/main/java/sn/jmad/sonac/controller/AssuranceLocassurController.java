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
import sn.jmad.sonac.model.AssuranceLocassur;
import sn.jmad.sonac.repository.AssuranceLocassurRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/assuranceLocassur/*")
public class AssuranceLocassurController {
	
	@Autowired
	private AssuranceLocassurRepository assuranceLocassurRepository;
	
	
	@GetMapping(value = "/allAssuranceLocassurs")
    public ResponseEntity<?> getAllAssuranceLocassurs() {
        List<AssuranceLocassur> assuranceLocassurs = assuranceLocassurRepository.findAll();
        System.out.println("liste des assuranceLocassurs : " + assuranceLocassurs);
        if (assuranceLocassurs==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
        
        
        return new ResponseEntity<List<AssuranceLocassur>>(assuranceLocassurs, HttpStatus.OK);
    }
	
	@PostMapping("/addAssuranceLocassur")
	public ResponseEntity<?> addAssuranceLocassur( @RequestBody AssuranceLocassur assuranceLocassur){
		
		AssuranceLocassur gr = assuranceLocassurRepository.save(assuranceLocassur);
		if(gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(assuranceLocassur,
				HttpStatus.OK);
		
	}
	
/*	@PutMapping("/editAssuranceLocassur")
	public ResponseEntity<?> editAssuranceLocassur( @RequestBody AssuranceLocassur assuranceLocassur){
		AssuranceLocassur assuranceLocassurUpdate = assuranceLocassurRepository.findByIdd(assuranceLocassur.getRisq_numero());
		assuranceLocassur.setRisq_status("Actif");
		assuranceLocassur.setRisq_id(assuranceLocassurUpdate.getRisq_id());
		AssuranceLocassur gr = assuranceLocassurRepository.save(assuranceLocassur);
		if(gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("assuranceLocassur modifié"),
				HttpStatus.OK);
		
	}*/

	@DeleteMapping("/delete/{code}")
	public ResponseEntity<?> delCredit(@PathVariable("code") Long code){
		
		
		assuranceLocassurRepository.deleteById(code);
			return new ResponseEntity<>(new ResponseMessage("credit supprimé"),
					HttpStatus.OK);		

	}

}
