export const policyLinks = [
  {
    slug: 'safeguarding',
    title: 'Safeguarding',
    copy: 'Rules for keeping young learners safe in clubs, classrooms, and online activities.',
    sections: [
      {
        heading: 'Purpose',
        points: [
          'TinyPyk is designed for children, so safety comes before growth, features, or community activity.',
          'The app is not a social network and should not be used for unsupervised child-to-child messaging.',
          'Clubs, classrooms, and events should follow their own local safeguarding rules and reporting process.',
        ],
      },
      {
        heading: 'Adult responsibilities',
        points: [
          'Children should use TinyPyk with a parent, carer, teacher, or club leader responsible for supervision.',
          'Adults must avoid asking children to share full names, locations, passwords, contact details, photos, or private family information.',
          'Any public community, lesson review, or contribution space must be moderated by adults before children are invited to use it.',
        ],
      },
      {
        heading: 'Concerns',
        points: [
          'If a child may be at immediate risk, contact local emergency or child-protection services first.',
          'Reports about TinyPyk content should include the page, project, or contribution link and enough context for maintainers to review it.',
          'A named safeguarding contact should be published before TinyPyk is used as a public community service.',
        ],
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy',
    copy: 'How learner, parent, teacher, and contributor information should be handled.',
    sections: [
      {
        heading: 'Data minimisation',
        points: [
          'TinyPyk should collect only the information needed to run learning features, keep the service secure, and support contributors.',
          'Children should not be asked to put personal information into projects, coach prompts, examples, or shared lessons.',
          'Generated projects are saved in the browser or downloaded by the user unless a future account feature clearly says otherwise.',
        ],
      },
      {
        heading: 'Keys and service data',
        points: [
          'OpenAI and ElevenLabs keys must stay server-side and must never be placed in browser code or public repositories.',
          'AI coach requests should send only the code, lesson context, and child-safe question needed to provide a hint.',
          'Voice features should process short character speech only and should include a clear mute option.',
        ],
      },
      {
        heading: 'Future account features',
        points: [
          'If usernames, passwords, Google sign-in, classrooms, or saved cloud projects are added, a fuller privacy notice must be reviewed before launch.',
          'Children should be able to use core learning features without unnecessary tracking or marketing consent.',
          'Parents, carers, and teachers should be told what is stored, why it is stored, and how to request deletion.',
        ],
      },
    ],
  },
  {
    slug: 'cookies',
    title: 'Cookies',
    copy: 'Clear choices for optional analytics, saved preferences, and essential site features.',
    sections: [
      {
        heading: 'Essential storage',
        points: [
          'TinyPyk may use browser storage for progress, mute settings, tutorial state, and local project preferences.',
          'Essential storage should be limited to features the learner requested and should not be used for advertising.',
          'Downloaded projects are files controlled by the user.',
        ],
      },
      {
        heading: 'Optional analytics',
        points: [
          'Optional analytics should be off by default until a clear cookie banner and preference control are available.',
          'Any analytics should be privacy-respecting, aggregate where possible, and avoid collecting children\'s project text unless explicitly reviewed.',
          'No third-party advertising cookies should be used for children\'s learning pages.',
        ],
      },
      {
        heading: 'Choices',
        points: [
          'Users should be able to reset local progress and preferences from browser settings or a future TinyPyk settings screen.',
          'A cookie preference link should be added before optional analytics are enabled.',
          'Schools and clubs should be able to use TinyPyk without non-essential cookies.',
        ],
      },
    ],
  },
  {
    slug: 'terms-of-use',
    title: 'Terms of use',
    copy: 'Plain-language expectations for using TinyPyk projects, lessons, and tools.',
    sections: [
      {
        heading: 'Learning use',
        points: [
          'TinyPyk is provided for learning, teaching, experimenting, and contributing to child-friendly Python education.',
          'Learners should use the tool kindly, safely, and with adult support where appropriate.',
          'The project is provided as-is while it grows; features may change as maintainers improve safety and learning quality.',
        ],
      },
      {
        heading: 'User content',
        points: [
          'Do not upload, share, or contribute content that includes personal data about children or other people.',
          'Do not use TinyPyk to create harmful, hateful, sexual, violent, illegal, or bullying content.',
          'Contributed lessons and examples may be edited, rejected, or removed to protect children and maintain learning quality.',
        ],
      },
      {
        heading: 'Responsible adults',
        points: [
          'Teachers, clubs, and parents are responsible for deciding whether a lesson is suitable for their learners and local rules.',
          'Adults should check any external services, browser settings, and network permissions before classroom use.',
          'Formal terms should be reviewed before offering accounts, payments, public sharing, or classroom management features.',
        ],
      },
    ],
  },
  {
    slug: 'code-of-conduct',
    title: 'Code of conduct',
    copy: 'A kind, inclusive standard for learners, adults, contributors, and community spaces.',
    sections: [
      {
        heading: 'Our standard',
        points: [
          'Be kind, patient, and respectful to learners, families, teachers, contributors, and maintainers.',
          'Assume people are learning, and explain ideas in plain language without shaming mistakes.',
          'Make space for different ages, languages, abilities, cultures, and levels of coding experience.',
        ],
      },
      {
        heading: 'Not acceptable',
        points: [
          'Harassment, bullying, discrimination, intimidation, sexual content, threats, and doxxing are not allowed.',
          'Do not contact children privately through TinyPyk community or contribution spaces.',
          'Do not pressure maintainers, volunteers, teachers, or young learners to share personal information.',
        ],
      },
      {
        heading: 'Moderation',
        points: [
          'Maintainers may remove comments, lessons, pull requests, issues, or accounts that break this code.',
          'Repeated or serious behaviour concerns may lead to a ban from project spaces.',
          'Reports should be reviewed calmly, privately, and with child safety as the first priority.',
        ],
      },
    ],
  },
  {
    slug: 'accessibility',
    title: 'Accessibility',
    copy: 'Commitments for readable, keyboard-friendly, screen-reader-aware learning materials.',
    sections: [
      {
        heading: 'Design commitments',
        points: [
          'TinyPyk should use readable text, visible focus states, sufficient colour contrast, and predictable navigation.',
          'Instructions should be written in plain language and avoid relying on colour alone.',
          'Important controls such as Play, Stop, input, output, tutorials, and mute should be reachable without confusion.',
        ],
      },
      {
        heading: 'Assistive technology',
        points: [
          'Pages should include meaningful headings, labels, alt text where needed, and keyboard-friendly controls.',
          'Blockly-based interactions should be tested with the accessibility features Blockly and browsers provide.',
          'Audio and voice features should have mute controls and should not be required to complete core lessons.',
        ],
      },
      {
        heading: 'Continuous improvement',
        points: [
          'Accessibility issues should be welcomed as important contributions, not treated as polish.',
          'Teachers and families should be able to report barriers with screenshots, device details, or plain descriptions.',
          'Future releases should include accessibility checks before deployment.',
        ],
      },
    ],
  },
  {
    slug: 'content-moderation',
    title: 'Content moderation',
    copy: 'Guidance for reviewing shared lessons, pull requests, examples, and classroom resources.',
    sections: [
      {
        heading: 'Review before publishing',
        points: [
          'Lessons, examples, extension ideas, and public contributions should be reviewed before they are shown to children.',
          'Reviewers should check age suitability, language, privacy, safety, accessibility, licensing, and educational value.',
          'Content that asks children for private information should be rejected or rewritten.',
        ],
      },
      {
        heading: 'Remove quickly',
        points: [
          'Harmful, adult, hateful, exploitative, bullying, misleading, or privacy-invasive content should be removed quickly.',
          'Maintainers should keep a simple internal record of serious removals and the reason for action.',
          'Child safety concerns should be escalated to the appropriate safeguarding route.',
        ],
      },
      {
        heading: 'Contributor feedback',
        points: [
          'Where safe, contributors should receive clear feedback explaining what needs to change.',
          'Moderation decisions should be firm but respectful.',
          'Maintainers may close discussions that become unsafe, hostile, or off-topic.',
        ],
      },
    ],
  },
  {
    slug: 'ai-and-voice-safety',
    title: 'AI and voice safety',
    copy: 'Kid-safe limits for coach replies, talking characters, voices, and generated content.',
    sections: [
      {
        heading: 'Tiny Coach rules',
        points: [
          'The coach should give short hints, encouragement, and Python explanations suitable for ages 5 to 7.',
          'The coach should not ask for names, addresses, school details, passwords, photos, phone numbers, or private family information.',
          'The coach should not pretend to be a child, a parent, a teacher, a doctor, a lawyer, or an emergency service.',
        ],
      },
      {
        heading: 'Voice rules',
        points: [
          'Talking characters should use child-appropriate scripts from the lesson or project context.',
          'Learners and adults must be able to mute voice and music easily.',
          'Voice generation should not clone real children or private individuals without explicit permission and policy review.',
        ],
      },
      {
        heading: 'Safety controls',
        points: [
          'API keys must be stored server-side in private configuration, never in the browser.',
          'Prompts and outputs should be logged only when necessary for safety, debugging, or abuse prevention, and with privacy in mind.',
          'Human review is needed before enabling broad user-generated AI features for children.',
        ],
      },
    ],
  },
  {
    slug: 'open-source-contribution',
    title: 'Open-source contribution',
    copy: 'How people can contribute while respecting child safety, licensing, and maintainership.',
    sections: [
      {
        heading: 'Welcome contributions',
        points: [
          'Contributors can help with lessons, translations, bug fixes, accessibility, design, tests, documentation, and new block ideas.',
          'All contributions should support child-friendly Python learning and follow the code of conduct.',
          'Maintainers may ask for changes or decline contributions that do not fit the learning path or safety standards.',
        ],
      },
      {
        heading: 'Licensing',
        points: [
          'Only contribute code, text, images, sounds, and lesson ideas you have the right to share.',
          'Third-party assets must include source, licence, and attribution details.',
          'Do not copy lessons or assets from other sites unless their licence clearly allows it or written permission is recorded.',
        ],
      },
      {
        heading: 'Child safety in contributions',
        points: [
          'Do not include real children\'s personal details, photos, recordings, school names, or private classroom data.',
          'Example projects should use fictional names and safe, age-appropriate scenarios.',
          'Pull requests that affect AI, voice, accounts, uploads, or public sharing need extra safety review.',
        ],
      },
    ],
  },
];
