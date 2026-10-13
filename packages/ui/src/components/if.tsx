import * as React from "react";

type IfContextValue = boolean | null;
const IfContext = React.createContext<IfContextValue>(null);

export type IfProps = {
  condition: boolean;
  children?: React.ReactNode;
};

export type IfBranchProps = {
  children?: React.ReactNode;
};

function containsBranch(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false;
    if (child.type === Then || child.type === Else) return true;
    return (
      child.type === React.Fragment &&
      containsBranch((child.props as IfBranchProps).children)
    );
  });
}

function Then({ children }: IfBranchProps) {
  const condition = React.useContext(IfContext);
  return condition === true ? <>{children}</> : null;
}

function Else({ children }: IfBranchProps) {
  const condition = React.useContext(IfContext);
  return condition === false ? <>{children}</> : null;
}

function renderIf({ condition, children }: IfProps) {
  const hasBranches = containsBranch(children);

  return (
    <IfContext.Provider value={condition}>
      {hasBranches ? children : condition ? children : null}
    </IfContext.Provider>
  );
}

const If = Object.assign(renderIf, { Then, Else });

export { Else, If, Then };
