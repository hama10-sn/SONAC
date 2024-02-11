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
import sn.jmad.sonac.model.Lot;
import sn.jmad.sonac.repository.LotRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/lot/*")
public class LotController {
	@Autowired
	private LotRepository lotRepository;
	
	
	@GetMapping(value = "/allLot")
    public ResponseEntity<?> getAllLots() {
        List<Lot> lots = lotRepository.allLots();
        System.out.println("liste des lot : " + lots);
        if (lots==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.FOUND);
        
        
        return new ResponseEntity<List<Lot>>(lots, HttpStatus.OK);
    }
	
	@PostMapping("/addLot")
	public ResponseEntity<?> addLot( @RequestBody Lot lot){
		Long numLot;
		Lot lotExist = lotRepository.findbyCode(lot.getLot_numero());
		if(lotExist != null) {
			return new ResponseEntity<>(new ResponseMessage("Ce code lot existe deja !"),
					HttpStatus.BAD_REQUEST);
		}
		
		//acte.setActive(1);
		Lot lo = lotRepository.save(lot);
		numLot= lot.getLot_numero();
		if(lo == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(lot,
				HttpStatus.OK);
		
	}
	
	@PutMapping("/editLot")
	public ResponseEntity<?> editClauseLot( @RequestBody Lot lot){
		Lot lotUpdate =lotRepository.findbyCode(lot.getLot_numero());
		//acte.setActive(1);
		lot.setLot_id(lotUpdate.getLot_id());
		Lot lo = lotRepository.save(lot);
		if(lo == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("Lot modifié"),
				HttpStatus.OK);
		
	}
	/*
	@GetMapping("/delClauseActe/{code}")
	public ResponseEntity<?> delActe(@PathVariable("code") Long code){
		
		

	}*/
}
