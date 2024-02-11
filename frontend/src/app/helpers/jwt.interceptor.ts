import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NbAuthService, NbAuthToken } from '@nebular/auth';
import { tap } from 'rxjs/operators';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    isLoggedIn: Boolean;
    token: any;

    constructor(private authService: NbAuthService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      this.authService.getToken()
      .subscribe((tokenn: NbAuthToken) => {
        if (tokenn.isValid()) {
          this.token = tokenn.getValue();
        }
        
      });

      // tslint:disable-next-line:no-console
        //console.log('interceptor');
        // tslint:disable-next-line:no-console
        
      if (this.token) {
            request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${this.token}`,
                },
            });
        }

        return next.handle(request);
    }
}
