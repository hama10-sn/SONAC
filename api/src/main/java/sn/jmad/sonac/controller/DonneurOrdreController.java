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
import sn.jmad.sonac.model.DonneurOrdre;
import sn.jmad.sonac.repository.DonneurOrdreRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/donneurOrdre/*")
public class DonneurOrdreController {
	@Autowired
	private DonneurOrdreRepository donneurOrdreRepository;
	
	
	@GetMapping(value = "/allDonneurOrdres")
    public ResponseEntity<?> getAllDonneurOrdres() {
        List<DonneurOrdre> donneurOrdres = donneurOrdreRepository.allDonneurOrdres();
      System.out.println("liste des actes : " + donneurOrdres);
        if (donneurOrdres==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.FOUND);
        
        
        return new ResponseEntity<List<DonneurOrdre>>(donneurOrdres, HttpStatus.OK);
    }
	
	@PostMapping("/addDonneurOrdre")
	public ResponseEntity<?> addActes( @RequestBody DonneurOrdre donneurOrdre){
		Long numDordr;
		DonneurOrdre donneurOrdreExist = donneurOrdreRepository.findbyCode(donneurOrdre.getDordr_numerodordr());
		if(donneurOrdreExist != null) {
			return new ResponseEntity<>(new ResponseMessage("Ce code donneur d'ordre existe deja !"),
					HttpStatus.BAD_REQUEST);
		}
		
		//acte.setAct_status("NON ACTIF");
		DonneurOrdre drdre = donneurOrdreRepository.save(donneurOrdre);
		numDordr= donneurOrdre.getDordr_numerodordr();
		if(drdre == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("donneur Ordre"+ numDordr +" enregistré"),
				HttpStatus.OK);
		
	}
	
	@PutMapping("/editDonneurOrdre")
	public ResponseEntity<?> editActe( @RequestBody DonneurOrdre donneurOrdre){
		Long numAct;
		DonneurOrdre donneurOrdreUpdate =donneurOrdreRepository.findbyCode(donneurOrdre.getDordr_numerodordr());
		//acte.setActive(1);
		donneurOrdre.setDordr_id(donneurOrdreUpdate.getDordr_id());
		DonneurOrdre dordr = donneurOrdreRepository.save(donneurOrdre);
		numAct=donneurOrdre.getDordr_numerodordr();
		if(dordr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("Donneur d'ordre"+ numAct +" modifié"),
				HttpStatus.OK);
		
	}
	/*
	@GetMapping("/delDonneurOrdre/{code}")
	public ResponseEntity<?> delDonneurOrdre(@PathVariable("code") Long code){
		
		

	}*/
}
