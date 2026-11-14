import { createElement, forwardRef, Fragment, ReactNode } from "react";

type MotionProps = {
  children?: ReactNode;
  className?: string;
  style?: Record<string, unknown>;
  [key: string]: unknown;
};

const cleanProps = (props: MotionProps) => {
  const clone: MotionProps = {};
  for (const key of Object.keys(props)) {
    if (key === "animate" || key === "initial" || key === "exit" || key === "transition" || key === "whileInView" || key === "viewport" || key === "layout") {
      continue;
    }
    clone[key] = props[key];
  }
  return clone;
};

const cache = new Map<string, ReturnType<typeof forwardRef>>();

const getMotionComponent = (tag: string) => {
  if (cache.has(tag)) {
    return cache.get(tag)!;
  }
  const Comp = forwardRef<unknown, MotionProps>((props, ref) => {
    return createElement(tag, { ref, ...cleanProps(props) });
  });
  Comp.displayName = `Motion(${tag})`;
  cache.set(tag, Comp);
  return Comp;
};

export const motion = new Proxy(
  {},
  {
    get: (_target, prop: string) => getMotionComponent(prop),
  }
);

export const AnimatePresence = ({ children }: { children?: ReactNode }) => <Fragment>{children}</Fragment>;

export const useReducedMotion = () => false;
