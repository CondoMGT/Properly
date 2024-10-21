import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/constants";

export const FaqComp = () => {
  return (
    <div className="w-full max-w-[1322px] mx-auto h-auto flex flex-col justify-start items-start gap-6 p-4">
      <div className="self-stretch text-black text-4xl md:text-5xl font-semibold font-nunito leading-[60px] text-center md:text-left">
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
                <div className="text-custom-5 text-lg font-semibold font-kumbh leading-7">
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
