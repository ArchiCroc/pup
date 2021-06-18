declare module 'antd/lib/button/button' {
  import {
    BaseButtonProps as AntdBaseButtonProps,
    // // ButtonType as AntdButtonType,
    // ButtonProps as AntdButtonProps,
    // AnchorButtonProps, 
    // NativeButtonProps
  } from 'antd/lib/button/button';


  // // export type ButtonType = AntdButtonType | "danger";
  // type ButtonTestProps = {
  //   'data-testid'?: string;
  // };

  // export type ButtonProps = AntdButtonProps & ButtonTestProps;


  export interface BaseButtonProps extends AntdBaseButtonProps {
    'data-testid'?: string;
  }
}

// declare module 'antd/lib/modal' {

//   // export type ButtonType = AntdButtonType | "danger";
//   type ButtonTestProps = {
//     'data-testid'?: string;
//   };

//   export interface BaseButtonProps extends AntdBaseButtonProps {
//     'data-testid'?: string;
//   }

//   export type ButtonProps = AntdButtonProps & ButtonTestProps;

//   export declare type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps & ButtonTestProps>;


//   export interface ModalFuncProps extends AntdModalFuncProps {
//     okButtonProps?: ButtonProps;
//     cancelButtonProps?: ButtonProps;
//   }
// }