package sn.jmad.sonac.controller;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import sn.jmad.sonac.model.Classification_secteur;
import sn.jmad.sonac.model.Groupe;
import sn.jmad.sonac.repository.ClassificationSecteurRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/classificationSecteur/*")
public class ClassificationSecteurController {
	
	@Autowired
	private ClassificationSecteurRepository classificationSecteurRepository;
	
	
	@GetMapping(value = "/allClassifications")
    public ResponseEntity<?> getAllClassifications() {
		return new ResponseEntity<List<Classification_secteur>>(classificationSecteurRepository.findAll(), HttpStatus.OK);
	}
	
	@GetMapping(value = "/findLibelleByCode/{code}")
	public ResponseEntity<?> getLibelleByCode(@PathVariable("code") Long code) {
		
			Classification_secteur classifcation = classificationSecteurRepository.findLibellebyCode(code) ;
			return new ResponseEntity<Classification_secteur>(classifcation, HttpStatus.OK) ;
		
//			return new ResponseEntity<ResponseMessage>(new ResponseMessage("cette branche n'existe pas"), HttpStatus.OK) ;
	}



}
