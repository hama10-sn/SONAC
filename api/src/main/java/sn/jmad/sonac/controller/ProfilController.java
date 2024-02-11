package sn.jmad.sonac.controller;


import java.util.List;

import sn.jmad.sonac.model.Profil;
import sn.jmad.sonac.repository.ProfilRepository;
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
@RequestMapping("/sonac/api/profil/*")
public class ProfilController {
	 
	    @Autowired
	    private ProfilRepository profilRepository;
	    
	    
	    @GetMapping(value = "/allProfils")
	    public ResponseEntity<?> getAllProfils() {
	        List<Profil> profils = profilRepository.findAllByOrder();
	      //  System.out.println("liste des profils : " + profils);
	     //   System.out.println("*****"+profilRepository.checkByNom("test".toUpperCase()));
			
	        if (profils.isEmpty())
	        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
	        return new ResponseEntity<List<Profil>>(profils, HttpStatus.OK);
	    }
	   
	 	      
	    @PostMapping("/addProfil")
		public ResponseEntity<?> registerProfil(@RequestBody Profil profilRequest) {

			if (profilRequest==null)
				return new ResponseEntity<ResponseMessage>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);
			
			if (profilRepository.findByNom(profilRequest.getNom().toUpperCase())!=null)
				return new ResponseEntity<ResponseMessage>(new ResponseMessage("role existe, veuillez changer"), HttpStatus.BAD_REQUEST);
			
	    	profilRepository.save(profilRequest);
	    	System.out.println(profilRequest);

			return new ResponseEntity<Profil>(profilRequest, HttpStatus.OK);
		}
	    
	  @GetMapping("/findByNom/{id}")
	    public ResponseEntity<?> getProfilByName(@PathVariable(value = "id") String id) {
	        //System.out.println("****"+id);
	       Profil p = profilRepository.findByNom(id);
	        if (p==null)
	        	  return new ResponseEntity<ResponseMessage>(new ResponseMessage("Profil not exists"), HttpStatus.NOT_FOUND);

	        return new ResponseEntity<>(p, HttpStatus.OK);
	    }
	    
	  @GetMapping("/findByAutorisation/{id}")
	    public ResponseEntity<?> getAutByName(@PathVariable(value = "id") String id) {
	        //System.out.println("****"+id);
	       Profil p = profilRepository.findByAutorisation(id);
	        if (p==null)
	        	  return new ResponseEntity<ResponseMessage>(new ResponseMessage("Profil not exists"), HttpStatus.NOT_FOUND);

	        return new ResponseEntity<>(p, HttpStatus.OK);
	    }
		
		 @DeleteMapping(value = "/delete/{id}")
		    public ResponseEntity<?> deleteProfil(@PathVariable(value = "id") Long id) {
			 String nom = profilRepository.findById(id).get().getNom();
			 if(profilRepository.checkByNom(nom.toUpperCase()).isEmpty()) {
			    profilRepository.deleteById(id);
			    return new ResponseEntity<ResponseMessage>(new ResponseMessage("Profil deleted "), HttpStatus.OK);
		     }
			 else
				 
				 return new ResponseEntity<ResponseMessage>(new ResponseMessage("Le role est relié à des utilisateurs"), HttpStatus.BAD_REQUEST);
		 }
		 
		  @PutMapping(value = "/update/{id}")
		    public ResponseEntity<?> updateProfil(@PathVariable(value = "id") Long id, @RequestBody Profil profil) {
		        
		        Profil profilToUpdate = profilRepository.findByIdd(id);
		        if (profilToUpdate == null) {
		            System.out.println("profil avec l'identifiant " + id + " n'existe pas");
		            return new ResponseEntity<ResponseMessage>(new ResponseMessage("Profil not exists"), HttpStatus.NOT_FOUND);
		        } 
		        
		        System.out.println("UPDATE profil: "+profilToUpdate.getId());
		        
		        profilToUpdate.setAutorisation(profil.getAutorisation());
		        profilToUpdate.setDate_create(profil.getDate_create());
		        profilToUpdate.setNom(profil.getNom());
		        profilToUpdate.setDate_update(profil.getDate_update());
	
		        Profil profilUpdated = profilRepository.save(profilToUpdate);
		        return new ResponseEntity<ResponseMessage>(new ResponseMessage("Profil updated "+profilUpdated), HttpStatus.OK);
		    }

		  

}
