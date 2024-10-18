import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What types of properties can I manage with Properly?",
    answer:
      "Properly is designed for various property types, including residential, commercial, and multi-family units.",
  },

  {
    question: "How does the pricing structure work?",
    answer:
      "We offer tiered pricing plans based on the number of properties managed and additional tenant capacities. Contact us for specific details on our packages.",
  },

  {
    question: "Can tenants access Properly on mobile devices?",
    answer:
      "Yes, Properly is accessible via mobile devices, allowing tenants to submit requests and receive updates on the go.",
  },

  {
    question:
      "What happens if a tenant experiences a maintenance issue after hours?",
    answer:
      "Tenants can submit requests at any time, and property managers will be notified immediately. The platform enables communication to address urgent issues promptly.",
  },
  {
    question: "How does Properly help tenants with maintenance requests?",
    answer:
      "Submit requests quickly, upload photos or videos for clarity, and track the progress in real-time. This ensures transparency and reduces the likelihood of delays or miscommunication.",
  },

  {
    question: "How do I train my team to use Properly?",
    answer:
      "We provide comprehensive onboarding support and training materials to ensure your team can effectively use the platform from day one.",
  },

  {
    question:
      "Can I integrate Properly with my existing property management systems?",
    answer:
      "Yes! Properly offers integration options to help streamline your operations and enhance functionality with your current systems.",
  },

  {
    question: "How does Properly handle tenant feedback?",
    answer:
      "Properly collects and analyzes tenant feedback through automated surveys, helping you identify areas for improvement and enhance service quality.",
  },

  {
    question: "What if I need assistance with Properly?",
    answer:
      "Our customer support team is available to assist you with any questions or issues you may encounter while using the platform.",
  },

  {
    question: "Is there a free trial available?",
    answer:
      "Yes! We offer a free trial period so you can explore Properly's features and see how it fits your property management needs.",
  },

  {
    question: "How do I get started with Properly?",
    answer:
      "To get started, simply reach out to us through our website, and our team will guide you through the setup process!",
  },
];

export const FaqComp = () => {
  return (
    <div className="w-full max-w-[1322px] mx-auto h-auto flex flex-col justify-start items-start gap-6 p-4">
      <div className="self-stretch text-black text-4xl md:text-5xl font-semibold font-kyiv leading-[60px] text-center md:text-left">
        Our Frequently Asked Questions
      </div>
      <div className="flex-col justify-end items-start gap-2 flex w-full">
        <Accordion
          type="single"
          collapsible
          className="w-full px-2 bg-white"
          defaultValue="item-1"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={`item-${index + 1}`}
              value={`item-${index + 1}`}
              className="pl-4"
            >
              <AccordionTrigger className="text-start">
                <div className="text-custom-5 text-lg font-medium font-kumbh leading-7">
                  {faq.question}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="self-stretch text-custom-6 text-base text-muted-foreground font-normal font-kumbh leading-7 tracking-tight">
                  {faq.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
