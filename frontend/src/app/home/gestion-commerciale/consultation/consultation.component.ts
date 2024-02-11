import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

@Component({
  selector: 'ngx-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.scss']
})
export class ConsultationComponent implements OnInit {

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

  openClient() {
    this.router.navigateByUrl('/home/gestion-client');
  }

  openProspect() {
    this.router.navigateByUrl('/home/gestion-commerciale/consultation/consultation-prospect');
  }

  openContact() {
    this.router.navigateByUrl('/home/gestion-contact');
  }

  openDemandePhysique() {
    this.router.navigateByUrl('/home/demande-Physique');
  }

  openDemandeSociete() {
    this.router.navigateByUrl('/home/demande-societe');
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

}
