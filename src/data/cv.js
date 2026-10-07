// The CV shown on the CV page. Each array inside `pages` is one printed page.
// Entry fields: org, place, role, dates, bullets. All are optional.
export const cv = {
  updated: '[MONTH YEAR]',
  contact: '[CITY, COUNTRY] · [YOUR EMAIL] · [PHONE] · [GITHUB OR WEBSITE]',
  pages: [
    [
      {
        heading: 'Education',
        entries: [
          {
            org: 'Tsinghua University',
            place: 'Beijing, China',
            role: '[DEGREE], School of Materials Science and Engineering',
            dates: '[YEAR] – [EXPECTED YEAR]',
            bullets: [
              'Research on defect physics in halide perovskites (CsPbI₃) with first-principles calculations and molecular dynamics.',
            ],
          },
          {
            org: 'Ho Chi Minh City University of Technology (VNU-HCM)',
            place: 'Ho Chi Minh City, Vietnam',
            role: '[DEGREE AND MAJOR]',
            dates: '[YEAR] – [YEAR]',
            bullets: ['[GPA, HONOURS OR RANK]', '[THESIS TITLE]'],
          },
        ],
      },
      {
        heading: 'Research Experience',
        entries: [
          {
            org: 'Tsinghua University, [GROUP NAME]',
            place: 'Beijing, China',
            role: 'Graduate Researcher',
            dates: '[MONTH YEAR] – Present',
            bullets: [
              'Model the migration of iodine vacancies and interstitials near the CsPbI₃ surface using slab models and nudged elastic band calculations.',
              'Relaxed the cubic α and orthorhombic γ phases of CsPbI₃ in Quantum ESPRESSO and analysed the transition through the tolerance factor and soft phonon modes.',
              'Wrote reusable Python scripts that convert CIF structures into ready-to-run Quantum ESPRESSO inputs.',
              'Run VASP and Quantum ESPRESSO jobs on a PBS-managed HPC cluster.',
            ],
          },
          {
            org: '[EARLIER GROUP OR LAB, IF ANY]',
            place: '[CITY, COUNTRY]',
            role: '[ROLE]',
            dates: '[MONTH YEAR] – [MONTH YEAR]',
            bullets: ['[WHAT YOU DID AND WHAT CAME OUT OF IT]'],
          },
        ],
      },
    ],
    [
      {
        heading: 'Projects',
        entries: [
          {
            org: 'Statistical Mechanics from Maximum Entropy',
            place: '[YEAR]',
            bullets: ['Wrote LaTeX lecture notes that derive the ensembles of statistical mechanics from entropy maximisation.'],
          },
          {
            org: 'Reproduction of a Machine-Learning Model-Selection Study',
            place: '[YEAR]',
            bullets: ['Rebuilt the pipeline of a published paper on NBA betting models that compares model selection by accuracy and by calibration.'],
          },
        ],
      },
      { heading: 'Publications', lines: ['[AUTHORS. TITLE. JOURNAL, VOLUME, PAGES (YEAR). OR REMOVE THIS SECTION]'] },
      { heading: 'Talks and Posters', lines: ['[TITLE. EVENT, CITY (MONTH YEAR). OR REMOVE THIS SECTION]'] },
      { heading: 'Awards and Scholarships', entries: [{ plain: '[AWARD OR SCHOLARSHIP, AWARDING BODY]', place: '[YEAR]' }] },
      {
        heading: 'Skills',
        skills: [
          { label: 'Simulation', value: 'Quantum ESPRESSO, VASP, LAMMPS; DFT, molecular dynamics, NEB' },
          { label: 'Programming and tools', value: 'Python, ASE, VESTA, OVITO, LaTeX, Linux, PBS' },
          { label: 'Languages', value: 'Vietnamese (native), English ([LEVEL]), [OTHER LANGUAGES AND LEVELS]' },
        ],
      },
    ],
  ],
  // Short version shown on the home page.
  summary: [
    { when: '[YEAR] – now', org: 'Tsinghua University', what: 'Graduate student, School of Materials Science and Engineering' },
    { when: '[YEAR] – [YEAR]', org: 'Ho Chi Minh City University of Technology (VNU-HCM)', what: '[YOUR DEGREE AND MAJOR]' },
  ],
};
