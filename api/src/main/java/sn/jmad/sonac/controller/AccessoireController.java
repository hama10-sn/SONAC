package sn.jmad.sonac.controller;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

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
import sn.jmad.sonac.model.Accessoire;
import sn.jmad.sonac.model.Client;
import sn.jmad.sonac.model.Taxe;
import sn.jmad.sonac.repository.AccessoireRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/accessoire/*")
public class AccessoireController {
	
	@Autowired
	private AccessoireRepository accessoireRepository ;
	
	@PostMapping(value = "/addaccessoire")
	public ResponseEntity<?> saveAccessoire(@Valid @RequestBody Accessoire accessoire) {
		
		//Date dateFinEffet = accessoire.getAcces_datepriseffet() ;
		//accessoire.setAcces_datefineffet(dateFinEffet);
		accessoire.setActive(1);
		Accessoire savedAccessoire = accessoireRepository.save(accessoire) ;
		if(savedAccessoire != null) {
			return new ResponseEntity<>(new ResponseMessage("Accessoire enregistré avec succès !"), HttpStatus.OK) ;
		}
		return new ResponseEntity<>(new ResponseMessage("Echec: Vérifier que l'accessoire n'existe pas déjà !"), HttpStatus.INTERNAL_SERVER_ERROR) ;
	}
	
	@GetMapping(value = "/allaccessoire")
	public ResponseEntity<?>  getAllAccessoires() {
		List<Accessoire> accessoires = accessoireRepository.findAllAccessoire() ;
		
		if(accessoires.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste des accessoires vide"), HttpStatus.OK) ;
		} else {
			return new ResponseEntity<List<Accessoire>>(accessoires, HttpStatus.OK) ;
		}
	}
	
	/**
	 * 
	 * @param numcategorie de la table catégorie et codeapporteur de la table intermediaire
	 * @return 0 ou le dernier code de l'accessoire
	 */
	@GetMapping(value = "/lastID/{numeroproduit}/{codeapporteur}")
	  public ResponseEntity<?> lastNumAccessoire(@PathVariable("numeroproduit") Long numeroproduit, 
			  									 @PathVariable("codeapporteur") Long codeapporteur) {
		
		  Long lastCodeAccessoire= accessoireRepository.lastNumAccessoire(numeroproduit, codeapporteur);
		  if (lastCodeAccessoire==null) {
			  return new ResponseEntity<Long>((long) 0, HttpStatus.OK);
		  }
			  return new ResponseEntity<Long>(lastCodeAccessoire, HttpStatus.OK);	  
	  }
	
	public static Date soustraireJour(Date date, int nbJour) { 
		  Calendar cal = Calendar.getInstance(); 
		  cal.setTime(date);
		  cal.add(Calendar.DAY_OF_MONTH, nbJour);
		  return cal.getTime();
		}
	
	@PutMapping(value = "/updateAccessoire/{id}")
	public ResponseEntity<?> updateAccessoire(@PathVariable(value = "id") Long id, @RequestBody Accessoire accessoire) {
		
		Long codeAccessoire ;
		Accessoire accessoireUpdate = accessoireRepository.findByIdd(id) ;
		if(accessoireUpdate == null) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("cet accessoire n'existe pas"), HttpStatus.INTERNAL_SERVER_ERROR);
		}
        
//		accessoireUpdate.setAcces_datefineffet(soustraireJour(accessoire.getAcces_datepriseffet(), -1));
//		Accessoire accessoiretoUpdated = accessoireRepository.save(accessoireUpdate);
		
		accessoire.setActive(1);
		//==================== On joute ces quelques lignes ==========================
		accessoire.setAcces_id(accessoireUpdate.getAcces_id());
		Accessoire accessoireUpdated = accessoireRepository.save(accessoire);
		codeAccessoire = accessoireUpdated.getAcces_code() ;
		
		// ===========================================================================
		
		return new ResponseEntity<ResponseMessage>(new ResponseMessage("accessoire "+ codeAccessoire + " modifié avec succès "), HttpStatus.OK);
//		return new ResponseEntity<ResponseMessage>(new ResponseMessage("accessoire modifié avec succès "+accessoiretoUpdated), HttpStatus.OK);
	}
	
	@DeleteMapping(value = "/deleteAccessoire/{num}")
    public ResponseEntity<?> deleteAccessoire(@PathVariable(value = "num") long num) {
		
		//List<Categorie> categories = categorieRepository.findbyBranche(num) ;
			
		Accessoire accessoire = accessoireRepository.findbyCode(num) ;
		if(accessoire != null) {
			accessoire.setActive(0);
			accessoireRepository.save(accessoire) ;
			return new ResponseEntity<>(new ResponseMessage("Accessoire supprimé"),
					HttpStatus.OK);
		}
		
		return new ResponseEntity<>(new ResponseMessage("Echec de la suppression de l'accessoire"),
				HttpStatus.INTERNAL_SERVER_ERROR);
     }
		
//		Optional<Accessoire> access = accessoireRepository.findById(accessoire.getAcces_code()) ;
//		if(access.isPresent()) {
//			Accessoire  currentAccessoire = access.get() ;

//			currentAccessoire.setAcces_codeapporteur(accessoire.getAcces_codeapporteur());
//			currentAccessoire.setAcces_codebranche(accessoire.getAcces_codebranche());
//			currentAccessoire.setAcces_codecategorie(accessoire.getAcces_codecategorie());
//			currentAccessoire.setAcces_codeproduit(accessoire.getAcces_codeproduit());
//			currentAccessoire.setAcces_compagnie(accessoire.getAcces_compagnie());
//			currentAccessoire.setAcces_datefineffet(accessoire.getAcces_datefineffet());
//			currentAccessoire.setAcces_datepriseffet(accessoire.getAcces_datepriseffet());
			
//			accessoireRepository.save(currentAccessoire) ;
//			//return new ResponseEntity<ResponseMessage>(new ResponseMessage("Branche modifiée avec succès"), HttpStatus.OK) ;
//			return new ResponseEntity<Accessoire>(currentAccessoire, HttpStatus.OK) ;
//		} else {
//			return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de la modification"), HttpStatus.NOT_FOUND) ;
//		}
//	}
	
//	@GetMapping(value = "/findByNumero/{numero}")
//	public ResponseEntity<?> getAccessoire(@PathVariable("numero") final Long numero) {
//		Optional<Accessoire> accessoire = accessoireRepository.findById(numero) ;
//		if(accessoire.isPresent()) {
//			Accessoire myAccessoire = accessoire.get() ;
//			return new ResponseEntity<Accessoire>(myAccessoire, HttpStatus.FOUND) ;
//		} else {
//			return new ResponseEntity<ResponseMessage>(new ResponseMessage("cet accessoire n'existe pas"), HttpStatus.OK) ;
//		}
//	}
}