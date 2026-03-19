export const revalidate = false;

export async function GET() {
  return Response.redirect("https://seed-design.io/llms.txt", 301);
}
