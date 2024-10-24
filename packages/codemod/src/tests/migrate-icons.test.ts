import migrateIcons, { reactMatch } from "../transforms/migrate-icons.js";
import { describe, expect, test } from "vitest";
import { applyTransform } from "jscodeshift/src/testUtils.js";

interface ApplyMigrateIconsTransformParams {
  input: string;
  replaceIconsKeptForNow?: boolean;
}

function applyMigrateIconsTransform({
  input,
  replaceIconsKeptForNow,
}: ApplyMigrateIconsTransformParams) {
  const transformResult = applyTransform(
    migrateIcons,
    { match: reactMatch, replaceIconsKeptForNow },
    { path: "path/to/file", source: input },
    { parser: "tsx" },
  );

  return transformResult;
}

describe("어떤 변경도 일어나면 안 되는 경우", () => {
  test("import 없음", () => {
    const input = `console.log("Hello, world!", OldIcon1Thin);`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(
      `"console.log("Hello, world!", OldIcon1Thin);"`,
    );
  });

  test("모든 import source match되지 않음", () => {
    const input = `import { OldIcon1Thin, OldIcon2Thin } from "unrelated-package";
		import { OldIcon3Thin as Icon3Alias } from "another-unrelated-package";
		import OldIcon4Thin from "yet-another-unrelated-package/OldIcon4Thin";
		import * as Icons from "yet-another-unrelated-package";
		
		console.log(OldIcon1Thin);

    function test() {
	  	return <OldIcon2Thin />;
    }
		`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(`
      "import { OldIcon1Thin, OldIcon2Thin } from "unrelated-package";
      		import { OldIcon3Thin as Icon3Alias } from "another-unrelated-package";
      		import OldIcon4Thin from "yet-another-unrelated-package/OldIcon4Thin";
      		import * as Icons from "yet-another-unrelated-package";
      		
      		console.log(OldIcon1Thin);

          function test() {
      	  	return <OldIcon2Thin />;
          }"
    `);
  });

  test("패키지명 변경 필요 있고, importSpecifier length 1+지만 match 없음 (unlikely)", () => {
    const input = `import { IconNotMatched } from "@seed-design/icon";
		import { IconNotMatched as IconNotMatchedAlias } from "@seed-design/icon";
		import type { IconType } from "@seed-design/react-icon";
		import { type IconType2 } from "@seed-design/react-icon";
		`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(`
      "import { IconNotMatched } from "@seed-design/icon";
      		import { IconNotMatched as IconNotMatchedAlias } from "@seed-design/icon";
      		import type { IconType } from "@seed-design/react-icon";
      		import { type IconType2 } from "@seed-design/react-icon";"
    `);
  });
});

describe("importDeclaration: import source에만 변경 있는 경우", () => {
  test("패키지명 변경 필요 없지만 하위 경로 변경 필요하고, importDefaultSpecifier에 사용된 local specifier가 identifier와 match 없음 (deep import, unlikely)", () => {
    const input = `import IconNotMatched from "@seed-design/react-icon/IconUndoFill";`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(
      `"import IconNotMatched from "@daangn/react-icon/IconArrowUturnLeftFill";"`,
    );
  });

  test("패키지명 변경 필요 있지만 importNamespaceSpecifier", () => {
    const input = `import * as Icons from "@seed-design/icon";
    import * as Icons2 from "@seed-design/react-icon";`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(`
      "import * as Icons from "@daangn/react-icon";
          import * as Icons2 from "@daangn/react-icon";"
    `);
  });
});

