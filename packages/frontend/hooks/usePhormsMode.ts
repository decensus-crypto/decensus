import { useRouter } from "next/router";

export const usePhormsMode = () => {
  const router = useRouter();

  const isPhormsMode = router.query.test != null;

  return {
    isPhormsMode,
  };
};
