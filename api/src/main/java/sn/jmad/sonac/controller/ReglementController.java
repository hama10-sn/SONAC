package sn.jmad.sonac.controller;

import java.io.FileNotFoundException;
import java.util.List;

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
import sn.jmad.sonac.message.response.PropositionReglementFront;
import sn.jmad.sonac.message.response.ReglementFinancier;
import sn.jmad.sonac.message.response.ReglementFront;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.message.response.SinistreFront;
import sn.jmad.sonac.message.response.SinistreMouvement;
import sn.jmad.sonac.message.response.SinistreMouvementReglement;
import sn.jmad.sonac.message.response.ValidationReglementFront;
import sn.jmad.sonac.model.Client;
import sn.jmad.sonac.model.Reglement;
import sn.jmad.sonac.model.Sinistre;
import sn.jmad.sonac.repository.ReglementRepository;
import sn.jmad.sonac.service.ReglementService;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/sinistre/reglement/*")

public class ReglementController {

	@Autowired
	private ReglementRepository reglementRepository;

	@Autowired
	private ReglementService reglementService;

	@GetMapping(value = "/findall")
	public ResponseEntity<?> findAllReglement() {

		List<Reglement> listeReglements = reglementRepository.findAll();

		return new ResponseEntity<List<Reglement>>(listeReglements, HttpStatus.OK);
	}

	@GetMapping(value = "/findReglementByNumero/{num}")
	public ResponseEntity<?> findReglementByNumero(@PathVariable Long num) {

		Reglement reglement = reglementRepository.findReglementByNumero(num);
		if (reglement == null)
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "Ce reglement n'existe pas", reglement), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "Voici le reglement demandé", reglement),
				HttpStatus.OK);
	}

	@GetMapping(value = "/findAllMvtReglementValide")
	public ResponseEntity<?> getAllMvtReglementValide() {

		List<SinistreMouvement> listeMvtReglementsValides = reglementRepository.getAllMvtsReglementValides();

		if (listeMvtReglementsValides.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("vide",
					"La liste des mvt de reglements techniques validés est vide", listeMvtReglementsValides),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des règlements validés", listeMvtReglementsValides), HttpStatus.OK);
	}

	@GetMapping(value = "/findAllReglementFinancier")
	public ResponseEntity<?> getAllReglementFinancier() {

		List<SinistreMouvementReglement> listeReglementsFinanciers = reglementRepository.getAllReglementFinancier();

		if (listeReglementsFinanciers.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("vide",
					"La liste des reglements financiers est vide", listeReglementsFinanciers), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des règlements financiers demandée", listeReglementsFinanciers),
				HttpStatus.OK);
	}

	@GetMapping(value = "/findbysinistreandmvt/{numsinistre}/{nummvt}")
	public ResponseEntity<?> findReglementBySinistreAndMvt(@PathVariable Long numsinistre, @PathVariable Long nummvt) {

		Reglement reglement = reglementRepository.findReglementByNumeroSinistreAndMvt(numsinistre, nummvt);
		if (reglement == null)
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "Ce reglement n'existe pas", reglement), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "Voici le reglement demandé", reglement),
				HttpStatus.OK);
	}

	@GetMapping(value = "/findbysinistre/{numsinistre}")
	public ResponseEntity<?> findReglementBySinistre(@PathVariable Long numsinistre) {

		List<Reglement> reglement = reglementRepository.findReglementByNumeroSinistre(numsinistre);
		if (reglement == null)
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "Ce reglement n'existe pas", reglement), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des reglements par numero de sinistre", reglement), HttpStatus.OK);
	}

	@PostMapping("/propositionReglement")
	public ResponseEntity<?> propositionReglementSinistre(@RequestBody ReglementFront reglementFront) {

		PropositionReglementFront resultat = reglementService.propositionReglementSinistre(reglementFront);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
					"Echec de la proposition du règlement de sinistre: vérifier vos informations et voir que le sinistre ou mvt de sinistre existe !",
					resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok",
						"La proposition de règlement pour le sinistre "
								+ resultat.getMvtsinistreForm().getMvts_numsinistre() + " crée avec succès !",
						resultat),
				HttpStatus.OK);
	}

	@PostMapping("/validationReglement")
	public ResponseEntity<?> validationPropositionReglementSinistre(@RequestBody ReglementFront reglementFront) {

		PropositionReglementFront resultat = reglementService.validationPropositionReglementSinistre(reglementFront);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
					"Echec validation de la proposition de règlement du sinistre: vérifier vos informations et voir que le sinistre ou mvt de sinistre existe !",
					resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok",
						"Validation de la proposition de règlement pour le sinistre "
								+ resultat.getSinistreForm().getSini_num() + " effectuée avec succès !",
						resultat),
				HttpStatus.OK);
	}

	@PostMapping("/annulationPropositionReglement")
	public ResponseEntity<?> annulationPropositionReglementSinistre(@RequestBody ReglementFront reglementFront) {

		ValidationReglementFront resultat = reglementService.annulationPropositionReglementSinistre(reglementFront);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
					"Echec de l'annulation de la proposition du règlement du sinistre: vérifier vos informations !",
					resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok",
						"Annulation de la proposition de règlement pour le sinistre "
								+ resultat.getSinistreForm().getSini_num() + " effectuée avec succès !",
						resultat),
				HttpStatus.OK);
	}

	@PostMapping("/annulationReglementValide")
	public ResponseEntity<?> annulationReglementValideSinistre(@RequestBody ReglementFront reglementFront) {

		ValidationReglementFront resultat = reglementService.annulationReglementValiderSinistre(reglementFront);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
					"Echec de l'annulation du règlement validé du sinistre: vérifier vos informations !", resultat),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "Annulation du règlement validé pour le sinistre "
						+ resultat.getSinistreForm().getSini_num() + " effectuée avec succès !", resultat),
				HttpStatus.OK);
	}

	@PostMapping("/reglementFinancier")
	public ResponseEntity<?> reglementFinancierSinistre(@RequestBody ReglementFinancier reglementFinancierFront) {
		
		if(reglementFinancierFront.getReglementForm().getRegl_numcheque() != null && !reglementFinancierFront.getReglementForm().getRegl_numcheque().equals("")) {
			
			Reglement reglement = reglementRepository.findReglementByNumCheque(reglementFinancierFront.getReglementForm().getRegl_numcheque());
			if (reglement != null) {
				return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
						"Ce numéro de chèque est déjà utilisé pour un règlement financier!", null), HttpStatus.OK);
			}

		}

		ReglementFinancier resultat = reglementService.reglementFinancierSinistre(reglementFinancierFront);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
					"Echec règlement financier du sinistre: vérifier vos informations !", resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok",
						"Règlement financier " + resultat.getMvtsinistreForm().getMvts_num() + " du sinistre "
								+ resultat.getSinistreForm().getSini_num() + " effectué avec succès !",
						resultat),
				HttpStatus.OK);
	}

	@GetMapping(value = "/findByNumCheque/{numCheque}")
	public ResponseEntity<?> findReglementByNumCheque(@PathVariable(value = "numCheque") String numCheque) {

		Reglement reglement = reglementRepository.findReglementByNumCheque(numCheque.trim());

		if (reglement != null) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
					"Ce numéro de chèque est déjà utilisé pour un règlement financier!", reglement), HttpStatus.OK);
		}

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
				"Ce numéro de chèque n'est pas encore utilisé pour le reglement financier!", reglement), HttpStatus.OK);
	}

	/*
	 * Edition fiche proposition reglement
	 */

	@PostMapping("/editerFichePropositionReglement/{sini_num}/{mvts_num}")
	public @ResponseBody void generateEditionFichePropositionReglement(HttpServletResponse response,
			@RequestParam("demandeur") String demandeur, @PathVariable Long sini_num, @PathVariable Long mvts_num)
			throws JRException, FileNotFoundException {

		reglementService.generateEditionFichePropositionReglement(response, demandeur, sini_num, mvts_num);
	}

	@PostMapping("/editerFicheValidationReglement/{sini_num}/{mvts_num}")
	public @ResponseBody void generateEditionFicheValidationReglement(HttpServletResponse response,
			@RequestParam("demandeur") String demandeur, @PathVariable Long sini_num, @PathVariable Long mvts_num)
			throws JRException, FileNotFoundException {

		reglementService.generateEditionFicheValidationReglement(response, demandeur, sini_num, mvts_num);
	}

	@PostMapping("/editerFicheReglementFinancier/{sini_num}/{mvts_num}")
	public @ResponseBody void generateEditionFicheReglementFinancier(HttpServletResponse response,
			@RequestParam("demandeur") String demandeur, @PathVariable Long sini_num, @PathVariable Long mvts_num)
			throws JRException, FileNotFoundException {

		reglementService.generateEditionFicheReglementFinancier(response, demandeur, sini_num, mvts_num);
	}

	@PostMapping("/avisReglement/{sini_id}")
	public @ResponseBody void downloadRecuEncaissementPenalite(HttpServletResponse response,
			@RequestParam("demandeur") String demandeur, @PathVariable Long sini_id)
			throws JRException, FileNotFoundException {
		reglementService.downloadRecuAvisReglement(response, demandeur, sini_id);
	}
}
