import { defineSlotRecipe } from "../utils/define";

// 크기·색·타이포그래피는 Rootage time-picker 값과 같은 WheelPicker medium Recipe가 맡는다.
const timePicker = defineSlotRecipe({
  name: "time-picker",
  slots: ["itemLabel"],
  base: {
    itemLabel: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  variants: {
    columnType: {
      period: {},
      hour: {
        itemLabel: { justifyContent: "flex-end" },
      },
      minute: {},
    },
  },
  defaultVariants: {
    columnType: "period",
  },
});

export default timePicker;
