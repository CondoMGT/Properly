import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Header = ({ title }: { title: string }) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center font-nunito text-3xl">
          {title}
        </CardTitle>
        <CardDescription className="sr-only">
          This is the {title} page
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
