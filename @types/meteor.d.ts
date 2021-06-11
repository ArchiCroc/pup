declare module 'meteor/meteor' {
    type global_Error = Error;
    //Export all the Error types
    /** Error **/
    var Error: ErrorStatic;
    export interface ErrorStatic {
        new (error: string | number, reason?: string, details?: string): Error;
    }
    export interface Error extends global_Error {
        error: string | number;
        reason?: string;
        details?: string;
    }
    var TypedError: TypedErrorStatic;
    export interface TypedErrorStatic {
        new (message: string, errorType: string): TypedError;
    }
    export interface TypedError extends global_Error {
        message: string;
        errorType: string;
    }
    /** Error **/
  }

  declare module 'meteor/accounts-base' {
    type global_Error = Error;
    //Export all the Error types
    /** Error **/
    var Error: ErrorStatic;
    export interface ErrorStatic {
        new (error: string | number, reason?: string, details?: string): Error;
    }
    export interface Error extends global_Error {
        error: string | number;
        reason?: string;
        details?: string;
    }
    var TypedError: TypedErrorStatic;
    export interface TypedErrorStatic {
        new (message: string, errorType: string): TypedError;
    }
    export interface TypedError extends global_Error {
        message: string;
        errorType: string;
    }
    /** Error **/
  }