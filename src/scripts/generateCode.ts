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
} from "typescript";

const name = "ContentKey";
const keys = [
  "all",
  "contentTypeId",
  "createdAt",
  "data",
  "dataIndex1",
  "dataIndex10",
  "dataIndex2",
  "dataIndex3",
  "dataIndex4",
  "dataIndex5",
  "dataIndex6",
  "dataIndex7",
  "dataIndex8",
  "dataIndex9",
  "dataIndexKey1",
  "dataIndexKey10",
  "dataIndexKey2",
  "dataIndexKey3",
  "dataIndexKey4",
  "dataIndexKey5",
  "dataIndexKey6",
  "dataIndexKey7",
  "dataIndexKey8",
  "dataIndexKey9",
  "displaySheetId",
  "id",
  "isDynamic",
  "name",
  "ownerUserId",
  "rulesetId",
  "updatedAt",
  "visibility",
];

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

const constNode = factory.createVariableStatement(
  [factory.createModifier(SyntaxKind.ExportKeyword)],
  factory.createVariableDeclarationList(
    [
      factory.createVariableDeclaration(
        factory.createIdentifier(name),
        /* exclamationToken */ undefined,
        /* type */ undefined,
        factory.createCallExpression(
          factory.createIdentifier("t.UnionEnum"),
          /* typeArguments */ undefined,
          [
            factory.createArrayLiteralExpression(
              keys.map((key) => factory.createStringLiteral(key))
            ),
          ]
        )
      ),
    ],
    NodeFlags.Const
  )
);

function printToString(nodes: any, filename: string): string {
  const printer = createPrinter({ newLine: NewLineKind.LineFeed });
  const resultFile = createSourceFile(filename, "", ScriptTarget.Latest, true, ScriptKind.TS);
  return printer.printList(ListFormat.MultiLine, nodes, resultFile);
}

function generateCode() {
  const fileName = "./gen/enums.ts";
  const generatedCode = printToString([importNode, constNode], fileName);
  fs.writeFileSync(fileName, generatedCode);
}

generateCode();
