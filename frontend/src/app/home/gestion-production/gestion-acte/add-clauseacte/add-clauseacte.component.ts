import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Acte } from '../../../../model/Acte';
import { Clause } from '../../../../model/Clause';
import { ClauseActe } from '../../../../model/ClauseActe';
import { ActeService } from '../../../../services/acte.service';
import { ClauseService } from '../../../../services/clause.service';
import { ClauseacteService } from '../../../../services/clauseacte.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import type  from '../../../data/type.json';

@Component({
  selector: 'ngx-add-clauseacte',
  templateUrl: './add-clauseacte.component.html',
  styleUrls: ['./add-clauseacte.component.scss']
})
export class AddClauseacteComponent implements OnInit {

  clauseActes: Array<ClauseActe> = new Array<ClauseActe>();
  clauses: Array<Clause> = new Array<Clause>();
  clauseActe: ClauseActe;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  // tableau_fonctionnalite = [];
  @Input() types:any [] =type;
  addForm = this.fb.group({

    clact_numeroclause: ['',[Validators.required]],
    clact_numeroacte: [''],
    clact_texte1: ['',[Validators.required]],
    clact_texte2: [''],

    });
    listTypes: any [];
  numero_acte: any; 
  donnee: ClauseActe;
  tab = [];
  autorisations = [];

  //clauses: Array<Clause> = new Array<Clause>();

  public clausesCtrl: FormControl = new FormControl();
  
public clausesFilterCtrl: FormControl = new FormControl();

public filteredClauses: ReplaySubject<Clause[]> = new ReplaySubject<Clause[]>();

@ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

//dateSaisie: Date;
protected _onDestroy = new Subject<void>();

  /* public displayedColumns = ['clact_numeroclause','clact_type','clact_numlot', 'choix'];
  public dataSource = new MatTableDataSource<Clause>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; */
  

  // status: NbComponentStatus = 'info';

  constructor(private clauseActeService: ClauseacteService, private transfertData: TransfertDataService,
    private dialogService: NbDialogService, private router: Router,
    private toastrService: NbToastrService, private authService: NbAuthService,
    private fb: FormBuilder, private clauseService: ClauseService) { }

  ngOnInit(): void {
    
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisations = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisations);
      }

    });
   // this.onGetAllClausesNoActe();
   this.numero_acte=this.transfertData.getData();
   console.log(this.numero_acte);
   this.addForm.controls['clact_numeroacte'].setValue(this.numero_acte);
  this.onGetAllClause();
    this.clausesFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
     this.filterClauses();
    });

    this.listTypes=this.types['TYPE_CLAUSE'];

  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  protected filterClauses() {
    console.log(this.clauses.filter(cl => cl.cla_numeroclause));
    if (!this.clauses) {
      return;
    }
    // get the search keyword
    let search = this.clausesFilterCtrl.value;
    if (!search) {
      this.filteredClauses.next(this.clauses.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredClauses.next(

      this.clauses.filter(cl => cl.cla_numeroclause.toString()?.toLowerCase().indexOf(search) > -1       
      || this.onGetLibelleByType((cl.cla_type)?.toString())?.toLowerCase().indexOf(search) > -1
      )
      
    );
  }
  /* onGetAllClause() {
    this.clauseService.getAllClauses()
      .subscribe((data: Clause[]) => {
        this.clauses = data as Clause[];
        this.filteredClauses.next(this.clauses.slice());
        console.log(this.clauses);
      });
    } */
    onGetAllClause() {
      this.clauseService.getAllClausesNoAffectByActe(this.numero_acte)
        .subscribe((data: Clause[]) => {
            this.clauses = data as Clause[];
            this.filteredClauses.next(this.clauses.slice());
            console.log(this.clauses);
        });
    }
   
    onGetLibelleByType(type:String){​​​​​​​​
      //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)
         
       return  (this.listTypes.find(p=>p.id === type))?.value;       
         }​​​​​​​​
    submit() { 
      //this.addForm.controls['engag_datemodification'].setValue(new Date());
      
      this.addForm.controls['clact_numeroacte'].setValue(this.numero_acte);
      this.clauseActeService.addClauseActe(this.addForm.value)
      .subscribe((data) => {
        console.log(data);
        this.toastrService.show(
              data.message,
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
          this.transfertData.setData(this.numero_acte);
          this.router.navigateByUrl('home/gestion-acte');
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
      },
      );
        }
  // tslint:disable-next-line:use-lifecycle-interface
 /*  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onGetAllClausesNoActe() {
    this.clauseService.getAllClausesNoAffectByActe(this.numero_acte)
      .subscribe((data: Clause[]) => {
          this.clauses = data;
          this.dataSource.data = data as Clause[];
          console.log(this.clauses);
      });
  }


  open(dialog: TemplateRef<any>, clauseActe: ClauseActe) {
    this.dialogService.open(
      dialog,
      {
         context: clauseActe 
      });
       console.log(this.clauseActe);
  } 
  onAjout() {

    for (let i =0 ; i<this.tab.length ; i++){
      this.clauseActes.push(new ClauseActe (this.tab[i],this.numero_acte))
      console.log(this.tab[i]);
    }
    console.log(this.clauseActes);

    this.clauseActeService.addClause(this.clauseActes)
    .subscribe(() => {
      this.toastrService.show(
        'Clause Enregistré avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('home/gestion-acte');
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
        this.router.navigateByUrl('home/gestion-acte');
    },
    );
  } 

  onSelection_fonctionnalite(e, data) {

    if (e.target.checked) {
      this.tab.push(data);
    } else {

       let el = this.tab.findIndex(itm => itm === data);
        this.tab.splice((el), 1);
      // this.tableau_fonctionnalite.pop();
       console.log(el);
    }
    console.log(this.tab);

  } */
  onChangeClause(event) {

    this.addForm.controls['clact_numeroclause'].setValue(event.value);
    
    //this.addForm.controls['clact_texte1'].setValue((this.clauses.find(p => p.cla_numeroclause == event.value))?.clact_texteclause1);
    //this.addForm.controls['clact_texte2'].setValue((this.clauses.find(p => p.cla_numeroclause == event.value))?.clact_clact_texteclause2);
     
  }
  onChangeText1(event){
        
    this.addForm.controls['clact_texte1'].setValue(event.target.value);
  }
  onChangeText2(event){
        
    this.addForm.controls['clact_texte2'].setValue(event.target.value);
  }
  cancel(){
    this.router.navigateByUrl('home/gestion-acte');
  }
  onAnnuler() {
    this.transfertData.setData(this.numero_acte);
    this.router.navigateByUrl('home/gestion-acte');
    }

  /* check_fonct(fonct: String) {

    let el = this.tab.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  } */

  check_fonct(fonct: String) {

    let el = this.autorisations.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }
}
