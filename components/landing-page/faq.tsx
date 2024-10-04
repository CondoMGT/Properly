import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does Properly help tenants with maintenance requests?",
    answer:
      "Submit requests quickly, upload photos or videos for clarity, and track the progress in real-time. This ensures transparency and reduces the likelihood of delays or miscommunication.",
  },
  {
    question: "How does the AI-powered troubleshooting work?",
    answer: "",
  },
  {
    question: "What are the pricing plans?",
    answer: "",
  },
  {
    question: "How does Properly prevent legal disputes and financial losses?",
    answer: "",
  },
];

export const FaqComp = () => {
  return (
    <div className="w-full max-w-[1322px] mx-auto h-auto flex flex-col justify-start items-start gap-6 p-4">
      <div className="self-stretch text-black text-[2.5rem] font-medium font-kyiv leading-[60px] text-center md:text-left">
        Our Frequently Asked Questions
      </div>
      <div className="flex-col justify-end items-start gap-2 flex w-full">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={`item-${index + 1}`}
              value={`item-${index + 1}`}
              className="pl-4"
            >
              <AccordionTrigger>
                <div className="text-custom-5 text-xl font-medium font-kumbh leading-7">
                  {faq.question}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="self-stretch text-custom-6 text-lg font-normal font-kumbh leading-7 tracking-tight">
                  {faq.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {/* <div className="self-stretch p-4 bg-white border-b border-[#e1e1e2] flex-col justify-center items-start gap-4">
          <div className="flex justify-between items-center">
            <div className="text-[#202024] text-[1.375rem] font-medium font-kumbh leading-normal">
              How does Properly help tenants with maintenance requests?
            </div>
            <div className="w-4 h-4 relative border border-black flex items-center justify-center rounded-full">
              <span className="text-sm font-bold leading-none">&minus;</span>
            </div>
          </div>
          <div className="self-stretch text-[#3c3c43] text-lg font-light font-kumbh leading-7">
            Tenants can easily submit requests, upload visual documentation, and
            track the status of their issues in real-time.
          </div>
        </div> */}
      </div>
    </div>
  );
};
