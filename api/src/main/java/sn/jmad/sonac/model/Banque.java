package sn.jmad.sonac.model;

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

@Data
@Entity
@Table(name = "banque")
public class Banque {

	
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long banq_id;

	@Id
	private Long banq_codebanque;

	private String banq_codenormalise;

	private String banq_denomination;

//	@Column(columnDefinition = "varchar(255) default ''")
	private String banq_sigle;
	
	private Date banq_datecreation;

	private String banq_codeutilisateur;

}