describe("importDeclaration: import source와 specifier 모두 변경 있는 경우", () => {
  test("[가장 일반적] 패키지명에 변경 필요하고, specifier match 있음", () => {
    const input = `import { IconSortThin, IconSellRegular } from "@seed-design/icon";
    import { IconListFill as IconListAlias } from "@seed-design/icon";
    import { IconChartRegular } from "@seed-design/icon";`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(`
      "import { IconArrowUpArrowDownLine, IconPlusSquareLine } from "@daangn/react-icon";
          import { IconDothorizline3VerticalFill as IconListAlias } from "@daangn/react-icon";
          import { IconBarchartSquareLine } from "@daangn/react-icon";"
    `);
  });

  test("[가장 일반적] 패키지명에 변경 필요하고, importDefaultSpecifier이지만, 사용된 local specifier가 identifier와 match 있는 경우 (deep import)", () => {
    const input = `import IconListRegular from "@seed-design/icon/IconListRegular";
		import IconSellThin from "@seed-design/icon/dist/lib/test/somewhat/IconSellThin";`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(`
      "import IconDothorizline3VerticalLine from "@daangn/react-icon/IconDothorizline3VerticalLine";
      		import IconPlusSquareLine from "@daangn/react-icon/dist/lib/test/somewhat/IconPlusSquareLine";"
    `);
  });

  test("복합", () => {
    const input = `import {
        IconSellRegular,
        IconListFill,
        IconAddFill as AddIconAlias,
      } from "@seed-design/react-icon";
      import IconSellFill from "@seed-design/react-icon/IconSellFill";

      function App() {
        console.log(IconSellRegular);

        return (
          <>
            <IconListFill />
            <AddIconAlias />
          </>
        );
      }`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(`
      "import {
        IconPlusSquareLine,
        IconDothorizline3VerticalFill,
        IconPlusFill as AddIconAlias,
      } from "@daangn/react-icon";
            import IconPlusSquareFill from "@daangn/react-icon/IconPlusSquareFill";

            function App() {
              console.log(IconPlusSquareLine);

              return (<>
                <IconDothorizline3VerticalFill />
                <AddIconAlias />
              </>);
            }"
    `);
  });
});

describe("identifiers: identifier 변경까지 있는 경우", () => {
  test("source match와 identifier match 있는 경우", () => {
    const input = `import { IconSellRegular, IconListFill } from "@seed-design/icon";

    console.log(IconSellRegular);

    return IconListFill;`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(`
      "import { IconPlusSquareLine, IconDothorizline3VerticalFill } from "@daangn/react-icon";

          console.log(IconPlusSquareLine);

          return IconDothorizline3VerticalFill;"
    `);
  });

  test("source match와 identifier match 있는 경우 (jsx)", () => {
    const input = `import { IconSellRegular, IconListFill } from "@seed-design/icon";
		import { IconSellThin as IconSellAlias } from "@seed-design/icon";
		
		console.log(IconSellRegular);
		
    function test() {
      return <div>
        <IconListFill />
        <IconSellAlias />
      </div>;
    }`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(`
      "import { IconPlusSquareLine, IconDothorizline3VerticalFill } from "@daangn/react-icon";
      		import { IconPlusSquareLine as IconSellAlias } from "@daangn/react-icon";
      		
      		console.log(IconPlusSquareLine);
      		
          function test() {
            return (
              <div>
                <IconDothorizline3VerticalFill />
                <IconSellAlias />
              </div>
            );
          }"
    `);
  });

  test("source match와 identifier match 있는 경우 (jsx, 첫 줄에 주석 있음)", () => {
    const input = `// some comment
    import { IconSellRegular, IconListFill } from "@seed-design/icon";
		import { IconSellThin as IconSellAlias } from "@seed-design/icon";
		
		console.log(IconSellRegular);
		
    function test() {
      return <div>
        <IconListFill />
        <IconSellAlias />
      </div>;
    }`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(`
      "// some comment
          import { IconPlusSquareLine, IconDothorizline3VerticalFill } from "@daangn/react-icon";
      		import { IconPlusSquareLine as IconSellAlias } from "@daangn/react-icon";
      		
      		console.log(IconPlusSquareLine);
      		
          function test() {
            return (
              <div>
                <IconDothorizline3VerticalFill />
                <IconSellAlias />
              </div>
            );
          }"
    `);
  });

  test("source match와 identifier match 있는 경우 (jsx, 첫 줄에 directive 있음)", () => {
    const input = `"use client";
    
    import { IconSellRegular, IconListFill } from "@seed-design/icon";
		import { IconSellThin as IconSellAlias } from "@seed-design/icon";
		
		console.log(IconSellRegular);
		
    function test() {
      return <div>
        <IconListFill />
        <IconSellAlias />
      </div>;
    }`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(`
      ""use client";
          
          import { IconPlusSquareLine, IconDothorizline3VerticalFill } from "@daangn/react-icon";
      		import { IconPlusSquareLine as IconSellAlias } from "@daangn/react-icon";
      		
      		console.log(IconPlusSquareLine);
      		
          function test() {
            return (
              <div>
                <IconDothorizline3VerticalFill />
                <IconSellAlias />
              </div>
            );
          }"
    `);
  });

  test("패키지명 변경 필요하고, importNamespaceSpecifier", () => {
    const input = `import * as Icons from "@seed-design/icon";
    
    console.log(Icons.IconSellRegular);`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(`
      "import * as Icons from "@daangn/react-icon";
          
          console.log(Icons.IconPlusSquareLine);"
    `);
  });
});

