import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SWRConfig } from "swr";
import { OpenAI } from "types/openai";
import HomePage from "../HomePage";
import requestHeaders from "./requestHeaders";

export const AccountContext = React.createContext<{
  headers?: { [key: string]: string };
  isSignedIn: boolean;
  signIn: (apiKey: string, organizationId: string) => void;
  signOut: () => void;
}>({
  isSignedIn: false,
  signIn: () => undefined,
  signOut: () => undefined,
});

export default function Account({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKey] = useLocalStorage("apiKey");
  const [organizationId, setOrganizationId] = useLocalStorage("organizationId");
  const headers = requestHeaders({ apiKey, organizationId });

  async function fetcher(path: string) {
    if (!apiKey) return null;

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
    setApiKey(apiKey);
    setOrganizationId(organizationId);
  }

  function signOut() {
    setApiKey(null);
    setOrganizationId(null);
  }

  return (
    <AccountContext.Provider
      value={{ isSignedIn: !!apiKey, headers, signIn, signOut }}
    >
      {apiKey ? (
        <SWRConfig value={{ fetcher, onError }}>{children}</SWRConfig>
      ) : (
        <HomePage />
      )}
    </AccountContext.Provider>
  );
}

function useLocalStorage(
  key: string
): [string | null, (value: string | null) => void] {
  const [value, setValue] = useState(() =>
    typeof localStorage === "undefined" ? null : localStorage.getItem(key)
  );

  useEffect(() => {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  }, [value]);

  return [value, setValue];
}
