package sn.jmad.sonac.controller;


import java.util.List;

import sn.jmad.sonac.model.Fonctionnalite;
import sn.jmad.sonac.model.Profil;
import sn.jmad.sonac.repository.FonctionnaliteRepository;
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
@RequestMapping("/sonac/api/fonctionnalite/*")
public class FonctionnaliteController {
	 
	    @Autowired
	    private FonctionnaliteRepository fonctionnaliteRepository;
	    
	    
	    @GetMapping(value = "/allFonctionnalites")
	    public ResponseEntity<?> getAllFonctionnalites() {
	        List<Fonctionnalite> fonctionnalites = fonctionnaliteRepository.findAllfonct();
	        System.out.println("liste des fonctionnalites : " + fonctionnalites);
	        if (fonctionnalites.isEmpty())
	        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
	        return new ResponseEntity<List<Fonctionnalite>>(fonctionnalites, HttpStatus.OK);
	    }
	   
	 	      
	    @PostMapping("/addFonctionnalite")
		public ResponseEntity<?> registerFonctionnalite(@RequestBody Fonctionnalite entite) {

			if (entite==null)
				return new ResponseEntity<ResponseMessage>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);
			
			if (fonctionnaliteRepository.findByNom(entite.getEntite())!=null)
				return new ResponseEntity<ResponseMessage>(new ResponseMessage("fonctionnalité existe déja"), HttpStatus.BAD_REQUEST);
			
			
			Fonctionnalite f =new Fonctionnalite(entite.getEntite(),"c_"+entite.getEntite(),"u_"+entite.getEntite(),"l_"+entite.getEntite(),"d_"+entite.getEntite());
	    	fonctionnaliteRepository.save(f);

			return new ResponseEntity<ResponseMessage>(new ResponseMessage("Fonctionnalite registered successfully!"), HttpStatus.OK);
		}
	    
	  @GetMapping("/findByEntite/{id}")
	    public ResponseEntity<?> getFonctionnaliteByName(@PathVariable(value = "id") String id) {
	        //System.out.println("****"+id);
	       Fonctionnalite p = fonctionnaliteRepository.findByNom(id);
	        if (p==null)
	        	  return new ResponseEntity<ResponseMessage>(new ResponseMessage("Fonctionnalite not exists"), HttpStatus.NOT_FOUND);

	        return new ResponseEntity<>(p, HttpStatus.OK);
	    }
	
		
		 @DeleteMapping(value = "/delete/{id}")
		    public ResponseEntity<?> deleteFonctionnalite(@PathVariable(value = "id") Long id) {
			 fonctionnaliteRepository.deleteById(id);
			 return new ResponseEntity<ResponseMessage>(new ResponseMessage("Fonctionnalite deleted "), HttpStatus.OK);
		     }
		 
		  @PutMapping(value = "/update/{id}")
		    public ResponseEntity<?> updateFonctionnalite(@PathVariable(value = "id") Long id, @RequestBody Fonctionnalite fonctionnalite) {
		        
		        Fonctionnalite fonctionnaliteToUpdate = fonctionnaliteRepository.findByIdd(id);
		        if (fonctionnaliteToUpdate == null) {
		            System.out.println("fonctionnalite avec l'identifiant " + id + " n'existe pas");
		            return new ResponseEntity<ResponseMessage>(new ResponseMessage("Fonctionnalite not exists"), HttpStatus.NOT_FOUND);
		        } 
		        
		        System.out.println("UPDATE fonctionnalite: "+fonctionnaliteToUpdate.getId());
		        
		        fonctionnaliteToUpdate.setEntite(fonctionnalite.getEntite());
		        fonctionnaliteToUpdate.setCreer("create_"+fonctionnalite.getEntite());
		        fonctionnaliteToUpdate.setModif("update_"+fonctionnalite.getEntite());
		        fonctionnaliteToUpdate.setListing("listing_"+fonctionnalite.getEntite());
		        fonctionnaliteToUpdate.setSup("delete_"+fonctionnalite.getEntite());
	
		        Fonctionnalite fonctionnaliteUpdated = fonctionnaliteRepository.save(fonctionnaliteToUpdate);
		        return new ResponseEntity<ResponseMessage>(new ResponseMessage("Fonctionnalite updated "+fonctionnaliteUpdated), HttpStatus.OK);
		    }

		  

}
