import firstMeeting from '../../data/chapters/nu/firstMeeting.json';

// The first meeting section stays visible through the end of the meeting day
// and hides itself automatically starting the next morning.
export function isFirstMeetingUpcoming(now: Date = new Date()): boolean {
  const dayAfter = new Date(firstMeeting.date + 'T00:00:00');
  dayAfter.setDate(dayAfter.getDate() + 1);
  return now < dayAfter;
}

export { firstMeeting };
