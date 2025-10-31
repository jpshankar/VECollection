import {describe, expect, test} from '@jest/globals';
import VECollection from '../src/VECollection';

interface JustPrimitivesObject {
    primitiveField: string
}

const testPrimitivesObject: JustPrimitivesObject = {
    primitiveField: "justPrimitives"
}

interface NotJustPrimitivesObject {
    primitiveField: string,
    objectField: JustPrimitivesObject
}

const testNotJustPrimitivesObject: NotJustPrimitivesObject = {
    primitiveField: "notJustPrimitives",
    objectField: testPrimitivesObject
}

describe("VECollection constructor", () => {
  test("should construct a collection when no Array is provided", () => {
    const collection = new VECollection<JustPrimitivesObject>();
    expect(collection.isEmpty()).toBe(true);
  });

  test("should construct a collection when an Array is provided", () => {
    const collection = new VECollection<JustPrimitivesObject>(new Set<JustPrimitivesObject>([testPrimitivesObject]));

    expect(collection.isEmpty()).toBe(false);
    expect(collection.isNonEmpty()).toBe(true);

    expect(collection.size()).toBe(1);
  });
});

describe("VECollection.add", () => {
  test("should add the provided element without any issues", () => {
    const collection = new VECollection<JustPrimitivesObject>(new Set<JustPrimitivesObject>([testPrimitivesObject]));
    expect(collection.size()).toBe(1);

    const secondJustPrimitives = {
        primitiveField: "secondJustPrimitives"
    }

    collection.add(secondJustPrimitives);
    expect(collection.size()).toBe(2);
  });

  test("should not add the same element twice", () => {
    const collection = new VECollection<JustPrimitivesObject>(new Set<JustPrimitivesObject>([testPrimitivesObject]));
    expect(collection.size()).toBe(1);

    const secondJustPrimitives = {
        primitiveField: "secondJustPrimitives"
    }

    collection.add(secondJustPrimitives);
    expect(collection.size()).toBe(2);

    collection.add(secondJustPrimitives);
    expect(collection.size()).toBe(2);
  });
});

describe("VECollection.addAll", () => {
  test("should add the provided elements without any issues", () => {
    const collection = new VECollection<JustPrimitivesObject>(new Set<JustPrimitivesObject>([testPrimitivesObject]));
    expect(collection.size()).toBe(1);

    const secondJustPrimitives = {
        primitiveField: "secondJustPrimitives"
    }

    const thirdJustPrimitives = {
        primitiveField: "secondJustPrimitives"
    }

    const secondCollection = new VECollection<JustPrimitivesObject>(new Set<JustPrimitivesObject>([secondJustPrimitives, thirdJustPrimitives]));
    expect(secondCollection.size()).toBe(2);

    collection.addAll(secondCollection);
    expect(collection.size()).toBe(3);
  });

  test("should not add the same elements twice", () => {
    const collection = new VECollection<JustPrimitivesObject>(new Set<JustPrimitivesObject>([testPrimitivesObject]));
    expect(collection.size()).toBe(1);

    const secondJustPrimitives = {
        primitiveField: "secondJustPrimitives"
    }

    const thirdJustPrimitives = {
        primitiveField: "secondJustPrimitives"
    }

    const secondCollection = new VECollection<JustPrimitivesObject>(new Set<JustPrimitivesObject>([secondJustPrimitives, thirdJustPrimitives]));
    expect(secondCollection.size()).toBe(2);

    collection.addAll(secondCollection);
    expect(collection.size()).toBe(3);

    collection.addAll(secondCollection);
    expect(collection.size()).toBe(3);
  });
});

describe("VECollection.copy", () => {
  test("should create a copy without any issues", () => {
    const collection = new VECollection<JustPrimitivesObject>(new Set<JustPrimitivesObject>([testPrimitivesObject]));
    expect(collection.size()).toBe(1);

    const copyCollection = collection.copy();
    
    expect(copyCollection.size()).toBe(1);
    // Verify that it's a fresh copy, not the same reference.
    expect(copyCollection).not.toBe(collection);
  });
});

describe("VECollection.remove", () => {
  test("should remove an object with only primitives", () => {
    const collection = new VECollection<JustPrimitivesObject>(new Set<JustPrimitivesObject>([testPrimitivesObject]));
    expect(collection.isNonEmpty()).toBe(true);

    expect(collection.remove(testPrimitivesObject)).toBe(true);
    expect(collection.isEmpty()).toBe(true);
  });

  test("should remove an object itself containing objects", () => {
    const collection = new VECollection<NotJustPrimitivesObject>(new Set<NotJustPrimitivesObject>([testNotJustPrimitivesObject]));
    expect(collection.isNonEmpty()).toBe(true);

    expect(collection.remove(testNotJustPrimitivesObject)).toBe(true);
    expect(collection.isEmpty()).toBe(true);
  });

  test("should handle the specified object-to-remove not being there", () => {
    const collection = new VECollection<JustPrimitivesObject>(new Set<JustPrimitivesObject>([testPrimitivesObject]));
    expect(collection.isNonEmpty()).toBe(true);

    expect(collection.remove(testNotJustPrimitivesObject)).toBe(false);
    
    expect(collection.isEmpty()).toBe(false);
    expect(collection.isNonEmpty()).toBe(true);
  });
});

