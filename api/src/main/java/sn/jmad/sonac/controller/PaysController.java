package sn.jmad.sonac.controller;


import sn.jmad.sonac.model.Pays;


import sn.jmad.sonac.repository.PaysRepository;

import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import sn.jmad.sonac.message.response.ResponseMessage;





@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/pays/*")
public class PaysController {
	  
	    

	    
	  @Autowired
			PaysRepository paysRepository;
		    
	  /*
	   * cette methode nous permet d'ajouter un pays
	   *
	   */
			  @PostMapping("/addPays")

			  public ResponseEntity<?> savePay(@Valid @RequestBody Pays pays /* Integer id/*, BindingResult br*/) {
 
				  Optional<Pays> p = paysRepository.findById(pays.getPays_code());
				  if(!p.isPresent()) {
			        	          
					  paysRepository.save(pays);
			            return new ResponseEntity<ResponseMessage>(new ResponseMessage("Pays enregistré"), HttpStatus.OK) ;
			        } else {
			            return new ResponseEntity<ResponseMessage>(new ResponseMessage("Pays existe déja"), HttpStatus.NOT_FOUND) ;
			        }
			  }
			  @GetMapping(value = "/libelle/{pays_code}")
			    public ResponseEntity<?> getLibelleByCode(@PathVariable("pays_code") Long pays_code) {
				  String pays = paysRepository.findByCode(pays_code);
			        System.out.println("libelle : " + pays);
			        if (pays==null)
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage(" vide "), HttpStatus.OK);
			         
			        
			        return new ResponseEntity<ResponseMessage>(new ResponseMessage (pays), HttpStatus.OK);
			    }
			  
			  /*
			   * cette methode nous permet de lister les pays
			   *
			    */
			  
			  @GetMapping(value = "/allPays")
			    public ResponseEntity<?> getAllPays() {
			        List<Pays> pays = paysRepository.findAllPays();
			        System.out.println("liste des pays : " + pays);
			        if (pays==null)
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);
			         
			        
			        return new ResponseEntity<List<Pays>>(pays, HttpStatus.OK);
			    }
			  
			  /*
			   * cette methode nous permet de modifier un pays
			   *
			   */
			  
			  @PutMapping(value = "/update")
			    public ResponseEntity<?> updatePays( @RequestBody Pays pays) {
			       
			        Optional<Pays> p = paysRepository.findById(pays.getPays_code());
			        Optional<Pays> l = paysRepository.findByLibelle(pays.getPays_libellelong());
			        if(p.isPresent() || l.isPresent()) {
			        	Pays currentPays = p.get() ;
			        	currentPays.setPays_libellelong(pays.getPays_libellelong());
			        	currentPays.setPays_libellecourt(pays.getPays_libellecourt());
			        	currentPays.setPays_codecima(pays.getPays_codecima());
			        	currentPays.setPays_devise(pays.getPays_devise());
			        	currentPays.setPays_multidevise(pays.isPays_multidevise());
			        	currentPays.setPays_multillangue(pays.isPays_multillangue());
			        	currentPays.setPays_code(pays.getPays_code());
			        	currentPays.setPays_codeutilisateur(pays.getPays_codeutilisateur());	
			        	currentPays.setPays_datemodification(pays.getPays_datemodification());
			        	currentPays.setPays_nationalite(pays.getPays_nationalite());
			            paysRepository.save(currentPays) ;
			            return new ResponseEntity<ResponseMessage>(new ResponseMessage("Pays modifier avec succès"), HttpStatus.OK) ;
			        } else {
			            return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de la modification"), HttpStatus.NOT_FOUND) ;
			        }
			    }
/*
			  @GetMapping(value = "/findbyPays/{id}")
			    public ResponseEntity<?> getPays(@PathVariable(value = "id")Long pays_id) {
			        Pays pays = paysRepository.findByIdd(pays_id);

			        if (pays==null)
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("le pays n'existe pas"), HttpStatus.NOT_FOUND);


			        return new ResponseEntity<Pays>(pays, HttpStatus.OK);
			    }*/
		  
			  

}
