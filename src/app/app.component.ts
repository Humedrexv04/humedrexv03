import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import {
  PushNotifications,
  Token,
  ActionPerformed,
  PermissionStatus,
  PushNotificationSchema
} from '@capacitor/push-notifications';

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
      console.warn('🚫 Push notifications not available on web.');
      return;
    }

    // Solicita permisos para notificaciones
    PushNotifications.requestPermissions().then((result: PermissionStatus) => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        console.warn('🔕 Permisos denegados para notificaciones push.');
      }
    });

    // Token recibido correctamente
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('✅ FCM Token:', token.value);
      // Aquí puedes guardar el token en Firebase o backend
    });

    // Error en el registro
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('❌ Error registrando notificaciones:', error);
    });

    // Notificación recibida mientras app está en primer plano
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('📩 Notificación recibida:', notification);
      alert(`${notification.title}\n${notification.body}`);
    });

    // Usuario hizo clic en una notificación
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.log('👆 Acción en notificación:', notification.notification);
      // Aquí podrías hacer navegación o manejar data
    });
  }
}
