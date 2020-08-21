import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  NavController,
  ModalController,
  ActionSheetController,
} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  private placeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placeService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.placeSub = this.placeService
        .getPlace(paramMap.get('placeId'))
        .subscribe((place) => {
          this.place = place;
        });
    });
  }

  onBookPlace() {
    //this.navCtrl.navigateBack('/places/tabs/discover');

    this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Random',
            icon: 'shuffle-outline',
            handler: () => {
              this.openBookingModal('random');
            },
          },
          {
            text: 'Select',
            icon: 'calendar-outline',
            handler: () => {
              this.openBookingModal('select');
            },
          },
          {
            text: 'Favorite',
            icon: 'heart',
            handler: () => {
              console.log('Favorite clicked');
            },
          },
          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            },
          },
        ],
      })
      .then((actionSheetEl) => actionSheetEl.present());
  }

  openBookingModal(mode: 'select' | 'random') {
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place, selectedMode: mode },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((res) => {
        console.log(res.data, res.role);
      });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
