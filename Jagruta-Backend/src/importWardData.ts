import fs from 'fs';
import path from 'path';
import { prisma } from './db/prisma';

type WardCsvRow = {
  wardNo: string;
  wardName: string;
  zoneName?: string;
  division?: string;
  subDivision?: string;
  assemblyConstituency?: string;
  mpConstituency?: string;

  jointCommissioner?: string;
  jointCommissionerPhone?: string;
  deputyCommissioner?: string;
  deputyCommissionerPhone?: string;
  superintendentEngineer?: string;
  superintendentEngineerPhone?: string;
  chiefEngineer?: string;
  chiefEngineerPhone?: string;
  executiveEngineer?: string;
  executiveEngineerPhone?: string;
  assistantExecutiveEngineer?: string;
  assistantExecutiveEngineerPhone?: string;
  assistantEngineer?: string;
  assistantEngineerPhone?: string;
  juniorHealthInspector?: string;
  juniorHealthInspectorPhone?: string;
  seniorHealthInspector?: string;
  seniorHealthInspectorPhone?: string;
  revenueOfficer?: string;
  revenueOfficerPhone?: string;
  assistantRevenueOfficer?: string;
  assistantRevenueOfficerPhone?: string;
  animalHusbandryOfficer?: string;
  animalHusbandryOfficerPhone?: string;
};

function parseCsvLine(line: string) {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      current += '"';
      i++;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  result.push(current.trim());
  return result;
}

function parseCsv(content: string): WardCsvRow[] {
  const lines = content.trim().split(/\r?\n/);

  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).filter(Boolean).map((line) => {
    const values = parseCsvLine(line);
    const row: any = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    return row as WardCsvRow;
  });
}

const categories = [
  {
    id: 'cat-road',
    key: 'road',
    label: 'Road / Pothole',
    responsibleDepartment: 'Engineering Department',
    suggestedOfficerRole: 'Assistant Engineer / Assistant Executive Engineer',
    emergencyLevel: 'NORMAL',
  },
  {
    id: 'cat-streetlight',
    key: 'streetlight',
    label: 'Streetlight',
    responsibleDepartment: 'Electrical / Engineering Department',
    suggestedOfficerRole: 'Assistant Engineer / Assistant Executive Engineer',
    emergencyLevel: 'NORMAL',
  },
  {
    id: 'cat-garbage',
    key: 'garbage',
    label: 'Garbage / Solid Waste',
    responsibleDepartment: 'Health Department',
    suggestedOfficerRole: 'Junior Health Inspector / Senior Health Inspector',
    emergencyLevel: 'NORMAL',
  },
  {
    id: 'cat-drainage',
    key: 'drainage',
    label: 'Drainage / Sewage',
    responsibleDepartment: 'Engineering Department',
    suggestedOfficerRole: 'Assistant Engineer / Executive Engineer',
    emergencyLevel: 'NORMAL',
  },
  {
    id: 'cat-water',
    key: 'water',
    label: 'Water Supply',
    responsibleDepartment: 'Water Supply / Civic Engineering',
    suggestedOfficerRole: 'Assistant Engineer / Executive Engineer',
    emergencyLevel: 'NORMAL',
  },
  {
    id: 'cat-animal',
    key: 'animal',
    label: 'Animal Issue',
    responsibleDepartment: 'Animal Husbandry Department',
    suggestedOfficerRole: 'Animal Husbandry Officer',
    emergencyLevel: 'NORMAL',
  },
  {
    id: 'cat-safety',
    key: 'safety',
    label: 'Public Safety Emergency',
    responsibleDepartment: 'Emergency Services / Police',
    suggestedOfficerRole: 'Emergency Response',
    emergencyLevel: 'EMERGENCY',
  },
];

async function main() {
  const filePath = path.join(process.cwd(), 'data', 'bengaluru-ward-officers.csv');

  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found: ${filePath}`);
  }

  const rows = parseCsv(fs.readFileSync(filePath, 'utf-8'));

  if (rows.length === 0) {
    throw new Error('Ward CSV has no rows.');
  }

  for (const row of rows) {
    const wardNo = Number(row.wardNo);

    const ward = await prisma.ward.upsert({
      where: {
        wardNo,
      },
      update: {
        wardName: row.wardName,
        zoneName: row.zoneName || null,
        division: row.division || null,
        subDivision: row.subDivision || null,
        assemblyConstituency: row.assemblyConstituency || null,
        mpConstituency: row.mpConstituency || null,
      },
      create: {
        wardNo,
        wardName: row.wardName,
        zoneName: row.zoneName || null,
        division: row.division || null,
        subDivision: row.subDivision || null,
        assemblyConstituency: row.assemblyConstituency || null,
        mpConstituency: row.mpConstituency || null,
      },
    });

    await prisma.wardOfficer.deleteMany({
      where: {
        wardId: ward.id,
      },
    });

    await prisma.wardOfficer.create({
      data: {
        wardId: ward.id,

        jointCommissioner: row.jointCommissioner || null,
        jointCommissionerPhone: row.jointCommissionerPhone || null,
        deputyCommissioner: row.deputyCommissioner || null,
        deputyCommissionerPhone: row.deputyCommissionerPhone || null,
        superintendentEngineer: row.superintendentEngineer || null,
        superintendentEngineerPhone: row.superintendentEngineerPhone || null,
        chiefEngineer: row.chiefEngineer || null,
        chiefEngineerPhone: row.chiefEngineerPhone || null,
        executiveEngineer: row.executiveEngineer || null,
        executiveEngineerPhone: row.executiveEngineerPhone || null,
        assistantExecutiveEngineer: row.assistantExecutiveEngineer || null,
        assistantExecutiveEngineerPhone: row.assistantExecutiveEngineerPhone || null,
        assistantEngineer: row.assistantEngineer || null,
        assistantEngineerPhone: row.assistantEngineerPhone || null,
        juniorHealthInspector: row.juniorHealthInspector || null,
        juniorHealthInspectorPhone: row.juniorHealthInspectorPhone || null,
        seniorHealthInspector: row.seniorHealthInspector || null,
        seniorHealthInspectorPhone: row.seniorHealthInspectorPhone || null,
        revenueOfficer: row.revenueOfficer || null,
        revenueOfficerPhone: row.revenueOfficerPhone || null,
        assistantRevenueOfficer: row.assistantRevenueOfficer || null,
        assistantRevenueOfficerPhone: row.assistantRevenueOfficerPhone || null,
        animalHusbandryOfficer: row.animalHusbandryOfficer || null,
        animalHusbandryOfficerPhone: row.animalHusbandryOfficerPhone || null,
      },
    });
  }

  for (const category of categories) {
    await prisma.problemCategory.upsert({
      where: {
        key: category.key,
      },
      update: category,
      create: category,
    });
  }

  console.log('Ward data import completed.');
  console.log(`Wards imported: ${rows.length}`);
  console.log(`Problem categories imported: ${categories.length}`);
}

main()
  .catch((error) => {
    console.error('Ward import failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });