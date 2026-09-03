// Initial project-management information for projects where the current state is known.
// Anything changed with Edit details in the web app overrides these defaults on that device.
export const projectDefaults = {
  'student-evidence-commercial': {
    status: 'Production', hosting: 'AWS', database: 'RDS', priority: 'High',
    lastWorkedOn: '2026-09-03',
    notes: 'Primary Student Evidence production application. AWS Lightsail + RDS. Continue monitoring SES, AI review and iPad workflows.'
  },
  'pracpath-mentor-pst': {
    status: 'Development', hosting: 'Vercel', database: 'Neon', priority: 'High',
    lastWorkedOn: '2026-08-31',
    notes: 'PracPath mentor/prac-student platform. Keep Neon for now; AWS migration planned. Expand discipline templates beyond teaching.'
  },
  'kofta-delights': {
    status: 'Development', hosting: 'Vercel', database: 'none', priority: 'Normal',
    lastWorkedOn: '2026-08-30', live: 'https://kofta-delights.vercel.app',
    notes: 'Client food-stall application. Finalise menu, allergen information, payments and operating workflow before AWS migration.'
  },
  'small-job-tracker': {
    status: 'Development', hosting: 'Other', database: 'none', priority: 'Normal',
    lastWorkedOn: '2026-08-30',
    notes: 'Small-job workflow and cost tracker. Security remediation and AWS migration remain to be completed.'
  },
  'friends-hot-50': {
    status: 'Production', hosting: 'AWS', database: 'none', priority: 'Normal',
    lastWorkedOn: '2026-08-28',
    notes: 'Live Spotify countdown application running on AWS with PM2/Nginx.'
  },
  'fishfinder-helper': {
    status: 'Production', hosting: 'Vercel', database: 'none', priority: 'Low',
    lastWorkedOn: '2026-08-14'
  },
  'eduappsplus_website': {
    status: 'Production', hosting: 'Vercel', database: 'none', priority: 'High',
    lastWorkedOn: '2026-08-30',
    notes: 'Public EDU Apps Plus marketing and enquiry website.'
  },
  'year9-digital-semester-guide': {
    status: 'Production', hosting: 'AWS', database: 'none', priority: 'High',
    lastWorkedOn: '2026-09-02',
    notes: 'Year 9 Digital Technologies semester guide aligned to ACARA v9. Continue lesson-resource and assessment integration.'
  },
  'y9-robotic-fingers-guide-app': {
    status: 'Production', hosting: 'Other', database: 'none', priority: 'Normal',
    lastWorkedOn: '2026-08-20',
    notes: 'Year 9 Robotic Fingers learning guide. Includes Arduino servo and GarageBand/Makey Makey learning content.'
  },
  'ai-lab': {
    status: 'Development', hosting: 'Other', database: 'none', priority: 'Normal',
    lastWorkedOn: '2026-08-07',
    notes: 'AI curriculum learning application for Years 7–12. Continue data-centres lesson and assessment resources.'
  },
  'christian-jam-time': {
    status: 'Production', hosting: 'AWS', database: 'none', priority: 'Normal',
    lastWorkedOn: '2026-08-30',
    notes: 'Christian Jam application hosted on the shared AWS Lightsail server.'
  },
  'edai-portfolio-hub': {
    status: 'Production', hosting: 'AWS', database: 'none', priority: 'High',
    lastWorkedOn: '2026-09-03', live: 'https://trevore77.eduappsplus.com.au',
    notes: 'Personal repository administration and project-control hub. AWS port 3105 behind PM2, Nginx and HTTPS.'
  },
  'student-evidence-app': {
    status: 'Superseded', hosting: 'Other', database: 'none', priority: 'Low',
    notes: 'Older Student Evidence codebase; current production source is student-evidence-commercial.'
  },
  'student-evidence-site': {
    status: 'Superseded', hosting: 'Other', database: 'none', priority: 'Low',
    notes: 'Older Student Evidence website repository.'
  }
};
