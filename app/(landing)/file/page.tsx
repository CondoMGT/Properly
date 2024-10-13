"use client";

import { useState } from "react";

export default function Home() {
  const [jsonData, setJsonData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setJsonData(result.data);
        setError(null);
      } else {
        setError(result.error || "An error occurred");
        setJsonData(null);
      }
    } catch (err) {
      setError("An error occurred while processing the file");
      setJsonData(null);
    }
  };

  console.log("FILE UPLOAD", jsonData);
  console.log("ERROR", error);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">CSV/Excel to JSON Converter</h1>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
          className="mb-4"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {jsonData && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Converted JSON:</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
              {JSON.stringify(jsonData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
