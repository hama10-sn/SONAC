package sn.jmad.sonac.controller;

import java.io.FileNotFoundException;
import java.util.List;

import javax.servlet.http.HttpServletResponse;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import net.sf.jasperreports.engine.JRException;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Cimacodificationcompagnie;
import sn.jmad.sonac.model.Client;
import sn.jmad.sonac.model.Compagnie;

import sn.jmad.sonac.model.Pays;
import sn.jmad.sonac.model.Police;
import sn.jmad.sonac.repository.CimaCodificationCompagniRepository;

import sn.jmad.sonac.repository.CompagnieRepository;
import sn.jmad.sonac.repository.PoliceRepository;
import sn.jmad.sonac.service.CompagnieService;


@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/compagnie/*")
public class CompagnieController {

	
	  @Autowired
	  CompagnieRepository compagnieRepository;
	  
	  @Autowired
	  PoliceRepository policeRepository ;

	  @Autowired
	  CompagnieService compagnieService ;
		    
			  
			  @PostMapping("/addCompagnie")

  public ResponseEntity<?> saveCompagnie(@Valid @RequestBody Compagnie compagnie) {
		
	if(compagnie == null)
		return new ResponseEntity<>(new ResponseMessage("cette compagnie n'existe pas"),
				HttpStatus.NOT_FOUND);
	
	Compagnie compagnieExist = compagnieRepository.findByNumComp(compagnie.getComp_numero());
	if(compagnieExist!=null) {
		return new ResponseEntity<ResponseMessage>(new ResponseMessage("le numéro de compagnie existe déjà"),
			     HttpStatus.NOT_FOUND);

	}
	else
	   compagnie.setActive(1);
       compagnieRepository.save(compagnie);
	   return new ResponseEntity<>(new ResponseMessage("compagnie enregistrée avec succés"),
       HttpStatus.OK);				
			
		}
			  @GetMapping(value = "/allCompagnies")
			    public ResponseEntity<?> getallCompagnies() {
			        List<Compagnie> compagnie = compagnieRepository.allcompagnies();
			        System.out.println("liste des compagnies : " + compagnie);
			        if (compagnie==null)
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
			        
			        
			        return new ResponseEntity<List<Compagnie>>(compagnie, HttpStatus.OK);		  
			  
			        
}
			  
			  @GetMapping(value = "/allCompagniesDelete")
			    public ResponseEntity<?> getallCompagniesDelete() {
			        List<Compagnie> compagnie = compagnieRepository.allcompagniesDelete();
			        System.out.println("liste des compagnies supprimées : " + compagnie);
			        if (compagnie==null)
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
			        
			        
			        return new ResponseEntity<List<Compagnie>>(compagnie, HttpStatus.OK);		  
			  
			        
}
			  @PutMapping(value = "/updateCompagnie/{id}")
			    public ResponseEntity<?> updateCompagnie(@PathVariable(value = "id") Long id, @RequestBody Compagnie compagnie) {
			        
			        Compagnie compagnieToUpdate = compagnieRepository.findByIdd(id);
			        compagnie.setActive(1);
			        if (compagnieToUpdate == null) {
			            System.out.println("La compagnie avec l'identifiant " + id + " n'existe pas");
			            return new ResponseEntity<ResponseMessage>(new ResponseMessage("Compagny not exists"), HttpStatus.NOT_FOUND);
			        } 
			        
			        System.out.println("UPDATE compagnie: "+compagnieToUpdate.getComp_id());
			        
			        compagnieToUpdate.setComp_numero(compagnie.getComp_numero());
			        compagnieToUpdate.setComp_type(compagnie.getComp_type());
			        compagnieToUpdate.setComp_camarche(compagnie.getComp_camarche());
			        compagnieToUpdate.setComp_carelation(compagnie.getComp_carelation());
			        compagnieToUpdate.setComp_camarche(compagnie.getComp_camarche());
			        compagnieToUpdate.setComp_codeutilisateur(compagnie.getComp_codeutilisateur());
			        compagnieToUpdate.setComp_datemodification(compagnie.getComp_datemodification());
			        compagnieToUpdate.setComp_denomination(compagnie.getComp_denomination());
			        compagnieToUpdate.setComp_email(compagnie.getComp_email());
			        compagnieToUpdate.setComp_adresse1(compagnie.getComp_adresse1());
			        compagnieToUpdate.setComp_adresse2(compagnie.getComp_adresse2());
			        compagnieToUpdate.setComp_telephone1(compagnie.getComp_telephone1());
			        compagnieToUpdate.setComp_telephone2(compagnie.getComp_telephone2());
			        compagnieToUpdate.setComp_numerocontact(compagnie.getComp_numerocontact());
			        compagnieToUpdate.setComp_codepays(compagnie.getComp_codepays());
			        compagnieToUpdate.setComp_codegroupe(compagnie.getComp_codegroupe());
			        compagnieToUpdate.setComp_sigle(compagnie.getComp_sigle());
			        //compagnieToUpdate.setActive(compagnie.getActive());
		
			        Compagnie compUpdated = compagnieRepository.save(compagnieToUpdate);
			        if(compUpdated == null)
						return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
								HttpStatus.INTERNAL_SERVER_ERROR);
					
			        return new ResponseEntity<ResponseMessage>(new ResponseMessage("Compagnie updated "+compUpdated), HttpStatus.OK);
			    }
			  

			  @PutMapping("/editCompagnie")
				public ResponseEntity<?> editCompagnie( @RequestBody Compagnie compagnie){
					Compagnie compagnieUpdate = compagnieRepository.findByNumComp(compagnie.getComp_numero());
					if(compagnieUpdate == null)
						return new ResponseEntity<>(new ResponseMessage("cette compagnie n'existe pas"),
								HttpStatus.NOT_FOUND);
					compagnie.setActive(1);
					compagnie.setComp_id(compagnieUpdate.getComp_id());
					Compagnie comp = compagnieRepository.save(compagnie);
					if(comp == null)
						return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
								HttpStatus.INTERNAL_SERVER_ERROR);
					
					
					return new ResponseEntity<>(new ResponseMessage("compagnie modifiée avec succés"),
							HttpStatus.OK);
					
				}
			  
			  
			  

//			  @DeleteMapping(value = "/delete/{id}")
//			    public ResponseEntity<?> deleteFiliale(@PathVariable(value = "id") Long id) {
//				// filialeRepository.deleteById(id);
//				 Compagnie comp = compagnieRepository.findByIdd(id);
//				 comp.setActive(0);
//				 compagnieRepository.save(comp);
//				 return new ResponseEntity<ResponseMessage>(new ResponseMessage("Filiale deleted "), HttpStatus.OK);
//			     }
			  
			  @GetMapping("/deleteCompagnie/{num}")
				public ResponseEntity<?> deleteCompagnie(@PathVariable("num") String numcomp ){
					
				  
				 Compagnie compagnie = compagnieRepository.findByNumComp(numcomp);
				  //Compagn compagnie = compagnieRepository.findByNumComp(numcomp) ;
					if(compagnie != null) {
						compagnie.setActive(0);
						compagnieRepository.save(compagnie) ;
						return new ResponseEntity<>(new ResponseMessage("compagnie supprimée"),
								HttpStatus.OK);
					}
					
					return new ResponseEntity<>(new ResponseMessage("suppréssion impossible"),
							HttpStatus.INTERNAL_SERVER_ERROR);
				}
				
				@GetMapping("/verifDeleteCompagnie/{num}")
				public ResponseEntity<?> verifdeleteCompagnie(@PathVariable("num") String num){
					
					List<Police> polices = policeRepository.findPoliceByCompagnie(num);
					if(polices.isEmpty()) {
						
						return new ResponseEntity<>(new ResponseMessage("ok"),
								HttpStatus.OK);
					}
					
					return new ResponseEntity<>(new ResponseMessage("suppréssion impossible: cette compagnie cima est reliée à une police"),
							HttpStatus.INTERNAL_SERVER_ERROR);
				}
			  
			  @Autowired
				private CimaCodificationCompagniRepository cimaCodificationCompagniRepository;
			  
			  @GetMapping(value = "/allCodecimacompagnie")
			    public ResponseEntity<?> getAllCimaCode() {
				  List<Cimacodificationcompagnie> cimacode = cimaCodificationCompagniRepository.findAll();
				  System.out.println("liste des codecompagnies : " + cimacode);
					return new ResponseEntity<List<Cimacodificationcompagnie>>(cimaCodificationCompagniRepository.findAll(), HttpStatus.OK);
					
					
				}

			  @PostMapping("report/{format}")
				public @ResponseBody void generateReportCompagnie(HttpServletResponse response, @PathVariable String format,
						@RequestParam("title") String title, @RequestParam("demandeur") String demandeur)
						throws JRException, FileNotFoundException {

					compagnieService.generateReportCompagnie(response, format, title, demandeur);
				}
			  

}
