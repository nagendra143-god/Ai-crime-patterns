import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const crimeData = {
  "Theft": [
    { 
      date: "2024-01-15", 
      location: "Downtown", 
      status: "Solved",
      caseNumber: "TH-2024-001",
      description: "Shoplifting incident at local convenience store",
      suspect: "John Doe",
      evidence: "CCTV footage, witness statements",
      investigatingOfficer: "Officer Sarah Johnson",
      resolution: "Suspect apprehended and charged"
    },
    { 
      date: "2024-01-10", 
      location: "West District", 
      status: "Under Investigation",
      caseNumber: "TH-2024-002",
      description: "Vehicle theft from parking garage",
      suspect: "Unknown",
      evidence: "Security camera footage, fingerprints",
      investigatingOfficer: "Detective Mike Brown",
      resolution: "Pending investigation"
    },
    { 
      date: "2024-01-05", 
      location: "South Area", 
      status: "Solved",
      caseNumber: "TH-2024-003",
      description: "Residential burglary",
      suspect: "Jane Smith",
      evidence: "DNA samples, stolen items recovered",
      investigatingOfficer: "Officer David Wilson",
      resolution: "Suspect arrested and property recovered"
    },
  ],
  "Assault": [
    { 
      date: "2024-01-20", 
      location: "North District", 
      status: "Under Investigation",
      caseNumber: "AS-2024-001",
      description: "Physical altercation outside nightclub",
      suspect: "Under Investigation",
      evidence: "Surveillance footage, witness testimonies",
      investigatingOfficer: "Detective Lisa Martinez",
      resolution: "Active investigation ongoing"
    },
    { 
      date: "2024-01-12", 
      location: "East Side", 
      status: "Solved",
      caseNumber: "AS-2024-002",
      description: "Domestic violence incident",
      suspect: "Robert Johnson",
      evidence: "Photos, medical reports, witness statements",
      investigatingOfficer: "Officer James Parker",
      resolution: "Restraining order issued, suspect in custody"
    },
  ],
  "Vandalism": [
    { 
      date: "2024-01-18", 
      location: "Central Park", 
      status: "Solved",
      caseNumber: "VD-2024-001",
      description: "Graffiti on public property",
      suspect: "Two juveniles identified",
      evidence: "Photos, spray paint cans, witness reports",
      investigatingOfficer: "Officer Emily Chen",
      resolution: "Community service assigned"
    },
    { 
      date: "2024-01-08", 
      location: "Shopping District", 
      status: "Under Investigation",
      caseNumber: "VD-2024-002",
      description: "Property damage to storefront",
      suspect: "Unknown",
      evidence: "Security footage, broken glass samples",
      investigatingOfficer: "Detective Tom Rodriguez",
      resolution: "Investigation in progress"
    },
  ],
};

export function CrimeHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Array<{
    date: string;
    location: string;
    status: string;
    caseNumber: string;
    description: string;
    suspect: string;
    evidence: string;
    investigatingOfficer: string;
    resolution: string;
  }>>([]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const normalizedSearch = value.toLowerCase();
    
    const matchedCrimes = Object.entries(crimeData).find(([crimeType]) => 
      crimeType.toLowerCase().includes(normalizedSearch)
    );

    if (matchedCrimes) {
      setResults(matchedCrimes[1]);
    } else {
      setResults([]);
    }
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          Crime History Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter type of crime (e.g., Theft, Assault)"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
          
          <div className="space-y-4">
            {results.length > 0 ? (
              results.map((crime, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border/50 p-4 hover:bg-accent/50 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">Case #{crime.caseNumber}</p>
                      <p className="text-sm text-muted-foreground">{crime.date}</p>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      crime.status === "Solved" 
                        ? "bg-green-500/20 text-green-500" 
                        : "bg-yellow-500/20 text-yellow-500"
                    }`}>
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
                  </div>
                </div>
              ))
            ) : searchTerm && (
              <p className="text-sm text-muted-foreground">No results found for "{searchTerm}"</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}