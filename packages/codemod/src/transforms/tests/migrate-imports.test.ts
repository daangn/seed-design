import migrateImports from "../migrate-imports";
import type { MigrateImportsOptions } from "../migrate-imports";
import { describe, expect, test } from "vitest";
import { applyTransform } from "jscodeshift/src/testUtils";

const testMatch: MigrateImportsOptions["match"] = {
  source: [
    { startsWith: "@seed-design/icon", replaceWith: "@seed-design/react-icon" },
    { startsWith: "@seed-design/react-icon" },
  ],
  identifier: {
    OldIcon1Thin: "NewIcon1Line",
    OldIcon1Regular: "NewIcon1Line",
    OldIcon1Fill: "NewIcon1Fill",

    OldIcon2Thin: "NewIcon2Line",
    OldIcon2Regular: "NewIcon2Line",
    OldIcon2Fill: "NewIcon2Fill",

    OldIcon3Thin: "NewIcon3Line",
    OldIcon3Regular: "NewIcon3Line",
    OldIcon3Fill: "NewIcon3Fill",

    OldIcon4Thin: "NewIcon4Line",
    OldIcon4Regular: "NewIcon4Line",
    OldIcon4Fill: "NewIcon4Fill",

    OldIcon5Thin: "NewIcon5Line",
    OldIcon5Regular: "NewIcon5Line",
    OldIcon5Fill: "NewIcon5Fill",

    OldIcon6Thin: "NewIcon6Line",
    OldIcon6Regular: "NewIcon6Line",
    OldIcon6Fill: "NewIcon6Fill",

    OldIcon7Thin: "NewIcon7Line",
    OldIcon7Regular: "NewIcon7Line",
    OldIcon7Fill: "NewIcon7Fill",

    OldIcon8Thin: "NewIcon8Line",
    OldIcon8Regular: "NewIcon8Line",
    OldIcon8Fill: "NewIcon8Fill",

    OldIcon9Thin: "NewIcon9Line",
    OldIcon9Regular: "NewIcon9Line",
    OldIcon9Fill: "NewIcon9Fill",
  },
};

function applyMigrateImportsTransform(
  source: string,
  migrateImportsOptions: MigrateImportsOptions = { match: testMatch },
) {
  const transformResult = applyTransform(
    migrateImports,
    migrateImportsOptions,
    { path: "path/to/file", source },
    { parser: "tsx" },
  );

  return transformResult;
}

describe("어떤 변경도 일어나면 안 되는 경우", () => {
  test("import 없음", () => {
    const input = `console.log("Hello, world!", OldIcon1Thin);`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(
      `"console.log("Hello, world!", OldIcon1Thin);"`,
    );
  });

  test("모든 import source match되지 않음", () => {
    const input = `import { OldIcon1Thin, OldIcon2Thin } from "unrelated-package";
		import { OldIcon3Thin as Icon3Alias } from "another-unrelated-package";
		import OldIcon4Thin from "yet-another-unrelated-package/OldIcon4Thin";
		import * as Icons from "yet-another-unrelated-package";
		
		console.log(OldIcon1Thin);

		return <OldIcon2Thin />;
		`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(`
      "import { OldIcon1Thin, OldIcon2Thin } from "unrelated-package";
      		import { OldIcon3Thin as Icon3Alias } from "another-unrelated-package";
      		import OldIcon4Thin from "yet-another-unrelated-package/OldIcon4Thin";
      		import * as Icons from "yet-another-unrelated-package";
      		
      		console.log(OldIcon1Thin);

      		return <OldIcon2Thin />;"
    `);
  });

  test("import source match 있지만 변경할 필요 없고, importSpecifier length 0 (unlikely)", () => {
    const input = `import "@seed-design/react-icon";`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(
      `"import "@seed-design/react-icon";"`,
    );
  });

  test("import source match 있지만 변경할 필요 없고, importSpecifier length 1+지만 match 없음 (unlikely)", () => {
    const input = `import { IconNotMatched } from "@seed-design/react-icon";
		import { IconNotMatched2 as IconNotMatched2Alias } from "@seed-design/react-icon";
		import type { IconType } from "@seed-design/react-icon";
		import { type IconType2 } from "@seed-design/react-icon";
		`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(`
      "import { IconNotMatched } from "@seed-design/react-icon";
      		import { IconNotMatched2 as IconNotMatched2Alias } from "@seed-design/react-icon";
      		import type { IconType } from "@seed-design/react-icon";
      		import { type IconType2 } from "@seed-design/react-icon";"
    `);
  });
});

