import { Component, OnInit } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

@Component({
  selector: 'ngx-annulation-reglement-financier',
  templateUrl: './annulation-reglement-financier.component.html',
  styleUrls: ['./annulation-reglement-financier.component.scss']
})
export class AnnulationReglementFinancierComponent implements OnInit {

  autorisation = [];

  constructor(private authService: NbAuthService) {}

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

  check_fonct(fonct: String) {
    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

}
