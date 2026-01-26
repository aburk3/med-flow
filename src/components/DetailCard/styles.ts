import styled from "styled-components";
import { GlassPanel } from "@/components/Glass";

const DetailCardContainer = styled(GlassPanel)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DetailTitle = styled.h2`
  margin: 8px 0 0;
  font-size: 22px;
`;

export { DetailCardContainer, DetailTitle };
