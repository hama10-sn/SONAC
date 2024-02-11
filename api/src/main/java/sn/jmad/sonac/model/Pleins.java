package sn.jmad.sonac.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Data
@Table(name = "pleins")
public class Pleins {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long pleins_id;
	
	private Long pleins_exercice;
	private Long pleins_branche;
	private Long pleins_categorie;
	private Long pleins_produit;
	private Long pleins_capacite;
	private Long pleins_opcover1;
	private Long pleins_opcover2;
	private Date pleins_datecreation;
	private String pleins_codeutilisateur;
}
