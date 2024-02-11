import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

@Component({
  selector: 'ngx-consultation-param-general',
  templateUrl: './consultation-param-general.component.html',
  styleUrls: ['./consultation-param-general.component.scss']
})
export class ConsultationParamGeneralComponent implements OnInit {

  autorisation = [];

  constructor(private router: Router,
    private authService: NbAuthService) { }

  ngOnInit(): void {

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          console.log(this.autorisation);
          // this.login_demandeur = token.getPayload().sub;
          // this.onGetUser(this.login_demandeur);
        }
      });
  }

  onOpenBranches() {
    this.router.navigateByUrl('/home/parametrage-general/consultation/branche');
  }

  onOpenCategories() {
    this.router.navigateByUrl('/home/parametrage-general/consultation/categorie');
  }

  onOpenProduits() {
    this.router.navigateByUrl('/home/parametrage-general/consultation/produit');
  }

  onOpenIntermediaires() {
    this.router.navigateByUrl('/home/parametrage-general/consultation/intermediaire');
  }

  onOpenCompagnie() {
    this.router.navigateByUrl('/home/parametrage-general/consultation/compagnie');
  }

  onOpenReassureur() {
    this.router.navigateByUrl('home/parametrage-general/consultation/reassureur');
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }
}
