import { ContractorManagement } from "@/components/contractor/contractor-management";
import { Card, CardContent } from "@/components/ui/card";

const ContractorPage = () => {
  return (
    <Card className="mb-4">
      <CardContent className="pb-0">
        <ContractorManagement />
      </CardContent>
    </Card>
  );
};

export default ContractorPage;
