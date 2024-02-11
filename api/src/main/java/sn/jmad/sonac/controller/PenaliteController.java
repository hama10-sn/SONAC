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
import sn.jmad.sonac.message.response.PenaliteFront;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Penalite;
import sn.jmad.sonac.model.Recours;
import sn.jmad.sonac.repository.PenaliteRepository;
import sn.jmad.sonac.service.PenaliteService;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/penalite/*")
public class PenaliteController {
	@Autowired
	private PenaliteService penaliteService;
	@Autowired
	private PenaliteRepository penaliteRepository;
	
	@PostMapping("/ajouterPenalite/{sini_id}")
	public ResponseEntity<?> ajouterPenalite(@PathVariable("sini_id") Long sini_id, @RequestBody PenaliteFront penaliteFront) {
		PenaliteFront resultat = penaliteService.ajouterPenalite(sini_id, penaliteFront);
		
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "Echec de l'ajout d'une pénalité !", resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "La pénalité " + resultat.getPenaliteForm().getPenalit_id() + " est ajoutée avec succès", resultat), HttpStatus.OK);
	}
	
	@GetMapping("/findPenaliteParMoratoire/{morate_num}")
	public ResponseEntity<?> getPenaliteParMoratoire(@PathVariable Long morate_num) {
		Penalite resultat = penaliteRepository.findPenaliteByMoratoire(morate_num);
		
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "Aucune pénalité pour ce moratoire", resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "Ce moratoire a une pénalité", resultat), HttpStatus.OK);
	}
	
	@GetMapping(value = "/findByNumCheque/{numCheque}")
	public ResponseEntity<?> findPenaliteByNumCheque(@PathVariable(value = "numCheque") String numCheque) {

		Penalite pen = penaliteRepository.existingChequeNumber(numCheque.trim());

		if (pen != null) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
					"Ce numéro de chèque est déjà utilisé pour un règlement financier!", pen), HttpStatus.OK);
		}

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
				"Ce numéro de chèque n'est pas encore utilisé pour le reglement financier!", pen), HttpStatus.OK);
	}

	@PostMapping("/encaisserPenalite/{sini_id}")
	public ResponseEntity<?> encaisserPenalite(@PathVariable("sini_id") Long sini_id, @RequestBody PenaliteFront penaliteFront) {

		PenaliteFront resultat = penaliteService.encaisserPenalite(sini_id, penaliteFront);
		
		if (resultat == null) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "Echec de l'encaissement de la pénalité !", resultat), HttpStatus.OK);
		}
		
		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "La pénalité " + resultat.getPenaliteForm().getPenalit_id() + " est encaissée avec succès", resultat), HttpStatus.OK);
	}
	
	@PostMapping("/recuEncaissementPenalite/{sini_id}")
	public @ResponseBody void downloadRecuEncaissementPenalite(HttpServletResponse response,
			@RequestParam("demandeur") String demandeur, @PathVariable Long sini_id) throws JRException, FileNotFoundException {
		penaliteService.downloadRecuEncaissementPenalite(response, demandeur, sini_id);
	}
}
