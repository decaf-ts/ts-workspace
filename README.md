![Banner](./workdocs/assets/Banner.png)

## Typescript Template

This repository is meant the provide a base for any standard Typescript project

No one needs the hassle of setting up new repos every time.

This way just create one from this template and enjoy having everything set up fo you.

![Licence](https://img.shields.io/github/license/decaf-ts/ts-workspace.svg?style=plastic)
![GitHub language count](https://img.shields.io/github/languages/count/decaf-ts/ts-workspace?style=plastic)
![GitHub top language](https://img.shields.io/github/languages/top/decaf-ts/ts-workspace?style=plastic)
[![Tests](https://github.com/decaf-ts/ts-workspace/actions/workflows/jest-test.yaml/badge.svg)](http://www.pdmfc.com)
[![CodeQL](https://github.com/starnowski/posmulten/workflows/CodeQL/badge.svg)](https://github.com/decaf-ts/ts-workspace/actions?query=workflow%3ACodeQL)

![Open Issues](https://img.shields.io/github/issues/decaf-ts/ts-workspace.svg)
![Closed Issues](https://img.shields.io/github/issues-closed/decaf-ts/ts-workspace.svg)
![Pull Requests](https://img.shields.io/github/issues-pr-closed/decaf-ts/ts-workspace.svg)
![Maintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg)

![Line Coverage](workdocs/coverage/badge-lines.svg)
![Function Coverage](workdocs/coverage/badge-functions.svg)
![Statement Coverage](workdocs/coverage/badge-statements.svg)
![Branch Coverage](workdocs/coverage/badge-branches.svg)


![Forks](https://img.shields.io/github/forks/decaf-ts/ts-workspace.svg)
![Stars](https://img.shields.io/github/stars/decaf-ts/ts-workspace.svg)
![Watchers](https://img.shields.io/github/watchers/decaf-ts/ts-workspace.svg)

![Node Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbadges%2Fshields%2Fmaster%2Fpackage.json&label=Node&query=$.engines.node&colorB=blue)
![NPM Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbadges%2Fshields%2Fmaster%2Fpackage.json&label=NPM&query=$.engines.npm&colorB=purple)

### Description

THis is a template project for Typescript repos.

By developers, [for developers](./tutorials/For%20Developers.md).




## Considerations
 - Setup for a linux based environment (Sorry windows users. use WSL... or just change already);
 - Setup for node 20, but will work at least with 16;
 - Requires docker to build documentation (drawings and PlantUML)
## Documentation Guide

# 📘 The Ultimate TypeScript JSDoc Documentation Guide with Better-Docs

_Standardize your team’s code documentation with strict typing, clean JSDoc tags, visual diagrams, and automatic doc site generation using the powerful [`better-docs`](https://github.com/SoftwareBrothers/better-docs) template._

---

## 🌟 Guiding Principles

Every documented entity **must** include:

- `@description` – Short, one-liner description.
- `@summary` – Longer, detailed explanation.
- Declaration tags: `@class`, `@interface`, `@function`, `@const`, `@typedef`.
- `@template` – For generic types/functions.
- `@param` and `@return` – For functions, class/interface methods, and callable types.
- `@extends` – If extending classes/interfaces.
- `@abstract`, `@protected`, `@private` – Where applicable.
- `@link` – Cross-reference to other entities.
- `@mermaid` – For methods/functions longer than 10 LOC.
- `@menu`, `@category`, `@component` – Optional, but powerful enhancements.

---

## 🔢 TypeScript Object JSDoc Tag Matrix

| TypeScript Object      | Required Tags                                                                                                            |
|------------------------|--------------------------------------------------------------------------------------------------------------------------|
| **Class**              | `@class`, `@description`, `@summary`, `@template` (if generic), `@extends`, `@menu`, `@category`                         |
|                        | For methods: `@param`, `@return`, `@mermaid` (if >10 lines), `@link`, `@private`, `@protected`, `@abstract`              |
| **Interface**          | `@interface`, `@description`, `@summary`, `@template` (if generic), `@menu`, `@category`                                 |
|                        | For methods: `@param`, `@return`, `@link`                                                                                |
| **Function**           | `@function`, `@description`, `@summary`, `@template` (if generic), `@param`, `@return`, `@mermaid`, `@menu`, `@category` |
| **Type (typedef)**     | `@typedef`, `@description`, `@summary`, `@template` (if generic), `@param`, `@return`, `@typeDef`, `@menu`, `@category`  |
| **Module**             | `@module`, `@description`, `@summary`, `@menu`                                                                           |
| **Namespace**          | `@namespace`, `@description`, `@summary`, `@menu`, `@category`                                                           |
| **Constant**           | `@const`, `@name`, `@description`, `@summary`, `@type`, `@menu`, `@category`                                             |
| **Enum**               | `@const`, `@name`, `@description`, `@summary`, `@type` (optional), `@menu`, `@category`                                  |
| **Component (UI)**     | `@component`, `@description`, `@summary`, `@example`, `@menu`, `@category`                                                |

use `@example` and `@see` when required
---

## 🔍 Notes on Key Tags

- **`@class` / `@interface` / `@function` / `@typedef` / `@const`**: Always include to ensure type is properly rendered by better-docs.
- **`@description`**: One-liner description for quick scan/read.
- **`@summary`**: Paragraph-level detail; used for in-depth context.
- **`@param` / `@return`**: Must be present on all callable functions and methods.
- **`@template`**: Required when generics like `<T>` or `<K, V>` are used.
- **`@mermaid`**: Include when the method or function has more than 10 lines of logic.
- **`@extends`**: If the class inherits from another one.
- **`@link`**: When referring to other documented entities (e.g., `{@link User}`).
- **`@menu` / `@category`**: Used by better-docs to organize the sidebar.
- **`@component`**: Special tag to tell better-docs this is a UI component (React, Vue, Angular).
- **`@private`, `@protected`, `@abstract`**: Visibility and inheritance markers for internal or extended logic.

---

## 🧱 1. Classes

```ts
/**
 * @class UserService
 * @description Handles all user-related data fetching and processing.
 * @summary Acts as a business logic layer between the API and UI for user entities.
 * @template T - A generic type extending {@link User}.
 * @extends {BaseService}
 * @menu Services > User
 * @category Services
 */
export class UserService<T extends User> extends BaseService {
  /**
   * @description Retrieves a user by ID.
   * @summary Fetches user data from the API and maps it to the internal model.
   * @param {number} id - Unique identifier of the user.
   * @return {Promise<T>} Resolves with the user object.
   * @link User
   * @mermaid
   * sequenceDiagram
   *     actor UI
   *     UI->>UserService: getUser(id)
   *     UserService->>API: GET /users/:id
   *     API-->>UserService: { id, name, ... }
   *     UserService-->>UI: Promise<User>
   */
  async getUser(id: number): Promise<T> {
    const res = await fetch(`/users/${id}`);
    const json = await res.json();
    return json as T;
  }

  /**
   * @description Removes a user from the in-memory cache.
   * @summary Only affects local cache, does not delete from API.
   * @param {number} id - ID of the user to remove.
   * @return {void}
   * @protected
   */
  protected removeUserFromCache(id: number): void {
    this.cache.delete(id);
  }

  /**
   * In-memory user cache.
   */
  private cache: Map<number, T> = new Map();
}
```

---

## 🧹 2. Interfaces

```ts
/**
 * @interface User
 * @description Describes the shape of a user object.
 * @summary Used across services, components, and API typing layers.
 * @menu Models
 */
export interface User {
  /** Unique user identifier. */
  id: number;

  /** Full name of the user. */
  name: string;

  /**
   * @description Returns a user-friendly display name.
   * @summary Typically used in user listings and dropdowns.
   * @return {string}
   */
  getDisplayName(): string;
}
```

---

## ⚙️ 3. Functions

```ts
/**
 * @function calculateDiscount
 * @description Calculates the final price after applying a discount.
 * @summary Supports both percentage and fixed-amount discounts.
 * @param {number} price - Original price.
 * @param {number} discount - Discount amount.
 * @param {boolean} isPercentage - Whether the discount is a percentage.
 * @return {number} Final price after discount.
 * @menu Utilities > Pricing
 * @category Utilities
 * @mermaid
 * sequenceDiagram
 *     participant UI
 *     UI->>calculateDiscount: price, discount, isPercentage
 *     calculateDiscount-->>UI: discounted price
 */
export function calculateDiscount(
  price: number,
  discount: number,
  isPercentage: boolean
): number {
  return isPercentage ? price * (1 - discount / 100) : price - discount;
}
```

---

## 🧬 4. Types (Typedefs)

```ts
/**
 * @typedef ApiResponse
 * @description A standard API response wrapper.
 * @summary Used across HTTP services to ensure consistent response shapes.
 * @template T - Payload data type.
 * @typeDef
 * @param {T} data - The actual payload.
 * @param {string} [error] - Optional error message.
 * @return {ApiResponse<T>}
 * @menu Models > Network
 * @category Networking
 */
export type ApiResponse<T> = {
  data: T;
  error?: string;
};
```

---

## 📆 5. Modules

```ts
/**
 * @module user
 * @description User domain module.
 * @summary Includes models, services, and utils related to user management.
 * @menu Modules
 */
```

---

## 🔭 6. Namespaces

```ts
/**
 * @namespace MathUtils
 * @description A collection of reusable mathematical utilities.
 * @summary Includes clamping, rounding, and interpolation helpers.
 * @menu Utilities > Math
 */
export namespace MathUtils {
  /**
   * @description Clamps a number between two bounds.
   * @summary Ensures a value does not exceed min or max.
   * @param {number} value - The number to clamp.
   * @param {number} min - Minimum allowed value.
   * @param {number} max - Maximum allowed value.
   * @return {number} Clamped value.
   */
  export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
```

---

## 📌 7. Constants

```ts
/**
 * @const API_TIMEOUT
 * @name API_TIMEOUT
 * @description Global timeout setting for all HTTP requests.
 * @summary Used to cancel requests that exceed allowed duration.
 * @type {number}
 * @menu Constants
 * @category Config
 */
export const API_TIMEOUT = 10000;
```

---

## 📊 8. Enums

```ts
/**
 * @const LogLevel
 * @name LogLevel
 * @description Enum representing severity levels for logs.
 * @summary Enables filtering and categorizing of runtime logs.
 * @type {enum}
 * @menu Constants > Logging
 */
export enum LogLevel {
  /** Informational log */
  INFO = 'info',

  /** Recoverable warning */
  WARN = 'warn',

  /** Critical failure */
  ERROR = 'error'
}
```

---

## 🧹 Advanced Better-docs Tags

### 📌 @menu

Organizes the item in the navigation sidebar.

```ts
@menu Services > User
```

### 🗂 @category

Used to group entries visually within the same page or sidebar section.

```ts
@category Utilities
```

### 🔧 @component

Used with frameworks like **React**, **Vue**, or **Angular** for UI docs.

---

## 🧰 Suggested `jsdoc.json` Configuration

```json
{
  "plugins": [
    "plugins/markdown",
    "better-docs/component",
    "better-docs/category"
  ],
  "source": {
    "include": ["src"],
    "includePattern": ".+\\.ts(x)?$"
  },
  "opts": {
    "destination": "./docs",
    "template": "node_modules/better-docs"
  },
  "tags": {
    "allowUnknownTags": ["category", "component", "menu"]
  }
}
```

---

## ✅ Final Documentation Checklist

- [x] `@description` and `@summary` on all documentable elements
- [x] `@param` and `@return` for all functions/methods/callables
- [x] `@template` where generics exist
- [x] `@extends`, `@abstract`, `@private`, `@protected` where needed
- [x] `@link` for all internal references
- [x] `@mermaid` for any logic-heavy methods/functions (>10 lines)
- [x] Use `@menu`, `@category`, `@component` for better organization and UI rendering

---

Need help setting up the initial doc site or generating docs from your CI pipeline? Reach out to your tech lead or tooling team — or set up `jsdoc` + `better-docs` with a custom GitHub Action to automate it.

also check out the [Documentation prompts](../prompts/documentation.md) section. It might just be what you need.



### Related

[![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=decaf-ts&repo=ts-workspace)](https://github.com/decaf-ts/ts-workspace)
### Social

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/decaf-ts/)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![ShellScript](https://img.shields.io/badge/Shell_Script-121011?style=for-the-badge&logo=gnu-bash&logoColor=white)

## Getting help

If you have bug reports, questions or suggestions please [create a new issue](https://github.com/decaf-ts/ts-workspace/issues/new/choose).

## Contributing

I am grateful for any contributions made to this project. Please read [this](./workdocs/98-Contributing.md) to get started.

## Supporting

The first and easiest way you can support it is by [Contributing](./workdocs/98-Contributing.md). Even just finding a typo in the documentation is important.

Financial support is always welcome and helps keep the both me and the project alive and healthy.

So if you can, if this project in any way. either by learning something or simply by helping you save precious time, please consider donating.

## License

This project is released under the [MIT License](LICENSE.md).

#### Disclaimer:

badges found [here](https://dev.to/envoy_/150-badges-for-github-pnk), [here](https://github.com/alexandresanlim/Badges4-README.md-Profile#-social-) and [here](https://github.com/Ileriayo/markdown-badges)
