# Python Fundamentals — Reference Guide

A condensed reference covering the core aspects of Python needed for general-purpose programming and as a companion to the JavaScript fundamentals guide.

---

## 1. Variables and Declarations

```python
x = 10            # dynamically typed, no declaration keyword
y: str = "hello"  # optional type hint (not enforced at runtime)
CONSTANT = 42     # convention only — Python has no true constants
```

- No `var`/`let`/`const`: every name binding works the same way.
- Type hints (`x: int`) are optional and checked only by external tools (e.g. `mypy`), not by the interpreter.
- Naming convention: `snake_case` for variables/functions, `PascalCase` for classes, `UPPER_CASE` for constants.

---

## 2. Data Types

Python is dynamically typed. Core built-in types:

| Type | Example | `type()` result |
|---|---|---|
| String | `"text"` | `<class 'str'>` |
| Integer | `42` | `<class 'int'>` |
| Float | `3.14` | `<class 'float'>` |
| Boolean | `True` / `False` | `<class 'bool'>` |
| None | absence of value | `<class 'NoneType'>` |
| List | `[1, 2, 3]` | `<class 'list'>` |
| Tuple | `(1, 2, 3)` | `<class 'tuple'>` |
| Dict | `{"a": 1}` | `<class 'dict'>` |
| Set | `{1, 2, 3}` | `<class 'set'>` |

### Equality and identity

```python
1 == "1"   # False — no implicit type coercion between str and int
1 == 1.0   # True  — numeric types compare by value
a is b     # identity check (same object in memory), not equality
```

**Rule:** use `==` for value comparison, `is` only for identity (e.g. `is None`, `is True`).

---

## 3. Functions

```python
def add(a, b):
    return a + b

# Lambda (anonymous function, single expression)
add = lambda a, b: a + b

# Multi-line function with docstring
def greet(name):
    """Return a greeting message."""
    message = f"Hello, {name}"
    return message
```

### Default and variadic parameters

```python
def multiply(a, b=2):
    return a * b

def total(*numbers):          # *args — collects positional args into a tuple
    return sum(numbers)

def configure(**options):     # **kwargs — collects keyword args into a dict
    return options
```

Unlike JavaScript arrow functions, Python functions always bind `self` explicitly when defined inside a class — there's no implicit `this`.

---

## 4. Lists, Tuples, and Dictionaries

### Lists (mutable, ordered — analogous to JS arrays)

```python
arr = [1, 2, 3]
arr.append(4)
[x * 2 for x in arr]                 # list comprehension (like .map)
[x for x in arr if x > 1]            # filtered comprehension (like .filter)
sum(arr)                             # built-in reduction
from functools import reduce
reduce(lambda acc, x: acc + x, arr, 0)
```

### Tuples (immutable, ordered)

```python
point = (10, 20)
x, y = point  # unpacking
```

### Dictionaries (mutable, key-value — analogous to JS objects)

```python
obj = {"name": "Mario", "age": 30}
obj["name"]
obj.get("name")          # safer access, returns None if missing
name, age = obj["name"], obj["age"]

# Unpacking / merging (like spread)
obj2 = {**obj, "city": "Milan"}
arr2 = [*arr, 5]
```

### Sets (unique, unordered)

```python
s = {1, 2, 3}
s.add(4)
```

---

## 5. Control Flow

```python
if condition:
    ...
elif other:
    ...
else:
    ...

for i in range(10):
    ...

for item in arr:
    ...

for key, value in obj.items():
    ...

while condition:
    ...

# Pattern matching (Python 3.10+, similar to switch)
match value:
    case 1:
        ...
    case _:
        ...
```

**Note:** Python uses indentation (not braces) to define blocks. Consistent indentation is mandatory, not stylistic.

---

## 6. Truthy / Falsy and None Handling

**Falsy values:** `False`, `0`, `0.0`, `""`, `[]`, `{}`, `set()`, `None`. Everything else is truthy.

```python
if msg_payload:  # careful: 0, "", and empty collections are falsy
    ...

# Safe attribute/key access
value = obj.get("nested", {}).get("property")  # no error if key missing

# Default fallback (similar to ??, but check explicitly for None)
result = value if value is not None else "default"
```

There is no native optional-chaining operator (`?.`) in Python; `.get()` on dicts or explicit `None` checks fill that role.

---

## 7. Asynchronous Python

Python is single-threaded by default for a given interpreter process, but supports cooperative concurrency via `asyncio`.

### Coroutines with async/await

```python
import asyncio
import aiohttp

async def get_data():
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get("https://api.example.com") as res:
                data = await res.json()
                return data
    except Exception as err:
        print(err)

asyncio.run(get_data())
```

### Common patterns

```python
await asyncio.gather(coro1(), coro2())        # run concurrently, wait for all
await asyncio.wait_for(coro(), timeout=5)       # run with a timeout
results = await asyncio.gather(*tasks, return_exceptions=True)  # like allSettled
```

**Note:** unlike JavaScript, `async`/`await` in Python only works inside an event loop (e.g. `asyncio.run(...)`); a regular synchronous function cannot directly `await`.

---

## 8. Classes

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return f"{self.name} makes a sound."


class Dog(Animal):
    def speak(self):
        return f"{self.name} barks."
```

- `self` must be explicitly declared as the first parameter of instance methods.
- `__init__` is the constructor.
- Dunder methods (`__str__`, `__eq__`, `__len__`, etc.) customize built-in behaviors.

---

## 9. Modules

```python
# my_module.py
VALUE = 42

def main():
    ...

# main script
from my_module import main, VALUE
import my_module

if __name__ == "__main__":
    main()
```

- `if __name__ == "__main__":` guards code that should run only when the file is executed directly, not when imported.
- Packages are directories containing `__init__.py` (optional since Python 3.3 but still common for explicit package structure).

---

## 10. Error Handling

```python
try:
    risky_operation()
except ValueError as error:
    print(error)
except (TypeError, KeyError) as error:
    print(f"Handled: {error}")
finally:
    cleanup()

# Custom exceptions
class ValidationError(Exception):
    def __init__(self, message):
        super().__init__(message)
```

- Prefer catching specific exception types over a bare `except:`.
- Use `raise` to propagate or `raise NewError(...) from original_error` to chain context.

---

## 11. Virtual Environments and Dependency Management

```bash
python -m venv .venv
source .venv/bin/activate     # Linux/macOS
.venv\Scripts\activate        # Windows

pip install package_name
pip install -r requirements.txt
pip freeze > requirements.txt
```

For projects already using `Pydantic`, `FastAPI`, `SQLAlchemy`, etc., a `pyproject.toml`-based workflow (e.g. with `poetry` or `uv`) is generally preferred over a flat `requirements.txt` for reproducibility.

---

## 12. Style and Best Practices Checklist

- Follow PEP 8 (naming, spacing, line length ~79–99 chars depending on team convention).
- Prefer list/dict comprehensions over manual loops when they remain readable.
- Use `with` statements (context managers) for resource handling (files, sessions, locks).
- Use type hints for function signatures in production code; pair with `mypy`/`pyright` for static checking.
- Catch specific exceptions, not bare `except:`.
- Prefer `f-strings` over `.format()` or `%` formatting.
- Use `dataclasses` or `Pydantic` models instead of plain dicts for structured data.
- Keep functions small and favor pure functions where possible.