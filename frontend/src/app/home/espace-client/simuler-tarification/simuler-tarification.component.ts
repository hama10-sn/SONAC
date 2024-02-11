import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import tarification from '../../data/tarification.json';

@Component({
  selector: 'ngx-simuler-tarification',
  templateUrl: './simuler-tarification.component.html',
  styleUrls: ['./simuler-tarification.component.scss']
})
export class SimulerTarificationComponent implements OnInit {

  tarifs: any[] = tarification;
  typeAss: any[];
  typeAssSelected: string='';
  produits: any[];
  produitSelected: string='';
  garanties: any[];
  garantieSelected: string='';
  capital: number=0;
  primettc: number;
  displayPrime: boolean = false;
  aDeterminer: string;
  error: boolean = false;
nettoyageP: string ='';
nettoyageG: string ='';
tauxSelected: number = 0;
nettoyage1: string = "";
nettoyage2: string = "";

displayAllError: boolean;

primeht: number;
taxeAss: number;
frais: number;

displayDuree: boolean;
displayType: boolean;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.typeAss = Object.keys(this.tarifs[0]);
    
    
  }

  onChangeTypeAss (event) {
    this.displayPrime = false;
    this.garanties = null;
    this.typeAssSelected = event;
    this.produits = Object.keys(this.tarifs[0][event]);
    this.nettoyageP = " ";
    this.nettoyageG = " ";
    this.nettoyage1 = " ";
    this.nettoyage2 = " ";
    this.produitSelected = '';
    this.garantieSelected = '';
    if(event == "CAUTIONNEMENT"){
      this.displayDuree = false;
      this.displayType = false;
      this.tauxSelected = 0;
    }
    
  }

  onChangeProduit (event) {
    this.displayPrime = false;
    this.tauxSelected = 0;
    this.nettoyage1 = " ";
    this.nettoyage2 = " ";
    this.garantieSelected = '';
    this.produitSelected = event;
    this.garanties = this.tarifs[0][this.typeAssSelected][event];
    console.log(this.garanties);
    this.nettoyageG = " ";
  }

  onChangeGarantie (event) {
    this.displayPrime = false;
    this.tauxSelected = 0;
    this.nettoyage1 = " ";
    this.nettoyage2 = " ";
    this.garantieSelected = event;
if(this.produitSelected == "KAP'GARANTI"){
    if(event == "KAP’GARANTI DOMESTIQUE"){
      this.displayDuree = true;
      this.displayType = false;
      
    }else{
      this.displayDuree = false;
      this.displayType = true;
    }
  }else{
    this.displayDuree = false;
      this.displayType = false;
  }
    
  }
  onChangeDuree(event){
    this.nettoyage2 = " ";
    this.tauxSelected = Number(event);
  }
  onChangeCA(event){
    this.nettoyage1 = " ";
    this.tauxSelected = Number(event);
  }

  simulation () {

    
    let taux: number;
    
    let taxe: number;
    let deposit: number;
    let taux1: number;
    let taux2: number;
    let taux3: number;
    let taux4: number;
    
    for (let i = 0; i < this.garanties.length; i++) {
      if (this.garanties[i].garantie == this.garantieSelected){
        taux = this.garanties[i].taux_prime_ht;
        this.frais = this.garanties[i].frais_de_dossier;
        taxe = this.garanties[i].taxes_assurances;
        deposit = this.garanties[i].deposit;
        taux1 = this.garanties[i].taux1;
        taux2 = this.garanties[i].taux2;
        taux3 = this.garanties[i].taux3;
        taux4 = this.garanties[i].taux4;
      }
      
      
  }

  if(this.frais == 0){
  if(this.capital <= 10000000){
    this.frais = 25000;
  }else if(this.capital > 10000000 && this.capital <= 25000000){
    this.frais = 50000;
  }else if(this.capital > 25000000 && this.capital <= 50000000){
    this.frais = 100000;
  }else if(this.capital > 50000000 && this.capital <= 100000000){
    this.frais = 150000;
  }else if(this.capital > 100000000 && this.capital <= 500000000){
    this.frais = 250000;
  }else{
    this.frais = 300000;
  }
}


//KAP'GARANTI DOMESTIQUE
if(this.tauxSelected != 0){
  
if(this.tauxSelected == 1){
  this.primeht = (this.capital* taux1) / 100 ;
  
}else if(this.tauxSelected == 2){
  this.primeht = (this.capital* taux2) / 100 ;
}else if(this.tauxSelected == 3){
  this.primeht = (this.capital* taux3) / 100 ;

}else if(this.tauxSelected == 4){
  this.primeht = (this.capital* taux4) / 100 ;

}
this.taxeAss = ((this.primeht + this.frais ) * 10) / 100 ;
  this.primettc = this.primeht + this.frais + this.taxeAss ;

  if(this.tauxSelected == 0 ){
    this.error = true;
  }
  console.log(this.tauxSelected);

  this.tauxSelected = 0;
  
}else{
  console.log(this.frais);
  this.primeht= (this.capital* taux) / 100 ;
  this.taxeAss= ((this.primeht + this.frais ) * 10) / 100 ;
  this.primettc = this.primeht + this.frais + this.taxeAss ;
  console.log(this.primettc);
}


  

 /* if(this.frais == 0 || taux == 0){
    this.primettc = 0 ;
    this.aDeterminer = "frais de dossier à determiner ou bien le taux n'est pas fixe";
    this.error = true;
  } else {
    this.error = false;
  }*/


  if (this.capital == 0 || this.primettc == 0 || this.error == true){
    this.displayPrime = false;
  } else {
    this.displayPrime = true ;
  }
  if(this.capital == null ||this.capital == 0 || this.typeAssSelected == '' || this.produitSelected == '' || this.garantieSelected == ''){
    this.displayAllError = true;
    this.displayPrime = false;

  }else{
    this.displayAllError = false;
  }

  console.log(this.capital);
  
  
}

cancel () {
  this.router.navigateByUrl('/home/espace-client');
}
print(){
  window.print();
}


}
