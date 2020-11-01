[coc.nvim](https://github.com/neoclide/coc.nvim) wrapper for Apex's language server.

## What can it do

- Language intellisense using Salesforce Apex Language server
  - Go To Definition
  - Go To References
  - Auto-completion

- Registers IDE commands in Vim/NeoVim enviroment
    - SFDX Refresh SObject definitions - pulls definitions for SObject fields from the **default** scratch org
    - More coming soon

## Installation

Install by running this command in vim/NeoVim `CocInstall coc-apex`.

###  Configure Java Home
Add your `JAVA_HOME` to the top level of your `coc-settings.json`. Confirm the proper path and version for your `JAVA_HOME`.

```json
{
  "salesforcedx-vscode-apex.java.home": "/Library/Java/JavaVirtualMachines/jdk-11.0.7.jdk/Contents/Home"
}

```

## Contributing

Pull Requests are welcome. Contributing guidelines comng soon.