describe("VECollection.clear", () => {
  test("should clear the set", () => {
    const collection = new VECollection<JustPrimitivesObject>(new Set<JustPrimitivesObject>([testPrimitivesObject]));
    expect(collection.isNonEmpty()).toBe(true);

    collection.clear();
    expect(collection.isEmpty()).toBe(true);
  });
});

describe("VECollection.findAndRemoveFirstOccurrence", () => {
    test("should remove the first value that satisfies the criteria", () => {
        const secondJustPrimitives: JustPrimitivesObject = {
            primitiveField: "secondJustPrimitives"
        }

        const thirdJustPrimitives: JustPrimitivesObject = {
            primitiveField: "thirdJustPrimitives"
        }

        const collection = new VECollection<JustPrimitivesObject>(new Set<JustPrimitivesObject>([testPrimitivesObject, secondJustPrimitives, thirdJustPrimitives]));
        expect(collection.size()).toBe(3);

        collection.findAndRemoveFirstOccurrence(({primitiveField}) => !primitiveField.startsWith("third"));
        expect(collection.size()).toBe(2);
    });

    test("should handle no values in the VECollection satisfying the criteria", () =>{
        const secondJustPrimitives: JustPrimitivesObject = {
            primitiveField: "secondJustPrimitives"
        }

        const thirdJustPrimitives: JustPrimitivesObject = {
            primitiveField: "thirdJustPrimitives"
        }

        const collection = new VECollection<JustPrimitivesObject>(new Set<JustPrimitivesObject>([testPrimitivesObject, secondJustPrimitives, thirdJustPrimitives]));
        expect(collection.size()).toBe(3);

        collection.findAndRemoveFirstOccurrence(({primitiveField}) => primitiveField.startsWith("fourth"));
        expect(collection.size()).toBe(3);
    });
});

describe("VECollection.returnFirstOccurrenceIfFound", () => {
    test("should return the first result matching the criteria", () => {
        const secondJustPrimitives: JustPrimitivesObject = {
            primitiveField: "justPrimitivesII"
        }

        const collection = new VECollection<JustPrimitivesObject>(new Set<JustPrimitivesObject>([testPrimitivesObject, secondJustPrimitives]));
        const firstFound = collection.returnFirstOccurrenceIfFound(({primitiveField}) => primitiveField.startsWith("just"));

        expect(firstFound?.primitiveField).toBe(testPrimitivesObject.primitiveField);
    });

    test("should handle no values in the VECollection satisfying the criteria", () => {
        const secondJustPrimitives: JustPrimitivesObject = {
            primitiveField: "justPrimitivesII"
        }

        const collection = new VECollection<JustPrimitivesObject>(new Set<JustPrimitivesObject>([testPrimitivesObject, secondJustPrimitives]));
        const firstFound = collection.returnFirstOccurrenceIfFound(({primitiveField}) => !primitiveField.startsWith("just"));

        expect(firstFound).toBeFalsy();
    });
});

describe("VECollection.map", () => {
    test("should execute mapFn without any issues", () => {
        const collection = new VECollection<JustPrimitivesObject>(new Set<JustPrimitivesObject>([testPrimitivesObject]));
        expect(collection.size()).toBe(1);

        const mappedCollection = collection.map(
            ({primitiveField}): JustPrimitivesObject => {
                return {primitiveField: primitiveField.toUpperCase()}
            }
        );

        expect(mappedCollection.size()).toBe(1);
    });

    test("should handle an empty VECollection without any issues", () => {
        const collection = new VECollection<JustPrimitivesObject>();
        expect(collection.isEmpty()).toBe(true);

        const mappedCollection = collection.map(
            ({primitiveField}): JustPrimitivesObject => {
                return {primitiveField: primitiveField.toUpperCase()}
            }
        );
        
        expect(mappedCollection.isEmpty()).toBe(true);
    });
});

describe("VECollection.forEach", () => {
    test("should execute forEachFn without any issues", () => {
        const collection = new VECollection<JustPrimitivesObject>(new Set<JustPrimitivesObject>([testPrimitivesObject]));

        expect(
            () =>
                collection.forEach(
                    ({primitiveField}) => {
                        console.log(primitiveField);
                    }
                )
        ).not.toThrow();
    });

    test("should handle an empty VECollection without any issues", () => {
        const collection = new VECollection<JustPrimitivesObject>();

        expect(
            () =>
                collection.forEach(
                    ({primitiveField}) => {
                        console.log(primitiveField);
                    }
                )
        ).not.toThrow();
    });
});

describe("VECollection.filter", () => {
    test("should execute filterFn correctly", () => {
        const secondJustPrimitives: JustPrimitivesObject = {
            primitiveField: "secondJustPrimitives"
        }

        const thirdJustPrimitives: JustPrimitivesObject = {
            primitiveField: "thirdJustPrimitives"
        }

        const collection = new VECollection<JustPrimitivesObject>(new Set<JustPrimitivesObject>([testPrimitivesObject, secondJustPrimitives, thirdJustPrimitives]));
        expect(collection.size()).toBe(3);

        const filteredCollection = collection.filter(({primitiveField}) => !primitiveField.startsWith("third"));
        expect(filteredCollection.size()).toBe(2);
    });

    test("should handle an empty VECollection without any issues", () => {
        const collection = new VECollection<JustPrimitivesObject>();
        expect(collection.isEmpty()).toBe(true);

        const filteredCollection = collection.filter(({primitiveField}) => !primitiveField.startsWith("third"));
        expect(filteredCollection.isEmpty()).toBe(true);
    });
});