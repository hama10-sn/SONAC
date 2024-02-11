import { Component, OnInit } from '@angular/core';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import dateFormatter from 'date-format-conversion';
import {
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  DAYS_OF_WEEK,
} from 'angular-calendar';
import { CustomDateFormatter } from './customDateFormatter';
import { RdvService } from '../../services/rdv.service';
import { Rdv } from '../../model/Rdv';
import { AjoutRdvComponent } from './ajout-rdv/ajout-rdv.component';
import { ModifRdvComponent } from './modif-rdv/modif-rdv.component';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { UserService } from '../../services/user.service';
import { User } from '../../model/User';
import { Router } from '@angular/router';
import { TransfertDataService } from '../../services/transfertData.service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};


@Component({
  selector: 'ngx-agenda',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class AgendaComponent  implements OnInit {

  ngOnInit(): void {
    //this.getUserCalendar();
    this.getUserCalendarAllByDirection()
    //this.onGetAllRdvs();
    //this.onGetAllRdvsCalendar();
   // console.log(this.events);

  }
  login: any;
  user: User;
  public displayedColumns = ['type', 'titre', 'date_deb', 'date_fin', 'dossier', 'update','email', 'delete'];
  public dataSource = new MatTableDataSource<Rdv>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

   // tslint:disable-next-line:use-lifecycle-interface
   ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  locale: string = 'fr';
  weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
       this.onGetRdv(event.id);
       console.log(this.recup);
       this.openModif(this.recup, this.recup.id_rdv);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
        this.onGetRdv2(event.id);
        this.onDeleteRdv(this.recup2.id_rdv);
      },
    },
  ];
  rdvs: Array<Rdv> = new Array<Rdv>();
  refresh: Subject<any> = new Subject();
 // events: CalendarEvent[] = [];

  // events: CalendarEvent[] = [
  //   {
  //     start: subDays(startOfDay(new Date()), 1),
  //     end: addDays(new Date(), 1),
  //     title: 'A 3 day event',
  //     color: colors.red,
  //     actions: this.actions,
  //     allDay: true,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: true,
  //   },
  //   {
  //     start: startOfDay(new Date()),
  //     title: 'An event with no end date',
  //     color: colors.yellow,
  //     actions: this.actions,
  //   },
  //   {
  //     start: subDays(endOfMonth(new Date()), 3),
  //     end: addDays(endOfMonth(new Date()), 3),
  //     title: 'A long event that spans 2 months',
  //     color: colors.blue,
  //     allDay: true,
  //   },
  //   {
  //     start: addHours(startOfDay(new Date()), 2),
  //     end: addHours(new Date(), 2),
  //     title: 'A draggable and resizable event',
  //     color: colors.yellow,
  //     actions: this.actions,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: true,
  //   },
  // ];

  activeDayIsOpen: boolean = true;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private rdvService: RdvService, private authService: NbAuthService, private userService: UserService,
    private dialogService: NbDialogService, private toastrService: NbToastrService,  private router: Router,
    private transfertData: TransfertDataService) {}



  events: CalendarEvent[] = [
    // {
    //   start: subDays(startOfDay(new Date()), 1),
    //   end: addDays(new Date(), 1),
    //   title: 'A 3 day event',
    //   color: colors.red,
    //   actions: this.actions,
    //   allDay: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   },
    //   draggable: true,
    // },

  ];
  c: any;
  onGetAllRdvsCalendar() {

    for (let i = 0; i < this.rdvs.length; i++) {
     if (this.rdvs[i].type === 'RDV')
       this.c = colors.yellow;
       else
       this.c = colors.blue;
      this.events.push(

        {
          id: this.rdvs[i].id_rdv,
          start: new Date(this.rdvs[i].date_deb),
          end: new Date(this.rdvs[i].date_fin),
          title: this.rdvs[i].titre,
          color: this.c,
          actions: this.actions,
         // allDay: true,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: true,
        },
      );
      this.refresh?.next();

   }
   //console.log(this.events);
 }





  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
