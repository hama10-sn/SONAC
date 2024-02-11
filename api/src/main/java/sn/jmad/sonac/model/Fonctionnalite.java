package sn.jmad.sonac.model;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fonctionnalite")
@NoArgsConstructor
@Data
public class Fonctionnalite implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String entite;
    private String creer;
    private String modif;
    private String listing;
    private String sup;
	
    public Fonctionnalite(String entite, String creer, String modif, String listing, String sup) {
		super();
		this.entite = entite;
		this.creer = creer;
		this.modif = modif;
		this.listing = listing;
		this.sup = sup;
	}
	

    
    
}