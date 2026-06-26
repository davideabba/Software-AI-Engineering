# The algorithm complexity

The algorithm complexity is a measure of the amount of resources (time and space) that an algorithm uses as a function of the size of the input. It helps to understand how an algorithm will perform as the input size grows.

The amount of resources is translated in **fundamental operations**, such as comparisons, assignments, and arithmetic operations. The complexity is **expressed in terms of the input size (n)** and is usually **represented using Big-O notation**.

The asymptotic complexity of an algorithm is independent of the programming language used to implement it. It is a mathematical concept that describes the growth rate of an algorithm's resource usage.
The difference between different programming languages stays in the constant factors (how they manage memory, CPU, etc.), which are ignored in Big-O notation.

The complexity of an algorithm can be classified into two main categories:
1. **Time complexity**: It measures the amount of time an algorithm takes to complete as a function of the input size. It is usually expressed in terms of the number of fundamental operations performed.
2. **Space complexity**: It measures the amount of memory an algorithm uses as a function of the input size. It is usually expressed in terms of the number of memory units (variables, data structures) used.

### Big-O notation hierarchy

This is the Big-O notation hierarchy, from the fastest to the slowest growth rate:
- $O(1)$: Constant time complexity. The algorithm takes the same amount of time regardless of the input size.
- $O(\log(n))$: Logarithmic time complexity. The algorithm's time grows logarithmically with the input size. Examples include binary search and certain divide-and-conquer algorithms.
- $O(n)$: Linear time complexity. The algorithm's time grows linearly with the input size. Examples include linear search and simple loops.
- $O(n \log(n))$: Linearithmic time complexity. The algorithm's time grows in proportion to n log(n). Examples include efficient sorting algorithms like mergesort and heapsort.
- $O(n^2)$: Quadratic time complexity. The algorithm's time grows quadratically with the input size. Examples include bubble sort, insertion sort, and selection sort.
- $O(n^3)$: Cubic time complexity. The algorithm's time grows cubically with the input size. Examples include certain matrix multiplication algorithms.
- $O(2^n)$: Exponential time complexity. The algorithm's time grows exponentially with the input size. Examples include certain recursive algorithms and brute-force solutions to combinatorial problems.
- $O(n!)$: Factorial time complexity. The algorithm's time grows factorially with the input size. Examples include certain backtracking algorithms and brute-force solutions to permutation problems.

## How to compute the complexity of an algorithm

To compute the complexity of an algorithm, follow these steps:
1. **Identify the dominant operation.** Count the elementary operations (comparisons, assignments) function of the input size (n). The dominant operation is the one that contributes the most to the total number of operations as n grows.

2. **Look at loops.**
    - A single loop that runs n times contributes $O(n)$ to the complexity.
    - A nested loop where the inner loop runs n times for each iteration of the outer loop contributes  $O(n²)$ to the complexity.
    - A loop that goes through n elements calling a function that has complexity $O(f(n))$ contributes $O(n * f(n))$ to the total complexity.
    - A loop that splits the input in half at each iteration (like binary search) contributes $O(\log(n))$ to the complexity.

3. **Look at recursive calls.**
    - A recursive function that makes a single call to itself with a smaller input size contributes $O(f(n))$ to the complexity, where $f(n)$ is the complexity of the function.
    - A recursive function that makes multiple calls to itself contributes $O(k * f(n))$ to the complexity, where $k$ is the number of recursive calls.
    - You can use the **Master Theorem** to analyze the complexity of divide-and-conquer algorithms.

4. **Keep the dominant term, discard costants and lower order terms.** 
    - After analyzing the algorithm, you will have an expression that describes the number of operations as a function of n. Keep only the term that grows the fastest as n increases, and discard constant factors and lower-order terms.
    - Example: If the total number of operations is $3n^2 + 5n + 10$, the dominant term is $n^2$, so the complexity is $O(n^2)$.

5. **Worst-case vs average-case complexity.**
    - The worst-case complexity describes the maximum number of operations an algorithm will take for any input of size n.
    - The average-case complexity describes the expected number of operations an algorithm will take for a random input of size n. The notation use theta $(Θ)$ to represent the average-case complexity. For the lower bound, we use omega $(Ω)$ notation.
    - In many cases, we focus on the worst-case complexity, but it is important to consider the average-case complexity as well, especially for algorithms that have different performance characteristics based on the input distribution.

### Examples

#### $O(n)$: Find the maximum element in an array

```python
def find_max(arr):
    max_val = arr[0]          # O(1)
    for element in arr:      # n times loop
        if element > max_val:  # O(1) per iteration
            max_val = element
    return max_val
```

The complexity of this algorithm is $O(n)$ because the loop iterates through all n elements of the array, performing a constant-time comparison and assignment for each element.

#### $O(n^2)$: Couples with duplicated sum

```c++
int contaCoppie(vector<int>& arr, int target) {
    int n = arr.size();
    int count = 0;
    for (int i = 0; i < n; i++) {        // n iterations
        for (int j = i+1; j < n; j++) {  // on average n/2 iterations
            if (arr[i] + arr[j] == target) count++;
        }
    }
    return count;
}
```

