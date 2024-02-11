																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																		package sn.jmad.sonac.service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Part;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;

import org.springframework.core.io.FileSystemResource;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;


public class Emailer implements  java.io.Serializable{
	

	   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	static Properties properties = new Properties();
	   static
	   {
		  // properties.put("mail.smtp.host", "localhost");
		   properties.put("mail.smtp.host", "smtp.gmail.com");
		   properties.put("mail.smtp.socketFactory.port", "465");
		     properties.put("mail.smtp.socketFactory.class",
		                    "javax.net.ssl.SSLSocketFactory");
		     properties.put("mail.smtp.auth", "true");
		      properties.put("mail.smtp.port", "465");
		      
		     
		  // properties.put("mail.smtp.host", "31.207.38.41");
		 //  properties.put("mail.smtp.host", "localhost");
		   //   properties.put("mail.smtp.socketFactory.port", "465");
		  //    properties.put("mail.smtp.socketFactory.class",
		 //                    "javax.net.ssl.SSLSocketFactory");
		//      properties.put("mail.smtp.auth", "true");
		 //     properties.put("mail.smtp.port", "465");   
		      
	   }
	   public void notification(String dest, String mess, String objet) 
	   {
	     
	      try
	      {
	         Session session = Session.getInstance(properties,  
	            new javax.mail.Authenticator() {
	            protected PasswordAuthentication 
	            getPasswordAuthentication() {
	            return new 
	             PasswordAuthentication("jmadsolutionsrdv@gmail.com", "oyvqtiriqefquzmw");
	           //  PasswordAuthentication("sonacjmadsolutions@testjmadsonac.com", "jmadsolutionsRDVtest1");
	            }});

	         Message message = new MimeMessage(session);
	         message.setFrom(new InternetAddress("jmadsolutionsrdv@gmail.com"));
	        // message.setFrom(new InternetAddress("sonacjmadsolutions@testjmadsonac.com"));
	         message.setRecipients(Message.RecipientType.TO, 
	            InternetAddress.parse(dest));
	         message.setSubject(objet);
	         message.setText(mess);
	         Transport.send(message);
	      }
	      catch(Exception e)
	      {
	        
	         e.printStackTrace();
	      }
	     
	   }
	   public void notification1(String dest,String objet,String body,String infos) 
	   {
	     

		      try
		      {
		         Session session = Session.getInstance(properties,  
		            new javax.mail.Authenticator() {
		            protected PasswordAuthentication 
		            getPasswordAuthentication() {
		            return new 
		             PasswordAuthentication("jmadsolutionsrdv@gmail.com", "oyvqtiriqefquzmw");
		           //  PasswordAuthentication("sonacjmadsolutions@testjmadsonac.com", "jmadsolutionsRDVtest1");
		            }});

		         Message message = new MimeMessage(session);
		         message.setFrom(new InternetAddress("jmadsolutionsrdv@gmail.com"));
		        // message.setFrom(new InternetAddress("sonacjmadsolutions@testjmadsonac.com"));
		         message.setRecipients(Message.RecipientType.TO, 
		            InternetAddress.parse(dest));
		         message.setSubject(objet);
		         String body1 = infos+"\n\n"+body;
		         message.setText(body1);
		         Transport.send(message);
		      }
		      catch(Exception e)
		      {
		        
		         e.printStackTrace();
		      }
	     
	      
	   }
	   
