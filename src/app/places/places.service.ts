import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Te Kahu',
      'Wanaka, New Zealand',
      'https://news.airbnb.com/wp-content/uploads/sites/4/2019/06/PJM020719Q202_Luxe_WanakaNZ_LivingRoom_0264-LightOn_R1.jpg',
      400.99,
      new Date('2020-08-17'),
      new Date('2030-08-17'),
      'abc'
    ),
    new Place(
      'p2',
      'Casa Koko',
      'Punta Mita, Mexico',
      'https://news.airbnb.com/wp-content/uploads/sites/4/2019/06/PJM020719Q201_Luxe_PuntaMita_Palapa_0782_R1-1.jpg',
      500.99,
      new Date('2020-08-17'),
      new Date('2030-08-17'),
      'abc'
    ),
    new Place(
      'p3',
      'Chateau d’Estoublon',
      'Provence, France',
      'https://news.airbnb.com/wp-content/uploads/sites/4/2019/06/PJM020719Q203_Luxe_ProvenceFR_LivingRoom_0455_R1.jpg',
      400.99,
      new Date('2020-08-17'),
      new Date('2030-08-17'),
      'abc'
    ),
    new Place(
      'p4',
      'Vereda El Plan',
      'Antioquia, Colombia',
      'https://a0.muscache.com/im/pictures/c05b206b-2838-46b9-b683-68bb5573d72d.jpg',
      588.99,
      new Date('2020-08-17'),
      new Date('2030-08-17'),
      'abc'
    ),
    new Place(
      'p5',
      'Garderen',
      'Gelderland, Netherlands',
      'https://a0.muscache.com/im/pictures/6b510592-2a8f-4301-835b-e8fffafc627b.jpg',
      589.99,
      new Date('2020-08-17'),
      new Date('2030-08-17'),
      'abc'
    ),
    new Place(
      'p6',
      'Orderville',
      'Utah, United States',
      'https://a0.muscache.com/im/pictures/1b4f528f-4ef4-48c2-98e7-bef1d8d03d34.jpg',
      567.89,
      new Date('2020-08-17'),
      new Date('2030-08-17'),
      'abc'
    ),
  ]);

  constructor(private authService: AuthService) {}

  get places() {
    return this._places.asObservable();
  }

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((p) => p.id === id) };
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    availableFrom: Date,
    availableTo: Date
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://news.airbnb.com/wp-content/uploads/sites/4/2019/06/PJM020719Q201_Luxe_PuntaMita_Palapa_0782_R1-1.jpg',
      price,
      availableFrom,
      availableTo,
      this.authService.userId
    );
    this.places.pipe(take(1)).subscribe((places) => {
      this._places.next(places.concat(newPlace));
    });
  }
}
