package sn.jmad.sonac.controller;

import java.io.File;
import java.util.Date;
import java.util.List;

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

import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Dem_Pers;
import sn.jmad.sonac.model.Dem_Soc;
import sn.jmad.sonac.model.Propos;
import sn.jmad.sonac.repository.ProposRepository;
@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/Propos/*")

public class ProposController {
	
	


	  @Autowired
			ProposRepository propoRepository;
		    
			  
			  @PostMapping("/addPropos")

public ResponseEntity<?> saveclient(@Valid @RequestBody Propos propo) {
			  
				  propo.setPropo_statusproposition("en attente");
				  //propo.setActif(1);
				  Propos dp =propoRepository.save(propo);
			  if(dp==null) {
				  
				  return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de l'enregistrement"), HttpStatus.NOT_FOUND) ;					  
		       
	        } else {
	            return new ResponseEntity<ResponseMessage>(new ResponseMessage("Proposition enregistre"), HttpStatus.OK) ;
			       
	        }
	      }
  @GetMapping(value = "/allPropos")
			    public ResponseEntity<?> getallclients() {
			        List<Propos> propo = propoRepository.findAllPropos();
			        System.out.println("liste des proposition : " + propo);
			        if (propo==null)
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);
			        
			        
			        return new ResponseEntity<List<Propos>>(propo, HttpStatus.OK);		  
			  
			        
                          }
			
		 /*
			  @PutMapping("/editPropos")
				public ResponseEntity<?> editClient( @RequestBody Propos propo){
				  Long numPropo;
					Propos propoUpdate = propoRepository.findByNumero(propo.getPropo_numero());
					 if(propoUpdate == null)
							return new ResponseEntity<>(new ResponseMessage("ce client n'existe pas"),
									HttpStatus.NOT_FOUND);
					 //client.setActive(1);
					 propo.setPropo_id(propoUpdate.getPropo_id());					
					Propos proposs = propoRepository.save(propo);
					numPropo=proposs.getPropo_numero();				
					
					return new ResponseEntity<ResponseMessage>(new ResponseMessage("Proposition "+numPropo+" modifié avec succés"),
							HttpStatus.OK);
					
				}  */
			  
			  
			  @PutMapping(value = "/updatePropos/{id}")
			    public ResponseEntity<?> updateclient(@PathVariable(value = "id") Long id, @RequestBody Propos propo) {
			        
			        Propos propoToUpdate = propoRepository.findByIdd(id);			       
			        if (propoToUpdate == null) {
			            System.out.println("La proposition avec l'identifiant " + id + " n'existe pas");
			            return new ResponseEntity<ResponseMessage>(new ResponseMessage("Proposition n'existe pas"), HttpStatus.NOT_FOUND);
			        } 
			        
			        System.out.println("UPDATE proposition: "+propoToUpdate.getPropo_id());
			      
			        propoToUpdate.setPropo_numero(propo.getPropo_numero());
			        propoToUpdate.setPropo_date(propo.getPropo_date());
			        propoToUpdate.setPropo_codeintermediaire(propo.getPropo_codeintermediaire());
			        propoToUpdate.setPropo_codecompagnie(propo.getPropo_codecompagnie());
			        propoToUpdate.setPropo_numerobranche(propo.getPropo_numerobranche());
			        propoToUpdate.setPropo_numerocategorie(propo.getPropo_numerocategorie());
			        propoToUpdate.setPropo_numerosouscripteur(propo.getPropo_numerosouscripteur());
			        propoToUpdate.setPropo_numeroprospect(propo.getPropo_numeroprospect());
			        propoToUpdate.setPropo_dateeffet1er(propo.getPropo_dateeffet1er());
			        propoToUpdate.setPropo_dateannivcontrat(propo.getPropo_dateannivcontrat());
			        propoToUpdate.setPropo_dateeffet(propo.getPropo_dateeffet());
			        propoToUpdate.setPropo_dateecheance(propo.getPropo_dateecheance());
			        propoToUpdate.setPropo_dureecontrat(propo.getPropo_dureecontrat());
			        propoToUpdate.setPropo_typecontrat(propo.getPropo_typecontrat());
			        propoToUpdate.setPropo_typegestion(propo.getPropo_typegestion());
			        propoToUpdate.setPropo_codefractionnement(propo.getPropo_codefractionnement());
			        propoToUpdate.setPropo_mtnprimenetref(propo.getPropo_mtnprimenetref());
			        //propoToUpdate.setActive(propo.getActive());
			        propoToUpdate.setPropo_mtnprimenettot(propo.getPropo_mtnprimenettot());
			        propoToUpdate.setPropo_accesoirecompagnie(propo.getPropo_accesoirecompagnie());

			        propoToUpdate.setPropo_accessoireapporteur(propo.getPropo_accessoireapporteur());
			        propoToUpdate.setPropo_taxe(propo.getPropo_taxe());
			        propoToUpdate.setPropo_commission(propo.getPropo_commission());
			        propoToUpdate.setPropo_mtnprimebrut(propo.getPropo_mtnprimebrut());
			        propoToUpdate.setPropo_coefbonus(propo.getPropo_coefbonus());
			        propoToUpdate.setPropo_coefremisecommerciale(propo.getPropo_coefremisecommerciale());
			        propoToUpdate.setPropo_codeproduit(propo.getPropo_codeproduit());
			        propoToUpdate.setPropo_datesituationproposition(propo.getPropo_datesituationproposition());			       
			        propoToUpdate.setPropo_statusproposition(propo.getPropo_statusproposition());
			        propoToUpdate.setPropo_exontaxeenr(propo.getPropo_exontaxeenr());
			        propoToUpdate.setPropo_codetaxeenr(propo.getPropo_codetaxeenr());
			        propoToUpdate.setPropo_exontva(propo.getPropo_exontva());
			        propoToUpdate.setPropo_codetva(propo.getPropo_codetva());
			        propoToUpdate.setPropo_exontps(propo.getPropo_exontps());
			        propoToUpdate.setPropo_codetps(propo.getPropo_codetps());
			        propoToUpdate.setPropo_dateexon(propo.getPropo_dateexon());
			        propoToUpdate.setPropo_codeutil(propo.getPropo_codeutil());
			        propoToUpdate.setPropo_datemaj(propo.getPropo_datemaj());
			        propoToUpdate.setPropo_datetransformationcontrat(propo.getPropo_datetransformationcontrat());
			       



			        Propos proUpdated = propoRepository.save(propoToUpdate);
			        if(proUpdated == null)
						return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
								HttpStatus.INTERNAL_SERVER_ERROR);
					
			        return new ResponseEntity<ResponseMessage>(new ResponseMessage("proposition updated "+proUpdated), HttpStatus.OK);
			    }
			  
			  @DeleteMapping(value = "/delete/{id}")
			    public ResponseEntity<?> deleteClient(@PathVariable(value = "id") Long id) {
				
				 Propos pro = propoRepository.findByIdd(id);
				 //propo.setActive(0);
				 propoRepository.save(pro);
				 return new ResponseEntity<ResponseMessage>(new ResponseMessage("Client deleted "), HttpStatus.OK);
			     }
			  
			 
			  /*
			  @GetMapping("getPropos/{numpro}")
			  public ResponseEntity<?> getClient(@PathVariable(value = "numpro") Long numpro){
				 Propos pro = propoRepository.findByNumero(numpro);
				  return new ResponseEntity<Propos>(pro, HttpStatus.OK);
			  }*/
			  
			 
			  
}
