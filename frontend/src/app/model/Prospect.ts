export class Prospect{
    
    prospc_numero: number ;
    prospc_nature: String ;
    prospc_titre: number ; // cf table civilité
    prospc_nom: String ;
    prospc_prenom: String ;
    prospc_denomination: String ;
    prospc_sigle: String ;
    prospc_adressenumero: String ;
    prospc_adresserue: String ;
    prospc_adresseville: String ;
    prospc_categosocioprof: number ;    // cf table categorie sociopro
    prospc_telephone1: String ;
    prospc_telephone2: String ;
    prospc_portable: String ;
    prospc_email: String ;
    prospc_website: String ;
    prospc_ninea: String ;
    prospc_typesociete: String ;
    prospc_registrecommerce: String ;
    prospc_classificationmetier: String ;
    prospc_cin: String ;
    prospc_capitalsocial: number ;
    prospc_utilisateur: String ;    // cf table utilisateur
    prospc_datemodification: Date ;
    // Les champs ajouté sur prospect
	prospc_date_relation: Date;
	prospc_datenaissance: Date;
	prospc_chiffreaffaireannuel: number;
	prospc_princdirigeant: String ;
	prospc_facebook: String ;
	prospc_linkdin: String ;
	prospc_passeport: String ;
	prospc_activitecommercante: String ;
    prospc_statut: number ;    
    list_document_valide :number[]
}