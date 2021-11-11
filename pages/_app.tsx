import { CssBaseline } from "@nextui-org/react";
import Account from "components/account/Account";
import ErrorMessage from "components/ErrorMessage";
import PageLayout from "components/PageLayout";
import useEmojiFavicon from "components/useEmojiFavicon";
import { NextSeo } from "next-seo";
import { AppProps } from "next/dist/shared/lib/router/router";
import Head from "next/head";
import Router from "next/router";
import { appWithI18Next } from "ni18n";
import { ni18nConfig } from "ni18n.config";
import screenshot from "public/images/screenshot.png";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import "styles/index.css";

export default appWithI18Next(App, ni18nConfig);

function App({ Component, pageProps }: AppProps) {
  const { t, ready } = useTranslation();
  const emojiFavicon = useEmojiFavicon(ready ? t("app.emoji") : "🥱");
  useGATag(ready);

  return (
    <ErrorBoundary>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={emojiFavicon} />
      </Head>
      <NextSeo
        title={ready ? t("$t(app.name) — $t(app.subtitle)") : "waking up …"}
        titleTemplate={ready ? t("%s | $t(app.name)") : undefined}
        description={ready ? t("app.description") : undefined}
        openGraph={{
          images: [
            {
              url: screenshot.src,
              width: screenshot.width,
              height: screenshot.height,
            },
          ],
          type: "website",
        }}
        twitter={{
          cardType: "summary_large_image",
          handle: "@assaf",
        }}
      />
      <CssBaseline />
      <ToastContainer hideProgressBar />
      {ready ? (
        <PageLayout fullPage={pageProps.fullPage}>
          <Account>
            <Component {...pageProps} />
          </Account>
        </PageLayout>
      ) : null}
    </ErrorBoundary>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error?: Error }
> {
  state: { error?: Error };

  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    toast.error(String(error));
  }

  render() {
    const { error } = this.state;
    return error ? <ErrorMessage error={error} /> : this.props.children;
  }
}

function useGATag(ready: boolean) {
  function pageView() {
    window.gtag?.("event", "page_view", {
      page_title: document.title,
      page_location: location.href,
      page_path: location.pathname,
    });
  }

  useEffect(() => {
    Router.events.on("routeChangeComplete", pageView);
    return () => Router.events.off("routeChangeComplete", pageView);
  }, []);

  useEffect(
    function () {
      // Wait until first render had a change to load translations and set the page title
      if (ready) pageView();
    },
    [ready]
  );
}

declare global {
  interface Window {
    gtag?: (
      action: string,
      event: string,
      props: { [key: string]: string }
    ) => void;
  }
}
