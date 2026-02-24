import { redirect } from "next/navigation";

export const revalidate = false;

export function GET() {
  redirect("/breeze/llms.txt");
}
