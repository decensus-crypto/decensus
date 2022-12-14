# Subgraph

This package contains the subgraphs to index the data of the FormCollectionFactory and the FormCollection contracts.

The subgraphs are used in the frontend to:

1. fetch form list in the form management page
2. fetch survey answers for CSV download

## Local development

`yarn auth` to login to the Graph.

`yarn deploy:<network>` to deploy.

The `subgraph.yaml` file is generated from Mustache template using the configs in the `configs` directory.

If you want to just generate the `subgraph.yaml` file, run `yarn template:<network>`.
