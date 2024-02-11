package sn.jmad.sonac.controller;


import sn.jmad.sonac.model.Encaissement;
import sn.jmad.sonac.model.Facture;
import sn.jmad.sonac.model.Police;
import sn.jmad.sonac.model.Quittance;
import sn.jmad.sonac.model.Utilisateur;
import sn.jmad.sonac.repository.FactureRepository;
import sn.jmad.sonac.repository.QuittanceRepository;
import sn.jmad.sonac.security.service.UserPrinciple;
import sn.jmad.sonac.service.EncaissementService;

import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import sn.jmad.sonac.message.response.ReemettreDate;
import sn.jmad.sonac.message.response.ResponseMessage;





@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/facture/*")
public class FactureController {
	  
	    

	    
	  @Autowired
	  FactureRepository factureRepository;
	  @Autowired
	  QuittanceRepository quittanceRepository;
	  @Autowired
	  EncaissementService encaissementService;
	  
	  
	  
	  
		    
	  /*
	   * cette methode nous permet d'ajouter une facture
	   *
	   */
			  @PostMapping("/addFacture")

			  public ResponseEntity<?> savefacture(@Valid @RequestBody Facture facture) {
		        	       
				  Optional<Facture> c = factureRepository.findByNum(facture.getFact_numacte());
				  if(!c.isPresent()) {
					  facture.setActive(1);
					  facture.setFact_etatfacture("V");
					  factureRepository.save(facture);
			            return new ResponseEntity<>(facture, HttpStatus.OK) ;
			       
		        } else {
		            return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de l'enregistrement numero facture existe deja "), HttpStatus.NOT_FOUND) ;
		        }
		      }
			  
			  @DeleteMapping(value = "/delete/{id}")
			    public ResponseEntity<?> deletefacture(@PathVariable(value = "id") Long id) {
				
				  Optional<Facture> c = factureRepository.findByNum(id);
				  
				  Facture currentFacture = c.get() ;
				  currentFacture.setActive(0);
				  factureRepository.save(currentFacture);
						 return new ResponseEntity<ResponseMessage>(new ResponseMessage("facture supprimer "), HttpStatus.OK);
					       
				  }


			  
			  /*
			   * cette methode nous permet de lister les factures
			   *
			    */
			  


			  
			  
			  @GetMapping(value = "/allFacture")
			    public ResponseEntity<?> getAllFacture() {
				  List<Facture> facture = factureRepository.allFactures();
				  
			        if (facture.isEmpty())
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);
			         
			        
			        return new ResponseEntity<List<Facture>>(facture, HttpStatus.OK);
			    }
			  
			  
			  
			  /*
			   * cette methode nous permet de modifier un contact
			   *
			   */
			  
			  @PutMapping(value = "/update")
			    public ResponseEntity<?> updatefacture( @RequestBody Facture facture) {
			       
			        Optional<Facture> c = factureRepository.findByNum(facture.getFact_numacte());
			        if(c.isPresent() ) {
			        	Facture currentFacture = c.get() ;
			        	currentFacture.setFact_numacte(facture.getFact_numeroacte());
			        	currentFacture.setFact_datefacture(facture.getFact_datefacture());
			        	currentFacture.setFact_numeropolice(facture.getFact_numeropolice());
			        	currentFacture.setFact_numeroacte(facture.getFact_numeroacte());
			        	currentFacture.setFact_numeroquittance(facture.getFact_numeroquittance());
			        	currentFacture.setFact_marche(facture.getFact_marche());
			        	currentFacture.setFact_numerosouscripteurcontrat(facture.getFact_numerosouscripteurcontrat());
			        	currentFacture.setFact_numeoracheteur(facture.getFact_numeoracheteur());
			        	currentFacture.setFact_numeroassure(facture.getFact_numeroassure());
			        	currentFacture.setFact_numerobeneficiaire(facture.getFact_numerobeneficiaire());

			        	currentFacture.setFact_objetfacture(facture.getFact_objetfacture());
			        	currentFacture.setFact_montantprimenet(facture.getFact_montantprimenet());
			        	currentFacture.setFact_montantaccescompagnie(facture.getFact_montantaccescompagnie());
			        	currentFacture.setFact_montantaccesapporteur(facture.getFact_montantaccesapporteur());
			        	currentFacture.setFact_montanttaxe(facture.getFact_montanttaxe());
			        	currentFacture.setFact_montantarrondi(facture.getFact_montantarrondi());
			        	currentFacture.setFact_commissionapporteur(facture.getFact_commissionapporteur());
			        	currentFacture.setFact_montantttc(facture.getFact_montantttc());
			        	currentFacture.setFact_numerobranche(facture.getFact_numerobranche());
			        	currentFacture.setFact_numerocategorie(facture.getFact_numerocategorie());

			        	currentFacture.setFact_dateeffetcontrat(facture.getFact_dateeffetcontrat());
			        	currentFacture.setFact_dateecheancecontrat(facture.getFact_dateecheancecontrat());
			        	currentFacture.setFact_capitalassure(facture.getFact_capitalassure());
			        	currentFacture.setFact_capitalsmp(facture.getFact_capitalsmp());
			        	currentFacture.setFact_capitallci(facture.getFact_capitallci());
			        	currentFacture.setFact_datecomptabilisation(facture.getFact_datecomptabilisation());
			        	currentFacture.setFact_codeutilisateur(facture.getFact_codeutilisateur());
			        	currentFacture.setFact_datemodification(facture.getFact_datemodification());
			        	currentFacture.setFact_etatfacture(facture.getFact_etatfacture());
			        	currentFacture.setFact_codeannulation(facture.getFact_codeannulation());
			        	currentFacture.setFact_dateannulation(facture.getFact_dateannulation());
			        	currentFacture.setFact_anciennumerofacture(facture.getFact_anciennumerofacture());
			        	
			        	factureRepository.save(currentFacture) ;
			            return new ResponseEntity<ResponseMessage>(new ResponseMessage("contact modifiée avec succès"), HttpStatus.OK) ;
			        } else {
			            return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de la modification"), HttpStatus.NOT_FOUND) ;
			        }
			    }
			  
			  @GetMapping(value = "/getFacture/{id}")
			    public ResponseEntity<?> getFacture(@PathVariable(value = "id") Long id) {
				
				  Optional<Facture> c = factureRepository.findByNum(id);
				  
				  if(c.isPresent()) {
					  return new ResponseEntity<Facture>(c.get(), HttpStatus.OK);
		        } else {
		            return new ResponseEntity<ResponseMessage>(new ResponseMessage("ce numero de facture n'existe pas "), HttpStatus.NOT_FOUND) ;
		        }   
				  }
			  
			  @GetMapping(value = "/isProductFacture/{id}")
			    public ResponseEntity<?> isProductFacture(@PathVariable(value = "id") Long id) {
				
				  Optional<Facture> c = factureRepository.findByNum(id);
				  
				  if(c.isPresent()) {
					  List<Encaissement> enc = factureRepository.allEncaissementsFacture(id);
					  if(enc.isEmpty()) {
						  return new ResponseEntity<Long>(1L, HttpStatus.OK);
					  }
					  return new ResponseEntity<Long>(2L, HttpStatus.OK);
					  
		        } else {
		            return new ResponseEntity<ResponseMessage>(new ResponseMessage("ce numero de facture n'existe pas "), HttpStatus.NOT_FOUND) ;
		        }   
				  }
			  
			  @GetMapping(value = "/allFacturesPolice/{numpol}")
				public ResponseEntity<?>  getAllFacturesPolice(@PathVariable(value = "numpol") Long id) {
					List<Facture> factures = factureRepository.allFacturesPolice(id);
					
					
					
					return new ResponseEntity<List<Facture>>(factures, HttpStatus.OK) ;
				}
			  @GetMapping(value = "/allFacturesPoliceaEnc/{numpol}")
				public ResponseEntity<?>  getAllFacturesPoliceaEnc(@PathVariable(value = "numpol") Long id) {
					List<Facture> factures = factureRepository.allFacturesPoliceaEnc(id);
					
					
					
					return new ResponseEntity<List<Facture>>(factures, HttpStatus.OK) ;
				}
			  @GetMapping(value = "/allFacturesAnnulPolice/{numpol}")
				public ResponseEntity<?>  getAllFacturesAnnulPolice(@PathVariable(value = "numpol") Long id) {
					List<Facture> factures = factureRepository.allFacturesAnnulPolice(id);
					
					
					
					return new ResponseEntity<List<Facture>>(factures, HttpStatus.OK) ;
				}
			  
			  @GetMapping(value = "/maxFacturesByPolice/{numpol}")
				public ResponseEntity<?>  maxFacturesByPolice(@PathVariable(value = "numpol") Long id) {
					Facture facture = factureRepository.getMaxNumFactureByPolice(id);
					
					return new ResponseEntity<Facture>(facture, HttpStatus.OK) ;
				}
			  @GetMapping(value = "/allFacturesAnnul")
				public ResponseEntity<?>  getAllFacturesAnnulPolice() {
					List<Facture> factures = factureRepository.allFacturesAnnul();
					
					
					
					return new ResponseEntity<List<Facture>>(factures, HttpStatus.OK) ;
				}
			  

			  @GetMapping(value = "/allFacturesEnProd")
				public ResponseEntity<?>  getAllFacturesProd() {
					List<Facture> factures = factureRepository.allFacturesEnProd();
					
					
					
					return new ResponseEntity<List<Facture>>(factures, HttpStatus.OK) ;
				}
			  
			  @GetMapping(value = "/allFacturesClient/{numcli}")
				public ResponseEntity<?>  getAllFacturesCLient(@PathVariable(value = "numcli") Long id) {
					List<Facture> factures = factureRepository.allFacturesClient(id);
					
					
					
					return new ResponseEntity<List<Facture>>(factures, HttpStatus.OK) ;
				}
			  @GetMapping(value = "/allFacturesIntermediaire/{numInter}")
				public ResponseEntity<?>  getAllFacturesInter(@PathVariable(value = "numInter") Long id) {
					List<Facture> factures = factureRepository.allFacturesIntermediare(id);
					
					
					
					return new ResponseEntity<List<Facture>>(factures, HttpStatus.OK) ;
				}
			  
			  @GetMapping(value = "/maxFactures/{numInter}")
				public ResponseEntity<?>  maxFactures(@PathVariable(value = "numInter") Long id) {
					Long factures = factureRepository.getMaxNumFacByPolice(id);
					
					
					
					return new ResponseEntity<Long>(factures, HttpStatus.OK) ;
				}
			  
			  @PostMapping(value = "/reemettreFactEcheanceSeuleLaste")
				public ResponseEntity<?> reemettreFactEcheanceSeule(@RequestBody ReemettreDate reemettre) throws ParseException  {
				System.out.println(" ------------------date effet facture est :"+reemettre);
				 //Long fact =
				Police police= reemettre.getMyForm();
				reemettre.getAddForm();
				 Authentication auth = SecurityContextHolder.getContext().getAuthentication();
					UserPrinciple u = (UserPrinciple) auth.getPrincipal();
						 encaissementService.reemettreFactEcheanceSeuleLaste(reemettre,  u.getUtil_num());
				 
				 return new ResponseEntity<ResponseMessage>(new ResponseMessage("police N° "+police.getPoli_numero()+"  modifié"), HttpStatus.OK) ;

				}/*
			  @PostMapping(value = "/reemettreFactEcheanceSeuleLaste")
				public ResponseEntity<?> reemettreFactEcheanceSeule(@RequestBody ReemettreDate reemettre) throws ParseException {
				System.out.println(" ---------------------"+reemettre);
				 //Long fact =
						 //encaissementService.reemettreFactEcheanceSeuleLaste(reemettre, police, "AG11111");
				 
				 return new ResponseEntity<ResponseMessage>(new ResponseMessage("police N°  modifié"), HttpStatus.OK) ;

				}*/
			  @PostMapping(value = "/reemettreFactEcheanceSeule/{type}/{numFactAnnul}")
				public ResponseEntity<?> reemettreFactEcheanceSeule(@RequestBody Police police,@PathVariable(value = "type") Long type, @PathVariable(value = "numFactAnnul") Long numFactAnnul) {
				
				  Facture fact=factureRepository.getMaxNumFactureByPolice(police.getPoli_numero());
				  Authentication auth = SecurityContextHolder.getContext().getAuthentication();
					UserPrinciple u = (UserPrinciple) auth.getPrincipal();
				 // numFactAnnul=fact.getFact_numacte();
						 encaissementService.reemettreFactEcheanceSeule(police, type, u.getUtil_num(), numFactAnnul);
				 
				 return new ResponseEntity<ResponseMessage>(new ResponseMessage("police N° "+police.getPoli_numero()+" modifié"), HttpStatus.OK) ;

				}
			  
			  
			  @GetMapping(value = "/annulerFacture/{id}/{typeAnnul}")
			    public ResponseEntity<?> annulerFacture(@PathVariable(value = "id") Long id,@PathVariable(value = "typeAnnul") Long tAnnul) {
				
				  Optional<Facture> c = factureRepository.findByNum(id);
				  
				  
				  
				  if(c.isPresent()) {
					 Facture fact =  encaissementService.annulerFacture(c.get(), tAnnul);
					  
					  
					  return new ResponseEntity<ResponseMessage>(new ResponseMessage("Facture N° "+fact.getFact_numacte()+" annulée "), HttpStatus.OK) ;
					  
					  
		        } else {
		            return new ResponseEntity<ResponseMessage>(new ResponseMessage("ce numero de facture n'existe pas "), HttpStatus.NOT_FOUND) ;
		        }   
				  }

			  //police
			  @DeleteMapping(value = "/deleteforpolice/{id}")
			    public ResponseEntity<?> delete(@PathVariable(value = "id") Long id) {
				
				  factureRepository.deleteById(id);
					 return new ResponseEntity<ResponseMessage>(new ResponseMessage("Facture deleted "), HttpStatus.OK);					       
				  }
}
