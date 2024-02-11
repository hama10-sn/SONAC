package sn.jmad.sonac.service;

import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import sn.jmad.sonac.model.Alerte;
import sn.jmad.sonac.model.Rdv;
import sn.jmad.sonac.model.Utilisateur;
import sn.jmad.sonac.repository.AlerteRepository;
import sn.jmad.sonac.repository.RdvRepository;
import sn.jmad.sonac.repository.UtilisateurRepository;

@Configuration
@ComponentScan("sn.jmad.sonac.service")
@EnableScheduling
@Component

public class Scheduller {
	
	
	@Autowired
    private RdvRepository rdvRepository;
	
	@Autowired
    private AlerteRepository alerteRepository;
	
    @Autowired
	UtilisateurRepository utilisateurRepository;
	
	//  @Scheduled(cron = "*/60 * * * * *")
	  /*  public void m1(){
	        System.out.println("every 5 sec : "+System.nanoTime());
	       // new Emailer().notification("aboudiagne90@gmail.com", "bonjour abou");
	      
	    }*/

	    @Scheduled(fixedRate = 120000)
	    public void m2(){

	       // System.out.println("every 2 MIN : "+System.nanoTime());
	       // new Emailer().notification("rokhaya.ndoye@jmadsolutions.sn", "bonjour Boug lek","test rdv");

	        List <Rdv> p = rdvRepository.allRdvs(1);
	        Date now = new Date();
	        for(int i =0; i<p.size();i++) {
	        //	System.out.println(" *** "+p.get(i).getType().equalsIgnoreCase("RDV"));
	        	// System.out.println("every test : "+alerteRepository.findByIdRdv(p.get(i).getId_rdv()));
	        	if(alerteRepository.findByIdRdv(p.get(i).getId_rdv())==null || alerteRepository.findByIdRdv(p.get(i).getId_rdv()).isEmpty()) {
	        		// System.out.println("every test : "+p.size());
	        long diff = p.get(i).getDate_deb().getTime() - now.getTime();
	        TimeUnit time ;
	        if(p.get(i).getUnite().equalsIgnoreCase("Minute")) {
	        	 time = TimeUnit.MINUTES;
	        	 //System.out.println("minute");
	        	 }
	        else if(p.get(i).getUnite().equalsIgnoreCase("Heure")) {
	        	
	        	 time = TimeUnit.HOURS;
	        	// System.out.println("heure");
	   	 }
	        else
	         time = TimeUnit.DAYS; 
	        long difference = time.convert(diff, TimeUnit.MILLISECONDS);
	      //  System.out.println(p.get(i).getTitre()+" The differencezeeee in days is : "+difference);
	        if(difference <= p.get(i).getNbre() && 0 <= difference) {
	        System.out.println(p.get(i).getTitre()+" The difference in days is : "+difference);
	       Utilisateur u=  utilisateurRepository.findByNumero(p.get(i).getId_agent());
	       if( u!= null) {
	    	   String mail= u.getUtil_email();
	    	  // System.out.println(" *** "+(utilisateurRepository.findByNumero(p.get(i).getId_agent())).getUtil_email());
	    	   //System.out.println(" *** "+p.get(i).getType());
	    	   if(p.get(i).getType().equalsIgnoreCase("RDV")) {
	    	     new Emailer().notification(mail, "Bonjour "+u.getUtil_prenom()+" "+u.getUtil_nom()+
	    			                       "\n Rappel de votre rendez-vous "+p.get(i).getTitre()+
	    			                       "\n Cordialement.","RAPPEL RDV");
	    	   }
	    	   else
	    		   new Emailer().notification(mail, "Bonjour "+u.getUtil_prenom()+" "+u.getUtil_nom()+
	                       "\n Rappel de votre tâche "+p.get(i).getTitre()+
	                       "\n Cordialement.","RAPPEL TÂCHE");
	    	   alerteRepository.save(new Alerte(p.get(i).getId_rdv(), u.getUtil_numero(), new Date(), "n/a"));
	    	   
	        }
	         }
	        }
	        }
	    }

}