package sn.jmad.sonac.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Mvtsinistre;
import sn.jmad.sonac.model.Sinistre;
import sn.jmad.sonac.repository.MvtsinistreRepository;


@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/mvtsinistre/*")

public class MvtsinistreController {
	
	@Autowired
	MvtsinistreRepository mvtsinistreRepository;
	
	@GetMapping(value = "/findall")
	public ResponseEntity<?> findAllMvtSinistre() {

		List<Mvtsinistre> listeMvtSinistre = mvtsinistreRepository.findAll();

		if (listeMvtSinistre.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "liste des mouvements de sinistre est vide", null), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des mouvements de sinistre", listeMvtSinistre), HttpStatus.OK);
	}
	
	@GetMapping(value = "/findById/{num}")
	public ResponseEntity<?> findMvtSinistreById(@PathVariable Long num) {

		Optional<Mvtsinistre> mvtSinistre = mvtsinistreRepository.findById(num);
		if(mvtSinistre.isPresent()) {
			Mvtsinistre listeMvtSinistre = mvtSinistre.get();
			
			if (listeMvtSinistre == null)
				return new ResponseEntity<ResponseMessage>(
						new ResponseMessage("vide", "liste des mouvements de sinistre est vide", null), HttpStatus.OK);

			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("ok", "La liste des mouvements de sinistre", listeMvtSinistre), HttpStatus.OK);
		}
		

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("vide", "liste des mouvements de sinistre est vide", null), HttpStatus.OK);
	}
	
	@GetMapping(value = "/findByNumsinistre/{numsinistre}")
	public ResponseEntity<?> findAllMvtSinistreByNumSinistre(@PathVariable Long numsinistre) {

		List<Mvtsinistre> listeMvtSinistre = mvtsinistreRepository.findMvtsinistreByNumSinistre(numsinistre);

		if (listeMvtSinistre.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "liste des mouvements de sinistre par numero sinistre est vide", null), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des mouvements de sinistre par numéro de sinistre", listeMvtSinistre), HttpStatus.OK);
	}
		
	@GetMapping(value = "/getMvtsinistreByTypeMvtsAndSinistre/{mvts_numsinistre}/{mvts_typemvt}")
	public ResponseEntity<?> getMvtsinistreByTypeMvtsAndSinistre(@PathVariable Long mvts_numsinistre, @PathVariable Long mvts_typemvt) {

		List<Mvtsinistre> listeMvtSinistre = mvtsinistreRepository.getMvtsinistreByTypeMvtsAndSinistre(mvts_numsinistre, mvts_typemvt);

		if (listeMvtSinistre.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "liste des mouvements de sinistre par numero sinistre et type mouvement est vide", null), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des mouvements de sinistre par numéro de sinistre et type mouvement", listeMvtSinistre), HttpStatus.OK);
	}
	
	@GetMapping(value = "/getMvtsinistreByTypeMvts")
	public ResponseEntity<?> getMvtsinistreByTypeMvts() {

		List<Mvtsinistre> listeMvtSinistre = mvtsinistreRepository.getMvtsinistreByTypeMvtsAndStatus();

		if (listeMvtSinistre.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "liste des mouvements de sinistre par type mouvement est vide", null), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des mouvements de sinistre par type mouvement", listeMvtSinistre), HttpStatus.OK);
	}
	
	@GetMapping(value = "/getMoratoireEncaisse")
	public ResponseEntity<?> getMoratoireEncaisse() {

		List<Mvtsinistre> listeMvtSinistre = mvtsinistreRepository.getMoratoireEncaisse();

		if (listeMvtSinistre.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "liste des moratoires est vide", null), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des moratoires", listeMvtSinistre), HttpStatus.OK);
	}
}
