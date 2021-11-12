import React from "react";
import { toast } from "react-toastify";
import { SWRConfig } from "swr";
import { OpenAI } from "types/openai";
import { useLocalStorage } from "usehooks-ts";
import requestHeaders from "./requestHeaders";

export const AccountContext = React.createContext<{
  headers?: { [key: string]: string; };
  isSignedIn: boolean;
  signIn: (apiKey: string, organizationId: string) => void;
  signOut: () => void;
}>({
  isSignedIn: false,
  signIn: () => undefined,
  signOut: () => undefined,
});

export default function Account({ children }: { children: (props: { isSignedIn: boolean; }) => JSX.Element; }) {
  const [account, setAccount] = useLocalStorage<{
    apiKey: string;
    organizationId: string;
  } | null>("openai", null);
  const headers = account ? requestHeaders(account) : undefined;

  async function fetcher(path: string) {
    if (!headers) return null;

    const response = await fetch(`https://api.openai.com/v1/${path}`, {
      headers,
    });
    if (response.ok) {
      return await response.json();
    } else {
      const { error } = (await response.json()) as OpenAI.ErrorResponse;
      throw new Error(error.message);
    }
  }

  function onError(error: Error) {
    toast.error(String(error));
  }

  function signIn(apiKey: string, organizationId: string) {
    setAccount({ apiKey, organizationId });
  }

  function signOut() {
    setAccount(null);
  }

  return (
    <AccountContext.Provider
      value={{ isSignedIn: !!account, headers, signIn, signOut }}
    >
      <SWRConfig value={{ fetcher, onError }}>{children({
        isSignedIn: !!account
      })}</SWRConfig>
    </AccountContext.Provider>
  );
}
