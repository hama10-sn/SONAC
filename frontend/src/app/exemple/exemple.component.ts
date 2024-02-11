import { Component, OnInit } from '@angular/core';
import { NbAuthService, NbAuthToken } from '@nebular/auth';
import { TestService } from '../services/test.service';

@Component({
  selector: 'ngx-exemple',
  templateUrl: './exemple.component.html',
  styleUrls: ['./exemple.component.scss']
})
export class ExempleComponent implements OnInit {
  //token: any; 
  res: any;

  constructor(private testService: TestService, private authService: NbAuthService) { 
    authService.getToken() 
      .subscribe((tokenn: NbAuthToken) => {
         // this.token = tokenn.getValue();
      });
  }


  message() {
    this.testService.getMessage()
      .subscribe((data: any) => {
        this.res = data;
      });
  }

   ngOnInit(): void {
  }

}
