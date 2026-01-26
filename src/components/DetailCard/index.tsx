import { Badge, SubtleText } from "@/components/Glass";
import { DetailBadge } from "@/components/DetailCard/type";
import { DetailCardContainer, DetailTitle } from "./styles";

type DetailCardProps = {
  badge: DetailBadge;
  title: string;
  lines: string[];
};

const DetailCard = ({ badge, title, lines }: DetailCardProps) => {
  return (
    <DetailCardContainer>
      <Badge>{badge}</Badge>
      <DetailTitle>{title}</DetailTitle>
      {lines.map((line) => (
        <SubtleText key={line}>{line}</SubtleText>
      ))}
    </DetailCardContainer>
  );
};

export { DetailCard };
