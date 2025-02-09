
import { CrimeRecord } from "@/types/crime";
import { CrimeRecordCard } from "./CrimeRecordCard";

interface CrimeSearchResultsProps {
  results: CrimeRecord[];
  searchTerm: string;
}

export function CrimeSearchResults({ results, searchTerm }: CrimeSearchResultsProps) {
  if (results.length === 0 && searchTerm) {
    return (
      <p className="text-sm text-muted-foreground">
        No results found for "{searchTerm}"
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((crime, index) => (
        <CrimeRecordCard key={index} crime={crime} />
      ))}
    </div>
  );
}
