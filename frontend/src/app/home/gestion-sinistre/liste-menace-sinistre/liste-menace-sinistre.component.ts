import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrService,
} from "@nebular/theme";
import { Acheteur } from "../../../model/Acheteur";
import { Client } from "../../../model/Client";
import { Produit } from "../../../model/Produit";
import { Sinistre } from "../../../model/Sinistre";
import { User } from "../../../model/User";
import { AcheteurService } from "../../../services/acheteur.service";
import { ClientService } from "../../../services/client.service";
import { ProduitService } from "../../../services/produit.service";
import { sinistreService } from "../../../services/sinistre.service";
import { TransfertDataService } from "../../../services/transfertData.service";
import { UserService } from "../../../services/user.service";

@Component({
  selector: "ngx-liste-menace-sinistre",
  templateUrl: "./liste-menace-sinistre.component.html",
  styleUrls: ["./liste-menace-sinistre.component.scss"],
})
export class ListeMenaceSinistreComponent implements OnInit {
  title = "La liste des menaces de sinistres";
  autorisation = [];
  login_demandeur: string;
  user: User;

  clients: Array<Client> = new Array<Client>();
  acheteurs: Array<Acheteur> = new Array<Acheteur>();
  produits: Array<Produit> = new Array<Produit>();

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = "success";
  statusFail: NbComponentStatus = "danger";

  public displayedColumns = [
    "sin_client",
    "sin_police",
    "sin_acheteur",
    "sin_num",
    "sin_produits",
    "statut",
    "action",
  ];
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private authService: NbAuthService,
    private sinistreService: sinistreService,
    private userService: UserService,
    private dialogService: NbDialogService,
    private clientService: ClientService,
    private acheteurService: AcheteurService,
    private produitService: ProduitService,
    private transfertData: TransfertDataService,
    private toastrService: NbToastrService
  ) { }

  ngOnInit(): void {
    this.onGetAllMenaceSinistresMouvement();
    this.onGetAllClient();
    this.onGetAllAcheteur();
    this.onGetAllProduits();
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(",");
        this.login_demandeur = token.getPayload().sub;
        this.onGetUser(this.login_demandeur);
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  onGetUser(login: string) {
    this.userService.getUser(login).subscribe((data: User) => {
      this.user = data;
    });
  }

  onGetAllMenaceSinistresMouvement() {
    this.sinistreService
      .getAllMenaceSinistreMouvement()
      .subscribe((data: any) => {
        this.dataSource.data = data.data;
      });
  }

  onOpen(dialog: TemplateRef<any>, sinistre: Sinistre) {
    this.dialogService.open(dialog, {
      context: sinistre,
    });
  }

  openListeSinistre() {
    this.router.navigateByUrl("home/gestion-sinistre/liste-sinistre");
  }

  onGetAllClient() {
    this.clientService.getAllClients().subscribe((data: Client[]) => {
      this.clients = data as Client[];
    });
  }

  onGetAllAcheteur() {
    this.acheteurService.getAllAcheteurs().subscribe((data: Acheteur[]) => {
      this.acheteurs = data as Acheteur[];
    });
  }

  onGetClientByCode(numero: any) {
    return (
      numero +
      " : " +
      (this.clients.find((c) => c.client_id == numero)?.clien_prenom
        ? this.clients.find((c) => c.client_id == numero)?.clien_prenom
        : "") +
      " " +
      (this.clients.find((c) => c.client_id == numero)?.clien_nom
        ? this.clients.find((c) => c.client_id == numero)?.clien_nom
        : "") +
      " " +
      (this.clients.find((c) => c.client_id == numero)?.clien_denomination
        ? this.clients.find((c) => c.client_id == numero)?.clien_denomination
        : "")
    );
  }

  onGetAcheteurByCode(numero: any) {
    if (numero !== null && numero !== "") {
      return (
        numero +
        " : " +
        this.acheteurs.find((a) => a.achet_id == numero)?.achet_prenom +
        " " +
        this.acheteurs.find((a) => a.achet_id == numero)?.achet_nom
      );
    } else {
      return "";
    }
  }

  onGetAllProduits() {
    this.produitService.getAllProduits().subscribe((data: Produit[]) => {
      this.produits = data as Produit[];
    });
  }

  onGetProduitByNumero(numero: any) {
    return this.produits.find((p) => p.prod_numero == numero)
      ?.prod_denominationcourt;
  }

  onGetLibelleByStatus(num: any) {
    if (num == 1) {
      return "Menace de sinistre";
    } else {
      return "";
    }
  }

  onOpenLeveeMenace(dialog: TemplateRef<any>, sinistre: Sinistre) {
    this.dialogService.open(dialog, {
      context: sinistre,
    });
  }

  onOpenConfirmationSinistre(dialog: TemplateRef<any>, sinistre: Sinistre) {
    this.dialogService.open(dialog, {
      context: sinistre,
    });
  }

  confirmeLeveeMenace(sinistreMouvement: any) {
    // console.log(sinistreMouvement);
    // console.log(sinistreMouvement.sini_num);
    // console.log(sinistreMouvement.mvts_num);
    console.log(sinistreMouvement.sini_acheteur);
    const formData = new FormData();
    formData.append("numSinistre", sinistreMouvement.sini_num);
    formData.append("numMvtSinistre", sinistreMouvement.mvts_num);
    formData.append("numAcheteur", sinistreMouvement.sini_acheteur);

    this.sinistreService
      .leveeMenaceSinistre(formData)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          this.toastrService.show(data.message, "Notification", {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
          // this.router.navigateByUrl('home/engagement/gestion-surete-deposit');
          this.onGetAllMenaceSinistresMouvement();
        } else {
          this.toastrService.show(data.message, "Notification d'erreur", {
            status: this.statusFail,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
        }
      });
  }

  confirmeValidationMenace(sinistreMouvement: any) {
    console.log(sinistreMouvement);
    console.log(sinistreMouvement.sini_num);
    console.log(sinistreMouvement.mvts_num);
    const formData = new FormData();
    formData.append("numSinistre", sinistreMouvement.sini_num);
    formData.append("numMvtSinistre", sinistreMouvement.mvts_num);

    this.sinistreService
      .confirmeMenaceSinistre(formData)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          this.toastrService.show(data.message, "Notification", {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
          // this.router.navigateByUrl('home/engagement/gestion-surete-deposit');
          this.onGetAllMenaceSinistresMouvement();
        } else {
          this.toastrService.show(data.message, "Notification d'erreur", {
            status: this.statusFail,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
        }
      });
  }

  onModificationMenaceSinistre(sinistre: any) {
    this.transfertData.setData(sinistre);
    this.router.navigateByUrl(
      "home/gestion-sinistre/liste-menace-sinistre/modification-menace-sinistre"
    );
  }

  onDeclarationSinistre(sinistre: any) {
    this.transfertData.setData(sinistre);
    this.router.navigateByUrl("home/gestion-sinistre/liste-menace-sinistre/declaration-sinistre")
  }

  check_fonct(fonct: String) {
    let el = this.autorisation.findIndex((itm) => itm === fonct);
    if (el === -1) return false;
    else return true;
  }
}
