package sn.jmad.sonac.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRExporterParameter;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.design.JasperDesign;
import net.sf.jasperreports.engine.export.JRXlsExporterParameter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.engine.xml.JRXmlLoader;
import sn.jmad.sonac.message.response.ConsulationEncaissement;
import sn.jmad.sonac.message.response.EncaissementClient;
import sn.jmad.sonac.message.response.EncaissementFacture;
import sn.jmad.sonac.message.response.InfoCommission;
import sn.jmad.sonac.message.response.PayCommission;

import sn.jmad.sonac.message.response.ReemettreDate;
import sn.jmad.sonac.message.response.SinistreClient;
import sn.jmad.sonac.message.response.SinistreMouvement;

import sn.jmad.sonac.model.Avenant;
import sn.jmad.sonac.model.Branche;
import sn.jmad.sonac.model.Categorie;
import sn.jmad.sonac.model.Client;
import sn.jmad.sonac.model.Encaissement;
import sn.jmad.sonac.model.Facture;
import sn.jmad.sonac.model.PayerCommission;
import sn.jmad.sonac.model.Police;
import sn.jmad.sonac.model.Produit;
import sn.jmad.sonac.model.Quittance;
import sn.jmad.sonac.model.Recours;
import sn.jmad.sonac.model.Sinistre;
import sn.jmad.sonac.repository.AvenantRepository;
import sn.jmad.sonac.repository.BrancheRepository;
import sn.jmad.sonac.repository.CategorieRepository;
import sn.jmad.sonac.repository.ClientRepository;
import sn.jmad.sonac.repository.EncaissementRepository;
import sn.jmad.sonac.repository.FactureRepository;
import sn.jmad.sonac.repository.PayerCommissionRepository;
import sn.jmad.sonac.repository.PoliceRepository;
import sn.jmad.sonac.repository.ProduitRepository;
import sn.jmad.sonac.repository.QuittanceRepository;
import sn.jmad.sonac.security.service.UserPrinciple;
import sn.jmad.sonac.service.constantes.FrenchNumberToWords;
import sn.jmad.sonac.service.constantes.ParamConst;

@Service
public class EncaissementService {

	private static final String PDF = "pdf";
	private static final String EXCEL = "excel";

	@Autowired
	private EncaissementRepository encaissementRepository;

	@Autowired
	private QuittanceRepository quittanceRepository;

	@Autowired
	private FactureRepository factureRepository;

	@Autowired
	private PoliceRepository policeRepository;

	@Autowired
	private AvenantRepository avenantRepository;

	@Autowired
	private PayerCommissionRepository payerCommissionRepository;

	@Autowired
	private BrancheRepository brancheRepository;

	@Autowired
	private ClientRepository clientRepository;

	@Autowired
	private CategorieRepository categorieRepository;

