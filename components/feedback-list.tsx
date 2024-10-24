"use client";

import { Star } from "lucide-react";
// import { useState } from "react";

interface Feedback {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  request: {
    title: string;
  };
}

const dummyFeedback: Feedback[] = [
  {
    id: "1",
    rating: 5,
    comment:
      "The maintenance team was quick and efficient. They fixed the issue in no time!",
    createdAt: "2023-06-01T10:00:00Z",
    request: {
      title: "Leaky Faucet Repair",
    },
  },
  {
    id: "2",
    rating: 4,
    comment:
      "Good service, but it took a bit longer than expected to get someone out here.",
    createdAt: "2023-05-28T14:30:00Z",
    request: {
      title: "Broken Air Conditioning",
    },
  },
  {
    id: "3",
    rating: 3,
    comment:
      "The issue was resolved, but the communication could have been better.",
    createdAt: "2023-05-25T09:15:00Z",
    request: {
      title: "Clogged Drain",
    },
  },
  {
    id: "4",
    rating: 5,
    comment:
      "Excellent service! The maintenance staff was very professional and courteous.",
    createdAt: "2023-05-20T16:45:00Z",
    request: {
      title: "Electrical Outlet Replacement",
    },
  },
  {
    id: "5",
    rating: 4,
    comment:
      "The repair was done well, but it would have been nice to get an estimated time of arrival.",
    createdAt: "2023-05-15T11:20:00Z",
    request: {
      title: "Broken Door Lock",
    },
  },
];

export default function FeedbackList() {
  // const [feedback, setFeedback] = useState<Feedback[]>(dummyFeedback || []);
  // const [error, setError] = useState("");

  // useEffect(() => {
  //   fetchFeedback();
  // }, []);

  // const fetchFeedback = async () => {
  //   try {
  //     const response = await fetch("/api/feedback");
  //     if (response.ok) {
  //       const data = await response.json();
  //       setFeedback(data);
  //     } else {
  //       setError("Failed to fetch feedback");
  //       // Use dummy data if API fails
  //       setFeedback(dummyFeedback);
  //     }
  //   } catch (error) {
  //     setError("An error occurred. Please try again.");
  //     // Use dummy data if API fails
  //     setFeedback(dummyFeedback);
  //   }
  // };

  // if (error) {
  //   return <div className="text-red-500">{error}</div>;
  // }

  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-2xl font-bold mb-4">Feedback List</h2>
      {dummyFeedback.map((item) => (
        <div
          key={item.id}
          className="bg-white shadow-md rounded-lg p-4 space-y-2"
        >
          <h3 className="text-lg font-semibold">{item.request.title}</h3>
          <div className="flex items-center">
            <span className="text-sm mr-2">Rating:</span>
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`w-5 h-5 ${
                  index < item.rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill={index < item.rating ? "#facc15" : "#d1d5db"}
              />
            ))}
          </div>
          <p className="text-gray-600">{item.comment}</p>
          <p className="text-sm text-gray-500">
            Submitted on: {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
