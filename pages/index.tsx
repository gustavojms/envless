import { sample } from "lodash";
import { getSession } from "next-auth/react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Pricing from "@/components/home/Pricing";

type HomeProps = {
  header: string;
  loggedIn: boolean;
};

const Home: React.FC<HomeProps> = ({ header, loggedIn }) => {
  return (
    <div className="mx-auto max-w-screen-xl px-10 xl:px-16">
      <Navigation loggedIn={loggedIn} />
      <Hero header={header} />
      <Features />
      <Pricing />
    </div>
  );
};

export default Home;

export async function getServerSideProps(context: { req: any }) {
  const { req } = context;
  const session = await getSession({ req });
  const user = session?.user;
  const headers = [
    ".envless",
    // "Go .envless",
    // "Delete your .env files",
    // "e2e encrypt your .env",
    // "Sync your app secrets",
    // "Branch your app secrets",
    // "Secure your app secrets",
    // "Manage & share app secrets",
    // "Never leak .env again",
    // "Never slack .env again",
    // "e2e encrypt app secrets",
    // "Never commit .env again",
  ];

  const header = sample(headers);

  return {
    props: {
      header,
      loggedIn: !!user,
    },
  };
}