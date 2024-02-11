package sn.jmad.sonac.controller;

import java.io.FileNotFoundException;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import net.sf.jasperreports.engine.JRException;
import sn.jmad.sonac.message.response.RecoursFront;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.message.response.ValidationsFront;
import sn.jmad.sonac.model.Mvtsinistre;
import sn.jmad.sonac.model.Recours;
import sn.jmad.sonac.repository.RecoursRepository;
import sn.jmad.sonac.service.RecoursService;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/recours/*")
public class RecoursController {
	@Autowired
	private RecoursService service;
	@Autowired
	private RecoursRepository recoursRepository;
	
	@PostMapping(value = "/ajoutRecours/{sini_id}")
	public ResponseEntity<?> ajouterPropositionRecours(@PathVariable("sini_id") Long sini_id, @RequestBody RecoursFront recoursFront) {
		RecoursFront resultat = service.ajoutPropositionRecours(sini_id, recoursFront);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
					"Echec de la création de la proposition de recours !", resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
				"Proposition de recours " + resultat.getMvtsinistreForm().getMvts_id() + " crée avec succès",
				resultat), HttpStatus.OK);
	}
	
	@PostMapping(value = "/annulationProposition/{sini_id}")
	public ResponseEntity<?> annulationPropositionRecours(@PathVariable("sini_id") Long sini_id, @RequestBody RecoursFront recoursFront) {
		Mvtsinistre resultat = service.annulationPropositionRecours(sini_id, recoursFront);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
					"Echec de l'annulation de la proposition de recours !", resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
				"Proposition de recours " + resultat.getMvts_id() + " annulée avec succès",
				resultat), HttpStatus.OK);
	}
	
	@PostMapping(value = "/validationRecours/{sini_id}")
	public ResponseEntity<?> validationRecours(@PathVariable("sini_id") Long sini_id, @RequestBody ValidationsFront validationsFront) {
		ValidationsFront resultat = service.validationRecours(sini_id, validationsFront);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
					"Echec de la validation du recours !", resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
				"Le recours n°" + resultat.getRecoursForm().getRecou_id() + " est validé avec succès",
				resultat), HttpStatus.OK);
	}
	
	@PostMapping(value = "/annulationValidationRecours/{sini_id}")
	public ResponseEntity<?> annulationValidationRecours(@PathVariable("sini_id") Long sini_id, @RequestBody ValidationsFront validationsFront) {
		ValidationsFront resultat = service.annulationValidationRecours(sini_id, validationsFront);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
					"Echec de l'annulation de la validation du recours !", resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
				"La validation du recours n°" + resultat.getRecoursForm().getRecou_id() + " est annulée avec succès",
				resultat), HttpStatus.OK);
	}
	
	@GetMapping(value = "/findByNumCheque/{numCheque}")
	public ResponseEntity<?> findRecoursByNumCheque(@PathVariable(value = "numCheque") String numCheque) {

		Recours recours = recoursRepository.existingChequeNumber(numCheque.trim());

		if (recours != null) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
					"Ce numéro de chèque est déjà utilisé pour un règlement financier!", recours), HttpStatus.OK);
		}

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
				"Ce numéro de chèque n'est pas encore utilisé pour le reglement financier!", recours), HttpStatus.OK);
	}

	
	@PostMapping(value = "/validationRecoursEncaisse/{sini_id}")
	public ResponseEntity<?> validationRecoursEncaisse(@PathVariable("sini_id") Long sini_id, @RequestBody ValidationsFront validationsFront) {
		Recours rec = recoursRepository.existingChequeNumber(validationsFront.getRecoursForm().getRecou_numchq());
		
		if(rec != null) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
					"Le numéro de chèque est déjà utilisé!", rec), HttpStatus.OK);
		}
		
		ValidationsFront resultat = service.validationRecoursEncaisse(sini_id, validationsFront);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
					"Echec de la validation du recours encaissé !", resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
				"Le recours encaissé n°" + resultat.getRecoursForm().getRecou_id() + " est validé avec succès",
				resultat), HttpStatus.OK);
	}
	
	@PostMapping(value = "/annulationValidationRecoursEncaisse/{sini_id}")
	public ResponseEntity<?> annulationValidationRecoursEncaisse(@PathVariable("sini_id") Long sini_id, @RequestBody ValidationsFront validationsFront) {
		ValidationsFront resultat = service.annulationRecoursEncaisse(sini_id, validationsFront);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
					"Echec de l'annulation de la validation du recours encaissé !", resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
				"La validation du recours encaissé n°" + resultat.getRecoursForm().getRecou_id() + " est annulée avec succès",
				resultat), HttpStatus.OK);
	}
	
	@PostMapping("/editerFichierPropositionRecours/{sini_id}")
	public @ResponseBody void generateEditionFichePropositionRecours(HttpServletResponse response,
			@RequestParam("demandeur") String demandeur, @PathVariable Long sini_id) throws JRException, FileNotFoundException {
		service.generateEditionFichePropositionRecours(response, demandeur, sini_id);
	}
	
	@PostMapping("/editerFichierRecoursEncaisse/{mvts_num}")
	public @ResponseBody void generateEditionFicheRecoursEncaisse(HttpServletResponse response,
			@RequestParam("demandeur") String demandeur, @PathVariable Long mvts_num) throws JRException, FileNotFoundException {
		service.generateEditionFicheRecoursEncaisse(response, demandeur, mvts_num);
	}
	
	@PostMapping("/fichierPropositionRecours/{demandeur}")
	public @ResponseBody void generateFichePropositionRecours(HttpServletResponse response,
		@PathVariable String demandeur, @RequestBody RecoursFront recoursFront) throws JRException, FileNotFoundException {
		service.generateFichePropositionRecours(response, demandeur, recoursFront);
	}
	
	@PostMapping("/fichierRecoursEncaisse/{demandeur}")
	public @ResponseBody void generateFicheRecoursEncaisse(HttpServletResponse response,
		@PathVariable String demandeur, @RequestBody ValidationsFront validationsFront) throws JRException, FileNotFoundException {
		service.generateFicheRecoursEncaisse(response, demandeur, validationsFront);
	}
	
	@PostMapping("/recuEncaissementRecours/{sini_id}")
	public @ResponseBody void downloadRecuEncaissementRecours(HttpServletResponse response,
			@RequestParam("demandeur") String demandeur, @PathVariable Long sini_id) throws JRException, FileNotFoundException {
		service.downloadRecuEncaissementRecours(response, demandeur, sini_id);
	}
}
