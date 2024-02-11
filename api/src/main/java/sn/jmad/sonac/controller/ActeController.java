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
import sn.jmad.sonac.model.Acte;
import sn.jmad.sonac.model.Branche;
import sn.jmad.sonac.model.Clause;
import sn.jmad.sonac.model.Compagnie;
import sn.jmad.sonac.model.Encaissement;
import sn.jmad.sonac.model.Filiale;
import sn.jmad.sonac.model.Groupe;
import sn.jmad.sonac.repository.ActeRepository;
import sn.jmad.sonac.repository.CompagnieRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/acte/*")
public class ActeController {
	@Autowired
	private ActeRepository acteRepository;
	
	
	@GetMapping(value = "/allActes")
    public ResponseEntity<?> getAllActes() {
        List<Acte> actes = acteRepository.allActes();
        System.out.println("liste des actes : " + actes);
        if (actes==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.FOUND);
        
        
        return new ResponseEntity<List<Acte>>(actes, HttpStatus.OK);
    }
	
	@PostMapping("/addActe")
	public ResponseEntity<?> addActes( @RequestBody Acte acte){
		Long numAct;
		Acte actExist = acteRepository.findbyCode(acte.getAct_numero());
		if(actExist != null) {
			return new ResponseEntity<>(new ResponseMessage("Ce code acte existe deja !"),
					HttpStatus.BAD_REQUEST);
		}
		acte.setAct_status("en cours");
		//acte.setAct_status("NON ACTIF");
		Acte act = acteRepository.save(acte);
		System.out.println(acte);
		numAct = acte.getAct_numero();
		if(act == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		 
		

		return new ResponseEntity<>(acte,
				HttpStatus.OK);

		
	}
	
	@PutMapping("/editActe")
	public ResponseEntity<?> editActe( @RequestBody Acte acte){
		Acte acteUpdate =acteRepository.findbyCode(acte.getAct_numero());
		//acte.setActive(1);
		acte.setAct_id(acteUpdate.getAct_id());
		Acte act = acteRepository.save(acte);
		if(act == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("acte modifié"),
				HttpStatus.OK);
		
	}
	 @GetMapping(value = "/lastID/{police}")
	  public ResponseEntity<?> lastIdacte(@PathVariable("police") Long police) {
		  Integer lastid= acteRepository.lastIdgActe(police);
		  if (lastid==null) {
		  return new ResponseEntity<Integer>(0, HttpStatus.OK);
		  }
			  return new ResponseEntity<Integer>(lastid, HttpStatus.OK);	  
		  			  
	  }/*
	@PostMapping("/addclauseMultiple/{numacte}")
	public ResponseEntity<?> addactes(@RequestBody List<Clause> clause,@PathVariable(value = "numacte") Long numacte ){
		
		System.out.println(numacte);
		for(Clause cl : clause) {
			System.out.println(cl);
			
			Clause c = encaissementService.encaisserM(enc,montantTot);
			montantTot = Math.subtractExact(montantTot, e.getEncai_mtnpaye());
			System.out.println(montantTot);
			
		}
		
		
		return new ResponseEntity<>(new ResponseMessage("Encaissement "),
				HttpStatus.OK);
		
	}*/
	
	/*
	@GetMapping("/delActe/{code}")
	public ResponseEntity<?> delActe(@PathVariable("code") Long code){
		
		

	}*/
	@DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable(value = "id") Long id) {
	 acteRepository.deleteById(id);
	 return new ResponseEntity<ResponseMessage>(new ResponseMessage("Acte deleted "), HttpStatus.OK);
     }

	@GetMapping(value = "/findActeByNumero/{numero}")
	public ResponseEntity<?> getBranche(@PathVariable("numero") Long numero) {
		List<Acte> actes = acteRepository.findActeByNumero(numero) ;
		if(actes != null) {
			return new ResponseEntity<List<Acte>>(actes, HttpStatus.OK) ;
		}
		return new ResponseEntity<ResponseMessage>(new ResponseMessage("cette acte n'existe pas"), HttpStatus.OK) ;
	}

	
	@GetMapping(value = "/getActePolice/{numpol}")
    public ResponseEntity<?> getActePolice(@PathVariable(value = "numpol") Long numpol) {
        Acte acte = acteRepository.getActePolice(numpol);
        //System.out.println("liste des actes : " + actes);
        if (acte==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("cet acte n'existe pas "), HttpStatus.FOUND);
        
        
        return new ResponseEntity<Acte>(acte, HttpStatus.OK);
    }

}
