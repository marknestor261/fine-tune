import { Router } from "next/router";
import { useEffect } from "react";

export default function useAnalytics() {
  const propertyId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  useEffect(() => {
    if (!propertyId) return;

    const src = `https://www.googletagmanager.com/gtag/js?id=${propertyId}&l=dataLayer&cx=c`;
    const loaded = [...document.querySelectorAll("script")].find(
      (script) => script.src === src
    );
    if (loaded) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(["js", new Date()]);
    window.dataLayer.push(["config", propertyId, { page_view: false }]);

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  function sendEvent(name: string, props?: { [key: string]: string }) {
    window.dataLayer?.push(["event", name, props]);
  }

  function pageView() {
    sendEvent("page_view", {
      page_title: document.title,
      page_location: location.href,
    });
  }

  useEffect(() => {
    Router.events.on("routeChangeComplete", pageView);
    return () => Router.events.off("routeChangeComplete", pageView);
  }, []);

  return { pageView, sendEvent };
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}
