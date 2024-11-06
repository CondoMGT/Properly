import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";

const AuthErrorPage = () => {
  return (
    <div className="w-full flex items-center justify-center bg-gradient-to-tr from-custom-2/25 to-custom-1/25">
      <Card className="w-full h-screen bg-transparent flex flex-col items-center justify-center">
        <CardHeader className="text-2xl text-center">
          Oops! Something went wrong!
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center text-2xl">
            <TriangleAlert className="text-custom-8 h-8 w-8 mr-2" />
            Authentication Error
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="link"
            className="font-normal w-full"
            size="sm"
            asChild
          >
            <Link href="/auth/login">Back to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthErrorPage;
