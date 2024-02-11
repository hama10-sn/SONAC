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

import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Acte;
import sn.jmad.sonac.model.Contact;
import sn.jmad.sonac.model.Engagement;
import sn.jmad.sonac.model.Lot;
import sn.jmad.sonac.model.MainLeve;
import sn.jmad.sonac.repository.ActeRepository;
import sn.jmad.sonac.repository.EngagementRepository;
import sn.jmad.sonac.repository.LotRepository;
import sn.jmad.sonac.repository.MainLeveRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/mainleve/*")
public class MainLeveController {
	@Autowired
	private MainLeveRepository mainRepository;
	
	@Autowired
	private EngagementRepository engagementRepository;
	
	@Autowired
	private ActeRepository acteRepository;
	
	@GetMapping(value = "/allMainleve")
    public ResponseEntity<?> getAllLots() {
        List<MainLeve> mainleves = mainRepository.allMainLeves();
        System.out.println("liste des lot : " + mainleves);
        if (mainleves==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.FOUND);
        
        
        return new ResponseEntity<List<MainLeve>>(mainleves, HttpStatus.OK);
    }
	
	@PostMapping("/addMainleve")
	public ResponseEntity<?> addLot( @RequestBody MainLeve mainLeve){
		Long numMain;
		MainLeve mainLeveExist = mainRepository.findbyCode(mainLeve.getMainl_nummainlevee());
		if(mainLeveExist != null) {
			return new ResponseEntity<>(new ResponseMessage("Ce code main leve existe deja !"),
					HttpStatus.BAD_REQUEST);
		}
		
		//acte.setActive(1);
		MainLeve ml = mainRepository.save(mainLeve);
		Engagement engagement=engagementRepository.findEng(ml.getMainl_numeroengagement());
		if(engagement.getEngag_capitalliberationengage()==null) {
			engagement.setEngag_capitalliberationengage(ml.getMainl_mtnmainlevee());
		}else {
			engagement.setEngag_capitalliberationengage(engagement.getEngag_capitalliberationengage() + ml.getMainl_mtnmainlevee());
		}
		engagement.setEngag_kapassure(engagement.getEngag_kapassure() - ml.getMainl_mtnmainlevee());
		Acte acte =acteRepository.findbyCode(engagement.getEngag_numeroacte());
		acte.setAct_capitalassure(acte.getAct_capitalassure()-ml.getMainl_mtnmainlevee());
		acteRepository.save(acte);
		engagement.setEngag_dateliberation(new Date());
		engagementRepository.save(engagement);
		
		numMain= mainLeve.getMainl_nummainlevee();
		if(ml == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		

		 
          return new ResponseEntity<ResponseMessage>(new ResponseMessage("Main leve " + numMain + " enregistré"), HttpStatus.OK) ;
		//return new ResponseEntity<>(mainLeve,	HttpStatus.OK);
		
	}
	
	@PutMapping("/editMainLeve")
	public ResponseEntity<?> editClauseLot( @RequestBody MainLeve mainleve){
		MainLeve mainUpdate =mainRepository.findbyCode(mainleve.getMainl_nummainlevee());
		//acte.setActive(1);
		mainleve.setMainl_id(mainUpdate.getMainl_id());
		MainLeve ml = mainRepository.save(mainleve);
		if(ml == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		
		
		return new ResponseEntity<>(new ResponseMessage("Main leve modifié"),
				HttpStatus.OK);
		
	}
	 @GetMapping(value = "/allMainLeveByEngagement/{id}")
	    public ResponseEntity<?> allMainLeveByengagement(@PathVariable(value = "id") Long id) {
		  List<MainLeve> engagements = mainRepository.AllMainLeveByEngagement(id);
		 // int produitbyPolice = contactRepository.findNbLeaderByClient(id);
	        System.out.println("liste des main leve : " + engagements);
	        if (engagements.isEmpty())
	        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide"), HttpStatus.OK);		         
	        
	        	return new ResponseEntity<List<MainLeve>>(engagements, HttpStatus.OK);
	    }
}
