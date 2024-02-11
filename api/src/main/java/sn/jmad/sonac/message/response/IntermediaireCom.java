package sn.jmad.sonac.message.response;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


public interface IntermediaireCom {
	Long getQuit_numerointermedaire();
	String getInter_denomination();
	Double getSomCommission();
	
	
}
