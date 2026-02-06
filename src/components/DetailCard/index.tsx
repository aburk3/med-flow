import type { ReactNode } from "react";
import { Badge, SubtleText } from "@/styles/glass";
import { DetailBadge } from "@/components/DetailCard/type";
import { DetailCardContainer, DetailLine, DetailTitle } from "./styles";

type DetailCardProps = {
  badge: DetailBadge;
  title: string;
  lines: ReactNode[];
};

const DetailCard = ({ badge, title, lines }: DetailCardProps) => {
  return (
    <DetailCardContainer>
      <Badge>{badge}</Badge>
      <DetailTitle>{title}</DetailTitle>
      {lines.map((line, index) =>
        typeof line === "string" ? (
          <SubtleText key={`${line}-${index}`}>{line}</SubtleText>
        ) : (
          <DetailLine key={index}>{line}</DetailLine>
        )
      )}
    </DetailCardContainer>
  );
};

export { DetailCard };
