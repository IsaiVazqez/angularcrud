import { Component, OnInit } from '@angular/core';
import { faDashboard, faChartPie,
  faBox,
  faUsers,
  faClipboardList,
  faExchangeAlt,
  faEnvelope,
  faUserCircle,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{
  menuActive = false;
  faDashboard = faDashboard;
  faChartPie = faChartPie;
  faBox = faBox;
  faUsers = faUsers;
  faClipboardList = faClipboardList;
  faExchangeAlt = faExchangeAlt;
  faEnvelope = faEnvelope;
  faUserCircle = faUserCircle;
  faShoppingCart = faShoppingCart;
  isSmallScreen = false;

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }
  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.checkScreenSize());
  }

  toggleMenu() {
    console.log('toggleMenu');
    this.menuActive = !this.menuActive;
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 768; // Ajusta el valor según tus necesidades
  }

}
