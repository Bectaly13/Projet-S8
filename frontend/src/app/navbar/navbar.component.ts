import { Component } from '@angular/core';
import { IonButtons, IonButton, IonFooter, IonToolbar } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [IonButtons, IonButton, IonFooter, IonToolbar]
})
export class NavbarComponent {
  sector: string = String(this.route.snapshot.queryParamMap.get("sector"));
  sectorId: number = Number(this.route.snapshot.queryParamMap.get("sectorId"));

  constructor(private router: Router,
              private route: ActivatedRoute) { }

  goToDomains() {
    this.router.navigate(["domains"], {queryParams: {
      sectorId: this.sectorId,
      sector: this.sector
    }})
  }

  goToStats() {
    this.router.navigate(["stats"], {queryParams: {
      sectorId: this.sectorId,
      sector: this.sector
    }})
  }

  goToOptions() {
    this.router.navigate(["options"], {queryParams: {
      sectorId: this.sectorId,
      sector: this.sector
    }})
  }

}
