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
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "beneficiaire")

public class Beneficiaire implements Serializable{
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long benef_id;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long benef_Num;
	private String benef_typbenef;
	private String benef_nom;
	private String benef_prenoms;
	private String benef_denom;
	private String benef_status;
	private String benef_ccutil;
	private Date benef_datemo;
	public Beneficiaire(Long benef_Num, String benef_typbenef, String benef_nom, String benef_prenoms,
			String benef_denom, String benef_status, String benef_ccutil, Date benef_datemo) {
		super();
		this.benef_Num = benef_Num;
		this.benef_typbenef = benef_typbenef;
		this.benef_nom = benef_nom;
		this.benef_prenoms = benef_prenoms;
		this.benef_denom = benef_denom;
		this.benef_status = benef_status;
		this.benef_ccutil = benef_ccutil;
		this.benef_datemo = benef_datemo;
	}
	
	public Beneficiaire(Beneficiaire_P p) {
		//super();
		//this.benef_Num = p.getBenef_Num();
		this.benef_typbenef = p.getBenef_typbenef();
		this.benef_nom = p.getBenef_nom();
		this.benef_prenoms = p.getBenef_prenoms();
		this.benef_denom = p.getBenef_denom();
		this.benef_status = p.getBenef_status();
		this.benef_ccutil = p.getBenef_ccutil();
		this.benef_datemo = p.getBenef_datemo();
	}
	
}