describe("importDeclaration: import source에만 변경 있는 경우", () => {
  test("패키지명 변경 필요 있지만, importSpecifier length 0 (unlikely)", () => {
    const input = `import "@seed-design/icon";`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(
      `"import "@seed-design/react-icon";"`,
    );
  });

  test("패키지명 변경 필요 있지만, importSpecifier length 0 (첫 줄에 주석 있음, unlikely)", () => {
    const input = `// some comment
		import "@seed-design/icon";
		`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(`
      "// some comment
      		import "@seed-design/react-icon";"
    `);
  });

  test("패키지명 변경 필요 있고, importSpecifier length 1+지만 match 없음 (unlikely)", () => {
    const input = `import { IconNotMatched } from "@seed-design/icon";
		import { IconNotMatched2 as IconNotMatched2Alias } from "@seed-design/icon";
		import type { IconType } from "@seed-design/icon";
		import { type IconType2 } from "@seed-design/icon";
		`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(`
      "import { IconNotMatched } from "@seed-design/react-icon";
      		import { IconNotMatched2 as IconNotMatched2Alias } from "@seed-design/react-icon";
      		import type { IconType } from "@seed-design/react-icon";
      		import { type IconType2 } from "@seed-design/react-icon";"
    `);
  });

  test("패키지명 변경 필요 있고, importDefaultSpecifier에 사용된 local specifier가 identifier와 match 없음 (deep import, unlikely)", () => {
    const input = `import IconNotMatched from "@seed-design/icon/IconNotMatched";
		import IconNotMatched2 from "@seed-design/icon/dist/lib/test/somewhat/IconNotMatched2";`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(`
      "import IconNotMatched from "@seed-design/react-icon/IconNotMatched";
      		import IconNotMatched2 from "@seed-design/react-icon/dist/lib/test/somewhat/IconNotMatched2";"
    `);
  });

  test("패키지명 변경 필요 없지만 하위 경로 변경 필요하고, importDefaultSpecifier에 사용된 local specifier가 identifier와 match 없음 (deep import, unlikely)", () => {
    const input = `import IconNotMatched from "@seed-design/react-icon/OldIcon3Thin";`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(
      `"import IconNotMatched from "@seed-design/react-icon/NewIcon3Line";"`,
    );
  });

  test("패키지명 변경 필요 있지만 importNamespaceSpecifier", () => {
    const input = `import * as Icons from "@seed-design/icon";`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(
      `"import * as Icons from "@seed-design/react-icon";"`,
    );
  });
});

describe("importDeclaration: import source와 specifier 모두 변경 있는 경우", () => {
  test("[가장 일반적] 패키지명에 변경 필요하고, specifier match 있음", () => {
    const input = `import { OldIcon1Thin, OldIcon2Thin } from "@seed-design/icon";
    import { OldIcon3Thin as Icon3Alias } from "@seed-design/icon";
    import { OldIcon4Thin } from "@seed-design/icon";`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(`
      "import { NewIcon1Line, NewIcon2Line } from "@seed-design/react-icon";
          import { NewIcon3Line as Icon3Alias } from "@seed-design/react-icon";
          import { NewIcon4Line } from "@seed-design/react-icon";"
    `);
  });

  test("[가장 일반적] 패키지명에 변경 필요하고, importDefaultSpecifier이지만, 사용된 local specifier가 identifier와 match 있는 경우 (deep import)", () => {
    const input = `import OldIcon1Thin from "@seed-design/icon/OldIcon1Thin";
		import OldIcon2Thin from "@seed-design/icon/dist/lib/test/somewhat/OldIcon2Thin";`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(`
      "import NewIcon1Line from "@seed-design/react-icon/NewIcon1Line";
      		import NewIcon2Line from "@seed-design/react-icon/dist/lib/test/somewhat/NewIcon2Line";"
    `);
  });

  test("[가장 일반적] 패키지명 변경 필요 없지만 deep import라 하위 경로 변경 필요하고, importDefaultSpecifier에 사용된 local specifier가 identifier와 match 있는 경우 (deep import)", () => {
    const input = `import OldIcon3Thin from "@seed-design/react-icon/OldIcon3Thin";`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(
      `"import NewIcon3Line from "@seed-design/react-icon/NewIcon3Line";"`,
    );
  });
});

describe("importDeclaration: import specifier에만 변경 있는 경우", () => {
  test("[가장 일반적] 패키지명 변경할 필요 없지만, specifier match 있음", () => {
    const input = `import { OldIcon3Thin } from "@seed-design/react-icon";`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(
      `"import { NewIcon3Line } from "@seed-design/react-icon";"`,
    );
  });

  // deep import인 경우 import source만 변경되거나, import source와 specifier 모두 변경되어야 함
});

