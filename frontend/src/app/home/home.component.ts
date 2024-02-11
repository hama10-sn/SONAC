import { Component, OnInit } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { MENU_ITEMS } from '../menu';
import { MENU_ITEMS_CLIENT } from '../menuClient';
import { MENU_ITEMS_PRODUCTION } from '../menuProductionProject';
import { User } from '../model/User';
import { UserService } from '../services/user.service';

@Component({
  selector: 'ngx-home',
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  menu:any = MENU_ITEMS;

  autorisation = [];
  user:User;
  tokenn:any;

  constructor(private authService: NbAuthService,private userService:UserService) { }

  ngOnInit(): void {
  //  console.log(this.menu.findIndex(itm => itm.title === 'Gestion Profil'));
    /*this.authService.getToken()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        this.tokenn =token.getPayload();
        this.userService.getUser(this.tokenn.sub)
        .subscribe((data:User) => {
          this.user = data;
          if(data.util_type == 'agent'){
            this.menu = MENU_ITEMS;
            
          }else{
            this.menu = MENU_ITEMS_CLIENT;
          }
        });
       
      }

    });*/
    //this.onCheck_menu('Gestion Profil', 'l_gestion_profil');
    //this.onCheck_menu('Parametrage', 'l_parametrage');
  }

  onCheck_menu(menup, data) {

    if (!this.check_fonct(data))  {

       let el = this.menu.findIndex(itm => itm.title === menup);
        this.menu.splice((el), 1);
      // this.tableau_fonctionnalite.pop();
      // console.log(el);
    }
   // console.log(this.menu);

  }


  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }
}
