import { Project } from "ts-morph";
import importToArray from "import-to-array";

import * as components from "./materialComponents";
import { topologyProviderTemplate } from "./topologyProviderTemplate";

const project = new Project();
const topologyBase = "https://rdf.dev/t/material-ui/";
const generatedComponents = [];

function getComponentName(comp: any): string | undefined {
  const name = comp.name
    || comp?.displayName?.match(/\(([a-zA-Z]+)\)/)?.[1]
    || comp?.render?.name;
  if (!name || name.startsWith('use') || name.startsWith('with')) {
    return undefined;
  }

  if (name === 'MuiBox') {
    return 'Box';
  }

  return name;
}

for (const component of importToArray<string, any>(components)) {
  const name = getComponentName(component);
  if (!name) {
    continue;
  }

  const topology = name.charAt(0).toLowerCase() + name.slice(1);
  project.createSourceFile(
    `src/${name}.tsx`,
    topologyProviderTemplate(name, topology, topologyBase)
  );
  generatedComponents.push(name);
}

project.createSourceFile(
  "src/index.ts",
  generatedComponents.map((name) => `export { ${name} } from "./${name}";`).join('\n')
);

project.saveSync();
