import { createStandaloneToast, UseToastOptions } from '@chakra-ui/react';

export const createToast = ({ position = 'bottom-right', ...params }: UseToastOptions) => {
  const { toast } = createStandaloneToast();

  toast({ position, ...params });
};
