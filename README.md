# VECollection
Needed a TypeScript collection that did deep equality on its own, one I could then build myself a React hook for - so made this.

#### How to use

```TypeScript
import VECollection from { VECollection };
..
interface ExampleObject {
    exampleField: string
}
..
const collection = new VECollection<ExampleObject>();
```

# Constructor

```TypeScript
const collection = new VECollection<ExampleObject>();
..
const exampleObject = {"exampleField": "exampleField"};
const array = new Set<ExampleObject>([exampleField]);
const collection = new VECollection<ExampleObject>(array);
```

# Methods

#### add(elem: T): void

```TypeScript
collection.add(exampleObject);
```

Adds elem to VECollection.

#### addAll(elemCollection: VECollection<T>): void 

```TypeScript
const secondCollection = new VECollection<ExampleObject>([{"primitiveField": "secondPrimitiveField"}]);
collection.addAll(secondCollection);
```

Adds each elem in elemCollection to the calling VECollection.

#### remove(elem: T): boolean

```TypeScript
collection.remove(exampleObject);
```

Returns true if we found (and subsequently removed) an element that satisfies deep equality when elem - and false if we didn't.

#### findAndRemoveFirstOccurrence(findFn: (_: T) => boolean): boolean

```TypeScript
collection.findAndRemoveFirstOccurrence(({primitiveField}) => primitiveField.startsWith("first"));
```

Boolean return behavior is similar to remove() above, but based on the result of findFn.

#### returnFirstOccurrenceIfFound(findFn: (_: T) => boolean): T | undefined

```TypeScript
collection.returnFirstOccurrenceIfFound(({primitiveField}) => primitiveField.startsWith("first"));
```

Returns first result satisfying findFn if found - and undefined if not found.

(filter() below satisfies any " return all occurrences " needs.)

#### map<U extends object>(mapFn: (_: T) => U): VECollection<U>

```TypeScript
const mappedCollection = collection.map(
            ({primitiveField}): JustPrimitivesObject => {
                return {primitiveField: primitiveField.toUpperCase()}
            }
        );
```

Returns a VECollection containing the results of mapFn applied to the current collection's elems - in the same order as said collection already had.

#### forEach(forEachFn: (_: T) => void): void

```TypeScript
collection.forEach(
    ({primitiveField}) => console.log(primitiveField);
);
```

Executes forEachFn on each collection elem, in the collection's current order.

#### filter(filterFn: (_: T) => boolean): VECollection<T>

```TypeScript
const filteredCollection = collection.filter(({primitiveField}) => !primitiveField.startsWith("example"));
```

Returns a VECollection containing all elems in the current collection that satisfy filterFn - in, again, the collection's existing order.

#### isEmpty(): boolean

```TypeScript
const isEmpty = collection.isEmpty();
```

isEmpty() === true if collection.size() === 0.

#### isNonEmpty(): boolean

```TypeScript
const isNonEmpty = collection.isNonEmpty()
```

isNonEmpty() = !isEmpty().

#### size(): number

```TypeScript
const collectionSize = collection.size();
```

size() = number of elems in collection.

# Deep equality here..

.. is done via recursion. 

VECollection.valueEqualityCheck() splits each object into primitives and non-primitives - it verifies the equality of all primitives, then recursively calls valueEqualityCheck() on each non-primitive. 

Recursion will terminate when it reaches object fields that are " all primitives, no nested objects ".
