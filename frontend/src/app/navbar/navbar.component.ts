import { Component, OnInit } from '@angular/core';
import { IonButtons, IonButton } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [IonButtons, IonButton]
})
export class NavbarComponent implements OnInit {
  sector!: string;
  sectorId!: number;

  constructor(private router: Router,
              private route: ActivatedRoute) { }
  
  ngOnInit() {
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    console.log("ngoninit");
  }

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

  goToFAQ() {
    this.router.navigate(["faq"], {queryParams: {
      sectorId: this.sectorId,
      sector: this.sector
    }})
  }

}
