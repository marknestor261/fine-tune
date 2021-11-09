import { CssBaseline } from "@nextui-org/react";
import Account from "components/account/Account";
import ErrorMessage from "components/ErrorMessage";
import PageLayout from "components/PageLayout";
import { NextSeo } from "next-seo";
import { AppProps } from "next/dist/shared/lib/router/router";
import Head from "next/head";
import { appWithI18Next } from "ni18n";
import { ni18nConfig } from "ni18n.config";
import screenshot from "public/images/screenshot.png";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import "styles/index.css";

export default appWithI18Next(App, ni18nConfig);

function App({ Component, pageProps }: AppProps) {
  const { t, ready } = useTranslation();

  return (
    <ErrorBoundary>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <NextSeo
        title={ready ? t("$t(app.name) — $t(app.subtitle)") : "🥱 waking up …"}
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
        additionalLinkTags={[
          {
            rel: "icon",
            href: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${t(
              "app.emoji"
            )}</text></svg>`,
          },
        ]}
      />
      <CssBaseline />
      <ToastContainer hideProgressBar />
      <PageLayout fullPage={pageProps.fullPage}>
        <Account>
          <Component {...pageProps} />
        </Account>
      </PageLayout>
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
