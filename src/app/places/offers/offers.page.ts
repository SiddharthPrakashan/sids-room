import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[];
  private placesSub: Subscription;

  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe((places) => {
      this.offers = places;
    });
  }

  onFavorite(slidingItem: IonItemSliding) {
    slidingItem.close();
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
    slidingItem.close();
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
