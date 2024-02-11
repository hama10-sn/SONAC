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
import sn.jmad.sonac.model.Credit;
import sn.jmad.sonac.model.Risque_locatif;
import sn.jmad.sonac.repository.Risque_locatifRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/risque_locatif/*")
public class Risque_locatifController {
	
	@Autowired
	private Risque_locatifRepository risque_locatifRepository;
	
	
	@GetMapping(value = "/allRisque_locatifs")
    public ResponseEntity<?> getAllRisque_locatifs() {
        List<Risque_locatif> risque_locatifs = risque_locatifRepository.allRisque_locatifs();
        System.out.println("liste des risque_locatifs : " + risque_locatifs);
        if (risque_locatifs==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
        
        
        return new ResponseEntity<List<Risque_locatif>>(risque_locatifs, HttpStatus.OK);
    }
	
	@PostMapping("/addRisque_locatif")
	public ResponseEntity<?> addRisque_locatif( @RequestBody Risque_locatif risque_locatif){
		
		
		Risque_locatif gr = risque_locatifRepository.save(risque_locatif);
		if(gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(risque_locatif,
				HttpStatus.OK);
		
	}
	
	@PutMapping("/editRisque_locatif")
	public ResponseEntity<?> editRisque_locatif( @RequestBody Risque_locatif risque_locatif){
		Risque_locatif risque_locatifUpdate = risque_locatifRepository.findByIdd(risque_locatif.getRiskl_numero());
		risque_locatif.setRiskl_id(risque_locatifUpdate.getRiskl_id());
		Risque_locatif gr = risque_locatifRepository.save(risque_locatif);
		if(gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("risque_locatif modifié"),
				HttpStatus.OK);
		
	}
	@DeleteMapping("/delete/{code}")
	public ResponseEntity<?> delRisque_locatif(@PathVariable("code") Long code){
		
		
		    risque_locatifRepository.deleteById(code);
			return new ResponseEntity<>(new ResponseMessage("risque_locatif supprimé"),
					HttpStatus.OK);		

	}
	
	@GetMapping(value = "/findRisqueLocatifByClientAndAcheteur/{client}/{acheteur}")
	public ResponseEntity<?> getRisqueLocatifByClientAndAcheteur(@PathVariable("client") Long client,
			@PathVariable("acheteur") Long acheteur) {

		List<Risque_locatif> risque_locatifs = risque_locatifRepository.findRisqueLocatifByClientAndAcheteur(client, acheteur);
		if (risque_locatifs.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "liste des risques locatifs vide !", null),
					HttpStatus.OK);
		}

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "liste des risques locatifs !", risque_locatifs),
				HttpStatus.OK);
	}
	
	@GetMapping(value = "/findRisqueLocatifByClientAndPoliceAndAcheteur/{client}/{police}/{acheteur}")
	public ResponseEntity<?> getRisqueLocatifByClientAndPoliceAndAcheteur(@PathVariable("client") Long client,
			@PathVariable("police") Long police,
			@PathVariable("acheteur") Long acheteur) {

		List<Risque_locatif> risque_locatifs = risque_locatifRepository.findRisqueLocatifByClientAndPoliceAndAcheteur(client, police, acheteur);
		if (risque_locatifs.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "liste des risques locatifs vide !", null),
					HttpStatus.OK);
		}

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "liste des risques locatifs !", risque_locatifs),
				HttpStatus.OK);
	}
	
	@GetMapping(value = "/findRisqueLocatifById/{id}")
	public ResponseEntity<?> getRisqueLocatifById(@PathVariable("id") Long id) {

		Risque_locatif risque_locatif = risque_locatifRepository.findByIdd(id);
		if (risque_locatif == null) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "Ce risque locatif n'existe pas !", null),
					HttpStatus.OK);
		}

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "résultat risque locatif !", risque_locatif),
				HttpStatus.OK);
	}
  

}
