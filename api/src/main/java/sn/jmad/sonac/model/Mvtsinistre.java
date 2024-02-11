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

import lombok.Data;

@Entity
@Data
@Table(name = "Mvtsinistre")

public class Mvtsinistre implements Serializable {

	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long mvts_id;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long mvts_num;

	private Long mvts_poli;

	private Long mvts_numsinistre;

	// private Long mvtr_numrecours;

	private Date mvts_datemvt;

	private Long mvts_typemvt;

	private String mvts_typegestionsinistre;

	private Date mvts_datesaisie;

//	@Column(columnDefinition = "bigint default 0")
	private Long mvts_montantfinancierprincipal;
	
	private Long mvts_montantfinancierfrais;
	
	private Long mvts_montantfinancierhonoraires;
	
	private Long mvts_montantfinancier;

	// A', actif/ 'C' comptabilisé/ 'N' annuler/etc.
	private int mvts_status;

	private Long mvts_montantprincipal;

	private Long mvts_montantfrais;

	private Long mvts_montanthonoraire;

	private Long mvts_montantmvt;

	private Long mvts_beneficiaire;

	private Long mvts_tiers;

	private String mvts_autrebeneficiaire;

	private String mvts_adresseautrebeneficiaire;

	private Long mvts_motifannulation;

	private Date mvts_dateannulation;

	private String mvts_codeutilisateur;

	private Date mvts_datemodification;

	private Date mvts_datecomptabilisation;

//	@Column(columnDefinition = "varchar(255) default 'N'")
	private String mvts_nantissement;

	private String mvts_benefnantissement;

//	@Column(columnDefinition = "bigint default 0")
	private Long mvts_montantnantissement;
}
