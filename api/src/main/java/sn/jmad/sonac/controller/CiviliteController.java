package sn.jmad.sonac.controller;


import sn.jmad.sonac.model.Civilite;
import sn.jmad.sonac.model.Pays;
import sn.jmad.sonac.model.Civilite;
import sn.jmad.sonac.repository.CiviliteRepository;
import sn.jmad.sonac.repository.CiviliteRepository;

import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.hibernate.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import sn.jmad.sonac.message.response.ResponseMessage;





@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/civilite/*")
public class CiviliteController {
	  
	    

	    
	  @Autowired
	  CiviliteRepository civiliteRepository;
		    
	  /*
	   * cette methode nous permet d'ajouter un civilite
	   *
	   */
			  @PostMapping("/addCivilite")

			  public ResponseEntity<?> savePay(@Valid @RequestBody Civilite civilite /* Integer id/*, BindingResult br*/) {
				  Optional<Civilite> c = civiliteRepository.findByLibelle(civilite.getCiv_libellelong());
				  if(!c.isPresent()) {
					  civiliteRepository.save(civilite);
			            return new ResponseEntity<ResponseMessage>(new ResponseMessage("civilite enregistré"), HttpStatus.OK) ;
			       
				  }else {
			            return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de l'enregistrement civilité existe deja"), HttpStatus.NOT_FOUND) ;
			        }
					  }
			  
			  
			  
			  /*
			   * cette methode nous permet de lister les civilite
			   *
			    */
			  
			  @GetMapping(value = "/allcivilite")
			    public ResponseEntity<?> getAllcivilite() {
			        List<Civilite> civilite = civiliteRepository.findAllCivilite();
			        System.out.println("liste des civilite : " + civilite);
			        if (civilite==null)
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);
			         
			        
			        return new ResponseEntity<List<Civilite>>(civilite, HttpStatus.OK);
			    }
			  
			  /*
			   * cette methode nous permet de modifier un civilite
			   *
			   */
			  
			  @PutMapping(value = "/update")
			    public ResponseEntity<?> updatecivilite( @RequestBody Civilite civilite) {
			       
			        Optional<Civilite> c = civiliteRepository.findById(civilite.getCiv_code());
			        if(c.isPresent() ) {
			        	Civilite currentCivilite = c.get() ;
			        	currentCivilite.setCiv_libellelong(civilite.getCiv_libellelong());
			        	currentCivilite.setCiv_libellecourt(civilite.getCiv_libellecourt());
			        	currentCivilite.setCiv_nature(civilite.getCiv_nature());
			            		           
			            civiliteRepository.save(currentCivilite) ;
			            return new ResponseEntity<ResponseMessage>(new ResponseMessage("civilite modifiée avec succès"), HttpStatus.OK) ;
			        } else {
			            return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de la modification"), HttpStatus.NOT_FOUND) ;
			        }
			    }
			  
			  /**
			   * 
			   * Cette methode nous permet de recupérer les civilité par nature de la personne
			   */
			  @GetMapping(value = "/allciviliteByNature/{nature}")
			    public ResponseEntity<?> getAllCiviliteByNature(@PathVariable("nature") int nature) {
			        List<Civilite> civilite = civiliteRepository.findAllCiviliteByNature(nature) ;
			        //System.out.println("liste des civilite : " + civilite);
			        if (civilite.isEmpty())
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste civilité vide "), HttpStatus.OK);
			        
			        return new ResponseEntity<List<Civilite>>(civilite, HttpStatus.OK);
			    }
}
