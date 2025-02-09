
import { ExternalLink } from "lucide-react";
import { CrimeRecord } from "@/types/crime";

interface CrimeRecordCardProps {
  crime: CrimeRecord;
}

export function CrimeRecordCard({ crime }: CrimeRecordCardProps) {
  return (
    <div className="rounded-lg border border-border/50 p-4 hover:bg-accent/50 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium">Case #{crime.caseNumber}</p>
          <p className="text-sm text-muted-foreground">{crime.date}</p>
        </div>
        <span
          className={`text-sm px-2 py-1 rounded-full ${
            crime.status === "Solved"
              ? "bg-green-500/20 text-green-500"
              : "bg-yellow-500/20 text-yellow-500"
          }`}
        >
          {crime.status}
        </span>
      </div>

      <div className="grid gap-2 text-sm">
        <div className="grid grid-cols-2 gap-x-4">
          <p className="font-medium">Location:</p>
          <p>{crime.location}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <p className="font-medium">Description:</p>
          <p>{crime.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <p className="font-medium">Suspect:</p>
          <p>{crime.suspect}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <p className="font-medium">Evidence:</p>
          <p>{crime.evidence}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <p className="font-medium">Investigating Officer:</p>
          <p>{crime.investigatingOfficer}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <p className="font-medium">Resolution:</p>
          <p>{crime.resolution}</p>
        </div>
        {crime.references && crime.references.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4">
            <p className="font-medium">Reference Links:</p>
            <div className="space-y-1">
              {crime.references.map((ref, idx) => (
                <a
                  key={idx}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-500 hover:text-blue-600"
                >
                  {ref.name}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
