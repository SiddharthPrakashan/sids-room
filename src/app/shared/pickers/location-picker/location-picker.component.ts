import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {
  ModalController,
  ActionSheetController,
  AlertController,
} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Plugins, Capacitor } from '@capacitor/core';

import { MapModalComponent } from '../../map-modal/map-modal.component';
import { environment } from '../../../../environments/environment';
import { PlaceLocation, Coordinates } from '../../../places/location.model';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  selectedLocationImage: string;
  selectedLocationAddress: string;
  isLoading = false;
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  @Input() showPreview = false;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  private getAddress(lat: number, lng: number) {
    return this.http
      .get<any>(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${environment.mapbox.accessToken}`
      )
      .pipe(
        map((geoData) => {
          if (!geoData || geoData.features.length === 0) {
            return null;
          }
          console.log(geoData.features[0].place_name);
          this.selectedLocationAddress = geoData.features[0].place_name;
          return geoData.features[0].place_name;
        })
      );
  }

  private getStaticMapImageUrl(lat: number, lng: number, zoom: number) {
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-l+000(${lng},${lat})/${lng},${lat},${zoom},0/500x300?access_token=${environment.mapbox.accessToken}`;
  }

  private openMap() {
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
          const coordinates: Coordinates = {
            lat: modalData.data.lat,
            lng: modalData.data.lng,
          };
          this.createPlace(coordinates.lat, coordinates.lng);
        });
      });
  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }
    this.isLoading = true;
    Plugins.Geolocation.getCurrentPosition()
      .then((geoPosition) => {
        const coordinates: Coordinates = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude,
        };
        console.log(coordinates);
        this.createPlace(coordinates.lat, coordinates.lng);
        this.isLoading = false;
      })
      .catch((err) => {
        console.log(err);
        this.showErrorAlert();
      });
  }

  private showErrorAlert() {
    this.alertCtrl
      .create({
        header: 'Could not load location',
        message: 'Please use Pick Map option',
        buttons: [
          {
            text: 'Okay',
            handler: () => {
              this.onPickLocation();
            },
          },
        ],
      })
      .then((alertEl) => alertEl.present());
  }

  private createPlace(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = {
      lat: lat,
      lng: lng,
      address: null,
      staticMapImageUrl: null,
    };
    this.isLoading = true;
    this.getAddress(lat, lng)
      .pipe(
        switchMap((address) => {
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
        this.locationPick.emit(pickedLocation);
      });
  }

  onPickLocation() {
    this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Auto Locate',
            handler: () => {
              this.locateUser();
            },
          },
          {
            text: 'Pick on Map',
            handler: () => {
              this.openMap();
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }
}
