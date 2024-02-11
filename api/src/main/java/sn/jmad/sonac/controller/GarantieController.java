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
import sn.jmad.sonac.model.Garantie;
import sn.jmad.sonac.repository.GarantieRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/garantie/*")
public class GarantieController {
	
	@Autowired
	private GarantieRepository garantieRepository;
	
	@GetMapping(value = "/allGaranties")
    public ResponseEntity<?> getAllGaranties() {
        List<Garantie> garanties = garantieRepository.allGaranties();
        //System.out.println("liste des garanties : " + garanties);
        if (garanties.isEmpty())
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
        
        
        return new ResponseEntity<List<Garantie>>(garanties, HttpStatus.OK);
    }
	
	@PostMapping("/addGarantie")
	public ResponseEntity<?> addGarantie( @RequestBody Garantie garantie){
		
		
		garantie.setGara_status("Actif");
		Garantie g = garantieRepository.save(garantie);
		if(g == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("garantie enregistré"),
				HttpStatus.OK);
		
	}
	@PutMapping("/editGarantie")
	public ResponseEntity<?> editGarantie( @RequestBody Garantie garantie){
		Garantie garantieUpdate = garantieRepository.findByIdd(garantie.getGara_num());
		//garantie.setGara_status("Actif");
		garantie.setGara_id(garantieUpdate.getGara_id());
		Garantie g = garantieRepository.save(garantie);
		if(g == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("garantie modifié"),
				HttpStatus.OK);
		
	}

}
