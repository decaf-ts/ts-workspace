import { Interface } from "../Interface";

export interface ChildInterface<T> extends Interface {

  method2(arg1: T): Promise<string>;
}