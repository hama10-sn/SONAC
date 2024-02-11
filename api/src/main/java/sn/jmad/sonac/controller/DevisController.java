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
import sn.jmad.sonac.model.Devis;
import sn.jmad.sonac.repository.DevisRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/devis/*")
public class DevisController {
	
	@Autowired
	private DevisRepository devisRepository;
	
	
	@GetMapping(value = "/allDevis")
    public ResponseEntity<?> getAllDevis() {
        List<Devis> devis = devisRepository.allDevis();
        if (devis==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.FOUND);
        
        
        return new ResponseEntity<List<Devis>>(devis, HttpStatus.OK);
    }
	
	@PostMapping("/addDevis")
	public ResponseEntity<?> addDevis( @RequestBody Devis devis){
		
		devis.setActive(1);
		Devis dv = devisRepository.save(devis);
		
		if(dv == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("devis enregistré"),
				HttpStatus.OK);
		
	}
	
	@PutMapping("/editDevis")
	public ResponseEntity<?> editDevis( @RequestBody Devis devis){
		Devis devisUpdate = devisRepository.findbyNumero(devis.getDevis_numero());
		devis.setActive(1);
		if(devisUpdate == null) {
			return new ResponseEntity<>(new ResponseMessage("Ce devis n'existe pas"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
		devis.setDevis_id(devisUpdate.getDevis_id());

		Devis dv = devisRepository.save(devis);
		if(dv == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("devis modifié"),
				HttpStatus.OK);
		
	}
	
	@GetMapping("/delDevis/{numero}")
	public ResponseEntity<?> delDevis(@PathVariable("numero") int numero){
		
		Devis devisSupp = devisRepository.findbyNumero(numero);
		devisSupp.setActive(0);
		devisRepository.save(devisSupp);
		return new ResponseEntity<>(new ResponseMessage("devis supprimé"),
				HttpStatus.OK);
		
	}
	
	@GetMapping(value = "/getDevisByClient/{numero}")
    public ResponseEntity<?> getDevisByClient(@PathVariable("numero") int numero) {
        List<Devis> devis = devisRepository.allDevisByClient(numero);
        if (devis==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.FOUND);
        
        
        return new ResponseEntity<List<Devis>>(devis, HttpStatus.OK);
    }
	
	

}
