package sn.jmad.sonac.controller;

import java.util.List;
import java.util.Optional;

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
import sn.jmad.sonac.model.Beneficiaire;
import sn.jmad.sonac.model.Marche;
import sn.jmad.sonac.repository.MarcheRepository;
@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/marche/*")
public class MarcheController {
	@Autowired
	private MarcheRepository marcheRepository;
	
	
	@GetMapping(value = "/allMarche")
    public ResponseEntity<?> getAllLots() {
        List<Marche> marches = marcheRepository.allMarches();
        System.out.println("liste des marches : " + marches);
        if (marches==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.FOUND);
        
        
        return new ResponseEntity<List<Marche>>(marches, HttpStatus.OK);
    }
	
	@PostMapping("/addMarche")
	public ResponseEntity<?> addMarche( @RequestBody Marche marche){
		
		Marche marchExist = marcheRepository.findbyCode(marche.getMarch_id());
		if(marchExist != null) {
			return new ResponseEntity<>(new ResponseMessage("Ce code marche existe deja !"),
					HttpStatus.BAD_REQUEST);
		}
		
		//acte.setActive(1);
		Marche march = marcheRepository.save(marche);
		if(march == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(marche,
				HttpStatus.OK);
		
	}
	
	@PutMapping("/editMarche")
	public ResponseEntity<?> editMarche( @RequestBody Marche marche){
		Marche marchUpdate =marcheRepository.findbyCode(marche.getMarch_numero());
		//acte.setActive(1);
		marche.setMarch_id(marchUpdate.getMarch_id());
		Marche march = marcheRepository.save(marche);
		if(march == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("marche modifié"),
				HttpStatus.OK);
		
	}
	/*
	@GetMapping("/delClauseActe/{code}")
	public ResponseEntity<?> delActe(@PathVariable("code") Long code){
		
		

	}*/
	//pour police
	@DeleteMapping("/delete/{code}")
	public ResponseEntity<?> delMarche(@PathVariable("code") Long code){
		
		
		marcheRepository.deleteById(code);
			return new ResponseEntity<>(new ResponseMessage("marché supprimé"),
					HttpStatus.OK);		

	}
	@GetMapping(value = "/GetMarches/{numbenef}")
	public ResponseEntity<?> gettMarche(@PathVariable(name = "numbenef") Long nuMarche) {
		Optional<Marche> marche = marcheRepository.findById(nuMarche);
		if (!marche.isPresent())
			return new ResponseEntity<Marche>(new Marche(), HttpStatus.OK);

		return new ResponseEntity<Marche>(marche.get(), HttpStatus.OK);
	}

}
