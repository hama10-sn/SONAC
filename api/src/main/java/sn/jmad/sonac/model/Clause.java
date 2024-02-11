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

@Entity
@Table(name = "clause")
@NoArgsConstructor
@AllArgsConstructor
@Data

public class Clause implements Serializable{

	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long cla_id;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long cla_numeroclause; 
	private Long cla_codemarche;
	private Long cla_type;
	private Long cla_numerolot;
	private String cla_intituleclause;
	//private String clact_texteclause1;
	//private String clact_clact_texteclause2;
	//private Long clact_capitallotmarche;
	//private Long clact_primelotmarche;
	//private Date clact_datecomptabilisation;
}
