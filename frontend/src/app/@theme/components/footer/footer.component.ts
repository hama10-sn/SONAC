import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Crée par <b><a href="https://jmadsolutions.sn" target="_blank">JMAD'Solutions</a></b> 2021
    </span><img src="../../../../assets/images/logo.jpg" height="50" width="170">
    
  `,
})
export class FooterComponent {
}
