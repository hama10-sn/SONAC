package sn.jmad.sonac.controller;


import sn.jmad.sonac.model.Cima;
import sn.jmad.sonac.model.Cimacodificationcompagnie;
import sn.jmad.sonac.model.Compagnie;
import sn.jmad.sonac.model.Dem_Pers;
import sn.jmad.sonac.model.Pays;
import sn.jmad.sonac.model.Police;
import sn.jmad.sonac.repository.CimaCodificationCompagniRepository;
import sn.jmad.sonac.repository.CimaRepository;
import sn.jmad.sonac.repository.PoliceRepository;

import java.util.List;
import java.util.Optional;

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





@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/cima/*")
public class CimaController {
	  
	    

	    
	  @Autowired
	  CimaCodificationCompagniRepository cimaRepository;
		   
	  /*
	   * cette methode nous permet d'ajouter un cima
	   *
	   */
			  @PostMapping("/addCima")

			  public ResponseEntity<?> savePay(@Valid @RequestBody Cimacodificationcompagnie cima) {
		        	       
				  
				  Cimacodificationcompagnie c = cimaRepository.findByLibelle(cima.getCode_cima_compagnie());
				  
				
				  
				  if(c!=null) {
					  
					  return new ResponseEntity<>(new ResponseMessage("une erreur est survenue cima existe deja"), HttpStatus.INTERNAL_SERVER_ERROR) ;					  
			       
		        } else {
		        	  Cimacodificationcompagnie dp =cimaRepository.save(cima);
		            return new ResponseEntity<>(new ResponseMessage("cima compagnie enregistre"), HttpStatus.OK) ;
				       
		        }
				  
		      }
			  
			  /*
			   * cette methode nous permet de lister les cima
			   *
			    */
			  
			  @GetMapping(value = "/allCima")
			    public ResponseEntity<?> getAllcima() {
			        List<Cimacodificationcompagnie> cima = cimaRepository.findAllCima();
			        System.out.println("liste des cima : " + cima);
			        if (cima.isEmpty())
			        	return new ResponseEntity<>(new ResponseMessage("liste vide "), HttpStatus.OK);
			         
			        
			        return new ResponseEntity<List<Cimacodificationcompagnie>>(cima, HttpStatus.OK);
			    }
			  
			  /*
			   * cette methode nous permet de modifier un cima
			   *
			   */
			  
			  @PutMapping(value = "/update")
			    public ResponseEntity<?> updatecima( @RequestBody Cimacodificationcompagnie cima) {
			       
			        Optional<Cimacodificationcompagnie> c = cimaRepository.findById(cima.getId());
			        if(c.isPresent() ) {
			        	Cimacodificationcompagnie currentcima = c.get() ;
			        	currentcima.setCode_cima_compagnie(cima.getCode_cima_compagnie());
			        	currentcima.setDenomination(cima.getDenomination());
			            cimaRepository.save(currentcima) ;
			            return new ResponseEntity<ResponseMessage>(new ResponseMessage("cima compagnie  modifiée avec succès"), HttpStatus.OK) ;
			        } else {
			            return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de la modification"), HttpStatus.NOT_FOUND) ;
			        }
			    }
			  
}
