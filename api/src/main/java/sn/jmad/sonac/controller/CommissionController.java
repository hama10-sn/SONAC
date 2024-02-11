package sn.jmad.sonac.controller;

import java.util.List;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;

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

import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Accessoire;
import sn.jmad.sonac.model.Commission;
import sn.jmad.sonac.model.Intermediaire;
import sn.jmad.sonac.repository.CommissionRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/commission/*")

public class CommissionController {
	
	@Autowired
	CommissionRepository commissionRepository ;
	
	@PostMapping(value = "/addcommission")
	public ResponseEntity<?> saveCommission(@Valid @RequestBody Commission commission) {
	
		Long comm_code = commission.getComm_code();
		Commission commissionExistant = commissionRepository.findbyCode(comm_code);
		if(commissionExistant != null) {
			return new ResponseEntity<>(new ResponseMessage("Le code de cette commission existe déjà !"),
					HttpStatus.BAD_REQUEST);
		}
		
		//Date dateFinEffet = commission.getComm_datepriseffet() ;
		//commission.setComm_datefineffet(dateFinEffet);
		commissionRepository.save(commission) ;
		return new ResponseEntity<>(new ResponseMessage("Commission enregistrée avec succès !"), HttpStatus.OK) ;
	}
	
	@GetMapping(value = "/allcommission")
	public ResponseEntity<?>  getAllCommissions() {
		List<Commission> commissions = commissionRepository.findAllCommission();
		
		if(commissions.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste des commissions vide"), HttpStatus.OK) ;
		}
		
		return new ResponseEntity<List<Commission>>(commissions, HttpStatus.OK) ;
	}
	
	@GetMapping(value = "/findByCode/{code}")
	public ResponseEntity<?> getCommission(@PathVariable("code") Long code) {
		Optional<Commission> commission = commissionRepository.findById(code) ;
		if(commission.isPresent()) {
			Commission myCommission = commission.get();
			return new ResponseEntity<Commission>(myCommission, HttpStatus.OK) ;
		} else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("cette commission n'existe pas"), HttpStatus.OK) ;
		}
	}
	
//	@GetMapping(value = "/lastID/{numcategorie}/{codeapporteur}/{codegarantie}")
//	  public ResponseEntity<?> lastCodeCommission(@PathVariable("numcategorie") Long numcategorie,
//			  									  @PathVariable("codeapporteur") Long codeapporteur,
//			  									  @PathVariable("codegarantie") Long codegarantie) {
//		
//		  Long lastNumCommission= commissionRepository.lastCodeCommission(numcategorie, codeapporteur, codegarantie);
//		  if (lastNumCommission==null) {
//		  return new ResponseEntity<Long>((long) 0, HttpStatus.OK);
//		  }
//			  return new ResponseEntity<Long>(lastNumCommission, HttpStatus.OK);	  
//		  			  
//	  }
	
	@GetMapping(value = "/lastID/{numeroproduit}/{codeapporteur}")
	  public ResponseEntity<?> lastNumCommission(@PathVariable("numeroproduit") Long numeroproduit, 
			  									 @PathVariable("codeapporteur") Long codeapporteur) {
		
		Long lastNumCommission = commissionRepository.lastNumCommission(numeroproduit, codeapporteur) ;
		  if (lastNumCommission==null) {
			  return new ResponseEntity<Long>((long) 0, HttpStatus.OK);
		  }
		  
		  return new ResponseEntity<Long>(lastNumCommission, HttpStatus.OK);	  
	  }
	
	public static Date soustraireJour(Date date, int nbJour) { 
		  Calendar cal = Calendar.getInstance(); 
		  cal.setTime(date);
		  cal.add(Calendar.DAY_OF_MONTH, nbJour);
		  return cal.getTime();
		}
	
	@PutMapping(value = "/updateCommission/{id}")
	public ResponseEntity<?> updateCommission(@PathVariable(value = "id") Long id, @RequestBody Commission commission) {
		
		Long codeCommission ;
		Commission commissionUpdate = commissionRepository.findByIdd(id) ;
		if(commissionUpdate == null) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("cette commission n'existe pas"), HttpStatus.INTERNAL_SERVER_ERROR);
		}
        
//		commissionUpdate.setComm_datefineffet(soustraireJour(commission.getComm_datepriseffet(), -1));
//		Commission commissiontoUpdated = commissionRepository.save(commissionUpdate) ;

		// ==================== On joute ces quelques lignes ==========================
		commission.setComm_id(commissionUpdate.getComm_id());
		//==================== =========================================================
		Commission commissionUpdated = commissionRepository.save(commission) ;
		codeCommission = commissionUpdated.getComm_code() ;
		
		return new ResponseEntity<ResponseMessage>(new ResponseMessage("commission "+ codeCommission + " modifié avec succès "), HttpStatus.OK);
		
//		return new ResponseEntity<ResponseMessage>(new ResponseMessage("commission modifiée avec succès "+ commissiontoUpdated), HttpStatus.OK);
	}
	
//	@PutMapping(value = "/updateCommission")
//	public ResponseEntity<?> updateCommission( @RequestBody Commission commission) {
//		
//		Optional<Commission> com = commissionRepository.findById(commission.getComm_code());
//		if(com.isPresent()) { 
//			Commission currentCommission = com.get();
//			
//			currentCommission.setComm_codeapporteur(commission.getComm_codeapporteur());
//			currentCommission.setComm_codebranche(commission.getComm_codebranche());
//			currentCommission.setComm_codecategorie(commission.getComm_codecategorie());
//			currentCommission.setComm_codeproduit(commission.getComm_codeproduit());
//			currentCommission.setComm_codegarantie(commission.getComm_codegarantie());
//			currentCommission.setComm_typecalcul(commission.getComm_typecalcul());
//			currentCommission.setComm_interv1(commission.getComm_interv1());
//			currentCommission.setComm_interv2(commission.getComm_interv2());
//			currentCommission.setComm_interv3(commission.getComm_interv3());
//			currentCommission.setComm_interv4(commission.getComm_interv4());
//			currentCommission.setComm_interv5(commission.getComm_interv5());
//			currentCommission.setComm_interv6(commission.getComm_interv6());
//			currentCommission.setComm_interv7(commission.getComm_interv7());
//			currentCommission.setComm_interv8(commission.getComm_interv8());
//			currentCommission.setComm_interv9(commission.getComm_interv9());
//			currentCommission.setComm_interv10(commission.getComm_interv10());
//			currentCommission.setComm_tauxcommission12(commission.getComm_tauxcommission12());
//			currentCommission.setComm_montantforfait12(commission.getComm_montantforfait12());
//			currentCommission.setComm_tauxcommission34(commission.getComm_tauxcommission34());
//			currentCommission.setComm_montantforfait34(commission.getComm_montantforfait34());
//			currentCommission.setComm_tauxcommission56(commission.getComm_tauxcommission56());
//			currentCommission.setComm_montantforfait56(commission.getComm_montantforfait56());
//			currentCommission.setComm_tauxcommission78(commission.getComm_tauxcommission78());
//			currentCommission.setComm_montantforfait78(commission.getComm_montantforfait78());
//			currentCommission.setComm_tauxcommission910(commission.getComm_tauxcommission910());
//			currentCommission.setComm_montantforfait910(commission.getComm_montantforfait910());
//			currentCommission.setComm_datepriseffet(commission.getComm_datepriseffet());
//			currentCommission.setComm_datefineffet(commission.getComm_datefineffet());
//			
//			commissionRepository.save(currentCommission) ;
//			//return new ResponseEntity<ResponseMessage>(new ResponseMessage("Commission modifiée avec succès"), HttpStatus.OK) ;
//			return new ResponseEntity<Commission>(currentCommission, HttpStatus.OK) ;
//		} else {
//			return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de la modification"), HttpStatus.NOT_FOUND) ;
//		}
//	}

}
