/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuService } from '@nebular/theme';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(private router: Router,private analytics: AnalyticsService, private seoService: SeoService,
    private menuService: NbMenuService) {
  }



  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();

    this.menuService.onItemClick()
          .subscribe((event) => {
            this.onContecxtItemSelection(event.item.title);
          });
  }


  onContecxtItemSelection(title) {
    // tslint:disable-next-line:no-console
    console.log('click', title);
   if ( title === 'Se deconnecter') {
        localStorage.clear();
        this.router.navigate(['auth/login']);
      }
      if ( title === 'Mon Compte') {
        this.router.navigate(['home/profil']);
      }
  }


}
