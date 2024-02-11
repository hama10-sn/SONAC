package sn.jmad.sonac.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Avenant;
import sn.jmad.sonac.repository.AvenantRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/avenant/*")
public class AvenantController {
	
	@Autowired
	private AvenantRepository avenantRepository;
	
	
	@GetMapping(value = "/allAvenants")
    public ResponseEntity<?> getAllAvenants() {
        List<Avenant> avenants = avenantRepository.allAvenants("A");
        System.out.println("liste des avenants : " + avenants);
        if (avenants==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
        
        
        return new ResponseEntity<List<Avenant>>(avenants, HttpStatus.OK);
    }
	
	@PostMapping("/addAvenant")
	public ResponseEntity<?> addAvenant( @RequestBody Avenant avenant){
		
		
		avenant.setAven_statut("Actif");
		Avenant gr = avenantRepository.save(avenant);
		if(gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(avenant,
				HttpStatus.OK);
		
	}
	
	@PutMapping("/editAvenant")
	public ResponseEntity<?> editAvenant( @RequestBody Avenant avenant){
		Avenant avenantUpdate = avenantRepository.findByIdd(avenant.getAven_numeroavenant());
		avenant.setAven_statut("Actif");
		avenant.setAven_id(avenantUpdate.getAven_id());
		Avenant gr = avenantRepository.save(avenant);
		if(gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("avenant modifié"),
				HttpStatus.OK);
		
	}
/*	@GetMapping("/delAvenant/{code}")
	public ResponseEntity<?> delAvenant(@PathVariable("code") Long code){
		
		List<Filiale> filiales = filialeRepository.findbyAvenant(code);
		List<Compagnie> compagnies = compagnieRepository.findbyAvenant(code);
		if(filiales.isEmpty() && compagnies.isEmpty()) {
			Avenant gr = avenantRepository.findbyCode(code);
			gr.setActive(0);
			avenantRepository.save(gr);
			
			return new ResponseEntity<>(new ResponseMessage("avenant supprimé"),
					HttpStatus.OK);
		}
		
		
		
		return new ResponseEntity<>(new ResponseMessage("suppréssion impossible"),
				HttpStatus.INTERNAL_SERVER_ERROR);

	}*/
  

}
