import { redirect, RedirectType } from "next/navigation";

export default function () {
  redirect("/react/getting-started/styling/theming", RedirectType.replace);
}
