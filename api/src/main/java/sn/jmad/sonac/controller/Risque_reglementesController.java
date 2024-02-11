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
import sn.jmad.sonac.model.Risque_reglementes;
import sn.jmad.sonac.repository.Risque_reglementesRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/risque_reglemente/*")
public class Risque_reglementesController {
	
	@Autowired
	private Risque_reglementesRepository risque_reglementeRepository;
	
	
	@GetMapping(value = "/allRisque_reglementes")
    public ResponseEntity<?> getAllRisque_reglementes() {
        List<Risque_reglementes> risque_reglementes = risque_reglementeRepository.allRisque_reglementes();
      //  System.out.println("liste des risque_reglementes : " + risque_reglementes);
        if (risque_reglementes==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
        
        
        return new ResponseEntity<List<Risque_reglementes>>(risque_reglementes, HttpStatus.OK);
    }
	
	@PostMapping("/addRisque_reglementes")
	public ResponseEntity<?> addRisque_reglementes( @RequestBody Risque_reglementes risque_reglemente){
		
		
		Risque_reglementes gr = risque_reglementeRepository.save(risque_reglemente);
		if(gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(risque_reglemente,
				HttpStatus.OK);
		
	}
	
	@PutMapping("/editRisque_reglementes")
	public ResponseEntity<?> editRisque_reglementes( @RequestBody Risque_reglementes risque_reglemente){
		Risque_reglementes risque_reglementeUpdate = risque_reglementeRepository.findByIdd(risque_reglemente.getRiskr_numero());
		risque_reglemente.setRiskr_id(risque_reglementeUpdate.getRiskr_id());
		Risque_reglementes gr = risque_reglementeRepository.save(risque_reglemente);
		if(gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("risque_reglemente modifié"),
				HttpStatus.OK);
		
	}
	@DeleteMapping("/delete/{code}")
	public ResponseEntity<?> delRisque_reglementes(@PathVariable("code") Long code){
		
		
		    risque_reglementeRepository.deleteById(code);
			return new ResponseEntity<>(new ResponseMessage("risque_reglemente supprimé"),
					HttpStatus.OK);		

	}
  

}
