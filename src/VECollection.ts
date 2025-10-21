type ObjectOrPrimitive = string | undefined;

export default class VECollection<T extends object> {
    private collection: T[];

    constructor(array?: Array<T>) {
        if (array) {
            this.collection = array;
        } else {
            this.collection = new Array<T>();
        }
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

    add(elem: T): void {
        this.collection.push(elem);
    }

    private removeElemAtInd(elemIndex: number): boolean {
        const removalResult = this.collection.splice(elemIndex, 1);
        return removalResult.length > 0;
    }

    remove(elem: T): boolean {
        const elemIndex = this.collection.findIndex((collectionElem) => this.valueEqualityCheck(elem, collectionElem));
        if (elemIndex > -1) {
            return this.removeElemAtInd(elemIndex);
        } else {
            return false;
        }
    }

    findAndRemoveFirst(findFn: (_: T) => boolean): boolean {
        const elemIndex = this.collection.findIndex(findFn);
        if (elemIndex > -1) {
            return this.removeElemAtInd(elemIndex);
        } else {
            return false;
        }
    }

    returnIfFound(findFn: (_: T) => boolean): T | undefined {
        const elemIndex = this.collection.findIndex(findFn);
        if (elemIndex > -1) {
            return this.collection[elemIndex];
        } else {
            return undefined;
        }
    }

    map<U extends object>(mapFn: (_: T) => U): VECollection<U> {
        const mapped = this.collection.map(mapFn);
        return new VECollection<U>(mapped);
    }

    filter(filterFn: (_: T) => boolean): VECollection<T> {
        const filtered = this.collection.filter(filterFn);
        return new VECollection<T>(filtered);
    }

    isEmpty(): boolean {
        return this.collection.length === 0;
    }

    isNonEmpty(): boolean {
        return !this.isEmpty();
    }

    size(): number {
        return this.collection.length;
    }
}