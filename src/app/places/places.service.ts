import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Te Kahu',
      'Wanaka, New Zealand',
      'https://news.airbnb.com/wp-content/uploads/sites/4/2019/06/PJM020719Q202_Luxe_WanakaNZ_LivingRoom_0264-LightOn_R1.jpg',
      400.99
    ),
    new Place(
      'p2',
      'Casa Koko',
      'Punta Mita, Mexico',
      'https://news.airbnb.com/wp-content/uploads/sites/4/2019/06/PJM020719Q201_Luxe_PuntaMita_Palapa_0782_R1-1.jpg',
      500.99
    ),
    new Place(
      'p3',
      'Chateau d’Estoublon',
      'Provence, France',
      'https://news.airbnb.com/wp-content/uploads/sites/4/2019/06/PJM020719Q203_Luxe_ProvenceFR_LivingRoom_0455_R1.jpg',
      400.99
    ),
  ];

  getPlaces() {
    return [...this._places];
  }

  getPlace(id: string) {
    return this._places.find((p) => p.id === id);
  }

  constructor() {}
}
