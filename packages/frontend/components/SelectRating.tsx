import { HStack, IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";

export default function SelectRating(props: {
  rating?: number | null;
  ratingMax: number;
  onChange?: ((rating: number) => void) | null;
}) {
  const [rating, setRating] = useState(props.rating || 1);

  useEffect(() => {
    props.onChange && props.onChange(rating);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rating]);

  return (
    <HStack>
      {[...Array(props.ratingMax)].map((_, idx) => (
        <IconButton
          key={uuidv4()}
          variant="ghost"
          aria-label="{idx + 1}"
          size="md"
          colorScheme="grey"
          icon={
            idx < rating ? (
              <AiFillStar
                style={{
                  width: 40,
                  height: 40,
                  color: "var(--chakra-colors-yellow-500)",
                }}
              />
            ) : (
              <AiOutlineStar
                style={{
                  width: 40,
                  height: 40,
                  color: "var(--chakra-colors-yellow-500)",
                }}
              />
            )
          }
          onClick={() => setRating(idx + 1)}
        />
      ))}
    </HStack>
  );
}
