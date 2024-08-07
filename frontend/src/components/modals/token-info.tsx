import { type ChangeEvent, useState } from "react";
import Button from "../button";
import { useAppStore } from "~/store/app";
import { error } from "~/utils";
import axios from "axios";
import { useAccount } from "wagmi";
import { BASE_API_URL } from "~/constants";
import { type Metadata, type InputProps } from "~/types";
import { toast } from "react-toastify";

const TokenInfo = () => {
  const { address } = useAccount();

  const { mediaFile, setModal } = useAppStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    mediaType: string;
    image: string;
  }>({
    name: "",
    description: "",
    mediaType: mediaFile?.type,
    image: mediaFile?.url,
  });
  const [aiChoices, setAiChoices] = useState<
    Metadata["interactiveMedia"]["AIEnabledFeatures"]
  >([]);
  const [crosschainChoices, setCrosschainChoices] = useState<
    Metadata["interactiveMedia"]["CrosschainCompatibility"]
  >([]);

  const validateForm = () => {
    return (
      formData.name.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.mediaType?.trim() !== "" &&
      formData.image?.trim() !== "" &&
      aiChoices.length !== 0 &&
      crosschainChoices.length !== 0
    );
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };
  type SetterFunction = (
    updateFunction: (prevState: string[]) => string[],
  ) => void;
  const handleCheckboxChange = (
    setter: SetterFunction,
    value: string,
  ): void => {
    setter((prevState) =>
      prevState.includes(value)
        ? prevState.filter((item) => item !== value)
        : [...prevState, value],
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const metadata: Metadata = {
        description: formData.description,
        name: formData.name,
        image: formData.image,
        files: [
          {
            mediaType: formData.mediaType,
            name: formData.name,
          },
        ],
        interactiveMedia: {
          AIEnabledFeatures: aiChoices,
          CrosschainCompatibility: crosschainChoices,
        },
        mediaType: formData.mediaType,
      };
      const { data } = await axios.post<{
        [key: string]: unknown; // replace with the actual type define for mintData
        transactionHash: string;
      }>(`${BASE_API_URL}/api/mintTo`, {
        contractAddress: "0x05C85BF217a59966639830B9f63127E81780cD51",
        toWalletAddress: address,
        metadata,
      });
      console.log(data);
      toast.success("Token minted to your wallet: " + data.transactionHash);
      setLoading(false);
      setModal(null)
    } catch (error: unknown) {
      console.log(error);
      toast.error("Failed !");
      setLoading(false);
    }
  };
  return (
    <div
      className="relative flex h-[70vh] w-full max-w-[700px] flex-col gap-2 overflow-auto rounded-md bg-white p-5 md:h-[80vh]"
      data-lenis-prevent
    >
      <div className="mb-2 w-full text-center text-2xl font-bold">
        {preview ? "Token Preview" : "Token Info"}
      </div>
      <div className="flex flex-col gap-3">
        <TitleAndInput
          value={formData.name}
          title="Name"
          inputPlaceholder="Enter name"
          onChange={(value: string) => handleInputChange("name", value)}
          preview={preview}
        />
        <TitleAndInput
          textArea
          value={formData.description}
          title="Description"
          inputPlaceholder="Enter Description"
          onChange={(value: string) => handleInputChange("description", value)}
          preview={preview}
        />
        <TitleAndInput
          value={formData.mediaType}
          title="Media Type"
          inputPlaceholder="Enter Media Type"
          onChange={(value: string) => handleInputChange("mediaType", value)}
          preview={true}
        />
        <TitleAndInput
          value={formData.image}
          title="Media URL"
          inputPlaceholder="Enter URL"
          onChange={(value: string) => handleInputChange("mediaURL", value)}
          preview={true}
        />
        <div className="flex flex-col gap-1 font-inter tracking-wide">
          <h2 className="ml-1 font-semibold text-secondary">
            AI Enabled Features
          </h2>
          <div className="mt-2 grid grid-flow-row grid-cols-2 gap-4 md:flex md:items-center">
            {["Wanchain", "Polygon", "Ethereum", "Cardano"].map((feature) => (
              <div
                key={feature}
                className={`flex w-fit items-center rounded-lg bg-primary/20 px-5 py-3 ${preview ? "cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() =>
                  !preview ? handleCheckboxChange(setAiChoices, feature) : ""
                }
              >
                <input
                  type="checkbox"
                  checked={aiChoices.includes(feature)}
                  readOnly
                  className="cyberpunk-checkbox"
                />
                <label
                  className={`font-ibm-mono ml-1 text-sm font-medium text-secondary  ${preview ? "cursor-not-allowed" : "cursor-pointer"} `}
                >
                  {feature}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 font-inter tracking-wide">
          <h2 className="ml-1 font-semibold text-secondary">
            Crosschain Compatibility
          </h2>
          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-center">
            {["Character Impersonations", "AI Interactive Content"].map(
              (compatibility) => (
                <div
                  key={compatibility}
                  className={` flex w-fit items-center rounded-lg bg-primary/20 px-5 py-3 ${preview ? "cursor-not-allowed" : "cursor-pointer"}`}
                  onClick={() =>
                    !preview
                      ? handleCheckboxChange(
                          setCrosschainChoices,
                          compatibility,
                        )
                      : ""
                  }
                >
                  <input
                    type="checkbox"
                    checked={crosschainChoices.includes(compatibility)}
                    readOnly
                    className="cyberpunk-checkbox"
                  />
                  <label
                    className={`font-ibm-mono ml-1 text-sm font-medium text-secondary  ${preview ? "cursor-not-allowed" : "cursor-pointer"} `}
                  >
                    {compatibility}
                  </label>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 flex w-full items-center justify-between border-t pt-8 ">
        <Button
          className="group relative flex items-center justify-center gap-4 px-6 "
          onClick={() => {
            preview ? setPreview(false) : setModal("UPLOAD");
          }}
        >
          <div className="relative !text-sm text-white group-hover:text-black md:text-base ">
            Back
          </div>
        </Button>
        {!preview ? (
          <Button
            className="group relative flex items-center justify-center gap-4 px-6 "
            onClick={() => {
              validateForm()
                ? setPreview(true)
                : error("Please fill all input fields.");
            }}
          >
            <div className="relative !text-sm text-white group-hover:text-black md:text-base ">
              NEXT
            </div>
          </Button>
        ) : (
          <Button
            className="group relative flex items-center justify-center gap-4 px-4 md:px-10 "
            onClick={handleSubmit}
          >
            <div className="relative !text-sm text-white group-hover:text-black md:text-base ">
              {loading ? "Loading..." : "Mint Now"}
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TokenInfo;

function TitleAndInput({
  title,
  inputPlaceholder,
  textArea,
  value,
  onChange,
  preview,
}: InputProps) {
  const [inpVal, setInpVal] = useState<string>(value ?? "");

  const handleOnChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setInpVal(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-1 font-inter tracking-wide">
      <h2 className="ml-1 font-semibold text-secondary">{title ?? "Lorem"}</h2>

      <div className="relative mt-2 font-medium">
        {textArea ? (
          <textarea
            className={`font-ibm-mono w-full resize-none overflow-hidden rounded-lg bg-primary/20 py-3 pl-5 pr-8 text-sm text-secondary outline-none ${preview ? "cursor-not-allowed" : ""}`}
            placeholder={inputPlaceholder}
            value={inpVal ?? ""}
            rows={4}
            onChange={handleOnChange}
            readOnly={preview}
          />
        ) : (
          <input
            type="text"
            className={`font-ibm-mono w-full rounded-lg bg-primary/20 px-5 py-3 pr-10 text-sm text-secondary outline-none ${preview ? "cursor-not-allowed" : ""}`}
            placeholder={inputPlaceholder ?? "Lorem ipsum dolor sit amet"}
            value={inpVal ?? ""}
            onChange={handleOnChange}
            readOnly={preview}
            name={title?.toLowerCase()}
          />
        )}
      </div>
    </div>
  );
}
