import styled from "styled-components";

const GlassPanel = styled.section`
  position: relative;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadow};
  backdrop-filter: blur(22px) saturate(160%);
  overflow: hidden;
  transition: transform 0.35s ease, box-shadow 0.35s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0.3),
      transparent 55%,
      rgba(255, 255, 255, 0.12)
    );
    opacity: 0.35;
    pointer-events: none;
    transition: opacity 0.35s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 60px rgba(10, 18, 38, 0.5);
  }

  &:hover::before {
    animation: glassGlow 2.4s ease-in-out infinite;
    opacity: 0.7;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

const GlassCard = styled.article`
  position: relative;
  flex: 1;
  padding: 20px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.surfaceStrong};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow};
  backdrop-filter: blur(20px) saturate(160%);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 24px 60px rgba(10, 18, 38, 0.5);
  }

  &::after {
    content: "";
    position: absolute;
    top: -60%;
    left: -10%;
    width: 140%;
    height: 200%;
    background: radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.6),
      transparent 45%
    );
    opacity: 0.4;
    transform: rotate(12deg);
    pointer-events: none;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  letter-spacing: 0.4px;
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SubtleText = styled.p`
  margin: 4px 0 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(125, 211, 252, 0.2);
  color: ${({ theme }) => theme.colors.accent};
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
`;

const GlassTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 14px;
`;

const GlassTableRow = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const GlassTableHeader = styled.th`
  text-align: left;
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 12px 0;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const GlassTableCell = styled.td`
  padding: 14px 0;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export {
  Badge,
  GlassCard,
  GlassPanel,
  GlassTable,
  GlassTableCell,
  GlassTableHeader,
  GlassTableRow,
  SectionTitle,
  SubtleText,
};
