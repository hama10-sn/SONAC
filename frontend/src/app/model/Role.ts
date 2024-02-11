export class Role {
    id: Number;
    nom: String;
    autorisation: String;
    date_create: Date;
    date_update: Date;
    constructor(id: Number,
        nom: String,
        autorisation: String,
        date_create: Date,
        date_update: Date,
    ) {
        this.id = id;
        this.nom = nom;
        this.autorisation = autorisation;
        this.date_create = date_create;
        this.date_update = date_update;
     }

}
