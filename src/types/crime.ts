
export interface Reference {
  name: string;
  url: string;
}

export interface CrimeRecord {
  date: string;
  location: string;
  status: string;
  caseNumber: string;
  description: string;
  suspect: string;
  evidence: string;
  investigatingOfficer: string;
  resolution: string;
  references?: Reference[];
}

export type CrimeData = {
  [key: string]: CrimeRecord[];
};
