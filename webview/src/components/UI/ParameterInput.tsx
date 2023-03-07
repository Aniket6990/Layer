import React, { ReactNode, useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import styled from "styled-components";
import { FunctionObjectType, JsonFragmentType } from "../../types";

const DeployParamsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const PartialObjectWrapper = styled.div`
  width: 90%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Button = styled.button.attrs((props: { size: any; buttonBg: any }) => ({
  size: props.size,
  buttonBg: props.buttonBg,
}))`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.buttonBg};
  padding: 0.25rem 0.5rem 0.25rem 0.5rem;
  color: var(--vscode-button-foreground);
  flex-grow: ${(props) => props.size};
  border: none;
  &:hover {
    background-color: var(--vscode-button-hoverBackground);
    cursor: pointer;
  }
`;

const Input = styled.input.attrs((props: { size: any }) => ({
  size: props.size,
}))`
  display: flex;
  padding: 0.25rem 0.5rem 0.25rem 0.5rem;
  background-color: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  flex-grow: ${(props) => props.size};
  outline: none;
  border: 1px solid var(--vscode-icon-foreground);
  &:hover {
    cursor: text;
  }
`;

const UpArrow = styled(MdArrowForwardIos)`
  width: 14px;
  height: 14px;
  color: var(--vscode-icon-foreground);
  transform: rotate(270deg);
`;

const DownArrow = styled(MdArrowForwardIos)`
  width: 14px;
  height: 14px;
  color: var(--vscode-icon-foreground);
  transform: rotate(90deg);
`;

const MultiInputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Param = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  color: var(--vscode-button-foreground);
`;

const MultiParamsInput = (props: {
  contractConstructor: Array<JsonFragmentType>;
  enterInputParams: (input: string, index: any) => void;
  param: string[];
}) => {
  return (
    <MultiInputContainer>
      {!!props.contractConstructor.length &&
        props.contractConstructor.map(
          (constructorInput: JsonFragmentType, index: any) => {
            return (
              <Param key={index}>
                <span
                  style={{
                    width: "20%",
                    color: "var(--vscode-icon-foreground)",
                  }}
                >
                  {`${constructorInput.name as string}:`}
                </span>
                <Input
                  placeholder={constructorInput.type as string}
                  value={props.param[index] ? props.param[index] : ""}
                  onChange={(e) => {
                    props.enterInputParams(e.target.value, index);
                  }}
                ></Input>
              </Param>
            );
          }
        )}
    </MultiInputContainer>
  );
};

const ParameterInput = (props: {
  onClick?: () => void;
  children?: ReactNode;
  title?: string;
  buttonSize?: Number;
  inputSize?: Number;
  functionObject?: FunctionObjectType;
  functionToCall: (...params: any[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [paramInput, setParamInput] = useState<Array<string>>([]);

  const enterInputParams = (input: string, index?: any) => {
    if (open) {
      setParamInput((datas) => ({
        ...datas,
        [index]: input,
      }));
    } else {
      const inputs = input.split(",");
      setParamInput(inputs);
    }
  };

  const placeHolderValue = () => {
    const inputs = props.functionObject?.inputs.map(
      (input: JsonFragmentType, index) => {
        return `${input.type}: ${input.name}`;
      }
    ) as string[];
    return inputs.toString();
  };

  const determineButtonBg = () => {
    if (
      props.functionObject === undefined ||
      props.functionObject?.type === "constructor"
    ) {
      return "var(--vscode-button-background)";
    }
    if (props.functionObject?.stateMutability === "nonpayable") {
      return "var(--vscode-button-background)";
    }
    if (props.functionObject?.stateMutability === "payable") {
      return "#f75973";
    }
    if (
      props.functionObject.stateMutability === "view" ||
      props.functionObject.stateMutability === "pure"
    ) {
      return "#429bf5";
    }
  };

  return (
    <>
      <DeployParamsContainer>
        <PartialObjectWrapper>
          <Button
            onClick={(e) => {
              if (open) {
                const paramValues = Object.values(paramInput);
                props.functionToCall(paramValues, props.functionObject);
                setParamInput([]);
              } else {
                props.functionToCall(paramInput, props.functionObject);
                setParamInput([]);
              }
            }}
            title={props.title}
            size={props.buttonSize}
            buttonBg={determineButtonBg}
          >
            {props.children}
          </Button>
          {props.functionObject !== undefined &&
          !!props.functionObject.inputs.length
            ? !open && (
                <Input
                  placeholder={placeHolderValue()}
                  size={props.inputSize}
                  value={paramInput}
                  onChange={(e) => {
                    enterInputParams(e.target.value);
                  }}
                ></Input>
              )
            : null}
        </PartialObjectWrapper>
        {props.functionObject !== undefined &&
        !!props.functionObject.inputs.length ? (
          open ? (
            <UpArrow
              onClick={(e) => {
                setParamInput([]);
                setOpen((open) => !open);
              }}
            ></UpArrow>
          ) : (
            <DownArrow
              onClick={(e) => {
                setParamInput([]);
                setOpen((open) => !open);
              }}
            ></DownArrow>
          )
        ) : null}
      </DeployParamsContainer>
      <PartialObjectWrapper>
        {open && props.functionObject !== undefined && (
          <MultiParamsInput
            contractConstructor={props.functionObject.inputs}
            enterInputParams={enterInputParams}
            param={paramInput}
          ></MultiParamsInput>
        )}
      </PartialObjectWrapper>
    </>
  );
};

export default ParameterInput;
