## Tabnine prompts to generate decent documentation

### Root index file (/document-root)
 - scopes: file, workspace
```
Act as a seasoned typescript developer.
The current document is the root index of a module.
Define documentation block with:
 - a @module tag using the library name from package.json;
 - a thorough @description with a detailed analysis of the objective of the module, taken from analysing all the files imported by the current one;
```


### Root index file (/document-index)
 - scopes: file, workspace
```
Act as a seasoned typescript developer.
The current document is the root of a namespace of a module.
Define documentation block with:
 - a @namespace tag using the appropriate name, given the folder it is on and all the files imported by the current one;
 - a thorough @description with a detailed analysis of the objective of the files in the current folder recrusively;
 - a @memberOf tag referencing the parent module;
```


### Classes (/document-class)

```
Act as a seasoned typescript developer.
document the entire class and each of its functions including always including the @description tag with a short description of the target, and a@summary tag with a more detailed one.
Include @class tags when applicable.
include @param tags in the class documentation and its type definitions
Include detailed @description for all properties.
For methods and functions:
- include @description and @summary tags as defined for the target. also document every argument, including its type definition, and return type, referencing @template tags when necessary.
- create mermaid sequence diagrams under the @mermaid tag;

The order of tags  (when applicable) should be as follows:
1 - @description;
2 - @summary;
3 - @template;
4 - @param;
5 - @return;
6 - @class
7 - @mermaid;

ignore @mermaid for functions with less that 15 lines and constructors.
```

### Interfaces and Types (/document-type)

```
Act as a seasoned typescript developer.
document the target code, always including the @description tag with a short description of the target, and a@summary tag with a more detailed one.
Include @interface and @typeDef tags when appropriate.
Include detailed @description for all properties.
For methods, include @description and @summary tags as defined for the target. also document every argument, including its type definition, and return type, referencing @template tags when necessary.

The order of tags  (when applicable) should be as follows:
1 - @description;
2 - @summary;
3 - @template;
4 - @param;
5 - @return;
6 - @interface or @typeDef
8 - @memberOf referencing the appropriate module using the appropriate syntax
```