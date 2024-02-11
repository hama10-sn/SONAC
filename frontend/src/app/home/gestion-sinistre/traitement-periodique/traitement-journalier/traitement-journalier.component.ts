import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbDialogService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Branche } from '../../../../model/Branche';
import { Client } from '../../../../model/Client';
import { Police } from '../../../../model/Police';
import { User } from '../../../../model/User';
import { BrancheService } from '../../../../services/branche.service';
import { ClientService } from '../../../../services/client.service';
import { EncaissementService } from '../../../../services/encaissement.service';
import { PoliceService } from '../../../../services/police.service';
import { UserService } from '../../../../services/user.service';
import dateFormatter from 'date-format-conversion';
import { HttpEventType } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Encaissement } from '../../../../model/Encaissement';
import { Produit } from '../../../../model/Produit';
import { Intermediaire } from '../../../../model/Intermediaire';
import { ProduitService } from '../../../../services/produit.service';
import { IntermediaireService } from '../../../../services/intermediaire.service';

@Component({
  selector: 'ngx-traitement-journalier',
  templateUrl: './traitement-journalier.component.html',
  styleUrls: ['./traitement-journalier.component.scss']
})
export class TraitementJournalierComponent implements OnInit {
  title = 'Journal de production journalier (par ordre de numéro)';
  check: boolean = false ;
  numBranche: number = 0;
  numClient: number = 0;
  numPolice: number = 0;
  numProduit: number = 0;
  numIntermediaire: number = 0;

  autorisation = [];
  login_demandeur: string;
  demandeur: string;
  jour: string = '0';

  user: User;
  client: Client;

  problemeDate: boolean = false;
  erreur: boolean = false;

  addForm = this.fb.group({
    jour: [''],
  });

  public displayedColumns = ['encai_numeroquittance', 'encai_numeroencaissement', 'encai_numerosouscripteur', 'encai_numeropolice', 'encai_mtnquittance', 'encai_mtnpaye', 'encai_datepaiement', 'encai_typencaissement', 'action'];
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  branches: Array<Branche> = new Array<Branche>();
  clients: Array<Client> = new Array<Client>();
  police: Array<Police> = new Array<Police>();
  produit: Array<Produit> = new Array<Produit>();
  intermediaire: Array<Intermediaire> = new Array<Intermediaire>();

  public brancheCtrl: FormControl = new FormControl();
  public clientCtr: FormControl = new FormControl();
  public policeCtr: FormControl = new FormControl();
  public produitCtr: FormControl = new FormControl();
  public intermediaireCtr: FormControl = new FormControl();

  public brancheFilterCtrl: FormControl = new FormControl();
  public clientFilterCtrl: FormControl = new FormControl();
  public policetFilterCtrl: FormControl = new FormControl();
  public produitFilterCtrl: FormControl = new FormControl();
  public intermediaireFilterCtrl: FormControl = new FormControl();

  public filteredBranche: ReplaySubject<Branche[]> = new ReplaySubject<Branche[]>();
  public filteredClient: ReplaySubject<Client[]> = new ReplaySubject<Client[]>();
  public filteredPolice: ReplaySubject<Police[]> = new ReplaySubject<Police[]>();
  public filteredProduit: ReplaySubject<Produit[]> = new ReplaySubject<Produit[]>();
  public filteredIntermediaire: ReplaySubject<Intermediaire[]> = new ReplaySubject<Intermediaire[]>();
  
