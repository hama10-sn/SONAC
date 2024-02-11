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
import sn.jmad.sonac.model.Caution;
import sn.jmad.sonac.repository.CautionRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/caution/*")
public class CautionController {
	
	@Autowired
	private CautionRepository cautionRepository;
	
	
	@GetMapping(value = "/allCautions")
    public ResponseEntity<?> getAllCautions() {
        List<Caution> cautions = cautionRepository.findAll();
        System.out.println("liste des cautions : " + cautions);
        if (cautions==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
        
        
        return new ResponseEntity<List<Caution>>(cautions, HttpStatus.OK);
    }
	
	@PostMapping("/addCaution")
	public ResponseEntity<?> addCaution( @RequestBody Caution caution){
		
		Caution gr = cautionRepository.save(caution);
		if(gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(caution,
				HttpStatus.OK);
		
	}
	
/*	@PutMapping("/editCaution")
	public ResponseEntity<?> editCaution( @RequestBody Caution caution){
		Caution cautionUpdate = cautionRepository.findByIdd(caution.getRisq_numero());
		caution.setRisq_status("Actif");
		caution.setRisq_id(cautionUpdate.getRisq_id());
		Caution gr = cautionRepository.save(caution);
		if(gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("caution modifié"),
				HttpStatus.OK);
		
	}*/

	@DeleteMapping("/delete/{code}")
	public ResponseEntity<?> delCredit(@PathVariable("code") Long code){
		
		
		cautionRepository.deleteById(code);
			return new ResponseEntity<>(new ResponseMessage("credit supprimé"),
					HttpStatus.OK);		

	}

}
