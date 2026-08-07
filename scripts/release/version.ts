async function run(command: string[]): Promise<void> {
  console.log(`$ ${command.join(" ")}`);
  const child = Bun.spawn(command, { stdout: "inherit", stderr: "inherit" });
  const exitCode = await child.exited;
  if (exitCode !== 0) throw new Error(`${command.join(" ")} 명령이 ${exitCode}로 실패했습니다.`);
}

export {};

await run(["bun", "version"]);
await run(["bun", "rootage:build"]);
await run(["bun", "install"]);
await run(["bun", "rootage:generate"]);
