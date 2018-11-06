import {
  Component,
  Input,
  ChangeDetectorRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { MapService } from './map.service';

// Subject replaces EventEmitter
import { Subject } from 'rxjs';

@Component({
  selector: 'bwm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  @Input()
  location: string;
  // location emitter
  @Input()
  locationSubject: Subject<any>;
  isPositionError: boolean = false;

  lat: number;
  lng: number;

  constructor(public mapService: MapService, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.locationSubject) {
      this.locationSubject.subscribe((newLocation: string) => {
        this.getLocation(newLocation);
      });
    }
  }

  ngOnDestroy() {
    if (this.locationSubject) {
      this.locationSubject.unsubscribe();
    }
  }

  getLocation(location) {
    this.mapService.getGeoLocation(location).subscribe(
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

  mapReadyHandler() {
    this.getLocation(this.location);
  }
}
