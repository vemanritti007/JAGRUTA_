import { prisma } from '../db/prisma';

type Classification = {
  category: string;
  responsibleDepartment: string;
  officerRole: string;
  civicHelpline: string;
  emergencyHelpline: string;
  urgency: 'low' | 'medium' | 'high';
  officerType:
    | 'engineering'
    | 'traffic'
    | 'waste'
    | 'food'
    | 'water'
    | 'drainage'
    | 'electrical'
    | 'animal'
    | 'health'
    | 'tree'
    | 'revenue'
    | 'pollution'
    | 'emergency'
    | 'general';
};

type OfficerInfo = {
  role: string;
  name: string;
  phone: string;
};

function safeText(value: any) {
  return String(value || '').trim();
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasAny(text: string, words: string[]) {
  const cleanText = normalize(text);

  return words.some((word) => {
    const cleanWord = normalize(word);

    if (!cleanWord) {
      return false;
    }

    return cleanText.includes(cleanWord);
  });
}

function classifyCivicProblem(problem: string): Classification {
  const text = problem.toLowerCase();

  if (
    hasAny(text, [
      'accident',
      'fire',
      'violence',
      'assault',
      'theft',
      'robbery',
      'harassment',
      'emergency',
      'danger',
      'fight',
      'attack',
      'medical emergency',
      'crime',
    ])
  ) {
    return {
      category: 'Emergency / Public Safety Issue',
      responsibleDepartment: 'Emergency Services / Police Department',
      officerRole: 'Police / Emergency Response Officer',
      civicHelpline: '1533',
      emergencyHelpline: '112',
      urgency: 'high',
      officerType: 'emergency',
    };
  }

  if (
    hasAny(text, [
      'parking',
      'no parking',
      'restricted parking',
      'illegal parking',
      'wrong parking',
      'vehicle parked',
      'car parked',
      'bike parked',
      'tow',
      'towing',
      'traffic',
      'signal',
      'wrong side',
      'vehicle blocking',
      'footpath parking',
      'parked on footpath',
      'parking violation',
      'traffic jam',
      'traffic congestion',
    ])
  ) {
    return {
      category: 'Parking / Traffic Enforcement Issue',
      responsibleDepartment: 'Traffic Police / Traffic Enforcement Department',
      officerRole: 'Traffic Police / Traffic Warden',
      civicHelpline: '1533',
      emergencyHelpline: '112',
      urgency: 'medium',
      officerType: 'traffic',
    };
  }

  if (
    hasAny(text, [
      'garbage',
      'waste',
      'trash',
      'dump',
      'dumping',
      'dustbin',
      'solid waste',
      'garbage collection',
      'litter',
      'unclean',
      'sweeping',
      'sanitation',
      'dirty street',
      'black spot',
      'garbage truck',
    ])
  ) {
    return {
      category: 'Waste / Sanitation Issue',
      responsibleDepartment: 'BBMP Solid Waste Management / Health Department',
      officerRole: 'Junior Health Inspector / Senior Health Inspector',
      civicHelpline: '1533',
      emergencyHelpline: '112',
      urgency: 'medium',
      officerType: 'waste',
    };
  }

  if (
    hasAny(text, [
      'food',
      'food poisoning',
      'stale food',
      'expired food',
      'hotel hygiene',
      'restaurant hygiene',
      'adulteration',
      'contaminated food',
      'meat shop',
      'street food',
      'canteen',
      'ration',
      'ration shop',
      'fair price shop',
      'unsafe food',
      'bad food',
      'food quality',
    ])
  ) {
    return {
      category: 'Food Safety / Public Health Issue',
      responsibleDepartment: 'Food Safety Department / BBMP Health Department',
      officerRole: 'Food Safety Officer / Health Inspector',
      civicHelpline: '1533',
      emergencyHelpline: '112',
      urgency: 'medium',
      officerType: 'food',
    };
  }

  if (
    hasAny(text, [
      'mosquito',
      'dengue',
      'malaria',
      'fogging',
      'health hazard',
      'disease',
      'infection',
      'public health',
      'stagnant water',
      'fever outbreak',
      'bad smell',
      'foul smell',
    ])
  ) {
    return {
      category: 'Public Health Issue',
      responsibleDepartment: 'BBMP Health Department',
      officerRole: 'Health Inspector / Medical Officer',
      civicHelpline: '1533',
      emergencyHelpline: '112',
      urgency: 'medium',
      officerType: 'health',
    };
  }

  if (
    hasAny(text, [
      'drain',
      'drainage',
      'sewage',
      'sewer',
      'manhole',
      'gutter',
      'storm water',
      'flooding',
      'water logging',
      'waterlogging',
      'blocked drain',
      'open drain',
      'sewer overflow',
      'sewage overflow',
      'drain overflow',
    ])
  ) {
    return {
      category: 'Drainage / Sewage Issue',
      responsibleDepartment: 'BBMP Engineering / BWSSB Drainage Department',
      officerRole: 'Assistant Engineer / Assistant Executive Engineer',
      civicHelpline: '1533',
      emergencyHelpline: '112',
      urgency: 'medium',
      officerType: 'drainage',
    };
  }

  if (
    hasAny(text, [
      'water',
      'no water',
      'low pressure',
      'drinking water',
      'water supply',
      'water leakage',
      'pipe leak',
      'pipe burst',
      'bwssb',
      'borewell',
      'tanker',
      'contaminated water',
      'dirty water',
      'tap water',
      'water connection',
    ])
  ) {
    return {
      category: 'Water Supply Issue',
      responsibleDepartment: 'BWSSB / Water Supply Department',
      officerRole: 'Assistant Engineer / Water Supply Engineer',
      civicHelpline: '1533',
      emergencyHelpline: '112',
      urgency: 'medium',
      officerType: 'water',
    };
  }

  if (
    hasAny(text, [
      'streetlight',
      'street light',
      'light not working',
      'electric pole',
      'electricity',
      'power cut',
      'wire',
      'hanging wire',
      'transformer',
      'dark street',
      'lamp post',
      'electric shock',
      'bescom',
    ])
  ) {
    return {
      category: 'Streetlight / Electrical Issue',
      responsibleDepartment: 'BBMP Electrical Department / BESCOM',
      officerRole: 'Electrical Engineer / Assistant Engineer',
      civicHelpline: '1533',
      emergencyHelpline: '112',
      urgency: 'medium',
      officerType: 'electrical',
    };
  }

  if (
    hasAny(text, [
      'dog',
      'stray dog',
      'dog bite',
      'cattle',
      'cow',
      'pig',
      'monkey',
      'animal',
      'dead animal',
      'animal carcass',
      'snake',
      'animal nuisance',
    ])
  ) {
    return {
      category: 'Animal Control Issue',
      responsibleDepartment: 'BBMP Animal Husbandry / Veterinary Department',
      officerRole: 'Animal Husbandry Officer / Veterinary Officer',
      civicHelpline: '1533',
      emergencyHelpline: '112',
      urgency: hasAny(text, ['bite', 'snake', 'attack']) ? 'high' : 'medium',
      officerType: 'animal',
    };
  }

  if (
    hasAny(text, [
      'tree',
      'fallen tree',
      'branch',
      'park',
      'garden',
      'playground',
      'lake',
      'green space',
      'horticulture',
      'tree cutting',
      'tree branch',
    ])
  ) {
    return {
      category: 'Parks / Trees / Horticulture Issue',
      responsibleDepartment: 'BBMP Forest / Horticulture Department',
      officerRole: 'Forest Officer / Horticulture Officer',
      civicHelpline: '1533',
      emergencyHelpline: '112',
      urgency: hasAny(text, ['fallen', 'blocking', 'danger']) ? 'high' : 'medium',
      officerType: 'tree',
    };
  }

  if (
    hasAny(text, [
      'illegal construction',
      'encroachment',
      'building violation',
      'property tax',
      'khata',
      'land record',
      'zoning',
      'setback violation',
      'unauthorized building',
      'illegal building',
      'road encroachment',
      'footpath encroachment',
      'shop encroachment',
    ])
  ) {
    return {
      category: 'Building / Revenue / Encroachment Issue',
      responsibleDepartment: 'BBMP Revenue / Town Planning Department',
      officerRole: 'Revenue Officer / Assistant Revenue Officer',
      civicHelpline: '1533',
      emergencyHelpline: '112',
      urgency: 'medium',
      officerType: 'revenue',
    };
  }

  if (
    hasAny(text, [
      'noise',
      'loudspeaker',
      'pollution',
      'air pollution',
      'smoke',
      'burning waste',
      'dust pollution',
      'industrial pollution',
      'sound pollution',
      'factory smoke',
    ])
  ) {
    return {
      category: 'Noise / Pollution Issue',
      responsibleDepartment: 'Pollution Control Board / Police / BBMP Health Department',
      officerRole: 'Health Inspector / Police Officer',
      civicHelpline: '1533',
      emergencyHelpline: '112',
      urgency: 'medium',
      officerType: 'pollution',
    };
  }

  if (
    hasAny(text, [
      'road',
      'pothole',
      'footpath',
      'sidewalk',
      'road damage',
      'road repair',
      'broken road',
      'damaged road',
      'speed breaker',
      'road cutting',
      'asphalt',
      'tar',
      'median',
      'culvert',
      'construction debris',
      'public infrastructure',
      'broken footpath',
      'damaged footpath',
    ])
  ) {
    return {
      category: 'Road / Footpath / Engineering Issue',
      responsibleDepartment: 'BBMP Engineering Department',
      officerRole: 'Assistant Engineer / Assistant Executive Engineer',
      civicHelpline: '1533',
      emergencyHelpline: '112',
      urgency: 'medium',
      officerType: 'engineering',
    };
  }

  return {
    category: 'General Civic Issue',
    responsibleDepartment: 'BBMP Ward Office',
    officerRole: 'Ward Officer / BBMP Helpdesk',
    civicHelpline: '1533',
    emergencyHelpline: '112',
    urgency: 'low',
    officerType: 'general',
  };
}

function getWardNo(ward: any) {
  return safeText(ward?.wardNo || ward?.wardNumber || ward?.number || ward?.no);
}

function getWardName(ward: any) {
  return safeText(ward?.wardName || ward?.name || ward?.ward || 'Unknown Ward');
}

function getZoneName(ward: any) {
  return safeText(ward?.zoneName || ward?.zone || 'Not available');
}

function getAssemblyConstituency(ward: any) {
  return safeText(
    ward?.assemblyConstituency ||
      ward?.assembly ||
      ward?.constituency ||
      'Not available'
  );
}

function includesArea(problem: string, area: string) {
  const cleanProblem = normalize(problem);
  const cleanArea = normalize(area);

  if (!cleanProblem || !cleanArea) {
    return false;
  }

  return cleanProblem.includes(cleanArea);
}

function getWardScore(problem: string, ward: any) {
  let score = 0;

  const wardName = getWardName(ward);
  const zoneName = getZoneName(ward);
  const assembly = getAssemblyConstituency(ward);
  const wardNo = getWardNo(ward);

  if (wardName && includesArea(problem, wardName)) score += 100;
  if (assembly && includesArea(problem, assembly)) score += 60;
  if (zoneName && includesArea(problem, zoneName)) score += 20;

  if (
    wardNo &&
    hasAny(problem, [`ward ${wardNo}`, `ward no ${wardNo}`, `ward number ${wardNo}`])
  ) {
    score += 120;
  }

  return score;
}

function findBestWard(problem: string, wards: any[]) {
  if (!wards || wards.length === 0) {
    return null;
  }

  let bestWard = wards[0];
  let bestScore = 0;

  for (const ward of wards) {
    const score = getWardScore(problem, ward);

    if (score > bestScore) {
      bestScore = score;
      bestWard = ward;
    }
  }

  if (bestScore === 0) {
    return (
      wards.find((ward) => normalize(getWardName(ward)).includes('basavanagudi')) ||
      wards[0]
    );
  }

  return bestWard;
}

function phoneToString(value: any) {
  const raw = safeText(value);

  if (!raw || raw === '0' || raw.toLowerCase() === 'nan') {
    return '';
  }

  return raw.replace(/\.0$/, '');
}

function getOfficerKeywords(type: Classification['officerType']) {
  if (
    type === 'engineering' ||
    type === 'water' ||
    type === 'drainage' ||
    type === 'electrical' ||
    type === 'tree'
  ) {
    return ['assistant engineer', 'aee', 'ae', 'executive engineer', 'engineer'];
  }

  if (type === 'waste' || type === 'food' || type === 'health' || type === 'pollution') {
    return ['health inspector', 'junior health', 'senior health', 'health'];
  }

  if (type === 'animal') {
    return ['animal', 'veterinary', 'husbandry'];
  }

  if (type === 'revenue') {
    return ['revenue', 'aro', 'ro'];
  }

  if (type === 'traffic') {
    return ['traffic', 'police', 'warden'];
  }

  return ['ward', 'officer', 'helpdesk'];
}

async function getOfficerForWard(
  ward: any,
  classification: Classification
): Promise<OfficerInfo> {
  const fallback: OfficerInfo = {
    role: classification.officerRole,
    name:
      classification.officerType === 'traffic'
        ? 'Traffic Police / Not available in ward officer dataset'
        : 'Not available',
    phone:
      classification.officerType === 'traffic'
        ? 'Use 112 for urgent obstruction or 1533 for civic escalation'
        : classification.civicHelpline,
  };

  try {
    const wardOfficerClient = (prisma as any).wardOfficer;

    if (!wardOfficerClient?.findMany || !ward?.id) {
      return fallback;
    }

    const officers = await wardOfficerClient.findMany({
      where: {
        wardId: ward.id,
      },
    });

    const keywords = getOfficerKeywords(classification.officerType);

    const matchedOfficer =
      officers.find((officer: any) => {
        const role = normalize(officer.role || officer.designation || officer.title || '');
        const department = normalize(officer.department || '');

        return keywords.some(
          (keyword) =>
            role.includes(normalize(keyword)) ||
            department.includes(normalize(keyword))
        );
      }) || officers[0];

    if (!matchedOfficer) {
      return fallback;
    }

    return {
      role: safeText(
        matchedOfficer.role ||
          matchedOfficer.designation ||
          classification.officerRole
      ),
      name: safeText(
        matchedOfficer.name ||
          matchedOfficer.officerName ||
          'Not available'
      ),
      phone:
        phoneToString(
          matchedOfficer.phone ||
            matchedOfficer.mobile ||
            matchedOfficer.contact
        ) || fallback.phone,
    };
  } catch {
    return fallback;
  }
}

async function getComplaintStats(ward: any) {
  try {
    const civicComplaintClient = (prisma as any).civicComplaint;

    if (!civicComplaintClient?.findMany || !ward?.id) {
      return {
        fulfilled: 0,
        ignored: 0,
        total: 0,
        resolutionScore: 0,
      };
    }

    let complaints: any[] = [];

    try {
      complaints = await civicComplaintClient.findMany({
        where: {
          wardId: ward.id,
        },
      });
    } catch {
      complaints = await civicComplaintClient.findMany({
        where: {
          ward: {
            id: ward.id,
          },
        },
      });
    }

    const fulfilledStatuses = ['FULFILLED', 'RESOLVED', 'COMPLETED', 'CLOSED', 'DONE'];
    const ignoredStatuses = ['IGNORED', 'PENDING', 'UNRESOLVED', 'REJECTED', 'OPEN'];

    const fulfilled = complaints.filter((complaint) =>
      fulfilledStatuses.includes(safeText(complaint.status).toUpperCase())
    ).length;

    const ignored = complaints.filter((complaint) =>
      ignoredStatuses.includes(safeText(complaint.status).toUpperCase())
    ).length;

    const total = fulfilled + ignored;

    return {
      fulfilled,
      ignored,
      total,
      resolutionScore: total > 0 ? Math.round((fulfilled / total) * 100) : 0,
    };
  } catch {
    return {
      fulfilled: 0,
      ignored: 0,
      total: 0,
      resolutionScore: 0,
    };
  }
}

function formatProblemMappingResult(params: {
  classification: Classification;
  ward: any;
  officer: OfficerInfo;
  stats: {
    fulfilled: number;
    ignored: number;
    total: number;
    resolutionScore: number;
  };
}) {
  const { classification, ward, officer, stats } = params;

  const wardNo = getWardNo(ward) || 'Not available';
  const wardName = getWardName(ward);
  const zoneName = getZoneName(ward);
  const assembly = getAssemblyConstituency(ward);

  const scoreText =
    stats.total > 0
      ? `${stats.resolutionScore}/100`
      : 'Not enough complaint data available';

  return `This issue is classified as ${classification.category}. It is mapped to Ward ${wardNo} - ${wardName}.

The likely responsible department is ${classification.responsibleDepartment}. For civic complaints in Bengaluru, use helpline ${classification.civicHelpline}. For emergencies, use ${classification.emergencyHelpline}.

Ward Details:
Ward No: ${wardNo}
Ward Name: ${wardName}
Zone: ${zoneName}
Assembly Constituency: ${assembly}

Responsible Contact:
Role: ${officer.role}
Name: ${officer.name}
Phone: ${officer.phone}

Problem Scorecard:
Fulfilled Complaints: ${stats.fulfilled}
Ignored / Pending Complaints: ${stats.ignored}
Resolution Score: ${scoreText}

Urgency Level: ${classification.urgency.toUpperCase()}`;
}

export async function generateProblemMapping(problem: string, pincode?: string) {
  const cleanProblem = safeText(problem);

  if (!cleanProblem) {
    return `Please enter a civic problem first.

Example:
There is illegal parking near Basavanagudi main road.`;
  }

  const classification = classifyCivicProblem(cleanProblem);

  let wards: any[] = [];

  try {
    wards = await (prisma as any).ward.findMany();
  } catch {
    wards = [];
  }

  const bestWard = findBestWard(cleanProblem, wards);

  if (!bestWard) {
    return `This issue is classified as ${classification.category}.

The likely responsible department is ${classification.responsibleDepartment}.

Responsible Contact:
Role: ${classification.officerRole}
Name: Not available
Phone: ${
      classification.officerType === 'traffic'
        ? 'Use 112 for urgent obstruction or 1533 for civic escalation'
        : classification.civicHelpline
    }

For civic complaints in Bengaluru, use helpline ${classification.civicHelpline}. For emergencies, use ${classification.emergencyHelpline}.`;
  }

  const officer = await getOfficerForWard(bestWard, classification);
  const stats = await getComplaintStats(bestWard);

  return formatProblemMappingResult({
    classification,
    ward: bestWard,
    officer,
    stats,
  });
}

export async function generatePoliticianSummary(profile: any) {
  const name = safeText(profile?.name || 'This representative');
  const party = safeText(profile?.party || 'their party');
  const constituency = safeText(
    profile?.constituency ||
      profile?.constituencyName ||
      'their constituency'
  );
  const score = profile?.score ?? 'not available';
  const attendance =
    profile?.attendance ??
    profile?.attendanceStats?.present ??
    'not available';
  const criminalCases = profile?.criminalCases ?? 0;

  return `${name} represents ${constituency} and belongs to ${party}. The available profile data shows a performance score of ${score}/100, attendance of ${attendance}%, and ${criminalCases} declared criminal case(s). This summary is generated from the available project database and should be read as a neutral civic information summary.`;
}

export async function generateVotingGuide(...args: any[]) {
  const input = args[0];

  let priorities: string[] = [];

  if (Array.isArray(input)) {
    priorities = input
      .map((item: any) => {
        if (typeof item === 'string') return item;
        return item?.content || item?.answer || item?.text || '';
      })
      .filter(Boolean);
  } else if (typeof input === 'string') {
    priorities = [input];
  } else if (input && typeof input === 'object') {
    priorities = Object.values(input)
      .map((value: any) => String(value || ''))
      .filter(Boolean);
  }

  const combined = priorities.join(' ').toLowerCase();

  const focusAreas: string[] = [];

  if (combined.includes('road') || combined.includes('traffic') || combined.includes('transport')) {
    focusAreas.push('better roads, transport, and traffic management');
  }

  if (combined.includes('water') || combined.includes('drainage') || combined.includes('sewage')) {
    focusAreas.push('water supply, drainage, and sanitation');
  }

  if (combined.includes('education') || combined.includes('school') || combined.includes('college')) {
    focusAreas.push('education and youth development');
  }

  if (combined.includes('health') || combined.includes('hospital') || combined.includes('clinic')) {
    focusAreas.push('healthcare and public health services');
  }

  if (combined.includes('safety') || combined.includes('crime') || combined.includes('women')) {
    focusAreas.push('public safety and women’s safety');
  }

  if (combined.includes('job') || combined.includes('employment') || combined.includes('business')) {
    focusAreas.push('jobs, business support, and employment generation');
  }

  if (combined.includes('garbage') || combined.includes('waste') || combined.includes('clean')) {
    focusAreas.push('waste management and cleanliness');
  }

  if (focusAreas.length === 0) {
    focusAreas.push(
      'basic civic services',
      'representative accountability',
      'public infrastructure',
      'transparent governance'
    );
  }

  return `Based on your selected priorities, you should compare candidates mainly on ${focusAreas.join(
    ', '
  )}.

Voting Guide:
1. Check whether the candidate has a clear plan for your top local issues.
2. Compare their attendance, performance score, criminal case record, and asset growth.
3. Review party manifesto promises related to your priorities.
4. Prefer candidates with stronger local work, fewer serious issues, and better public accountability.
5. Do not vote only based on party or popularity; compare actual civic performance.

This is a neutral civic guide. It does not tell you whom to vote for, but helps you evaluate candidates more clearly.`;
}
export { classifyCivicProblem };