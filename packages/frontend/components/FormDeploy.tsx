import {
  Button,
  Link,
  Text,
  Textarea,
  useClipboard,
  VStack,
} from "@chakra-ui/react";
// @ts-expect-error
import { Integration } from "lit-ceramic-sdk";
import { useEffect, useState } from "react";
import { LitCeramicIntegrationParams } from "../constants";

const defaultAccStr = `[
    {
      "contractAddress": "",
      "standardContractType": "",
      "chain": "ethereum",
      "method": "eth_getBalance",
      "parameters": [":userAddress", "latest"],
      "returnValueTest": {
        "comparator": ">=",
        "value": "1000000000000"
      }
    }
  ]`;

const defaultHtmlStr = `<form>
  <label for="fname">First name:</label>
  <input type="text" id="fname" name="fname"><br><br>
  <label for="lname">Last name:</label>
  <input type="text" id="lname" name="lname"><br><br>
  <input type="submit" value="Submit">
</form>`;

const FormDeployer = () => {
  const [accStr, setAccStr] = useState(defaultAccStr);
  const [formHtmlStr, setFormHtmlStr] = useState(defaultHtmlStr);
  const [litCeramicIntegration, setLitCeramicIntegration] = useState<any>(null);
  const [streamId, setStreamId] = useState<string | null>(null);

  useEffect(() => {
    const litCeramicIntegration = new Integration(
      ...LitCeramicIntegrationParams
    );
    litCeramicIntegration.startLitClient(window);
    setLitCeramicIntegration(litCeramicIntegration);
  }, []);

  const onSubmit = () => {
    if (!litCeramicIntegration) return;

    const stringToEncrypt = formHtmlStr;
    const accessControlConditions = JSON.parse(accStr);
    litCeramicIntegration
      .encryptAndWrite(stringToEncrypt, accessControlConditions)
      .then((value: string) => setStreamId(value));
  };

  const formLink = streamId ? `${location.origin}/forms?id=${streamId}` : null;

  const { hasCopied, onCopy } = useClipboard(formLink || "");

  return (
    <VStack>
      <Text>Input the access control condition for your form</Text>
      <Textarea
        w="500px"
        h="250px"
        placeholder="Access control conditions for form"
        value={accStr}
        onChange={(e) => setAccStr(e.target.value)}
      />
      <Text>Input the HTML of your form</Text>
      <Textarea
        w="500px"
        h="250px"
        placeholder="Your form HTML"
        value={formHtmlStr}
        onChange={(e) => setFormHtmlStr(e.target.value)}
      />
      <Button onClick={onSubmit}>Submit</Button>

      {formLink && (
        <VStack>
          <Text>Your form URL</Text>
          <Link href={formLink} isExternal>
            {formLink}
          </Link>
          <Button onClick={onCopy}>{hasCopied ? "Copied" : "Copy"}</Button>
        </VStack>
      )}
    </VStack>
  );
};

export default FormDeployer;
