import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

@Component({
  selector: 'ngx-consultation-gestion-production',
  templateUrl: './consultation-gestion-production.component.html',
  styleUrls: ['./consultation-gestion-production.component.scss']
})
export class ConsultationGestionProductionComponent implements OnInit {

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

  openEncaissement() {
    this.router.navigateByUrl('/home/gestion-production/consultation/consultation-encaissement');
  }

  openEmission() {
    this.router.navigateByUrl('/home/gestion-production/consultation/consultation-emission');
  }

  openProduction() {
    this.router.navigateByUrl('/home/gestion-production/consultation/consultation-production');
  }

  openPolice() {
    this.router.navigateByUrl('/home/gestion-production/consultation/consultation-police');
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

}
