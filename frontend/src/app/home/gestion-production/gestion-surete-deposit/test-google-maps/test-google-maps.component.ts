import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-test-google-maps',
  templateUrl: './test-google-maps.component.html',
  styleUrls: ['./test-google-maps.component.scss']
})
export class TestGoogleMapsComponent implements OnInit {

  latitude = 51.678418;
  longitude = 7.809007;
  locationChose = false

  constructor() { }

  ngOnInit(): void {
  }

  onChoseLocation(event){
    console.log(event)
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    this.locationChose = true;
  }

}
