import { VStack } from "@chakra-ui/react";
// @ts-expect-error
import { Integration } from "lit-ceramic-sdk";
import { useEffect, useState } from "react";
import { LIT_CERAMIC_INTEGRATION_PARAMS } from "../constants/constants";

const FormDisplay = () => {
  const [formHtmlStr, setFormHtmlStr] = useState("");
  const streamId = new URLSearchParams(location.search).get("id") || "";

  useEffect(() => {
    const litCeramicIntegration = new Integration(
      ...LIT_CERAMIC_INTEGRATION_PARAMS
    );
    litCeramicIntegration.startLitClient(window);
    litCeramicIntegration
      .readAndDecrypt(streamId)
      .then((value: string) => setFormHtmlStr(value));
  }, [streamId]);

  return (
    <VStack>
      {formHtmlStr && (
        <div
          dangerouslySetInnerHTML={{
            __html: formHtmlStr,
          }}
        />
      )}
    </VStack>
  );
};

export default FormDisplay;
