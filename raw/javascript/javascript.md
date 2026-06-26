# JavaScript Fundamentals — Reference Guide

A condensed reference covering the core aspects of JavaScript needed for general-purpose programming (including embedded contexts like Node-RED Function nodes).

---

## 1. Variables and Declarations

```javascript
let x = 10;        // mutable, block-scoped
const y = "hello";  // immutable binding (object contents can still change)
var z = 5;          // legacy, function-scoped — avoid
```

- Use `const` by default.
- Use `let` only when reassignment is required.
- Avoid `var`: it is function-scoped (not block-scoped) and subject to hoisting quirks.

---

## 2. Data Types

JavaScript is dynamically typed. Primitive types:

| Type | Example | `typeof` result |
|---|---|---|
| String | `"text"` | `"string"` |
| Number | `42`, `3.14` | `"number"` |
| Boolean | `true` / `false` | `"boolean"` |
| Undefined | declared, no value | `"undefined"` |
| Null | intentional absence of value | `"object"` (historical quirk) |
| BigInt | `10n` | `"bigint"` |
| Symbol | `Symbol("id")` | `"symbol"` |

Reference types: `Object`, `Array`, `Function`, `Date`, `Map`, `Set`, etc.

**Map**

It's a collection of key-value pairs where keys can be of any type (not just strings).

```javascript
const map = new Map();
map.set("key", "value");
map.get("key"); // "value"
```

**Set**

A collection of unique values.

```javascript
const set = new Set();
set.add(1);
set.has(1); // true
```

### Equality

```javascript
1 == "1"   // true  — loose equality, performs type coercion
1 === "1"  // false — strict equality, no coercion
```

**Rule:** always use `===` / `!==` unless there is a specific reason to coerce types.

---

## 3. Functions

```javascript
// Function declaration
function add(a, b) {
  return a + b;
}

// Function expression / arrow function
const add = (a, b) => a + b;

// Multi-line arrow function
const greet = (name) => {
  const message = `Hello, ${name}`;
  return message;
};
```

**Key difference:** arrow functions do not bind their own `this`; they inherit it from the enclosing scope. This matters in callbacks, class methods, and event handlers.

### Default and rest parameters

```javascript
function multiply(a, b = 2) { return a * b; }
function sum(...numbers) { return numbers.reduce((a, b) => a + b, 0); }
```

### IIFE (Immediately Invoked Function Expression)

```javascript
(function() {
  // code here runs immediately and has its own scope
})();
```

Parentheses around the function transform it into an expression, allowing immediate invocation with ().

A **async IIFE** can be used to run asynchronous code immediately:

```javascript
(async () => {                        // creates an async function and invokes it using ()
  const data = await fetchData();     // you can use await here without needing to be inside another defined async function
  console.log(data);
})();
```

This is useful in CommonJS modules or Node-RED Function nodes where the top-level context does not allow `await` directly.

An equivalent defined async function would be:

```javascript
async function main() {
  const data = await fetchData();
  console.log(data);
}
main(); // invoke the async function
```

**What returns a IIFFE?**

With *async*, the IIFE returns a Promise that resolves to the return value of the function. Without *async*, it returns whatever the function returns (or `undefined` if nothing is returned).

**How to manage errors in an async IIFE?**

You have two options:
1. Use a `catch` on the returned Promise:

    ```javascript
    (async () => {
      const data = await fetchData();
      console.log(data);
    })().catch(err => console.error(err));
    ```

2. Assign the Promise to `p` and handle errors later:

    ```javascript
    const p = (async () => {
      const data = await fetchData();
      console.log(data);
    })();

    p.catch(err => console.error(err));
    ```

    > This is useful when you want to use `p` later in the code, for example to `await` it or to check its state.

3. Use a `try/catch` block inside the async IIFE:

    ```javascript
    (async () => {
      try {
        const data = await fetchData();
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    })();
    ```

The **difference between the `try/catch` inside the IIFE and the `catch` on the returned Promise** is that the former allows you to handle errors immediately within the async function, while the latter allows you to handle errors after the Promise has been returned, so **you can manage errors not internally managed by the async function itself.**

---

## 4. Arrays and Objects

### Arrays

```javascript
const arr = [1, 2, 3];
arr.push(4);                        // [1, 2, 3, 4]
arr.map(x => x * 2);                // [2, 4, 6]
arr.filter(x => x > 1);             // [2, 3]
arr.reduce((acc, x) => acc + x, 0); // 6
arr.find(x => x === 2);             // 2
arr.includes(3);                    // true
```

