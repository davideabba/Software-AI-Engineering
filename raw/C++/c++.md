# C++ Fundamentals — Reference Guide

A condensed reference covering the core aspects of C++ needed for general-purpose programming, as a companion to the JavaScript and Python fundamentals guides. C++ is statically typed and compiled, with manual or RAII-based memory management — the mental model differs significantly from JS/Python.

---

## 1. Variables and Declarations

```cpp
int x = 10;             // statically typed, type fixed at declaration
const double y = 3.14;  // immutable
auto z = 42;             // type inferred at compile time (still static)
constexpr int N = 100;   // compile-time constant
```

- Every variable has a fixed type, known at compile time.
- `auto` infers the type from the initializer — still strongly typed, just less verbose.
- `const` = runtime-immutable; `constexpr` = must be known at compile time.

---

## 2. Data Types

| Type | Example | Size (typical) |
|---|---|---|
| `int` | `42` | 4 bytes |
| `double` | `3.14` | 8 bytes |
| `float` | `3.14f` | 4 bytes |
| `bool` | `true` / `false` | 1 byte |
| `char` | `'a'` | 1 byte |
| `std::string` | `"text"` | variable |
| `void` | (no value) | — |

C++ has no built-in `None`/`null` for values; pointers use `nullptr`. Optional values use `std::optional<T>` (C++17+).

### Equality

```cpp
1 == 1.0     // true — numeric promotion applies
"a" == "a"   // comparing C-string pointers, NOT contents — undefined-ish/unsafe
std::string("a") == std::string("a")  // true — proper content comparison
```

**Rule:** always compare `std::string` objects, not raw C-strings (`const char*`), unless you specifically intend pointer comparison.

---

## 3. Functions

```cpp
int add(int a, int b) {
    return a + b;
}

// Lambda (C++11+)
auto add = [](int a, int b) { return a + b; };

// Default parameters
double multiply(double a, double b = 2.0) {
    return a * b;
}

// Function overloading (same name, different signatures)
int square(int x) { return x * x; }
double square(double x) { return x * x; }
```

Functions must declare parameter and return types explicitly (unless using templates or `auto` return type deduction, C++14+).

---

## 4. Pointers, References, and Memory

This is the area with no real equivalent in JS/Python and the most important conceptual shift.

```cpp
int value = 10;

int* ptr = &value;   // pointer: holds the memory address of `value`
int& ref = value;     // reference: an alias for `value`, cannot be null/reassigned

*ptr = 20;             // dereference pointer to modify the value
ref = 30;              // modifies `value` directly
```

### Dynamic memory and RAII

```cpp
// Manual (legacy, avoid in modern code)
int* p = new int(5);
delete p;

// Modern: smart pointers (automatic cleanup, RAII)
#include <memory>

std::unique_ptr<int> up = std::make_unique<int>(5);  // sole ownership
std::shared_ptr<int> sp = std::make_shared<int>(5);   // shared ownership, ref-counted
```

**Rule:** prefer smart pointers and stack-allocated objects over raw `new`/`delete`. RAII (Resource Acquisition Is Initialization) ties resource lifetime to object scope — this is the C++ equivalent of garbage collection, but deterministic.

---

## 5. Containers (Standard Library)

Analogous to JS arrays/objects or Python lists/dicts, from `<vector>`, `<map>`, etc.

```cpp
#include <vector>
#include <map>
#include <algorithm>

std::vector<int> arr = {1, 2, 3};
arr.push_back(4);

std::vector<int> doubled;
std::transform(arr.begin(), arr.end(), std::back_inserter(doubled),
               [](int x) { return x * 2; });   // like .map()

std::map<std::string, int> obj = {{"age", 30}};
obj["name_length"] = 5;
obj.at("age");        // throws if missing
obj["age"];           // creates entry with default value if missing
```

| Container | Analogous to |
|---|---|
| `std::vector` | dynamic array (JS array / Python list) |
| `std::array` | fixed-size array |
| `std::map` / `std::unordered_map` | dict / object |
| `std::set` / `std::unordered_set` | set |
| `std::pair`, `std::tuple` | tuple |

---

## 6. Control Flow

```cpp
if (condition) { ... } else if (other) { ... } else { ... }

for (int i = 0; i < 10; i++) { ... }
for (const auto& item : arr) { ... }   // range-based for (like for...of)

while (condition) { ... }

switch (value) {
    case 1: ...; break;
    default: ...;
}
```

