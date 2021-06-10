export interface ObjectID {
  toHexString(): string;
  equals(otherID: ObjectID): boolean;
}