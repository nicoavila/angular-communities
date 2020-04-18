import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'ngcommunity-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @Output() community: EventEmitter<any> = new EventEmitter();
  @Input() communities = {}; // TODO

  markers = [];
  zoom = 11;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 4,
  };
  infoContent = '';

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.addCommunities();
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      this.center = {
        lat: coords.latitude,
        lng: coords.longitude,
      };
    });
  }
  zoomIn() {
    if (this.zoom < this.options.maxZoom) {
      this.zoom++;
    }
  }

  zoomOut() {
    if (this.zoom > this.options.minZoom) {
      this.zoom--;
    }
  }

  addCommunities() {
    const communities = Object.entries(this.communities) as any;
    for (const [name, community] of communities) {
      this.markers.push({
        community,
        position: community.position,
        /* label: {
          color: 'red',
          text: name,
        }, */
        title: name,
        options: {
          animation: google.maps.Animation.BOUNCE,
          icon: {
            url: `assets/images/${community.id}.png`,
            scaledSize: { height: 48, width: 48 },
          },
        },
      });
    }
  }

  openInfo(marker: MapMarker) {
    const community = this.communities[marker.getTitle()];
    this.community.emit(community);
  }
}