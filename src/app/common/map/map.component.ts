import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { MapService } from './map.service';

@Component({
  selector: 'bwm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  @Input()
  location: string;
  isPositionError: boolean = false;

  lat: number;
  lng: number;

  constructor(public mapService: MapService, private ref: ChangeDetectorRef) {}

  mapReadyHandler() {
    this.mapService.getGeoLocation(this.location).subscribe(
      coords => {
        this.lat = coords.lat;
        this.lng = coords.lng;
        // = следить за обновлениями переменных
        this.ref.detectChanges();
      },
      err => {
        this.isPositionError = true;
        this.ref.detectChanges();
      }
    );
  }
}
