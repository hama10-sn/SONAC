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

import sn.jmad.sonac.message.response.PoliceClient;
import sn.jmad.sonac.message.response.PoliceProduit;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Acte;
import sn.jmad.sonac.model.Clause;
import sn.jmad.sonac.model.Engagement;
import sn.jmad.sonac.repository.ActeRepository;
import sn.jmad.sonac.repository.ClauseRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/clause/*")
public class ClauseController {

	@Autowired
	private ClauseRepository clauseRepository;
	@Autowired
	private ActeRepository acteRepository;
	
	
	@GetMapping(value = "/allClauses")
    public ResponseEntity<?> getAllClauseActes() {
        List<Clause> clauses = clauseRepository.allClauses();
        System.out.println("liste des Clause acte : " + clauses);
        if (clauses==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.FOUND);
        
        
        return new ResponseEntity<List<Clause>>(clauses, HttpStatus.OK);
    }
	
	@PostMapping("/addClause")
	public ResponseEntity<?> addClauseActes( @RequestBody Clause clause){
		Long numClause;
		Clause actExist = clauseRepository.findbyCode(clause.getCla_numeroclause());
		if(actExist != null) {
			return new ResponseEntity<>(new ResponseMessage("Ce code clause  existe deja !"),
					HttpStatus.BAD_REQUEST);
		}
		
		//acte.setActive(1);
		Clause act = clauseRepository.save(clause);
		numClause = clause.getCla_numeroclause();
		if(act == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("Clause " + numClause + " enregistré"),
				HttpStatus.OK);
		
	}
	
	@PutMapping("/editClause")
	public ResponseEntity<?> editClause( @RequestBody Clause clause){
		Clause acteUpdate =clauseRepository.findbyCode(clause.getCla_numeroclause());
		//acte.setActive(1);
		clause.setCla_id(acteUpdate.getCla_id());
		Clause act = clauseRepository.save(clause);
		if(act == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("Clause acte modifié"),
				HttpStatus.OK);
		
	}
	/*
	@GetMapping("/delClauseActe/{code}")
	public ResponseEntity<?> delActe(@PathVariable("code") Long code){
		
		

	}*/
	@GetMapping(value = "/AllClausesByActe/{id}")
	public ResponseEntity<?>  getAllClausesByActe(@PathVariable(value = "id") Long code) {
		List<Clause> act = acteRepository.allClausebyActe(code);
		
		if(act.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste des Clause vide"), HttpStatus.NOT_FOUND) ;
		}
		
		return new ResponseEntity<List<Clause>>(act, HttpStatus.OK) ;
	}
	@GetMapping(value = "/AllClausesByActeNoExiste/{id}")
	public ResponseEntity<?>  getAllByActeNoExiste(@PathVariable(value = "id") Long code) {
		List<Clause> act = acteRepository.allClauseNoActe(code);
		
		if(act.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste des Clause vide"), HttpStatus.NOT_FOUND) ;
		}
		
		return new ResponseEntity<List<Clause>>(act, HttpStatus.OK) ;
	}
	@GetMapping(value = "/findProduitByActe/{numPolice}")
	public ResponseEntity<?> getProduitByPolice(@PathVariable Long numPolice) {
		PoliceProduit produitbyActe = clauseRepository.findProduitByActe(numPolice);

		return new ResponseEntity<PoliceProduit>(produitbyActe, HttpStatus.OK);
	}
}
