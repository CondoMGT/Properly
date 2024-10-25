import { cn } from "@/lib/utils";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface ProperlyUserEmailProps {
  username?: string;
  inviteLink?: string;
  inviteFromLocation?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const ProperlyUserEmail = ({
  username,
  inviteLink,
  inviteFromLocation,
}: ProperlyUserEmailProps) => {
  const previewText = `Join Properly Solutions on the Web`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <h1 className={cn("text-2xl text-center font-semibold")}>
                Properly Solutions Inc.
              </h1>
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Join <strong>Properly Solutions Inc.</strong> on the{" "}
              <strong>Web</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello{username ? ` ${username}` : ""},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Properly Solutions</strong> requires you to verify your
              email to get full access to team page.
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={inviteLink}
              >
                Confirm Email
              </Button>
              <Text className="text-center text-[#3c4149] text-[12px]">
                This link will only be valid for the next 15 minutes.
              </Text>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              {username && (
                <>
                  This confirmation email was intended for{" "}
                  <span className="text-black">{username}</span>.
                </>
              )}
              This confirmation was sent from{" "}
              <span className="text-black">{inviteFromLocation}</span>. If you
              were not expecting this confirmation, you can ignore this email.
              If you are concerned about your account's safety, please reply to
              this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ProperlyUserEmail.PreviewProps = {
  username: "alanturing",
  invitedByUsername: "Properly Solutions",
  invitedByEmail: "condotenantmanagement@gmail.com",
  teamName: "Properly Solutions",
  inviteLink: "https://vercel.com/teams/invite/foo",
  inviteFromLocation: "Calgary, AB",
} as ProperlyUserEmailProps;

export default ProperlyUserEmail;
