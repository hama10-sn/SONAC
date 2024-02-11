package sn.jmad.sonac.model;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Table(name = "rdv")
 @NoArgsConstructor
 @Data
public class Rdv implements Serializable{
	  
	  @Id
	 // @Column(nullable = false)
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long id_rdv;
	  @Column(nullable = false)
	  private Date date_deb;
	  @Column(nullable = false)
	  private Date date_fin; 
	  private String color;
	  private String id_agent;
	  private String id_client;
	  private String comment_client;
	  private String comment_agent;
	  private String titre;
	  private String lieu;
	  private int active;
	  private int nbre ;
	  private String unite;
	  private String type;
	public Rdv(Date date_deb, Date date_fin, String color, String id_agent, String id_client, String comment_client,
			String comment_agent, String titre, String lieu, int active, int nbre, String unite, String type) {
		super();
		this.date_deb = date_deb;
		this.date_fin = date_fin;
		this.color = color;
		this.id_agent = id_agent;
		this.id_client = id_client;
		this.comment_client = comment_client;
		this.comment_agent = comment_agent;
		this.titre = titre;
		this.lieu = lieu;
		this.active = active;
		this.nbre = nbre;
		this.unite = unite;
		this.type = type;
	}
      
	  

	  

}
