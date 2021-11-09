import * as Sentry from "@sentry/nextjs";
import { NextPageContext } from "next";
import NextError, { ErrorProps } from "next/error";
import { ReactNode } from "react";

console.log(NextError);

export default function ErrorPage({
  statusCode,
  hasGetInitialPropsRun,
  err,
}: ErrorProps & {
  hasGetInitialPropsRun: boolean;
  err?: NextError;
}): ReactNode {
  if (!hasGetInitialPropsRun && err) {
    // getInitialProps is not called in case of
    // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
    // err via _app.js so it can be captured
    Sentry.captureException(err);
  }
  return <NextError statusCode={statusCode} />;
}

ErrorPage.getInitialProps = async function (
  context: NextPageContext
): Promise<ErrorProps> {
  const errorInitialProps = await NextError.getInitialProps(context);

  // @ts-ignore Workaround for https://github.com/vercel/next.js/issues/8592, mark when
  errorInitialProps.hasGetInitialPropsRun = true;

  if (context.err) {
    Sentry.captureException(context.err);
  } else {
    Sentry.captureException(
      new Error(
        `_error.js getInitialProps missing data at path: ${context.asPath}`
      )
    );
  }
  await Sentry.flush(2000);
  return errorInitialProps;
};
