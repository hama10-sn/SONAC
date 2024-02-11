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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import net.sf.jasperreports.engine.JRException;
import sn.jmad.sonac.message.response.AnnulationPeriodique;
import sn.jmad.sonac.message.response.RecoursFront;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.message.response.SinistreClient;
import sn.jmad.sonac.message.response.SinistreFacture;
import sn.jmad.sonac.message.response.SinistreFront;
import sn.jmad.sonac.message.response.SinistreMouvement;
import sn.jmad.sonac.message.response.ValidationsFront;
import sn.jmad.sonac.model.Sinistre;
import sn.jmad.sonac.repository.SinistreRepository;
import sn.jmad.sonac.service.SinistreService;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/sinistre/*")
public class SinistreController {

	@Autowired
	private SinistreRepository sinistreRepository;

	@Autowired
	private SinistreService sinistreService;

	@GetMapping(value = "/findall")
	public ResponseEntity<?> findAllSinistre() {

		List<Sinistre> listeSinistre = sinistreRepository.findAll();

		return new ResponseEntity<List<Sinistre>>(listeSinistre, HttpStatus.OK);
	}

	@GetMapping(value = "/findallSinistre")
	public ResponseEntity<?> getAllSinistres() {

		List<SinistreMouvement> listeSinistre = sinistreRepository.getAllSinistresMouvement();

		if (listeSinistre.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("vide", "liste des sinistre est vide", null),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "La liste des sinistres", listeSinistre),
				HttpStatus.OK);
	}

	@GetMapping(value = "/findSinistreByNumero/{num}")
	public ResponseEntity<?> getSinistreByNumero(@PathVariable Long num) {

		Sinistre sinistre = sinistreRepository.findSinistreByNumero(num);

		if (sinistre == null)
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "Ce sinistre n'existe pas !", sinistre), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "Le sinistre demandé !", sinistre),
				HttpStatus.OK);
	}

	@GetMapping(value = "/findallMenaceSinistre")
	public ResponseEntity<?> getAllMenaceSinistres() {

		List<SinistreMouvement> listeMenaceSinistre = sinistreRepository.getAllMenaceSinistresMouvement();

		if (listeMenaceSinistre.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "liste des menaces de sinistre est vide", listeMenaceSinistre),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des menaces de sinistre", listeMenaceSinistre), HttpStatus.OK);
	}

	@PostMapping(value = "/ajouterMenace")
	public ResponseEntity<?> ajouterDeclarationMenaceSinistre(@RequestBody SinistreFront sinistreFront) {

		SinistreFront resultat = sinistreService.ajoutDeclarionMenaceSinistre(sinistreFront);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
					"Echec de la création de la déclaration de menace de sinistre !", resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
				"Déclaration de menace de sinistre " + resultat.getSinistreForm().getSini_num() + " crée avec succès",
				resultat), HttpStatus.OK);
	}

	@PostMapping(value = "/ajouterSinistre")
	public ResponseEntity<?> ajouterDeclarationSinistre(@RequestBody SinistreFront sinistreFront) {

		SinistreFront resultat = sinistreService.ajoutDeclarionSinistre(sinistreFront);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("chao", "Echec de la création de sinistre !", resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
				"Déclaration de sinistre " + resultat.getSinistreForm().getSini_num() + " crée avec succès", resultat),
				HttpStatus.OK);
	}

	@PostMapping(value = "/modifierMenaceSinistre")
	public ResponseEntity<?> modificationMenaceSinistre(@RequestBody SinistreFront sinistreFront) {

		SinistreFront resultat = sinistreService.modificationMenaceSinistre(sinistreFront);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("chao", "Echec de la modification de menace de sinistre !", resultat),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "Echéance de la menace de sinistre modifiée avec succès", resultat),
				HttpStatus.OK);
	}

	@GetMapping(value = "/findMenaceSinistreByAcheteur/{acheteur}")
	public ResponseEntity<?> findMenaceSinistreByAcheteur(@PathVariable Long acheteur) {

		List<Sinistre> menacesSinistre = sinistreRepository.findAllMenaceSinistreByAcheteur(acheteur);

		if (menacesSinistre.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("chao", "Pas de déclaration de menace de sinistre pour cet acheteur", null),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
				"Impossible: il existe déjà une menace de sinistre pour cet acheteur", menacesSinistre), HttpStatus.OK);
	}

	@GetMapping(value = "/findSinistreByAcheteur/{acheteur}")
	public ResponseEntity<?> findSinistreByAcheteur(@PathVariable Long acheteur) {

		List<Sinistre> sinistre = sinistreRepository.findAllSinistreByAcheteur(acheteur);

		if (sinistre.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("chao", "Pas encore de déclaration de sinistre pour cet acheteur", null),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
				"Impossible: il existe déjà une déclaration de sinistre pour cet acheteur", sinistre), HttpStatus.OK);
	}

	// Modification du sinistre une fois la levée de la menace
	@PutMapping("/leveeMenaceSinistre")
	public ResponseEntity<?> leveeMenaceSinistre(@RequestParam("numSinistre") Long numSinistre,
			@RequestParam("numMvtSinistre") Long numMvtSinistre, @RequestParam("numAcheteur") Long numAcheteur) {

		SinistreFront resultat = sinistreService.leveeMenaceSinistre(numSinistre, numMvtSinistre, numAcheteur);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
					"Echec de la levée de la menace de sinistre: vérifier que le sinistre, mvt de sinistre ou l'acheteur existe !",
					resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
				"La menace de sinistre " + resultat.getSinistreForm().getSini_num() + " levée avec succès", resultat),
				HttpStatus.OK);
	}

	// Modification du sinistre une fois la confirmation de la menace et création
	// d'un mouvement de sinistre
	@PostMapping("/confirmeMenaceSinistre")
	public ResponseEntity<?> confirmeMenaceSinistre(@RequestParam("numSinistre") Long numSinistre,
			@RequestParam("numMvtSinistre") Long numMvtSinistre) {

		SinistreFront resultat = sinistreService.confirmeMenaceSinistre(numSinistre, numMvtSinistre);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
					"Echec de la confirmation de la menace de sinistre: vérifier que le sinistre ou mvt de sinistre existe !",
					resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La confirmation de la menace de sinistre validée avec succès !", resultat),
				HttpStatus.OK);
	}

	// Modification evaluation sinistre
	@PostMapping("/modificationEvaluation")
	public ResponseEntity<?> modificationEvaluationSinistre(@RequestBody SinistreFront sinistreFront) {

		SinistreFront resultat = sinistreService.modificationEvaluationSinistre(sinistreFront);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
					"Echec de la modification évaluation sinistre: vérifier vos informations et que le sinistre ou mvt de sinistre existe !",
					resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La modification des évaluations du sinistre "
						+ resultat.getSinistreForm().getSini_num() + " validée avec succès !", resultat),
				HttpStatus.OK);
	}

	// Modification SAP sinistre
	@PostMapping("/modificationSAP")
	public ResponseEntity<?> modificationSAPSinistre(@RequestBody SinistreFront sinistreFront) {

		SinistreFront resultat = sinistreService.modificationSAPSinistre(sinistreFront);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
					"Echec de la modification SAP sinistre: vérifier vos informations et que le sinistre ou mvt de sinistre existe !",
					resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "La modification SAP du sinistre "
				+ resultat.getSinistreForm().getSini_num() + " validée avec succès !", resultat), HttpStatus.OK);
	}

	@PostMapping("editerFicheMenaceSinistre/{typeDeclaration}/{demandeur}/{document}")
	public @ResponseBody void generateEditionFicheMenaceSinistre(HttpServletResponse response,
			@PathVariable String typeDeclaration, @PathVariable String demandeur, @PathVariable String document,
			@RequestBody SinistreFront sinistreFront) throws JRException, FileNotFoundException {

		sinistreService.generateEditionFicheMenaceAndSinistre(response, typeDeclaration, demandeur, document,
				sinistreFront);
	}

	@PostMapping("editerFicheModificationEvaluation/{demandeur}/{document}")
	public @ResponseBody void generateEditionFicheModificationEvaluation(HttpServletResponse response,
			@PathVariable String demandeur, @PathVariable String document, @RequestBody SinistreFront sinistreFront)
			throws JRException, FileNotFoundException {

		sinistreService.generateEditionFicheModificationEvaluation(response, demandeur, document, sinistreFront);
	}
	
	@PostMapping("editerFicheModificationSAP/{demandeur}/{document}")
	public @ResponseBody void generateEditionFicheModificationSAP(HttpServletResponse response,
			@PathVariable String demandeur, @PathVariable String document, @RequestBody SinistreFront sinistreFront)
			throws JRException, FileNotFoundException {

		sinistreService.generateEditionFicheModificationSAP(response, demandeur, document, sinistreFront);
	}

	@GetMapping(value = "/listeRecoursSinistre")
	public ResponseEntity<?> getAllRecoursSinistre() {
		List<SinistreMouvement> listeRecoursSinistre = sinistreRepository.getAllSinistresRecours();

		return new ResponseEntity<List<SinistreMouvement>>(listeRecoursSinistre, HttpStatus.OK);
	}

	@GetMapping(value = "/listeAllSinistre")
	public ResponseEntity<?> getAllSinistre() {

		List<SinistreClient> listeSinistre = sinistreRepository.getAllSinistre();

		return new ResponseEntity<List<SinistreClient>>(listeSinistre, HttpStatus.OK);
	}

	@GetMapping("/listeSinistreParBranche/{sini_branche}")
	public ResponseEntity<?> listeSinistreParBranche(@PathVariable Long sini_branche) {
		List<SinistreClient> listeSinistre = sinistreRepository.listeSinistreParBranche(sini_branche);
		return new ResponseEntity<List<SinistreClient>>(listeSinistre, HttpStatus.OK);
	}

	@GetMapping("/listeSinistreParProduit/{sini_produit}")
	public ResponseEntity<?> listeSinistreParProduit(@PathVariable Long sini_produit) {
		List<SinistreClient> listeSinistre = sinistreRepository.listeSinistreParProduit(sini_produit);
		return new ResponseEntity<List<SinistreClient>>(listeSinistre, HttpStatus.OK);
	}

	@GetMapping("/listeSinistreParPeriode/{debut}/{fin}")
	public ResponseEntity<?> listeSinistreParPeriode(@PathVariable String debut, @PathVariable String fin) {
		List<SinistreClient> listeSinistre = sinistreRepository.listeSinistreParPeriode(debut, fin);
		return new ResponseEntity<List<SinistreClient>>(listeSinistre, HttpStatus.OK);
	}

	@GetMapping("/listeSinistreParClient/{sini_souscripteur}")
	public ResponseEntity<?> listeSinistreParClient(@PathVariable Long sini_souscripteur) {
		List<SinistreClient> listeSinistre = sinistreRepository.listeSinistreParClient(sini_souscripteur);
		return new ResponseEntity<List<SinistreClient>>(listeSinistre, HttpStatus.OK);
	}

	@GetMapping("/listeSinistreParPolice/{sini_police}")
	public ResponseEntity<?> listeSinistreParPolice(@PathVariable Long sini_police) {
		List<SinistreClient> listeSinistre = sinistreRepository.listeSinistreParPolice(sini_police);
		return new ResponseEntity<List<SinistreClient>>(listeSinistre, HttpStatus.OK);
	}

	@GetMapping("/listeSinistreParBrancheAndProduit/{sini_branche}/{sini_produit}")
	public ResponseEntity<?> listeSinistreParBrancheAndProduit(@PathVariable Long sini_branche,
			@PathVariable Long sini_produit) {
		List<SinistreClient> listeSinistre = sinistreRepository.listeSinistreParBrancheAndProduit(sini_branche,
				sini_produit);
		return new ResponseEntity<List<SinistreClient>>(listeSinistre, HttpStatus.OK);
	}

	@GetMapping("/listeSinistreParBrancheAndProduitAndPeriode/{sini_branche}/{sini_produit}/{debut}/{fin}")
	public ResponseEntity<?> listeSinistreParBrancheAndProduitAndPeriode(@PathVariable Long sini_branche,
			@PathVariable Long sini_produit, @PathVariable String debut, @PathVariable String fin) {
		List<SinistreClient> listeSinistre = sinistreRepository
				.listeSinistreParBrancheAndProduitAndPeriode(sini_branche, sini_produit, debut, fin);
		return new ResponseEntity<List<SinistreClient>>(listeSinistre, HttpStatus.OK);
	}

	@GetMapping("/listeSinistreParBrancheAndProduitAndPeriodeAndClient/{sini_branche}/{sini_produit}/{debut}/{fin}/{sini_souscripteur}")
	public ResponseEntity<?> listeSinistreParBrancheAndProduitAndPeriodeAndClient(@PathVariable Long sini_branche,
			@PathVariable Long sini_produit, @PathVariable String debut, @PathVariable String fin,
			@PathVariable Long sini_souscripteur) {
		List<SinistreClient> listeSinistre = sinistreRepository.listeSinistreParBrancheAndProduitAndPeriodeAndClient(
				sini_branche, sini_produit, debut, fin, sini_souscripteur);
		return new ResponseEntity<List<SinistreClient>>(listeSinistre, HttpStatus.OK);
	}

	@GetMapping("/listeSinistreParBrancheAndProduitAndPeriodeAndClientAndPolice/{sini_branche}/{sini_produit}/{debut}/{fin}/{sini_souscripteur}/{sini_police}")
	public ResponseEntity<?> listeSinistreParBrancheAndProduitAndPeriodeAndClientAndPolice(
			@PathVariable Long sini_branche, @PathVariable Long sini_produit, @PathVariable String debut,
			@PathVariable String fin, @PathVariable Long sini_souscripteur, @PathVariable Long sini_police) {
		List<SinistreClient> listeSinistre = sinistreRepository
				.listeSinistreParBrancheAndProduitAndPeriodeAndClientAndPolice(sini_branche, sini_produit, debut, fin,
						sini_souscripteur, sini_police);
		return new ResponseEntity<List<SinistreClient>>(listeSinistre, HttpStatus.OK);
	}

	@GetMapping("report/{format}/{title}/{demandeur}/{numBranche}/{numProduit}/{debut}/{fin}/{numClient}/{numPolice}")
	public @ResponseBody void generateReportSinistre(HttpServletResponse response, @PathVariable String format,
			@PathVariable String title, @PathVariable String demandeur, @PathVariable Long numBranche,
			@PathVariable Long numProduit, @PathVariable String debut, @PathVariable String fin,
			@PathVariable Long numClient, @PathVariable Long numPolice) throws JRException, FileNotFoundException {

		sinistreService.generateReportSinistre(response, format, title, demandeur, numBranche, numProduit, debut, fin,
				numClient, numPolice);
	}

	@GetMapping("/listeSinistralite")
	public ResponseEntity<?> getAllSinistralite() {
		return new ResponseEntity<List<SinistreFacture>>(sinistreService.getAllSinistralite(), HttpStatus.OK);
	}

	@GetMapping("/listeSinistraliteParBranche/{sini_branche}")
	public ResponseEntity<?> listeSinistraliteParBranche(@PathVariable Long sini_branche) {
		List<SinistreFacture> listeSinistralite = sinistreRepository.getSinistraliteByBranche(sini_branche);
		return new ResponseEntity<List<SinistreFacture>>(listeSinistralite, HttpStatus.OK);
	}

	@GetMapping("/listeSinistraliteParPeriode/{debut}/{fin}")
	public ResponseEntity<?> listeSinistraliteParPeriode(@PathVariable String debut, @PathVariable String fin) {
		List<SinistreFacture> listeSinistralite = sinistreRepository.getSinistraliteByPeriode(debut, fin);
		return new ResponseEntity<List<SinistreFacture>>(listeSinistralite, HttpStatus.OK);
	}

	@GetMapping("/listeSinistraliteParClient/{sini_souscripteur}")
	public ResponseEntity<?> listeSinistraliteParClient(@PathVariable Long sini_souscripteur) {
		List<SinistreFacture> listeSinistralite = sinistreRepository.getSinistraliteByClient(sini_souscripteur);
		return new ResponseEntity<List<SinistreFacture>>(listeSinistralite, HttpStatus.OK);
	}

	@GetMapping("/listeSinistraliteParPolice/{fact_numeropolice}")
	public ResponseEntity<?> listeSinistraliteParPolice(@PathVariable Long fact_numeropolice) {
		List<SinistreFacture> listeSinistre = sinistreRepository.getSinistraliteByPolice(fact_numeropolice);
		return new ResponseEntity<List<SinistreFacture>>(listeSinistre, HttpStatus.OK);
	}

	@GetMapping("/listeSinistraliteParBrancheAndPeriode/{sini_branche}/{debut}/{fin}")
	public ResponseEntity<?> listeSinistraliteParBrancheAndPeriode(@PathVariable Long sini_branche,
			@PathVariable String debut, @PathVariable String fin) {
		List<SinistreFacture> listeSinistralite = sinistreRepository.getSinistraliteByBrancheAndPeriode(sini_branche,
				debut, fin);
		return new ResponseEntity<List<SinistreFacture>>(listeSinistralite, HttpStatus.OK);
	}

	@GetMapping("/listeSinistraliteParBrancheAndPeriode/{sini_branche}/{debut}/{fin}/{sini_souscripteur}")
	public ResponseEntity<?> listeSinistraliteParBrancheAndPeriodeAndClient(@PathVariable Long sini_branche,
			@PathVariable String debut, @PathVariable String fin, @PathVariable Long sini_souscripteur) {
		List<SinistreFacture> listeSinistralite = sinistreRepository
				.getSinistraliteByBrancheAndPeriodeAndClient(sini_branche, debut, fin, sini_souscripteur);
		return new ResponseEntity<List<SinistreFacture>>(listeSinistralite, HttpStatus.OK);
	}

	@GetMapping("/listeSinistraliteParBrancheAndPeriode/{sini_branche}/{debut}/{fin}/{sini_souscripteur}/{fact_numeropolice}")
	public ResponseEntity<?> listeSinistraliteParBrancheAndPeriodeAndClientAndClient(@PathVariable Long sini_branche,
			@PathVariable String debut, @PathVariable String fin, @PathVariable Long sini_souscripteur,
			@PathVariable Long fact_numeropolice) {
		List<SinistreFacture> listeSinistralite = sinistreRepository
				.getSinistraliteByBrancheAndPeriodeAndClientAndPolice(sini_branche, debut, fin, sini_souscripteur,
						fact_numeropolice);
		return new ResponseEntity<List<SinistreFacture>>(listeSinistralite, HttpStatus.OK);
	}

	@GetMapping("/detailSinistraliteParBranche/{fact_numerobranche}")
	public ResponseEntity<?> detailSinistraliteParBranche(@PathVariable Long fact_numerobranche) {
		List<SinistreFacture> detailsSinistralite = sinistreRepository
				.getDetailSinistraliteByBranche(fact_numerobranche);
		return new ResponseEntity<List<SinistreFacture>>(detailsSinistralite, HttpStatus.OK);
	}

	@GetMapping("report/{format}/{title}/{demandeur}/{numBranche}/{debut}/{fin}/{numClient}/{numPolice}")
	public @ResponseBody void generateReportSinistralite(HttpServletResponse response, @PathVariable String format,
			@PathVariable String title, @PathVariable String demandeur, @PathVariable Long numBranche,
			@PathVariable String debut, @PathVariable String fin, @PathVariable Long numClient,
			@PathVariable Long numPolice) throws JRException, FileNotFoundException {

		sinistreService.generateReportSinistralite(response, format, title, demandeur, numBranche, debut, fin,
				numClient, numPolice);
	}

	@GetMapping("/rechercheParCritere/{sini_branche}/{sini_produit}/{sini_souscripteur}/{sini_police}")
	public ResponseEntity<?> rechercheParCritere(@PathVariable Long sini_branche, @PathVariable Long sini_produit,
			@PathVariable Long sini_souscripteur, @PathVariable Long sini_police) {
		List<SinistreClient> listeSinistre = sinistreService.rechercheParCritere(sini_branche, sini_produit,
				sini_souscripteur, sini_police);
		return new ResponseEntity<List<SinistreClient>>(listeSinistre, HttpStatus.OK);
	}

	@GetMapping(value = "/listeSinistreACloturer")
	public ResponseEntity<?> getAllSinistresToCloture() {

		List<SinistreMouvement> listeSinistre = sinistreRepository.listeSinistreACloturer();

		if (listeSinistre.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "liste des sinistre à clôturer est vide", null), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des sinistres à clôturer", listeSinistre), HttpStatus.OK);
	}

	@PostMapping(value = "/clotureSinistre/{sini_id}")
	public ResponseEntity<?> clotureSinistre(@PathVariable("sini_id") Long sini_id,
			@RequestBody RecoursFront recoursFront) {
		RecoursFront resultat = sinistreService.clotureSinistre(sini_id, recoursFront);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("chao", "Echec de la clôture du sinistre !", resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
				"Le sinistre " + resultat.getMvtsinistreForm().getMvts_id() + " est clôturé avec succès", resultat),
				HttpStatus.OK);
	}

	@GetMapping(value = "/listeSinistreClotures")
	public ResponseEntity<?> getAllSinistresClotures() {

		List<SinistreMouvement> listeSinistre = sinistreRepository.listeSinistreClotures();

		if (listeSinistre.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "liste des sinistre clôturés est vide", null), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des sinistres clôturés", listeSinistre), HttpStatus.OK);
	}

	@PostMapping(value = "/reOuvrirSinistre/{sini_id}")
	public ResponseEntity<?> reOuvertureSinistre(@PathVariable("sini_id") Long sini_id,
			@RequestBody RecoursFront recoursFront) {
		RecoursFront resultat = sinistreService.reOuvrirSinistre(sini_id, recoursFront);
		if (resultat == null)
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("chao", "Echec de la réouverture du sinistre !", resultat), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
				"Le sinistre " + resultat.getMvtsinistreForm().getMvts_numsinistre() + " est réouvert avec succès",
				resultat), HttpStatus.OK);
	}

	@PostMapping("/fichierClotureSinistre/{demandeur}")
	public @ResponseBody void generateFicheClotureSinistre(HttpServletResponse response, @PathVariable String demandeur,
			@RequestBody RecoursFront recoursFront) throws JRException, FileNotFoundException {
		sinistreService.generateFicheSinistreCloture(response, demandeur, recoursFront);
	}

	@PostMapping("/fichierReouvertureSinistre/{demandeur}")
	public @ResponseBody void generateFicheReouvertureSinistre(HttpServletResponse response,
			@PathVariable String demandeur, @RequestBody RecoursFront recoursFront)
			throws JRException, FileNotFoundException {
		sinistreService.generateFicheReouvertureSinistre(response, demandeur, recoursFront);
	}

	@GetMapping("/consultationAnnulation")
	public ResponseEntity<?> consultationAnnulation() {
		List<AnnulationPeriodique> listeAnnulation = sinistreRepository.findAllAnnulation();

		if (listeAnnulation.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "liste des annulations est vide", null), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des annulations ", listeAnnulation), HttpStatus.OK);
	}

	@GetMapping("/consultationAnnulationPeriodique/{debut}/{fin}")
	public ResponseEntity<?> consultationAnnulationPeriodique(@PathVariable String debut, @PathVariable String fin) {
		List<AnnulationPeriodique> listeAnnulation = sinistreRepository.consultationAnnulation(debut, fin);

		if (listeAnnulation.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "liste des annulations est vide", null), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des annulations ", listeAnnulation), HttpStatus.OK);
	}

	@GetMapping("/consultationAnnulationParProduit/{sini_produit}")
	public ResponseEntity<?> consultationAnnulationParProduit(@PathVariable Long sini_produit) {
		List<AnnulationPeriodique> listeAnnulation = sinistreRepository.consultationAnnulationParProduit(sini_produit);

		if (listeAnnulation.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "liste des annulations est vide", null), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des annulations ", listeAnnulation), HttpStatus.OK);
	}

	@GetMapping("/consultationAnnulationParBranche/{sini_branche}")
	public ResponseEntity<?> consultationAnnulationParBranche(@PathVariable Long sini_branche) {
		List<AnnulationPeriodique> listeAnnulation = sinistreRepository.consultationAnnulationParBranche(sini_branche);

		if (listeAnnulation.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "liste des annulations est vide", null), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des annulations ", listeAnnulation), HttpStatus.OK);
	}

	@GetMapping("/consultationAnnulationParPeriodeAndProduit/{debut}/{fin}/{sini_produit}")
	public ResponseEntity<?> consultationAnnulationParPeriodeAndProduit(@PathVariable String debut,
			@PathVariable String fin, @PathVariable Long sini_produit) {
		List<AnnulationPeriodique> listeAnnulation = sinistreRepository
				.consultationAnnulationParPeriodeAndProduit(debut, fin, sini_produit);

		if (listeAnnulation.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "liste des annulations est vide", null), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des annulations ", listeAnnulation), HttpStatus.OK);
	}

	@GetMapping("/consultationAnnulationParPeriodeAndProduitAndBranche/{debut}/{fin}/{sini_produit}/{sini_branche}")
	public ResponseEntity<?> consultationAnnulationParPeriodeAndProduitAndBranche(@PathVariable String debut,
			@PathVariable String fin, @PathVariable Long sini_produit, @PathVariable Long sini_branche) {
		List<AnnulationPeriodique> listeAnnulation = sinistreRepository
				.consultationAnnulationParPeriodeAndProduitAndBranche(debut, fin, sini_produit, sini_branche);

		if (listeAnnulation.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "liste des annulations est vide", null), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des annulations ", listeAnnulation), HttpStatus.OK);
	}

	@GetMapping("report/{format}/{title}/{demandeur}/{debut}/{fin}/{sini_produit}/{sini_branche}")
	public @ResponseBody void generateReportAnnulation(HttpServletResponse response, @PathVariable String format,
			@PathVariable String title, @PathVariable String demandeur, @PathVariable String debut,
			@PathVariable String fin, @PathVariable Long sini_produit, @PathVariable Long sini_branche)
			throws JRException, FileNotFoundException {

		sinistreService.generateReportAnnulation(response, format, title, demandeur, debut, fin, sini_produit,
				sini_branche);
	}
}
