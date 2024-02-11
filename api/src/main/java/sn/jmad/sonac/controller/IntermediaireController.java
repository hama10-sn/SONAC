package sn.jmad.sonac.controller;


import java.text.Normalizer;
import java.io.FileNotFoundException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import sn.jmad.sonac.model.Categorie;
import sn.jmad.sonac.model.Intermediaire;
import sn.jmad.sonac.model.Police;
import sn.jmad.sonac.repository.IntermediaireRepository;
import sn.jmad.sonac.repository.PoliceRepository;
import sn.jmad.sonac.service.IntermediaireService;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/intermediaire/*")

public class IntermediaireController {
	
	@Autowired
	IntermediaireRepository intermediaireRepository ;
	@Autowired
	PoliceRepository policeRepository ;
	@Autowired
	IntermediaireService intermediaireService ;
	
	@PostMapping(value = "/addintermediaire")
	public ResponseEntity<?> saveInrtermediaire(@Valid @RequestBody Intermediaire intermediaire) {
	
		Long inter_numero = intermediaire.getInter_numero();
		Intermediaire intermediaireExistant = intermediaireRepository.findbyCode(inter_numero) ;
		if(intermediaireExistant != null) {
			return new ResponseEntity<>(new ResponseMessage("Le numéro de cet intermédiaire existe déjà !"),
					HttpStatus.BAD_REQUEST);
		}
		
		String denominationInter = intermediaire.getInter_denomination().trim() ;
		List<Intermediaire> interExistant = intermediaireRepository.findIntermediaireByDenomination(denominationInter) ;
		if(!interExistant.isEmpty()) {
			return new ResponseEntity<>(new ResponseMessage("Cet intermédiaire existe déjà: Vérifiez la dénomination !"),
					HttpStatus.BAD_REQUEST);
		}
		
		if (!intermediaireRepository.findByMail(intermediaire.getInter_email().trim()).isEmpty()) {
			return new ResponseEntity<>(new ResponseMessage("Cet email existe deja !"),
					HttpStatus.BAD_REQUEST);
		}

		if (intermediaireRepository.findByNumeroAgrementAvectypeCourtier(intermediaire.getInter_numagrement())!=null) {
			return new ResponseEntity<>(new ResponseMessage("il existe déjà un courtier avec ce numéro d'agrément"),
					HttpStatus.BAD_REQUEST);
		}
		
		if (intermediaireRepository.findByTelephone1(intermediaire.getInter_telephone1())!=null) {
			return new ResponseEntity<>(new ResponseMessage("Ce numéro téléphone existe deja !"),
					HttpStatus.BAD_REQUEST);
		}

		
		Date dateModification = new Date() ;
		intermediaire.setInter_datemodification(dateModification);
		intermediaire.setActive(1);
		intermediaire.setInter_denomination(denominationInter);
		
		Intermediaire inter = intermediaireRepository.save(intermediaire) ;
		if(inter == null)
				return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
						HttpStatus.INTERNAL_SERVER_ERROR);
		
		return new ResponseEntity<>(new ResponseMessage("Intermediaire enregistré avec succès !"), HttpStatus.OK) ;
	}
	
	@GetMapping(value = "/allintermediaire")
	public ResponseEntity<?>  getAllIntermediaires() {
		List<Intermediaire> intermediaires = intermediaireRepository.findAllIntermediaire() ;
		
		if(intermediaires.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste des intermediaires vide"), HttpStatus.OK) ;
		}
		
		return new ResponseEntity<List<Intermediaire>>(intermediaires, HttpStatus.OK) ;
	}
	
//	@GetMapping(value = "/findByNumero/{numero}")
//	public ResponseEntity<?> getBranche(@PathVariable("numero") Long numero) {
//		Optional<Branche> branche = brancheRepository.findById(numero) ;
//		if(branche.isPresent()) {
//			Branche myBranche = branche.get() ;
//			return new ResponseEntity<Branche>(myBranche, HttpStatus.OK) ;
//		} else {
//			return new ResponseEntity<ResponseMessage>(new ResponseMessage("cette branche n'existe pas"), HttpStatus.OK) ;
//		}
//	}
	
	@PutMapping(value = "/updateIntermediaire")
	public ResponseEntity<?> updateIntermediaire( @RequestBody Intermediaire intermediaire) {
		
		Optional<Intermediaire> inter = intermediaireRepository.findById(intermediaire.getInter_numero()) ;
		if(inter.isPresent()) {
			
			Intermediaire currentInter = inter.get() ;
			
			String denominationInter = intermediaire.getInter_denomination() ;
			List<Intermediaire> interExistant = intermediaireRepository.findIntermediaireByDenomination(unaccent(denominationInter)) ;
			
			if(interExistant != null) {
				    for(int i=0;i<interExistant.size();i++) {
				    	Long numeroInter = interExistant.get(i).getInter_numero();
				    	if(numeroInter != intermediaire.getInter_numero()) {
				    		return new ResponseEntity<>(new ResponseMessage("Cet intermédiaire existe déjà: Vérifier la dénomination !"),
									HttpStatus.BAD_REQUEST);
				    	}
				    }
					
			} 
			/*String emailInter = intermediaire.getInter_email() ;
			List<Intermediaire> interExistant1 = intermediaireRepository.findByMail(emailInter) ;
			if(interExistant1!=null) {
				    
				for(int i=0;i<interExistant1.size();i++) {
			    	Long numeroInter = interExistant1.get(i).getInter_numero();
			    	if(numeroInter != intermediaire.getInter_numero()) {
			    		return new ResponseEntity<>(new ResponseMessage("Cet intermédiaire existe déjà: Vérifier la dénomination !"),
								HttpStatus.BAD_REQUEST);
			    	}
			    }
			}
			
			
			
			/*if(!(intermediaire.getInter_email().trim().toUpperCase().equalsIgnoreCase(emailInter)) && interExistant1 != null) {
				
					return new ResponseEntity<>(new ResponseMessage("Cet intermédiaire existe déjà: Vérifier l'email !"),
							HttpStatus.BAD_REQUEST);
			}
			
			/*String telephone1Inter = intermediaire.getInter_telephone1().trim().toUpperCase() ;
			Intermediaire interExistant2 = intermediaireRepository.findByTelephone1(telephone1Inter) ;
			
			if(!(intermediaire.getInter_telephone1().trim().toUpperCase().equalsIgnoreCase(currentInter.getInter_telephone1())) && interExistant2 != null) {
				
					return new ResponseEntity<>(new ResponseMessage("Cet intermédiaire existe déjà: Vérifier le téléphone 1 !"),
							HttpStatus.BAD_REQUEST);
			}*/
			
			String numeroAgrementCourtierInter = intermediaire.getInter_numagrement().trim().toUpperCase() ;
			Intermediaire interExistant3 = intermediaireRepository.findByNumeroAgrementAvectypeCourtier(numeroAgrementCourtierInter) ;
			
			if(!(intermediaire.getInter_numagrement().trim().toUpperCase().equalsIgnoreCase(currentInter.getInter_numagrement())) && interExistant3 != null) {
				
					return new ResponseEntity<>(new ResponseMessage("Cet intermédiaire existe déjà: Vérifier la denomination !"),
							HttpStatus.BAD_REQUEST);
			}
			
			currentInter.setInter_arriere(intermediaire.getInter_arriere());
			currentInter.setInter_boitepostale(intermediaire.getInter_boitepostale());
			currentInter.setInter_caportefeuille(intermediaire.getInter_caportefeuille());
			currentInter.setInter_classificationmetier(intermediaire.getInter_classificationmetier());
			currentInter.setInter_codecommission(intermediaire.getInter_codecommission());
			currentInter.setInter_codeutilisateur(intermediaire.getInter_codeutilisateur());
			currentInter.setInter_denomination(intermediaire.getInter_denomination().trim().toUpperCase());
			currentInter.setInter_denominationcourt(intermediaire.getInter_denominationcourt());
			currentInter.setInter_dureemoyenne(intermediaire.getInter_dureemoyenne());
			currentInter.setInter_email(intermediaire.getInter_email());
			currentInter.setInter_montantcommission(intermediaire.getInter_montantcommission());
			currentInter.setInter_objectifcaannuel(intermediaire.getInter_objectifcaannuel());
			currentInter.setInter_portable(intermediaire.getInter_portable());
			currentInter.setInter_quartierville(intermediaire.getInter_quartierville());
			currentInter.setInter_rue(intermediaire.getInter_rue());
			currentInter.setInter_sinistralite(intermediaire.getInter_sinistralite());
			currentInter.setInter_telephone1(intermediaire.getInter_telephone1());
			currentInter.setInter_telephone2(intermediaire.getInter_telephone2());
			currentInter.setInter_numagrement(intermediaire.getInter_numagrement());
			currentInter.setInter_datentrerelation(intermediaire.getInter_datentrerelation());
			currentInter.setInter_datedebutcarteagrement(intermediaire.getInter_datedebutcarteagrement());
			currentInter.setInter_autorisation(intermediaire.getInter_autorisation());
			currentInter.setInter_anneeexercice(intermediaire.getInter_anneeexercice());
			
			
			
			intermediaireRepository.save(currentInter) ;
			
			return new ResponseEntity<Intermediaire>(currentInter, HttpStatus.OK) ;
		} else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de la modification de l'intermediaire"), HttpStatus.NOT_FOUND) ;
		}
	}
	
	@GetMapping("/deleteIntermediaire/{num}")
	public ResponseEntity<?> deleteIntermediaire(@PathVariable("num") long num ){
		
		Intermediaire inter = intermediaireRepository.findbyCode(num);
		if(inter != null) {
			inter.setActive(0);
			intermediaireRepository.save(inter) ;
			return new ResponseEntity<>(new ResponseMessage("intermediaire supprimé"),
					HttpStatus.OK);
		}
		
		return new ResponseEntity<>(new ResponseMessage("suppréssion impossible"),
				HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@GetMapping("/verifDeleteIntermediaire/{num}")
	public ResponseEntity<?> verifdeleteIntermediaire(@PathVariable("num") Long num){
		
		List<Police> polices = policeRepository.findPoliceByIntermediaire(num) ;
		if(polices.isEmpty()) {
			
			return new ResponseEntity<>(new ResponseMessage("ok"),
					HttpStatus.OK);
		}
		
		return new ResponseEntity<>(new ResponseMessage("suppréssion impossible: cet intermédiaire est relié à une police"),
				HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@PostMapping("report/{format}")
	public @ResponseBody void generateReportIntermediaire(HttpServletResponse response, @PathVariable String format,
			@RequestParam("title") String title, @RequestParam("demandeur") String demandeur)
			throws JRException, FileNotFoundException {

		intermediaireService.generateReportIntermediaire(response, format, title, demandeur);
	}
	
	public static String unaccent(String text) { return Normalizer.normalize(text, Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", ""); }
	
//	@GetMapping(value = "/allintermediaireByDenomination/{denomination}")
//	public ResponseEntity<?>  getAllIntermediaireByDenomination(@PathVariable("denomination") String denomination) {
//		List<Intermediaire> intermediaires = intermediaireRepository.findAllIntermediaireByDenomination(denomination) ;
//		
//		if(intermediaires.isEmpty()) {
//			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste des intermediaires par dénomination vide"), HttpStatus.OK) ;
//		}
//		
//		return new ResponseEntity<List<Intermediaire>>(intermediaires, HttpStatus.OK) ;
//	}
	
	@GetMapping("/getIntermediaire/{num}")
	public ResponseEntity<?> getIntermediaire(@PathVariable("num") Long num){
		
		Intermediaire inter = intermediaireRepository.findbyCode(num);
		
		return new ResponseEntity<Intermediaire>(inter, HttpStatus.OK);
	}
	
}
