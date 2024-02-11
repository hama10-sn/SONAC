package sn.jmad.sonac.service;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

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
import net.sf.jasperreports.engine.export.JRTextExporterParameter;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.engine.xml.JRXmlLoader;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import sn.jmad.sonac.message.response.ClientContact;
import sn.jmad.sonac.model.Dem_Pers;
import sn.jmad.sonac.model.Locataires;
import sn.jmad.sonac.model.ReferenceTech;
import sn.jmad.sonac.repository.ClientRepository;
import sn.jmad.sonac.repository.DemPersRepository;
import sn.jmad.sonac.service.constantes.FrenchNumberToWords;
import sn.jmad.sonac.service.constantes.ParamConst;
import net.sf.jasperreports.engine.JRDataSource;

import java.util.List;

@Service
public class ArbitrageService {
	
	private static final String PDF = "pdf";
	private static final String EXCEL = "excel";
	private static final String WORD = "word";
	private static long lettre=0;

	@Autowired
	DemPersRepository demPersRepository;
	@Autowired
	ClientRepository clientRepository;
	
	FrenchNumberToWords frenchNumberToWords;

	public void generateReportSoumission(HttpServletResponse response, Long id) {

//		InputStream jasperStream = this.getClass().getResourceAsStream("/reports/client.jrxml");
		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_SOUMISSION + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {
			design = JRXmlLoader.load(jasperStream);

			JasperReport report = JasperCompileManager.compileReport(design);

			Map<String, Object> parameterMap = new HashMap<String, Object>();

//			List<Client> clients = clientRepository.allclients();
			List<?> dem = demPersRepository.findByDemPersnum(id);
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(dem);

//			parameterMap.put("datasource", jrDataSource);
			//parameterMap.put("title", title);
			//parameterMap.put("demandeur", demandeur);

			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
			final OutputStream outputStream = response.getOutputStream();


				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_SOUMISSION + ParamConst.EXTENSION_PDF);

				JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
		

			

		} catch (JRException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	
	
	public void generateReportConditionGenerale(HttpServletResponse response,Long id) {

//		InputStream jasperStream = this.getClass().getResourceAsStream("/reports/client.jrxml");
		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_CONDITION_GENERALE + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {
			design = JRXmlLoader.load(jasperStream);

			JasperReport report = JasperCompileManager.compileReport(design);

			Map<String, Object> parameterMap = new HashMap<String, Object>();

//			List<Client> clients = clientRepository.allclients();
			List<?> DemPers = demPersRepository.findByDemPersnum(id);
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(DemPers);

//			parameterMap.put("datasource", jrDataSource);
			//parameterMap.put("title", title);
			//parameterMap.put("demandeur", demandeur);

			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
			final OutputStream outputStream = response.getOutputStream();


				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_CONDITION_GENERALE + ParamConst.EXTENSION_PDF);

				JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
		

			

		} catch (JRException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	
	public void generateReportConditionParticulier(HttpServletResponse response,Long id) {

//		InputStream jasperStream = this.getClass().getResourceAsStream("/reports/client.jrxml");
		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_GARANTIE_PARTICULIERE + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {
			design = JRXmlLoader.load(jasperStream);

			JasperReport report = JasperCompileManager.compileReport(design);

			Map<String, Object> parameterMap = new HashMap<String, Object>();

//			List<Client> clients = clientRepository.allclients();
			List<?> DemPers = demPersRepository.findByDemPersnum(id);
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(DemPers);

//			parameterMap.put("datasource", jrDataSource);
			//parameterMap.put("title", title);
			//parameterMap.put("demandeur", demandeur);

			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
			final OutputStream outputStream = response.getOutputStream();


				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_GARANTIE_PARTICULIERE+ ParamConst.EXTENSION_PDF);

				JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
		

			

		} catch (JRException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void generateReportInstruction(HttpServletResponse response,Long id) {

//		InputStream jasperStream = this.getClass().getResourceAsStream("/reports/client.jrxml");
		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_INSTRUCTION_PDF + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {
			design = JRXmlLoader.load(jasperStream);

			JasperReport report = JasperCompileManager.compileReport(design);

			Map<String, Object> parameterMap = new HashMap<String, Object>();

//			List<Client> clients = clientRepository.allclients();
			List<?> DemPers = demPersRepository.findByDemPersnum(id);
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(DemPers);

//			parameterMap.put("datasource", jrDataSource);
			//parameterMap.put("title", title);
			//parameterMap.put("demandeur", demandeur);

			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
			final OutputStream outputStream = response.getOutputStream();


				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_INSTRUCTION_PDF+ ParamConst.EXTENSION_PDF);

				JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
		

			

		} catch (JRException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public void generateReportClient(HttpServletResponse response, String reportFormat) {

		String caractSup = "_";
		String titleNew = "";
		String demandeurNew = "";

		//titleNew = title.replaceAll(caractSup, " ");
		//demandeurNew = demandeur.replaceAll(caractSup, " ");

		/*
		 * Traitement pour un fichier PDF
		 */
		/*if (reportFormat.equalsIgnoreCase(PDF)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(
					ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_CLIENT_PDF + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

//				parameterMap.put("title", title);
//				parameterMap.put("demandeur", demandeur);

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<ClientContact> clients = clientRepository.allclientandcontact();
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(clients);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_CLIENT_PDF + ParamConst.EXTENSION_PDF);
				response.addHeader(" Access-Control-Allow-Origin ", " * ");

				JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}*/

		/*
		 * Traitement pour un fichier excel (XLS)
		 */
		if (reportFormat.equalsIgnoreCase(EXCEL)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(
					ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_INSTRUCTION_PDF + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();
//				parameterMap.put("title", title);
//				parameterMap.put("demandeur", demandeur);

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<ClientContact> clients = clientRepository.allclientandcontact();
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(clients);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-xlsx");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_INSTRUCTION_PDF + ParamConst.EXTENSION_EXCEL);

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
		if (reportFormat.equalsIgnoreCase(WORD)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(
					ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_INSTRUCTION_PDF + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();
//				parameterMap.put("title", title);
//				parameterMap.put("demandeur", demandeur);

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<ClientContact> clients = clientRepository.allclientandcontact();
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(clients);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/docx");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_INSTRUCTION_PDF + ParamConst.EXTENSION_WORD);

				JRDocxExporter exporterDOCX = new JRDocxExporter();
				exporterDOCX .setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
				exporterDOCX .setParameter(JRExporterParameter.OUTPUT_STREAM, outputStream);

				// Supprimer les sauts de ligne sur excel

				exporterDOCX .setParameter(JRTextExporterParameter.OUTPUT_FILE, Boolean.FALSE);
				//exporterDOCX .setParameter(JRXlsExporterParameter.IS_ONE_PAGE_PER_SHEET, Boolean.FALSE);
				//exporterDOCX .setParameter(JRXlsExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS, Boolean.TRUE);
				exporterDOCX .setParameter(JRTextExporterParameter.END_PAGE_INDEX, Boolean.TRUE);

				exporterDOCX.exportReport();

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	public void word(HttpServletResponse response,Long id,String demandeur) {
		
		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_INSTRUCTION_PDF + ParamConst.EXTENSION_REPORT);
		
		JasperDesign design;

		try {
			
			design = JRXmlLoader.load(jasperStream);
			JasperReport report = JasperCompileManager.compileReport(design);
		     // String pathToReports = "/home/test/";
		      //Map<String, Object> params = new HashMap<>();
		      //JRDataSource jsonDataSource = new JsonDataSource(new File("/home/test/example.json"));
		      //asperReport jasperReport = JasperCompileManager.compileReport(pathToReports + "main.jrxml");
		 
		      //JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, params, jsonDataSource);
		      //JasperReport report = JasperCompileManager.compileReport(design);
		      Map<String, Object> parameterMap = new HashMap<String, Object>();
		      parameterMap.put("demandeur", demandeur);
		      
		      List<?> DemPers = demPersRepository.findByDemPersnum(id);
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(DemPers);

		      JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

		      //Export to PDF     
		      // JasperExportManager.exportReportToPdfFile(jasperPrint, "/home/test/fileName.pdf");
		 
		      //Export to Word
		      JRDocxExporter exporter = new JRDocxExporter();    
		      exporter.setExporterInput(new SimpleExporterInput(jasperPrint)); 
		      //File exportReportFile = new File("fileName" + ".docx");   
		      exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
		      //exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(exportReportFile));  
		      response.setHeader("Content-Disposition", "attachment;filename=jasperfile.docx");
		        response.setContentType("application/octet-stream");
		        exporter.exportReport();
		      
		      //exporter.exportReport();
		 
		    } catch (Exception e) {}
		  }
		public void wordsociete(HttpServletResponse response,Long id,String demandeur,String raisonsociale,
				String anneerelation,Long soumission,Long avancedemarrage,
				Long bonneexcution,Long retenuegarantie,String nomgerant,Long definitive,Long cmttotale,
				Long soumissionencours,Long avancedemarrageencours, Long bonneexecutionencours,
				Long retenuegarantieencours, Long definitiveencours,Long cmttotaleencours,Long policenumero,
				String denomminationsociale,String objetavenant,String datesoucription, String beneficiaire) {
		
		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_INSTRUCTION_PDF + ParamConst.EXTENSION_REPORT);
		
		JasperDesign design;

		try {
			
			design = JRXmlLoader.load(jasperStream);
			JasperReport report = JasperCompileManager.compileReport(design);
		     // String pathToReports = "/home/test/";
		      //Map<String, Object> params = new HashMap<>();
		      //JRDataSource jsonDataSource = new JsonDataSource(new File("/home/test/example.json"));
		      //asperReport jasperReport = JasperCompileManager.compileReport(pathToReports + "main.jrxml");
		 
		      //JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, params, jsonDataSource);
		      //JasperReport report = JasperCompileManager.compileReport(design);
		      Map<String, Object> parameterMap = new HashMap<String, Object>();
		      parameterMap.put("demandeur", demandeur);
		      parameterMap.put("raisonsociale", raisonsociale);
		      parameterMap.put("anneerelation", anneerelation);
		      parameterMap.put("soumission", soumission);
		      parameterMap.put("avancedemarrage",avancedemarrage);
		      parameterMap.put("bonneexcution",bonneexcution);
		      parameterMap.put("retenuegarantie",retenuegarantie);
		      parameterMap.put("nomgerant",nomgerant.toUpperCase());
		      parameterMap.put("definitive",definitive);
		      parameterMap.put("cmttotale",cmttotale);
		      parameterMap.put("soumissionencours",soumissionencours);
		      parameterMap.put("avancedemarrageencours",avancedemarrageencours);
		      parameterMap.put("bonneexecutionencours",bonneexecutionencours);
		      parameterMap.put("retenuegarantieencours",retenuegarantieencours);
		      parameterMap.put("definitiveencours",definitiveencours);
		      parameterMap.put("cmttotaleencours",cmttotaleencours);
		      parameterMap.put("policenumero",policenumero);
		      parameterMap.put("denomminationsociale",denomminationsociale);
		      parameterMap.put("objetavenant",objetavenant);
		      parameterMap.put("datesoucription",datesoucription);
		      parameterMap.put("beneficiaire",beneficiaire);
		      
		      List<?> DemPers = demPersRepository.findByDemPersnum(id);
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(DemPers);

		      JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

		      //Export to PDF     
		      // JasperExportManager.exportReportToPdfFile(jasperPrint, "/home/test/fileName.pdf");
		 
		      //Export to Word
		      JRDocxExporter exporter = new JRDocxExporter();    
		      exporter.setExporterInput(new SimpleExporterInput(jasperPrint)); 
		      //File exportReportFile = new File("fileName" + ".docx");   
		      exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
		      //exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(exportReportFile));  
		      response.setHeader("Content-Disposition", "attachment;filename=jasperfile.docx");
		        response.setContentType("application/octet-stream");
		        exporter.exportReport();
		      
		      //exporter.exportReport();
		 
		    } catch (Exception e) {}
		  }
		
		public void wordsociete1(HttpServletResponse response,Long id,String demandeur,String raisonsociale,
				String anneerelation,String soumission,String avancedemarrage,
				String bonneexcution,String retenuegarantie,String nomgerant,String definitive,String cmttotale,
				String soumissionencours,String avancedemarrageencours, String bonneexecutionencours,
				String retenuegarantieencours, String definitiveencours,String cmttotaleencours,String policenumero,
				String denomminationsociale,String objetavenant,String datesoucription, String beneficiaire,
				String montantavenant,String produitpourcent, String presentationgenerale,String presentationtechnique,
				String[] reference,String interetdossier,String conclusion,String primenette,String primettc,String mainlevee,
				String taxeassurance,String fed,String date,String c1,String c2,String c3,String c4,
				String ml1,String ml2,String ml3,String ml4,String ml5,String montantavenent2,String montantavenent3,
				String produitpourcent2,String produitpourcent3,String avisaarbitrage,String aviscommerciale) {
		
		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_INSTRUCTION_PDF + ParamConst.EXTENSION_REPORT);
		
		JasperDesign design;

		try {
			
			design = JRXmlLoader.load(jasperStream);
			JasperReport report = JasperCompileManager.compileReport(design);
		     // String pathToReports = "/home/test/";
		      //Map<String, Object> params = new HashMap<>();
		      //JRDataSource jsonDataSource = new JsonDataSource(new File("/home/test/example.json"));
		      //asperReport jasperReport = JasperCompileManager.compileReport(pathToReports + "main.jrxml");
		 
		      //JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, params, jsonDataSource);
		      //JasperReport report = JasperCompileManager.compileReport(design);
			  var ref1 = new ArrayList<>();
			  int i=0;
			  while(i<reference.length) {
				  ref1.add(new ReferenceTech(reference[i], reference[i+1],reference[i+2],reference[i+3]));
				  i=i+4;
			  }
		      
		      Map<String, Object> parameterMap = new HashMap<String, Object>();
		      parameterMap.put("demandeur", demandeur);
		      parameterMap.put("raisonsociale", raisonsociale);
		      parameterMap.put("anneerelation", anneerelation);
		      parameterMap.put("soumission", soumission);
		      parameterMap.put("avancedemarrage",avancedemarrage);
		      parameterMap.put("bonneexcution",bonneexcution);
		      parameterMap.put("retenuegarantie",retenuegarantie);
		      parameterMap.put("nomgerant",nomgerant.toUpperCase());
		      parameterMap.put("definitive",definitive);
		      parameterMap.put("cmttotale",cmttotale);
		      parameterMap.put("soumissionencours",soumissionencours);
		      parameterMap.put("avancedemarrageencours",avancedemarrageencours);
		      parameterMap.put("bonneexecutionencours",bonneexecutionencours);
		      parameterMap.put("retenuegarantieencours",retenuegarantieencours);
		      parameterMap.put("definitiveencours",definitiveencours);
		      parameterMap.put("cmttotaleencours",cmttotaleencours);
		      parameterMap.put("policenumero",policenumero);
		      parameterMap.put("denomminationsociale",denomminationsociale);
		      parameterMap.put("objetavenant",objetavenant);
		      parameterMap.put("datesoucription",datesoucription);
		      parameterMap.put("beneficiaire",beneficiaire);
		      parameterMap.put("montantavenant", montantavenant);
		      parameterMap.put("produitpourcent",produitpourcent);
		      parameterMap.put("presentationgenerale",presentationgenerale);
		      parameterMap.put("presentationtechnique",presentationtechnique);
		      
		      
		     JRBeanCollectionDataSource ref = new JRBeanCollectionDataSource(ref1);
		      parameterMap.put("reference",ref);
		      parameterMap.put("interetdossier", interetdossier);
		      parameterMap.put("conclusion", conclusion);
		      parameterMap.put("primenette", primenette);
		      parameterMap.put("primettc", primettc);
		      parameterMap.put("mainlevee", mainlevee);
		      parameterMap.put("taxeassurance", taxeassurance);
		      parameterMap.put("fed", fed);
		      parameterMap.put("date", date);
		      parameterMap.put("c1", c1);
		      parameterMap.put("c2", c2);
		      parameterMap.put("c3", c3);
		      parameterMap.put("c4", c4);
		      
		      parameterMap.put("ml1", ml1);
		      parameterMap.put("ml2", ml2);
		      parameterMap.put("ml3", ml3);
		      parameterMap.put("ml4", ml4);
		      parameterMap.put("ml5", ml5);
		      
		      parameterMap.put("montantavenent2", montantavenent2);
		      parameterMap.put("montantavenent3", montantavenent3);
		      parameterMap.put("produitpourcent2", produitpourcent2);
		      parameterMap.put("produitpourcent3", produitpourcent3);
		      
		      parameterMap.put("avisaarbitrage", avisaarbitrage);
		      parameterMap.put("aviscommerciale", aviscommerciale);
		  
		      List<?> DemPers = demPersRepository.findByDemPersnum(id);
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(DemPers);

		      JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

		      //Export to PDF     
		      // JasperExportManager.exportReportToPdfFile(jasperPrint, "/home/test/fileName.pdf");
		 
		      //Export to Word
		      JRDocxExporter exporter = new JRDocxExporter();    
		      exporter.setExporterInput(new SimpleExporterInput(jasperPrint)); 
		      //File exportReportFile = new File("fileName" + ".docx");   
		      exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
		      //exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(exportReportFile));  
		      response.setHeader("Content-Disposition", "attachment;filename=jasperfile.docx");
		        response.setContentType("application/octet-stream");
		        exporter.exportReport();
		      
		      //exporter.exportReport();
		 
		    } catch (Exception e) {}
		  }
		public void wordsocieteCredit(HttpServletResponse response,Long id) {
		
		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_INSTRUCTION_CR_WORD + ParamConst.EXTENSION_REPORT);
		
		JasperDesign design;

		try {
			
			design = JRXmlLoader.load(jasperStream);
			JasperReport report = JasperCompileManager.compileReport(design);
		     // String pathToReports = "/home/test/";
		      //Map<String, Object> params = new HashMap<>();
		      //JRDataSource jsonDataSource = new JsonDataSource(new File("/home/test/example.json"));
		      //asperReport jasperReport = JasperCompileManager.compileReport(pathToReports + "main.jrxml");
		 
		      //JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, params, jsonDataSource);
		      //JasperReport report = JasperCompileManager.compileReport(design);
			  
		      
		      Map<String, Object> parameterMap = new HashMap<String, Object>();
		      		      List<?> DemPers = demPersRepository.findByDemPersnum(id);
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(DemPers);

		      JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

		      //Export to PDF     
		      // JasperExportManager.exportReportToPdfFile(jasperPrint, "/home/test/fileName.pdf");
		 
		      //Export to Word
		      JRDocxExporter exporter = new JRDocxExporter();    
		      exporter.setExporterInput(new SimpleExporterInput(jasperPrint)); 
		      //File exportReportFile = new File("fileName" + ".docx");   
		      exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
		      //exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(exportReportFile));  
		      response.setHeader("Content-Disposition", "attachment;filename=jasperfile.docx");
		        response.setContentType("application/octet-stream");
		        exporter.exportReport();
		      
		      //exporter.exportReport();
		 
		    } catch (Exception e) {}
		  }
		public void wordsocieteCredit(HttpServletResponse response,Long id,String demandeur,String raisonsociale,
				String anneerelation,String soumission,String avancedemarrage,
				String bonneexcution,String retenuegarantie,String nomgerant,String definitive,String cmttotale,
				String soumissionencours,String avancedemarrageencours, String bonneexecutionencours,
				String retenuegarantieencours, String definitiveencours,String cmttotaleencours,String policenumero,
				String denomminationsociale,String objetavenant,String datesoucription, String beneficiaire,
				String montantavenant,String produitpourcent, String presentationgenerale,String presentationtechnique,
				String[] reference,String interetdossier,String conclusion,String primenette,String primettc,String mainlevee,
				String taxeassurance,String fed,String date,String c1,String c2,String c3,String c4,
				String ml1,String ml2,String ml3,String ml4,String ml5,String montantavenent2,String montantavenent3,
				String produitpourcent2,String produitpourcent3,String avisaarbitrage,String aviscommerciale) {
		
		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_INSTRUCTION_CR_WORD + ParamConst.EXTENSION_REPORT);
		
		JasperDesign design;

		try {
			
			design = JRXmlLoader.load(jasperStream);
			JasperReport report = JasperCompileManager.compileReport(design);
		     // String pathToReports = "/home/test/";
		      //Map<String, Object> params = new HashMap<>();
		      //JRDataSource jsonDataSource = new JsonDataSource(new File("/home/test/example.json"));
		      //asperReport jasperReport = JasperCompileManager.compileReport(pathToReports + "main.jrxml");
		 
		      //JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, params, jsonDataSource);
		      //JasperReport report = JasperCompileManager.compileReport(design);
			  var ref1 = new ArrayList<>();
			  int i=0;
			  while(i<reference.length) {
				  ref1.add(new ReferenceTech(reference[i], reference[i+1],reference[i+2],reference[i+3]));
				  i=i+4;
			  }
		      
		      Map<String, Object> parameterMap = new HashMap<String, Object>();
		      parameterMap.put("demandeur", demandeur);
		      parameterMap.put("raisonsociale", raisonsociale);
		      parameterMap.put("anneerelation", anneerelation);
		      parameterMap.put("soumission", soumission);
		      parameterMap.put("avancedemarrage",avancedemarrage);
		      parameterMap.put("bonneexcution",bonneexcution);
		      parameterMap.put("retenuegarantie",retenuegarantie);
		      parameterMap.put("nomgerant",nomgerant.toUpperCase());
		      parameterMap.put("definitive",definitive);
		      parameterMap.put("cmttotale",cmttotale);
		      parameterMap.put("soumissionencours",soumissionencours);
		      parameterMap.put("avancedemarrageencours",avancedemarrageencours);
		      parameterMap.put("bonneexecutionencours",bonneexecutionencours);
		      parameterMap.put("retenuegarantieencours",retenuegarantieencours);
		      parameterMap.put("definitiveencours",definitiveencours);
		      parameterMap.put("cmttotaleencours",cmttotaleencours);
		      parameterMap.put("policenumero",policenumero);
		      parameterMap.put("denomminationsociale",denomminationsociale);
		      parameterMap.put("objetavenant",objetavenant);
		      parameterMap.put("datesoucription",datesoucription);
		      parameterMap.put("beneficiaire",beneficiaire);
		      parameterMap.put("montantavenant", montantavenant);
		      parameterMap.put("produitpourcent",produitpourcent);
		      parameterMap.put("presentationgenerale",presentationgenerale);
		      parameterMap.put("presentationtechnique",presentationtechnique);
		      
		      
		     JRBeanCollectionDataSource ref = new JRBeanCollectionDataSource(ref1);
		      parameterMap.put("reference",ref);
		      parameterMap.put("interetdossier", interetdossier);
		      parameterMap.put("conclusion", conclusion);
		      parameterMap.put("primenette", primenette);
		      parameterMap.put("primettc", primettc);
		      parameterMap.put("mainlevee", mainlevee);
		      parameterMap.put("taxeassurance", taxeassurance);
		      parameterMap.put("fed", fed);
		      parameterMap.put("date", date);
		      parameterMap.put("c1", c1);
		      parameterMap.put("c2", c2);
		      parameterMap.put("c3", c3);
		      parameterMap.put("c4", c4);
		      
		      parameterMap.put("ml1", ml1);
		      parameterMap.put("ml2", ml2);
		      parameterMap.put("ml3", ml3);
		      parameterMap.put("ml4", ml4);
		      parameterMap.put("ml5", ml5);
		      
		      parameterMap.put("montantavenent2", montantavenent2);
		      parameterMap.put("montantavenent3", montantavenent3);
		      parameterMap.put("produitpourcent2", produitpourcent2);
		      parameterMap.put("produitpourcent3", produitpourcent3);
		      
		      parameterMap.put("avisaarbitrage", avisaarbitrage);
		      parameterMap.put("aviscommerciale", aviscommerciale);
		  
		      List<?> DemPers = demPersRepository.findByDemPersnum(id);
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(DemPers);

		      JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

		      //Export to PDF     
		      // JasperExportManager.exportReportToPdfFile(jasperPrint, "/home/test/fileName.pdf");
		 
		      //Export to Word
		      JRDocxExporter exporter = new JRDocxExporter();    
		      exporter.setExporterInput(new SimpleExporterInput(jasperPrint)); 
		      //File exportReportFile = new File("fileName" + ".docx");   
		      exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
		      //exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(exportReportFile));  
		      response.setHeader("Content-Disposition", "attachment;filename=jasperfile.docx");
		        response.setContentType("application/octet-stream");
		        exporter.exportReport();
		      
		      //exporter.exportReport();
		 
		    } catch (Exception e) {}
		  }
		public void wordsocietePerte(HttpServletResponse response,Long id,String demandeur,String raisonsociale,
				String anneerelation,String soumission,String avancedemarrage,
				String bonneexcution,String retenuegarantie,String nomgerant,String definitive,String cmttotale,
				String soumissionencours,String avancedemarrageencours, String bonneexecutionencours,
				String retenuegarantieencours, String definitiveencours,String cmttotaleencours,String policenumero,
				String denomminationsociale,String objetavenant,String datesoucription, String beneficiaire,
				String montantavenant,String produitpourcent, String presentationgenerale,String presentationtechnique,
				String[] reference,String interetdossier,String conclusion,String primenette,String primettc,String mainlevee,
				String taxeassurance,String fed,String date,String c1,String c2,String c3,String c4,
				String ml1,String ml2,String ml3,String ml4,String ml5,String montantavenent2,String montantavenent3,
				String produitpourcent2,String produitpourcent3,String avisaarbitrage,String aviscommerciale) {
		
		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_INSTRUCTION_PR_WORD + ParamConst.EXTENSION_REPORT);
		
		JasperDesign design;

		try {
			
			design = JRXmlLoader.load(jasperStream);
			JasperReport report = JasperCompileManager.compileReport(design);
		     // String pathToReports = "/home/test/";
		      //Map<String, Object> params = new HashMap<>();
		      //JRDataSource jsonDataSource = new JsonDataSource(new File("/home/test/example.json"));
		      //asperReport jasperReport = JasperCompileManager.compileReport(pathToReports + "main.jrxml");
		 
		      //JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, params, jsonDataSource);
		      //JasperReport report = JasperCompileManager.compileReport(design);
			  var ref1 = new ArrayList<>();
			  int i=0;
			  while(i<reference.length) {
				  ref1.add(new Locataires(reference[i], reference[i+1]));
				  i=i+2;
			  }
		      
		      Map<String, Object> parameterMap = new HashMap<String, Object>();
		      parameterMap.put("demandeur", demandeur);
		      parameterMap.put("raisonsociale", raisonsociale);
		      parameterMap.put("anneerelation", anneerelation);
		      parameterMap.put("soumission", soumission);
		      parameterMap.put("avancedemarrage",avancedemarrage);
		      parameterMap.put("bonneexcution",bonneexcution);
		      parameterMap.put("retenuegarantie",retenuegarantie);
		      parameterMap.put("nomgerant",nomgerant.toUpperCase());
		      parameterMap.put("definitive",definitive);
		      parameterMap.put("cmttotale",cmttotale);
		      parameterMap.put("soumissionencours",soumissionencours);
		      parameterMap.put("avancedemarrageencours",avancedemarrageencours);
		      parameterMap.put("bonneexecutionencours",bonneexecutionencours);
		      parameterMap.put("retenuegarantieencours",retenuegarantieencours);
		      parameterMap.put("definitiveencours",definitiveencours);
		      parameterMap.put("cmttotaleencours",cmttotaleencours);
		      parameterMap.put("policenumero",policenumero);
		      parameterMap.put("denomminationsociale",denomminationsociale);
		      parameterMap.put("objetavenant",objetavenant);
		      parameterMap.put("datesoucription",datesoucription);
		      parameterMap.put("beneficiaire",beneficiaire);
		      parameterMap.put("montantavenant", montantavenant);
		      parameterMap.put("produitpourcent",produitpourcent);
		      parameterMap.put("presentationgenerale",presentationgenerale);
		      parameterMap.put("presentationtechnique",presentationtechnique);
		      
		      
		     JRBeanCollectionDataSource ref = new JRBeanCollectionDataSource(ref1);
		      parameterMap.put("reference",ref);
		      parameterMap.put("interetdossier", interetdossier);
		      parameterMap.put("conclusion", conclusion);
		      parameterMap.put("primenette", primenette);
		      parameterMap.put("primettc", primettc);
		      parameterMap.put("mainlevee", mainlevee);
		      parameterMap.put("taxeassurance", taxeassurance);
		      parameterMap.put("fed", fed);
		      parameterMap.put("date", date);
		      parameterMap.put("c1", c1);
		      parameterMap.put("c2", c2);
		      parameterMap.put("c3", c3);
		      parameterMap.put("c4", c4);
		      
		      parameterMap.put("ml1", ml1);
		      parameterMap.put("ml2", ml2);
		      parameterMap.put("ml3", ml3);
		      parameterMap.put("ml4", ml4);
		      parameterMap.put("ml5", ml5);
		      
		      parameterMap.put("montantavenent2", montantavenent2);
		      parameterMap.put("montantavenent3", montantavenent3);
		      parameterMap.put("produitpourcent2", produitpourcent2);
		      parameterMap.put("produitpourcent3", produitpourcent3);
		      
		      parameterMap.put("avisaarbitrage", avisaarbitrage);
		      parameterMap.put("aviscommerciale", aviscommerciale);
		  
		      List<?> DemPers = demPersRepository.findByDemPersnum(id);
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(DemPers);

		      JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

		      //Export to PDF     
		      // JasperExportManager.exportReportToPdfFile(jasperPrint, "/home/test/fileName.pdf");
		 
		      //Export to Word
		      JRDocxExporter exporter = new JRDocxExporter();    
		      exporter.setExporterInput(new SimpleExporterInput(jasperPrint)); 
		      //File exportReportFile = new File("fileName" + ".docx");   
		      exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
		      //exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(exportReportFile));  
		      response.setHeader("Content-Disposition", "attachment;filename=jasperfile.docx");
		        response.setContentType("application/octet-stream");
		        exporter.exportReport();
		      
		      //exporter.exportReport();
		 
		    } catch (Exception e) {}
		  }
		@SuppressWarnings("static-access")
		public void wordActeAd(HttpServletResponse response,Long id,String titre,String dao,String beneficiaire,String date,String client,
				String adresse_client,String numero_marche,String date_info,String description_travaux,String montant_demande,String montant_lettre,
				String numero_compte,String banque,String numero_agrement,String date_expiration) {
		
		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_ACTE_AD_WORD + ParamConst.EXTENSION_REPORT);
		
		JasperDesign design;
		

		try {
			
			design = JRXmlLoader.load(jasperStream);
			JasperReport report = JasperCompileManager.compileReport(design);
		     
		      Map<String, Object> parameterMap = new HashMap<String, Object>();
		      parameterMap.put("titre", titre);
		      parameterMap.put("dao", dao);
		      parameterMap.put("beneficiaire", beneficiaire);
		      parameterMap.put("date", date);
		      parameterMap.put("client", client);
		      parameterMap.put("adresse_client", adresse_client);
		      parameterMap.put("numero_marche", numero_marche);
		      parameterMap.put("date_info", date_info);
		      parameterMap.put("description_travaux", description_travaux);
		      parameterMap.put("montant_demande", montant_demande);
		      lettre=Long.parseLong(montant_lettre);
		      parameterMap.put("montant_lettre", frenchNumberToWords.convert(lettre));
		      parameterMap.put("numero_compte", numero_compte);
		      parameterMap.put("banque", banque);
		      parameterMap.put("numero_agrement", numero_agrement);
		      parameterMap.put("date_expiration", date_expiration);
		      
		      
		      List<?> DemPers = demPersRepository.findByDemPersnum(id);
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(DemPers);

		      JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

		      
		      //Export to Word
		      JRDocxExporter exporter = new JRDocxExporter();    
		      exporter.setExporterInput(new SimpleExporterInput(jasperPrint)); 
		      exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
		      response.setHeader("Content-Disposition", "attachment;filename=jasperfile.docx");
		      response.setContentType("application/octet-stream");
		      exporter.exportReport();
		      
		      
		 
		    } catch (Exception e) {}
		  }
		@SuppressWarnings("static-access")
		public void wordActeSoumission(HttpServletResponse response,Long id,String titre,String dao,String beneficiaire,String date,String client,
				String adresse_client,String numero_marche,String date_info,String description_travaux,String montant_demande,String montant_lettre,
				String numero_compte,String banque,String numero_agrement,String date_expiration,String lots) {
		
		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_ACTE_SOUMIS_WORD + ParamConst.EXTENSION_REPORT);
		
		JasperDesign design;
		

		try {
			
			design = JRXmlLoader.load(jasperStream);
			JasperReport report = JasperCompileManager.compileReport(design);
		     
		      Map<String, Object> parameterMap = new HashMap<String, Object>();
		      parameterMap.put("titre", titre);
		      parameterMap.put("dao", dao);
		      parameterMap.put("beneficiaire", beneficiaire);
		      parameterMap.put("date", date);
		      parameterMap.put("client", client);
		      parameterMap.put("adresse_client", adresse_client);
		      parameterMap.put("numero_marche", numero_marche);
		      parameterMap.put("date_info", date_info);
		      parameterMap.put("description_travaux", description_travaux);
		      parameterMap.put("montant_demande", montant_demande);
		      lettre=Long.parseLong(montant_lettre);
		      parameterMap.put("montant_lettre", frenchNumberToWords.convert(lettre));
		      parameterMap.put("numero_compte", numero_compte);
		      parameterMap.put("banque", banque);
		      parameterMap.put("numero_agrement", numero_agrement);
		      parameterMap.put("date_expiration", date_expiration);
		      parameterMap.put("lots", lots);
		      
		      List<?> DemPers = demPersRepository.findByDemPersnum(id);
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(DemPers);

		      JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

		      
		      //Export to Word
		      JRDocxExporter exporter = new JRDocxExporter();    
		      exporter.setExporterInput(new SimpleExporterInput(jasperPrint)); 
		      exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
		      response.setHeader("Content-Disposition", "attachment;filename=jasperfile.docx");
		      response.setContentType("application/octet-stream");
		      exporter.exportReport();
		      
		      
		 
		    } catch (Exception e) {}
		  }
		@SuppressWarnings("static-access")
		public void wordActeDefinitive(HttpServletResponse response,Long id,String titre,String dao,String beneficiaire,String date,String client,
				String adresse_client,String numero_marche,String date_info,String description_travaux,String montant_demande,String montant_lettre,
				String numero_compte,String banque,String numero_agrement,String date_expiration) {
		
		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_ACTE_DEFINI_WORD + ParamConst.EXTENSION_REPORT);
		
		JasperDesign design;
		

		try {
			
			design = JRXmlLoader.load(jasperStream);
			JasperReport report = JasperCompileManager.compileReport(design);
		     
		      Map<String, Object> parameterMap = new HashMap<String, Object>();
		      parameterMap.put("titre", titre);
		      parameterMap.put("dao", dao);
		      parameterMap.put("beneficiaire", beneficiaire);
		      parameterMap.put("date", date);
		      parameterMap.put("client", client);
		      parameterMap.put("adresse_client", adresse_client);
		      parameterMap.put("numero_marche", numero_marche);
		      parameterMap.put("date_info", date_info);
		      parameterMap.put("description_travaux", description_travaux);
		      parameterMap.put("montant_demande", montant_demande);
		      lettre=Long.parseLong(montant_lettre);
		      parameterMap.put("montant_lettre", frenchNumberToWords.convert(lettre));
		      parameterMap.put("numero_compte", numero_compte);
		      parameterMap.put("banque", banque);
		      parameterMap.put("numero_agrement", numero_agrement);
		      parameterMap.put("date_expiration", date_expiration);
		      
		      
		      List<?> DemPers = demPersRepository.findByDemPersnum(id);
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(DemPers);

		      JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

		      
		      //Export to Word
		      JRDocxExporter exporter = new JRDocxExporter();    
		      exporter.setExporterInput(new SimpleExporterInput(jasperPrint)); 
		      exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
		      response.setHeader("Content-Disposition", "attachment;filename=jasperfile.docx");
		      response.setContentType("application/octet-stream");
		      exporter.exportReport();
		      
		      
		 
		    } catch (Exception e) {}
		  }
		@SuppressWarnings("static-access")
		public void wordActeBonneExecution(HttpServletResponse response,Long id,String titre,String dao,String beneficiaire,String date,String client,
				String adresse_client,String numero_marche,String date_info,String description_travaux,String montant_demande,String montant_lettre,
				String numero_compte,String banque,String numero_agrement,String date_expiration,String lots,String date_fin_garantie) {
		
		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_ACTE_BNEXEC_WORD + ParamConst.EXTENSION_REPORT);
		
