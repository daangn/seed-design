import { redirect } from "next/navigation";

export const revalidate = false;

export function GET() {
  redirect("/lynx/llms.txt");
}
