declare namespace React {
  type ClassNameValue = string | number | boolean | undefined | null;
  type ClassNameMapping = Record<string, unknown>;
  interface ClassNameArgumentArray extends Array<ClassList> {}
  type ClassList = ClassNameValue | ClassNameMapping | ClassNameArgumentArray;
  interface HTMLAttributes {
    classList?: ClassList;
  }
}
