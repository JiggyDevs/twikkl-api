import { OnEvent } from '@nestjs/event-emitter';
import { PLUNK_SECRET_KEY, PLUNK_SEND_EMAIL_URL } from 'src/config';

export class PlunkEventListener {
  constructor() {}

  @OnEvent('send.plunkEmail', { async: true })
  async handlePlunkEmail(payload: {
    from?: string;
    to: string;
    subject: string;
    body: string;
  }) {
    try {
      console.log(
        '-----------------Mail gun listener triggered------------------',
      );
      const { from, to, subject, body } = payload;
      const apiBody = {
        to,
        subject,
        body,
        // from,
      };

      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PLUNK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiBody),
      };

      const mail = await fetch(PLUNK_SEND_EMAIL_URL, options)
        .then((response) => response.json())
        .then((response) => console.log(response))
        .catch((err) => console.error(err));
      console.log({ mail });
    } catch (error) {
      console.log({ error });
      return error;
    }
  }
}
