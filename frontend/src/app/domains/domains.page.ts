import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter, IonList, IonItem, IonButton, IonFooter } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';

import { NavbarComponent } from '../navbar/navbar.component';

export interface Domain {
  domainId: number;
  name: string;
  imageName: string;
}

@Component({
  selector: 'app-domains',
  templateUrl: './domains.page.html',
  styleUrls: ['./domains.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonButton, IonFooter, NavbarComponent]
})
export class DomainsPage implements ViewWillEnter {
  sectorId!: number;
  sector!: string;

  domains!: Domain[];

  constructor(private route: ActivatedRoute,
              private message: MessageService,
              private error: ErrorService,
              private router: Router) { }

  ionViewWillEnter() {
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));

    this.message.sendMessage("getDomains", {}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.domains = res.data;
      }
      else {
        this.error.errorMessage(res);
      }
    })
  }

  goToChapters(index: number, domain: string, imageName: string) {
    this.router.navigate(["chapters"], {queryParams: {
      domainId: index,
      domain: domain,
      sectorId: this.sectorId,
      imageName: imageName
    }});
  }

  goToSectors() {
    this.router.navigate(["sectors"]);
  }



  // Fonctions pour les styles css

  //gère la couleur des domaines
  takeBgColor(domainId: number): string {
    const index = domainId % 23 || 1;
    return `--ion-color-color${index}`;
  }

  // Vérifie la taille de la fenêtre
  isWideScreen = window.innerWidth > 500;
  @HostListener('window:resize')
  onResize() {
    this.isWideScreen = window.innerWidth > 500;
  }

  rippleEffect(event: MouseEvent, domain: any) {
    // Crée l'effet du ripple
    this.triggerRipple(event, domain);  // Appelle la fonction pour le ripple
  }
  
  triggerRipple(event: MouseEvent, domain: any) {
    const button = event.target as HTMLElement;
    const ripple = document.createElement('span');
    
    // Récupère la couleur dynamique du color-dot
    const bgColor = this.takeBgColor(domain.domainId);
  
    // Détermine la taille du ripple
    const rect = button.getBoundingClientRect();
    const size = Math.max(button.offsetWidth, button.offsetHeight);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
  
    // Applique la taille et la position au ripple
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
  
    // Applique la couleur de fond dynamique avec une opacité de 0.1
    ripple.style.backgroundColor = `${bgColor}10`;  // Opacité 0.1
  
    ripple.classList.add('ripple');
  
    // Ajoute le ripple au bouton
    button.appendChild(ripple);
  
    // Retirer l'élément après l'animation
    setTimeout(() => {
      ripple.remove();
    }, 600); // Retirer après 600ms
  }


  // showFadeTop = false;
  // showFadeBottom = true;

  // onScroll(event: CustomEvent) {
  //   const scrollTop = event.detail.scrollTop;
  //   const scrollHeight = event.detail.scrollHeight;
  //   const clientHeight = event.detail.offsetHeight;

  //   this.showFadeTop = scrollTop > 10;
  //   this.showFadeBottom = scrollTop + clientHeight < scrollHeight - 10;

  //   console.log('scroll', { scrollTop, scrollHeight, clientHeight });
  //   console.log('fades', { top: this.showFadeTop, bottom: this.showFadeBottom });
    
  // }
}
