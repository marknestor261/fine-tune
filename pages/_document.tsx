import { CssBaseline } from "@nextui-org/react";
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const styles = CssBaseline.flush();

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {styles}
        </>
      ),
    };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          {process.env.GOOGLE_ANALYTICS_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`}
              />
              <script>
                {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${process.env.GOOGLE_ANALYTICS_ID}');`}
              </script>
            </>
          )}
        </body>
      </Html>
    );
  }
}
