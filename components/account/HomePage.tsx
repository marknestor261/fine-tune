import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/react";
import Layout from "components/Layout";
import Image from "next/image";
import NextLink from "next/link";
import screenshot from "public/images/screenshot.png";
import React from "react";
import Signin from "./SignIn";
import useAuthentication from "./useAuthentication";

export default function HomePage() {
  const { isSignedIn } = useAuthentication();

  return (
    <Layout fullPage={true}>
      <Header />
      <div className="my-20 w-full flex flex-col lg:flex-row gap-x-20 gap-y-8">
        <div className="py-10 mx-auto flex-shrink-0 w-96">
          {isSignedIn ? <WelcomeBack /> : <Signin />}
        </div>
        <Promo />
      </div>
      <Footer />
    </Layout>
  );
}

function Header() {
  return (
    <header>
      <h1>
        👋 Trainer
        <span className="font-light ml-4">The missing UI for OpenAI</span>
      </h1>
    </header>
  );
}

function WelcomeBack() {
  return (
    <div className="my-10 w-96">
      <h2 className="text-2xl font-bold">Welcome back!</h2>
      <p className="text-lg">
        <NextLink href="/completions">
          <Button
            auto
            iconRight={<FontAwesomeIcon icon={faChevronRight} />}
            size="large"
          >
            Enter This Way
          </Button>
        </NextLink>
      </p>
    </div>
  );
}

function Promo() {
  return (
    <section>
      <Image {...screenshot} />
      <ul className="mt-8 text-xl list-disc">
        <li>Go beyond the playground</li>
        <li>
          Create <b>fine tune</b> models for prompt completion
        </li>
        <li>
          Upload and manage files for <b>classification</b>{" "}
        </li>
        <li>
          Upload and manage files for <b>search</b>
        </li>
      </ul>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <p>
        For usage limits, terms and conditions, billing and charges, etc see
        your OpenAI. Use responsibly.
      </p>
      <p>
        ❤️ Created by <a href="https://labnotes.org">Assaf Arkin</a>
      </p>
    </footer>
  );
}
