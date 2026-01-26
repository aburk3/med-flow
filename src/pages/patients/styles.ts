import styled from "styled-components";
import { GlassTableRow } from "@/styles/glass";

const ClickableRow = styled(GlassTableRow)`
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;

export {
  ClickableRow,
};
