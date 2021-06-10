import { ObjectID } from '/imports/common/interfaces';
import { User } from '/imports/common/Users/interfaces';

export interface ErrorReport {
    _id: ObjectID;
    userId: string;
    user: User;
    level: number;
    message: string;
    path?: string;
    userAgent?: string;
    stack: string[];
    reactStack: string[];
    createdAt: Date;
    createdById: string;
    createdBy: User;
  }