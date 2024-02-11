package sn.jmad.sonac.message.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import sn.jmad.sonac.model.Police;
import sn.jmad.sonac.model.Quittance;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ReemettreDate {
	
	 //private Long numerofacture;
	   
	 //private Long numeropolice;
	   
	 //private Long numeroclient;
	   
	 //private Long typeAvenant;
	   
	 //private Date dateeffetcontrat;
	 private Reemettre addForm;
	 
	 private Police myForm;
	 
	 private Quittance quittanceForm;


	   

	   
}
