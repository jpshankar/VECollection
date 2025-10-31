type ObjectOrPrimitive = string | undefined;

export default class VECollection<T extends object> {
    private collection: Set<T>;

    constructor(set: Set<T> = new Set<T>()) {
        this.collection = set;
    }

    private isObjectForValueEqualityCheck<U>(maybeValidObject: U): boolean {
        return typeof maybeValidObject === 'object' && maybeValidObject !== null;
    }

    private valueEqualityCheck<U extends object>(leftHand: U, rightHand: U): boolean {        
        const leftHandKeys = Object.keys(leftHand).sort();
        const rightHandKeys = Object.keys(rightHand).sort();

        if (leftHandKeys.length !== rightHandKeys.length) {
            return false;
        } else {
            const primitiveAndObjectValues =
                leftHandKeys.map(
                    (leftHandKey): [ObjectOrPrimitive, ObjectOrPrimitive] => {
                        const leftHandValue = leftHand[leftHandKey as keyof U];
                        if (this.isObjectForValueEqualityCheck(leftHandValue)) {
                            return [undefined, leftHandKey];
                        } else {
                            return [leftHandKey, undefined];
                        }
                    }
                );

            const leftHandPrimitiveKeys = 
                primitiveAndObjectValues
                    .filter(
                        ([maybePrimitiveKey, _]) => typeof maybePrimitiveKey === 'string'  
                    )
                    .map(
                        ([filteredPrimitiveKey, _]) => filteredPrimitiveKey as string
                    );

            const allPrimitivesEqual =
                leftHandPrimitiveKeys.every(
                    (leftHandPrimitiveKey) => {
                        const rightHandKeyValue = rightHandKeys.find((rightHandKey) => rightHandKey === leftHandPrimitiveKey);
                        return rightHandKeyValue && rightHand[rightHandKeyValue as keyof U] === leftHand[leftHandPrimitiveKey as keyof U];
                    }
                )

            if (allPrimitivesEqual) {
                const leftHandObjectKeys = 
                    primitiveAndObjectValues
                        .filter(
                            ([_, maybeObjectKey]) => typeof maybeObjectKey === 'string'  
                        )
                        .map(
                            ([_, filteredObjectKey]) => filteredObjectKey as string
                        );

                return leftHandObjectKeys.every(
                    (leftHandObjectKey) => {
                        const rightHandObjectKey = rightHandKeys.find((rightHandKey) => rightHandKey === leftHandObjectKey);
                        return rightHandObjectKey && this.valueEqualityCheck(leftHand[leftHandObjectKey as keyof U] as object, rightHand[rightHandObjectKey as keyof U] as object);
                    }
                );
                    
            } else {
                return false;
            }
        }
    }

    private elemInSet(elem: T): boolean {
        return Array.from(this.collection).findIndex((collectionElem) => this.valueEqualityCheck(elem, collectionElem)) > -1;
    }

    add(elem: T): void {
        if (!this.elemInSet(elem)) {
            this.collection.add(elem);
        }
    }

    addAll(elemCollection: VECollection<T>): void {
        const addableElems = elemCollection.filter((collectionElem) => !this.elemInSet(collectionElem));
        
        addableElems.forEach(
            (addableElem) => {
                this.collection.add(addableElem);
            }
        );
    }

    copy(): VECollection<T> {
        return new VECollection<T>(this.collection);
    }

    remove(elem: T): boolean {
        const collectionArray = Array.from(this.collection);
        const elemIndex = collectionArray.findIndex((collectionElem) => this.valueEqualityCheck(elem, collectionElem));

        if (elemIndex > -1) {
            const elemRemovedCollectionArray = collectionArray.slice(0, elemIndex).concat(collectionArray.slice(elemIndex + 1, collectionArray.length));
            this.collection = new Set<T>(elemRemovedCollectionArray);
            return true;
        } else {
            return false;
        }
    }

    clear(): void {
        this.collection.clear();
    }

    findAndRemoveFirstOccurrence(findFn: (_: T) => boolean): boolean {
        const collectionArray = Array.from(this.collection);
        const elemIndex = collectionArray.findIndex((collectionElem) => findFn(collectionElem));

        if (elemIndex > -1) {
            const elemRemovedCollectionArray = collectionArray.slice(0, elemIndex).concat(collectionArray.slice(elemIndex + 1, collectionArray.length));
            this.collection = new Set<T>(elemRemovedCollectionArray);
            return true;
        } else {
            return false;
        }
    }

    returnFirstOccurrenceIfFound(findFn: (_: T) => boolean): T | undefined {
        const collectionArray = Array.from(this.collection);
        const elemIndex = collectionArray.findIndex((collectionElem) => findFn(collectionElem));

        if (elemIndex > -1) {
            return collectionArray[elemIndex];
        } else {
            return undefined;
        }
    }

    map<U extends object>(mapFn: (_: T) => U): VECollection<U> {
        const mapped = Array.from(this.collection).map(mapFn);
        return new VECollection<U>(new Set<U>(mapped));
    }

    forEach(forEachFn: (_: T) => void): void {
        this.collection.forEach(forEachFn);
    }

    filter(filterFn: (_: T) => boolean): VECollection<T> {
        const filtered = Array.from(this.collection).filter(filterFn);
        return new VECollection<T>(new Set<T>(filtered));
    }

    isEmpty(): boolean {
        return this.collection.size === 0;
    }

    isNonEmpty(): boolean {
        return !this.isEmpty();
    }

    size(): number {
        return this.collection.size;
    }
}