import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private _bookings: Booking[] = [
    {
      id: 'abc',
      placeId: 'p2',
      userId: 'u1',
      placeTitle: 'Casa Koko',
      guestNumber: 2,
    },
    {
      id: 'xyz',
      placeId: 'p3',
      userId: 'u2',
      placeTitle: 'Te Kahu',
      guestNumber: 3,
    },
  ];

  constructor() {}

  get bookings() {
    return [...this._bookings];
  }
}
