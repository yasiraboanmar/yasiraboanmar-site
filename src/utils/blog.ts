export function readingTime(body: string | undefined): number {
  if (!body) return 0;
  return Math.ceil(body.split(/\s+/).length / 200);
}

export type CategoryData = {
  label: string;
  color: string;
  gradient: string;
};

export const CATEGORY_MAP: Record<string, CategoryData> = {
  'إدارة_الموارد_البشرية': { label: 'إدارة الموارد البشرية', color: '#2ecc71', gradient: 'linear-gradient(135deg,#0c2a1a,#1b7742)' },
  'الموارد_البشرية':       { label: 'إدارة الموارد البشرية', color: '#2ecc71', gradient: 'linear-gradient(135deg,#0c2a1a,#1b7742)' },
  'نظام العمل':            { label: 'نظام العمل',            color: '#60a5fa', gradient: 'linear-gradient(135deg,#0c1a2e,#1e3a5f)' },
  'حوكمة الموارد البشرية': { label: 'حوكمة الموارد البشرية', color: '#a78bfa', gradient: 'linear-gradient(135deg,#1a0c2e,#3b1a6b)' },
  'العمل الإضافي':         { label: 'العمل الإضافي',         color: '#fb923c', gradient: 'linear-gradient(135deg,#2a1400,#7c2d00)' },
  'GOSI':                  { label: 'GOSI',                  color: '#2dd4bf', gradient: 'linear-gradient(135deg,#001a18,#0d4f47)' },
};

// EN equivalents — same visual treatment
export const CATEGORY_MAP_EN: Record<string, CategoryData> = {
  'HR_Management':   { label: 'HR Management',      color: '#2ecc71', gradient: 'linear-gradient(135deg,#0c2a1a,#1b7742)' },
  'Human_Resources': { label: 'HR Management',      color: '#2ecc71', gradient: 'linear-gradient(135deg,#0c2a1a,#1b7742)' },
  'HRM':             { label: 'HR Management',      color: '#2ecc71', gradient: 'linear-gradient(135deg,#0c2a1a,#1b7742)' },
  'Labor Law':       { label: 'Labor Law',           color: '#60a5fa', gradient: 'linear-gradient(135deg,#0c1a2e,#1e3a5f)' },
  'HR Governance':   { label: 'HR Governance',       color: '#a78bfa', gradient: 'linear-gradient(135deg,#1a0c2e,#3b1a6b)' },
  'Overtime':        { label: 'Overtime',            color: '#fb923c', gradient: 'linear-gradient(135deg,#2a1400,#7c2d00)' },
  'GOSI':            { label: 'GOSI',                color: '#2dd4bf', gradient: 'linear-gradient(135deg,#001a18,#0d4f47)' },
};

export function getCategory(tags: string[], map: Record<string, CategoryData> = CATEGORY_MAP): CategoryData | null {
  for (const tag of tags) {
    if (map[tag]) return map[tag];
  }
  return null;
}
