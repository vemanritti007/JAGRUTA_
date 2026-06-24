import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../db/prisma';

const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);

const genAI = hasGeminiKey
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
  : null;

async function askGemini(prompt: string) {
  if (!genAI) return null;

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

function buildFallbackSummary(politician: any) {
  return `${politician.name} represents ${politician.constituencyRef.name} as a ${politician.level}. Their civic score is ${politician.score}/100 with ${politician.attendance}% attendance and ${politician.yearsInOffice} years in office. They have ${politician.criminalCases} declared criminal case(s). Overall, this profile shows ${
    politician.score >= 80 ? 'strong' : politician.score >= 65 ? 'moderate' : 'developing'
  } public performance based on the available indicators.`;
}

export async function generatePoliticianSummary(politicianId: string) {
  const politician = await prisma.politician.findUnique({
    where: { id: politicianId },
    include: {
      constituencyRef: true,
    },
  });

  if (!politician) {
    return 'No verified politician data was found for this profile.';
  }

  if (!genAI) {
    return buildFallbackSummary(politician);
  }

  try {
    const prompt = `
You are a neutral civic information assistant for an Indian voter app.

Do not endorse or attack any candidate.
Do not invent facts.
Use only the data below.
Write one short paragraph in simple English.

Politician data:
Name: ${politician.name}
Party: ${politician.party}
Level: ${politician.level}
Constituency: ${politician.constituencyRef.name}
Performance Score: ${politician.score}/100
Attendance: ${politician.attendance}%
Years in Office: ${politician.yearsInOffice}
Declared Criminal Cases: ${politician.criminalCases}
Age: ${politician.age || 'Not available'}
Education: ${politician.education || 'Not available'}
Profession: ${politician.profession || 'Not available'}
Election Votes: ${politician.electionVotes || 'Not available'}
Vote Percentage: ${politician.votePercentage || 'Not available'}
Assets: ${politician.assets || 'Not available'}
Liabilities: ${politician.liabilities || 'Not available'}
`;

    const text = await askGemini(prompt);
    return text || buildFallbackSummary(politician);
  } catch (error) {
    console.error('Gemini politician summary failed:', error);
    return buildFallbackSummary(politician);
  }
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/\./g, ' ')
    .replace(/,/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\//g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeAreaText(value: string) {
  return normalizeText(value)
    .replace(/\bconstituency\b/g, '')
    .replace(/\bward\b/g, '')
    .replace(/\bassembly\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function compactText(value: string) {
  return normalizeAreaText(value).replace(/\s+/g, '');
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function includesArea(text: string, alias: string) {
  const normalizedText = ` ${normalizeAreaText(text)} `;
  const normalizedAlias = normalizeAreaText(alias);

  if (!normalizedAlias || normalizedAlias.length < 3) {
    return false;
  }

  const aliasWords = normalizedAlias.split(/\s+/).filter(Boolean);
  const spacedAliasPattern = aliasWords.map(escapeRegex).join('\\s+');
  const regex = new RegExp(`(^|[^a-z0-9])${spacedAliasPattern}([^a-z0-9]|$)`, 'i');

  return regex.test(normalizedText);
}

function getDetectedAreaTargets(problemText: string) {
  const aliases: { target: string; aliases: string[] }[] = [
    {
      target: 'yelahanka',
      aliases: ['yelahanka'],
    },
    {
      target: 'krpuram',
      aliases: ['kr puram', 'k r puram', 'k.r. puram', 'krpura', 'k r pura', 'krpuram'],
    },
    {
      target: 'byatarayanapura',
      aliases: ['byatarayanapura', 'byatarayana pura'],
    },
    {
      target: 'yeshvanthapura',
      aliases: ['yeshvanthapura', 'yeshwanthpur', 'yeswanthpur', 'yashwanthpur', 'yeshwanthapura'],
    },
    {
      target: 'rajarajeshwarinagar',
      aliases: ['rajarajeshwarinagar', 'rajarajeshwari nagar', 'rr nagar', 'r r nagar'],
    },
    {
      target: 'dasarahalli',
      aliases: ['dasarahalli'],
    },
    {
      target: 'mahalakshmilayout',
      aliases: ['mahalakshmi layout', 'mahalakshmilayout'],
    },
    {
      target: 'malleshwaram',
      aliases: ['malleshwaram', 'malleswaram', 'malleshwara'],
    },
    {
      target: 'hebbal',
      aliases: ['hebbal'],
    },
    {
      target: 'pulakeshinagar',
      aliases: ['pulakeshinagar', 'pulakeshi nagar', 'pulakeshi'],
    },
    {
      target: 'sarvagnanagar',
      aliases: ['sarvagnanagar', 'sarvagna nagar', 'sarvagna'],
    },
    {
      target: 'cvramannagar',
      aliases: ['cv raman nagar', 'c v raman nagar', 'c.v. raman nagar', 'cvramannagar', 'raman nagar'],
    },
    {
      target: 'shivajinagar',
      aliases: ['shivajinagar', 'shivaji nagar'],
    },
    {
      target: 'shantinagar',
      aliases: ['shanti nagar', 'shantinagar'],
    },
    {
      target: 'gandhinagar',
      aliases: ['gandhi nagar', 'gandhinagar'],
    },
    {
      target: 'rajajinagar',
      aliases: ['rajajinagar', 'rajaji nagar'],
    },
    {
      target: 'govindarajnagar',
      aliases: ['govindraj nagar', 'govindaraj nagar', 'govindarajanagar', 'govindarajnagar'],
    },
    {
      target: 'vijayanagar',
      aliases: ['vijayanagar', 'vijaya nagar'],
    },
    {
      target: 'chamrajpet',
      aliases: ['chamrajpet', 'chamarajpet'],
    },
    {
      target: 'chickpet',
      aliases: ['chickpet', 'chikpet'],
    },
    {
      target: 'basavanagudi',
      aliases: ['basavanagudi', 'basavangudi', 'basavana gudi', 'basavan gudi'],
    },
    {
      target: 'padmanabhanagar',
      aliases: ['padmanabhanagar', 'padmanabha nagar'],
    },
    {
      target: 'btmlayout',
      aliases: ['btm layout', 'b.t.m layout', 'b t m layout', 'btm', 'b.t.m', 'b t m'],
    },
    {
      target: 'jayanagar',
      aliases: ['jayanagar 4th block', 'jayanagar 5th block', 'jayanagar 9th block', 'jayanagar', 'jaya nagar', 'jayanagara'],
    },
    {
      target: 'mahadevapura',
      aliases: ['mahadevapura'],
    },
    {
      target: 'bommanahalli',
      aliases: ['bommanahalli'],
    },
    {
      target: 'bangaloresouth',
      aliases: ['bangalore south', 'bengaluru south'],
    },
    {
      target: 'anekal',
      aliases: ['anekal'],
    },
  ];

  const matches = aliases
    .flatMap((area) =>
      area.aliases.map((alias) => ({
        target: area.target,
        alias,
        length: alias.length,
      }))
    )
    .filter((item) => includesArea(problemText, item.alias))
    .sort((a, b) => b.length - a.length);

  return [...new Set(matches.map((item) => item.target))];
}

function detectIssueCategory(problemText: string) {
  const text = normalizeText(problemText);

  if (
    text.includes('streetlight') ||
    text.includes('street light') ||
    text.includes('light not working') ||
    text.includes('dark road') ||
    text.includes('lamp post')
  ) {
    return 'streetlight';
  }

  if (
    text.includes('garbage') ||
    text.includes('waste') ||
    text.includes('trash') ||
    text.includes('dump') ||
    text.includes('cleaning')
  ) {
    return 'garbage';
  }

  if (
    text.includes('pothole') ||
    text.includes('road') ||
    text.includes('footpath') ||
    text.includes('sidewalk') ||
    text.includes('broken road')
  ) {
    return 'road';
  }

  if (
    text.includes('drainage') ||
    text.includes('sewage') ||
    text.includes('sewer') ||
    text.includes('flood') ||
    text.includes('water logging') ||
    text.includes('waterlogging')
  ) {
    return 'drainage';
  }

  if (
    text.includes('water supply') ||
    text.includes('no water') ||
    text.includes('water problem') ||
    text.includes('pipe leakage') ||
    text.includes('leakage')
  ) {
    return 'water';
  }

  if (
    text.includes('dog') ||
    text.includes('stray') ||
    text.includes('animal') ||
    text.includes('cattle')
  ) {
    return 'animal';
  }

  if (
    text.includes('accident') ||
    text.includes('fire') ||
    text.includes('violence') ||
    text.includes('theft') ||
    text.includes('medical emergency') ||
    text.includes('ambulance') ||
    text.includes('police')
  ) {
    return 'safety';
  }

  return 'road';
}

async function classifyProblemWithAI(problemText: string) {
  const fallbackCategory = detectIssueCategory(problemText);

  if (!genAI) {
    return {
      category: fallbackCategory,
      urgency: fallbackCategory === 'safety' ? 'EMERGENCY' : 'NORMAL',
    };
  }

  try {
    const prompt = `
You are a Bengaluru civic issue classifier.

Classify the user's problem into exactly one category:
road, streetlight, garbage, drainage, water, animal, safety

Also classify urgency as:
NORMAL or EMERGENCY

Return only JSON.

User problem:
${problemText}

JSON format:
{
  "category": "road",
  "urgency": "NORMAL"
}
`;

    const text = await askGemini(prompt);

    if (!text) {
      return {
        category: fallbackCategory,
        urgency: fallbackCategory === 'safety' ? 'EMERGENCY' : 'NORMAL',
      };
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    const allowedCategories = [
      'road',
      'streetlight',
      'garbage',
      'drainage',
      'water',
      'animal',
      'safety',
    ];

    const category = allowedCategories.includes(parsed?.category)
      ? parsed.category
      : fallbackCategory;

    const urgency =
      parsed?.urgency === 'EMERGENCY' || category === 'safety'
        ? 'EMERGENCY'
        : 'NORMAL';

    return {
      category,
      urgency,
    };
  } catch (error) {
    console.error('Gemini problem classification failed:', error);

    return {
      category: fallbackCategory,
      urgency: fallbackCategory === 'safety' ? 'EMERGENCY' : 'NORMAL',
    };
  }
}

function pickOfficerByCategory(officer: any, category: string) {
  if (!officer) {
    return {
      role: 'Ward Office',
      name: null,
      phone: null,
    };
  }

  if (category === 'garbage') {
    return {
      role: 'Junior Health Inspector / Senior Health Inspector',
      name: officer.juniorHealthInspector || officer.seniorHealthInspector || null,
      phone: officer.juniorHealthInspectorPhone || officer.seniorHealthInspectorPhone || null,
    };
  }

  if (category === 'animal') {
    return {
      role: 'Animal Husbandry Officer',
      name: officer.animalHusbandryOfficer || null,
      phone: officer.animalHusbandryOfficerPhone || null,
    };
  }

  if (
    category === 'road' ||
    category === 'streetlight' ||
    category === 'drainage' ||
    category === 'water'
  ) {
    return {
      role: 'Assistant Engineer / Assistant Executive Engineer',
      name:
        officer.assistantEngineer ||
        officer.assistantExecutiveEngineer ||
        officer.executiveEngineer ||
        null,
      phone:
        officer.assistantEngineerPhone ||
        officer.assistantExecutiveEngineerPhone ||
        officer.executiveEngineerPhone ||
        null,
    };
  }

  return {
    role: 'Ward Officer / Emergency Response',
    name:
      officer.assistantEngineer ||
      officer.juniorHealthInspector ||
      officer.revenueOfficer ||
      null,
    phone:
      officer.assistantEngineerPhone ||
      officer.juniorHealthInspectorPhone ||
      officer.revenueOfficerPhone ||
      null,
  };
}

function getWardScore(
  ward: any,
  problemText: string,
  detectedTargets: string[],
  pincodeConstituency?: string | null
) {
  let score = 0;

  const wardName = ward.wardName || '';
  const assembly = ward.assemblyConstituency || '';
  const mpConstituency = ward.mpConstituency || '';
  const zoneName = ward.zoneName || '';
  const division = ward.division || '';
  const subDivision = ward.subDivision || '';

  const wardCompact = compactText(wardName);
  const assemblyCompact = compactText(assembly);
  const mpCompact = compactText(mpConstituency);

  for (const target of detectedTargets) {
    if (wardCompact === target) score += 120;
    if (assemblyCompact === target) score += 100;
    if (mpCompact === target) score += 70;

    if (wardCompact.startsWith(target) && target.length >= 6) score += 80;
    if (assemblyCompact.startsWith(target) && target.length >= 6) score += 75;
  }

  if (includesArea(problemText, wardName)) score += 110;
  if (includesArea(problemText, assembly)) score += 90;
  if (includesArea(problemText, mpConstituency)) score += 55;
  if (includesArea(problemText, zoneName)) score += 25;
  if (includesArea(problemText, division)) score += 35;
  if (includesArea(problemText, subDivision)) score += 40;

  if (pincodeConstituency) {
    const pincodeCompact = compactText(pincodeConstituency);

    if (assemblyCompact === pincodeCompact) score += 85;
    if (wardCompact === pincodeCompact) score += 85;
  }

  if (detectedTargets.length === 0) {
    return score;
  }

  const hasStrongTargetMatch = detectedTargets.some((target) => {
    return (
      wardCompact === target ||
      assemblyCompact === target ||
      wardCompact.startsWith(target) ||
      assemblyCompact.startsWith(target)
    );
  });

  if (!hasStrongTargetMatch) {
    score -= 50;
  }

  return score;
}

async function findBestWard(problemText: string, pincode?: string) {
  const detectedTargets = getDetectedAreaTargets(problemText);

  const wards = await prisma.ward.findMany({
    include: {
      officers: true,
    },
    orderBy: {
      wardNo: 'asc',
    },
  });

  if (wards.length === 0) {
    return null;
  }

  let pincodeConstituency: string | null = null;

  if (pincode) {
    const constituency = await prisma.constituency.findUnique({
      where: {
        pincode,
      },
    });

    pincodeConstituency = constituency?.name || null;
  }

  const scoredWards = wards
    .map((ward: any) => ({
      ward,
      score: getWardScore(ward, problemText, detectedTargets, pincodeConstituency),
    }))
    .sort((a, b) => b.score - a.score);

  if (scoredWards[0]?.score > 0) {
    return scoredWards[0].ward;
  }

  if (pincodeConstituency) {
    const pincodeCompact = compactText(pincodeConstituency);

    const wardFromPincode = wards.find((ward: any) => {
      const assemblyCompact = compactText(ward.assemblyConstituency || '');
      return assemblyCompact === pincodeCompact;
    });

    if (wardFromPincode) {
      return wardFromPincode;
    }
  }

  return wards[0];
}

async function getComplaintScorecard(wardId: string, category: string) {
  const complaints = await prisma.civicComplaint.findMany({
    where: {
      wardId,
      category,
    },
  });

  const fulfilled = complaints.filter((complaint) =>
    ['FULFILLED', 'RESOLVED', 'COMPLETED'].includes(complaint.status.toUpperCase())
  ).length;

  const ignored = complaints.filter((complaint) =>
    ['IGNORED', 'PENDING', 'UNRESOLVED', 'REJECTED'].includes(complaint.status.toUpperCase())
  ).length;

  const total = fulfilled + ignored;
  const resolutionScore = total > 0 ? Math.round((fulfilled / total) * 100) : 0;

  return {
    fulfilled,
    ignored,
    total,
    resolutionScore,
  };
}

export async function generateProblemMapping(problemText: string, pincode?: string) {
  const classification = await classifyProblemWithAI(problemText);
  const categoryKey = classification.category;
  const urgency = classification.urgency;

  const ward = await findBestWard(problemText, pincode);

  if (!ward) {
    return `No ward data was found in the database. Please import ward data first.

\`\`\`json
{
  "politicianId": "",
  "level": "Ward",
  "category": "${categoryKey}",
  "urgency": "${urgency}",
  "wardName": "",
  "wardNo": null,
  "responsibleDepartment": "",
  "officerRole": "",
  "officerName": null,
  "officerPhone": null,
  "civicHelpline": "1533",
  "emergencyHelpline": "112",
  "fulfilled": 0,
  "ignored": 0,
  "resolutionScore": 0
}
\`\`\``;
  }

  const category = await prisma.problemCategory.findUnique({
    where: {
      key: categoryKey,
    },
  });

  const officer = ward.officers[0] || null;
  const selectedOfficer = pickOfficerByCategory(officer, categoryKey);
  const scorecard = await getComplaintScorecard(ward.id, categoryKey);

  const politician = ward.assemblyConstituency
    ? await prisma.politician.findFirst({
        where: {
          constituencyRef: {
            name: {
              contains: ward.assemblyConstituency,
              mode: 'insensitive',
            },
          },
        },
      })
    : null;

  const responsibleDepartment =
    category?.responsibleDepartment ||
    selectedOfficer.role ||
    'Ward Office / Civic Department';

  const explanation = `This issue is classified as ${
    category?.label || categoryKey
  }. It is mapped to Ward ${ward.wardNo} - ${
    ward.wardName
  }. The likely responsible department is ${responsibleDepartment}. For civic complaints in Bengaluru, use helpline 1533. For emergencies, use 112.`;

  return `${explanation}

Ward Details:
Ward No: ${ward.wardNo}
Ward Name: ${ward.wardName}
Zone: ${ward.zoneName || 'Not available'}
Assembly Constituency: ${ward.assemblyConstituency || 'Not available'}

Responsible Contact:
Role: ${selectedOfficer.role}
Name: ${selectedOfficer.name || 'Not available'}
Phone: ${selectedOfficer.phone || 'Not available'}

Problem Scorecard:
Fulfilled Complaints: ${scorecard.fulfilled}
Ignored / Pending Complaints: ${scorecard.ignored}
Resolution Score: ${scorecard.resolutionScore}%

\`\`\`json
{
  "politicianId": "${politician?.id || ''}",
  "level": "Ward",
  "category": "${categoryKey}",
  "urgency": "${urgency}",
  "wardName": "${ward.wardName}",
  "wardNo": ${ward.wardNo},
  "zoneName": "${ward.zoneName || ''}",
  "assemblyConstituency": "${ward.assemblyConstituency || ''}",
  "responsibleDepartment": "${responsibleDepartment}",
  "officerRole": "${selectedOfficer.role}",
  "officerName": ${JSON.stringify(selectedOfficer.name || null)},
  "officerPhone": ${JSON.stringify(selectedOfficer.phone || null)},
  "civicHelpline": "1533",
  "emergencyHelpline": "112",
  "fulfilled": ${scorecard.fulfilled},
  "ignored": ${scorecard.ignored},
  "resolutionScore": ${scorecard.resolutionScore}
}
\`\`\``;
}

export async function generateVotingGuide(prompt: string) {
  const fallback =
    'Based on the available candidate and representative data, the guide compares civic score, attendance, election performance, declared criminal cases, and issue priorities. This is a neutral guide, not an endorsement.';

  if (!genAI) {
    return fallback;
  }

  try {
    const geminiPrompt = `
You are a neutral voting guide for an Indian civic app.

Do not endorse a party.
Do not use emotional or biased language.
Compare candidates based only on the user priorities and available candidate data.

User input:
${prompt}

Give a short practical explanation for voters.
`;

    const text = await askGemini(geminiPrompt);
    return text || fallback;
  } catch (error) {
    console.error('Gemini voting guide failed:', error);
    return fallback;
  }
}