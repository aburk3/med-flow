import styled from "styled-components";
import { GlassPanel } from "@/styles/glass";

const DetailCardContainer = styled(GlassPanel)`
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${({ theme }) => theme.media.phone} {
    gap: 6px;
  }
`;

const DetailTitle = styled.h2`
  margin: 8px 0 0;
  font-size: 22px;

  ${({ theme }) => theme.media.tablet} {
    font-size: 20px;
  }

  ${({ theme }) => theme.media.phone} {
    font-size: 18px;
  }
`;

export { DetailCardContainer, DetailTitle };
