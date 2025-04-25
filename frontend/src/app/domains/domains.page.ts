import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter, IonList, IonItem, IonButton, IonFooter } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';
import { SharedVariablesService } from '../services/shared-variables.service';

import { NavbarComponent } from '../navbar/navbar.component';

export interface Domain {
  domainId: number;
  name: string;
  isRelevant: boolean;
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

  mcqSize!: number;

  domains!: Domain[];

  constructor(private route: ActivatedRoute,
              private message: MessageService,
              private error: ErrorService,
              private router: Router,
              private variables: SharedVariablesService) { }

  ionViewWillEnter() {
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));

    this.mcqSize = this.variables.mcqSize.large;

    this.message.sendMessage("getDomains", {}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.domains = res.data;

        for(let domain of this.domains) {
          this.message.sendMessage("isDomainRelevant", {domainId: domain.domainId, sectorId: this.sectorId, mcqSize: this.mcqSize}).subscribe(res => {
            domain.isRelevant = res.data;
          })
        }
      }
      else {
        this.error.errorMessage(res);
      }
    })
  }

  goToChapters(index: number, domain: string) {
    this.router.navigate(["chapters"], {queryParams: {
      domainId: index,
      domain: domain,
      sectorId: this.sectorId,
      sector: this.sector
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

  handlePress(event: PointerEvent, domain: any) {
    this.rippleEffect(event, domain);
  
    const button = event.currentTarget as HTMLElement;
    button.classList.add('bounce');
  
    setTimeout(() => {
      button.classList.remove('bounce');
    }, 600); // durée de l'effet
  }
  
  rippleEffect(event: MouseEvent, domain: any) {
    const button = event.currentTarget as HTMLElement;
    const ripple = document.createElement('span');
  
    const bgColor = this.takeBgColor(domain.domainId);
  
    const rect = button.getBoundingClientRect();
    const size = Math.max(button.offsetWidth, button.offsetHeight);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
  
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = `var(${bgColor})`;
    ripple.style.opacity = '0.2';
    ripple.style.transform = 'scale(0)';
    ripple.style.pointerEvents = 'none';
    ripple.style.transition = 'transform 1s ease-out, opacity 0.6s ease-out';
  
    ripple.classList.add('ripple');
  
    button.appendChild(ripple);
  
    // Force le reflow pour démarrer l'animation
    requestAnimationFrame(() => {
      ripple.style.transform = 'scale(5)';
      ripple.style.opacity = '0';
    });
  
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /*
  showFadeTop = false;
  showFadeBottom = true;
  onScroll(event: CustomEvent) {
    const scrollTop = event.detail.scrollTop;
    const scrollHeight = event.detail.scrollHeight;
    const clientHeight = event.detail.offsetHeight;
    this.showFadeTop = scrollTop > 10;
    this.showFadeBottom = scrollTop + clientHeight < scrollHeight - 10;
    console.log('scroll', { scrollTop, scrollHeight, clientHeight });
    console.log('fades', { top: this.showFadeTop, bottom: this.showFadeBottom });
  }
  */
}