  protected _onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder,
    private authService: NbAuthService,
    private dialogService: NbDialogService,
    private encaissementService: EncaissementService,
    private clientService: ClientService,
    private policeService: PoliceService,
    private brancheService: BrancheService,
    private produitService: ProduitService,
    private intermediaireService: IntermediaireService,
    private userService: UserService) { }

    ngOnInit(): void {
      this.onGetAllBranche();
      this.onGetAllClient();
      this.onGetAllPolice();
      this.onGetAllProduit();
      this.onGetAllIntermediaire();
      this.onGetAllJournalProduction();
      this.authService.onTokenChange()
        .subscribe((token: NbAuthJWTToken) => {
  
          if (token.isValid()) {
            this.autorisation = token.getPayload().fonctionnalite.split(',');
            this.login_demandeur = token.getPayload().sub;
            this.onGetUser(this.login_demandeur);
          }
        });
  
        this.brancheFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filtererBranches();
        });
    
        this.clientFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filtererClients();
        });
  
        this.policetFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filtererPolices();
        });

        this.produitFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filtererProduits();
        });

        this.intermediaireFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filtererIntermediaires();
        });
    }

    ngOnDestroy() {
      this._onDestroy.next();
      this._onDestroy.complete();
    }
  
    ngAfterViewInit(): void {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }

    onClickBranche() {
      this.check = false;
    }
    
    onClickPeriode() {
      this.check = false;
    }
  
    onClickClient() {
      this.check = false;
    }
  
    onClickPolice() {
      this.check = false;
    }

    onClickProduit() {
      this.check = false;
    }

    onClickIntermediaire() {
      this.check = false;
    }
  
    onGetUser(login: string) {
      this.userService.getUser(login)
        .subscribe((data: User) => {
          this.user = data;
          this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
        });
    }

    protected filtererBranches() {
      if (!this.branches) {
        return;
      }
      // get the search keyword
      let search = this.brancheFilterCtrl.value;
      if (!search) {
        this.filteredBranche.next(this.branches.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      this.filteredBranche.next(
        this.branches.filter(c => c.branche_libellecourt.toLowerCase().indexOf(search) > -1 ||
          c.branche_numero.toString().toLowerCase().indexOf(search) > -1)
      );
    }
  
    protected filtererClients() {
      if (!this.clients) {
        return;
      }
      // get the search keyword
      let search = this.clientFilterCtrl.value;
      if (!search) {
        this.filteredClient.next(this.clients.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      // this.filteredClient.next(
      //   this.clients.filter(c => c.clien_denomination.toLowerCase().indexOf(search) > -1 ||
      //     c.clien_numero.toString().toLowerCase().indexOf(search) > -1)
      // );
      this.filteredClient.next(
        this.clients.filter(c => c.clien_numero.toString().toLowerCase().indexOf(search) > -1)
      );
    }
  
    protected filtererPolices() {
      if (!this.police) {
        return;
      }
      // get the search keyword
      let search = this.policetFilterCtrl.value;
      if (!search) {
        this.filteredPolice.next(this.police.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      this.filteredPolice.next(
        // this.police.filter(c => c.poli_filiale.toLowerCase().indexOf(search) > -1 ||
        //   c.poli_numero.toString().toLowerCase().indexOf(search) > -1)
        this.police.filter(c => c.poli_numero.toString().toLowerCase().indexOf(search) > -1)
      );
    }

    protected filtererProduits() {
      if (!this.produit) {
        return;
      }
      // get the search keyword
      let search = this.produitFilterCtrl.value;
      if (!search) {
        this.filteredProduit.next(this.produit.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      this.filteredProduit.next(
        this.produit.filter(c => c.prod_denominationlong.toLowerCase().indexOf(search) > -1 ||
          c.prod_numero.toString().toLowerCase().indexOf(search) > -1)
      );
    }

    protected filtererIntermediaires() {
      if (!this.intermediaire) {
        return;
      }
      // get the search keyword
      let search = this.intermediaireFilterCtrl.value;
      if (!search) {
        this.filteredIntermediaire.next(this.intermediaire.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      this.filteredIntermediaire.next(
        this.intermediaire.filter(c => c.inter_denomination.toLowerCase().indexOf(search) > -1 ||
          c.inter_numero.toString().toLowerCase().indexOf(search) > -1)
      );
    }
  
    onChangeBranche(event) {
      this.numBranche = Number(event.value);
    }
  
    onChangeClient(event) {
      this.numClient = Number(event.value);
    }
  
    onChangePolice(event) {
      this.numPolice = Number(event.value);
    }

    onChangeProduit(event) {
      this.numProduit = Number(event.value);
    }

    onChangeIntermediaire(event) {
      this.numIntermediaire = Number(event.value);
    }
  
    onGetAllBranche() {
      this.brancheService.getAllBranches()
        .subscribe((data: Branche[]) => {
          this.branches = data as Branche[];
          this.filteredBranche.next(this.branches.slice());
        });
    }
  
    onGetAllClient() {
      this.clientService.getAllClients()
        .subscribe((data: Client[]) => {
          this.clients = data as Client[];
          console.log(this.clients);
          this.filteredClient.next(this.clients.slice());
        });
    }
  
    onGetAllPolice() {
      this.policeService.getAllPolice()
        .subscribe((data: Police[]) => {
          this.police = data as Police[];
          this.filteredPolice.next(this.police.slice());
        });
    }

    onGetAllProduit() {
      this.produitService.getAllProduits()
        .subscribe((data: Produit[]) => {
          this.produit = data as Produit[];
          this.filteredProduit.next(this.produit.slice());
        });
    }

    onGetAllIntermediaire() {
      this.intermediaireService.getAllIntermediaires()
        .subscribe((data: Intermediaire[]) => {
          this.intermediaire = data as Intermediaire[];
          this.filteredIntermediaire.next(this.intermediaire.slice());
        });
    }
  
    onGetAllJournalProduction() {
      this.encaissementService.getJournalProductionJournalier()
        .subscribe((data: any) => {
          this.dataSource.data = data;
        })
    }

    onGetAllJournalParJour(jour: string) {
      this.encaissementService.getJournalProductionParJour(jour)
        .subscribe((data: any) => {
          this.dataSource.data = data;
        })
    }

    onGetAllJournalProductionByPolice(jour: string, num_poli: number) {
      this.encaissementService.getJournalProductionJournalierByPolice(jour, num_poli)
        .subscribe((data: any) => {
          this.dataSource.data = data;
        })
    }

    onGetAllJournalProductionByClient(jour: string, num_client: number) {
      this.encaissementService.getJournalProductionJournalierByClient(jour, num_client)
        .subscribe((data: any) => {
          this.dataSource.data = data;
        })
    }

    onGetAllJournalProductionByBranche(jour: string, num_branche: number) {
      this.encaissementService.getJournalProductionJournalierByBranche(jour, num_branche)
        .subscribe((data: any) => {
          this.dataSource.data = data;
        })
    }

    onGetAllJournalProductionByProduit(jour: string, num_produit: number) {
      this.encaissementService.getJournalProductionJournalierByProduit(jour, num_produit)
        .subscribe((data: any) => {
          this.dataSource.data = data;
        })
    }

    onGetAllJournalProductionByIntermediaire(jour: string, num_intermediaire: number) {
      this.encaissementService.getJournalProductionJournalierByIntermediaire(jour, num_intermediaire)
        .subscribe((data: any) => {
          this.dataSource.data = data;
        })
    }

    onGetAllJournalProductionByPoliceAndClient(jour: string, num_police: number, num_clien: number) {
      this.encaissementService.getJournalProductionJournalierByPoliceAndClient(jour, num_police, num_clien)
        .subscribe((data: any) => {
          this.dataSource.data = data.data;
        })
    }

    onGetAllJournalProductionByPoliceAndBranche(jour: string, num_police: number, num_branche: number) {
      this.encaissementService.getJournalProductionJournalierByPoliceAndBranche(jour, num_police, num_branche)
        .subscribe((data: any) => {
          this.dataSource.data = data;
        })
    }

    onGetAllJournalProductionByPoliceAndProduit(jour: string, num_police: number, num_produit: number) {
      this.encaissementService.getJournalProductionJournalierByPoliceAndProduit(jour, num_police, num_produit)
        .subscribe((data: any) => {
          this.dataSource.data = data;
        })
    }

    onGetAllJournalProductionByPoliceAndIntermediaire(jour: string, num_police: number, num_intermediaire: number) {
      this.encaissementService.getJournalProductionJournalierByPoliceAndIntermediaire(jour, num_police, num_intermediaire)
        .subscribe((data: any) => {
          this.dataSource.data = data;
        })
    }

    onGetAllJournalProductionByClientAndBranche(jour: string, num_clien: number, num_branche: number) {
      this.encaissementService.getJournalProductionJournalierByClientAndBranche(jour, num_clien, num_branche)
        .subscribe((data: any) => {
          this.dataSource.data = data;
        })
    }

    onGetAllJournalProductionByClientAndProduit(jour: string, num_clien: number, num_produit: number) {
      this.encaissementService.getJournalProductionJournalierByClientAndProduit(jour, num_clien, num_produit)
        .subscribe((data: any) => {
          this.dataSource.data = data;
        })
    }

    onGetAllJournalProductionByClientAndIntermediaire(jour: string, num_clien: number, num_intermediaire: number) {
      this.encaissementService.getJournalProductionJournalierByClientAndIntermediaire(jour, num_clien, num_intermediaire)
        .subscribe((data: any) => {
          this.dataSource.data = data;
        })
    }

    onGetAllJournalProductionByProduitAndIntermediaire(jour: string, num_produit: number, num_intermediaire: number) {
      this.encaissementService.getJournalProductionJournalierByProduitAndIntermediaire(jour, num_produit, num_intermediaire)
        .subscribe((data: any) => {
          this.dataSource.data = data;
        })
    }

    onGetAllJournalProductionByPoliceAndClientAndBranche(jour: string, num_poli: number, num_clien: number, num_branche: number) {
      this.encaissementService.getJournalProductionJournalierByPoliceAndClientAndBranche(jour, num_poli, num_clien, num_branche)
        .subscribe((data: any) => {
          this.dataSource.data = data;
        })
    }

    onGetAllJournalProductionByPoliceAndClientAndBrancheAndProduit(jour: string, num_poli: number, num_clien: number, num_branche: number, num_produit: number) {
      this.encaissementService.getJournalProductionJournalierByPoliceAndClientAndBrancheAndProduit(jour, num_poli, num_clien, num_branche, num_produit)
        .subscribe((data: any) => {
          this.dataSource.data = data;
        })
    }

    onGetAllJournalProductionByPoliceAndClientAndBrancheAndProduitAndIntermediaire(jour: string, num_poli: number, num_clien: number, num_branche: number, num_produit: number, num_intermediaire: number) {
      this.encaissementService.getJournalProductionJournalierByPoliceAndClientAndBrancheAndProduitAndIntermediaire(jour, num_poli, num_clien, num_branche, num_produit, num_intermediaire)
        .subscribe((data: any) => {
          this.dataSource.data = data;
        })
    }

    onOpen(dialog: TemplateRef<any>, encaissement: Encaissement) {
      this.dialogService.open(
        dialog,
        {
          context: encaissement,
        });
    }
  
    public doFilter = (value: string) => {
      this.dataSource.filter = value.trim().toLocaleLowerCase();
    }
  
    check_fonct(fonct: String) {
      let el = this.autorisation.findIndex(itm => itm === fonct);
      if (el === -1)
        return false;
      else
        return true;
    }
  
    onFocusOutEventDate(event: any) {
      this.jour = this.addForm.get("jour").value;
      if ((this.jour != null && this.jour != '')) {
        this.problemeDate = false;
          if (dateFormatter(new Date(), 'yyyy-MM-dd') < this.jour) {
            this.problemeDate = true;
            this.erreur = true;
          } else {
            this.problemeDate = false;
            this.erreur = false;
            var jour_recupere = new Date(this.jour);
            jour_recupere.setDate(jour_recupere.getDate());
            this.jour = dateFormatter(jour_recupere, 'yyyy-MM-dd');
          }
      }
    }
  
    getColorDate() {
      if (this.problemeDate) {
        return '1px solid red';
      } else {
        return '';
      }
    }

    onGetClientByCode(numero: any) {
      return numero + " : " + ((this.clients.find(c => c.client_id == numero))?.clien_prenom ? (this.clients.find(c => c.client_id == numero))?.clien_prenom : "") + " " + ((this.clients.find(c => c.client_id == numero))?.clien_nom ? (this.clients.find(c => c.client_id == numero))?.clien_nom : "") + " " + ((this.clients.find(c => c.client_id == numero))?.clien_denomination ? (this.clients.find(c => c.client_id == numero))?.clien_denomination : "");
    }
  
    onConsulter() {
      if((this.jour != '0' && this.jour !== '') && this.numPolice == 0 && this.numClient == 0 && this.numBranche == 0 && this.numProduit == 0 && this.numIntermediaire == 0) {
        this.onGetAllJournalParJour(this.jour);
        this.title = 'Consultation journalier de la production (par jour)';
      } else if((this.jour != '0' && this.jour !== '') && this.numPolice != 0 && this.numClient == 0 && this.numBranche == 0 && this.numProduit == 0 && this.numIntermediaire == 0) {
        this.onGetAllJournalProductionByPolice(this.jour, this.numPolice);
        this.title = 'Consultation journalier de la production (par police)';
      } else if((this.jour != '0' && this.jour !== '') && this.numPolice == 0 && this.numClient != 0 && this.numBranche == 0 && this.numProduit == 0 && this.numIntermediaire == 0) {
        this.onGetAllJournalProductionByClient(this.jour, this.numClient);
        this.title = 'Consultation journalier de la production (par client)' ;
      } else if((this.jour != '0' && this.jour !== '') && this.numPolice == 0 && this.numClient == 0 && this.numBranche != 0 && this.numProduit == 0 && this.numIntermediaire == 0) {
        this.onGetAllJournalProductionByBranche(this.jour, this.numBranche);
        this.title = 'Consultation journalier de la production (par branche)' ;
      } else if((this.jour != '0' && this.jour !== '') && this.numPolice == 0 && this.numClient == 0 && this.numBranche == 0 && this.numProduit != 0 && this.numIntermediaire == 0) {
        this.onGetAllJournalProductionByProduit(this.jour, this.numProduit);
        this.title = 'Consultation journalier de la production (par produit)' ;
      } else if((this.jour != '0' && this.jour !== '') && this.numPolice == 0 && this.numClient == 0 && this.numBranche == 0 && this.numProduit == 0 && this.numIntermediaire != 0) {
        this.onGetAllJournalProductionByIntermediaire(this.jour, this.numIntermediaire);
        this.title = 'Consultation journalier de la production (par intermédiaire)' ;
      } else if((this.jour != '0' && this.jour !== '') && this.numPolice != 0 && this.numClient != 0 && this.numBranche == 0 && this.numProduit == 0 && this.numIntermediaire == 0) {
        this.onGetAllJournalProductionByPoliceAndClient(this.jour, this.numPolice, this.numClient);
        this.title = 'Consultation journalier de la production (par police et client)' ;
      } else if((this.jour != '0' && this.jour !== '') && this.numPolice != 0 && this.numClient == 0 && this.numBranche != 0 && this.numProduit == 0 && this.numIntermediaire == 0) {
        this.onGetAllJournalProductionByPoliceAndBranche(this.jour, this.numPolice, this.numBranche);
        this.title = 'Consultation journalier de la production (par police et branche)' ;
      } else if((this.jour != '0' && this.jour !== '') && this.numPolice != 0 && this.numClient == 0 && this.numBranche == 0 && this.numProduit != 0 && this.numIntermediaire == 0) {
        this.onGetAllJournalProductionByPoliceAndProduit(this.jour, this.numPolice, this.numProduit);
        this.title = 'Consultation journalier de la production (par police et produit)' ;
      } else if((this.jour != '0' && this.jour !== '') && this.numPolice != 0 && this.numClient == 0 && this.numBranche == 0 && this.numProduit == 0 && this.numIntermediaire != 0) {
        this.onGetAllJournalProductionByPoliceAndIntermediaire(this.jour, this.numPolice, this.numIntermediaire);
        this.title = 'Consultation journalier de la production (par police et intermédiaire)' ;
      } else if((this.jour != '0' && this.jour !== '') && this.numPolice == 0 && this.numClient != 0 && this.numBranche != 0 && this.numProduit == 0 && this.numIntermediaire == 0) {
        this.onGetAllJournalProductionByClientAndBranche(this.jour, this.numClient, this.numBranche);
        this.title = 'Consultation journalier de la production (par client et branche)' ;
      } else if((this.jour != '0' && this.jour !== '') && this.numPolice == 0 && this.numClient != 0 && this.numBranche == 0 && this.numProduit != 0 && this.numIntermediaire == 0) {
        this.onGetAllJournalProductionByClientAndProduit(this.jour, this.numClient, this.numProduit);
        this.title = 'Consultation journalier de la production (par client et produit)' ;
      } else if((this.jour != '0' && this.jour !== '') && this.numPolice == 0 && this.numClient != 0 && this.numBranche == 0 && this.numProduit == 0 && this.numIntermediaire != 0) {
        this.onGetAllJournalProductionByClientAndIntermediaire(this.jour, this.numClient, this.numIntermediaire);
        this.title = 'Consultation journalier de la production (par client et intermédiaire)' ;
      } else if((this.jour != '0' && this.jour !== '') && this.numPolice == 0 && this.numClient == 0 && this.numBranche == 0 && this.numProduit != 0 && this.numIntermediaire != 0) {
        this.onGetAllJournalProductionByProduitAndIntermediaire(this.jour, this.numProduit, this.numIntermediaire);
        this.title = 'Consultation journalier de la production (par produit et intermédiaire)' ;
      } else if((this.jour != '0' && this.jour !== '') && this.numPolice != 0 && this.numClient != 0 && this.numBranche != 0 && this.numProduit == 0 && this.numIntermediaire == 0) {
        this.onGetAllJournalProductionByPoliceAndClientAndBranche(this.jour, this.numPolice, this.numClient, this.numBranche);
        this.title = 'Consultation journalier de la production (par police et client et branche)' ;
      } else if((this.jour != '0' && this.jour !== '') && this.numPolice != 0 && this.numClient != 0 && this.numBranche != 0 && this.numProduit != 0 && this.numIntermediaire == 0) {
        this.onGetAllJournalProductionByPoliceAndClientAndBrancheAndProduit(this.jour, this.numPolice, this.numClient, this.numBranche, this.numProduit);
        this.title = 'Consultation journalier de la production (par police et client et branche et produit)' ;
      } else if((this.jour != '0' && this.jour !== '') && this.numPolice != 0 && this.numClient != 0 && this.numBranche != 0 && this.numProduit != 0 && this.numIntermediaire != 0) {
        this.onGetAllJournalProductionByPoliceAndClientAndBrancheAndProduitAndIntermediaire(this.jour, this.numPolice, this.numClient, this.numBranche, this.numProduit, this.numIntermediaire);
        this.title = 'Consultation journalier de la production (par police et client et branche et produit et intermédiaire)' ;
      } else {
        this.onGetAllJournalProduction();
        this.title = 'Consultation journalier de la production' ;
      }
      this.check = true ;
    }
  
    onReinitialiser() {
      this.brancheCtrl.setValue("") ;
      this.clientCtr.setValue("");
      this.policeCtr.setValue("");
  
      this.numBranche = 0 ;
      this.numClient = 0;
      this.numPolice = 0;
  
      this.problemeDate = false ;
      this.erreur = false ;
    }

    onExport(format: String) {
      let title = this.title.replace(/ /g, "_");
      let demandeur = this.demandeur.replace(/ /g, "_");
  
      if (format === 'pdf') {
        this.encaissementService.generateReportProductionJournalier(format, title, demandeur, this.jour, this.numPolice, this.numClient, this.numBranche, this.numProduit, this.numIntermediaire)
          .subscribe(event => {
            switch (event.type) {
              case HttpEventType.Sent:
                console.log('Request has been made!');
                break;
              case HttpEventType.ResponseHeader:
                console.log('Response header has been received!');
                break;
              case HttpEventType.UploadProgress:
                break;
              case HttpEventType.Response:
                saveAs(event.body, 'journal de production.pdf');
            }
          });
      }
  
      if (format === 'excel') {
        this.encaissementService.generateReportProductionJournalier(format, title, demandeur, this.jour, this.numPolice, this.numClient, this.numBranche, this.numProduit, this.numIntermediaire)
          .subscribe(event => {
            switch (event.type) {
              case HttpEventType.Sent:
                console.log('Request has been made!');
                break;
              case HttpEventType.ResponseHeader:
                console.log('Response header has been received!');
                break;
              case HttpEventType.UploadProgress:
                break;
              case HttpEventType.Response:
                saveAs(event.body, 'journal de production.xlsx');
            }
          });
      }
  
    }
}
