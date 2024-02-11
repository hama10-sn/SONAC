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
import sn.jmad.sonac.message.response.EngagementAcheteur;
import sn.jmad.sonac.message.response.SinistreClient;
import sn.jmad.sonac.model.Engagement;
import sn.jmad.sonac.repository.EngagementRepository;
import sn.jmad.sonac.service.constantes.ParamConst;

@Service
public class EngagementService {

	private static final String PDF = "pdf";
	private static final String EXCEL = "excel";

	@Autowired
	EngagementRepository engagementRepository;

	public void generateReportEngagement(HttpServletResponse response, String reportFormat, String title,
			String demandeur) {
		
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
					ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_ENGAGEMENT_PDF + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

//				parameterMap.put("title", title);
//				parameterMap.put("demandeur", demandeur);
				
				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<Engagement> categories = engagementRepository.allEngagements(1);
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(categories);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_ENGAGEMENT_PDF + ParamConst.EXTENSION_PDF);
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
			
			InputStream jasperStream = this.getClass().getResourceAsStream(
					ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_ENGAGEMENT_EXCEL + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();
//				parameterMap.put("title", title);
//				parameterMap.put("demandeur", demandeur);
				
				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<Engagement> categories = engagementRepository.allEngagements(1);
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(categories);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-xlsx");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_ENGAGEMENT_EXCEL + ParamConst.EXTENSION_EXCEL);

				JRXlsxExporter exporterXLS = new JRXlsxExporter();
				exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT, jasperPrint);
				exporterXLS.setParameter(JRExporterParameter.OUTPUT_STREAM, outputStream);

				exporterXLS.exportReport();

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	public void generateReportConsultationEngagement(HttpServletResponse response, String reportFormat, String title,
			String demandeur, Long numPolice, Long numBranche, Long numClient, String debut, String fin, Long numProduit) {

		String caractSup = "_";
		String titleNew = "";
		String demandeurNew = "";

		titleNew = title.replaceAll(caractSup, " ");
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		/*
		 * Traitement pour un fichier PDF
		 */
		if (reportFormat.equalsIgnoreCase(PDF)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(
					ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_CONSULTATION_ENGAGEMENT_PDF + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<EngagementAcheteur> engagementConsulte;

				if (numPolice != 0 && numBranche == 0 && numClient == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numProduit == 0) {
					engagementConsulte = engagementRepository.getEngagementsByPolice(numPolice);
				} else if (numPolice == 0 && numBranche != 0 && numClient == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numProduit == 0) {
					engagementConsulte = engagementRepository.getEngagementsByBranche(numBranche);
				} else if (numPolice == 0 && numBranche == 0 && numClient != 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numProduit == 0) {
					engagementConsulte = engagementRepository.getEngagementsByClient(numClient);
				} else if (numPolice == 0 && numBranche == 0 && numClient == 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numProduit == 0) {
					engagementConsulte = engagementRepository.getEngagementsByPeriode(debut, fin);
				} else if (numPolice == 0 && numBranche == 0 && numClient == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numProduit != 0) {
					engagementConsulte = engagementRepository.getEngagementsByProduit(numProduit);
				} else if (numPolice != 0 && numBranche != 0 && numClient == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numProduit == 0) {
					engagementConsulte = engagementRepository.getEngagementsByPoliceAndBranche(numPolice, numBranche);
				} else if (numPolice != 0 && numBranche == 0 && numClient != 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numProduit == 0) {
					engagementConsulte = engagementRepository.getEngagementsByPoliceAndClient(numPolice, numClient);
				} else if (numPolice != 0 && numBranche == 0 && numClient == 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numProduit == 0) {
					engagementConsulte = engagementRepository.getEngagementsByPoliceAndPeriode(numPolice, debut, fin);
				} else if (numPolice != 0 && numBranche == 0 && numClient == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numProduit != 0) {
					engagementConsulte = engagementRepository.getEngagementsByPoliceAndProduit(numPolice, numProduit);
				} else if (numPolice != 0 && numBranche != 0 && numClient != 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numProduit != 0) {
					engagementConsulte = engagementRepository.getEngagementsByPoliceAndBrancheAndClientAndPeriodeAndProduit(numPolice, numBranche, numClient, debut, fin, numProduit);
				} else {
					engagementConsulte = engagementRepository.getAllEngagements();
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(engagementConsulte);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_SINISTRES_PDF + ParamConst.EXTENSION_PDF);
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
					+ ParamConst.FILENAME_REPORT_CONSULTATION_ENGAGEMENT_EXCEL + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<EngagementAcheteur> engagementConsulte;

				if (numPolice != 0 && numBranche == 0 && numClient == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numProduit == 0) {
					engagementConsulte = engagementRepository.getEngagementsByPolice(numPolice);
				} else if (numPolice == 0 && numBranche != 0 && numClient == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numProduit == 0) {
					engagementConsulte = engagementRepository.getEngagementsByBranche(numBranche);
				} else if (numPolice == 0 && numBranche == 0 && numClient != 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numProduit == 0) {
					engagementConsulte = engagementRepository.getEngagementsByClient(numClient);
				} else if (numPolice == 0 && numBranche == 0 && numClient == 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numProduit == 0) {
					engagementConsulte = engagementRepository.getEngagementsByPeriode(debut, fin);
				} else if (numPolice == 0 && numBranche == 0 && numClient == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numProduit != 0) {
					engagementConsulte = engagementRepository.getEngagementsByProduit(numProduit);
				} else if (numPolice != 0 && numBranche != 0 && numClient == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numProduit == 0) {
					engagementConsulte = engagementRepository.getEngagementsByPoliceAndBranche(numPolice, numBranche);
				} else if (numPolice != 0 && numBranche == 0 && numClient != 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numProduit == 0) {
					engagementConsulte = engagementRepository.getEngagementsByPoliceAndClient(numPolice, numClient);
				} else if (numPolice != 0 && numBranche == 0 && numClient == 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numProduit == 0) {
					engagementConsulte = engagementRepository.getEngagementsByPoliceAndPeriode(numPolice, debut, fin);
				} else if (numPolice != 0 && numBranche == 0 && numClient == 0 && (debut.equals("0") || debut.equals(""))
						&& (fin.equals("0") || fin.equals("")) && numProduit != 0) {
					engagementConsulte = engagementRepository.getEngagementsByPoliceAndProduit(numPolice, numProduit);
				} else if (numPolice != 0 && numBranche != 0 && numClient != 0 && !(debut.equals("0") || debut.equals(""))
						&& !(fin.equals("0") || fin.equals("")) && numProduit != 0) {
					engagementConsulte = engagementRepository.getEngagementsByPoliceAndBrancheAndClientAndPeriodeAndProduit(numPolice, numBranche, numClient, debut, fin, numProduit);
				} else {
					engagementConsulte = engagementRepository.getAllEngagements();
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(engagementConsulte);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-xlsx");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_SINISTRES_EXCEL + ParamConst.EXTENSION_EXCEL);

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
