import React from "react";
import { SolcError } from "../../types";

const CompilerError = (props: { eventResult: Array<SolcError> }) => {
  let { eventResult } = props;
  return (
    <div>
      {eventResult.map((result, index) => {
        const resultToPrint = result.formattedMessage.split("\n");
        return (
          <text key={index}>
            {resultToPrint.map((errorResult: string, index: any) => {
              return <p>{errorResult}</p>;
            })}
          </text>
        );
      })}
    </div>
  );
};

export default CompilerError;
