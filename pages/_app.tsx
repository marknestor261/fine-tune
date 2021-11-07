import { CssBaseline } from "@nextui-org/react";
import Account from "components/account/Account";
import ErrorMessage from "components/ErrorMessage";
import PageLayout from "components/PageLayout";
import { AppProps } from "next/dist/shared/lib/router/router";
import Head from "next/head";
import { appWithI18Next } from "ni18n";
import { ni18nConfig } from "ni18n.config";
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
        <title>
          {ready ? t(`$t(app.title) — $t(app.subtitle)`) : "🥱 waking up …"}
        </title>
      </Head>
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
