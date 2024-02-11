package sn.jmad.sonac.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.CodeAnnulationFact;
import sn.jmad.sonac.model.Facture;
import sn.jmad.sonac.repository.CodeAnnulationRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/codeannulation/*")

public class CodeAnnulationFactController {
	
	@Autowired
	CodeAnnulationRepository codeAnnulationRepository ;
	
	@GetMapping(value = "/allcodeannulation")
	public ResponseEntity<?>  getAllCodeAnnulation() {
		List<CodeAnnulationFact> codeAnnulations = codeAnnulationRepository.findAllCodeAnnulation() ;
		
		if(codeAnnulations.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste des codes annulations vide"), HttpStatus.OK) ;
		}
		
		return new ResponseEntity<List<CodeAnnulationFact>>(codeAnnulations, HttpStatus.OK) ;
	}
	@GetMapping(value = "/getAnnulation/{id}")
    public ResponseEntity<?> getFacture(@PathVariable(value = "id") Long id) {
	
	  Optional<CodeAnnulationFact> c = codeAnnulationRepository.findByNum(id);
	  
	  if(c.isPresent()) {
		  return new ResponseEntity<CodeAnnulationFact>(c.get(), HttpStatus.OK);
		    } else {
		        return new ResponseEntity<ResponseMessage>(new ResponseMessage("ce numero de Code Annulation facture n'existe pas "), HttpStatus.NOT_FOUND) ;
		    }   
	  }

}
