import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { DomSanitizer } from '@angular/platform-browser';
import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NbAuthJWTToken, NbAuthService, NbAuthToken } from '@nebular/auth';
import { UserService } from '../../../services/user.service';
import { User } from '../../../model/User';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  langue: String;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [{ title: 'Mon Compte', icon: 'person' }, { title: 'Se deconnecter', icon: 'log-out' }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private authService: NbAuthService,
    private layoutService: LayoutService, private translate: TranslateService,
    private breakpointService: NbMediaBreakpointsService,
    private userService: UserService, private sanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    this.langue = this.translate.currentLang;
    console.log(this.langue);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user = token.getPayload();
        }
        // tslint:disable-next-line:no-console
      });
    this.userService.getUser(this.user.sub)
      .subscribe((data: User) => {
        this.userService.getPhoto(data.util_login, data.util_id)
          .subscribe((img) => {
            //this.user.image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(img));
            const reader = new FileReader();
            reader.readAsDataURL(img);
            reader.onload = (_event) => {
              this.user.image = reader.result;
            }
          });
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  changeLang(language: string) {
    this.translate.use(language);

  }

  onChangeLang(event) {
    console.log(event);

  }

}
