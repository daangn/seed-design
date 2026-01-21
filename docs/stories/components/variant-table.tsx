type VariantMap = Record<string, string[] | boolean[]>;
type ConditionMap = Record<string, Record<string, Record<string, unknown>>>;

interface Props {
  variantMap: VariantMap;
  conditionMap?: ConditionMap;
  Component: React.ComponentType | React.ElementType;
  children?: React.ReactNode;
}

const Boolish = {
  asString: (value: string | boolean) =>
    value === true ? "true" : value === false ? "false" : value,
  asUnion: (value: string | boolean) =>
    value === "true" ? true : value === "false" ? false : value,
};

const generateCombinations = (variantMap: VariantMap, conditionMap: ConditionMap) => {
  const keys = [...new Set([...Object.keys(variantMap), ...Object.keys(conditionMap)])];
  let combinations: Record<string, string | boolean>[] = [{}];

  for (const key of keys) {
    const values = [
      ...new Set(
        [...(conditionMap[key] ? Object.keys(conditionMap[key]) : (variantMap[key] ?? []))].map(
          Boolish.asUnion,
        ),
      ),
    ];
    const temp: Record<string, string | boolean>[] = [];

    for (const combo of combinations) {
      for (const value of values) {
        temp.push({
          ...combo,
          [key]: value,
        });
      }
    }

    combinations = temp;
  }

  return combinations;
};

export const VariantTable = (props: Props) => {
  const { variantMap, conditionMap = {}, Component, ...rest } = props;

  const combinations = generateCombinations(variantMap, conditionMap);
  const keys = [...new Set([...Object.keys(variantMap), ...Object.keys(conditionMap)])];

  return (
    <div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead data-chromatic="ignore">
          <tr style={{ fontSize: "14px" }}>
            {keys.map((key) => (
              <th key={key}>{key}</th>
            ))}
            <th>Component</th>
          </tr>
        </thead>
        <tbody>
          {combinations.map((combination) => {
            const conditionedProps = Object.entries(combination).reduce(
              (acc, [key, value]) => {
                acc[key] = Boolish.asUnion(value);

                const condition = conditionMap[key];
                if (!condition) {
                  return acc;
                }

                const conditionValue = condition[Boolish.asString(value)];
                if (!conditionValue) {
                  return acc;
                }

                for (const [key, value] of Object.entries(conditionValue)) {
                  acc[key] = value;
                }

                return acc;
              },
              {} as Record<string, unknown>,
            );
            const props = { ...rest, ...conditionedProps };

            const combinationKey = Object.values(combination).join("-");
            return (
              <tr key={combinationKey}>
                {keys.map((key) => (
                  <td data-chromatic="ignore" key={key} style={{ width: "10%" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          paddingRight: "2px",
                          color: "var(--seed-color-fg-placeholder)",
                        }}
                      >
                        {key}:
                      </span>
                      <code style={{ fontSize: "13px", fontFamily: "Courier" }}>
                        {Boolish.asString(combination[key])}
                      </code>
                    </div>
                  </td>
                ))}
                <td
                  style={{
                    display: "flex",
                    padding: 16,
                  }}
                >
                  <Component {...props} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div
        data-chromatic="ignore"
        style={{
          marginTop: "16px",
          fontSize: "16px",
        }}
      >
        총 {combinations.length}개의 조합이 있습니다.
      </div>
    </div>
  );
};
