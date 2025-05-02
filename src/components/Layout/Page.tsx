import {
  Box,
  BoxComponentProps,
  PolymorphicComponentProps,
  Title,
} from "@mantine/core";
import { useEffect } from "react";
import { colors } from "../../lib/constants/theme-colors";

interface PageProps
  extends PolymorphicComponentProps<"div", BoxComponentProps> {
  pageTitle: string;
  bgWhite? : boolean
}


function Page({ pageTitle, bgWhite, ...rest }: PageProps) {
  useEffect(() => {
    const main = document.querySelector("body main") as HTMLDivElement
    document.title = `${pageTitle ?? `Data V`}`;
    main.style.backgroundColor = bgWhite ? "#FFFFFF" : colors.surfaceGrey[0]
    return () => {
      main.style.backgroundColor = colors.surfaceGrey[0]
      document.title = `Data V`;
    };
  }, [pageTitle, bgWhite]);
  return (
    <Box p={"xl"}>
      <Title>{pageTitle}</Title>
      <Box {...rest} />
    </Box>
  );
}

export default Page;
