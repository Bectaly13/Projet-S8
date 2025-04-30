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
  sectorId!: number;
  sector!: string;

  constructor(private router: Router,
              private route: ActivatedRoute) { }

  goToDomains() {
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));

    this.router.navigate(["domains"], {queryParams: {
      sectorId: this.sectorId,
      sector: this.sector
    }})
  }

  goToStats() {
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));

    this.router.navigate(["stats"], {queryParams: {
      sectorId: this.sectorId,
      sector: this.sector
    }})
  }

  goToOptions() {
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));
    
    this.router.navigate(["options"], {queryParams: {
      sectorId: this.sectorId,
      sector: this.sector
    }})
  }

}
