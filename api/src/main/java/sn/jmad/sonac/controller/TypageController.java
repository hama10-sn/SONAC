package sn.jmad.sonac.controller;


import java.util.List;

import sn.jmad.sonac.model.Typage;
import sn.jmad.sonac.repository.TypageRepository;
//import sn.jmad.sonac.security.jwt.JwtProvider;

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




@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/typage/*")
public class TypageController {
	 
	    @Autowired
	    private TypageRepository typageRepository;
	    
	    
	    @GetMapping(value = "/allTypages")
	    public ResponseEntity<?> getAllTypages() {
	        List<Typage> typages = typageRepository.findAll();
	        System.out.println("liste des typages : " + typages);
	        if (typages==null)
	        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
	        return new ResponseEntity<List<Typage>>(typages, HttpStatus.OK);
	    }
	   
	 	      
	    @PostMapping("/addTypage")
		public ResponseEntity<?> registerTypage(@RequestBody Typage typageRequest) {

			if (typageRequest==null)
				return new ResponseEntity<ResponseMessage>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);
			
	    	typageRepository.save(typageRequest);

			return new ResponseEntity<ResponseMessage>(new ResponseMessage("Typage registered successfully!"), HttpStatus.OK);
		}
	    
	  @GetMapping("/findByType/{id}")
	    public ResponseEntity<?> getPharmaciesByName(@PathVariable(value = "id") String id) {
	        //System.out.println("****"+id);
	       List <Typage> p = typageRepository.findByType(id);
	        if (p==null)
	        	  return new ResponseEntity<ResponseMessage>(new ResponseMessage("Typage not exists"), HttpStatus.NOT_FOUND);

	        return new ResponseEntity<>(p, HttpStatus.OK);
	    }
	    
	    
		
		 @DeleteMapping(value = "/delete/{id}")
		    public ResponseEntity<?> deleteTypage(@PathVariable(value = "id") Long id) {
			 typageRepository.deleteById(id);
			 return new ResponseEntity<ResponseMessage>(new ResponseMessage("Typage deleted "), HttpStatus.OK);
		     }
		 
		  @PutMapping(value = "/update/{id}")
		    public ResponseEntity<?> updateTypage(@PathVariable(value = "id") Long id, @RequestBody Typage typage) {
		        
		        Typage typageToUpdate = typageRepository.findByIdd(id);
		        if (typageToUpdate == null) {
		            System.out.println("typage avec l'identifiant " + id + " n'existe pas");
		            return new ResponseEntity<ResponseMessage>(new ResponseMessage("Typage not exists"), HttpStatus.NOT_FOUND);
		        } 
		        
		        System.out.println("UPDATE typage: "+typageToUpdate.getTyp_id());
		        
		        typageToUpdate.setTyp_libelle_court(typage.getTyp_libelle_court());
		        typageToUpdate.setTyp_libelle_long(typage.getTyp_libelle_long());
		        typageToUpdate.setTyp_type(typage.getTyp_type());
		        
	
		        Typage typageUpdated = typageRepository.save(typageToUpdate);
		        return new ResponseEntity<ResponseMessage>(new ResponseMessage("Typage updated "+typageUpdated), HttpStatus.OK);
		    }

		  

}
