import { Contract, ethers } from "ethers";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import FORM_COLLECTION_ABI from "../constants/formCollectionAbi.json";
import FORM_COLLECTION_FACTORY_ABI from "../constants/formCollectionFactoryAbi.json";

export const FORM_COLLECTION_FACTORY_CONTRACT_ADDRESS =
  "0xEBed7538E8cc636F3FbaCEE289Aacb2Ef959AbA2";

const questionnaireCollectionFactoryContractAtom = atom<Contract | null>(null);
const questionnaireCollectionContractAtom = atom<Contract | null>(null);
const isLoadingQuestionnaireCollectionFactoryContractAtom =
  atom<boolean>(false);
const isLoadingQuestionnaireCollectionContractAtom = atom<boolean>(false);

export const useEthers = () => {
  const [
    questionnaireCollectionFactoryContract,
    setQuestionnaireCollectionFactoryContract,
  ] = useAtom(questionnaireCollectionFactoryContractAtom);
  const [questionnaireCollectionContract, setQuestionnaireCollectionContract] =
    useAtom(questionnaireCollectionContractAtom);
  const [
    isLoadingQuestionnaireCollectionFactoryContract,
    setIsLoadingQuestionnaireCollectionFactoryContractAtom,
  ] = useAtom(isLoadingQuestionnaireCollectionFactoryContractAtom);
  const [
    isLoadingQuestionnaireCollectionContract,
    setIsLoadingQuestionnaireCollectionContract,
  ] = useAtom(isLoadingQuestionnaireCollectionContractAtom);

  const fetchQuestionnaireCollectionFactoryContract = useCallback(
    async (wallet: string, provider: any) => {
      if (isLoadingQuestionnaireCollectionFactoryContract) return;
      try {
        setIsLoadingQuestionnaireCollectionFactoryContractAtom(true);
        const signer = provider.getSigner(wallet);
        if (!signer) return;

        const contract = new ethers.Contract(
          FORM_COLLECTION_FACTORY_CONTRACT_ADDRESS,
          FORM_COLLECTION_FACTORY_ABI,
          signer
        );
        setQuestionnaireCollectionFactoryContract(contract);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingQuestionnaireCollectionFactoryContractAtom(false);
      }
    },
    [
      isLoadingQuestionnaireCollectionFactoryContract,
      setQuestionnaireCollectionFactoryContract,
    ]
  );

  const fetchQuestionnaireCollectionContract = useCallback(
    async (address: string, wallet: string, provider: any) => {
      if (isLoadingQuestionnaireCollectionContract) return;
      try {
        setIsLoadingQuestionnaireCollectionContract(true);

        const signer = provider.getSigner(wallet);
        if (!signer) return;

        const contract = new ethers.Contract(
          address,
          FORM_COLLECTION_ABI,
          signer
        );
        setQuestionnaireCollectionContract(contract);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingQuestionnaireCollectionContract(false);
      }
    },
    [setQuestionnaireCollectionContract]
  );
  return {
    questionnaireCollectionFactoryContract,
    questionnaireCollectionContract,
    isLoadingQuestionnaireCollectionFactoryContract,
    isLoadingQuestionnaireCollectionContract,
    fetchQuestionnaireCollectionFactoryContract,
    fetchQuestionnaireCollectionContract,
  };
};
