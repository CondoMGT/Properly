import { ContractorManagement } from "@/components/contractor/contractor-management";
import { Card, CardContent } from "@/components/ui/card";

const ContractorPage = () => {
  return (
    <Card>
      <CardContent>
        <ContractorManagement />
      </CardContent>
    </Card>
  );
};

export default ContractorPage;
