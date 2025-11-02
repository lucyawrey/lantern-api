export type Schema = {
  properties: {
    [key: string]: SchemaPropertyDefinition;
  };
  types: {
    [key: string]: {
      [key: string]: SchemaPropertyDefinition;
    };
  };
};

export type SchemaPropertyDefinition =
  | {
      type: "any" | "string" | "number" | "boolean" | "contentRef";
    }
  | {
      type: "array";
      itemType: SchemaPropertyDefinition;
    }
  | {
      type: "localObject" | "contentTypeObject";
      ref: string;
    };
