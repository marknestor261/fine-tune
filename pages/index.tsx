import HomePage from "components/account/HomePage";
import React from "react";

export default function Main() {
  return <HomePage />;
}

export function getStaticProps() {
  return {
    props: { fullPage: true },
  };
}