Two nested loops are used to iterate through all pairs of elements in the array. The outer loop runs n times, and the inner loop runs on average n/2 times, resulting in a total of approximately $n * (n/2) = O(n^2)$ operations.

**In Python the result is the same**, but C++ is faster because it is a compiled language and has lower-level memory management, which can lead to better performance for certain operations. However, the asymptotic complexity remains the same across both languages.

## When programming language matters

The programming language can affect the actual running time of an algorithm due to differences in implementation, compiler optimizations, and runtime environments. However, the asymptotic complexity (Big O notation) remains the same across languages.

`list.append()` in Python is an $O(1)$ operation, while `list.insert(0, item)` is $O(n)$ because it requires shifting all elements. 

In contrast, in C++, `std::vector::push_back()` is $O(1)$ on average, but `std::vector::insert()` can be $O(n)$ depending on the position of insertion.

### Python vs C++: string concatenation in loops

```python
def build_string(n):
    s = ""
    for i in range(n):
        s += str(i)     
    return s
```

Every += creates a NEW string, the entire string is copied each time, so this is $O(n²)$.

The solution is to use a list and join it at the end:

```python
def build_string_efficient(n):
    s = []
    for i in range(n):
        s.append(str(i))
    return ''.join(s)
```

The result is a linear time complexity $O(n)$ because the list append operation is $O(1)$ and the join operation is $O(n)$.

What's courious is that **in C++, the first example would be $O(n)$** because `std::string::operator+=` manages memory differently and can allocate extra space to avoid copying the entire string on each concatenation.

# Time complexity: a Mathematical perspective

## Formal definition of Big-O

A function $T(n)$ (representing running time) is said to be $O(f(n))$ if there exist constants $c > 0$ and $n_0 \geq 0$ such that:

$$T(n) \leq c \cdot f(n) \quad \text{for all } n \geq n_0$$

In words: beyond some threshold $n_0$, the actual running time is always bounded above by a constant multiple of $f(n)$. Big-O describes an **asymptotic upper bound** — it captures behavior as $n \to \infty$, ignoring small-input behavior and constant factors.

An equivalent, often more intuitive, formulation uses limits:

$$\lim_{n \to \infty} \frac{T(n)}{f(n)} < \infty$$

If this limit exists and is finite (including zero), then $T(n) = O(f(n))$.

## Ordering of complexity classes

These classes form a strict ordering as $n \to \infty$:

$$O(1) < O(\log n) < O(n) < O(n\log n) < O(n^2) < O(n^3) < O(2^n) < O(n!)$$

where $f(n) < g(n)$ formally means:

$$\lim_{n\to\infty} \frac{f(n)}{g(n)} = 0$$

### $O(1)$ — Constant
$T(n) = c$. No dependence on $n$ at all.

### $O(\log n)$ — Logarithmic
Arises from recurrences of the form $T(n) = T(n/2) + O(1)$. If each step halves the problem size, after $k$ steps the remaining size is $n/2^k$. The process terminates when $n/2^k \approx 1$, i.e.:
$$k = \log_2 n$$
This is why binary search is $O(\log n)$: each comparison halves the search space.

**Note:** the logarithm's base doesn't matter for Big-O, since $\log_a n = \frac{\log_b n}{\log_b a}$ — a base change is just multiplication by a constant, which Big-O absorbs.

### $O(n)$ — Linear
$T(n) = c \cdot n$. Derives from $T(n) = T(n-1) + O(1)$: a constant-time operation repeated $n$ times.

### $O(n \log n)$ — Linearithmic
Arises from the recurrence $T(n) = 2T(n/2) + O(n)$ — the classic mergesort pattern: split into two halves, solve each, then recombine in linear time. By the Master Theorem (below), this resolves to $\Theta(n \log n)$: there are $\log n$ recursion levels, and each level does $O(n)$ total work.

### $O(n^2)$, $O(n^3)$ — Polynomial
Nested loops: $T(n) = n \cdot T_{\text{inner}}(n)$. Any polynomial $a_k n^k + \dots + a_1 n + a_0$ is $O(n^k)$ — the dominant term wins because, for large $n$, the lower-order terms become negligible in proportion:
$$\lim_{n\to\infty} \frac{a_{k-1}n^{k-1} + \dots}{n^k} = 0$$

### $O(2^n)$ — Exponential
Here the structure changes qualitatively: instead of adding a term at each step, work is **multiplied**. Arises from recurrences like $T(n) = 2T(n-1) + O(1)$, typical of algorithms exploring all subsets of an $n$-element set (there are exactly $2^n$ of them). Exponential growth dominates any polynomial:
$$\lim_{n\to\infty} \frac{n^k}{2^n} = 0 \quad \text{for any fixed } k$$

### $O(n!)$ — Factorial
$n! = n \times (n-1) \times \dots \times 1$. Grows faster than any fixed-base exponential:
$$\lim_{n\to\infty} \frac{a^n}{n!} = 0 \quad \text{for any } a$$
By Stirling's approximation, $n! \approx \sqrt{2\pi n}\left(\frac{n}{e}\right)^n$ — roughly $n^n$ scaled down by an exponential factor. Typical of algorithms generating all permutations of $n$ elements (exactly $n!$ of them).

