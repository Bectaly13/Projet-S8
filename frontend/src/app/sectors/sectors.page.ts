import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter, IonInput, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';
import { StorageService } from '../services/storage.service';
import { DarkModeService } from '../services/dark-mode.service';
import { UpdateQuestionsDataService } from '../services/update-questions-data.service';

import { HeaderComponent } from '../header/header.component';

export interface Sector {
  sectorId: number;
  name: string;
}

@Component({
  selector: 'app-sectors',
  templateUrl: './sectors.page.html',
  styleUrls: ['./sectors.page.scss'],
  standalone: true,
  imports: [HeaderComponent, IonContent, CommonModule, FormsModule, IonInput, IonIcon]
})
export class SectorsPage implements ViewWillEnter {
  sectors!: Sector[];

  constructor(private message: MessageService,
              private error: ErrorService,
              private router: Router,
              private storage: StorageService,
              private darkmode: DarkModeService,
              private update: UpdateQuestionsDataService) { }

  ionViewWillEnter() {
    this.darkmode.init();

    this.message.sendMessage("getSectors", {}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.sectors = res.data;
        this.filteredSectors = [...res.data]; // ajouté pour menu déroulant
        console.log('Secteurs initialisés:', this.sectors);
        console.log('Secteurs filtrés initiaux:', this.filteredSectors);
      }
      else {
        this.sectors = [];
        this.error.errorMessage(res);
      }
    })
  }

  async goToDomains(index: number, sector: string) {
    this.update.updateQuestionsData(index);

    this.storage.set("sector_data", {
      sectorId: index,
      sector: sector
    });

    this.router.navigate(["domains"], {queryParams: {
      sectorId: index,
      sector: sector
    }});
  }



  /// Pour le menu déroulant


  dropdownOpen = false;
  searchQuery = '';
  filteredSectors: Sector[] = [];

  toggleDropdown() {
    this.dropdownOpen = true;
    this.filteredSectors = [...this.sectors]; // Réinitialise les secteurs filtrés
  }

  filterSectors() {
    const query = this.searchQuery.toLowerCase();
    this.filteredSectors = this.sectors.filter(sector =>
      sector.name.toLowerCase().includes(query)
    );
  }

  closeDropdown() {
    this.dropdownOpen = false;
    this.searchQuery = '';  // Réinitialiser la recherche si nécessaire
    this.filteredSectors = [...this.sectors];  // Réinitialiser la liste filtrée
  }
  clearSearch() {
    this.dropdownOpen = false;
    this.searchQuery = '';
    this.filteredSectors = [...this.sectors]; // Réinitialise les secteurs filtrés
  }


/// Pour une jolie MeP

handlePress(event: PointerEvent) {
  this.rippleEffect(event); // Appliquer l'effet ripple
  
  const button = event.currentTarget as HTMLElement;
  button.classList.add('bounce'); // Appliquer l'effet bounce
  
  setTimeout(() => {
    button.classList.remove('bounce'); // Supprimer l'effet bounce après 600ms
  }, 600);
}

rippleEffect(event: MouseEvent) {
  const button = event.currentTarget as HTMLElement;
  const ripple = document.createElement('span');
  
  const rect = button.getBoundingClientRect();
  const size = Math.max(button.offsetWidth, button.offsetHeight);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.position = 'absolute';
  ripple.style.borderRadius = '50%';
  ripple.style.backgroundColor = 'var(--ion-color-primary)';
  ripple.style.opacity = '0.2';
  ripple.style.transform = 'scale(0)';
  ripple.style.pointerEvents = 'none';
  ripple.style.transition = 'transform 1s ease-out, opacity 0.6s ease-out';
  
  ripple.classList.add('ripple');
  
  button.appendChild(ripple);
  
  requestAnimationFrame(() => {
    ripple.style.transform = 'scale(5)';
    ripple.style.opacity = '0';
  });
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}


}