		JasperDesign design;
		

		try {
			
			design = JRXmlLoader.load(jasperStream);
			JasperReport report = JasperCompileManager.compileReport(design);
		     
		      Map<String, Object> parameterMap = new HashMap<String, Object>();
		      parameterMap.put("titre", titre);
		      parameterMap.put("dao", dao);
		      parameterMap.put("beneficiaire", beneficiaire);
		      parameterMap.put("date", date);
		      parameterMap.put("client", client);
		      parameterMap.put("adresse_client", adresse_client);
		      parameterMap.put("numero_marche", numero_marche);
		      parameterMap.put("date_info", date_info);
		      parameterMap.put("description_travaux", description_travaux);
		      parameterMap.put("montant_demande", montant_demande);
		      lettre=Long.parseLong(montant_lettre);
		      parameterMap.put("montant_lettre", frenchNumberToWords.convert(lettre));
		      parameterMap.put("numero_compte", numero_compte);
		      parameterMap.put("banque", banque);
		      parameterMap.put("numero_agrement", numero_agrement);
		      parameterMap.put("date_expiration", date_expiration);
		      parameterMap.put("lots", lots);
		      parameterMap.put("date_fin_garantie", date_fin_garantie);
		      
		      
		      
		      List<?> DemPers = demPersRepository.findByDemPersnum(id);
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(DemPers);

		      JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

		      
		      //Export to Word
		      JRDocxExporter exporter = new JRDocxExporter();    
		      exporter.setExporterInput(new SimpleExporterInput(jasperPrint)); 
		      exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
		      response.setHeader("Content-Disposition", "attachment;filename=jasperfile.docx");
		      response.setContentType("application/octet-stream");
		      exporter.exportReport();
		      
		      
		 
		    } catch (Exception e) {}
		  }
		@SuppressWarnings("static-access")
		public void wordActeRetenueGarantie(HttpServletResponse response,Long id,String titre,String dao,String beneficiaire,String date,String client,
				String adresse_client,String numero_marche,String date_info,String description_travaux,String montant_demande,String montant_lettre,
				String numero_compte,String banque,String numero_agrement,String date_expiration) {
		
		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_ACTE_RETENUEG_WORD + ParamConst.EXTENSION_REPORT);
		
		JasperDesign design;
		

		try {
			
			design = JRXmlLoader.load(jasperStream);
			JasperReport report = JasperCompileManager.compileReport(design);
		     
		      Map<String, Object> parameterMap = new HashMap<String, Object>();
		      parameterMap.put("titre", titre);
		      parameterMap.put("dao", dao);
		      parameterMap.put("beneficiaire", beneficiaire);
		      parameterMap.put("date", date);
		      parameterMap.put("client", client);
		      parameterMap.put("adresse_client", adresse_client);
		      parameterMap.put("numero_marche", numero_marche);
		      parameterMap.put("date_info", date_info);
		      parameterMap.put("description_travaux", description_travaux);
		      parameterMap.put("montant_demande", montant_demande);
		      lettre=Long.parseLong(montant_lettre);
		      parameterMap.put("montant_lettre", frenchNumberToWords.convert(lettre));
		      parameterMap.put("numero_compte", numero_compte);
		      parameterMap.put("banque", banque);
		      parameterMap.put("numero_agrement", numero_agrement);
		      parameterMap.put("date_expiration", date_expiration);
		      
		      
		      List<?> DemPers = demPersRepository.findByDemPersnum(id);
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(DemPers);

		      JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

		      
		      //Export to Word
		      JRDocxExporter exporter = new JRDocxExporter();    
		      exporter.setExporterInput(new SimpleExporterInput(jasperPrint)); 
		      exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
		      response.setHeader("Content-Disposition", "attachment;filename=jasperfile.docx");
		      response.setContentType("application/octet-stream");
		      exporter.exportReport();
		      
		      
		 
		    } catch (Exception e) {}
		  }
		
		public void wordActeCredit(HttpServletResponse response,Long id,String titre,String client,String adresse_client,String police,String dossier,String acheteur,String date,String objet,
				String montant_demande,String duree_credit,String primettc,String taux_prime,String delai_carence,String sanction,String numero_conditionsg,String montant_encours) {
		
		InputStream jasperStream = this.getClass().getResourceAsStream(
				ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_ACTE_CREDIT_WORD + ParamConst.EXTENSION_REPORT);
		
		JasperDesign design;
		

		try {
			
			design = JRXmlLoader.load(jasperStream);
			JasperReport report = JasperCompileManager.compileReport(design);
		     
		      Map<String, Object> parameterMap = new HashMap<String, Object>();
		      parameterMap.put("titre", titre);
		      parameterMap.put("client", client);
		      parameterMap.put("adresse_client", adresse_client);
		      parameterMap.put("police", police);
		      parameterMap.put("dossier", dossier);
		      parameterMap.put("acheteur", acheteur);
		      parameterMap.put("date", date);
		      parameterMap.put("objet", objet);
		      parameterMap.put("montant_demande", montant_demande);
		      parameterMap.put("duree_credit",duree_credit);
		      parameterMap.put("primettc", primettc);
		      parameterMap.put("taux_prime", taux_prime);
		      parameterMap.put("delai_carence", delai_carence);
		      parameterMap.put("sanction", sanction);
		      parameterMap.put("numero_conditionsg",numero_conditionsg);
		      parameterMap.put("montant_encours",montant_encours);
		      
		      
		      List<?> DemPers = demPersRepository.findByDemPersnum(id);
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(DemPers);

		      JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

		      
		      //Export to Word
		      JRDocxExporter exporter = new JRDocxExporter();    
		      exporter.setExporterInput(new SimpleExporterInput(jasperPrint)); 
		      exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
		      response.setHeader("Content-Disposition", "attachment;filename=jasperfile.docx");
		      response.setContentType("application/octet-stream");
		      exporter.exportReport();
		      
		      
		 
		    } catch (Exception e) {}
		  }
		public void wordActeLocassur(HttpServletResponse response,Long id,String police,String cp,String client,
				                     String adresse_client,String denomination_locataire,String date_naissance,String lieu_naissance,
				                     String profession,String situation_bien,String duree_bail,String montant_demande,
				                     String montant_mensuel,String periode_loyer,String mode_regelement,String montant_couvert,
				                     String taux_prime,String primettc,String prime_paiement,String prise_effet,String caducite,
				                     String duree_garantie,String surete,String disposition) {
		
		InputStream jasperStream = this.getClass().getResourceAsStream(
		ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_ACTE_LOCASSUR_WORD + ParamConst.EXTENSION_REPORT);
		JasperDesign design;
		try {			
			design = JRXmlLoader.load(jasperStream);
			JasperReport report = JasperCompileManager.compileReport(design);
		     
		      Map<String, Object> parameterMap = new HashMap<String, Object>();
		      parameterMap.put("police", police);
		      parameterMap.put("cp",cp);
		      parameterMap.put("client",client);
		      parameterMap.put("adresse_client", adresse_client.toUpperCase());
		      parameterMap.put("denomination_locataire",denomination_locataire.toUpperCase()); 
		      parameterMap.put("date_naissance", date_naissance);
		      parameterMap.put("lieu_naissance", lieu_naissance);
		      parameterMap.put("profession",profession);
		      parameterMap.put("situation_bien",situation_bien);
		      parameterMap.put("duree_bail",duree_bail);
		      parameterMap.put("montant_demande",montant_demande);
		      parameterMap.put("montant_mensuel",montant_mensuel);
		      parameterMap.put("periode_loyer",periode_loyer);
		      parameterMap.put("mode_regelement",mode_regelement);
		      parameterMap.put("montant_couvert",montant_couvert);
		  	  parameterMap.put("taux_prime",taux_prime);
		  	  parameterMap.put("primettc",primettc);
		  	  parameterMap.put("prime_paiement",prime_paiement);
		  	  parameterMap.put("prise_effet",prise_effet);
		  	  parameterMap.put("caducite",caducite);
		  	  parameterMap.put("duree_garantie",duree_garantie);
		  	  parameterMap.put("surete",surete);
		  	  parameterMap.put("disposition",disposition);
		      
		      
		      
		      List<?> DemPers = demPersRepository.findByDemPersnum(id);
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(DemPers);

		      JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

		      
		      //Export to Word
		      JRDocxExporter exporter = new JRDocxExporter();    
		      exporter.setExporterInput(new SimpleExporterInput(jasperPrint)); 
		      exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
		      response.setHeader("Content-Disposition", "attachment;filename=jasperfile.docx");
		      response.setContentType("application/octet-stream");
		      exporter.exportReport();
		      
		      
		 
		    } catch (Exception e) {}
		  }
		public static  String  lireJson()  {
			JSONParser jsonP = new JSONParser();
			JSONObject jsonO;
			String chemin="";
			try {
				jsonO = (JSONObject) jsonP.parse(new FileReader("src/main/resources/paramsys.json"));
			 chemin = (String) jsonO.get("chemin");
				System.out.println("chemin"+chemin);
			} catch (IOException | ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return chemin;
			

	}

}