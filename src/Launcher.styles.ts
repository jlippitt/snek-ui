import styled from 'styled-components';

interface ContainerProps {
  viewportWidth: number;
}

export const Container = styled.div<ContainerProps>`
  height: 80px;
  min-width: ${({ viewportWidth }) => viewportWidth}px;
`;
