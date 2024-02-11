export class Propos{
    propo_numero: number ;
    propo_date: Date ;
    propo_codeermediaire: number ; 
    propo_codecompagnie: String ;
    propo_numerobranche: number ; // cf table branche
    propo_numerocategorie: number ; // cf table categorie
    propo_numerosouscripteur: number ;
    propo_numeroprospect: number;
	propo_dateeffet1er: Date;
	propo_dateannivcontrat: Date;
	propo_dateeffet: Date;
	propo_dateecheance: Date;
	propo_dureecontrat: number;
	propo_typecontrat: number;
	propo_typegestion: number;
	propo_codefractionnemen: number;
	propo_mtnprimenetref: number;
	propo_mtnprimenettot: number;
	propo_accesoirecompagnie: number;
	propo_accessoireapporteur: number;
	propo_taxe: number;
	propo_commission: number;
	propo_mtnprimebrut: number;
	propo_coefbonus: number;
	propo_coefremisecommerciale: number;
	propo_codeproduit: number;
	propo_datesituationproposition: Date;
	propo_statusproposition: String ;
	propo_exontaxeenr: String ;
	propo_codetaxeenr: number;
	propo_exontva: String ;
	propo_codetva: number;
	propo_exontps: String;
	propo_codetps: number;
	propo_dateexon: Date;
	propo_codeutil: number;
	propo_datemaj: Date;
	propo_datetransformationcontrat: Date;
}