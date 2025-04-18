import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-view-sesion',
  templateUrl: './view-sesion.component.html',
  styleUrls: ['./view-sesion.component.scss'],
  imports:[IonicModule]
})
export class ViewSesionComponent  implements OnInit {

  route = inject(Router);
  constructor() { }

  ngOnInit() {}

  gotoLogIn(){
    this.route.navigate(['/login']);
  }

  gotoRegister(){
    this.route.navigate(['/register']);
  }

}
