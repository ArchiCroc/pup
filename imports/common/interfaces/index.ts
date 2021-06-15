import { User } from '/imports/common/Users/interfaces';
export interface ObjectID {
  toHexString(): string;
  equals(otherID: ObjectID): boolean;
}
export interface Context {
  user: User
}

export type SortOrder = "descend" | "ascend" | null

export interface HasId {
  _id: ObjectID;
}