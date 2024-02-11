package sn.jmad.sonac.controller;


import sn.jmad.sonac.model.Reassureur;
import sn.jmad.sonac.repository.ReassureurRepository;
import sn.jmad.sonac.service.ReassureurService;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import net.sf.jasperreports.engine.JRException;
import sn.jmad.sonac.message.response.ResponseMessage;





@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/reassureur/*")
public class ReassureurController {
	  
	    

	    
	    @Autowired
	   ReassureurRepository reassureurRepository;
	   @Autowired 
	   ReassureurService reassureurService;
	    
	      /*
		   * cette methode nous permet d'ajouter un	Reassureur
		   *
		   */
	    
		  @PostMapping("/addReassureur")
		  public ResponseEntity<?> saveReassureurs(@Valid @RequestBody Reassureur reassureur ) {

 
			  reassureur.setActive(1);
			  reassureurRepository.save(reassureur);
				return new ResponseEntity<>(new ResponseMessage("Reassureurs enregistré"),
						HttpStatus.OK);
		  }
		  
		  /*
		   * cette methode nous permet de lister les Reassureur
		   * 
		   */
		  
		  @GetMapping(value = "/allReassureur")
		    public ResponseEntity<?> getAllReassureur() {
		        List<Reassureur> reassureurs = reassureurRepository.allReassureurs(1);
		        System.out.println("liste des Reassureurs : " + reassureurs);
		        if (reassureurs==null)
		        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);
		         
		        
		        return new ResponseEntity<List<Reassureur>>(reassureurs, HttpStatus.OK);
		    }
		  
		  /*
		   * cette methode nous permet de modifier un Reassureur
		   *
		   */
		  
		  @PutMapping(value = "/update")
		    public ResponseEntity<?> updateReassureur( @RequestBody Reassureur reassureur) {
		       
		        Optional<Reassureur> rea = reassureurRepository.findBycode(reassureur.getReass_code()) ;
		        if(rea.isPresent()) {
		        	Reassureur currentReassureur = rea.get() ;	
		        		      	 		      	              
		        	currentReassureur.setReass_code(reassureur.getReass_code());           
		        	currentReassureur.setReass_codeidentificateur(reassureur.getReass_codeidentificateur());
		        	currentReassureur.setReass_codepays(reassureur.getReass_codepays());
		        	currentReassureur.setReass_type(reassureur.getReass_type());
		        	currentReassureur.setReass_denomination(reassureur.getReass_denomination());
		        	currentReassureur.setReass_denominationcourt(reassureur.getReass_denominationcourt());
		        	currentReassureur.setReass_telephone1(reassureur.getReass_telephone1());
		        	currentReassureur.setReass_adresse2(reassureur.getReass_adresse2());
		        	currentReassureur.setReass_telephone2(reassureur.getReass_telephone2());
		        	currentReassureur.setReass_email(reassureur.getReass_email());
		        	currentReassureur.setReass_datetraite1(reassureur.getReass_datetraite1());
		        	currentReassureur.setReass_nbretraite(reassureur.getReass_nbretraite());
		        	currentReassureur.setReass_ca(reassureur.getReass_ca());
		        	currentReassureur.setReass_commissionrecu(reassureur.getReass_commissionrecu());
		        	currentReassureur.setReass_horsgroupe(reassureur.getReass_horsgroupe());
		        	currentReassureur.setReass_codenationalite(reassureur.getReass_codenationalite());
		        	currentReassureur.setReass_codeutilisateur(reassureur.getReass_codeutilisateur());
		        	currentReassureur.setReass_datemodification(reassureur.getReass_datemodification());	        	
		            reassureurRepository.save(currentReassureur);
		            return new ResponseEntity<ResponseMessage>(new ResponseMessage("Reassureur modifiée avec succès"), HttpStatus.OK);
		        } else {
		            return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de la modification"), HttpStatus.NOT_FOUND);
		        }
		    }
		  @DeleteMapping(value = "/delete/{id}")
		    public ResponseEntity<?> deleteContact(@PathVariable(value = "id") Long id) {
			
			  Optional<Reassureur> c = reassureurRepository.findBycode(id);
			  
			  Reassureur currentReassureur = c.get();
				  currentReassureur.setActive(0);
				  reassureurRepository.save(currentReassureur);
					 return new ResponseEntity<ResponseMessage>(new ResponseMessage("Reassureur Supprier"), HttpStatus.OK);
				       
			  }

			@PostMapping("report/{format}")
			public @ResponseBody void generateReportProduit(HttpServletResponse response, @PathVariable String format,
					@RequestParam("title") String title, @RequestParam("demandeur") String demandeur)
					throws JRException, FileNotFoundException {

				reassureurService.generateReportReassureur(response, format, title, demandeur);
			}

		

}
