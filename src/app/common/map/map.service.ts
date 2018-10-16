import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CamelizePipe } from 'ngx-pipes';

@Injectable()
export class MapService {
  public geoCoder;
  private locationCache: any = {};

  constructor(private camelizePipe: CamelizePipe) {}

  // = camelizing string
  private camelize(val: string): string {
    return this.camelizePipe.transform(val);
  }

  // = преобразование местоположения в объект с координатами
  private cacheLocation(location: string, coords: any) {
    this.locationCache[this.camelize(location)] = coords;
  }

  // = есть ли местоположение в кэше
  private isLocationCached(location: string): boolean {
    return this.locationCache[this.camelize(location)];
  }

  // = get location with Geocoder
  private geocodeLocation(location: string): Observable<any> {
    if (!this.geoCoder) {
      this.geoCoder = new (<any>window).google.maps.Geocoder();
    }

    return new Observable(observer => {
      this.geoCoder.geocode({ address: location }, (result, status) => {
        if (status === (<any>window).google.maps.GeocoderStatus.OK) {
          const geometry = result[0].geometry.location;
          const coordinates = { lat: geometry.lat(), lng: geometry.lng() };

          // caching coords and location
          this.cacheLocation(location, coordinates);

          observer.next(coordinates);
        } else {
          observer.error('Location could not be geocoded');
        }
      });
    });
  }

  // = получение широты и долготы из названия страны и города
  public getGeoLocation(location: string): Observable<any> {
    if (this.isLocationCached(location)) {
      return Observable.of(this.locationCache[this.camelize(location)]);
    } else {
      return this.geocodeLocation(location);
    }
  }
}
