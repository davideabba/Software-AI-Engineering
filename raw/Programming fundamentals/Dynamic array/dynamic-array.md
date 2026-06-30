# Dynamic Array

A dynamic array is a data structure that allows you to store a collection of elements, similar to a regular array, but with the ability to resize itself at runtime automatically when the number of elements exceeds its current capacity. This makes dynamic arrays more flexible than static arrays, which have a fixed size.

In Python, a `list` is a dynamic array, while in C++ it is `std::vector`. In Java, the `ArrayList` class provides similar functionality.

A dynamic array has two main pieces of information: the **size** (the number of elements currently stored) and the **capacity** (the amount of space allocated for future elements).
**If the size equals or exceeds the capacity**, the dynamic array will automatically resize itself, typically by allocating a new array with a larger capacity and copying the existing elements to the new array. Then the old memory is freed and the new elements are added to the new array.
Typically, **the capacity is doubled when resizing** to ensure that the amortized time complexity of adding an element remains $O(1)$.

###  But why not adding just 1 to the capacity?
If we were to increase the capacity by only 1 each time, the time complexity of adding an element would become $O(n)$ in the worst case, as each addition would require copying all existing elements to a new array. Doubling the capacity reduces the frequency of resizing operations, making the average time complexity of adding an element $O(1)$.

So the `append` method of a dynamic array has an amortized time complexity of $O(1)$, and in the worst case, it can take $O(n)$ time when resizing occurs. However, since resizing happens infrequently, the average time complexity remains constant.

### What it's not $O(1)$?
The operations of `inserting` or `removing` an element at a specific index in a dynamic array are not $O(1)$ because they may require **shifting elements** to maintain the order of the array. For example, if you insert an element at the beginning of the array, all existing elements must be shifted one position to the right, resulting in a time complexity of $O(n)$ for that operation.

### Python vs C++

**In Python**, the `list` type is implemented as a dynamic array. It automatically resizes itself by a 1.125x factor when elements are added or removed. The underlying implementation uses a contiguous block of memory to store the elements, and when the capacity is exceeded, a new block of memory is allocated, and the existing elements are copied over.
**In C++**, the `std::vector` class is a dynamic array that also resizes itself when necessary. The resizing strategy may vary depending on the implementation, but it typically involves doubling the capacity when the current capacity is exceeded. The `std::vector` class provides various member functions to manipulate the elements, such as `push_back`, `insert`, and `erase`.

From the **memory management** perspective, both Python and C++ handle dynamic arrays differently. In Python, memory management is handled by the interpreter and uses **array of pointers to objects**, while in C++, the programmer has more control over memory allocation and deallocation, and it uses **contiguous memory blocks**. Also, Python uses *garbage collection* to manage memory, while C++ requires explicit memory management using `new` and `delete` operators.
Since in Python every element is a reference to an object, the memory overhead can be higher compared to C++, where elements are stored directly in contiguous memory blocks. This can lead to better cache performance in C++ for large arrays.