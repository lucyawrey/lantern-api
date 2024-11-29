import fs from "fs";
import {
  factory,
  SyntaxKind,
  createPrinter,
  NewLineKind,
  createSourceFile,
  ScriptTarget,
  ScriptKind,
  ListFormat,
  NodeFlags,
  createProgram,
  isInterfaceDeclaration,
  isPropertySignature,
} from "typescript";

const importNode = factory.createImportDeclaration(
  /* modifiers */ undefined,
  factory.createImportClause(
    false,
    /* name */ undefined,
    factory.createNamedImports([
      factory.createImportSpecifier(
        false,
        /* propertyName */ undefined,
        factory.createIdentifier("t")
      ),
    ])
  ),
  factory.createStringLiteral("elysia")
);

function printToString(nodes: any, filename: string): string {
  const printer = createPrinter({ newLine: NewLineKind.LineFeed });
  const resultFile = createSourceFile(filename, "", ScriptTarget.Latest, true, ScriptKind.TS);
  return printer.printList(ListFormat.MultiLine, nodes, resultFile);
}

function generateCode() {
  const outFilename = "./gen/enums.ts";
  const sourceFilename = "./gen/database.ts";

  const program = createProgram([sourceFilename], {});
  const sourceFile = program.getSourceFile(sourceFilename);
  if (!sourceFile) {
    process.exit(0);
  }

  const interfaces = sourceFile.statements
    .filter(isInterfaceDeclaration)
    .map((interfaceDeclaration) => {
      const int = {
        name: interfaceDeclaration.name.escapedText,
        keys: interfaceDeclaration.members
          .filter(isPropertySignature)
          .map((propertySignature) =>
            "escapedText" in propertySignature.name
              ? propertySignature.name.escapedText.toString()
              : "ERROR"
          ),
      };
      int.keys.push("all");
      return int;
    });

  const tEnumNodes = interfaces.map((int) =>
    factory.createVariableStatement(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(`${int.name}Key`),
            /* exclamationToken */ undefined,
            /* type */ undefined,
            factory.createCallExpression(
              factory.createIdentifier("t.UnionEnum"),
              /* typeArguments */ undefined,
              [
                factory.createArrayLiteralExpression(
                  int.keys.map((key) => factory.createStringLiteral(key))
                ),
              ]
            )
          ),
        ],
        NodeFlags.Const
      )
    )
  );

  const generatedCode = printToString([importNode, ...tEnumNodes], outFilename);
  fs.writeFileSync(outFilename, generatedCode);
}

generateCode();
