package sn.jmad.sonac.controller;


import java.util.List;

import sn.jmad.sonac.model.Filiale_Client;
import sn.jmad.sonac.repository.Filiale_ClientRepository;
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
@RequestMapping("/sonac/api/filiale_Client/*")
public class Filiale_ClientController {
	 
	    @Autowired
	    private Filiale_ClientRepository filiale_ClientRepository;
	    
	    
	    @GetMapping(value = "/allFiliale_Clients")
	    public ResponseEntity<?> getAllFiliale_Clients() {
	        List<Filiale_Client> filiale_Clients = filiale_ClientRepository.allFiliale_Clients(1);
	        System.out.println("liste des filiale_Clients : " + filiale_Clients);
	        if (filiale_Clients.isEmpty())
	        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
	        return new ResponseEntity<List<Filiale_Client>>(filiale_Clients, HttpStatus.OK);
	    }
	   
	 	      
	    @PostMapping("/addFiliale_Client")
		public ResponseEntity<?> registerFiliale_Client(@RequestBody Filiale_Client filiale_ClientRequest) {

			if (filiale_ClientRequest==null)
				return new ResponseEntity<ResponseMessage>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);
			
			filiale_ClientRequest.setActive(1);
			filiale_ClientRepository.save(filiale_ClientRequest);

			return new ResponseEntity<ResponseMessage>(new ResponseMessage("Filiale_Client registered successfully!"), HttpStatus.OK);
		}
	    
	  @GetMapping("/findByCodeUser/{id}")
	    public ResponseEntity<?> getPharmaciesByName(@PathVariable(value = "id") String id) {
	        //System.out.println("****"+id);
	       List <Filiale_Client> p = filiale_ClientRepository.findByCodeUser(id);
	        if (p.isEmpty())
	        	  return new ResponseEntity<ResponseMessage>(new ResponseMessage("Filiale_Client not exists"), HttpStatus.NOT_FOUND);

	        return new ResponseEntity<>(p, HttpStatus.OK);
	    }
	    
	    
		
		 @DeleteMapping(value = "/delete/{id}")
		    public ResponseEntity<?> deleteFiliale_Client(@PathVariable(value = "id") Long id) {
			// filiale_ClientRepository.deleteById(id);
			 Filiale_Client f = filiale_ClientRepository.findByIdd(id);
			 f.setActive(0);
			 filiale_ClientRepository.save(f);
			 return new ResponseEntity<ResponseMessage>(new ResponseMessage("Filiale_Client deleted "), HttpStatus.OK);
		     }
		 
		  @PutMapping(value = "/update/{id}")
		    public ResponseEntity<?> updateFiliale_Client(@PathVariable(value = "id") Long id, @RequestBody Filiale_Client filiale_Client) {
		        
		        Filiale_Client filiale_ClientToUpdate = filiale_ClientRepository.findByIdd(id);
		        if (filiale_ClientToUpdate == null) {
		           // System.out.println("filiale_Client avec l'identifiant " + id + " n'existe pas");
		            return new ResponseEntity<ResponseMessage>(new ResponseMessage("Filiale_Client not exists"), HttpStatus.NOT_FOUND);
		        } 
		        
		      //  System.out.println("UPDATE filiale_Client: "+filiale_ClientToUpdate.getFilcli_id());
		        
		       // filiale_ClientToUpdate.setFilcli_numero(filiale_Client.getFilcli_numero());
		        filiale_ClientToUpdate.setFilcli_numercli(filiale_Client.getFilcli_numercli());
		        filiale_ClientToUpdate.setFilcli_codepays(filiale_Client.getFilcli_codepays());
		        filiale_ClientToUpdate.setFili_codegroupe(filiale_Client.getFili_codegroupe());
		        filiale_ClientToUpdate.setFilcli_codedevise(filiale_Client.getFilcli_codedevise());
		        filiale_ClientToUpdate.setFilcli_codeutilisateur(filiale_Client.getFilcli_codeutilisateur());
		        filiale_ClientToUpdate.setFilcli_datemodification(filiale_Client.getFilcli_datemodification());
		        
	
		        Filiale_Client filiale_ClientUpdated = filiale_ClientRepository.save(filiale_ClientToUpdate);
		        return new ResponseEntity<ResponseMessage>(new ResponseMessage("Filiale_Client updated "+filiale_ClientUpdated), HttpStatus.OK);
		    }

		  

}
