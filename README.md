[coc.nvim](https://github.com/neoclide/coc.nvim) wrapper for Apex's language server.

## What can it do

- Language intellisense using Salesforce Apex Language server
  - Go To Definition
  - Go To References
  - Auto-completion
  - Rename everywhere

- Registers IDE commands in Vim/NeoVim enviroment: `:CocCommand`
    - `SFDX.Refresh.SObject` - pulls definitions for SObject fields from the **default** scratch org. You can Go To Definition for SObject fields after this is done. Be sure to set preferred default org
    - `SFDX.Run.Apex.Class.Tests` - run all tests in the current buffer
    - `SFDX.Run.Apex.Method.Test` - run the test in the current line (cursor on the method name line)
    - `SFDX.Run.Apex.Tests` - run all Apex tests
    - `SFDX.Open.Default.Scratch.Org` - open default scratch org
    - `SFDX.Push.Default.Scratch.Org` - push to default scratch org
    - `SFDX.Pull.Default.Scratch.Org` - pull from default scratch org
    - `SFDX.Generate.Password.Default.Scratch.Org` - generate password for default scratch org
    - `SFDX.Display.Password.Default.Scratch.Org` - display password for default scratch org
    - `SFDX.Create.Scratch.Org` - create a new scratch org
    - `SFDX.Create.Apex.Class` - create a new Apex class
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
