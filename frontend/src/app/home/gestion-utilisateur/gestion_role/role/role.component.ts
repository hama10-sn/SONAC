import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Role } from '../../../../model/Role';
import { RoleService } from '../../../../services/role.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { AjoutRoleComponent } from './ajout-role/ajout-role.component';
import { ModifRoleComponent } from './modif-role/modif-role.component';

@Component({
  selector: 'ngx-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  roles: Array<Role> = new Array<Role>();
  role: Role;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';


  public displayedColumns = ['nom', 'date_create', 'date_update', 'update', 'delete'];
  public dataSource = new MatTableDataSource<Role>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //token: NbAuthJWTToken;
  // status: NbComponentStatus = 'info';
  autorisation = [];

  constructor(private roleService: RoleService, private router: Router,
    private dialogService: NbDialogService, private transfertData: TransfertDataService,
    private toastrService: NbToastrService, private authService: NbAuthService) { }

  ngOnInit(): void {
    this.onGetAllRoles();
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }

    });
   // console.log(localStorage.getItem('auth_app_token'));
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onGetAllRoles() {
    this.roleService.getAllRoles()
      .subscribe((data: Role[]) => {
          this.roles = data;
          this.dataSource.data = data as Role[];
          console.log(this.roles);
      });
  }

  onDeleteRole(id: number) {
    this.roleService.deleteRole(id)
      .subscribe(() => {
        this.toastrService.show(
          'Role supprimer avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 8000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });

          this.onGetAllRoles();
      },
      (error) => {
        this.toastrService.show(

          error.error.message,
          'Notification d\'erreur',
          {
            status: this.statusFail,
            destroyByClick: true,
            duration: 10000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
         // console.log(error.error.message);
          this.onGetAllRoles();
      },
      );
  }

  open(dialog: TemplateRef<any>, role: Role) {
    this.transfertData.setData(role);
    this.dialogService.open(
      dialog,
      { context: role });
       console.log(this.roles);
  }
  openAjout() {
    this.dialogService.open(AjoutRoleComponent)
    .onClose.subscribe(data => data && this.roleService.addRole(data)
    .subscribe((role: Role) => {
      this.toastrService.show(
        'Role Enregistré avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
       this.onGetAllRoles();
       this.openModif_test(role);
    },
    (error) => {
      this.toastrService.show(
        error.error.message,
          'Notification d\'erreur',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.onGetAllRoles();

    },
    ));
  }

  openModif(role: Role, id: Number) {
    this.dialogService.open(ModifRoleComponent, {
        context: {
          role: role,
        },
      })
    .onClose.subscribe(data => data && this.roleService.updateRoles(data, id)
    .subscribe(() => {
      this.toastrService.show(
        'Role modifié avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
       this.onGetAllRoles();
    },
      (error) => {
      //  console.log(error);
        this.toastrService.show(
          error.error.message,
          'Notification d\'erreur',
          {
            status: this.statusFail,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
          this.onGetAllRoles();
      },
    ));
  }


  openModif_test(role: Role) {
    this.transfertData.setData(role);
    this.router.navigate(['home/fonctionnalite']);
  }


  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }



  public redirectToUpdate = (id: string) => {

  }
  public redirectToDelete = (id: string) => {

  }

}