	   public void notification2(String address_email, String objet,String body,String infos_user,List<MultipartFile> attachement) {
		   
		   Session session = Session.getInstance(properties,  
		            new javax.mail.Authenticator() {
		            protected PasswordAuthentication 
		            getPasswordAuthentication() {
		            return new 
		             PasswordAuthentication("commercial@sonac.sn", "Son@c022");
		           //  PasswordAuthentication("sonacjmadsolutions@testjmadsonac.com", "jmadsolutionsRDVtest1");
		            }});
		   try {
			   
	            // Create a default MimeMessage object.
	            Message message = new MimeMessage(session);
	            // Set From: header field of the header.
	            message.setFrom(new InternetAddress("commercial@sonac.sn"));
	            // Set To: header field of the header.
	            message.setRecipients(Message.RecipientType.TO,
	                    InternetAddress.parse(address_email));
	            // Set Subject: header field
	            message.setSubject(objet);
	            // Create the message part
	            BodyPart messageBodyPart = new MimeBodyPart();
	            // Now set the actual message
	            body=infos_user+body;
	            System.out.println(body+"body");
	            messageBodyPart.setText(body);
	            /*//messageBodyPart.setContent(body, "text/html; charset=utf-8");
	            // Create a multipar message
	            Multipart multipart = new MimeMultipart();
	            // Set text message part
	            multipart.addBodyPart(messageBodyPart);
	            // Part two is attachment
	            messageBodyPart = new MimeBodyPart();
	            //String filename = "D:/test.PDF";
	            DataSource source = new FileDataSource(attachement);
	            messageBodyPart.setDataHandler(new DataHandler(source));
	            messageBodyPart.setFileName(attachement);
	            multipart.addBodyPart(messageBodyPart);
	            // Send the complete message parts
	            message.setContent(multipart);*/
	            // Send message
	            Transport.send(message);
	            System.out.println("Email Sent Successfully !!");
	        } catch (MessagingException e) {
	            throw new RuntimeException(e+"meissa");
	        }
	   }
	   public void notification3(String dest,String objet,String body,String infos ,List<MultipartFile> attachement) 
	   {
	     
	      try
	      {
	         Session session = Session.getInstance(properties,  
	            new javax.mail.Authenticator() {
	            protected PasswordAuthentication 
	            getPasswordAuthentication() {
	            return new 
	             PasswordAuthentication("jmadsolutionsrdv@gmail.com", "oyvqtiriqefquzmw");
	           //  PasswordAuthentication("sonacjmadsolutions@testjmadsonac.com", "jmadsolutionsRDVtest1");
	            }});

	         Message message = new MimeMessage(session);
	         message.setFrom(new InternetAddress("jmadsolutionsrdv@gmail.com"));
	        // message.setFrom(new InternetAddress("sonacjmadsolutions@testjmadsonac.com"));
	         message.setRecipients(Message.RecipientType.TO, 
	            InternetAddress.parse(dest));
	         message.setSubject(objet);
	      // Create the message part
	            BodyPart messageBodyPart = new MimeBodyPart();
	            // Now set the actual message
	            ///body=infos_user+body;
	            System.out.println(body+"body");
	            String newLine = System.getProperty("line.separator");
	            String body1 = infos+"\n\n"+body;
	            messageBodyPart.setText(body1);
	            //setContent(body, "text/html; charset=utf-8")
	            Multipart multipart = new MimeMultipart();
	            multipart.addBodyPart(messageBodyPart);
	            message.setContent(multipart);
	            for(MultipartFile file : attachement) {
					
					String filename = StringUtils.cleanPath(file.getOriginalFilename());
					//Path fileStorage = Paths.get(DOSSIER + "client-"+numclient+"/client/",filename).toAbsolutePath().normalize();
					//Files.copy(file.getInputStream(), fileStorage,REPLACE_EXISTING);
					//filesnames.add(filename);
					BodyPart messageBodyPart2 = new MimeBodyPart();
				    //messageBodyPart2.attachFile(file);
					//messageBodyPart2.attachFile(file.get);;
					DataSource ds = new ByteArrayDataSource(file.getBytes(), file.getContentType());
					messageBodyPart2.setDataHandler(new DataHandler(ds));
			        //messageBodyPart2.setFileName(filename);
					messageBodyPart2.setFileName(file.getOriginalFilename());
					messageBodyPart2.setDisposition(Part.ATTACHMENT);
			        multipart.addBodyPart(messageBodyPart2);
			         message.setContent(multipart);
							
				}
	         //message.setText(mess);
	         Transport.send(message);
	      }
	      catch(Exception e)
	      {
	        
	         e.printStackTrace();
	      }
	     
	   }
	   public static Properties getProperties() {
	      return properties;
	   }

	   public static void setProperties(Properties properties) {
	      Emailer.properties = properties;
	   }

}
