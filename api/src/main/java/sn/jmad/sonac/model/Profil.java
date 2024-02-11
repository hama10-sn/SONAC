package sn.jmad.sonac.model;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "profil")
@NoArgsConstructor
@Data
public class Profil implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
     
    private String autorisation;
    private Date date_create;
    private Date date_update;
	
    public Profil(String nom, String autorisation, Date date_create, Date date_update) {
		super();
		this.nom = nom;
		this.autorisation = autorisation;
		this.date_create = date_create;
		this.date_update = date_update;
	}
    
    
}