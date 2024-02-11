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
import sn.jmad.sonac.model.DateComptable;
import sn.jmad.sonac.model.Facture;
import sn.jmad.sonac.repository.DateComptableRepository;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/datecomptable/*")
public class DateComptableController {
	@Autowired
	private DateComptableRepository dateComptableRepository;
	
	@GetMapping("/listeDateComptable")
	public ResponseEntity<?> listeDateComptable() {
		List<DateComptable> listeDateComptable = dateComptableRepository.findAll();
		
		if (listeDateComptable.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("vide", "liste des dates comptable est vide", null),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "La liste des dates comptable", listeDateComptable),
				HttpStatus.OK);
	}
	
	@PostMapping("/ajoutDateComptable")
	public ResponseEntity<?> ajoutDateComptable(@RequestBody DateComptable dateComptable) {
		DateComptable comptable = dateComptableRepository.existingDateComptable(dateComptable.getDatecompt_typtable(),dateComptable.getDatecompt_typcentral());
				
		if (comptable != null) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "Une date comptable avec le même type de table et le même type de centralisation existe déjà!", comptable), HttpStatus.OK);
		} else {
			DateComptable saveDate = dateComptableRepository.save(dateComptable);
			if(saveDate == null) {
				return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "Echec de l'enregistrement de la date comptable!", saveDate), HttpStatus.OK);
			} else {
				return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "Ajout de la date comptable " + saveDate.getDatecompt_codtable() + " crée avec succès", saveDate), HttpStatus.OK);
			}
		}	
	}
	@DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<?> deleteDateCommptable(@PathVariable(value = "id") Long id) {
	
	  Optional<DateComptable> c = dateComptableRepository.findById(id);
		 
	  DateComptable currentDateComptable = c.get() ;
	  dateComptableRepository.delete(currentDateComptable);;
		  //demSocRepository.save(currentSoc);
			 return new ResponseEntity<ResponseMessage>(new ResponseMessage("demande supprimer "), HttpStatus.OK);
		       
	  }
	
	@PutMapping(value = "/updateDateComptable")
    public ResponseEntity<?> updateDemSoc( @RequestBody DateComptable dateComptable) {
		Optional<DateComptable> d = dateComptableRepository.findById(dateComptable.getDatecompt_codtable());
		if(d.isPresent()) {
			DateComptable currentDateComptable = d.get();
			currentDateComptable.setDatecompt_codtable(dateComptable.getDatecompt_codtable());
			currentDateComptable.setDatecompt_coduser(dateComptable.getDatecompt_coduser());
			currentDateComptable.setDatecompt_codejournal(dateComptable.getDatecompt_codejournal());
			currentDateComptable.setDatecompt_datemodif(dateComptable.getDatecompt_datemodif());
			currentDateComptable.setDatecompt_libellejourn(dateComptable.getDatecompt_libellejourn());
			currentDateComptable.setDatecompt_cloture(dateComptable.getDatecompt_cloture());
			currentDateComptable.setDatecompt_datejourn(dateComptable.getDatecompt_datejourn());
			currentDateComptable.setDatecompt_dateexercice(dateComptable.getDatecompt_dateexercice());
			currentDateComptable.setDatecompt_datemens(dateComptable.getDatecompt_datemens());
			currentDateComptable.setDatecompt_typcentral(dateComptable.getDatecompt_typcentral());
			currentDateComptable.setDatecompt_typtable(dateComptable.getDatecompt_typtable());
			dateComptableRepository.save(currentDateComptable);
			//return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok","Date comptable mise à jour avec succcés"+currentDateComptable),HttpStatus.OK);
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "Modification de la date comptable " + currentDateComptable.getDatecompt_codtable() + " faite avec succès", currentDateComptable), HttpStatus.OK);
		}else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("Echec modification date comptable"),HttpStatus.NOT_FOUND);
		}
	}
	@GetMapping(value = "/getDateComptable/{id}")
    public ResponseEntity<?> getOneDateComptable(@PathVariable(value = "id") Long id) {
	
	  Optional<DateComptable> d = dateComptableRepository.findById(id);
	  
	  if(d.isPresent()) {
		  return new ResponseEntity<DateComptable>(d.get(), HttpStatus.OK);
    } else {
        return new ResponseEntity<ResponseMessage>(new ResponseMessage("ce numero de date comptable n'existe pas "), HttpStatus.NOT_FOUND) ;
    }   
	  }
}
