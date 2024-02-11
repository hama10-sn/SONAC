import { Component, Input, OnInit } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Acheteur } from '../../../../model/Acheteur';
import { CodeAnnulationFact } from '../../../../model/CodeAnnulationFact';
import { User } from '../../../../model/User';
import { AcheteurService } from '../../../../services/acheteur.service';
import { ActeService } from '../../../../services/acte.service';
import { BeneficiaireService } from '../../../../services/beneficiaire.service';
import { BrancheService } from '../../../../services/branche.service';
import { ClauseacteService } from '../../../../services/clauseacte.service';
import { ClientService } from '../../../../services/client.service';
import { CodeAnnulationService } from '../../../../services/codeannulation.service';
import { CommonService } from '../../../../services/common.service';
import { FactureService } from '../../../../services/facture.service';
import { MarcheService } from '../../../../services/marche.service';
import { ProduitService } from '../../../../services/produit.service';
import { QuittanceService } from '../../../../services/quittance.service';
import { RisqueService } from '../../../../services/risque.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'ngx-imprimer-factureautres',
  templateUrl: './imprimer-factureautres.component.html',
  styleUrls: ['./imprimer-factureautres.component.scss']
})
export class ImprimerFactureautresComponent implements OnInit {

  @Input() numero_facture:number = 0; //= 100000007;
  facture: any;
  quittance: any;
  typePoli : number = 0;
  acheteurs: Array<Acheteur> = new Array<Acheteur>();
  login: any;
  user: User;
  lib:any;
  codeAnnulationFact: any;

  constructor(private factureService:FactureService , private produitService: ProduitService,
    private clientService:ClientService , private beneficiaireService:BeneficiaireService,
    private acheteurServiec:AcheteurService ,private commonService:CommonService,
    private marcheService : MarcheService, private acteService: ActeService,
    private userService: UserService, private clauseacteService: ClauseacteService,
    private authService: NbAuthService, private risqueService: RisqueService,
    private quittanceService: QuittanceService,private codeAnnulation : CodeAnnulationService) { }

  ngOnInit(): void {
    this.getlogin();
      this.factureService.getFacture(this.numero_facture)
      .subscribe((data) =>{
        this.facture = data;
        console.log(this.facture.fact_codeannulation);
        if(this.facture.fact_codeannulation==="1"){
          this.lib=="Facture erronée";
        }else if(this.facture.fact_codeannulation==="2"){
          this.lib=="Facture sans objet";
        }else if(this.facture.fact_codeannulation==="3"){
          this.lib=="capital érroné";
        }else if(this.facture.fact_codeannulation==="4"){
          this.lib=="modif Date";
        }else if(this.facture.fact_codeannulation==="5"){
          this.lib=="autres";
        }
        console.log(this.lib);

        this.codeAnnulation.getCodeAnnulation(this.facture.fact_codeannulation)
        .subscribe((datacode) =>{
          this.codeAnnulationFact = datacode;
          
          console.log(this.codeAnnulationFact);
        });

        this.produitService.getProduitByPolice(this.facture.fact_numeropolice)
        .subscribe((datap) =>{
          this.facture.produit = datap;
          
          if(this.facture.produit.poli_codeproduit >= 15001001 && this.facture.produit.poli_codeproduit <= 15001005){
            this.typePoli = 1;
          }else if(this.facture.produit.poli_codeproduit >= 15001006 && this.facture.produit.poli_codeproduit <= 15001009){
            this.typePoli = 2;
          }else{
            this.typePoli = 3;
          }

        });
        this.quittanceService.getQuittanceFact(this.numero_facture)
        .subscribe((dataquit) =>{
          this.quittance = dataquit;
          
          console.log(this.quittance);
        });
        
        this.clientService.getClient(this.facture.fact_numerosouscripteurcontrat)
        .subscribe((datac) =>{
          this.facture.client = datac;
          
        });

        this.beneficiaireService.getBeneficiaire(this.facture.fact_numerobeneficiaire)
        .subscribe((datab) =>{
          this.facture.benef = datab;
          
        });
        this.acheteurServiec.getAcheteur((this.facture.fact_numeoracheteur == null ? 0 : this.facture.fact_numeoracheteur))
        .subscribe((datacheteur) =>{
          this.facture.achet = datacheteur;
          console.log(datacheteur);
        });

        
        this.acheteurServiec.getAllAcheteurByPolice(this.facture.fact_numeropolice)
        .subscribe((data: Acheteur[]) => {
          this.acheteurs = data as Acheteur[];
         console.log( this.acheteurs);
         
        });

        
        this.marcheService.getMarche((this.facture.fact_marche))
        .subscribe((datacheteur) =>{
          this.facture.achet = datacheteur;
          console.log(datacheteur);
          
        });

        this.acteService.getActePolice((this.facture.fact_numeropolice))
        .subscribe((datacte) =>{
          this.facture.acte = datacte;       
        });

        this.clauseacteService.getClauseActeByActe((this.facture.fact_numacte))
        .subscribe((datclause) =>{
          this.facture.clauseacte = datclause;
          
        });

        this.risqueService.getRisquePolice((this.facture.fact_numeropolice))
        .subscribe((datrisq) =>{
          this.facture.risque = datrisq;
          
        });
        
        this.facture.montantText = this.commonService.NumberToLetter(this.facture.fact_montantttc.toString());
        console.log(this.facture);
        
        this.facture.montantEngageText = this.commonService.NumberToLetter(this.facture.fact_capitalassure.toString());
        console.log(this.facture.montantEngageText);
      });
  }
  getlogin(): any {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.login = token.getPayload();
          this.userService.getUser(this.login.sub)
            .subscribe((data: User) => {
              this.user = data;
              console.log(this.user);
            });
        }
      });
  }
}
