import { ObjectID, SortOrder } from '/imports/common/interfaces';
import { User, UserLookup } from '/imports/common/Users/interfaces';

export interface ErrorReportFixture {
    _id?: ObjectID;
    userId?: string;
    user?: User | UserLookup;
    level: number;
    message: string;
    path?: string;
    userAgent?: string;
    stack: string[];
    reactStack: string[];
    createdAt: Date;
    createdById?: string;
    createdBy?: User | UserLookup;
  }

  export interface ErrorReport extends ErrorReportFixture  {
    user: User;
    createdBy: User;
  }

  export interface ErrorReportsQueryString {
  _ids?: string | string[] | ObjectID | ObjectID[];
  page?: string | number;
  pageSize?: string | number;
  sort?: string;
  order?: SortOrder;
  search?: string;
  level?: number | number[] | string | string[];
}

export interface ErrorReportsParams extends ErrorReportsQueryString {
  _ids?: ObjectID[];
  page?:  number;
  pageSize?: number;
  level?: number[];
}

export interface HasErrorReportId {
  errorReportId: ObjectID;
}