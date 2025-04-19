import { google } from 'googleapis';
import { auth } from '../src/firebase/firebaseConfig';

export const schedule_meeting = async ({ date, time, topic }) => {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) {
      console.error('No authenticated user found.');
      return;
    }

    const firebaseToken = await currentUser.getIdToken();

    // Configure Google Calendar API client
    const calendar = google.calendar({ version: 'v3' });

    // Set the Firebase token as the authorization header
    const authClient = new google.auth.OAuth2();
    authClient.setCredentials({ access_token: firebaseToken });

    // Combine date and time into a single DateTime object
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1-hour meeting

    const event = {
      summary: topic,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Asia/Kolkata', // Updated to Indian time zone
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Asia/Kolkata', // Updated to Indian time zone
      },
      attendees: [
        { email: 'bob@example.com' },
        { email: 'alice@example.com' },
      ],
    };

    // Insert the event into the user's primary calendar
    const response = await calendar.events.insert({
      auth: authClient,
      calendarId: 'primary',
      resource: event,
    });

    console.log(`Meeting scheduled: ${response.data.htmlLink}`);
  } catch (error) {
    console.error('Error scheduling meeting:', error);
  }
}
