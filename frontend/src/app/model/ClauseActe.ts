export class ClauseActe{
    clact_id: Number;
    clact_numeroclause: Number;
    clact_numeroacte: Number;
    clact_texte1: String;
    clact_texte2: String;
    constructor(
    clact_numeroclause: Number,
    clact_numeroacte: Number,
    clact_texte1: String,
    clact_texte2: String
    ) {
        this.clact_numeroclause = clact_numeroclause;
        this.clact_numeroacte = clact_numeroacte;
        this.clact_texte1 = clact_texte1;
        this.clact_texte2 = clact_texte2;
     }
}