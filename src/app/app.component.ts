import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor() {
    this.initPush();
  }

  initPush() {
    if (!Capacitor.isNativePlatform()) {
      console.warn('Push notifications not available on web.');
      return;
    }

    // Solicita permisos
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      }
    });

    // Token recibido
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('FCM Token:', token.value);
      // Aquí puedes guardar el token en tu backend o Firebase
    });

    // Error en el registro
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error registrando notificaciones', error);
    });

    // Notificación recibida mientras la app está abierta
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Notificación recibida', notification);
      alert(`${notification.title}\n${notification.body}`);
    });

    // Usuario tocó la notificación
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.log('Acción en notificación', notification.notification);
      // Aquí puedes navegar o tomar acción según la data
    });
  }
}