newDatedeb: Date;
newDatefin: Date;
drag: Rdv;
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        this.newDatedeb = newStart;
        this.newDatefin = newEnd;
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }

      console.log(newStart);
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
    console.log(this.newDatedeb + 'ttt' + this.newDatefin);
    this.onGetRdv(event.id);
    this.drag = new Rdv(this.recup.id_rdv, this.recup.lieu, this.newDatedeb, this.newDatefin,
      this.recup.comment_agent, this.recup.comment_client, this.recup.id_agent, this.recup.id_client,
      this.recup.color, this.recup.titre, this.recup.nbre, this.recup.unite, this.recup.type);

      this.rdvService.updateRdv(this.drag, this.recup.id_rdv)
    .subscribe(() => {
      this.toastrService.show(
        'rdv modifié avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
       //this.getUserCalendar();
       this.getUserCalendarAllByDirection();
    },
      (error) => {
        console.log(error);
        this.toastrService.show(
          'une erreur est survenue',
          'Notification',
          {
            status: this.statusFail,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
          //this.getUserCalendar();
          this.getUserCalendarAllByDirection();
      },
    );

  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    //this.dialogService.open(this.modalContent /*, { size: 'lg' }*/ );
   // console.log(event);
    this.onGetRdv(event.id);
    console.log(this.recup);
    //this.openModif(this.recup, this.recup.id_rdv);
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);

  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  /*onGetAllRdvs() {
    this.events = [];
    this.rdvService.getAllRdvs()
      .subscribe((data: Rdv[]) => {
          this.rdvs = data;
          this.dataSource.data = data as Rdv[];
          //console.log(this.rdvs);
          this.onGetAllRdvsCalendar();
      });
  }*/

  openMail(){
    this.router.navigateByUrl('home/agenda/mail');
  }

  openAjout() {
    this.router.navigateByUrl('home/agenda/ajout');
    // this.dialogService.open(AjoutRdvComponent)
    // .onClose.subscribe(data => data && this.rdvService.addRdv(data)
    // .subscribe(() => {
    //   this.toastrService.show(
    //     'RDV enregistré avec succes !',
    //     'Notification',
    //     {
    //       status: this.statusSuccess,
    //       destroyByClick: true,
    //       duration: 300000,
    //       hasIcon: true,
    //       position: this.position,
    //       preventDuplicates: false,
    //     });
    //    this.getUserCalendar();
    // },
    // (error) => {
    //   this.toastrService.show(
    //     'une erreur est survenue',
    //     'Notification',
    //     {
    //       status: this.statusFail,
    //       destroyByClick: true,
    //       duration: 300000,
    //       hasIcon: true,
    //       position: this.position,
    //       preventDuplicates: false,
    //     });
    //     this.getUserCalendar();
    // },
    // ));
  }

  openModif(rdv: Rdv, id) {

    this.transfertData.setData(rdv);
    this.router.navigateByUrl('home/agenda/modif');
   /* this.dialogService.open(ModifRdvComponent, {
        context: {
          rdv: rdv,
        },
      })
    .onClose.subscribe(data => data && this.rdvService.updateRdv(data, id)
    .subscribe(() => {
      this.toastrService.show(
        'rdv modifié avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
       this.getUserCalendar();
    },
      (error) => {
        console.log(error);
        this.toastrService.show(
          'une erreur est survenue',
          'Notification',
          {
            status: this.statusFail,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
          this.getUserCalendar();
      },
    ));*/
  }


  recup: Rdv;
  recup2: Rdv;
  onGetRdv(id) {
      this.recup = this.rdvs.find(itm => itm.id_rdv === id);
      return this.recup;
  }

  onGetRdv2(id) {
    this.recup2 = this.rdvs.find(itm => itm.id_rdv === id);
    return this.recup2;
}

  onDeleteRdv(id: number) {
    this.rdvService.deleteRdv(id)
      .subscribe(() => {
        this.toastrService.show(
          'RDV supprimé avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });

          //this.getUserCalendar();
          this.getUserCalendarAllByDirection();
      });
  }
  open(dialog: TemplateRef<any>, rdv: Rdv) {

    this.dialogService.open(
      dialog,
      { context: rdv });
  }

  getUserCalendar(): any {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.login = token.getPayload();
          this.userService.getUser(this.login.sub)
      .subscribe((data: User) => {
        this.user = data;
        console.log(this.user);

        this.events = [];
    this.rdvService.getRdvByCodeAgent(this.user.util_numero)
      .subscribe((data2: Rdv[]) => {
          this.rdvs = data2;
          this.dataSource.data = data2 as Rdv[];
          //console.log(this.rdvs);
          this.onGetAllRdvsCalendar();
      });

      });
        }
      });
  }



  //All users by direction begin

 users:User[]
 nomPrenom;
  getUserCalendarAllByDirection(): any {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.login = token.getPayload();
          this.userService.getUser(this.login.sub)
      .subscribe((data: User) => {
        this.user = data;
        console.log(this.user);

        
     //all rdv by direction begin
    if(this.user.util_profil=="directeur"){
      
      this.userService.getAllByDirection(this.user.util_direction)
      .subscribe((data3: User[]) => {
        
          this.users = data3;
          
          
          this.users.forEach(userd=>{
            
            this.rdvService.getRdvByCodeAgent(userd.util_numero)
            .subscribe((data2: Rdv[]) => {
                this.events = [];
                this.rdvs=[ ...this.rdvs, ...data2];
                this.onGetAllRdvsCalendar();
                this.dataSource.data = this.rdvs as Rdv[];
                this.nomPrenom = userd.util_prenom+" "+userd.util_nom;
              
                
            });
            
          })
         
      });
    }
    else{
     //all rdv by direction end
     this.events = [];

    this.rdvService.getRdvByCodeAgent(this.user.util_numero)
      .subscribe((data2: Rdv[]) => {
          this.rdvs = data2;
          this.dataSource.data = data2 as Rdv[];
          console.log(this.rdvs);
          this.onGetAllRdvsCalendar();
      });
    }

      });
        }
      });
  }



  //All user by direction end









  check_Date(datef: Date) {
  //console.log(dateFormatter(datef, 'yyyy-MM-ddThh:mm') < dateFormatter(new Date(), 'yyyy-MM-ddThh:mm'));
    if (dateFormatter(datef, 'yyyy-MM-ddThh:mm') < dateFormatter(new Date(), 'yyyy-MM-ddThh:mm'))
     return true;
    else
     return false;

  }

  openDossier(rdv) {
    console.log(rdv);
    this.transfertData.setData(rdv);
    this.router.navigateByUrl('/home/dossier-agenda');
  }

}
