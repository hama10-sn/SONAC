package sn.jmad.sonac.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;

import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import sn.jmad.sonac.message.response.PoliceForm;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "acte_P")

public class Acte_P implements Serializable{
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long act_id;
	@Id
	//@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long act_numero;
	private Long act_numeropolice;
	private Long act_typegarantie;
	private String act_typemarche;
	private String act_numeromarchepublic;
	private Long act_codemarche;
	private Date act_datemarche;
	private Long act_idcontractante;
	private Long act_idbeneficiaire;
	private Long act_idcandidat;
	private String act_descriptionmarche;
	private Long act_capitalassure;
	private Long act_capitalsmp;
	private Long act_capitallci;
	private String act_anciennumero;
	private String act_status;
	private Date act_datecomptabilisation;
	public Acte_P(Long act_numero, Long act_numeropolice, Long act_typegarantie, String act_typemarche,
			String act_numeromarchepublic, Long act_codemarche, Date act_datemarche, Long act_idcontractante,
			Long act_idbeneficiaire, Long act_idcandidat, String act_descriptionmarche, Long act_capitalassure,
			Long act_capitalsmp, Long act_capitallci, String act_anciennumero, String act_status,
			Date act_datecomptabilisation) {
		super();
		this.act_numero = act_numero;
		this.act_numeropolice = act_numeropolice;
		this.act_typegarantie = act_typegarantie;
		this.act_typemarche = act_typemarche;
		this.act_numeromarchepublic = act_numeromarchepublic;
		this.act_codemarche = act_codemarche;
		this.act_datemarche = act_datemarche;
		this.act_idcontractante = act_idcontractante;
		this.act_idbeneficiaire = act_idbeneficiaire;
		this.act_idcandidat = act_idcandidat;
		this.act_descriptionmarche = act_descriptionmarche;
		this.act_capitalassure = act_capitalassure;
		this.act_capitalsmp = act_capitalsmp;
		this.act_capitallci = act_capitallci;
		this.act_anciennumero = act_anciennumero;
		this.act_status = act_status;
		this.act_datecomptabilisation = act_datecomptabilisation;
	}
	
	public Acte_P(PoliceForm p) {
		super();
		this.act_numero= p.getAct_numero();
		this.act_numeropolice= p.getAct_numeropolice();
		this.act_typegarantie= p.getAct_typegarantie();
		this.act_typemarche= p.getAct_typemarche();
		this.act_numeromarchepublic= p.getAct_numeromarchepublic();
		this.act_codemarche= p.getAct_codemarche();
		this.act_datemarche= p.getAct_datemarche();
		this.act_idcontractante= p.getAct_idcontractante();
		this.act_idbeneficiaire= p.getAct_idbeneficiaire();
		this.act_idcandidat= p.getAct_idcandidat();
		this.act_descriptionmarche= p.getAct_descriptionmarche();
		this.act_capitalassure= p.getAct_capitalassure();
		this.act_capitalsmp= p.getAct_capitalsmp();
		this.act_capitallci= p.getAct_capitallci();
		this.act_anciennumero= p.getAct_anciennumero();
		this.act_status= p.getAct_status();
		this.act_datecomptabilisation= p.getAct_datecomptabilisation();
	}
	
	
}
