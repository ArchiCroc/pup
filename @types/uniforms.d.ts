
// import {
//     FormItemProps as AntdFormItemProps,
//   } from 'antd/lib/form/FormItem';

// declare module 'uniforms' {
//   export interface FormItemProps<Values = any> extends AntdFormItemProps<Values> {
//     extra?: string;
//   }
// }
import { SimpleSchema as SimpleSchema2 } from 'simpl-schema';


declare module 'simpl-schema' {

    import { SchemaDefinition, AutoValueContext as AutoValueContext2, CustomValidationContext as CustomValidationContext2 } from '@types/simpl-schema';


    export interface UniformsDefinition {
        placeholder?: string | (() => string);
        extra?: string | (() => string);
    }

    export interface SchemaDefinition {
        uniforms?: UniformsDefinition;
    }

    // export type SimpleSchemaDefinition = {
    //     uniforms: UniformsDefinition;
    // }

    export type SimpleSchemaDefinition = {

    };
    export interface AutoValueContext extends AutoValueContext2 {

    };

    // copied from @types/simpl-schema since it wasn't exported
    export interface CustomValidationContext {
        /** The name of the schema key (e.g., "addresses.0.street") */
        key: string;

        /** The generic name of the schema key (e.g., "addresses.$.street") */
        genericKey: string;

        /** True if we're traversing an object that's in an array */
        isInArrayItemObject: boolean;

        /** True if we're traversing an object that's somewhere within another object */
        isInSubObject: boolean;

        /** True if this is running on a MongoDB modifier object */
        isModifier: boolean;

        /** The schema definition object. */
        definition: SchemaDefinition;

        /** Does the object being validated have this key set? */
        isSet: boolean;

        /** Value to validate */
        value: any;

        /** The Mongo operator for which we're doing validation. Might be null. */
        operator?: string | null;

        /** The current validation context */
        validationContext: ValidationContext;

        /**
         * Use this method to get information about other fields. Pass a field name
         * (non-generic schema key) as the only argument. The return object will
         * have isSet, value, and operator properties for that field.
         */
        field(name: string): FieldInfo;
        /**
         * Use this method to get information about other fields that have the same
         * parent object. Works the same way as field(). This is helpful when you use
         * sub-schemas or when you're dealing with arrays of objects.
         */
        siblingField(name: string): FieldInfo;

        /**
         * Call this to add validation errors for any key. In general, you should use
         * this to add errors for other keys. To add an error for the current key,
         * return the error type string. If you do use this to add an error for the
         * current key, return false from your custom validation function.
         */
        addValidationErrors(errors: ReadonlyArray<SimpleSchemaValidationError>): any;
    }

    export class SimpleSchema extends SimpleSchema2 {
        messageBox: { messages: (messages: any) => void };
    }

    export default SimpleSchema;
}

