/**
 * Real offers pulled from the development SUV via WQL.
 *
 * Query:
 *   SELECT subject, status, dateAndTimeInitiated, businessProcessStepAwaitingAction, daysSinceInitiated
 *   FROM   activeAndRenegotiatedOfferEmploymentAgreementEvents
 *   ORDER  BY dateAndTimeInitiated DESC
 *   LIMIT  10
 *
 * Captured 21 April 2026. Data is from a dev SUV, not production.
 */

export interface OfferEventRaw {
  subject: { descriptor: string; id: string };
  status: 'In Progress' | 'Successfully Completed' | string;
  dateAndTimeInitiated: string;
  businessProcessStepAwaitingAction?: { descriptor: string; id: string };
  daysSinceInitiated: number;
}

export const OFFERS_RAW: OfferEventRaw[] = [
  {
    subject: {
      descriptor:
        'Job Application: Onboarding Pre-Hire-ContingentWorker-Post-Login \u200e- R01306 Onboarding PM CW London Job Requisition Contingent worker on 11/06/2025',
      id: '260318fc147d1002ce1c12f9f25b0000',
    },
    status: 'In Progress',
    dateAndTimeInitiated: '2025-11-06T12:39:44.902Z',
    businessProcessStepAwaitingAction: {
      descriptor: 'Offer for Onboarding PM Supervisory Organization step b - Action',
      id: '5c80fe2021b31008dd8a3e1f2ae90001',
    },
    daysSinceInitiated: 166,
  },
  {
    subject: {
      descriptor:
        'Job Application: Onboarding Pre-Hire-Employee-Post-Login \u200e- R01305 Onboarding PM Employee San Francisco Job Requisition on 11/06/2025',
      id: '260318fc147d1002cdd9c64e76180000',
    },
    status: 'In Progress',
    dateAndTimeInitiated: '2025-11-06T12:35:29.930Z',
    businessProcessStepAwaitingAction: {
      descriptor: 'Offer for Onboarding PM Supervisory Organization step b - Action',
      id: '5c80fe2021b31008dd8a3e1f2ae90001',
    },
    daysSinceInitiated: 166,
  },
  {
    subject: {
      descriptor:
        'Job Application: Ryan Reynolds \u200e- R01313 Bumblebees HRREC Agency Review Doc on 11/25/2024',
      id: 'e29984ce6cde100a916d1714ec5e0000',
    },
    status: 'In Progress',
    dateAndTimeInitiated: '2024-11-25T19:54:21.924Z',
    businessProcessStepAwaitingAction: {
      descriptor:
        'Employment Agreement for Bumblebees HRREC Agency Review Doc step j - Review Documents',
      id: 'e29984ce6cde100a854f1640ca890000',
    },
    daysSinceInitiated: 511,
  },
  {
    subject: {
      descriptor:
        'Job Application: Rowan Henry \u200e- R01313 Bumblebees HRREC Agency Review Doc on 11/25/2024',
      id: 'e29984ce6cde100a8e6af0953a360000',
    },
    status: 'In Progress',
    dateAndTimeInitiated: '2024-11-25T18:55:38.036Z',
    businessProcessStepAwaitingAction: {
      descriptor:
        'Employment Agreement for Bumblebees HRREC Agency Review Doc step z - Action',
      id: 'e29984ce6cde100a8518f7de61fb0001',
    },
    daysSinceInitiated: 511,
  },
  {
    subject: {
      descriptor:
        'Job Application: Paul Mescal \u200e- R01313 Bumblebees HRREC Agency Review Doc on 11/25/2024',
      id: 'e29984ce6cde100a899150df03190000',
    },
    status: 'In Progress',
    dateAndTimeInitiated: '2024-11-25T18:21:03.672Z',
    businessProcessStepAwaitingAction: {
      descriptor:
        'Offer for Bumblebees HRREC Agency Review Doc step f - Review Documents',
      id: 'e29984ce6cde100a818d0b1397530000',
    },
    daysSinceInitiated: 511,
  },
  {
    subject: {
      descriptor:
        'Job Application: Emily Blunt \u200e- R01313 Bumblebees HRREC Agency Review Doc on 11/25/2024',
      id: 'e29984ce6cde100a89681eebdb4c0000',
    },
    status: 'In Progress',
    dateAndTimeInitiated: '2024-11-25T17:43:32.954Z',
    businessProcessStepAwaitingAction: {
      descriptor: 'Offer for Bumblebees HRREC Agency Review Doc step z - Action',
      id: 'e29984ce6cde100a80fd4fefaf0f0000',
    },
    daysSinceInitiated: 511,
  },
  {
    subject: {
      descriptor:
        'Job Application: Onboarding Pre-Hire-ContingentWorker \u200e- R01306 Onboarding PM CW London Job Requisition Contingent worker on 07/25/2024',
      id: 'b424b7e4de04100b4dc8f6695a500000',
    },
    status: 'In Progress',
    dateAndTimeInitiated: '2024-07-25T14:29:10.852Z',
    businessProcessStepAwaitingAction: {
      descriptor: 'Offer for Onboarding PM Supervisory Organization step a - Initiation',
      id: '5c80fe2021b31008dd8a3e1f2ae90000',
    },
    daysSinceInitiated: 635,
  },
  {
    subject: {
      descriptor:
        'Job Application: Onboarding Pre-Hire-Employee \u200e- R01305 Onboarding PM Employee San Francisco Job Requisition on 07/25/2024',
      id: 'b424b7e4de04100b4c005481f6570000',
    },
    status: 'In Progress',
    dateAndTimeInitiated: '2024-07-25T13:56:09.134Z',
    businessProcessStepAwaitingAction: {
      descriptor: 'Offer for Onboarding PM Supervisory Organization step a - Initiation',
      id: '5c80fe2021b31008dd8a3e1f2ae90000',
    },
    daysSinceInitiated: 635,
  },
  {
    subject: {
      descriptor:
        'Job Application: Caroline Veech \u200e- R00818 Administrative Assistant for 7191 Marketing Print Services on 03/24/2021',
      id: 'cf23034a09db018da5ba73db632a5e00',
    },
    status: 'Successfully Completed',
    dateAndTimeInitiated: '2021-03-24T11:19:42.593Z',
    daysSinceInitiated: 1854,
  },
  {
    subject: {
      descriptor: 'Job Application: Bill Wao \u200e- R01217 Ping Pong Organizer on 03/18/2021',
      id: '02ad5ded302601cec93671b4b6280007',
    },
    status: 'Successfully Completed',
    dateAndTimeInitiated: '2021-03-19T00:16:01.726Z',
    daysSinceInitiated: 1859,
  },
];

