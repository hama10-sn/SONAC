package sn.jmad.sonac.controller;

import java.util.Date;
import java.util.List;

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
import sn.jmad.sonac.message.response.SureteEngagement;
import sn.jmad.sonac.model.Surete;
import sn.jmad.sonac.repository.SureteRepository;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/surete/*")

public class SureteController {

	@Autowired
	private SureteRepository sureteRepository;

	@GetMapping(value = "/allSurete1")
	public ResponseEntity<?> getallsuretes1() {
		List<Surete> suretes = sureteRepository.findAllSurete();
		if (suretes.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("vide", "Liste des suretés est vide", null),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "La liste des suretés", suretes),
				HttpStatus.OK);
	}

	@GetMapping(value = "/allSurete")
	public ResponseEntity<?> getallsuretes() {
		List<SureteEngagement> suretes = sureteRepository.getAllSureteEgagement();
		if (suretes.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("vide", "Liste des suretés est vide", null),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "La liste des suretés", suretes),
				HttpStatus.OK);
	}

	@PostMapping("/addSurete")
	public ResponseEntity<?> saveSurete(@Valid @RequestBody Surete surete) {

		if (surete == null) {
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("chao", "une erreur est survenue: vérifiez vos informations !", null),
					HttpStatus.OK);
		}

		surete.setSurete_datemodification(new Date());
		surete.setSurete_active(1);
		Surete sure = sureteRepository.save(surete);

		if (sure != null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
					"Sureté " + sure.getSurete_numero() + " est enregistré avec succès !", sure), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("chao", "Echec de l'enregistrement de la sureté !", null), HttpStatus.OK);
	}

	@PutMapping("/updateSurete")
	public ResponseEntity<?> modifSurete(@RequestBody Surete surete) {

		Surete sureteUpdate = sureteRepository.findByNumSurete(surete.getSurete_numero());
		if (sureteUpdate == null)
			return new ResponseEntity<>(new ResponseMessage("chao", "Cette sureté n'existe pas !", null),
					HttpStatus.OK);

		surete.setSurete_active(1);
		surete.setSurete_datemodification(sureteUpdate.getSurete_datemodification());
		surete.setSurete_id(sureteUpdate.getSurete_id());

		Surete sure = sureteRepository.save(surete);

		if (sure != null)
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("ok", "Sureté " + sure.getSurete_numero() + " est modifié avec succès !", sure),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("chao", "Echec de la modification de la sureté !", null), HttpStatus.OK);

	}

	@PutMapping("/libererSurete")
	public ResponseEntity<?> libererSurete(@RequestBody Surete surete) {

		Surete sureteLiberer = sureteRepository.findByNumSurete(surete.getSurete_numero());
		if (sureteLiberer == null)
			return new ResponseEntity<>(new ResponseMessage("chao", "Cette sureté n'existe pas !", null),
					HttpStatus.OK);

		surete.setSurete_active(1);
		surete.setSurete_datemodification(sureteLiberer.getSurete_datemodification());
		surete.setSurete_id(sureteLiberer.getSurete_id());

		if (surete.getSurete_typesurete().equals("1") || (surete.getSurete_typesurete().equals("3"))
				|| (surete.getSurete_typesurete().equals("4"))) {
			surete.setSurete_statutliberation(2);

		} else if (surete.getSurete_typesurete().equals("2")) {

			if (((surete.getSurete_retenudeposit() - surete.getSurete_depositlibere()) == 0))
				surete.setSurete_statutliberation(2);
			else
				surete.setSurete_statutliberation(1);

		} else {
			surete.setSurete_statutliberation(0);
		}

		Surete sure = sureteRepository.save(surete);

		if (sure != null)
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("ok", "Sureté " + sure.getSurete_numero() + " est libérée avec succès !", sure),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "Echec libération de la sureté !", null),
				HttpStatus.OK);
	}

	@GetMapping("/deleteSurete/{num}")
	public ResponseEntity<?> deleteSurete(@PathVariable("num") Long num) {

		Surete surete = sureteRepository.findByNumSurete(num);
		if (surete != null) {
			surete.setSurete_active(0);
			Surete sure = sureteRepository.save(surete);
			return new ResponseEntity<>(
					new ResponseMessage("ok", "Sureté " + sure.getSurete_numero() + " supprimé avec succès !", null),
					HttpStatus.OK);
		}

		return new ResponseEntity<>(new ResponseMessage("chao", "Echec de la suppréssion !", null), HttpStatus.OK);
	}

}
