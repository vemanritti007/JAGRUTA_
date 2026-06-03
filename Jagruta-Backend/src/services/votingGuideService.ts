export function calculateMatchScore(candidate: any, priorities: Record<string, number>) {
  const infrastructureWeight = priorities.infrastructure || 1;
  const safetyWeight = priorities.safety || 1;

  const performancePart = candidate.score * 0.5;
  const attendancePart = candidate.attendance * 0.25;
  const criminalPenalty = candidate.criminalCases * safetyWeight * 4;
  const infrastructureBonus = infrastructureWeight * 3;

  return Math.max(
    0,
    Math.min(100, Math.round(performancePart + attendancePart + infrastructureBonus - criminalPenalty))
  );
}