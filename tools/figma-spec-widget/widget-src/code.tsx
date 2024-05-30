import {
  stringifyConditions,
  stringifyVariableValue,
  stringifyVariants,
} from "./stringify";
import { Figma, createRecipe, RecipeAggregate } from "@tachyon/core";
import { arrayToRecord } from "@tachyon/utils";
import { cloneVariable, cloneVariableCollection } from "./clone";

const { widget } = figma;
const {
  AutoLayout,
  Fragment,
  Text,
  usePropertyMenu,
  useSyncedState,
  useEffect,
} = widget;

function Widget() {
  const [collectionId, setCollectionId] = useSyncedState<string>(
    "collectionId",
    "",
  );
  const [variables, setVariables] = useSyncedState<Figma.Variable[]>(
    "variables",
    [],
  );
  const [collections, setCollections] = useSyncedState<
    Figma.VariableCollection[]
  >("collections", []);

  const variableRecord = arrayToRecord(variables, (x) => x.id);
  const collectionRecord = arrayToRecord(collections, (x) => x.id);
  const selectedCollection: Figma.VariableCollection | undefined =
    collectionRecord[collectionId];

  usePropertyMenu(
    [
      {
        itemType: "dropdown",
        propertyName: "collection",
        tooltip: "Collection",
        selectedOption: collectionId,
        options: [
          { option: "", label: "None" },
          ...collections.map((c) => ({ option: c.id, label: c.name })),
        ],
      },
      {
        itemType: "action",
        propertyName: "update",
        tooltip: "Update",
      },
    ],
    ({ propertyName, propertyValue }) => {
      if (propertyName === "collection") {
        setCollectionId(propertyValue!);
      }
      if (propertyName === "update") {
        updateVariables();
      }
    },
  );

  function updateVariables() {
    console.log("updateVariables");
    setCollections(
      figma.variables
        .getLocalVariableCollections()
        .map(cloneVariableCollection),
    );
    setVariables(figma.variables.getLocalVariables().map(cloneVariable));
  }

  useEffect(() => {
    if (collections.length === 0) {
      updateVariables();
    }
  });

  const variablesToRender = collectionId
    ? collectionRecord[collectionId].variableIds.map((id) => variableRecord[id])
    : [];

  let recipe: RecipeAggregate = {};
  try {
    recipe = createRecipe(variablesToRender, "");
  } catch (e) {
    recipe = {};
  }

  if (!selectedCollection) {
    return (
      <AutoLayout
        fill="#FFFFFF"
        cornerRadius={4}
        direction="vertical"
        height="hug-contents"
        spacing={12}
        padding={12}
        width={720}
      >
        <AutoLayout width="fill-parent">
          <Text>Select a collection</Text>
        </AutoLayout>
      </AutoLayout>
    );
  }

  return (
    <AutoLayout
      fill="#FFFFFF"
      cornerRadius={4}
      direction="vertical"
      height="hug-contents"
      spacing={12}
      padding={12}
      width={720}
    >
      <AutoLayout width="fill-parent">
        <Text>{selectedCollection.name}</Text>
      </AutoLayout>
      {Object.values(recipe).map(({ variants, values }, i) => (
        <AutoLayout
          spacing={12}
          direction="vertical"
          width={"fill-parent"}
          key={i}
        >
          <Text fontSize={14} fontWeight={"semi-bold"}>
            {stringifyVariants(variants)}
          </Text>
          <AutoLayout direction="vertical" width={"fill-parent"}>
            <AutoLayout
              fill="#dcdcdc"
              padding={12}
              width={"fill-parent"}
              spacing="auto"
            >
              <AutoLayout width={"fill-parent"}>
                <Text fontSize={12}>State</Text>
              </AutoLayout>
              <AutoLayout width={"fill-parent"}>
                <Text fontSize={12}>Slot</Text>
              </AutoLayout>
              <AutoLayout width={"fill-parent"}>
                <Text fontSize={12}>Property</Text>
              </AutoLayout>
              <AutoLayout width={"fill-parent"}>
                <Text fontSize={12}>Value</Text>
              </AutoLayout>
            </AutoLayout>
            {Object.values(values).map(({ conditions, slots }, i) => {
              return (
                <Fragment key={i}>
                  {Object.values(slots).map(({ slot, variables }, j) =>
                    Object.entries(variables).map(([key, variable], k) => (
                      <AutoLayout
                        key={slot}
                        padding={12}
                        width={"fill-parent"}
                        spacing="auto"
                      >
                        <AutoLayout width={"fill-parent"}>
                          <Text fontSize={12}>
                            {j === 0 && k === 0
                              ? stringifyConditions(conditions)
                              : ""}
                          </Text>
                        </AutoLayout>
                        <AutoLayout width={"fill-parent"}>
                          <Text fontSize={12}>{k === 0 ? slot : ""}</Text>
                        </AutoLayout>
                        <AutoLayout width={"fill-parent"}>
                          <Text fontSize={12}>{key}</Text>
                        </AutoLayout>
                        <AutoLayout width={"fill-parent"}>
                          <Text fontSize={12}>
                            {stringifyVariableValue(
                              Object.values(variable.valuesByMode)[0],
                              variableRecord,
                            )}
                          </Text>
                        </AutoLayout>
                      </AutoLayout>
                    )),
                  )}
                </Fragment>
              );
            })}
          </AutoLayout>
        </AutoLayout>
      ))}
    </AutoLayout>
  );
}
widget.register(Widget);
