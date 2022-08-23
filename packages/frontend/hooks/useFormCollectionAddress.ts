import { useRouter } from "next/router";

export const useFormCollectionAddress = () => {
  const router = useRouter();
  const formCollectionAddress = router.query?.id?.toString() || null;

  return {
    formCollectionAddress,
  };
};
