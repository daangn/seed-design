import { migrateIcons, type MigrateIconsOptions } from "../migrate-icons";
import { describe, expect, test } from "vitest";
import { applyTransform } from "jscodeshift/src/testUtils";

const testMatch: MigrateIconsOptions["match"] = {
  source: [
    { startsWith: "@seed-design/icon", replaceWith: "@seed-design/react-icon" },
    { startsWith: "@seed-design/react-icon" },
  ],
  identifier: {
    Icon1: "NewIcon1",
    Icon2: "NewIcon2",
    Icon3: "NewIcon3",
    Icon4: "NewIcon4",
    Icon5: "NewIcon5",
    Icon6: "NewIcon6",
    Icon7: "NewIcon7",
    Icon8: "NewIcon8",
    Icon9: "NewIcon9",
    Icon10: "NewIcon10",
    Icon11: "NewIcon11",
    Icon12: "NewIcon12",
    Icon13: "NewIcon13",
    Icon14: "NewIcon14",
    Icon15: "NewIcon15",
  },
};

function applyMigrateIconTransform(
  source: string,
  migrateIconsOptions: MigrateIconsOptions = { match: testMatch },
) {
  const transformResult = applyTransform(
    migrateIcons,
    migrateIconsOptions,
    { path: "path/to/file", source },
    { parser: "tsx" },
  );

  return transformResult;
}

describe("어떤 변경도 일어나면 안 되는 경우", () => {
  test("import 없음", () => {
    const input = `console.log("Hello, world!", Icon1);`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(
      `"console.log("Hello, world!", Icon1);"`,
    );
  });

  test("모든 import source match되지 않음", () => {
    const input = `import { Icon1, Icon2 } from "unrelated-package";
		import { Icon3 as Icon3Alias } from "another-unrelated-package";
		import Icon4 from "yet-another-unrelated-package/Icon4";
		import * as Icons from "yet-another-unrelated-package";
		
		console.log(Icon1);

		return <Icon2 />;
		`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(`
      "import { Icon1, Icon2 } from "unrelated-package";
      		import { Icon3 as Icon3Alias } from "another-unrelated-package";
      		import Icon4 from "yet-another-unrelated-package/Icon4";
      		import * as Icons from "yet-another-unrelated-package";
      		
      		console.log(Icon1);

      		return <Icon2 />;"
    `);
  });

  test("import source match 있지만 변경할 필요 없고, importSpecifier length 0", () => {
    const input = `import "@seed-design/react-icon";`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(
      `"import "@seed-design/react-icon";"`,
    );
  });

  test("import source match 있지만 변경할 필요 없고, importSpecifier length 1+지만 match 없음", () => {
    const input = `import { IconNotMatched } from "@seed-design/react-icon";
		import { IconNotMatched2 as IconNotMatched2Alias } from "@seed-design/react-icon";
		import type { IconType } from "@seed-design/react-icon";
		import { type IconType2 } from "@seed-design/react-icon";
		`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(`
      "import { IconNotMatched } from "@seed-design/react-icon";
      		import { IconNotMatched2 as IconNotMatched2Alias } from "@seed-design/react-icon";
      		import type { IconType } from "@seed-design/react-icon";
      		import { type IconType2 } from "@seed-design/react-icon";"
    `);
  });
});

describe("importDeclaration: import source에만 변경 있는 경우", () => {
  test("패키지명 변경 필요 있지만, importSpecifier length 0", () => {
    const input = `import "@seed-design/icon";`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(
      `"import "@seed-design/react-icon";"`,
    );
  });

  test("패키지명 변경 필요 있지만, importSpecifier length 0 (첫 줄에 주석 있음)", () => {
    const input = `// some comment
		import "@seed-design/icon";
		`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(`
      "// some comment
      		import "@seed-design/react-icon";"
    `);
  });

  test("패키지명 변경 필요 있고, importSpecifier length 1+지만 match 없음", () => {
    const input = `import { IconNotMatched } from "@seed-design/icon";
		import { IconNotMatched2 as IconNotMatched2Alias } from "@seed-design/icon";
		import type { IconType } from "@seed-design/icon";
		import { type IconType2 } from "@seed-design/icon";
		`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(`
      "import { IconNotMatched } from "@seed-design/react-icon";
      		import { IconNotMatched2 as IconNotMatched2Alias } from "@seed-design/react-icon";
      		import type { IconType } from "@seed-design/react-icon";
      		import { type IconType2 } from "@seed-design/react-icon";"
    `);
  });

  test("패키지명 변경 필요 있고, importDefaultSpecifier에 사용된 local specifier가 identifier와 match 없음 (deep import)", () => {
    const input = `import IconNotMatched from "@seed-design/icon/IconNotMatched";
		import IconNotMatched2 from "@seed-design/icon/dist/lib/test/somewhat/IconNotMatched2";`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(`
      "import IconNotMatched from "@seed-design/react-icon/IconNotMatched";
      		import IconNotMatched2 from "@seed-design/react-icon/dist/lib/test/somewhat/IconNotMatched2";"
    `);
  });

  test("패키지명 변경 필요 없지만 하위 경로 변경 필요하고, importDefaultSpecifier에 사용된 local specifier가 identifier와 match 없고 (deep import)", () => {
    const input = `import IconNotMatched from "@seed-design/react-icon/Icon3";`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(
      `"import IconNotMatched from "@seed-design/react-icon/NewIcon3";"`,
    );
  });

  test("패키지명 변경 필요 있지만 importNamespaceSpecifier", () => {
    const input = `import * as Icons from "@seed-design/icon";`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(
      `"import * as Icons from "@seed-design/react-icon";"`,
    );
  });
});

