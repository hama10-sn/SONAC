package sn.jmad.sonac.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.CreditExport;
import sn.jmad.sonac.repository.CreditExportRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/creditExport/*")
public class CreditExportController {
	
	@Autowired
	private CreditExportRepository creditExportRepository;
	
	
	@GetMapping(value = "/allCreditExports")
    public ResponseEntity<?> getAllCreditExports() {
        List<CreditExport> creditExports = creditExportRepository.findAll();
        System.out.println("liste des creditExports : " + creditExports);
        if (creditExports==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
        
        
        return new ResponseEntity<List<CreditExport>>(creditExports, HttpStatus.OK);
    }
	
	@PostMapping("/addCreditExport")
	public ResponseEntity<?> addCreditExport( @RequestBody CreditExport creditExport){
		
		CreditExport gr = creditExportRepository.save(creditExport);
		if(gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(creditExport,
				HttpStatus.OK);
		
	}
	
/*	@PutMapping("/editCreditExport")
	public ResponseEntity<?> editCreditExport( @RequestBody CreditExport creditExport){
		CreditExport creditExportUpdate = creditExportRepository.findByIdd(creditExport.getRisq_numero());
		creditExport.setRisq_status("Actif");
		creditExport.setRisq_id(creditExportUpdate.getRisq_id());
		CreditExport gr = creditExportRepository.save(creditExport);
		if(gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("creditExport modifié"),
				HttpStatus.OK);
		
	}*/

	@DeleteMapping("/delete/{code}")
	public ResponseEntity<?> delCredit(@PathVariable("code") Long code){
		
		
		creditExportRepository.deleteById(code);
			return new ResponseEntity<>(new ResponseMessage("credit supprimé"),
					HttpStatus.OK);		

	}

}
