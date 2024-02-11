import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

@Component({
  selector: 'ngx-consultation-gestion-sinistre',
  templateUrl: './consultation-gestion-sinistre.component.html',
  styleUrls: ['./consultation-gestion-sinistre.component.scss']
})
export class ConsultationGestionSinistreComponent implements OnInit {

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

  openSinistre() {
    this.router.navigateByUrl('/home/gestion-sinistre/consultation/consultation-sinistre');
  }

  openSinistralite() {
    this.router.navigateByUrl('/home/gestion-sinistre/consultation/consultation-sinistralite');
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }
}
