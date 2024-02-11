import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { User } from '../../model/User';
import { TransfertDataService } from '../../services/transfertData.service';
import { UserService } from '../../services/user.service';
import { AjoutUtilisateurComponent } from './ajout-utilisateur/ajout-utilisateur.component';
import { ModifUtilisateurComponent } from './modif-utilisateur/modif-utilisateur.component';

@Component({
  selector: 'ngx-gestion-utilisateur',
  templateUrl: './gestion-utilisateur.component.html',
  styleUrls: ['./gestion-utilisateur.component.scss']
})
export class GestionUtilisateurComponent implements OnInit {
 

  users: Array<User> = new Array<User>();
  user: User;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';


  public displayedColumns = ['util_nom', 'util_prenom', 'util_email', 'util_type', 'util_service','action'];
  public dataSource = new MatTableDataSource<User>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  autorisation = [];

  // status: NbComponentStatus = 'info';

  constructor(private userService: UserService ,private authService: NbAuthService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,private router: Router,private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    this.onGetAllUsers();
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }

    });
    
  
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onGetAllUsers() {
    this.userService.getAllUsers()
      .subscribe((data: User[]) => {
          this.users = data;
          this.dataSource.data = data as User[];
          console.log(this.users);
      });
  }

  open(dialog: TemplateRef<any>, user: User) {
    this.dialogService.open(
      dialog,
      { context: user });
  }
  openDel(dialog: TemplateRef<any>, user: User) {
    this.dialogService.open(
      dialog,
      { context: user });
  }
  openAjout() {
    this.router.navigateByUrl('home/gestion_utilisateur/ajout');
    /*
    this.dialogService.open(AjoutUtilisateurComponent)
    .onClose.subscribe(data => data && this.userService.addUser(data)
    .subscribe(() => {
      console.log(data);
      this.toastrService.show(
        'Utilisateur Enregistré avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
       this.onGetAllUsers();
    },
    (error) => {
      this.toastrService.show(
        'une erreur est survenue',
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.onGetAllUsers();
    },
    ));

    */
  }

  openModif(user: User) {
    this.transfertData.setData(user);
    this.router.navigateByUrl('home/gestion_utilisateur/modif');
    /*
    this.dialogService.open(ModifUtilisateurComponent, {
        context: {
          user: user,
        },
      })
    .onClose.subscribe(data => data && this.userService.modifUser(data)
    .subscribe(() => {
      this.toastrService.show(
        'Utilisateur modifié avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
       this.onGetAllUsers();
    },
      (error) => {
        console.log(error);
        this.toastrService.show(
          'une erreur est survenue',
          'Notification',
          {
            status: this.statusFail,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
          this.onGetAllUsers();
      },
    ));
    */
  }




  
  public redirectToDelete = (login: string) => {
    
    this.userService.delUser(login)
    .subscribe((data) => {
      console.log(data);
      this.toastrService.show(
        'Utilisateur supprimé avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 0,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.onGetAllUsers();
    },
    (error) => {
      console.log(error);
      this.toastrService.show(
        'une erreur est survenue',
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 0,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
    },
    );

  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }

}
