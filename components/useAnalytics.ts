import { Router } from "next/router";
import { useEffect } from "react";

export default function useAnalytics() {
  const propertyId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  if (process.browser) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args) => {
      window.dataLayer.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", propertyId, {
      send_page_view: false,
    });
  }

  useEffect(() => {
    if (!propertyId) return;

    const src = `https://www.googletagmanager.com/gtag/js?id=${propertyId}`;
    const loaded = [...document.querySelectorAll("script")].find(
      (script) => script.src === src
    );
    if (loaded) return;

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  function sendEvent(name: string, props?: { [key: string]: string }) {
    window.gtag("event", name, props);
  }

  function pageView() {
    sendEvent("page_view", {
      page_title: document.title,
      page_location: location.href,
      page_path: location.pathname,
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
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
