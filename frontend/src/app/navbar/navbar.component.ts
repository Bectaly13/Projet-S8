import { Component } from '@angular/core';
import { IonButtons, IonButton, IonFooter, IonToolbar, IonIcon } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [IonButtons, IonButton, IonFooter, IonToolbar, IonIcon]
})
export class NavbarComponent {
  sectorId!: number;
  sector!: string;

  get currentRoute(): string {
    return this.router.url;
  }

  constructor(private router: Router,
              private route: ActivatedRoute) { }

  isActive(path: string): boolean {
    // cette méthode permet d'afficher en surbrillance le bouton de la page que l'on est en train de consulter
    const url = this.router.url.split('?')[0];
    const segments = url.split('/').filter(Boolean);
    return segments[0] === path.replace('/', '');
  }

  // les méthodes suivantes sont des méthodes de navigation

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
