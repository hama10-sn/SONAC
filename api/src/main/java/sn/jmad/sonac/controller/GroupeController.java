package sn.jmad.sonac.controller;

import java.util.List;

import javax.validation.Valid;

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
import sn.jmad.sonac.model.Compagnie;
import sn.jmad.sonac.model.Filiale;
import sn.jmad.sonac.model.Groupe;
import sn.jmad.sonac.repository.CompagnieRepository;
import sn.jmad.sonac.repository.FilialeRepository;
import sn.jmad.sonac.repository.GroupeRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/groupe/*")
public class GroupeController {
	
	@Autowired
	private GroupeRepository groupeRepository;
	
	@Autowired
    private FilialeRepository filialeRepository;
	
	@Autowired
	private CompagnieRepository compagnieRepository;
	
	
	@GetMapping(value = "/allGroupes")
    public ResponseEntity<?> getAllGroupes() {
        List<Groupe> groupes = groupeRepository.allgroupes();
        System.out.println("liste des groupes : " + groupes);
        if (groupes==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.FOUND);
        
        
        return new ResponseEntity<List<Groupe>>(groupes, HttpStatus.OK);
    }
	
	@PostMapping("/addGroupe")
	public ResponseEntity<?> addGroupe( @RequestBody Groupe groupe){
		
		Groupe grExist = groupeRepository.findbyCode(groupe.getGroup_code());
		if(grExist != null) {
			return new ResponseEntity<>(new ResponseMessage("Ce code groupe existe deja !"),
					HttpStatus.BAD_REQUEST);
		}
		
		groupe.setActive(1);
		Groupe gr = groupeRepository.save(groupe);
		if(gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("groupe enregistré"),
				HttpStatus.OK);
		
	}
	
	@PutMapping("/editGroupe")
	public ResponseEntity<?> editGroupe( @RequestBody Groupe groupe){
		Groupe groupeUpdate = groupeRepository.findbyCode(groupe.getGroup_code());
		groupe.setActive(1);
		groupe.setGroup_id(groupeUpdate.getGroup_id());
		Groupe gr = groupeRepository.save(groupe);
		if(gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("groupe modifié"),
				HttpStatus.OK);
		
	}
	@GetMapping("/delGroupe/{code}")
	public ResponseEntity<?> delGroupe(@PathVariable("code") Long code){
		
		List<Filiale> filiales = filialeRepository.findbyGroupe(code);
		List<Compagnie> compagnies = compagnieRepository.findbyGroupe(code);
		if(filiales.isEmpty() && compagnies.isEmpty()) {
			Groupe gr = groupeRepository.findbyCode(code);
			gr.setActive(0);
			groupeRepository.save(gr);
			
			return new ResponseEntity<>(new ResponseMessage("groupe supprimé"),
					HttpStatus.OK);
		}
		
		
		
		return new ResponseEntity<>(new ResponseMessage("suppréssion impossible"),
				HttpStatus.INTERNAL_SERVER_ERROR);

	}
	@GetMapping("/verifDdelGroupe/{code}")
	public ResponseEntity<?> verifdelGroupe(@PathVariable("code") Long code){
		
		List<Filiale> filiales = filialeRepository.findbyGroupe(code);
		List<Compagnie> compagnies = compagnieRepository.findbyGroupe(code);
		if(filiales.isEmpty() && compagnies.isEmpty()) {
			
			
			return new ResponseEntity<>(new ResponseMessage("ok"),
					HttpStatus.OK);
		}
		
		
		
		return new ResponseEntity<>(new ResponseMessage("Suppression impossible car ce groupe est relié à des filiales ou à des compagnies"),
				HttpStatus.INTERNAL_SERVER_ERROR);

	}
   

}