### Numerical illustration

| n | $n^2$ | $2^n$ | $n!$ |
|---|-------|-------|------|
| 10 | 100 | 1,024 | 3,628,800 |
| 20 | 400 | 1,048,576 | ~$2.4 \times 10^{18}$ |
| 30 | 900 | ~$10^9$ | ~$2.65 \times 10^{32}$ |

There's a qualitative jump between **polynomial** complexity ($n^k$ for fixed $k$) and **exponential/factorial** complexity — this is essentially the boundary between tractable and intractable problems in practice.


# The Master Theorem

The Master Theorem is a tool for directly solving recurrences of the form produced by **divide-and-conquer** algorithms, without having to expand the recursion tree by hand every time.

## The general recurrence form

$$T(n) = a \cdot T\left(\frac{n}{b}\right) + f(n)$$

where:
- $a \geq 1$ — the number of subproblems the problem is split into at each level
- $b > 1$ — the factor by which the problem size shrinks at each level
- $f(n)$ — the cost of the work done *outside* the recursive calls (combining/splitting)

## Intuition: comparing two competing costs

Each level of recursion does $f(n)$ work to split/combine, but the **number of leaves** in the recursion tree is $a^{\log_b n} = n^{\log_b a}$. The Master Theorem essentially compares:

- $n^{\log_b a}$ — the total work that would be done if all work happened at the leaves
- $f(n)$ — the work done at each internal level

Whichever dominates determines the overall complexity.

## The three cases

Let $c = \log_b a$ (i.e., $n^c = n^{\log_b a}$).

**Case 1: $f(n) = O(n^{c - \epsilon})$ for some $\epsilon > 0$**
The leaves dominate (there's so much branching that the bulk of the work happens at the bottom of the tree).
$$T(n) = \Theta(n^c) = \Theta(n^{\log_b a})$$

**Case 2: $f(n) = \Theta(n^c \log^k n)$ for some $k \geq 0$**
The work is balanced across all $\log_b n$ levels.
$$T(n) = \Theta(n^c \log^{k+1} n)$$

**Case 3: $f(n) = \Omega(n^{c + \epsilon})$ for some $\epsilon > 0$, and the regularity condition $a \cdot f(n/b) \leq k \cdot f(n)$ holds for some $k < 1$**
The top level dominates (splitting/combining is expensive enough that recursion barely matters).
$$T(n) = \Theta(f(n))$$

## Worked examples

**Mergesort:** $T(n) = 2T(n/2) + O(n)$
- $a = 2$, $b = 2$, $f(n) = n$
- $c = \log_2 2 = 1$, so $n^c = n$
- $f(n) = \Theta(n^1 \log^0 n) = \Theta(n)$ → matches **Case 2** with $k=0$
- Result: $T(n) = \Theta(n^1 \log^1 n) = \Theta(n \log n)$

**Binary search:** $T(n) = T(n/2) + O(1)$
- $a = 1$, $b = 2$, $f(n) = 1 = n^0$
- $c = \log_2 1 = 0$, so $n^c = 1$
- $f(n) = \Theta(n^0) = \Theta(1)$ → matches **Case 2** with $k=0$
- Result: $T(n) = \Theta(\log n)$

**Naive matrix multiplication via 8-way recursive split:** $T(n) = 8T(n/2) + O(n^2)$
- $a = 8$, $b = 2$, $f(n) = n^2$
- $c = \log_2 8 = 3$, so $n^c = n^3$
- $f(n) = n^2 = O(n^{3 - \epsilon})$ for $\epsilon = 1$ → matches **Case 1**
- Result: $T(n) = \Theta(n^3)$ (confirms why naive recursive matrix multiplication is cubic, motivating Strassen's algorithm)

**Strassen's matrix multiplication:** $T(n) = 7T(n/2) + O(n^2)$
- $a = 7$, $b = 2$, $f(n) = n^2$
- $c = \log_2 7 \approx 2.81$, so $n^c \approx n^{2.81}$
- $f(n) = n^2 = O(n^{2.81 - \epsilon})$ → matches **Case 1**
- Result: $T(n) = \Theta(n^{\log_2 7}) \approx \Theta(n^{2.81})$ — better than naive $O(n^3)$

## Why it matters in practice

For any divide-and-conquer algorithm — including tree/graph traversal patterns relevant to recursive knowledge-graph queries (e.g., recursive traversal over a Graphify structure) — the Master Theorem lets you classify the complexity directly from the recurrence's parameters ($a$, $b$, $f(n)$) without manually unrolling the recursion tree.

One caveat worth noting in documentation: the Master Theorem only applies to recurrences of this exact form (equal-sized subproblems, polynomial $f(n)$). Recurrences with unequal subdivisions (e.g., $T(n) = T(n/3) + T(2n/3) + O(n)$) require other techniques like the **Akra–Bazzi method**, a generalization of the Master Theorem.