describe("importDeclaration: import source와 specifier 모두 변경 있는 경우", () => {
  test("[가장 일반적] 패키지명에 변경 필요하고, specifier match 있음", () => {
    const input = `import { Icon1, Icon2 } from "@seed-design/icon";
    import { Icon3 as Icon3Alias } from "@seed-design/icon";
    import { Icon4 } from "@seed-design/icon";`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(`
      "import { NewIcon1, NewIcon2 } from "@seed-design/react-icon";
          import { NewIcon3 as Icon3Alias } from "@seed-design/react-icon";
          import { NewIcon4 } from "@seed-design/react-icon";"
    `);
  });

  test("[가장 일반적] 패키지명에 변경 필요하고, importDefaultSpecifier이지만, 사용된 local specifier가 identifier와 match 있는 경우 (deep import)", () => {
    const input = `import Icon1 from "@seed-design/icon/Icon1";
		import Icon2 from "@seed-design/icon/dist/lib/test/somewhat/Icon2";`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(`
      "import NewIcon1 from "@seed-design/react-icon/NewIcon1";
      		import NewIcon2 from "@seed-design/react-icon/dist/lib/test/somewhat/NewIcon2";"
    `);
  });

  test("[가장 일반적] 패키지명 변경 필요 없지만 deep import라 하위 경로 변경 필요하고, importDefaultSpecifier에 사용된 local specifier가 identifier와 match 있는 경우 (deep import)", () => {
    const input = `import Icon3 from "@seed-design/react-icon/Icon3";`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(
      `"import NewIcon3 from "@seed-design/react-icon/NewIcon3";"`,
    );
  });
});

describe("importDeclaration: import specifier에만 변경 있는 경우", () => {
  test("[가장 일반적] 패키지명 변경할 필요 없지만, specifier match 있음", () => {
    const input = `import { Icon3 } from "@seed-design/react-icon";`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(
      `"import { NewIcon3 } from "@seed-design/react-icon";"`,
    );
  });

  // deep import인 경우 import source만 변경되거나, import source와 specifier 모두 변경되어야 함
});

describe("identifiers: identifier 변경까지 있는 경우", () => {
  test("source match와 identifier match 있는 경우", () => {
    const input = `import { Icon1, Icon2 } from "@seed-design/icon";

    console.log(Icon1);

    return Icon2;`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(`
      "import { NewIcon1, NewIcon2 } from "@seed-design/react-icon";

          console.log(NewIcon1);

          return NewIcon2;"
    `);
  });

  test("source match와 identifier match 있는 경우 (jsx)", () => {
    const input = `import { Icon1, Icon2 } from "@seed-design/icon";
		import { Icon3 as Icon3Alias } from "@seed-design/icon";
		
		console.log(Icon1);
		
		return <div>
			<Icon2 />
			<Icon3Alias />
		</div>;`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(`
      "import { NewIcon1, NewIcon2 } from "@seed-design/react-icon";
      		import { NewIcon3 as Icon3Alias } from "@seed-design/react-icon";
      		
      		console.log(NewIcon1);
      		
      		return (
                  <div>
                      <NewIcon2 />
                      <Icon3Alias />
                  </div>
              );"
    `);
  });

  test("source match와 identifier match 있는 경우 (jsx, 첫 줄에 주석 있음)", () => {
    const input = `// some comment
		
		import { Icon1, Icon2 } from "@seed-design/icon";
		import { Icon3 as Icon3Alias } from "@seed-design/icon";
		
		console.log(Icon1);
		
		return <div>
			<Icon2 />
			<Icon3Alias />
			</div>;`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(`
      "// some comment
      		
      		import { NewIcon1, NewIcon2 } from "@seed-design/react-icon";
      		import { NewIcon3 as Icon3Alias } from "@seed-design/react-icon";
      		
      		console.log(NewIcon1);
      		
      		return (
                  <div>
                      <NewIcon2 />
                      <Icon3Alias />
                      </div>
              );"
    `);
  });

  test("source match와 identifier match 있는 경우 (jsx, 첫 줄에 directive 있음)", () => {
    const input = `"use client";

		import { Icon1, Icon2 } from "@seed-design/icon";
		import { Icon3 as Icon3Alias } from "@seed-design/icon";
		
		console.log(Icon1);
		
		return <div>
			<Icon2 />
			<Icon3Alias />
			</div>;`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(`
      ""use client";

      		import { NewIcon1, NewIcon2 } from "@seed-design/react-icon";
      		import { NewIcon3 as Icon3Alias } from "@seed-design/react-icon";
      		
      		console.log(NewIcon1);
      		
      		return (
                  <div>
                      <NewIcon2 />
                      <Icon3Alias />
                      </div>
              );"
    `);
  });

  test("패키지명 변경 필요하고, importNamespaceSpecifier", () => {
    const input = `import * as Icons from "@seed-design/icon";
    
    console.log(Icons.Icon1);`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(`
      "import * as Icons from "@seed-design/react-icon";
          
          console.log(Icons.NewIcon1);"
    `);
  });
});

describe("identifiers: identifier 변경만 있는 경우", () => {
  test("패키지명 변경 필요 없고, importNamespaceSpecifier", () => {
    const input = `import * as Icons from "@seed-design/react-icon";
    
    console.log(Icons.Icon1);`;

    expect(applyMigrateIconTransform(input)).toMatchInlineSnapshot(`
      "import * as Icons from "@seed-design/react-icon";
          
          console.log(Icons.NewIcon1);"
    `);
  });
});