---

## 7. Null, Optional, and Boolean Conversion

C++ has no universal "falsy" concept like JS/Python — only `bool` contexts convert specific types implicitly (e.g. `0` → `false`, non-null pointer → `true`).

```cpp
int* ptr = nullptr;
if (ptr) { ... }          // false if nullptr

#include <optional>
std::optional<int> maybeValue;
if (maybeValue.has_value()) { ... }
int v = maybeValue.value_or(0);   // similar to ?? in JS
```

---

## 8. Asynchronous / Concurrent C++

C++ does not have an event-loop model like JS by default; concurrency is thread-based.

```cpp
#include <thread>
#include <future>

// std::async — closest equivalent to a Promise
std::future<int> result = std::async([]() {
    return 42;
});
int value = result.get();   // blocks until ready (like await, but blocking)

// Threads
std::thread t([]() { /* work */ });
t.join();
```

For true non-blocking async I/O (network calls, etc.), C++ relies on external libraries (e.g. Boost.Asio) or coroutines (C++20 `co_await`), which are closer in spirit to JS `async/await` but require more setup.

---

## 9. Classes

```cpp
class Animal {
public:
    Animal(const std::string& name) : name_(name) {}

    virtual std::string speak() const {
        return name_ + " makes a sound.";
    }

protected:
    std::string name_;
};

class Dog : public Animal {
public:
    Dog(const std::string& name) : Animal(name) {}

    std::string speak() const override {
        return name_ + " barks.";
    }
};
```

- `virtual` + `override` enable polymorphism (without `virtual`, no dynamic dispatch occurs).
- Access specifiers (`public`, `protected`, `private`) control visibility — there's no real equivalent in JS, and Python only has naming conventions (`_protected`, `__private`).
- Constructors use initializer lists (`: name_(name)`) for efficiency.

---

## 10. Modules / Compilation Units

C++ traditionally uses headers (`.h`/`.hpp`) and source files (`.cpp`), not `import`-style modules (modules exist since C++20 but adoption varies).

```cpp
// animal.h
#pragma once
class Animal {
public:
    Animal(const std::string& name);
    std::string speak() const;
private:
    std::string name_;
};

// animal.cpp
#include "animal.h"
Animal::Animal(const std::string& name) : name_(name) {}
std::string Animal::speak() const { return name_ + " makes a sound."; }

// main.cpp
#include "animal.h"
int main() {
    Animal a("Rex");
    a.speak();
}
```

`#pragma once` (or include guards) prevents double-inclusion of header content.

---

## 11. Error Handling

```cpp
#include <stdexcept>

try {
    riskyOperation();
} catch (const std::invalid_argument& e) {
    std::cerr << e.what() << std::endl;
} catch (const std::exception& e) {
    std::cerr << "Generic error: " << e.what() << std::endl;
} catch (...) {
    std::cerr << "Unknown error" << std::endl;
}

// Custom exception
class ValidationError : public std::runtime_error {
public:
    explicit ValidationError(const std::string& message)
        : std::runtime_error(message) {}
};
```

- Catch specific exception types before generic ones (order matters).
- RAII guarantees cleanup even when exceptions are thrown — no `finally` block needed in most cases.

---

## 12. Build and Dependency Management

```bash
# Compile directly
g++ -std=c++20 -Wall -o app main.cpp

# Typical project setup with CMake
mkdir build && cd build
cmake ..
cmake --build .
```

Common dependency managers: `vcpkg`, `conan`. Most real-world C++ projects use `CMake` rather than calling the compiler directly.

---

## 13. Style and Best Practices Checklist

- Prefer `auto` for type inference when it improves readability, but don't overuse it where explicit types aid clarity.
- Prefer smart pointers (`unique_ptr`, `shared_ptr`) over raw `new`/`delete`.
- Pass containers/strings by `const&` to avoid unnecessary copies.
- Mark functions `const` when they don't modify object state.
- Use `override` explicitly when overriding virtual functions.
- Prefer range-based `for` loops and standard algorithms (`<algorithm>`) over manual index loops.
- Use `nullptr`, not `NULL` or `0`, for null pointers.
- Enable compiler warnings (`-Wall -Wextra`) and treat them as errors in CI where feasible.
- Follow the Rule of Zero/Five for resource-owning classes (let RAII/smart pointers manage lifetime instead of writing manual copy/move/destructor logic when avoidable).