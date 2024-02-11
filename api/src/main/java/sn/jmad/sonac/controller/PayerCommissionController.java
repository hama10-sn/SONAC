package sn.jmad.sonac.controller;

import java.util.Date;
import java.util.List;

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

import sn.jmad.sonac.message.response.AllCom;
import sn.jmad.sonac.message.response.DisplayAllCom;
import sn.jmad.sonac.message.response.InfoCommission;
import sn.jmad.sonac.message.response.PayCommission;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Facture;
import sn.jmad.sonac.model.PayerCommission;
import sn.jmad.sonac.repository.FactureRepository;
import sn.jmad.sonac.repository.PayerCommissionRepository;
import sn.jmad.sonac.service.EncaissementService;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/payerCommission/*")
public class PayerCommissionController {
	
	@Autowired
	private PayerCommissionRepository payerCommissionRepository;
	
	@Autowired
	private FactureRepository factureRepository;
	
	@Autowired
	private EncaissementService encaissementService;
	

	@PostMapping(value = "/allPayerCommissions")
    public ResponseEntity<?> allPayerCommissions(@RequestBody InfoCommission info) {
        List<DisplayAllCom> payerCommissions = payerCommissionRepository.findallcominter(info.getDate_debut(),info.getDate_fin());
        
        return new ResponseEntity<List<DisplayAllCom>>(payerCommissions, HttpStatus.OK);
    }
	
	@PostMapping(value = "/PayerCommissions")
    public ResponseEntity<?> PayerCommissions(@RequestBody AllCom allcom ) {
        
        System.out.println(allcom.toString());
        

			List<Facture> facts = factureRepository.allFacturesIntermediarePeriode(allcom.getInfoCom().getIntermediaire(),
					allcom.getInfoCom().getDate_debut(), allcom.getInfoCom().getDate_fin());

			encaissementService.payerCommission(facts, allcom.getInfoCom(), allcom.getCheque());
			
			return new ResponseEntity<>(new ResponseMessage("paiement des commissions de l'intermediaire N° "+allcom.getInfoCom().getIntermediaire()+" éffectué"), HttpStatus.OK);

		
        
    }
	
	
	@PostMapping("/addPayerCommission")
	public ResponseEntity<?> addPayerCommission( @RequestBody PayerCommission payerCommission){
		
		PayerCommission addPayerCommissionExist = payerCommissionRepository.findbyCode(payerCommission.getPcom_numpaie());
		if(addPayerCommissionExist != null) {
			return new ResponseEntity<>(new ResponseMessage("Ce code de paiement commission n'existe deja !"),
					HttpStatus.BAD_REQUEST);
		}
		
		payerCommission.setActive(1L);
		PayerCommission pC = payerCommissionRepository.save(payerCommission);
		if(pC == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("paiement commission enregistré"),
				HttpStatus.OK);
		
	}
	
	@PutMapping("/editPayerCommission")
	public ResponseEntity<?> editGroupe( @RequestBody PayerCommission payerCommission){
		PayerCommission payerCommissionUpdate = payerCommissionRepository.findbyCode(payerCommission.getPcom_numpaie());
		payerCommissionUpdate.setActive(1L);
		payerCommissionUpdate.setPcom_numpaie(payerCommission.getPcom_numpaie());
		PayerCommission pC = payerCommissionRepository.save(payerCommission);
		if(pC == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("paiement commission modifié "),
				HttpStatus.OK);
		
	}

}
