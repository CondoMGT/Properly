"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JobOpportunity {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
}

const CareerPage = () => {
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating an API call to fetch job opportunities
    const fetchJobs = async () => {
      // Replace this with an actual API call in a real application
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setJobs([
        // {
        //   id: "1",
        //   title: "Software Engineer",
        //   department: "Engineering",
        //   location: "Remote",
        //   description:
        //     "We are looking for a talented software engineer to join our team...",
        // },
        // {
        //   id: "2",
        //   title: "Product Manager",
        //   department: "Product",
        //   location: "Remote",
        //   description:
        //     "Seeking an experienced product manager to lead our product development efforts...",
        // },
      ]);
      setLoading(false);
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen w-full max-w-[1272px] mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">
        Career Opportunities
      </h1>

      {loading ? (
        <p className="text-center">Loading job opportunities...</p>
      ) : jobs.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8 w-[90%] mx-auto">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>
                  {job.department} - {job.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{job.description}</p>
              </CardContent>
              <CardFooter>
                <Button>Apply Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">No Current Openings</h2>
          <p className="mb-8">
            We don&apos;t have any open positions right now, but we&apos;re
            always on the lookout for talent.
          </p>
          <Card className="w-[70%] mx-auto">
            <CardHeader>
              <CardTitle>Stay Connected</CardTitle>
              <CardDescription>
                Be the first to know about new opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full mx-auto max-w-sm items-center gap-1.5">
                <Label htmlFor="email" className="text-left">
                  Email
                </Label>
                <Input type="email" id="email" placeholder="Enter your email" />
              </div>
            </CardContent>
            <CardFooter className="max-w-sm w-full mx-auto items-end px-0">
              <Button className="w-full bg-custom-1 hover:bg-custom-1">
                Subscribe
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CareerPage;
