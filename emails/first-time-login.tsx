import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ProperlyFirstTimeLoginEmailProps {
  userFirstname?: string;
  loginLink?: string;
  temp?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const ProperlyFirstTimeLoginEmail = ({
  userFirstname,
  loginLink,
  temp,
}: ProperlyFirstTimeLoginEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Properly: Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <h1 className="text-2xl text-center font-semibold">
            Properly Solutions Inc.
          </h1>
          <Section>
            {userFirstname && <Text style={text}>Hi {userFirstname},</Text>}
            <Text style={text}>
              Thank you for registering for your <strong>Properly</strong>{" "}
              account. You can access your dashboard here:
            </Text>
            <Button style={button} href={loginLink}>
              Login Here
            </Button>
            <Text style={text}>
              Temporary Password: <strong>{temp}</strong>
            </Text>
            <Text style={text}>
              After login in, you will asked to reset your password.
            </Text>
            <Text style={text}>
              To keep your account secure, please don&apos;t forward this email
              to anyone.
            </Text>
            <Text style={text}>Property Management, Done Properly!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

ProperlyFirstTimeLoginEmail.PreviewProps = {
  userFirstname: "Alan",
  resetPasswordLink: "https://dropbox.com",
  temp: "Test",
} as ProperlyFirstTimeLoginEmailProps;

export default ProperlyFirstTimeLoginEmail;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const anchor = {
  textDecoration: "underline",
};
