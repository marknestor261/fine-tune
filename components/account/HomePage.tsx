import Image from "next/image";
import screenshot from "public/images/screenshot.png";
import React from "react";
import Signin from "./SignIn";

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <Header />
      <div className="my-20 w-full flex flex-col md:flex-row gap-16">
        <div className="py-10 self-center mx-auto ">
          <Signin />
        </div>
        <Promo />
      </div>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header>
      <h1>
        👋 Trainer
        <span className="font-thin ml-2">The missing UI for OpenAI.</span>
      </h1>
    </header>
  );
}

function Promo() {
  return (
    <section>
      <div className="shadow-lg rounded-lg border-gray-100 border py-2 bg-white">
        <Image {...screenshot} />
      </div>
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
