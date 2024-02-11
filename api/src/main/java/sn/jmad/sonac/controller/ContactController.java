package sn.jmad.sonac.controller;


import sn.jmad.sonac.model.Client;
import sn.jmad.sonac.model.Contact;
import sn.jmad.sonac.model.Filiale;
import sn.jmad.sonac.model.Pays;
import sn.jmad.sonac.repository.ClientRepository;
import sn.jmad.sonac.repository.ContactRepository;

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

import sn.jmad.sonac.message.response.PoliceProduit;
import sn.jmad.sonac.message.response.ResponseMessage;





@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/contact/*")
public class ContactController {
	  
	    

	    
	  @Autowired
	  ContactRepository contactRepository;
	  
	  @Autowired
	  ClientRepository clientRepository;
	  
	  /*
	   * cette methode nous permet d'ajouter un contact
	   *
	   */
			  @PostMapping("/addContact")

			  public ResponseEntity<?> savePay(@Valid @RequestBody Contact contact) {
		        	       
				  Optional<Contact> c = contactRepository.findByNum(contact.getCont_numero());
				  if(!c.isPresent()) {
					  contact.setActive(1);
					  contactRepository.save(contact);
					  Client cl = clientRepository.findByNumClient(contact.getCont_numeroclient());
					  Contact ct = contactRepository.findContactPrincipal(contact.getCont_numeroclient());
					  int nbLearder = contactRepository.findNbLeaderByClient(cl.getClien_numero());
					  if(nbLearder > 2 && contact.getCont_leader() == true ) {
						  return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de l'enregistrement il existe deja deux contact leader pour ce client "), HttpStatus.NOT_FOUND) ;
					  }
					  if(ct != null) {
						  cl.setClien_contactprinci(ct.getCont_numero()+" : "+ct.getCont_prenom()+" "+ct.getCont_nom());
						  clientRepository.save(cl);
					  }
					  
					  
			            return new ResponseEntity<ResponseMessage>(new ResponseMessage("contact enregistré"), HttpStatus.OK) ;
			       
		        } else {
		            return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de l'enregistrement numero contact existe deja "), HttpStatus.NOT_FOUND) ;
		        }
		      }
			  
			  @DeleteMapping(value = "/delete/{id}")
			    public ResponseEntity<?> deleteContact(@PathVariable(value = "id") Long id) {
				
				  Optional<Contact> c = contactRepository.findByNum(id);
				  
					  Contact currentContact = c.get() ;
					  currentContact.setActive(0);
						 contactRepository.save(currentContact);
						 Client cl = clientRepository.findByNumClient(currentContact.getCont_numeroclient());
						  Contact ct = contactRepository.findContactPrincipal(currentContact.getCont_numeroclient());
						  if(ct != null) {
							  
							  cl.setClien_contactprinci(ct.getCont_numero()+" : "+ct.getCont_prenom()+" "+ct.getCont_nom());
							  clientRepository.save(cl);
							  System.out.println(cl.getClien_contactprinci());
						  }
						  
						  
						 return new ResponseEntity<ResponseMessage>(new ResponseMessage("Contact supprimer "), HttpStatus.OK);
					       
				  }
			  @DeleteMapping(value = "/supprimer/{id}/{client}/{leader}")
			    public ResponseEntity<?> deleteContactClient(@PathVariable(value = "id") Long id,@PathVariable(value = "client") Long client,@PathVariable(value = "leader") boolean leader) {
				
				  Optional<Contact> d = contactRepository.findByNum(id);
				  if(leader==false) {
					  Contact currentContact = d.get() ;
					  currentContact.setActive(0);
						 contactRepository.save(currentContact);
						 
						  
						 //System.out.println(c + " :nombre");
						 
						 return new ResponseEntity<ResponseMessage>(new ResponseMessage("Contact supprimer "), HttpStatus.OK);
				  }else {
					  Long c = contactRepository.findByLeaderClient(client,leader);
						 
						 
						 if(c>1 ) {
							 Contact currentContact = d.get() ;
							  currentContact.setActive(0);
								 contactRepository.save(currentContact);
								 System.out.println(c + " :nombre");
								 Client cl = clientRepository.findByNumClient(currentContact.getCont_numeroclient());
								  Contact ct = contactRepository.findContactPrincipal(currentContact.getCont_numeroclient());
								  if(ct != null) {
									  cl.setClien_contactprinci(ct.getCont_numero()+" : "+ct.getCont_prenom()+" "+ct.getCont_nom());
									  clientRepository.save(cl);
									  System.out.println(cl.getClien_contactprinci());
								  }
								 
								 return new ResponseEntity<ResponseMessage>(new ResponseMessage("Contact supprimer "), HttpStatus.OK);
						 }
						 System.out.println(client);
						 System.out.println(c + " :nombre");
						 return new ResponseEntity<ResponseMessage>(new ResponseMessage("suppression impossible cree un contact leader d'abord "), HttpStatus.NOT_FOUND);
						  
				  }
				 
					  
					       
				  }
			  @GetMapping(value = "/nbContactByClient/{client}")
			    public ResponseEntity<?> getnbContact(@PathVariable(value = "client") Long client) {
				  int c = contactRepository.findNbLeaderByClient(client);
				  Contact cl;
				 // List<Contact> contact = contactRepository.AllContactByClient(id);
				 // int produitbyPolice = contactRepository.findNbLeaderByClient(id);
			        System.out.println("liste des contact : " + c);
			        if (c==1 ) 
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("pas de modification"), HttpStatus.OK);		         
			        
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("modifié"), HttpStatus.OK);
			        
			    }
			  
			  /*
			   * cette methode nous permet de lister les contact
			   *
			    */
			  
			  @GetMapping(value = "/allContactByClient/{id}")
			    public ResponseEntity<?> getAllContact(@PathVariable(value = "id") Long id) {
				  List<Contact> contact = contactRepository.AllContactByClient(id);
				 // int produitbyPolice = contactRepository.findNbLeaderByClient(id);
			        System.out.println("liste des contact : " + contact);
			        if (contact.isEmpty())
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide"), HttpStatus.OK);		         
			        
			        	return new ResponseEntity<List<Contact>>(contact, HttpStatus.OK);
			    }
			  
			  @GetMapping(value = "/allMandataireByClient/{id}")
			    public ResponseEntity<?> getAllMandataire(@PathVariable(value = "id") Long id) {
				  List<Contact> contact = contactRepository.AllMandataireByClient(id);
			        System.out.println("liste des contact : " + contact);
			        if (contact.isEmpty())
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide"), HttpStatus.OK);		         
			        
			        	return new ResponseEntity<List<Contact>>(contact, HttpStatus.OK);
			    }

			  
			  
			  @GetMapping(value = "/allContact")
			    public ResponseEntity<?> getAllContact() {
				  List<Contact> contact = contactRepository.allContacts(1);
			        System.out.println("liste des contact : " + contact);
			        if (contact.isEmpty())
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);
			         
			        
			        return new ResponseEntity<List<Contact>>(contact, HttpStatus.OK);
			    }
			  
			  @GetMapping(value = "/allMandataire")
			    public ResponseEntity<?> getAllMandataire() {
				  List<Contact> contact = contactRepository.AllMandataire(1);
			        System.out.println("liste des contact : " + contact);
			        if (contact.isEmpty())
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);
			         
			        
			        return new ResponseEntity<List<Contact>>(contact, HttpStatus.OK);
			    }
			  
			  /*
			   * cette methode nous permet de modifier un contact
			   *
			   */
			  
			  @PutMapping(value = "/update")
			    public ResponseEntity<?> updatecontact( @RequestBody Contact contact) {
			       
			        Optional<Contact> c = contactRepository.findByNum(contact.getCont_numero());
			        int cont = contactRepository.findNbLeaderByClient(contact.getCont_numeroclient());
			        
			        //getnbContact(contact.getCont_numeroclient());
			        if(c.isPresent() ) {
			        	Contact currentContact = c.get() ;
			        	currentContact.setCont_numero(contact.getCont_numero());
			        	currentContact.setCont_numeroclient(contact.getCont_numeroclient());
			        	currentContact.setCont_nom(contact.getCont_nom());
			        	currentContact.setCont_prenom(contact.getCont_prenom());
			        	currentContact.setCont_mobile(contact.getCont_mobile());
			        	currentContact.setCont_mandataire(contact.getCont_mandataire());
			        	currentContact.setCont_leader(contact.getCont_leader());
			        	currentContact.setCont_telephonique1(contact.getCont_telephonique1());
			        	currentContact.setCont_telephonique2(contact.getCont_telephonique2());
			        	currentContact.setCont_email(contact.getCont_email());
			        	
			        	contactRepository.save(currentContact) ;
			        	Client cl = clientRepository.findByNumClient(currentContact.getCont_numeroclient());
						  Contact ct = contactRepository.findContactPrincipal(currentContact.getCont_numeroclient());
						  if(ct != null) {
							  cl.setClien_contactprinci(ct.getCont_numero()+" : "+ct.getCont_prenom()+" "+ct.getCont_nom());
							  clientRepository.save(cl);
						  }
						  
			            return new ResponseEntity<ResponseMessage>(new ResponseMessage("contact modifiée avec succès"), HttpStatus.OK) ;
			        } else {
			            return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de la modification creez un leader d'abord"), HttpStatus.NOT_FOUND) ;
			        }
			    }
			  @GetMapping(value = "/findNbLeader/{numClient}")
				public ResponseEntity<?> getProduitByPolice(@PathVariable Long numClient) {
					int produitbyPolice = contactRepository.findNbLeaderByClient(numClient);

					return new ResponseEntity<Integer>(produitbyPolice, HttpStatus.OK);
				} 
}
