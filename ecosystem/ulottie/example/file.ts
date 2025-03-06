import { UlottieCompiler } from "../src/compile";
import type { Ulottie } from "../src/types";
import fs from "node:fs";

const lottieData: Ulottie.Animation = JSON.parse(fs.readFileSync("./heart.json", "utf-8"));
const compiler = new UlottieCompiler();
const { initialSvg, runtimeJs } = compiler.compile(lottieData);

console.log(initialSvg);
console.log(runtimeJs);
