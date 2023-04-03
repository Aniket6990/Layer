import { ReactNode } from "react";
import styled from "styled-components";

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--vscode-button-background);
  padding: 0.25rem 0.5rem 0.25rem 0.5rem;
  color: var(--vscode-button-foreground);
  border: none;
  width: 40%;
  &:hover {
    background-color: var(--vscode-button-hoverBackground);
    cursor: pointer;
  }
`;

const ExtensionButton = (props: {
  onClick?: (e: any) => void;
  children?: ReactNode;
  title?: string;
}) => {
  return (
    <Button onClick={props.onClick} title={props.title}>
      {props.children}
    </Button>
  );
};
export default ExtensionButton;
