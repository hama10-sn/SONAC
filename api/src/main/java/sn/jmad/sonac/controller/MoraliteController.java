package sn.jmad.sonac.controller;

import java.io.FileNotFoundException;
import java.util.Date;

import javax.servlet.http.HttpServletResponse;

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
import sn.jmad.sonac.message.response.MoratoireFront;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Moratoire;
import sn.jmad.sonac.model.Recours;
import sn.jmad.sonac.repository.MoratoireRepository;
import sn.jmad.sonac.service.MoratoireService;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/moratoire/*")
public class MoraliteController {
	@Autowired
	private MoratoireRepository moratoireRepository;
	@Autowired
	private MoratoireService moratoireService;
	
	@PostMapping("/ajouterMoratoire/{sini_id}")
	public ResponseEntity<?> ajouterMoratoire(@PathVariable("sini_id") Long sini_id, @RequestBody MoratoireFront moratoireFront) {
		MoratoireFront resultat = moratoireService.ajouterMoratoire(sini_id, moratoireFront);
		
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "Echec de l'ajout d'un moratoire !", resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "L'ajout du moratoire " + resultat.getMoratoireForm().getMorato_num() + " crée avec succès", resultat), HttpStatus.OK);
	}

	@GetMapping("/findMoratoireBySinistre/{morato_sini}")
	public ResponseEntity<?> getMoratoireBySinistre(@PathVariable Long morato_sini) {
		Moratoire resultat = moratoireRepository.findMoratoireBySinistre(morato_sini);
		
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "Aucun moratoire pour ce sinistre", resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "Ce sinistre a un moratoire", resultat), HttpStatus.OK);
	}
	
	@PutMapping("/modifierMoratoire/{morato_num}")
	public ResponseEntity<?> modifierMoratoire(@PathVariable Long morato_num, @RequestBody Moratoire moratoire) {
		Moratoire recupere = moratoireRepository.findById(morato_num).orElseThrow(() -> new RuntimeException("Le moratoire sélectionné n'existe pas!"));
		recupere.setMorato_mtmoratoire(moratoire.getMorato_mtmoratoire());
		recupere.setMorato_typecheanc(moratoire.getMorato_typecheanc());
		recupere.setMorato_nbrecheancacc(moratoire.getMorato_nbrecheancacc());
		recupere.setMorato_mtecheanc(moratoire.getMorato_mtecheanc());
		recupere.setMorato_nbrecheancimp(moratoire.getMorato_nbrecheancimp());
		recupere.setMorato_mtnechimpayee(moratoire.getMorato_mtnechimpayee());
		recupere.setMorato_mtnencaiss(moratoire.getMorato_mtnencaiss());
		recupere.setMorato_datemiseplace(moratoire.getMorato_datemiseplace());
		recupere.setMorato_datech(moratoire.getMorato_datech());
		recupere.setMorato_datemo(new Date());
		Moratoire resultat = moratoireRepository.save(recupere);
		
		if(resultat == null) 
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "Echec de la modification du moratoire", resultat), HttpStatus.OK);
		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "Le moratoire "+resultat.getMorato_num()+" est modifié avec succès", resultat), HttpStatus.ACCEPTED);
	}
	
	@PostMapping("/annulerMoratoire/{sini_id}")
	public ResponseEntity<?> annulerMoratoire(@PathVariable Long sini_id, @RequestBody MoratoireFront moratoireFront) {
		MoratoireFront resultat = moratoireService.annulerMoratoire(sini_id, moratoireFront);
		
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "Echec de l'annulation du moratoire !", resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "Le moratoire " + resultat.getMoratoireForm().getMorato_num() + " est annulé avec succès", resultat), HttpStatus.OK);
	}
	
	@GetMapping(value = "/findByNumCheque/{numCheque}")
	public ResponseEntity<?> findMoratoireByNumCheque(@PathVariable(value = "numCheque") String numCheque) {

		Moratoire morat = moratoireRepository.existingChequeNumber(numCheque.trim());

		if (morat != null) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
					"Ce numéro de chèque est déjà utilisé pour un règlement financier!", morat), HttpStatus.OK);
		}

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
				"Ce numéro de chèque n'est pas encore utilisé pour le reglement financier!", morat), HttpStatus.OK);
	}
	
	@PostMapping("/encaisserMoratoire/{sini_id}")
	public ResponseEntity<?> encaisserMoratoire(@PathVariable Long sini_id, @RequestBody MoratoireFront moratoireFront) {

		MoratoireFront resultat = moratoireService.encaisserMoratoire(sini_id, moratoireFront);
		
		if (resultat == null) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "Echec de l'encaissement du moratoire !", resultat), HttpStatus.OK);
		}
		
		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "Le moratoire " + resultat.getMoratoireForm().getMorato_num() + " est encaissé avec succès", resultat), HttpStatus.OK);
	}
	
	@PostMapping("/recuEncaissementMoratoire/{sini_id}")
	public @ResponseBody void downloadRecuEncaissementMoratoire(HttpServletResponse response,
			@RequestParam("demandeur") String demandeur, @PathVariable Long sini_id) throws JRException, FileNotFoundException {
		moratoireService.downloadRecuEncaissementMoratoire(response, demandeur, sini_id);
	}
}
