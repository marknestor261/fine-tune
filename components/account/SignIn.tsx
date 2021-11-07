import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import requestHeaders from "./requestHeaders";
import useAuthentication from "./useAuthentication";

export default function Signin() {
  const { signIn } = useAuthentication();
  const [isLoading, setIsLoading] = useState(false);
  const initialValue = { apiKey: "", organizationId: "" };
  const form = useForm({ defaultValues: initialValue });
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = form.handleSubmit(async function (
    formData: typeof initialValue
  ) {
    try {
      setIsLoading(true);

      const response = await fetch("https://api.openai.com/v1/engines", {
        headers: requestHeaders(formData),
      });
      if (response.ok) {
        signIn(formData.apiKey, formData.organizationId);
        router.push("/completions");
      } else {
        const { error } = await response.json();
        setError(error.message);
      }
    } catch (error) {
      toast.error(String(error));
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="divide-y">
      <h2>Sign In</h2>
      <form className="py-5 space-y-4" onSubmit={onSubmit}>
        {error && <div className="text-red-500 my-4">{error}</div>}
        <div>
          <Input
            autoFocus
            label="OpenAI API Key"
            required
            type="text"
            width="100%"
            {...form.register("apiKey")}
          />
          <p>
            Your API key is{" "}
            <a
              href="https://beta.openai.com/account/api-keys"
              target="_blank"
              rel="noreferrer"
              tabIndex={-1}
            >
              available here.
            </a>
          </p>
        </div>
        <div>
          <Input
            label="Organization ID (Optional)"
            type="text"
            width="100%"
            {...form.register("organizationId")}
          />
        </div>
        <div className="flex justify-end ">
          <Button
            auto
            loading={isLoading}
            iconRight={<FontAwesomeIcon icon={faChevronRight} />}
            type="submit"
          >
            {"Let's Go"}
          </Button>
        </div>
        <p className="text-sm">
          Your API key does not leave your browser, except to access the OpenAI
          API.
        </p>
      </form>
    </div>
  );
}
