import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { MapModalComponent } from '../../map-modal/map-modal.component';
import { environment } from '../../../../environments/environment';
import { PlaceLocation } from '../../../places/location.model';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  selectedLocationImage: string;
  isLoading = false;

  constructor(private modalCtrl: ModalController, private http: HttpClient) {}

  ngOnInit() {}

  getAddress(lat: number, lng: number) {
    return this.http
      .get<any>(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${environment.mapbox.accessToken}`
      )
      .pipe(
        map((geoData) => {
          if (!geoData || geoData.features.length === 0) {
            return null;
          }
          return geoData.features[0].place_name;
        })
      );
  }

  getStaticMapImageUrl(lat: number, lng: number, zoom: number) {
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lng},${lat},${zoom},0/500x300?access_token=${environment.mapbox.accessToken}`;
  }

  onPickLocation() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
      })
      .then((modalEl) => {
        modalEl.present();

        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
          console.log(modalData.data.lat, modalData.data.lng);
          const pickedLocation: PlaceLocation = {
            lat: modalData.data.lat,
            lng: modalData.data.lng,
            address: null,
            staticMapImageUrl: null,
          };
          this.isLoading = true;
          this.getAddress(modalData.data.lat, modalData.data.lng)
            .pipe(
              switchMap((address) => {
                console.log(address);
                pickedLocation.address = address;
                return of(
                  this.getStaticMapImageUrl(
                    pickedLocation.lat,
                    pickedLocation.lng,
                    14
                  )
                );
              })
            )
            .subscribe((staticImageUrl) => {
              console.log(staticImageUrl);
              pickedLocation.staticMapImageUrl = staticImageUrl;
              this.selectedLocationImage = staticImageUrl;
              this.isLoading = false;
            });
        });
      });
  }
}
