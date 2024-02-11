export class Rdv {
    id_rdv: number;
    lieu: String;
    date_deb: Date;
    date_fin: Date;
    comment_agent: String;
    comment_client: String;
    id_agent: String;
    id_client: String;
    color: String;
    titre: string;
    nbre: Number;
    unite: String;
    type: String;
    constructor(id_rdv: number, lieu: String, date_deb: Date, date_fin: Date, comment_agent: String,
    comment_client: String, id_agent: String, id_client: String, color: String, titre: string,
     nbre: Number, unite: String, type: String,
    ) {

        this.id_rdv = id_rdv;
        this.lieu = lieu;
        this.date_deb = date_deb;
        this.date_fin = date_fin;
        this.comment_agent = comment_agent;
        this.comment_client = comment_client;
        this.id_agent = id_agent;
        this.id_client = id_client;
        this.color = color;
        this.titre = titre;
        this.nbre = nbre;
        this.unite = unite;
        this.type = type;
     }

}