describe("identifiers: identifier 변경까지 있는 경우", () => {
  test("source match와 identifier match 있는 경우", () => {
    const input = `import { OldIcon1Thin, OldIcon2Thin } from "@seed-design/icon";

    console.log(OldIcon1Thin);

    return OldIcon2Thin;`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(`
      "import { NewIcon1Line, NewIcon2Line } from "@seed-design/react-icon";

          console.log(NewIcon1Line);

          return NewIcon2Line;"
    `);
  });

  test("source match와 identifier match 있는 경우 (jsx)", () => {
    const input = `import { OldIcon1Thin, OldIcon2Thin } from "@seed-design/icon";
		import { OldIcon3Thin as Icon3Alias } from "@seed-design/icon";
		
		console.log(OldIcon1Thin);
		
		return <div>
			<OldIcon2Thin />
			<Icon3Alias />
		</div>;`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(`
      "import { NewIcon1Line, NewIcon2Line } from "@seed-design/react-icon";
      		import { NewIcon3Line as Icon3Alias } from "@seed-design/react-icon";
      		
      		console.log(NewIcon1Line);
      		
      		return (
                  <div>
                      <NewIcon2Line />
                      <Icon3Alias />
                  </div>
              );"
    `);
  });

  test("source match와 identifier match 있는 경우 (jsx, 첫 줄에 주석 있음)", () => {
    const input = `// some comment
		
		import { OldIcon1Thin, OldIcon2Thin } from "@seed-design/icon";
		import { OldIcon3Thin as Icon3Alias } from "@seed-design/icon";
		
		console.log(OldIcon1Thin);
		
		return <div>
			<OldIcon2Thin />
			<Icon3Alias />
			</div>;`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(`
      "// some comment
      		
      		import { NewIcon1Line, NewIcon2Line } from "@seed-design/react-icon";
      		import { NewIcon3Line as Icon3Alias } from "@seed-design/react-icon";
      		
      		console.log(NewIcon1Line);
      		
      		return (
                  <div>
                      <NewIcon2Line />
                      <Icon3Alias />
                      </div>
              );"
    `);
  });

  test("source match와 identifier match 있는 경우 (jsx, 첫 줄에 directive 있음)", () => {
    const input = `"use client";

		import { OldIcon1Thin, OldIcon2Thin } from "@seed-design/icon";
		import { OldIcon3Thin as Icon3Alias } from "@seed-design/icon";
		
		console.log(OldIcon1Thin);
		
		return <div>
			<OldIcon2Thin />
			<Icon3Alias />
			</div>;`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(`
      ""use client";

      		import { NewIcon1Line, NewIcon2Line } from "@seed-design/react-icon";
      		import { NewIcon3Line as Icon3Alias } from "@seed-design/react-icon";
      		
      		console.log(NewIcon1Line);
      		
      		return (
                  <div>
                      <NewIcon2Line />
                      <Icon3Alias />
                      </div>
              );"
    `);
  });

  test("패키지명 변경 필요하고, importNamespaceSpecifier", () => {
    const input = `import * as Icons from "@seed-design/icon";
    
    console.log(Icons.OldIcon1Thin);`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(`
      "import * as Icons from "@seed-design/react-icon";
          
          console.log(Icons.NewIcon1Line);"
    `);
  });
});

describe("identifiers: identifier 변경만 있는 경우", () => {
  test("패키지명 변경 필요 없고, importNamespaceSpecifier", () => {
    const input = `import * as Icons from "@seed-design/react-icon";
    
    console.log(Icons.OldIcon1Thin);`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(`
      "import * as Icons from "@seed-design/react-icon";
          
          console.log(Icons.NewIcon1Line);"
    `);
  });
});

describe("n:1 매핑", () => {
  test("n:1 매핑", () => {
    const input = `import { OldIcon1Thin, OldIcon1Regular, OldIcon1Fill } from "@seed-design/icon";`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(
      `"import { NewIcon1Line, NewIcon1Fill } from "@seed-design/react-icon";"`,
    );
  });

  test("n:1 매핑 with identifiers", () => {
    const input = `import { OldIcon1Thin, OldIcon1Regular, OldIcon1Fill, OldIcon2Thin, OldIcon2Regular, OldIcon3Fill } from "@seed-design/icon";
    
    console.log(OldIcon1Thin);
    
    return (<div>
      <OldIcon1Regular />
      <OldIcon1Thin />
      <OldIcon3Fill />
      <OldIcon2Thin />
    </div>);`;

    expect(applyMigrateImportsTransform(input)).toMatchInlineSnapshot(`
      "import { NewIcon1Line, NewIcon1Fill, NewIcon2Line, NewIcon3Fill } from "@seed-design/react-icon";
          
          console.log(NewIcon1Line);
          
          return (
            (<div>
              <NewIcon1Line />
              <NewIcon1Line />
              <NewIcon3Fill />
              <NewIcon2Line />
            </div>)
          );"
    `);
  });
});
