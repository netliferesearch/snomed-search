export type Styles = {
  loading: string;
  'loading--lg': string;
  'loading--md': string;
  'loading--sm': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
