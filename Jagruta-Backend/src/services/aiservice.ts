import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../db/prisma';

const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);

const genAI = hasGeminiKey
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
  : null;

function buildFallbackSummary(politician: any) {
  return `${politician.name} represents ${politician.constituencyRef.name} as a ${politician.level}. Their civic score is ${politician.score}/100 with ${politician.attendance}% attendance and ${politician.yearsInOffice} years in office. They have ${politician.criminalCases} recorded criminal case(s). Overall, this profile shows ${
    politician.score >= 80 ? 'strong' : politician.score >= 65 ? 'moderate' : 'developing'
  } public performance based on the available indicators.`;
}

async function askGemini(prompt: string) {
  if (!genAI) return null;

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generatePoliticianSummary(politicianId: string) {
  const politician = await prisma.politician.findUnique({
    where: { id: politicianId },
    include: {
      constituencyRef: true
    }
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
Criminal Cases: ${politician.criminalCases}
`;

    const text = await askGemini(prompt);
    return text || buildFallbackSummary(politician);
  } catch (error) {
    console.error('Gemini politician summary failed:', error);
    return buildFallbackSummary(politician);
  }
}

export async function generateProblemMapping(problemText: string) {
  const lower = problemText.toLowerCase().trim();

  let politicianId = 'p1';
  let level = 'MLA';
  let area = 'Basavanagudi';

  if (
    lower.includes('jayanagar') ||
    lower.includes('jayanagra') ||
    lower.includes('jaya nagar') ||
    lower.includes('jaya nagra')
  ) {
    politicianId = 'p2';
    area = 'Jayanagar';
  } else if (
    lower.includes('btm') ||
    lower.includes('b.t.m') ||
    lower.includes('b t m')
  ) {
    politicianId = 'p3';
    area = 'B.T.M Layout';
  } else if (
    lower.includes('basavanagudi') ||
    lower.includes('basavangudi') ||
    lower.includes('basavana gudi') ||
    lower.includes('basavan gudi')
  ) {
    politicianId = 'p1';
    area = 'Basavanagudi';
  } else if (
    lower.includes('rajajinagar') ||
    lower.includes('rajaji nagar')
  ) {
    politicianId = 'p4';
    area = 'Rajajinagar';
  } else if (
    lower.includes('malleshwaram') ||
    lower.includes('malleswaram') ||
    lower.includes('malleswaram')
  ) {
    politicianId = 'p5';
    area = 'Malleshwaram';
  } else if (lower.includes('hebbal')) {
    politicianId = 'p6';
    area = 'Hebbal';
  } else if (lower.includes('yelahanka')) {
    politicianId = 'p7';
    area = 'Yelahanka';
  } else if (lower.includes('mahadevapura')) {
    politicianId = 'p8';
    area = 'Mahadevapura';
  } else if (
    lower.includes('cv raman') ||
    lower.includes('c.v. raman') ||
    lower.includes('raman nagar')
  ) {
    politicianId = 'p9';
    area = 'C.V. Raman Nagar';
  } else if (lower.includes('shivajinagar')) {
    politicianId = 'p10';
    area = 'Shivajinagar';
  }

  if (
    lower.includes('streetlight') ||
    lower.includes('street light') ||
    lower.includes('garbage') ||
    lower.includes('pothole') ||
    lower.includes('drainage') ||
    lower.includes('water') ||
    lower.includes('road') ||
    lower.includes('sewage')
  ) {
    level = 'MLA';
  }

  const fallback = `This issue appears to involve local civic infrastructure in ${area}. Since you mentioned "${problemText}", the responsible level is likely ${level}. The selected representative is mapped based on the area mentioned in your complaint.

\`\`\`json
{
  "politicianId": "${politicianId}",
  "level": "${level}"
}
\`\`\``;

  if (!genAI) {
    return fallback;
  }

  try {
    const prompt = `
You are a Bengaluru civic jurisdiction assistant.

User issue:
${problemText}

Important:
- Do not invent facts.
- The detected area is: ${area}
- The mapped politicianId must be: ${politicianId}
- The responsible level must be: ${level}
- Return a short explanation.
- Always include the exact JSON block at the end.

Required final format:

Short explanation here.

\`\`\`json
{
  "politicianId": "${politicianId}",
  "level": "${level}"
}
\`\`\`
`;

    const text = await askGemini(prompt);
    return text || fallback;
  } catch (error) {
    console.error('Gemini problem mapper failed:', error);
    return fallback;
  }
}

export async function generateVotingGuide(prompt: string) {
  const fallback =
    'Based on your priorities, Candidate A appears to be a strong match because of civic score, attendance, and infrastructure alignment. This is a neutral guide, not an endorsement.';

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