export interface OfferEventParsed {
  id: string;
  candidate: string;
  requisition: string;
  initiatedOn: string;
  status: string;
  /** 'Offer' or 'Employment Agreement' or 'Completed' */
  stage: string;
  /** The specific step awaiting action, e.g. 'Review Documents' */
  step: string;
  /** Supervisory org context from the BP step descriptor */
  supOrg: string;
  daysSinceInitiated: number;
  rawSubjectDescriptor: string;
}

/** Parse `Job Application: {Candidate} ‎- {Req} on {mm/dd/yyyy}` into structured fields. */
function parseSubject(descriptor: string): { candidate: string; requisition: string; initiatedOn: string } {
  const stripped = descriptor.replace(/^Job Application:\s*/, '');
  // Split on the explicit separator "‎- " (U+200E left-to-right mark + hyphen + space)
  const sepMatch = stripped.split(/\s*\u200e-\s*/);
  const candidate = sepMatch[0]?.trim() ?? '';
  const rest = sepMatch.slice(1).join(' - ');
  const onMatch = rest.match(/\s+on\s+(\d{1,2}\/\d{1,2}\/\d{4})\s*$/);
  let requisition = rest;
  let initiatedOn = '';
  if (onMatch) {
    requisition = rest.slice(0, onMatch.index).trim();
    initiatedOn = onMatch[1];
  }
  return { candidate, requisition, initiatedOn };
}

/** Parse `{Stage} for {SupOrg} step {letter} - {StepName}` into structured fields. */
function parseBpStep(descriptor: string | undefined): { stage: string; supOrg: string; step: string } {
  if (!descriptor) return { stage: 'Completed', supOrg: '', step: '' };
  const stageMatch = descriptor.match(/^(Offer|Employment Agreement)\s+for\s+(.*?)\s+step\s+[a-z]\s+-\s+(.+)$/i);
  if (stageMatch) {
    return { stage: stageMatch[1], supOrg: stageMatch[2].trim(), step: stageMatch[3].trim() };
  }
  return { stage: descriptor, supOrg: '', step: '' };
}

export function parseOffers(raw: OfferEventRaw[]): OfferEventParsed[] {
  return raw.map((r) => {
    const { candidate, requisition, initiatedOn } = parseSubject(r.subject.descriptor);
    const { stage, supOrg, step } = parseBpStep(r.businessProcessStepAwaitingAction?.descriptor);
    return {
      id: r.subject.id,
      candidate,
      requisition,
      initiatedOn,
      status: r.status,
      stage,
      step,
      supOrg,
      daysSinceInitiated: r.daysSinceInitiated,
      rawSubjectDescriptor: r.subject.descriptor,
    };
  });
}

export const OFFERS_PARSED: OfferEventParsed[] = parseOffers(OFFERS_RAW);
