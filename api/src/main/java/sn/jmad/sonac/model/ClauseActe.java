package sn.jmad.sonac.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "clauseActe")
public class ClauseActe implements Serializable{
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	private Long clact_id;
	private Long clact_numeroclause;
	private Long clact_numeroacte;
	private String clact_texte1;
	private String clact_texte2;

}
