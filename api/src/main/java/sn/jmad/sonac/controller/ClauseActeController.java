package sn.jmad.sonac.controller;

import java.util.List;

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

import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Acte;
import sn.jmad.sonac.model.ClauseActe;
import sn.jmad.sonac.model.Encaissement;
import sn.jmad.sonac.repository.ClauseActeRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/clauseActe/*")
public class ClauseActeController {

	@Autowired
	private ClauseActeRepository clauseActeRepository;
	
	
	@GetMapping(value = "/allClauseActes")
    public ResponseEntity<?> getAllClauseActes() {
        List<ClauseActe> clauses = clauseActeRepository.allClauseActes();
        System.out.println("liste des Clause acte : " + clauses);
        if (clauses==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.FOUND);
        
        
        return new ResponseEntity<List<ClauseActe>>(clauses, HttpStatus.OK);
    }
	/*
	@PostMapping("/addClauseActe")
	public ResponseEntity<?> addClauseActes( @RequestBody List<ClauseActe> clauseActe){
		System.out.println(clauseActe);
		for(ClauseActe cl : clauseActe) {
		
		
		//acte.setActive(1);
		ClauseActe act = clauseActeRepository.save(cl);
		
		
		}
		return new ResponseEntity<>(new ResponseMessage("Clause acte enregistré"),
				HttpStatus.OK);
		
	}*/
	@PostMapping("/addClauseActe")
	public ResponseEntity<?> addAffecter( @RequestBody ClauseActe clActe){
		Long numclausActe;
		Long numActe;
		ClauseActe actExist = clauseActeRepository.findbyCode(clActe.getClact_id());
		if(actExist != null) {
			return new ResponseEntity<>(new ResponseMessage("Ce code clause acte existe deja !"),
					HttpStatus.BAD_REQUEST);
		}
		//clActe.setAct_status("en cours");
		//acte.setAct_status("NON ACTIF");
		ClauseActe clAct = clauseActeRepository.save(clActe); 
		numclausActe = clActe.getClact_numeroclause();
		numActe = clActe.getClact_numeroacte();
		if(clAct == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		

		return new ResponseEntity<>(new ResponseMessage("Clause "+ numclausActe +" affectée a l'acte "+ numActe ),
				HttpStatus.OK);

		
	}
	@PutMapping("/editClauseActe")
	public ResponseEntity<?> editClauseActe( @RequestBody ClauseActe clauseActe){
		ClauseActe acteUpdate =clauseActeRepository.findbyCode(clauseActe.getClact_id());
		//acte.setActive(1);
		clauseActe.setClact_id(acteUpdate.getClact_id());
		ClauseActe act = clauseActeRepository.save(clauseActe);
		if(act == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("Clause acte modifié"),
				HttpStatus.OK);
		
	}
	@GetMapping(value = "/getClauseActeByActe/{numacte}")
    public ResponseEntity<?> getClauseActeByActe(@PathVariable(value = "numacte") Long numacte) {
		ClauseActe acte = clauseActeRepository.getClauseActeByActe(numacte);
        
        if (acte==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("cette ClauseActe n'existe pas "), HttpStatus.FOUND);
        
        
        return new ResponseEntity<ClauseActe>(acte, HttpStatus.OK);
    }
}
