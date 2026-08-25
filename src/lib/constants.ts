export const EVENT = {
  name: 'HACK ASCENSION',
  year: '2026',
  tagline: 'Innovate, Code & Ascend',
  date: 'September 3, 2026',
  dateISO: '2026-09-03T09:30:00',
  time: '9:30 AM – 4:30 PM',
  venue: 'Amriteshwari Hall',
  participants: 'First-Year B.Tech. Students',
  registrationDeadline: 'August 31, 2026',
  registrationDeadlineISO: '2026-08-31T23:59:59',
  org: 'ACM Student Chapter',
  school: 'School of Computing',
  university: 'Amrita Vishwa Vidyapeetham, Nagercoil',
} as const;

export const REGISTRATION_URL = 'https://forms.gel/PLACEHOLDER'; // Replace with real registration link

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Event', to: '/event' },
  { label: 'Journey', to: '/journey' },
  { label: 'Schedule', to: '/schedule' },
  { label: 'Coordinators', to: '/coordinators' },
] as const;

export const JOURNEY_STAGES = [
  { num: '01', title: 'Learn', desc: 'Build your foundation. Discover new technologies and concepts.' },
  { num: '02', title: 'Practice', desc: 'Turn knowledge into skill through engaging challenges.' },
  { num: '03', title: 'Build', desc: 'Create something meaningful. Transform ideas into solutions.' },
  { num: '04', title: 'Grow', desc: 'Expand your capabilities, creativity and confidence.' },
  { num: '05', title: 'Succeed', desc: 'Challenge yourself and showcase what you can accomplish.' },
  { num: '06', title: 'Ascend', desc: 'Take your next step into the world of technology.' },
] as const;

export const HIGHLIGHTS = [
  { title: 'Learn', desc: 'Build a strong foundation and discover new possibilities.', icon: 'GraduationCap' },
  { title: 'Practice', desc: 'Turn concepts into practical skills through engaging challenges.', icon: 'Dumbbell' },
  { title: 'Build', desc: 'Create, experiment and transform ideas into working solutions.', icon: 'Hammer' },
  { title: 'Grow', desc: 'Develop technical ability, creativity and confidence.', icon: 'TrendingUp' },
  { title: 'Succeed', desc: 'Challenge yourself and showcase what you can accomplish.', icon: 'Trophy' },
  { title: 'Ascend', desc: 'Take your first major step into the world of technology.', icon: 'Rocket' },
] as const;

export const SCHEDULE = [
  { time: '09:30 AM', title: 'Registration & Welcome', desc: 'Check-in and opening welcome.' },
  { time: '10:00 AM', title: 'Opening Session', desc: 'Introduction to the event and its vision.' },
  { time: '10:30 AM', title: 'Technical Session', desc: 'Core computing and technology concepts.' },
  { time: '12:00 PM', title: 'Interactive Challenge', desc: 'Hands-on problem-solving activity.' },
  { time: '01:00 PM', title: 'Lunch Break', desc: 'Refresh and recharge.' },
  { time: '02:00 PM', title: 'Innovation / Coding Activities', desc: 'Collaborative building and coding.' },
  { time: '03:30 PM', title: 'Final Challenge & Interaction', desc: 'Capstone challenge and discussion.' },
  { time: '04:15 PM', title: 'Closing & Recognition', desc: 'Wrap-up and acknowledgment of participants.' },
  { time: '04:30 PM', title: 'Event Ends', desc: 'Conclusion of Hack Ascension 2026.' },
] as const;

export const STUDENT_COORDINATORS = [
  { name: 'Shaik Mohammad Abubakar Siddiq', role: 'III B.Tech. CSE C' },
  { name: 'Gowtham Suresh', role: 'III B.Tech. AID' },
  { name: 'Mahalakshmi R', role: 'II B.Tech. CSE B' },
] as const;

export const FACULTY_COORDINATORS = [
  { name: 'Mrs. Jothi Lakshmi S L', role: 'Asst. Prof., Dept. of AID' },
  { name: 'Mrs. Saiithra S', role: 'Asst. Prof., Dept. of CSE' },
] as const;

export const INTEREST_AREAS = [
  'Web Development',
  'Artificial Intelligence',
  'Machine Learning',
  'Cybersecurity',
  'Data Science',
  'App Development',
  'Programming',
  'Other',
] as const;