describe("n:1 매핑", () => {
  test("n:1 매핑", () => {
    const input = `import { IconSellThin, IconSellRegular, IconSellFill } from "@seed-design/icon";`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(
      `"import { IconPlusSquareLine, IconPlusSquareFill } from "@daangn/react-icon";"`,
    );
  });

  test("n:1 매핑 with identifiers", () => {
    const input = `import {
      IconSellThin,
      IconSellRegular,
      IconSellFill,
      IconCertificationThin,
      IconCertificationRegular,
      IconCertificationFill
    } from "@seed-design/icon";
    
    console.log(IconSellFill);
    
    function test() {
      return (<div>
        <IconSellThin />
        <IconSellRegular />
        <IconCertificationRegular />
        <IconCertificationFill />
      </div>);
    }`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(`
      "import {
        IconPlusSquareLine,
        IconPlusSquareFill,
        IconCrosshairLine,
        IconCrosshairFill,
      } from "@daangn/react-icon";
          
          console.log(IconPlusSquareFill);
          
          function test() {
            return (
              (<div>
                <IconPlusSquareLine />
                <IconPlusSquareLine />
                <IconCrosshairLine />
                <IconCrosshairFill />
              </div>)
            );
          }"
    `);
  });
});

describe("변환 정보 있지만, 확인 필요하거나 유지하기로 결정된 경우", () => {
  test("확인 필요한 importSpecifier (action required)", () => {
    const input = `import { IconSuggestRegular } from "@seed-design/icon";
    
    function test() {
      return <IconSuggestRegular />;
    }`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(`
      "import { IconLightbulbDot5Line } from "@daangn/react-icon";
          
          function test() {
            return <IconLightbulbDot5Line />;
          }"
    `);
  });

  test("확인 필요한 importDefaultSpecifier (action required)", () => {
    const input = `import IconSuggestRegular from "@seed-design/icon/IconSuggestRegular";`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(
      `"import IconLightbulbDot5Line from "@daangn/react-icon/IconLightbulbDot5Line";"`,
    );
  });

  test("확인 필요한 importNamespaceSpecifier (action required)", () => {
    const input = `import * as Icons from "@seed-design/icon";
    
    console.log(Icons.IconSuggestRegular);`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(`
      "import * as Icons from "@daangn/react-icon";
          
          console.log(Icons.IconLightbulbDot5Line);"
    `);
  });

  test("변환 정보 있지만, 변환하지 않고 유지 (단독 사용)", () => {
    const input = `import { IconCarRegular } from "@seed-design/icon";
    
    function test() {
      return <IconCarRegular />;
    }`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(`
      "import { IconCarRegular } from "@seed-design/icon";
          
          function test() {
            return <IconCarRegular />;
          }"
    `);
  });

  test("이전에 유지하기로 했었던 아이콘까지 replace (단독 사용)", () => {
    const input = `import { IconCarRegular } from "@seed-design/icon";

    function test() {
      return <IconCarRegular />;
    }`;

    expect(
      applyMigrateIconsTransform({ input, replaceIconsKeptForNow: true }),
    ).toMatchInlineSnapshot(`
      "import { IconCarFrontsideLine } from "@daangn/react-icon";

          function test() {
            return <IconCarFrontsideLine />;
          }"
    `);
  });

  test("변환 정보 있지만, 변환하지 않고 유지 (섞인 경우)", () => {
    const input = `import { IconCarRegular, IconCarThin, IconJobsFill, IconSellRegular } from "@seed-design/icon";
    import IconRestaurantThin from "@seed-design/react-icon/lib/IconRestaurantThin";
    
    export function test() {
      return (<div>
        <IconCarRegular />
        <IconCarThin />
        <IconJobsFill />
        <IconSellRegular />
      </div>);}`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(`
      "import { IconPlusSquareLine } from "@daangn/react-icon";
      import { IconCarRegular, IconCarThin, IconJobsFill } from "@seed-design/icon";
      import IconRestaurantThin from "@seed-design/react-icon/lib/IconRestaurantThin";

      export function test() {
        return (
          (<div>
            <IconCarRegular />
            <IconCarThin />
            <IconJobsFill />
            <IconPlusSquareLine />
          </div>)
        );}"
    `);
  });

  test("이전에 유지하기로 했었던 아이콘까지 replace (섞인 경우)", () => {
    const input = `import { IconCarRegular, IconCarThin, IconJobsFill, IconSellRegular } from "@seed-design/icon";
    
    export function test() {
      return (<div>
        <IconCarRegular />
        <IconCarThin />
        <IconJobsFill />
        <IconSellRegular />
      </div>);}`;

    expect(
      applyMigrateIconsTransform({ input, replaceIconsKeptForNow: true }),
    ).toMatchInlineSnapshot(`
      "import { IconCarFrontsideLine, IconPersonMagnifyingglassFill, IconPlusSquareLine } from "@daangn/react-icon";
          
          export function test() {
            return (
              (<div>
                <IconCarFrontsideLine />
                <IconCarFrontsideLine />
                <IconPersonMagnifyingglassFill />
                <IconPlusSquareLine />
              </div>)
            );}"
    `);
  });

  test("나눠진 결과를 이후 합치는 경우", () => {
    const input = `import { IconPlusSquareLine } from "@daangn/react-icon";
      import { IconCarRegular, IconCarThin, IconJobsFill } from "@seed-design/icon";
      import IconRestaurantThin from "@daangn/react-icon/lib/IconRestaurantThin";

      export function test() {
        return (
          (<div>
            <IconCarRegular />
            <IconCarThin />
            <IconJobsFill />
            <IconPlusSquareLine />
          </div>)
        );
      }
    `;

    expect(
      applyMigrateIconsTransform({ input, replaceIconsKeptForNow: true }),
    ).toMatchInlineSnapshot(`
      "import { IconPlusSquareLine } from "@daangn/react-icon";
            import { IconCarFrontsideLine, IconPersonMagnifyingglassFill } from "@daangn/react-icon";
            import IconForkSpoonLine from "@daangn/react-icon/lib/IconRestaurantThin";

            export function test() {
              return (
                (<div>
                  <IconCarFrontsideLine />
                  <IconCarFrontsideLine />
                  <IconPersonMagnifyingglassFill />
                  <IconPlusSquareLine />
                </div>)
              );
            }"
    `);
  });
});

