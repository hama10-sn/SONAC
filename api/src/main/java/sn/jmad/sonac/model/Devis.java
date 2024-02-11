package sn.jmad.sonac.model;

import java.io.Serializable;
import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity @Data @AllArgsConstructor @NoArgsConstructor
public class Devis implements Serializable{
	
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long devis_id;
	@Id
	private int devis_numero;
	private Date devis_date;
	private int devis_numeroproposition;
	private int devis_souscripteur;
	private String devis_objet;
	private int devis_montantnet;
	private int devis_accessoirecompagnie;
	private int devis_accessoireapporteur;
	private int devis_montantfrais;
	private int devis_montanttaxe;
	private int devis_montantttc;
	private Long devis_branche;
	private int devis_categorie;
	private int devis_codeutilisateur;
	private Date devis_datemodification;
	private int devis_status;
	private int active;
	
	
	

}