	/*
	 * Méthode pour exporter des fichiers pdf et excel des encaissements
	 */
	public void generateReportEncaissement(HttpServletResponse response, String reportFormat, String title,
			String demandeur, Long numIntermediaire, Long numProduit, String dateDebut, String dateFin) {

		String caractSup = "_";
		String titleNew = "";
		String demandeurNew = "";

		titleNew = title.replaceAll(caractSup, " ");
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		/*
		 * Traitement pour un fichier PDF
		 */
		if (reportFormat.equalsIgnoreCase(PDF)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
					+ ParamConst.FILENAME_REPORT_ENCAISSEMENT_PDF + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

//				parameterMap.put("title", title);
//				parameterMap.put("demandeur", demandeur);

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<EncaissementClient> encaissements;

				if (!(dateDebut.equals("0") || dateDebut.equals("")) && !(dateFin.equals("0") || dateFin.equals(""))
						&& numProduit == 0 && numIntermediaire == 0) {
					encaissements = encaissementRepository.allEncaissementByPeriode(dateDebut, dateFin);
					System.out.println(" =============== Encaissements By periode ===================");

				} else if (numProduit != 0 && numIntermediaire == 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {
					encaissements = encaissementRepository.allEncaissementByProduit(numProduit);
					System.out.println(" =============== Encaissements by produit ===================");

				} else if (numProduit == 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {
					encaissements = encaissementRepository.allEncaissementByIntermediaire(numIntermediaire);
					System.out.println(" =============== Encaissements by intermediaire ===================");

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit != 0 && numIntermediaire == 0) {

					encaissements = encaissementRepository.allEncaissementByPeriodeAndProduit(numProduit, dateDebut,
							dateFin);

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit == 0 && numIntermediaire != 0) {

					encaissements = encaissementRepository.allEncaissementByPeriodeAndIntermediaire(numIntermediaire,
							dateDebut, dateFin);

				} else if (numProduit != 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					encaissements = encaissementRepository.allEncaissementByProduitAndIntermediaire(numIntermediaire,
							numProduit);

				} else if (!(dateDebut.equals("0") && dateDebut.equals(""))
						&& !(dateFin.equals("0") && dateFin.equals("")) && numProduit != 0 && numIntermediaire != 0) {
					encaissements = encaissementRepository.allEncaissementByCriteres(numIntermediaire, numProduit,
							dateDebut, dateFin);

					System.out.println(" =============== Encaissements by criteres ===================");

				} else {
					encaissements = encaissementRepository.allEncaissementAndClient();
					System.out.println(" =============== Encaissements and client ===================");

				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(encaissements);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_ENCAISSEMENT_PDF + ParamConst.EXTENSION_PDF);
				response.addHeader(" Access-Control-Allow-Origin ", " * ");

				JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		/*
		 * Traitement pour un fichier excel (XLS)
		 */
		if (reportFormat.equalsIgnoreCase(EXCEL)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
					+ ParamConst.FILENAME_REPORT_ENCAISSEMENT_EXCEL + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

//				parameterMap.put("title", title);
//				parameterMap.put("demandeur", demandeur);

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<EncaissementClient> encaissements;

				if (!(dateDebut.equals("0") || dateDebut.equals("")) && !(dateFin.equals("0") || dateFin.equals(""))
						&& numProduit == 0 && numIntermediaire == 0) {
					encaissements = encaissementRepository.allEncaissementByPeriode(dateDebut, dateFin);
				}

				else if (numProduit != 0 && numIntermediaire == 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {
					encaissements = encaissementRepository.allEncaissementByProduit(numProduit);

				} else if (numProduit == 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {
					encaissements = encaissementRepository.allEncaissementByIntermediaire(numIntermediaire);

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit != 0 && numIntermediaire == 0) {

					encaissements = encaissementRepository.allEncaissementByPeriodeAndProduit(numProduit, dateDebut,
							dateFin);

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit == 0 && numIntermediaire != 0) {

					encaissements = encaissementRepository.allEncaissementByPeriodeAndIntermediaire(numIntermediaire,
							dateDebut, dateFin);

				} else if (numProduit != 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					encaissements = encaissementRepository.allEncaissementByProduitAndIntermediaire(numIntermediaire,
							numProduit);

				} else if (!(dateDebut.equals("0") && dateDebut.equals(""))
						&& !(dateFin.equals("0") && dateFin.equals("")) && numProduit != 0 && numIntermediaire != 0) {
					encaissements = encaissementRepository.allEncaissementByCriteres(numIntermediaire, numProduit,
							dateDebut, dateFin);

				} else {
					encaissements = encaissementRepository.allEncaissementAndClient();
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(encaissements);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				jasperPrint.setProperty("net.sf.jasperreports.export.xls.detect.cell.type", "true");
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-xlsx");
				response.setHeader("Content-Disposition", "inline; filename="
						+ ParamConst.FILENAME_REPORT_ENCAISSEMENT_EXCEL + ParamConst.EXTENSION_EXCEL);

				JRXlsxExporter exporterXLS = new JRXlsxExporter();
				exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT, jasperPrint);
				exporterXLS.setParameter(JRExporterParameter.OUTPUT_STREAM, outputStream);

				// Supprimer les sauts de ligne sur excel

				exporterXLS.setParameter(JRXlsExporterParameter.IS_ONE_PAGE_PER_SHEET, Boolean.FALSE);
				exporterXLS.setParameter(JRXlsExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS, Boolean.TRUE);

				exporterXLS.exportReport();

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	/*
	 * Méthode pour exporter des fichiers pdf et excel des encaissements annulés
	 */

	public void generateReportEncaissementsAnnules(HttpServletResponse response, String reportFormat, String title,
			String demandeur, Long numIntermediaire, Long numProduit, String dateDebut, String dateFin) {

		String caractSup = "_";
		String titleNew = "";
		String demandeurNew = "";

		titleNew = title.replaceAll(caractSup, " ");
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		/*
		 * Traitement pour un fichier PDF
		 */
		if (reportFormat.equalsIgnoreCase(PDF)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
					+ ParamConst.FILENAME_REPORT_ENCAISSEMENTS_ANNULES_PDF + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

//				parameterMap.put("title", title);
//				parameterMap.put("demandeur", demandeur);

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<EncaissementClient> encaissementsAnnules;

				if (!(dateDebut.equals("0") || dateDebut.equals("")) && !(dateFin.equals("0") || dateFin.equals(""))
						&& numProduit == 0 && numIntermediaire == 0) {
					encaissementsAnnules = encaissementRepository.allEncaissementsAnnuleesByPeriode(dateDebut, dateFin);
					System.out.println(" =============== Encaissements annulés By periode ===================");

				} else if (numProduit != 0 && numIntermediaire == 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {
					encaissementsAnnules = encaissementRepository.allEncaissementsAnnuleesByProduit(numProduit);
					System.out.println(" =============== Encaissements annulés by produit ===================");

				} else if (numProduit == 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {
					encaissementsAnnules = encaissementRepository
							.allEncaissementsAnnuleesByIntermediaire(numIntermediaire);
					System.out.println(" =============== Encaissements annulés by intermediaire ===================");

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit != 0 && numIntermediaire == 0) {

					encaissementsAnnules = encaissementRepository
							.allEncaissementsAnnuleesByPeriodeAndProduit(numProduit, dateDebut, dateFin);

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit == 0 && numIntermediaire != 0) {

					encaissementsAnnules = encaissementRepository
							.allEncaissementsAnnuleesByPeriodeAndIntermediaire(numIntermediaire, dateDebut, dateFin);

				} else if (numProduit != 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					encaissementsAnnules = encaissementRepository
							.allEncaissementsAnnuleesByProduitAndIntermediaire(numIntermediaire, numProduit);

				} else if (!(dateDebut.equals("0") && dateDebut.equals(""))
						&& !(dateFin.equals("0") && dateFin.equals("")) && numProduit != 0 && numIntermediaire != 0) {
					encaissementsAnnules = encaissementRepository.allEncaissementsAnnuleesByCriteres(numIntermediaire,
							numProduit, dateDebut, dateFin);

					System.out.println(" =============== Encaissements annulés by criteres ===================");

				} else {
					encaissementsAnnules = encaissementRepository.allEncaissementsAnnulees();
					System.out.println(" =============== Encaissements annulés ===================");

				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(encaissementsAnnules);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition", "inline; filename="
						+ ParamConst.FILENAME_REPORT_ENCAISSEMENTS_ANNULES_PDF + ParamConst.EXTENSION_PDF);
				response.addHeader(" Access-Control-Allow-Origin ", " * ");

				JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		/*
		 * Traitement pour un fichier excel (XLS)
		 */
		if (reportFormat.equalsIgnoreCase(EXCEL)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
					+ ParamConst.FILENAME_REPORT_ENCAISSEMENTS_ANNULES_EXCEL + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

//				parameterMap.put("title", title);
//				parameterMap.put("demandeur", demandeur);

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<EncaissementClient> encaissementsAnnules;

				if (!(dateDebut.equals("0") || dateDebut.equals("")) && !(dateFin.equals("0") || dateFin.equals(""))
						&& numProduit == 0 && numIntermediaire == 0) {
					encaissementsAnnules = encaissementRepository.allEncaissementsAnnuleesByPeriode(dateDebut, dateFin);
					System.out.println(" =============== Encaissements annulés By periode ===================");

				} else if (numProduit != 0 && numIntermediaire == 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {
					encaissementsAnnules = encaissementRepository.allEncaissementsAnnuleesByProduit(numProduit);
					System.out.println(" =============== Encaissements annulés by produit ===================");

				} else if (numProduit == 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {
					encaissementsAnnules = encaissementRepository
							.allEncaissementsAnnuleesByIntermediaire(numIntermediaire);
					System.out.println(" =============== Encaissements annulés by intermediaire ===================");

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit != 0 && numIntermediaire == 0) {

					encaissementsAnnules = encaissementRepository
							.allEncaissementsAnnuleesByPeriodeAndProduit(numProduit, dateDebut, dateFin);

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit == 0 && numIntermediaire != 0) {

					encaissementsAnnules = encaissementRepository
							.allEncaissementsAnnuleesByPeriodeAndIntermediaire(numIntermediaire, dateDebut, dateFin);

				} else if (numProduit != 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					encaissementsAnnules = encaissementRepository
							.allEncaissementsAnnuleesByProduitAndIntermediaire(numIntermediaire, numProduit);

				} else if (!(dateDebut.equals("0") && dateDebut.equals(""))
						&& !(dateFin.equals("0") && dateFin.equals("")) && numProduit != 0 && numIntermediaire != 0) {
					encaissementsAnnules = encaissementRepository.allEncaissementsAnnuleesByCriteres(numIntermediaire,
							numProduit, dateDebut, dateFin);

					System.out.println(" =============== Encaissements annulés by criteres ===================");

				} else {
					encaissementsAnnules = encaissementRepository.allEncaissementsAnnulees();
					System.out.println(" =============== Encaissements annulés ===================");

				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(encaissementsAnnules);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				jasperPrint.setProperty("net.sf.jasperreports.export.xls.detect.cell.type", "true");
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-xlsx");
				response.setHeader("Content-Disposition", "inline; filename="
						+ ParamConst.FILENAME_REPORT_ENCAISSEMENTS_ANNULES_EXCEL + ParamConst.EXTENSION_EXCEL);

				JRXlsxExporter exporterXLS = new JRXlsxExporter();
				exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT, jasperPrint);
				exporterXLS.setParameter(JRExporterParameter.OUTPUT_STREAM, outputStream);

				// Supprimer les sauts de ligne sur excel

				exporterXLS.setParameter(JRXlsExporterParameter.IS_ONE_PAGE_PER_SHEET, Boolean.FALSE);
				exporterXLS.setParameter(JRXlsExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS, Boolean.TRUE);

				exporterXLS.exportReport();

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	@Transactional(rollbackFor = Exception.class)
	public Encaissement encaisser(Encaissement enc) {
		Quittance q = quittanceRepository.findbyIdd(enc.getEncai_numeroquittance());
		Optional<Facture> f = factureRepository.findByNum(enc.getEncai_numerofacture());
		Facture fact = f.get();
		if ((enc.getEncai_mtnquittance() > enc.getEncai_mtnpaye() && q.getQuit_mntprimencaisse() == null) || (q
				.getQuit_mntprimencaisse() != null
				&& (enc.getEncai_mtnquittance() > Long.sum(q.getQuit_mntprimencaisse(), enc.getEncai_mtnpaye())))) {
			enc.setEncai_codetraitement("RP");
			enc.setEncai_solde("Acompte");
			fact.setFact_etatfacture("AC");
		} else {
			enc.setEncai_codetraitement("RG");
			enc.setEncai_solde("Solde");
			fact.setFact_etatfacture("S");

		}

		q.setQuit_dateencaissament(enc.getEncai_datepaiement());
		if (q.getQuit_mntprimencaisse() == null) {
			q.setQuit_mntprimencaisse(enc.getEncai_mtnpaye());
		} else {
			q.setQuit_mntprimencaisse(Long.sum(q.getQuit_mntprimencaisse(), enc.getEncai_mtnpaye()));
		}

		enc.setActive(1L);
		enc.setEncai_numerointermediaire(q.getQuit_numerointermedaire());
		quittanceRepository.save(q);
		factureRepository.save(fact);

		return encaissementRepository.save(enc);
	}

	/*
	 * @Transactional(rollbackFor = Exception.class) public Encaissement
	 * encaisser(Encaissement enc) { Quittance q =
	 * quittanceRepository.findbyIdd(enc.getEncai_numeroquittance());
	 * Optional<Facture> f =
	 * factureRepository.findByNum(enc.getEncai_numerofacture()); Facture fact =
	 * f.get(); if ((enc.getEncai_mtnquittance() > enc.getEncai_mtnpaye() &&
	 * q.getQuit_mntprimencaisse() == null) || (q .getQuit_mntprimencaisse() != null
	 * && (enc.getEncai_mtnquittance() > Long.sum(q.getQuit_mntprimencaisse(),
	 * enc.getEncai_mtnpaye())))) { enc.setEncai_codetraitement("RP");
	 * enc.setEncai_solde("Acompte"); fact.setFact_etatfacture("AC"); } else {
	 * enc.setEncai_codetraitement("RG"); enc.setEncai_solde("Solde");
	 * fact.setFact_etatfacture("S");
	 * 
	 * }
	 * 
	 * q.setQuit_dateencaissament(enc.getEncai_datepaiement());
	 * 
	 * System.out.println("============= MONTANT QUITTANCE = " +
	 * enc.getEncai_mtnquittance());
	 * 
	 * System.out.println("============= MONTANT PAYE = " + enc.getEncai_mtnpaye());
	 * 
	 * if (q.getQuit_mntprimencaisse() == null) { System.out.
	 * println("============= PREMIER ENCAISSEMENT ========================");
	 * q.setQuit_mntprimencaisse(enc.getEncai_mtnpaye()); } else { System.out.
	 * println("============= DEJA FAIT UN ENCAISSEMENT ========================");
	 * // Rectification dû à la gestion des avoirs if
	 * (Long.sum(q.getQuit_mntprimencaisse(), enc.getEncai_mtnpaye()) >
	 * enc.getEncai_mtnquittance()) { System.out.
	 * println("============= ADDITION AVEC MONTANT QUITTANCE ========================"
	 * ); q.setQuit_mntprimencaisse(Long.sum(q.getQuit_mntprimencaisse(),
	 * (enc.getEncai_mtnquittance() - q.getQuit_mntprimencaisse()))); } else {
	 * System.out.
	 * println("============= ADDITION AVEC MONTANT PAYE ENCAISSEMENT ========================"
	 * ); q.setQuit_mntprimencaisse(Long.sum(q.getQuit_mntprimencaisse(),
	 * enc.getEncai_mtnpaye())); }
	 * 
	 * }
	 * 
	 * enc.setActive(1L);
	 * enc.setEncai_numerointermediaire(q.getQuit_numerointermedaire());
	 * quittanceRepository.save(q); factureRepository.save(fact);
	 * 
	 * return encaissementRepository.save(enc); }
	 */

	public Encaissement encaisserM(Encaissement enc, Long MTot) {
		if (MTot < enc.getEncai_mtnpaye()) {
			enc.setEncai_mtnpaye(MTot);
		}

		return encaisser(enc);
	}

	/*
	 * @Transactional(rollbackFor = Exception.class) public String
	 * annulerEncaissements(List<Long> encs) { Long a = 0L; String str = ""; for
	 * (Long e : encs) { a = e; Encaissement enc =
	 * encaissementRepository.findbyIdd(e); Optional<Facture> f =
	 * factureRepository.findByNum(enc.getEncai_numerofacture()); Facture fact =
	 * f.get(); // enc.setActive(0L); enc.setEncai_codeannulation(1L);
	 * enc.setEncai_dateannulation(new Date()); Quittance q =
	 * quittanceRepository.findbyIdd(enc.getEncai_numeroquittance());
	 * 
	 * q.setQuit_mntprimencaisse(q.getQuit_mntprimencaisse() -
	 * enc.getEncai_mtnpaye()); if (q.getQuit_mntprimencaisse() == 0) {
	 * fact.setFact_etatfacture("V"); q.setQuit_dateencaissament(null); } else {
	 * fact.setFact_etatfacture("AC"); } quittanceRepository.save(q);
	 * encaissementRepository.save(enc); str = str + "Encaissement N° " + e +
	 * " est annulé ! \n"; }
	 * 
	 * return str;
	 * 
	 * }
	 * 
	 * 
	 */

	/*
	 * 
	 * @Transactional(rollbackFor = Exception.class) public String
	 * annulerEncaissements(List<Long> encs, String typeAnnulation) { Long a = 0L;
	 * String str = "";
	 * 
	 * System.out.println(typeAnnulation);
	 * 
	 * 
	 * System.out.println("=============================: "+ typeAnnulation);
	 * 
	 * for (Long e : encs) { a = e; Encaissement enc =
	 * encaissementRepository.findbyIdd(e); Optional<Facture> f =
	 * factureRepository.findByNum(enc.getEncai_numerofacture()); Facture fact =
	 * f.get(); // enc.setActive(0L);
	 * 
	 * enc.setEncai_codeannulation(1L); enc.setEncai_dateannulation(new Date());
	 * Quittance q = quittanceRepository.findbyIdd(enc.getEncai_numeroquittance());
	 * 
	 * q.setQuit_mntprimencaisse(q.getQuit_mntprimencaisse() -
	 * enc.getEncai_mtnpaye()); if(q.getQuit_mntprimencaisse() == 0) {
	 * fact.setFact_etatfacture("V"); q.setQuit_dateencaissament(null); }else {
	 * fact.setFact_etatfacture("AC"); } quittanceRepository.save(q);
	 * encaissementRepository.save(enc); str = str + "Encaissement N° " + e +
	 * " est annulé ! \n"; }
	 * 
	 * return str;
	 * 
	 * }
	 * 
	 * enc.setEncai_codeannulation(Long.parseLong(typeAnnulation));
	 * enc.setEncai_dateannulation(new Date()); Quittance q =
	 * quittanceRepository.findbyIdd(enc.getEncai_numeroquittance());
	 * 
	 * 
	 * q.setQuit_mntprimencaisse(q.getQuit_mntprimencaisse() -
	 * enc.getEncai_mtnpaye()); if (q.getQuit_mntprimencaisse() == 0) {
	 * fact.setFact_etatfacture("V"); q.setQuit_dateencaissament(null); } else {
	 * fact.setFact_etatfacture("AC"); } quittanceRepository.save(q);
	 * encaissementRepository.save(enc); str = str + "Encaissement N° " + e +
	 * " est annulé ! \n"; }
	 * 
	 * return str;
	 * 
	 * }
	 */

	@Transactional(rollbackFor = Exception.class)
	public String annulerEncaissements(List<Long> encs, String typeAnnulation) {
		Long a = 0L;
		String str = "";

		System.out.println("=============================: " + typeAnnulation);
		for (Long e : encs) {
			a = e;
			Encaissement enc = encaissementRepository.findbyIdd(e);
			Optional<Facture> f = factureRepository.findByNum(enc.getEncai_numerofacture());
			Facture fact = f.get();
			// enc.setActive(0L);
			enc.setEncai_codeannulation(Long.parseLong(typeAnnulation));
			enc.setEncai_dateannulation(new Date());
			Quittance q = quittanceRepository.findbyIdd(enc.getEncai_numeroquittance());

			q.setQuit_mntprimencaisse(q.getQuit_mntprimencaisse() - enc.getEncai_mtnpaye());
			if (q.getQuit_mntprimencaisse() == 0) {
				fact.setFact_etatfacture("V");
				q.setQuit_dateencaissament(null);
			} else {
				fact.setFact_etatfacture("AC");
			}

			// ================= Traitement statut solde pour les encaissements
			// ==========================
			List<Encaissement> listeEncaissements = encaissementRepository
					.getEncaissements(enc.getEncai_numerofacture());
			for (Encaissement encaisse : listeEncaissements) {
				if (encaisse.getEncai_numeroencaissement() != enc.getEncai_numeroencaissement()) {
					encaisse.setEncai_solde("Acompte");
					encaissementRepository.save(encaisse);
				}
			}

			quittanceRepository.save(q);
			encaissementRepository.save(enc);

			str = str + "Encaissement N° " + e + " est annulé ! \n";
		}

		return str;

	}

	@Transactional(rollbackFor = Exception.class)
	public Facture annulerFacture(Facture fact, Long tAnnul) {
		fact.setFact_codeannulation(tAnnul); // a revoir
		fact.setFact_etatfacture("A");
		fact.setFact_dateannulation(new Date());
		Facture f = factureRepository.save(fact);
		Quittance q = quittanceRepository.findbyIdd(fact.getFact_numeroquittance());
		Long maxFact = quittanceRepository.getMaxNumQuitByPolice(fact.getFact_numeropolice());
		Quittance qAnnulante = new Quittance(q);
		qAnnulante.setQuit_typologieannulation(tAnnul);
		qAnnulante.setQuit_dateannulation(new Date());
		qAnnulante.setQuit_typeecriture("Quittance annulée");
		qAnnulante.setQuit_numeroquittanceannul(q.getQuit_numero());
		qAnnulante.setQuit_numero(Long.valueOf(q.getQuit_numero().toString() + "0").longValue());
		// qAnnulante.setQuit_id(null);
		// qAnnulante.setQuit_numero(null);
		// qAnnulante.setQuit_typeecriture("Quittance annulée");
		Quittance qAnnulerSave = quittanceRepository.saveAndFlush(qAnnulante);
		q.setQuit_typologieannulation(tAnnul);
		q.setQuit_dateannulation(new Date());
		// q.setQuit_typeecriture("Quittance annulée");
		q.setQuit_numeroquittanceannul(qAnnulerSave.getQuit_numero());
		quittanceRepository.save(q);
		return f;

	}/*
		 * 
		 * @Transactional(rollbackFor = Exception.class) public Facture
		 * annulerFacture(Facture fact, Long tAnnul) {
		 * 
		 * fact.setFact_codeannulation(tAnnul); // a revoir
		 * fact.setFact_etatfacture("A"); fact.setFact_dateannulation(new Date());
		 * Facture f = factureRepository.save(fact); Quittance q =
		 * quittanceRepository.findbyIdd(fact.getFact_numeroquittance()); Long maxFact =
		 * quittanceRepository.getMaxNumQuitByPolice(fact.getFact_numeropolice());
		 * Quittance qAnnulante = new Quittance(q);
		 * qAnnulante.setQuit_typologieannulation(tAnnul);
		 * qAnnulante.setQuit_dateannulation(new Date());
		 * qAnnulante.setQuit_numeroquittanceannul(q.getQuit_numero());
		 * qAnnulante.setQuit_numero(Long.valueOf(q.getQuit_numero().toString() +
		 * "0").longValue()); //qAnnulante.setQuit_numero(maxFact + 1); //
		 * qAnnulante.setQuit_id(null); // qAnnulante.setQuit_numero(null);
		 * qAnnulante.setQuit_typeecriture("Quittance annulée"); Quittance qAnnulerSave
		 * = quittanceRepository.saveAndFlush(qAnnulante);
		 * q.setQuit_typologieannulation(tAnnul); q.setQuit_dateannulation(new Date());
		 * q.setQuit_numeroquittanceannul(qAnnulerSave.getQuit_numero());
		 * 
		 * 
		 * quittanceRepository.save(q); return f;
		 * 
		 * }
		 */

	@Transactional(rollbackFor = Exception.class)
	public void reemettreFactEcheanceSeuleLaste(ReemettreDate reemettre, String user) throws ParseException {
		System.out.println("-----------------------------" + reemettre);
		Police ancienPolice = policeRepository.findByPolice(reemettre.getMyForm().getPoli_numero());
		Avenant avenant = new Avenant(ancienPolice, reemettre.getAddForm().getTypeAvenant(), user);
		Long i = ancienPolice.getPoli_numerodernieravenant() + 1;
		avenant.setAven_numeroavenant(
				Long.valueOf(ancienPolice.getPoli_numero().toString() + StringUtils.leftPad(i.toString(), 9, "0"))
						.longValue());
		Avenant newAv = avenantRepository.save(avenant);
		reemettre.getMyForm().setPoli_numerodernieravenant(i);
		policeRepository.save(reemettre.getMyForm());
		Optional<Facture> f = factureRepository.findByNum(reemettre.getAddForm().getNumerofacture());
		Facture fact = f.get();
		Long idFactAnnul = fact.getFact_numacte();
		fact.setFact_dateecheancecontrat(reemettre.getMyForm().getPoli_dateecheance());
		fact.setFact_dateeffetcontrat(reemettre.getAddForm().getDateeffetcontrat());

		factureRepository.save(fact);

		Quittance q = quittanceRepository.findbyPolice(idFactAnnul);
		q.setQuit_dateecheance(reemettre.getMyForm().getPoli_dateecheance());

	}

	public void reemettreFactEcheanceSeule(Police police, Long typeAvenant, String user, Long numFactAnnul) {
		System.out.println(numFactAnnul);
		Police ancienPolice = policeRepository.findByPolice(police.getPoli_numero());
		Avenant avenant = new Avenant(ancienPolice, typeAvenant, user);
		Long i = ancienPolice.getPoli_numerodernieravenant() + 1;
		avenant.setAven_numeroavenant(
				Long.valueOf(ancienPolice.getPoli_numero().toString() + StringUtils.leftPad(i.toString(), 9, "0"))
						.longValue());
		Avenant newAv = avenantRepository.save(avenant);
		police.setPoli_numerodernieravenant(i);
		policeRepository.save(police);
		Optional<Facture> f = factureRepository.findByNum(numFactAnnul);
		Facture fact = f.get();
		Long idFactAnnul = fact.getFact_numacte();
		fact.setFact_dateecheancecontrat(police.getPoli_dateecheance());
		factureRepository.save(fact);
		Quittance q = quittanceRepository.findbyPolice(idFactAnnul);
		q.setQuit_dateecheance(police.getPoli_dateecheance());

	}

	@Transactional(rollbackFor = Exception.class)
	public void payerCommission(List<Facture> facts, InfoCommission infoCom, PayCommission cheque) {

		Long montant = cheque.getMontant();

		for (Facture f : facts) {

			PayerCommission pc = new PayerCommission();
			pc.setPcom_numfact(f.getFact_numacte());
			pc.setPcom_Numquit(f.getFact_numeroquittance());

			pc.setPcom_nupolice(f.getFact_numeropolice());
			pc.setPcom_datepaie(new Date());

			pc.setPcom_mtncomemis(f.getFact_commissionapporteur());
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			UserPrinciple u = (UserPrinciple) auth.getPrincipal();
			pc.setPcom_ccutil(u.getUtil_num());
			pc.setPcom_status("N");
			pc.setPcom_intermed(infoCom.getIntermediaire());
			if (cheque.getNumerocheque() != null) {
				pc.setPcom_numchq(cheque.getNumerocheque().toString());
			}
			if (cheque.getCodeBanque() != null) {
				pc.setPcom_cbanq(cheque.getCodeBanque());
			}

			pc.setPcom_typpai(cheque.getTypeEncaiss());
			pc.setActive(1L);
			pc.setPcom_csolde("solde");
			if (montant >= f.getFact_commissionapporteur()) {
				pc.setPcom_mtncompayé(f.getFact_commissionapporteur());
			} else {
				pc.setPcom_mtncompayé(montant);
				pc.setPcom_csolde("Acompte");
			}
			payerCommissionRepository.save(pc);
			montant -= f.getFact_commissionapporteur();
		}

	}

	/*
	public void downloadRecuFactureSimple(HttpServletResponse response, String demandeur, Long encai_num) {
		String caractSup = "_";
		String demandeurNew = "";
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		EncaissementFacture encaissement = encaissementRepository.getEncaissementFactureById(encai_num);

		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_FACTURE + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {
			design = JRXmlLoader.load(jasperStream);

			JasperReport report = JasperCompileManager.compileReport(design);

			Map<String, Object> parameterMap = new HashMap<String, Object>();

			parameterMap.put("numeroEncaissement", encai_num);
			parameterMap.put("numeroRecours", encaissement.getEncai_numerofacture());
			parameterMap.put("contrat", encaissement.getEncai_numeropolice());
			parameterMap.put("montantFacture", encaissement.getEncai_mtnquittance());
			parameterMap.put("montantFactureLettre", FrenchNumberToWords.convert(encaissement.getEncai_mtnquittance()));
			parameterMap.put("montantRegle", encaissement.getEncai_mtnpaye());
			parameterMap.put("montantRegleLettre", FrenchNumberToWords.convert(encaissement.getEncai_mtnpaye()));
//			parameterMap.put("montantAcompte",
//					(encaissement.getEncai_mtnquittance() - encaissement.getEncai_mtnpaye()));
//			parameterMap.put("montantAcompteLettre", FrenchNumberToWords
//					.convert((encaissement.getEncai_mtnquittance() - encaissement.getEncai_mtnpaye())));
			if (encaissement.getEncai_mtnquittance() >= encaissement.getEncai_mtnpaye()) {
				parameterMap.put("montantAcompte",
						(encaissement.getEncai_mtnquittance() - encaissement.getEncai_mtnpaye()));
				parameterMap.put("solde_avoir", "SOLDE \t\t\t :");
			} else {
				parameterMap.put("montantAcompte",
						(encaissement.getEncai_mtnpaye() - encaissement.getEncai_mtnquittance()));
				parameterMap.put("solde_avoir", "AVOIR \t\t\t :");
			}

			parameterMap.put("montantAcompteLettre",
					FrenchNumberToWords.convert(Long.parseLong(parameterMap.get("montantAcompte").toString())));
			parameterMap.put("reference", demandeurNew);
			parameterMap.put("reglement",
					"Type règlement: " + encaissement.getEncai_typencaissement() + " / Code banque: "
							+ encaissement.getEncai_codebanque() + " / Numéro chèque: "
							+ encaissement.getEncai_numerocheque());

			Branche branche = brancheRepository.findBrancheByNumero(encaissement.getFact_numerobranche());
			if (branche != null) {
				parameterMap.put("branche", branche.getBranche_libelleLong());
			} else {
				parameterMap.put("branche", "");
			}

			Categorie categorie = categorieRepository.getById(encaissement.getFact_numerocategorie());
			if (categorie != null) {
				parameterMap.put("produit", categorie.getCateg_libellelong());
			}

			// Recupéré le donneur d'ordre et remplir ses informations
			Client client = clientRepository.findByNumClient(encaissement.getEncai_numerosouscripteur());
			if (client != null) {
				parameterMap.put("clientPrenom", client.getClien_prenom());
				parameterMap.put("clientNom", client.getClien_nom());
				parameterMap.put("clientDenomination", client.getClien_denomination());
				parameterMap.put("clientAdresse",
						client.getClien_adressenumero() + " / " + client.getClien_adresseville());
			}

			List<Encaissement> encaissements = encaissementRepository.findAll();
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(encaissements);

			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
			final OutputStream outputStream = response.getOutputStream();

			response.setContentType("application/x-pdf");
			response.setHeader("Content-Disposition",
					"inline; filename=" + ParamConst.FILENAME_REPORT_FACTURE + ParamConst.EXTENSION_PDF);
			response.addHeader(" Access-Control-Allow-Origin ", " * ");

			JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

		} catch (JRException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	*/
	
	public void downloadRecuFactureSimple(HttpServletResponse response, String demandeur, Long encai_num) {
		String caractSup = "_";
		String demandeurNew = "";
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		EncaissementFacture encaissement = encaissementRepository.getEncaissementFactureById(encai_num);
		Encaissement notreEncaissement = encaissementRepository.findbyIdd(encaissement.getEncai_numeroencaissement());
		System.out.println("===== ACCOMPTE OU SOLDE: "+ notreEncaissement.getEncai_solde());
		
		Quittance quittance = quittanceRepository.findQuittancebyNumFacture(encaissement.getEncai_numerofacture());

		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_FACTURE + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {
			design = JRXmlLoader.load(jasperStream);

			JasperReport report = JasperCompileManager.compileReport(design);

			Map<String, Object> parameterMap = new HashMap<String, Object>();

			parameterMap.put("numeroEncaissement", encai_num);
			parameterMap.put("numeroRecours", encaissement.getEncai_numerofacture());
			parameterMap.put("contrat", encaissement.getEncai_numeropolice());
			parameterMap.put("montantFacture", encaissement.getEncai_mtnquittance());
			parameterMap.put("montantFactureLettre", FrenchNumberToWords.convert(encaissement.getEncai_mtnquittance()));
			parameterMap.put("montantRegle", encaissement.getEncai_mtnpaye());
			parameterMap.put("montantRegleLettre", FrenchNumberToWords.convert(encaissement.getEncai_mtnpaye()));
			
			if(notreEncaissement.getEncai_solde().equalsIgnoreCase("Acompte") && ((quittance.getQuit_mntprimencaisse() - encaissement.getEncai_mtnpaye()) == 0)) {
				System.out.println("=============== YANGUI ACCOMPTE ================");
//				parameterMap.put("montantPrimeEncaisse", Long.parseLong(""));
//				parameterMap.put("montantPrimeEncaisseLettre", "");
				parameterMap.put("cumulEncaissement", "");
				parameterMap.put("libelleCumulEncaissement", "");
			} else {
				System.out.println("=============== YANGUI SOLDE ================");
				parameterMap.put("montantPrimeEncaisse", quittance.getQuit_mntprimencaisse());
				parameterMap.put("montantPrimeEncaisseLettre", FrenchNumberToWords.convert(quittance.getQuit_mntprimencaisse()));
				
				parameterMap.put("cumulEncaissement", new java.text.DecimalFormat("#,##0").format(Double.valueOf(parameterMap.get("montantPrimeEncaisse").toString()))+" XOF("+parameterMap.get("montantPrimeEncaisseLettre")+") FCFA.");
				parameterMap.put("libelleCumulEncaissement", "MONTANT TOTAL	 :\n ENCAISSE");
			}
			
//			parameterMap.put("montantAcompte",
//					(encaissement.getEncai_mtnquittance() - encaissement.getEncai_mtnpaye()));
//			parameterMap.put("montantAcompteLettre", FrenchNumberToWords
//					.convert((encaissement.getEncai_mtnquittance() - encaissement.getEncai_mtnpaye())));
//			if (encaissement.getEncai_mtnquittance() >= encaissement.getEncai_mtnpaye()) {
//				parameterMap.put("montantAcompte",
//						(encaissement.getEncai_mtnquittance() - encaissement.getEncai_mtnpaye()));
//				parameterMap.put("solde_avoir", "SOLDE \t\t\t :");
//			} else {
//				parameterMap.put("montantAcompte",
//						(encaissement.getEncai_mtnpaye() - encaissement.getEncai_mtnquittance()));
//				parameterMap.put("solde_avoir", "AVOIR \t\t\t :");
//			}
			
			if (encaissement.getEncai_mtnquittance() >= quittance.getQuit_mntprimencaisse()) {
				parameterMap.put("montantAcompte",
						(encaissement.getEncai_mtnquittance() - quittance.getQuit_mntprimencaisse()));
				parameterMap.put("solde_avoir", "SOLDE \t\t\t :");
			} else {
				parameterMap.put("montantAcompte",
						(quittance.getQuit_mntprimencaisse() - encaissement.getEncai_mtnquittance()));
				parameterMap.put("solde_avoir", "AVOIR \t\t\t :");
			}

			parameterMap.put("montantAcompteLettre",
					FrenchNumberToWords.convert(Long.parseLong(parameterMap.get("montantAcompte").toString())));
			parameterMap.put("reference", demandeurNew);
			parameterMap.put("reglement",
					"Type règlement: " + encaissement.getEncai_typencaissement() + " / Code banque: "
							+ encaissement.getEncai_codebanque() + " / Numéro chèque: "
							+ encaissement.getEncai_numerocheque());

			Branche branche = brancheRepository.findBrancheByNumero(encaissement.getFact_numerobranche());
			if (branche != null) {
				parameterMap.put("branche", branche.getBranche_libelleLong());
			} else {
				parameterMap.put("branche", "");
			}

			Categorie categorie = categorieRepository.getById(encaissement.getFact_numerocategorie());
			if (categorie != null) {
				parameterMap.put("produit", categorie.getCateg_libellelong());
			}

			// Recupéré le donneur d'ordre et remplir ses informations
			Client client = clientRepository.findByNumClient(encaissement.getEncai_numerosouscripteur());
			if (client != null) {
				parameterMap.put("clientPrenom", client.getClien_prenom());
				parameterMap.put("clientNom", client.getClien_nom());
				parameterMap.put("clientDenomination", client.getClien_denomination());
				parameterMap.put("clientAdresse",
						client.getClien_adressenumero() + " / " + client.getClien_adresseville());
			}

			List<Encaissement> encaissements = encaissementRepository.findAll();
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(encaissements);

			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
			final OutputStream outputStream = response.getOutputStream();

			response.setContentType("application/x-pdf");
			response.setHeader("Content-Disposition",
					"inline; filename=" + ParamConst.FILENAME_REPORT_FACTURE + ParamConst.EXTENSION_PDF);
			response.addHeader(" Access-Control-Allow-Origin ", " * ");

			JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

		} catch (JRException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void downloadRecuEncaissementAnnuler(HttpServletResponse response, String demandeur, Long encai_num) {
		String caractSup = "_";
		String demandeurNew = "";
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		EncaissementFacture encaissement = encaissementRepository.getEncaissementFactureById(encai_num);

		InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
				+ ParamConst.FILENAME_REPORT_ENCAISSEMENT_ANNULER + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {
			design = JRXmlLoader.load(jasperStream);

			JasperReport report = JasperCompileManager.compileReport(design);

			Map<String, Object> parameterMap = new HashMap<String, Object>();

			parameterMap.put("numeroEncaissement", encai_num);
			parameterMap.put("numeroRecours", encaissement.getEncai_numerofacture());
			parameterMap.put("contrat", encaissement.getEncai_numeropolice());
			parameterMap.put("montantFacture", encaissement.getEncai_mtnquittance());
			parameterMap.put("montantFactureLettre", FrenchNumberToWords.convert(encaissement.getEncai_mtnquittance()));
			parameterMap.put("montantRegle", encaissement.getEncai_mtnpaye());
			parameterMap.put("montantRegleLettre", FrenchNumberToWords.convert(encaissement.getEncai_mtnpaye()));
			parameterMap.put("montantAcompte",
					(encaissement.getEncai_mtnquittance() - encaissement.getEncai_mtnpaye()));
			parameterMap.put("montantAcompteLettre", FrenchNumberToWords
					.convert((encaissement.getEncai_mtnquittance() - encaissement.getEncai_mtnpaye())));
			parameterMap.put("reference", demandeurNew);
			parameterMap.put("reglement",
					"Type règlement: " + encaissement.getEncai_typencaissement() + " / Code banque: "
							+ encaissement.getEncai_codebanque() + " / Numéro chèque: "
							+ encaissement.getEncai_numerocheque());

			Branche branche = brancheRepository.findBrancheByNumero(encaissement.getFact_numerobranche());
			if (branche != null) {
				parameterMap.put("branche", branche.getBranche_libelleLong());
			} else {
				parameterMap.put("branche", "");
			}

			Categorie categorie = categorieRepository.getById(encaissement.getFact_numerocategorie());
			if (categorie != null) {
				parameterMap.put("produit", categorie.getCateg_libellelong());
			}

			// Recupéré le donneur d'ordre et remplir ses informations
			Client client = clientRepository.findByNumClient(encaissement.getEncai_numerosouscripteur());
			if (client != null) {
				parameterMap.put("clientPrenom", client.getClien_prenom());
				parameterMap.put("clientNom", client.getClien_nom());
				parameterMap.put("clientDenomination", client.getClien_denomination());
				parameterMap.put("clientAdresse",
						client.getClien_adressenumero() + " / " + client.getClien_adresseville());
			}

			List<Encaissement> encaissements = encaissementRepository.findAll();
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(encaissements);

			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
			final OutputStream outputStream = response.getOutputStream();

			response.setContentType("application/x-pdf");
			response.setHeader("Content-Disposition",
					"inline; filename=" + ParamConst.FILENAME_REPORT_ENCAISSEMENT_ANNULER + ParamConst.EXTENSION_PDF);
			response.addHeader(" Access-Control-Allow-Origin ", " * ");

			JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

		} catch (JRException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void downloadRecuFactureMultiple(HttpServletResponse response, String demandeur, Long encai_num) {
		/*
		 * String caractSup = "_"; String demandeurNew = ""; demandeurNew =
		 * demandeur.replaceAll(caractSup, " ");
		 * 
		 * Encaissement encaissement = encaissementRepository.findbyIdd(encai_num);
		 * 
		 * InputStream jasperStream =
		 * this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER +
		 * ParamConst.FILENAME_REPORT_RECU_ENCAISSEMENT_RECOURS +
		 * ParamConst.EXTENSION_REPORT); JasperDesign design; try { design =
		 * JRXmlLoader.load(jasperStream);
		 * 
		 * JasperReport report = JasperCompileManager.compileReport(design);
		 * 
		 * Map<String, Object> parameterMap = new HashMap<String, Object>();
		 * 
		 * parameterMap.put("numeroEncaissement", null); parameterMap.put("contrat",
		 * sinistreForm.getMvts_poli()); parameterMap.put("montantFacture",
		 * sinistreForm.getSini_recoursglobal());
		 * parameterMap.put("montantFactureLettre",
		 * FrenchNumberToWords.convert(sinistreForm.getSini_recoursglobal()));
		 * parameterMap.put("montantRegle", sinistreForm.getMvts_montantmvt());
		 * parameterMap.put("montantRegleLettre",
		 * FrenchNumberToWords.convert(sinistreForm.getMvts_montantmvt()));
		 * parameterMap.put("reference", demandeurNew);
		 * 
		 * Recours recours =
		 * recoursRepository.getRecoursByMvt(sinistreForm.getMvts_num()); if(recours !=
		 * null) { parameterMap.put("numeroRecours", recours.getRecou_num());
		 * if(recours.getRecou_typeenc() == "C") {
		 * parameterMap.put("referenceReglement", "Chèque"); } else
		 * if(recours.getRecou_typeenc() == "T") {
		 * parameterMap.put("referenceReglement", "Traite"); } else
		 * if(recours.getRecou_typeenc() == "V") {
		 * parameterMap.put("referenceReglement", "Virement"); } else
		 * if(recours.getRecou_typeenc() == "E") {
		 * parameterMap.put("referenceReglement", "Espèce"); } else {
		 * parameterMap.put("referenceReglement", "Autres"); }
		 * 
		 * parameterMap.put("reglement",
		 * "Code banque: "+recours.getRecou_cbanq()+" / Numéro chèque: "+recours.
		 * getRecou_numchq()); }
		 * 
		 * Branche branche =
		 * brancheRepository.findBrancheByNumero(sinistreForm.getSini_branche()); if
		 * (branche != null) { parameterMap.put("branche",
		 * branche.getBranche_libelleLong()); } else { parameterMap.put("branche", "");
		 * }
		 * 
		 * Produit produit =
		 * produitRepository.getProduitByNumero(sinistreForm.getSini_produit()); if
		 * (produit != null) { parameterMap.put("produit",
		 * produit.getProd_denominationlong()); }
		 * 
		 * // Recupéré le donneur d'ordre et remplir ses informations Client client =
		 * clientRepository.findByNumClient(sinistreForm.getSini_souscripteur()); if
		 * (client != null) { parameterMap.put("clientPrenom",
		 * client.getClien_prenom()); parameterMap.put("clientNom",
		 * client.getClien_nom()); parameterMap.put("clientDenomination",
		 * client.getClien_denomination()); parameterMap.put("clientAdresse",
		 * client.getClien_adressenumero() + " / " + client.getClien_adresseville()); }
		 * 
		 * 
		 * List<Sinistre> sinistres = sinistreRepository.findAll(); JRDataSource
		 * jrDataSource = new JRBeanCollectionDataSource(sinistres);
		 * 
		 * JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap,
		 * jrDataSource); final OutputStream outputStream = response.getOutputStream();
		 * 
		 * response.setContentType("application/x-pdf");
		 * response.setHeader("Content-Disposition", "inline; filename=" +
		 * ParamConst.FILENAME_REPORT_RECU_ENCAISSEMENT_RECOURS +
		 * ParamConst.EXTENSION_PDF);
		 * response.addHeader(" Access-Control-Allow-Origin ", " * ");
		 * 
		 * JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
		 * 
		 * } catch (JRException e) { e.printStackTrace(); } catch (IOException e) {
		 * e.printStackTrace(); }
		 */
	}

	public void generateReportJournalProduction(HttpServletResponse response, String reportFormat, String title,
			String demandeur, String jour, Long numPolice, Long numClient, Long numBranche, Long numProduit,
			Long numIntermediaire) {

		String caractSup = "_";
		String titleNew = "";
		String demandeurNew = "";

		titleNew = title.replaceAll(caractSup, " ");
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		/*
		 * Traitement pour un fichier PDF
		 */
		if (reportFormat.equalsIgnoreCase(PDF)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
					+ ParamConst.FILENAME_REPORT_PRODUCTION_JOURNALIER_PDF + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<ConsulationEncaissement> consultationJournalProduction;

				if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient == 0 && numBranche == 0
						&& numProduit == 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository.listeEncaissementParJour(jour);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice != 0 && numClient == 0 && numBranche == 0
						&& numProduit == 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository.listeEncaissementJournalierByPolice(jour,
							numPolice);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient != 0 && numBranche == 0
						&& numProduit == 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository.listeEncaissementJournalierByClient(jour,
							numClient);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient == 0 && numBranche != 0
						&& numProduit == 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository.listeEncaissementJournalierByBranche(jour,
							numBranche);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient == 0 && numBranche == 0
						&& numProduit != 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository.listeEncaissementJournalierByProduit(jour,
							numProduit);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient == 0 && numBranche == 0
						&& numProduit == 0 && numIntermediaire != 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByIntermediaire(jour, numIntermediaire);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice != 0 && numClient != 0 && numBranche == 0
						&& numProduit == 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByPoliceAndClient(jour, numPolice, numClient);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice != 0 && numClient == 0 && numBranche != 0
						&& numProduit == 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByPoliceAndBranche(jour, numPolice, numBranche);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice != 0 && numClient == 0 && numBranche == 0
						&& numProduit != 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByPoliceAndProduit(jour, numPolice, numProduit);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice != 0 && numClient == 0 && numBranche == 0
						&& numProduit == 0 && numIntermediaire != 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByPoliceAndIntermediaire(jour, numPolice, numIntermediaire);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient != 0 && numBranche != 0
						&& numProduit == 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByClientAndBranche(jour, numClient, numBranche);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient != 0 && numBranche == 0
						&& numProduit != 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByClientAndProduit(jour, numClient, numProduit);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient != 0 && numBranche == 0
						&& numProduit == 0 && numIntermediaire != 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByClientAndIntermediaire(jour, numClient, numIntermediaire);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient == 0 && numBranche != 0
						&& numProduit != 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByBrancheAndProduit(jour, numBranche, numProduit);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient == 0 && numBranche != 0
						&& numProduit == 0 && numIntermediaire != 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByBrancheAndIntermediaire(jour, numBranche, numIntermediaire);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient == 0 && numBranche == 0
						&& numProduit != 0 && numIntermediaire != 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByProduitAndIntermediaire(jour, numProduit, numIntermediaire);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice != 0 && numClient != 0 && numBranche != 0
						&& numProduit == 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByPoliceAndClientAndBranche(jour, numPolice, numClient,
									numBranche);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice != 0 && numClient != 0 && numBranche != 0
						&& numProduit != 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByPoliceAndClientAndBrancheAndProduit(jour, numPolice,
									numClient, numBranche, numProduit);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice != 0 && numClient != 0 && numBranche != 0
						&& numProduit != 0 && numIntermediaire != 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByPoliceAndClientAndBrancheAndProduitAndIntermediaire(jour,
									numPolice, numClient, numBranche, numProduit, numIntermediaire);
				} else {
					consultationJournalProduction = encaissementRepository.listeEncaissementJournalier();
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(consultationJournalProduction);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition", "inline; filename="
						+ ParamConst.FILENAME_REPORT_PRODUCTION_JOURNALIER_PDF + ParamConst.EXTENSION_PDF);
				response.addHeader(" Access-Control-Allow-Origin ", " * ");

				JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		/*
		 * Traitement pour un fichier excel (XLS)
		 */
		if (reportFormat.equalsIgnoreCase(EXCEL)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
					+ ParamConst.FILENAME_REPORT_PRODUCTION_JOURNALIER_EXCEL + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<ConsulationEncaissement> consultationJournalProduction;

				if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient == 0 && numBranche == 0
						&& numProduit == 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository.listeEncaissementParJour(jour);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice != 0 && numClient == 0 && numBranche == 0
						&& numProduit == 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository.listeEncaissementJournalierByPolice(jour,
							numPolice);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient != 0 && numBranche == 0
						&& numProduit == 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository.listeEncaissementJournalierByClient(jour,
							numClient);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient == 0 && numBranche != 0
						&& numProduit == 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository.listeEncaissementJournalierByBranche(jour,
							numBranche);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient == 0 && numBranche == 0
						&& numProduit != 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository.listeEncaissementJournalierByProduit(jour,
							numProduit);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient == 0 && numBranche == 0
						&& numProduit == 0 && numIntermediaire != 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByIntermediaire(jour, numIntermediaire);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice != 0 && numClient != 0 && numBranche == 0
						&& numProduit == 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByPoliceAndClient(jour, numPolice, numClient);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice != 0 && numClient == 0 && numBranche != 0
						&& numProduit == 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByPoliceAndBranche(jour, numPolice, numBranche);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice != 0 && numClient == 0 && numBranche == 0
						&& numProduit != 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByPoliceAndProduit(jour, numPolice, numProduit);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice != 0 && numClient == 0 && numBranche == 0
						&& numProduit == 0 && numIntermediaire != 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByPoliceAndIntermediaire(jour, numPolice, numIntermediaire);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient != 0 && numBranche != 0
						&& numProduit == 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByClientAndBranche(jour, numClient, numBranche);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient != 0 && numBranche == 0
						&& numProduit != 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByClientAndProduit(jour, numClient, numProduit);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient != 0 && numBranche == 0
						&& numProduit == 0 && numIntermediaire != 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByClientAndIntermediaire(jour, numClient, numIntermediaire);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient == 0 && numBranche != 0
						&& numProduit != 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByBrancheAndProduit(jour, numBranche, numProduit);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient == 0 && numBranche != 0
						&& numProduit == 0 && numIntermediaire != 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByBrancheAndIntermediaire(jour, numBranche, numIntermediaire);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice == 0 && numClient == 0 && numBranche == 0
						&& numProduit != 0 && numIntermediaire != 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByProduitAndIntermediaire(jour, numProduit, numIntermediaire);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice != 0 && numClient != 0 && numBranche != 0
						&& numProduit == 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByPoliceAndClientAndBranche(jour, numPolice, numClient,
									numBranche);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice != 0 && numClient != 0 && numBranche != 0
						&& numProduit != 0 && numIntermediaire == 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByPoliceAndClientAndBrancheAndProduit(jour, numPolice,
									numClient, numBranche, numProduit);
				} else if (!(jour.equals("0") || jour.equals("")) && numPolice != 0 && numClient != 0 && numBranche != 0
						&& numProduit != 0 && numIntermediaire != 0) {
					consultationJournalProduction = encaissementRepository
							.listeEncaissementJournalierByPoliceAndClientAndBrancheAndProduitAndIntermediaire(jour,
									numPolice, numClient, numBranche, numProduit, numIntermediaire);
				} else {
					consultationJournalProduction = encaissementRepository.listeEncaissementJournalier();
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(consultationJournalProduction);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-xlsx");
				response.setHeader("Content-Disposition", "inline; filename="
						+ ParamConst.FILENAME_REPORT_PRODUCTION_JOURNALIER_EXCEL + ParamConst.EXTENSION_EXCEL);

				JRXlsxExporter exporterXLS = new JRXlsxExporter();
				exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT, jasperPrint);
				exporterXLS.setParameter(JRExporterParameter.OUTPUT_STREAM, outputStream);

				// Supprimer les sauts de ligne sur excel
				exporterXLS.setParameter(JRXlsExporterParameter.IS_ONE_PAGE_PER_SHEET, Boolean.FALSE);
				exporterXLS.setParameter(JRXlsExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS, Boolean.TRUE);

				exporterXLS.exportReport();

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

}