describe("comments 유지", () => {
  test("comments 유지", () => {
    const input = `// comment
    import { IconArrowUpwardThin, IconArrowDownwardFill, IconArrowUpwardRegular } from "@seed-design/icon";
    // comment
    import { IconSellRegular as IconAlias } from "@seed-design/icon";
    // comment
    import { IconLocationRegular } from "@seed-design/icon";`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(`
    "// comment
        import { IconArrowUpLine, IconArrowDownFill } from "@daangn/react-icon";
        // comment
        import { IconPlusSquareLine as IconAlias } from "@daangn/react-icon";
        // comment
        import { IconLocationpinLine } from "@daangn/react-icon";"
  `);
  });

  test("comments 유지 (나눠지는 경우)", () => {
    const input = `// comment
    import { IconCarRegular, IconCarThin, IconJobsFill, IconSellRegular } from "@seed-design/icon";
    // comment
    import IconRestaurantThin from "@seed-design/react-icon/lib/IconRestaurantThin";
    
    export function test() {
      return (<div>
        <IconCarRegular />
        <IconCarThin />
        <IconJobsFill />
        <IconSellRegular />
      </div>);}`;

    expect(applyMigrateIconsTransform({ input })).toMatchInlineSnapshot(`
      "// comment
      import { IconPlusSquareLine } from "@daangn/react-icon";

      // comment
      import { IconCarRegular, IconCarThin, IconJobsFill } from "@seed-design/icon";

      // comment
      import IconRestaurantThin from "@seed-design/react-icon/lib/IconRestaurantThin";

      export function test() {
        return (
          (<div>
            <IconCarRegular />
            <IconCarThin />
            <IconJobsFill />
            <IconPlusSquareLine />
          </div>)
        );}"
    `);
  });
});
