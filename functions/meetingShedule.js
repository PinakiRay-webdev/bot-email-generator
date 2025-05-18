export const schedule_meeting = async ({ date, time, topic, attendees }) => {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) {
      console.error('No authenticated user found.');
      return;
    }

    const firebaseToken = await currentUser.getIdToken();
    const calendar = google.calendar({ version: 'v3' });
    const authClient = new google.auth.OAuth2();
    authClient.setCredentials({ access_token: firebaseToken });

    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    const event = {
      summary: topic,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      attendees: attendees.map(email => ({ email })),
      // attendees : {
      //   email : "pinaki.mongodb@gmail.com"
      // }
    };

    const response = await calendar.events.insert({
      auth: authClient,
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all',
    });

    console.log(`Meeting scheduled: ${response.data.htmlLink}`);
  } catch (error) {
    console.error('Error scheduling meeting:', error);
  }
}