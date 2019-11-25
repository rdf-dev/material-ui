const buttonTypeFixComponents = ["ListItem", "MenuItem"];

export function topologyProviderTemplate(comp: string, topology: string, topologyBase: string) {
  let fix = '';
  if (buttonTypeFixComponents.includes(comp)) {
    fix = ` as ${comp}Props & { button?: any }`
  }

  return `import { ${comp} as ${comp}Comp } from "@material-ui/core";
import { ${comp}Props } from "@material-ui/core/${comp}";
import rdf from "@ontologies/core";
import { TopologyProvider } from "link-redux";
import * as React from "react";

export const ${topology}Topology = rdf.namedNode("${topologyBase}${topology}");

export class ${comp} extends TopologyProvider<${comp}Props> {
  constructor(props) {
    super(props);

    this.topology = ${topology}Topology;
  }

  public render() {
    return this.wrap((
      <${comp}Comp {...this.props${fix}}>
        {this.props.children}
      </${comp}Comp>
    ));
  }
}
`
}
