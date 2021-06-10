declare module '*.gql' {
    import { DocumentNode } from 'graphql'
    const Schema: DocumentNode

    export = Schema
    

    // interface Item {
    //     [key: string]: DocumentNode;
    //   }

    //   export default {} as Item;

}

// type Input<T> = {
//     input: {
//         [P in keyof T]: T[P];
//     };
// };
