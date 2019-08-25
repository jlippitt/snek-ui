import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
`;

interface PlaceholderProps {
  width: number;
  height: number;
}

export const Placeholder = styled.div<PlaceholderProps>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background-color: #000;
  margin: auto;
`;
