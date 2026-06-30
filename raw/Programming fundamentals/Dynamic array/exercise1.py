"""
Create a DynamicArray class that implements a dynamic array data structure. The class should support the following operations:
1. Initialization
2. Append an element to the end of the array
3. Get the size of the array
4. Get the element at a specific index
5. Remove the element at a specific index
6. Set the element at a specific index
7. Remove the last element from the array (pop operation)

8. Add a counter to count how many times the array has been resized (capacity increased) during n calls to the append method.
Execute the DynamicArray class with a series of append operations (n=1000, 10000, 1000000) and check if the counter increases in a logarithmic manner
(i.e., the counter should increase by 1 for every doubling of the array's capacity). O(n) time complexity is expected for the append operation

9. Shrink: pop function should shrink the array if the size is less than 1/4 of the capacity. The new capacity should be half of the current capacity.
Why the shrink threshold is set to 1/4 of the capacity instead of 1/2? (Think of what happend if you alternate append and pop near that threshold).

10. Do the same in C++ using DynamicArray<T>, new[], delete[] (and not vector).

11. Design: If you were to implement a dynamic array that needed to guarantee O(1) worst-case for every single append
(not amortized, but guaranteed for every single call, useful for example in real-time systems), what strategy would you use?
(Hint: think of an "incremental" resize spread over multiple operations instead of doing it all at once)
"""


class DynamicArray:
    def __init__(self, capacity: int):
        self.size = 0
        self.capacity = capacity
        self.array = [None] * capacity

    def __len__(self):
        return self.size

    def set_size(self):
        counter = 0
        for i, val in enumerate(self.array):
            if val is not None:
                counter += 1

        self.size = counter

    def get_size(self):
        return self.size

    def set_capacity(self, n: int):
        self.capacity = n

    def get_capacity(self):
        return self.capacity

    def get_element_by_index(self, index: int):
        return self.array[index] if index < self.size else None

    def print(self):
        print([el for _, el in enumerate(self.array)])

    def append(self, el):
        if self.size >= self.capacity:
            print(
                f"The size {self.size} is equal or greater then capacity {self.capacity}."
            )
            v = []
            v = [None] * self.capacity * 2
            for i, val in enumerate(self.array):
                v[i] = val

            v[self.size] = el

            self.array = v
            self.capacity = self.capacity * 2
        else:
            self.array[self.size] = el

        self.size += 1
        return self

    def pop(self):
        self.array[self.size - 1] = None
        self.size -= 1

    def delete_element_by_index(self, index: int):
        if index >= self.size:
            print(
                f"ERROR: Unable to delete the element at position {index}: the index exceed the size of the array."
            )
            return None

        v = []
        v = [None] * self.capacity
        y = 0
        for i, val in enumerate(self.array):
            if y == self.capacity:
                break
            if i == index:
                continue
            else:
                v[y] = val

            y += 1
        self.array = v
        self.size -= 1

    def add_element_at_index(self, index: int, el):
        v = []
        if self.size >= self.capacity:
            print(
                f"The size {self.size} is equal or greater then capacity {self.capacity}."
            )
            v = [None] * self.capacity * 2
            self.capacity = self.capacity * 2
        else:
            v = [None] * self.capacity

        if index > self.size:
            print(
                f"ERROR: Unable to insert the new element at position {index}: the index exceed the size of the array."
            )
            return None

        y = 0
        for i, val in enumerate(self.array):
            if y == self.capacity:
                break
            if i == index:
                v[y] = el
                v[y + 1] = val
                y += 1
            else:
                v[y] = val

            y += 1

        self.array = v
        self.size += 1


dynamic_array = DynamicArray(3)

dynamic_array.print()
dynamic_array.set_size()
print(
    f"Size is {dynamic_array.get_size()} - capacity is {dynamic_array.get_capacity()}\n"
)

dynamic_array.append(1)
dynamic_array.print()
print(
    f"Size is {dynamic_array.get_size()} - capacity is {dynamic_array.get_capacity()}\n"
)

dynamic_array.append(1)
dynamic_array.print()
print(
    f"Size is {dynamic_array.get_size()} - capacity is {dynamic_array.get_capacity()}\n"
)

dynamic_array.append(5)
dynamic_array.print()
print(
    f"Size is {dynamic_array.get_size()} - capacity is {dynamic_array.get_capacity()}\n"
)

dynamic_array.append("ciao")
dynamic_array.print()
print(
    f"Size is {dynamic_array.get_size()} - capacity is {dynamic_array.get_capacity()}\n"
)

print(f"The element 3 in the array is: {dynamic_array.get_element_by_index(3)}\n")

dynamic_array.pop()
dynamic_array.print()
print(
    f"Size is {dynamic_array.get_size()} - capacity is {dynamic_array.get_capacity()}\n"
)

print("ADD ELEMENTS TO INDEX POSITION")

dynamic_array.add_element_at_index(0, "new")
dynamic_array.print()
print(
    f"Size is {dynamic_array.get_size()} - capacity is {dynamic_array.get_capacity()}\n"
)

dynamic_array.add_element_at_index(3, "new 2")
dynamic_array.print()
print(
    f"Size is {dynamic_array.get_size()} - capacity is {dynamic_array.get_capacity()}\n"
)

dynamic_array.add_element_at_index(50, "new 3")
dynamic_array.print()
print(
    f"Size is {dynamic_array.get_size()} - capacity is {dynamic_array.get_capacity()}\n"
)

dynamic_array.add_element_at_index(2, "new 4")
dynamic_array.print()
print(
    f"Size is {dynamic_array.get_size()} - capacity is {dynamic_array.get_capacity()}\n"
)

dynamic_array.delete_element_by_index(0)
dynamic_array.print()
print(
    f"Size is {dynamic_array.get_size()} - capacity is {dynamic_array.get_capacity()}\n"
)

dynamic_array.append(50)
dynamic_array.print()
print(
    f"Size is {dynamic_array.get_size()} - capacity is {dynamic_array.get_capacity()}\n"
)
