import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';

import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit {
  @ViewChild('map') mapElementRef: ElementRef;
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 37.75;
  lng = -122.41;

  constructor(
    private modalCtrl: ModalController,
    private renderer: Renderer2
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.getMapbox();
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  getMapbox() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat],
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('click', (e) => {
      //this.modalCtrl.dismiss(JSON.stringify(e.lngLat.wrap()), 'confirm');
      this.modalCtrl.dismiss(e.lngLat.wrap(), 'confirm');
    });

    this.map.on('load', () => {
      const mapEl = this.mapElementRef.nativeElement;
      this.renderer.addClass(mapEl, 'visible');
    });
  }

  // ngAfterViewInit() {
  //   this.getGoogleMap()
  //     .then((googleMaps) => {
  //       const mapEl = this.mapElementRef.nativeElement;
  //       const map = new googleMaps.Map(mapEl, {
  //         center: { lat: 23.84, lng: 324.89 },
  //         zoom: 16,
  //       });

  //       googleMaps.event.addListenerOnce(map, 'idle', () => {
  //         this.renderer.addClass(mapEl, 'visible');
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  // private getGoogleMap(): Promise<any> {
  //   const win = window as any;
  //   const googleModule = win.google;
  //   if (googleModule && googleModule.maps) {
  //     return Promise.resolve(googleModule.maps);
  //   }

  //   return new Promise((resolve, reject) => {
  //     const script = document.createElement('script');
  //     script.src =
  //       'https://maps.googleapis.com/maps/api/js?key=AIzaSyB9w91yxTSwnnFVRKUzaz4Hf0WBEaZPFL0';
  //     script.async = true;
  //     script.defer = true;
  //     document.body.appendChild(script);
  //     script.onload = () => {
  //       const loadedGoogleModule = win.google;
  //       if (loadedGoogleModule && loadedGoogleModule.maps) {
  //         resolve(loadedGoogleModule.maps);
  //       } else {
  //         reject('Google maps SDK not available');
  //       }
  //     };
  //   });
  // }
}
