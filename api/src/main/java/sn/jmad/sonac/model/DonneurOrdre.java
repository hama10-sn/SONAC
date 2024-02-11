package sn.jmad.sonac.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "donneurOrdre" )
public class DonneurOrdre implements Serializable{
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long dordr_id;	
	private Long dordr_numeroclient;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long dordr_numerodordr;
	private Long dordr_coderegroupsolvabilite;
	private Long dordr_coderegroupgestion;
	private String dordr_debiteur;
	private String dordr_numeroportable;
	private String dordr_email;
	private Long dordr_nombreaffaireconf;
	private Long dordr_chiffreaffaireannuel;
	private Long dordr_nbaffairecontentieux;
	private Long dordr_mntaffairecontentieux;
	private Long dordr_mntaffaireaboutis;
	private String dordr_classification;
	private String dordr_codeutilisateur;
	private Date dordr_datemodification;

}
