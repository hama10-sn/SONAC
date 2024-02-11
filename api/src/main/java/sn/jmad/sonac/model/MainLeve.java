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

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "MainLeve")

public class MainLeve implements Serializable {
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	
	private Long mainl_id;
	private Long mainl_numpoli;
	private Long mainl_numeroavenant;
	private Long mainl_numeroacte;
	private Long mainl_numeroengagement;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long mainl_nummainlevee;
	private Long mainl_mtnmainlevee;
	private Date mainl_datemainlevee;
	private String mainl_ccutil;
	private Date mainl_datesasisie;
	private String mainl_status;
}
