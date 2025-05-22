import { getRootage } from "@/components/rootage";
import { FoundationTokenMapping } from "@seed-design/migration-index";
import { typographyMappings } from "@seed-design/migration-index/typography";
import { Text, TextProps } from "@seed-design/react";
import { Fragment } from "react";

export async function TypographyMigrationIndex() {
  const rootage = await getRootage();

  if (!("typography" in rootage.componentSpecEntities)) {
    throw new Error("Typography component spec not found");
  }

  const tableItems: FoundationTokenMapping[] = typographyMappings.map((item) => ({
    previous: item.previous,
    next: item.next.map((id) => {
      const typography = rootage.componentSpecEntities.typography.body.find(({ variants }) =>
        variants.some((variant) => variant.name === "textStyle" && variant.value === id),
      );

      if (!typography) {
        throw new Error(`Typography component spec not found for variant textStyle=${id}`);
      }

      return id;
    }),
    alternative: item.alternative?.map((id) => {
      const typography = rootage.componentSpecEntities.typography.body.find(({ variants }) =>
        variants.some(
          (variant) => variant.name === "textStyle" && item.alternative?.includes(variant.value),
        ),
      );

      if (!typography) {
        throw new Error(`Typography component spec not found for variant textStyle=${id}`);
      }

      return id;
    }),
    description: item.description,
  }));

  return (
    <table>
      <colgroup>
        <col />
        <col />
        <col style={{ width: "15%" }} />
      </colgroup>
      <thead>
        <tr>
          <th>V2</th>
          <th>V3</th>
          <th>비고</th>
        </tr>
      </thead>
      <tbody>
        {tableItems.map((item) => (
          <tr key={item.previous}>
            <td>{item.previous}</td>
            <td className="align-middle space-y-2">
              {item.next.length > 0 ? (
                // next가 있는 경우
                item.next.map((newTextStyleId, index) => {
                  return (
                    <Fragment key={newTextStyleId}>
                      <Text textStyle={newTextStyleId as TextProps["textStyle"]}>
                        {newTextStyleId}
                      </Text>
                      {index !== item.next.length - 1 && (
                        <div className="text-xs text-center">또는</div>
                      )}
                    </Fragment>
                  );
                })
              ) : // next가 없고 alternative가 있는 경우
              item.alternative && item.alternative.length > 0 ? (
                item.alternative.map((altTextStyleId, index) => {
                  return (
                    <Fragment key={altTextStyleId}>
                      <Text textStyle={altTextStyleId as TextProps["textStyle"]}>
                        {altTextStyleId}{" "}
                        <span className="text-xs text-gray-500">(Alternative)</span>
                      </Text>
                      {index !== (item.alternative?.length ?? 0) - 1 && (
                        <div className="text-xs text-center">또는</div>
                      )}
                    </Fragment>
                  );
                })
              ) : (
                // next도 alternative도 없는 경우
                <Text className="text-gray-300 text-sm">매핑 없음</Text>
              )}
            </td>
            <td>{item.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
