package sn.jmad.sonac.controller;


import java.util.List;

import sn.jmad.sonac.model.Filiale;
import sn.jmad.sonac.repository.FilialeRepository;
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
@RequestMapping("/sonac/api/filiale/*")
public class FilialeController {
	 
	    @Autowired
	    private FilialeRepository filialeRepository;
	    
	    
	    @GetMapping(value = "/allFiliales")
	    public ResponseEntity<?> getAllFiliales() {
	        List<Filiale> filiales = filialeRepository.allFiliales(1);
	        System.out.println("liste des filiales : " + filiales);
	        if (filiales.isEmpty())
	        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
	        return new ResponseEntity<List<Filiale>>(filiales, HttpStatus.OK);
	    }
	    
	    @GetMapping(value = "/allFilialesComp")
	    public ResponseEntity<?> getAllFilialesComp() {
	        List<?> filiales = filialeRepository.allFilialesCompagnie(1);
	        System.out.println("liste des filiales*** : " + filiales.toArray());
	        if (filiales.isEmpty())
	        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
	        return new ResponseEntity<List<?>>(filiales, HttpStatus.OK);
	    }
	   
	 	      
	    @PostMapping("/addFiliale")
		public ResponseEntity<?> registerFiliale(@RequestBody Filiale filialeRequest) {

			if (filialeRequest==null)
				return new ResponseEntity<ResponseMessage>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);
			
			filialeRequest.setActive(1);
			filialeRepository.save(filialeRequest);

			return new ResponseEntity<ResponseMessage>(new ResponseMessage("Filiale registered successfully!"), HttpStatus.OK);
		}
	    
	  @GetMapping("/findByCodeUser/{id}")
	    public ResponseEntity<?> getPharmaciesByName(@PathVariable(value = "id") String id) {
	        //System.out.println("****"+id);
	       List <Filiale> p = filialeRepository.findByCodeUser(id);
	        if (p.isEmpty())
	        	  return new ResponseEntity<ResponseMessage>(new ResponseMessage("Filiale not exists"), HttpStatus.NOT_FOUND);

	        return new ResponseEntity<>(p, HttpStatus.OK);
	    }
	    
	    
		
		 @DeleteMapping(value = "/delete/{id}")
		    public ResponseEntity<?> deleteFiliale(@PathVariable(value = "id") Long id) {
			// filialeRepository.deleteById(id);
			 Filiale f = filialeRepository.findByIdd(id);
			 f.setActive(0);
			 filialeRepository.save(f);
			 return new ResponseEntity<ResponseMessage>(new ResponseMessage("Filiale deleted "), HttpStatus.OK);
		     }
		 
		  @PutMapping(value = "/update/{id}")
		    public ResponseEntity<?> updateFiliale(@PathVariable(value = "id") Long id, @RequestBody Filiale filiale) {
		        
		        Filiale filialeToUpdate = filialeRepository.findByIdd(id);
		        if (filialeToUpdate == null) {
		           // System.out.println("filiale avec l'identifiant " + id + " n'existe pas");
		            return new ResponseEntity<ResponseMessage>(new ResponseMessage("Filiale not exists"), HttpStatus.NOT_FOUND);
		        } 
		        
		      //  System.out.println("UPDATE filiale: "+filialeToUpdate.getFili_id());
		        
		       // filialeToUpdate.setFili_numero(filiale.getFili_numero());
		        filialeToUpdate.setFili_codecompagnie(filiale.getFili_codecompagnie());
		        filialeToUpdate.setFili_codepays(filiale.getFili_codepays());
		        filialeToUpdate.setFili_codegroupe(filiale.getFili_codegroupe());
		        filialeToUpdate.setFili_denomination(filiale.getFili_denomination());
		        filialeToUpdate.setFili_sigle(filiale.getFili_sigle());
		        filialeToUpdate.setFili_codedevise(filiale.getFili_codedevise());
		        filialeToUpdate.setFili_adresse1(filiale.getFili_adresse1());
		        filialeToUpdate.setFili_adresse2(filiale.getFili_adresse2());
		        filialeToUpdate.setFili_telephone1(filiale.getFili_telephone1());
		        filialeToUpdate.setFili_telephone2(filiale.getFili_telephone2());
		        filialeToUpdate.setFili_telephonemobile(filiale.getFili_telephonemobile());
		        filialeToUpdate.setFili_codepostal(filiale.getFili_codepostal());
		        filialeToUpdate.setFili_codeutilisateur(filiale.getFili_codeutilisateur());
		        filialeToUpdate.setFili_datemodification(filiale.getFili_datemodification());
		        
	
		        Filiale filialeUpdated = filialeRepository.save(filialeToUpdate);
		        return new ResponseEntity<ResponseMessage>(new ResponseMessage("Filiale updated "+filialeUpdated), HttpStatus.OK);
		    }

		  

}
