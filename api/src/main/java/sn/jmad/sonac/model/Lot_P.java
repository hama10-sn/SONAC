package sn.jmad.sonac.model;

import java.io.Serializable;

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
import sn.jmad.sonac.message.response.PoliceForm;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "lot_P")

public class Lot_P implements Serializable {
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long lot_id;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long lot_numero;
	private Long lot_numeroacte;
	private String lot_numeromarche;
	private Long lot_codeinternemarche;
	private String lot_description;
	private Long lot_capitalass;
	private Long lot_capitalsmp;
	private Long lot_capitallci;
	private Long lot_dureetravaux;
	public Lot_P(Long lot_numero, Long lot_numeroacte, String lot_numeromarche, Long lot_codeinternemarche,
			String lot_description, Long lot_capitalass, Long lot_capitalsmp, Long lot_capitallci,
			Long lot_dureetravaux) {
		super();
		this.lot_numero = lot_numero;
		this.lot_numeroacte = lot_numeroacte;
		this.lot_numeromarche = lot_numeromarche;
		this.lot_codeinternemarche = lot_codeinternemarche;
		this.lot_description = lot_description;
		this.lot_capitalass = lot_capitalass;
		this.lot_capitalsmp = lot_capitalsmp;
		this.lot_capitallci = lot_capitallci;
		this.lot_dureetravaux = lot_dureetravaux;
	}
	
	public Lot_P(PoliceForm p) {
		//super();
		this.lot_numero = p.getLot_numero();
		this.lot_numeroacte = p.getLot_numeroacte();
		this.lot_numeromarche = p.getLot_numeromarche();
		this.lot_codeinternemarche = p.getLot_codeinternemarche();
		this.lot_description = p.getLot_description();
		this.lot_capitalass = p.getLot_capitalass();
		this.lot_capitalsmp = p.getLot_capitalsmp();
		this.lot_capitallci = p.getLot_capitallci();
		this.lot_dureetravaux = p.getLot_dureetravaux();
	}
	
}