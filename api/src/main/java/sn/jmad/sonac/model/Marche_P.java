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
import sn.jmad.sonac.message.response.PoliceForm;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "marche_P")
public class Marche_P implements Serializable{
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long march_id;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long march_numero;
	private String march_identification;
	private Long march_idcontractante;
	private Long march_donneurordre;
	private String march_descriptionmarche1;
	private String march_descriptionmarche2;
	private Long march_nombrelots;
	private Long march_dureeenmois;
	private Long march_capitalglobalmarche;
	private Long march_capitalglobalsmpmarche;
	private Long march_capitalglobalslcimarche;
	private int march_status;
	private Date march_datemodification;
	private String march_codeutil;
	private Long march_numeroacte;
	private Date march_date_debut;
	
	
	
	public Marche_P(PoliceForm p) {
		//super();
		this.march_numero = p.getMarch_numero();
		this.march_identification = p.getMarch_identification();
		this.march_idcontractante = p.getMarch_idcontractante();
		this.march_donneurordre = p.getMarch_donneurordre();
		this.march_descriptionmarche1 = p.getMarch_descriptionmarche1();
		this.march_descriptionmarche2 = p.getMarch_descriptionmarche2();
		this.march_nombrelots = p.getMarch_nombrelots();
		this.march_dureeenmois = p.getMarch_dureeenmois();
		this.march_capitalglobalmarche = p.getMarch_capitalglobalmarche();
		this.march_capitalglobalsmpmarche = p.getMarch_capitalglobalsmpmarche();
		this.march_capitalglobalslcimarche = p.getMarch_capitalglobalslcimarche();
		this.march_status = p.getMarch_status();
		this.march_datemodification = p.getMarch_datemodification();
		this.march_codeutil = p.getMarch_codeutil();
	}



	public Marche_P(Long march_numero, String march_identification, Long march_idcontractante, Long march_donneurordre,
			String march_descriptionmarche1, String march_descriptionmarche2, Long march_nombrelots,
			Long march_dureeenmois, Long march_capitalglobalmarche, Long march_capitalglobalsmpmarche,
			Long march_capitalglobalslcimarche, int march_status, Date march_datemodification, String march_codeutil,
			Long march_numeroacte, Date march_date_debut) {
		super();
		this.march_numero = march_numero;
		this.march_identification = march_identification;
		this.march_idcontractante = march_idcontractante;
		this.march_donneurordre = march_donneurordre;
		this.march_descriptionmarche1 = march_descriptionmarche1;
		this.march_descriptionmarche2 = march_descriptionmarche2;
		this.march_nombrelots = march_nombrelots;
		this.march_dureeenmois = march_dureeenmois;
		this.march_capitalglobalmarche = march_capitalglobalmarche;
		this.march_capitalglobalsmpmarche = march_capitalglobalsmpmarche;
		this.march_capitalglobalslcimarche = march_capitalglobalslcimarche;
		this.march_status = march_status;
		this.march_datemodification = march_datemodification;
		this.march_codeutil = march_codeutil;
		this.march_numeroacte = march_numeroacte;
		this.march_date_debut = march_date_debut;
	}



	

}
