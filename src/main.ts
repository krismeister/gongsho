import { getProjectFileASTs } from "@/utils/ast";

const main = () => {
  const asts = getProjectFileASTs();
  console.log(asts);
};

main();
