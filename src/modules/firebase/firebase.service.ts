import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import firebaseConfig from './config';
import { User } from '../user/entities/user.entity';

@Injectable()
export class FirebaseService {
  async sendToGeneral(title: string, message: string, resource_link?: string) {
    let messageData = {
      notification: {
        title,
        body: message ?? '',
      },

      data: {
        message,
        resource_link: resource_link ?? '',
        type: 'general',
        created_at: moment().format(),
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },

      android: {
        notification: {
          sound: 'default',
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
        },
      },

      topic: 'general',
    };

    // console.log("::::::::::::::::::::::", message)

    firebaseConfig
      .messaging()
      .send(messageData)
      .then((response) => {
        console.log('Notifications response:+++====>>> ', response);
      })
      .catch((error) => {
        console.log(error);
      });
    return;
  }

  async sendToUser(
    user: User,
    title: string,
    message: string,
    imageUrl?: string,
    resource_link?: string,
  ) {
    let registrationToken = user.deviceToken;

    const androidNotification: any = {
      sound: 'default',
      click_action: 'FLUTTER_NOTIFICATION_CLICK',
    };

    if (imageUrl) androidNotification.imageUrl = imageUrl;

    if (registrationToken) {
      let messageData = {
        notification: {
          title,
          body: message,
        },

        data: {
          message,
          resource_link: resource_link ?? '',
          type: 'individual',
          created_at: moment().format(),
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
        },

        android: {
          notification: androidNotification,
        },

        token: registrationToken,
      };
      // console.log(registrationToken);f
      firebaseConfig
        .messaging()
        .send(messageData)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log('Error sending message:', error);
        });
    }
    return;
  }

  async subscribeToTopic(registrationToken: string, topic: string) {
    firebaseConfig
      .messaging()
      .subscribeToTopic(registrationToken, topic)
      .then(function (response) {
        console.log('Successfully subscribed to topic:', response);
      })
      .catch(function (error) {
        console.log('Error subscribing to topic:', error);
      });
  }

  async unsubscribeToTopic(registrationToken: string, topic: string) {
    // console.log(registrationTokens);
    firebaseConfig
      .messaging()
      .unsubscribeFromTopic(registrationToken, topic)
      .then(function (response) {
        console.log('Successfully subscribed to topic:', response);
      })
      .catch(function (error) {
        console.log('Error subscribing to topic:', error);
      });
  }
}
