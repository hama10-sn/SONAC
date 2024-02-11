package sn.jmad.sonac.model;


import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "instruction" )
public class Instruction {
	@Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)	
	  private Long instruct_num;
	private String instruct_type;
	private Long instruct_demande;
	private String instruct_type_dem;
	//CMT FIN
	@Column(columnDefinition="TEXT")
	private String instruct_objet_avenant;
	private Date instruct_date_souscript;
	@Column(columnDefinition="TEXT")
	private String instruct_beneficiaire;
	//POUR CMT ET CREDIT
	private float instruct_taux;
	private float instruct_taux2;
	private float instruct_taux3;
	@Column(columnDefinition="TEXT")
	private String instruct_present_generale;
	@Column(columnDefinition="TEXT")
	private String instruct_present_technique;
	@Column(columnDefinition="TEXT")
	private String instruct_interetdossier;
	//POUR CMT ET CREDIT
	@Column(columnDefinition="TEXT")
    private String instruct_conclusion;
    //CMT FIN
    
    //POUR CMT ET CREDIT
    private String reference[];
    
    //CREDIT DEBUT
    @Column(columnDefinition="TEXT") 
    private String instruct_description;
    @Column(columnDefinition="TEXT")
    private String instruct_present_societe;
    @Column(columnDefinition="TEXT")
    private String instruct_activites_client;
    @Column(columnDefinition="TEXT")
    private String instruct_risques_activite;
    @Column(columnDefinition="TEXT")
    private String instruct_objet;
    @Column(columnDefinition="TEXT")
    private String instruct_encours_demande;
    private Long instruct_duree_credit;
    @Column(columnDefinition="TEXT")
    private String instruct_condition_paiement;
    @Column(columnDefinition="TEXT")
    private String instruct_type_couverture;
    @Column(columnDefinition="TEXT")
    private String instruct_reconduction_couverture;
    @Column(columnDefinition="TEXT")
    private String instruct_delai_carence;
    @Column(columnDefinition="TEXT")
    private String instruct_delai_idem;
    @Column(columnDefinition="TEXT")
    private String instruct_sanction;
    @Column(columnDefinition="TEXT")
    private String instruct_effet;
    @Column(columnDefinition="TEXT")
    private String instruct_caducite;
    @Column(columnDefinition="TEXT")
    private String instruct_disposition;
    //CREDIT FIN
    
    //PERTES DEBUT 
    @Column(columnDefinition="TEXT")
    private String instruct_analyse; 
    private String locataire[];
    @Column(columnDefinition="TEXT")
    private String instruct_memo; 
    //PERTES FIN
	public Instruction(Long instruct_num, String instruct_type, Long instruct_demande, String instruct_type_dem,
			String instruct_objet_avenant, Date instruct_date_souscript, String instruct_beneficiaire,
			float instruct_taux, float instruct_taux2, float instruct_taux3, String instruct_present_generale,
			String instruct_present_technique, String instruct_interetdossier, String instruct_conclusion,
			String reference[], String instruct_description, String instruct_present_societe,
			String instruct_activites_client, String instruct_risques_activite, String instruct_objet,
			String instruct_encours_demande, Long instruct_duree_credit, String instruct_condition_paiement,
			String instruct_type_couverture, String instruct_reconduction_couverture, String instruct_delai_carence,
			String instruct_delai_idem, String instruct_sanction, String instruct_effet, String instruct_caducite,
			String instruct_disposition, String instruct_analyse, String locataire[],String instruct_memo) {
		super();
		this.instruct_num = instruct_num;
		this.instruct_type = instruct_type;
		this.instruct_demande = instruct_demande;
		this.instruct_type_dem = instruct_type_dem;
		this.instruct_objet_avenant = instruct_objet_avenant;
		this.instruct_date_souscript = instruct_date_souscript;
		this.instruct_beneficiaire = instruct_beneficiaire;
		this.instruct_taux = instruct_taux;
		this.instruct_taux2 = instruct_taux2;
		this.instruct_taux3 = instruct_taux3;
		this.instruct_present_generale = instruct_present_generale;
		this.instruct_present_technique = instruct_present_technique;
		this.instruct_interetdossier = instruct_interetdossier;
		this.instruct_conclusion = instruct_conclusion;
		this.reference = reference;
		this.instruct_description = instruct_description;
		this.instruct_present_societe = instruct_present_societe;
		this.instruct_activites_client = instruct_activites_client;
		this.instruct_risques_activite = instruct_risques_activite;
		this.instruct_objet = instruct_objet;
		this.instruct_encours_demande = instruct_encours_demande;
		this.instruct_duree_credit = instruct_duree_credit;
		this.instruct_condition_paiement = instruct_condition_paiement;
		this.instruct_type_couverture = instruct_type_couverture;
		this.instruct_reconduction_couverture = instruct_reconduction_couverture;
		this.instruct_delai_carence = instruct_delai_carence;
		this.instruct_delai_idem = instruct_delai_idem;
		this.instruct_sanction = instruct_sanction;
		this.instruct_effet = instruct_effet;
		this.instruct_caducite = instruct_caducite;
		this.instruct_disposition = instruct_disposition;
		this.instruct_analyse = instruct_analyse;
		this.locataire = locataire;
		this.instruct_memo =instruct_memo;
	}
    
}
