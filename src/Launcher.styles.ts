import styled from 'styled-components';

interface ContainerProps {
  viewportWidth: number;
}

export const Container = styled.div<ContainerProps>`
  margin: auto;
  height: 30px;
  width: ${({ viewportWidth }) => viewportWidth}px;
`;
