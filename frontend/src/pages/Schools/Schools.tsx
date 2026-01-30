import { useEffect, useState } from "react";
import { SchoolCard } from "./components/SchoolCard";

interface SchoolAdminDto {
  id: string;
  name: string;
  email: string;
}

interface SchoolDto {
  id: string;
  name: string;
  admins: SchoolAdminDto[];
  createdAt: string; 
}

// TODO: replace with the actual api call. just to test atm
const fetchSchools = async (): Promise<SchoolDto[]> => {
  return [
    {
      id: "1",
      name: "Erasmushogeschool Brussel",
      admins: [
        { id: "a1", name: "Michael Smith", email: "michael@school.com" },
        { id: "a2", name: "Anna de Vries", email: "anna@school.com" },
      ],
      createdAt: "2024-01-29T00:00:00Z",
    },
    {
      id: "2",
      name: "Amsterdam International School",
      admins: [{ id: "a3", name: "Jan Bakker", email: "jan@school.com" }],
      createdAt: "2024-02-10T00:00:00Z",
    },
  ];
};

export default function SchoolsPage() {
  const [schools, setSchools] = useState<SchoolDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchools().then((data) => {
      setSchools(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading schools...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 p-8 bg-muted/30 min-h-screen">
      <div className="mx-auto max-w-4xl space-y-4">
        {schools.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              No schools found. Create a new school!
            </p>
          </div>
        ) : (
          schools.map((school) => (
            <SchoolCard
              key={school.id}
              name={school.name}
              createdAt={new Date(school.createdAt)}
              admins={school.admins}
            />
          ))
        )}
      </div>
    </main>
  );
}
