import { CssBaseline } from "@nextui-org/react";
import Account from "components/account/Account";
import ErrorMessage from "components/ErrorMessage";
import PageLayout from "components/PageLayout";
import { NextSeo } from "next-seo";
import { AppProps } from "next/dist/shared/lib/router/router";
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
      <NextSeo
        title={ready ? t("$t(app.title) — $(app.subtitle)") : "🥱 waking up …"}
        openGraph={{
          images: [
            {
              url: screenshot.src,
              width: screenshot.width,
              height: screenshot.height,
            },
          ],
        }}
      />
      <CssBaseline />
      <ToastContainer hideProgressBar />
      <Account>
        <PageLayout fullPage={pageProps.fullPage}>
          <Component {...pageProps} />
        </PageLayout>
      </Account>
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
