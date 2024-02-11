package sn.jmad.sonac.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
import sn.jmad.sonac.message.response.EmissionConsultation;
import sn.jmad.sonac.message.response.ProductionConsultation;
import sn.jmad.sonac.repository.FactureRepository;
import sn.jmad.sonac.repository.QuittanceRepository;
import sn.jmad.sonac.service.constantes.ParamConst;

@Service
public class QuittanceService {

	private static final String PDF = "pdf";
	private static final String EXCEL = "excel";

//	EncaissementRepository encaissementRepository ;

	@Autowired
	private QuittanceRepository quittanceRepository;
	@Autowired
	private FactureRepository factureRepository;

	public void generateReportEmissions(HttpServletResponse response, String reportFormat, String title,
			String demandeur, Long numIntermediaire, Long numProduit, String dateDebut, String dateFin) {

		String caractSup = "_" ;
		String titleNew = "" ;
		String demandeurNew = "" ;
		
		titleNew = title.replaceAll(caractSup, " ");
		demandeurNew = demandeur.replaceAll(caractSup, " ");
		
		/*
		 * Traitement pour un fichier PDF
		 */
		if (reportFormat.equalsIgnoreCase(PDF)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(
					ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_EMISSIONS_PDF + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

//				parameterMap.put("title", title);
//				parameterMap.put("demandeur", demandeur);
				
				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<EmissionConsultation> emissionsConsultation;

				if (!(dateDebut.equals("0") || dateDebut.equals("")) && !(dateFin.equals("0") || dateFin.equals(""))
						&& numProduit == 0 && numIntermediaire == 0) {

					emissionsConsultation = quittanceRepository.allEmissionConsultationByPeriode(dateDebut, dateFin);

				} else if (numProduit != 0 && numIntermediaire == 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					emissionsConsultation = quittanceRepository.allEmissionConsultationByProduit(numProduit);

				} else if (numProduit == 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					emissionsConsultation = quittanceRepository
							.allEmissionConsultationByIntermediaire(numIntermediaire);

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit != 0 && numIntermediaire == 0) {

					emissionsConsultation = quittanceRepository.allEmissionConsultationByPeriodeAndProduit(numProduit,
							dateDebut, dateFin);

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit == 0 && numIntermediaire != 0) {

					emissionsConsultation = quittanceRepository
							.allEmissionConsultationByPeriodeAndIntermediaire(numIntermediaire, dateDebut, dateFin);

				} else if (numProduit != 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					emissionsConsultation = quittanceRepository
							.allEmissionConsultationByProduitAndIntermediaire(numIntermediaire, numProduit);

				} else if (!(dateDebut.equals("0") && dateDebut.equals(""))
						&& !(dateFin.equals("0") && dateFin.equals("")) && numProduit != 0 && numIntermediaire != 0) {

					emissionsConsultation = quittanceRepository.allEmissionConsultationByAllCriteres(numIntermediaire,
							numProduit, dateDebut, dateFin);

				} else {

					emissionsConsultation = quittanceRepository.allEmissionConsultation();
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(emissionsConsultation);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_EMISSIONS_PDF + ParamConst.EXTENSION_PDF);
				response.addHeader (" Access-Control-Allow-Origin "," * ");

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
					+ ParamConst.FILENAME_REPORT_EMISSIONS_EXCEL + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();
				
//				parameterMap.put("title", title);
//				parameterMap.put("demandeur", demandeur);
				
				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<EmissionConsultation> emissionsConsultation;

				if (!(dateDebut.equals("0") || dateDebut.equals("")) && !(dateFin.equals("0") || dateFin.equals(""))
						&& numProduit == 0 && numIntermediaire == 0) {

					emissionsConsultation = quittanceRepository.allEmissionConsultationByPeriode(dateDebut, dateFin);

				} else if (numProduit != 0 && numIntermediaire == 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					emissionsConsultation = quittanceRepository.allEmissionConsultationByProduit(numProduit);

				} else if (numProduit == 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					emissionsConsultation = quittanceRepository
							.allEmissionConsultationByIntermediaire(numIntermediaire);

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit != 0 && numIntermediaire == 0) {

					emissionsConsultation = quittanceRepository.allEmissionConsultationByPeriodeAndProduit(numProduit,
							dateDebut, dateFin);

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit == 0 && numIntermediaire != 0) {

					emissionsConsultation = quittanceRepository
							.allEmissionConsultationByPeriodeAndIntermediaire(numIntermediaire, dateDebut, dateFin);

				} else if (numProduit != 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					emissionsConsultation = quittanceRepository
							.allEmissionConsultationByProduitAndIntermediaire(numIntermediaire, numProduit);

				} else if (!(dateDebut.equals("0") && dateDebut.equals(""))
						&& !(dateFin.equals("0") && dateFin.equals("")) && numProduit != 0 && numIntermediaire != 0) {

					emissionsConsultation = quittanceRepository.allEmissionConsultationByAllCriteres(numIntermediaire,
							numProduit, dateDebut, dateFin);

				} else {

					emissionsConsultation = quittanceRepository.allEmissionConsultation();
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(emissionsConsultation);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				jasperPrint.setProperty("net.sf.jasperreports.export.xls.detect.cell.type", "true");
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-xlsx");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_EMISSIONS_EXCEL + ParamConst.EXTENSION_EXCEL);

				JRXlsxExporter exporterXLS = new JRXlsxExporter();
				exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT, jasperPrint);
				exporterXLS.setParameter(JRExporterParameter.OUTPUT_STREAM, outputStream);

				// Supprimer les sauts de ligne sur excel

				exporterXLS.setParameter(JRXlsExporterParameter.IS_ONE_PAGE_PER_SHEET, Boolean.FALSE);
				exporterXLS.setParameter(JRXlsExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS, Boolean.TRUE);
				
//				exporterXLS.setParameter("net.sf.jasperreports.export.xls.detect.cell.type", Boolean.TRUE);
				

				exporterXLS.exportReport();

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public void generateReportEmissionsAnnulees(HttpServletResponse response, String reportFormat, String title,
			String demandeur, Long numIntermediaire, Long numProduit, String dateDebut, String dateFin) {

		String caractSup = "_" ;
		String titleNew = "" ;
		String demandeurNew = "" ;
		
		titleNew = title.replaceAll(caractSup, " ");
		demandeurNew = demandeur.replaceAll(caractSup, " ");
		
		/*
		 * Traitement pour un fichier PDF
		 */
		if (reportFormat.equalsIgnoreCase(PDF)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
					+ ParamConst.FILENAME_REPORT_EMISSIONS_ANNULEES_PDF + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

//				parameterMap.put("title", title);
//				parameterMap.put("demandeur", demandeur);
				
				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

//				List<EncaissementClient> encaissements = encaissementRepository.allEncaissementAndClient() ;
				List<EmissionConsultation> emissionsAnnuleesConsultation;

				if (!(dateDebut.equals("0") || dateDebut.equals("")) && !(dateFin.equals("0") || dateFin.equals(""))
						&& numProduit == 0 && numIntermediaire == 0) {
					emissionsAnnuleesConsultation = quittanceRepository
							.allEmissionsAnnuleesConsultationByPeriode(dateDebut, dateFin);
					System.out.println(" =============== Emissions annulées By periode ===================");

				} else if (numProduit != 0 && numIntermediaire == 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					emissionsAnnuleesConsultation = quittanceRepository
							.allEmissionsAnnuleesConsultationByProduit(numProduit);

				} else if (numProduit == 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					emissionsAnnuleesConsultation = quittanceRepository
							.allEmissionsAnnuleesConsultationByIntermediaire(numIntermediaire);

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit != 0 && numIntermediaire == 0) {

					emissionsAnnuleesConsultation = quittanceRepository
							.allEmissionsAnnuleesConsultationByPeriodeAndProduit(numProduit, dateDebut, dateFin);

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit == 0 && numIntermediaire != 0) {

					emissionsAnnuleesConsultation = quittanceRepository
							.allEmissionsAnnuleesConsultationByPeriodeAndIntermediaire(numIntermediaire, dateDebut,
									dateFin);

				} else if (numProduit != 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					emissionsAnnuleesConsultation = quittanceRepository
							.allEmissionsAnnuleesConsultationByProduitAndIntermediaire(numIntermediaire, numProduit);

				} else if (!(dateDebut.equals("0") && dateDebut.equals(""))
						&& !(dateFin.equals("0") && dateFin.equals("")) && numProduit != 0 && numIntermediaire != 0) {
					emissionsAnnuleesConsultation = quittanceRepository.allEmissionsAnnuleesConsultationByAllCriteres(
							numIntermediaire, numProduit, dateDebut, dateFin);

				} else {
					emissionsAnnuleesConsultation = quittanceRepository.allEmissionsAnnuleesConsultation();
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(emissionsAnnuleesConsultation);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition", "inline; filename="
						+ ParamConst.FILENAME_REPORT_EMISSIONS_ANNULEES_PDF + ParamConst.EXTENSION_PDF);
				response.addHeader (" Access-Control-Allow-Origin "," * ");

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
					+ ParamConst.FILENAME_REPORT_EMISSIONS_ANNULEES_EXCEL + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();
				
//				parameterMap.put("title", title);
//				parameterMap.put("demandeur", demandeur);

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);
				
				List<EmissionConsultation> emissionsAnnuleesConsultation;

				if (!(dateDebut.equals("0") || dateDebut.equals("")) && !(dateFin.equals("0") || dateFin.equals(""))
						&& numProduit == 0 && numIntermediaire == 0) {
					emissionsAnnuleesConsultation = quittanceRepository
							.allEmissionsAnnuleesConsultationByPeriode(dateDebut, dateFin);
					System.out.println(" =============== Emissions annulées By periode ===================");

				} else if (numProduit != 0 && numIntermediaire == 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					emissionsAnnuleesConsultation = quittanceRepository
							.allEmissionsAnnuleesConsultationByProduit(numProduit);

				} else if (numProduit == 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					emissionsAnnuleesConsultation = quittanceRepository
							.allEmissionsAnnuleesConsultationByIntermediaire(numIntermediaire);

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit != 0 && numIntermediaire == 0) {

					emissionsAnnuleesConsultation = quittanceRepository
							.allEmissionsAnnuleesConsultationByPeriodeAndProduit(numProduit, dateDebut, dateFin);

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit == 0 && numIntermediaire != 0) {

					emissionsAnnuleesConsultation = quittanceRepository
							.allEmissionsAnnuleesConsultationByPeriodeAndIntermediaire(numIntermediaire, dateDebut,
									dateFin);

				} else if (numProduit != 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					emissionsAnnuleesConsultation = quittanceRepository
							.allEmissionsAnnuleesConsultationByProduitAndIntermediaire(numIntermediaire, numProduit);

				} else if (!(dateDebut.equals("0") && dateDebut.equals(""))
						&& !(dateFin.equals("0") && dateFin.equals("")) && numProduit != 0 && numIntermediaire != 0) {
					emissionsAnnuleesConsultation = quittanceRepository.allEmissionsAnnuleesConsultationByAllCriteres(
							numIntermediaire, numProduit, dateDebut, dateFin);

				} else {
					emissionsAnnuleesConsultation = quittanceRepository.allEmissionsAnnuleesConsultation();
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(emissionsAnnuleesConsultation);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				jasperPrint.setProperty("net.sf.jasperreports.export.xls.detect.cell.type", "true");
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-xlsx");
				response.setHeader("Content-Disposition", "inline; filename="
						+ ParamConst.FILENAME_REPORT_EMISSIONS_ANNULEES_EXCEL + ParamConst.EXTENSION_EXCEL);
				response.addHeader (" Access-Control-Allow-Origin "," * ");

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

	// ==================================================================================================
	// Service permettant de faire l'export en fichier pdf et excel des productions
	// (quittances payées)

	public void generateReportProduction(HttpServletResponse response, String reportFormat, String title,
			String demandeur, Long numIntermediaire, Long numProduit, String dateDebut, String dateFin) {

		String caractSup = "_" ;
		String titleNew = "" ;
		String demandeurNew = "" ;
		
		titleNew = title.replaceAll(caractSup, " ");
		demandeurNew = demandeur.replaceAll(caractSup, " ");
		
		/*
		 * Traitement pour un fichier PDF
		 */
		if (reportFormat.equalsIgnoreCase(PDF)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
					+ ParamConst.FILENAME_REPORT_PRODUCTIONS_PDF + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

//				String logo_img = System.getProperty("user.home")+"/img/SONAC.png" ;
//				System.out.println("Logo: "+ logo_img);
				Map<String, Object> parameterMap = new HashMap<String, Object>();

//				parameterMap.put("title", title);
//				parameterMap.put("demandeur", demandeur);
				
				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<ProductionConsultation> productionsConsultation;

				if (!(dateDebut.equals("0") || dateDebut.equals("")) && !(dateFin.equals("0") || dateFin.equals(""))
						&& numProduit == 0 && numIntermediaire == 0) {

					productionsConsultation = quittanceRepository.allProductionConsultationByPeriode(dateDebut,
							dateFin);

				} else if (numProduit != 0 && numIntermediaire == 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					productionsConsultation = quittanceRepository.allProductionConsultationByProduit(numProduit);

				} else if (numProduit == 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					productionsConsultation = quittanceRepository
							.allProductionConsultationByIntermediaire(numIntermediaire);

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit != 0 && numIntermediaire == 0) {

					productionsConsultation = quittanceRepository
							.allProductionConsultationByPeriodeAndProduit(numProduit, dateDebut, dateFin);

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit == 0 && numIntermediaire != 0) {

					productionsConsultation = quittanceRepository
							.allProductionConsultationByPeriodeAndIntermediaire(numIntermediaire, dateDebut, dateFin);

				} else if (numProduit != 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					productionsConsultation = quittanceRepository
							.allProductionConsultationByProduitAndIntermediaire(numIntermediaire, numProduit);

				} else if (!(dateDebut.equals("0") && dateDebut.equals(""))
						&& !(dateFin.equals("0") && dateFin.equals("")) && numProduit != 0 && numIntermediaire != 0) {

					productionsConsultation = quittanceRepository
							.allProductionConsultationByAllCriteres(numIntermediaire, numProduit, dateDebut, dateFin);

				} else {

					productionsConsultation = quittanceRepository.allProductionConsultation();
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(productionsConsultation);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_PRODUCTIONS_PDF + ParamConst.EXTENSION_PDF);
				response.addHeader (" Access-Control-Allow-Origin "," * ");

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
					+ ParamConst.FILENAME_REPORT_PRODUCTIONS_EXCEL + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();
				
//				parameterMap.put("title", title);
//				parameterMap.put("demandeur", demandeur);
				
				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<ProductionConsultation> productionsConsultation;

				if (!(dateDebut.equals("0") || dateDebut.equals("")) && !(dateFin.equals("0") || dateFin.equals(""))
						&& numProduit == 0 && numIntermediaire == 0) {

					productionsConsultation = quittanceRepository.allProductionConsultationByPeriode(dateDebut,
							dateFin);

				} else if (numProduit != 0 && numIntermediaire == 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					productionsConsultation = quittanceRepository.allProductionConsultationByProduit(numProduit);

				} else if (numProduit == 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					productionsConsultation = quittanceRepository
							.allProductionConsultationByIntermediaire(numIntermediaire);

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit != 0 && numIntermediaire == 0) {

					productionsConsultation = quittanceRepository
							.allProductionConsultationByPeriodeAndProduit(numProduit, dateDebut, dateFin);

				} else if (!(dateDebut.equals("0") || dateDebut.equals(""))
						&& !(dateFin.equals("0") || dateFin.equals("")) && numProduit == 0 && numIntermediaire != 0) {

					productionsConsultation = quittanceRepository
							.allProductionConsultationByPeriodeAndIntermediaire(numIntermediaire, dateDebut, dateFin);

				} else if (numProduit != 0 && numIntermediaire != 0 && (dateDebut.equals("0") || dateDebut.equals(""))
						&& (dateFin.equals("0") || dateFin.equals(""))) {

					productionsConsultation = quittanceRepository
							.allProductionConsultationByProduitAndIntermediaire(numIntermediaire, numProduit);

				} else if (!(dateDebut.equals("0") && dateDebut.equals(""))
						&& !(dateFin.equals("0") && dateFin.equals("")) && numProduit != 0 && numIntermediaire != 0) {

					productionsConsultation = quittanceRepository
							.allProductionConsultationByAllCriteres(numIntermediaire, numProduit, dateDebut, dateFin);

				} else {

					productionsConsultation = quittanceRepository.allProductionConsultation();
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(productionsConsultation);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				jasperPrint.setProperty("net.sf.jasperreports.export.xls.detect.cell.type", "true");
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-xlsx");
				response.setHeader("Content-Disposition", "inline; filename="
						+ ParamConst.FILENAME_REPORT_PRODUCTIONS_EXCEL + ParamConst.EXTENSION_EXCEL);

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