### Objects

```javascript
const obj = { name: "Mario", age: 30 };
obj.name;          // dot notation
obj["name"];        // bracket notation

// Destructuring
const { name, age } = obj;

// Spread operator
const obj2 = { ...obj, city: "Milan" };
const arr2 = [...arr, 5]; // ... means "spread" the elements of the array into a new array
```

The *destructuring* and *spread operator* are powerful features for working with arrays and objects, allowing for concise syntax when extracting values or creating new structures.

The syntax for **destructuring** can also be used in function parameters:
  > ```javascript
  >function greet({ name, age }) {
  > return `Hello, ${name}. You are ${age} years old.`;
  >}
  >greet({ name: "Mario", age: 30 }); // "Hello, Mario. You are 30 years old."
  >``` 
> It's useful for functions that take objects as arguments, allowing you to extract only the properties you need.

The syntax for **spread operator** can also be used in function calls:
  > ```javascript
  > const numbers = [1, 2, 3];
  > const sum = (a, b, c) => a + b + c;
  > sum(...numbers); // 6
  > ``` 
> It's useful for passing an array of values as individual arguments to a function.

---

## 5. Control Flow

```javascript
if (condition) { ... } else if (other) { ... } else { ... }

for (let i = 0; i < 10; i++) { ... }
for (const item of arr) { ... }      // iterate values
for (const key in obj) { ... }       // iterate keys (use with caution)

switch (value) {
  case 1: ...; break;
  default: ...;
}
```

---

## 6. Truthy / Falsy and Null Handling

**Falsy values:** `false`, `0`, `""`, `null`, `undefined`, `NaN`. Everything else is truthy.

```javascript
if (msg.payload) { ... } // careful: 0 and "" are falsy and will fail this check

// Optional chaining — avoids errors on null/undefined access
const value = obj?.nested?.property;

// Nullish coalescing — fallback only for null/undefined (not for 0 or "")
const result = value ?? "default";
```

---

## 7. Asynchronous JavaScript

JavaScript is single-threaded; asynchronous operations are handled via the event loop, Promises, and `async/await`.

### Promises

```javascript
fetch("https://api.example.com")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### async/await (preferred for readability)

```javascript
async function getData() {
  try {
    const res = await fetch("https://api.example.com");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}
```

### Common patterns

```javascript
await Promise.all([promise1, promise2]);     // run in parallel, wait for all
await Promise.race([promise1, promise2]);     // resolve on first to finish
await Promise.allSettled([promise1, promise2]); // wait for all, regardless of outcome
```

---

## 8. Classes

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound.`;
  }
}

class Dog extends Animal {
  speak() {
    return `${this.name} barks.`;
  }
}
```

---

## 9. Modules

```javascript
// export
export const value = 42;
export default function main() { ... }

// import
import main, { value } from "./module.js";
```

Node.js also supports CommonJS:

```javascript
// CommonJS
const fs = require("fs");
module.exports = { value };
```

---

## 10. Error Handling

```javascript
try {
  riskyOperation();
} catch (error) {
  console.error(error.message);
} finally {
  cleanup();
}

// Custom errors
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}
```

---

## 11. Node-RED Function Node Essentials

Specific globals available inside a Function node:

```javascript
msg.payload = msg.payload * 2;   // modify the message
node.warn("debug info");          // log to debug panel
node.error("error", msg);         // log error, attach message
context.set("key", value);        // node-local storage
flow.set("key", value);           // flow-shared storage
global.set("key", value);         // global storage

return msg;   // pass the message to the next node
// or
return null;  // stop propagation
```

For asynchronous logic, use `node.send(msg)` followed by `return;` instead of `return msg;`, or return a `Promise` resolving to the message (depending on the Function node configuration/version).

---

## 12. Style and Best Practices Checklist

- Prefer `const`/`let`, never `var`.
- Always use strict equality (`===`).
- Prefer `async/await` over chained `.then()` for readability.
- Use template literals (`` `${var}` ``) instead of string concatenation.
- Use destructuring and spread operators where they improve clarity.
- Handle `null`/`undefined` explicitly with optional chaining and nullish coalescing.
- Wrap async operations in `try/catch`.
- Keep functions small and pure where possible.