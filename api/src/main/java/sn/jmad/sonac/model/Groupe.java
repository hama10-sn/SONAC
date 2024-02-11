package sn.jmad.sonac.model;

import java.io.Serializable;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.TableGenerator;

import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity @Data @AllArgsConstructor @NoArgsConstructor
public class Groupe implements Serializable{
	
	
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private int group_id;
	@Id
	private Long group_code;
	private int group_classif;
	private String group_liblong;
	private String group_libcourt;
	private int group_siege;
	private String group_adress1;
	private String group_adress2;
	private String group_email;
	private String group_web;
	private String group_teleph1;
	private String group_teleph2;
	private int active;
	
	
	
	
	
	
	

}
