import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const crimeData = {
  "Theft": [
    { date: "2024-01-15", location: "Downtown", status: "Solved" },
    { date: "2024-01-10", location: "West District", status: "Under Investigation" },
    { date: "2024-01-05", location: "South Area", status: "Solved" },
  ],
  "Assault": [
    { date: "2024-01-20", location: "North District", status: "Under Investigation" },
    { date: "2024-01-12", location: "East Side", status: "Solved" },
  ],
  "Vandalism": [
    { date: "2024-01-18", location: "Central Park", status: "Solved" },
    { date: "2024-01-08", location: "Shopping District", status: "Under Investigation" },
  ],
};

export function CrimeHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Array<{ date: string; location: string; status: string }>>([]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const normalizedSearch = value.toLowerCase();
    
    // Search through crime types
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
          
          <div className="space-y-2">
            {results.length > 0 ? (
              results.map((crime, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border/50 p-3 hover:bg-accent/50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{crime.date}</p>
                      <p className="text-sm text-muted-foreground">{crime.location}</p>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      crime.status === "Solved" 
                        ? "bg-green-500/20 text-green-500" 
                        : "bg-yellow-500/20 text-yellow-500"
                    }`}>
                      {crime.status}
                    </span>
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