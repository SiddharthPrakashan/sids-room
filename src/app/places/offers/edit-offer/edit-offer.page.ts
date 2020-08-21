import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  private placeSub: Subscription;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placeService: PlacesService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeSub = this.placeService
        .getPlace(paramMap.get('placeId'))
        .subscribe((place) => {
          this.place = place;
          this.form = new FormGroup({
            title: new FormControl(this.place.title, {
              updateOn: 'blur',
              validators: [Validators.required],
            }),
            description: new FormControl(this.place.description, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(180)],
            }),
            price: new FormControl(this.place.price, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(1)],
            }),
          });
        });
    });
  }

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
