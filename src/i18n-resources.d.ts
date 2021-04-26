// src/i18n-resources.d.ts

import "react-i18next";

declare module "react-i18next" {
  export interface Resources {
    translation: typeof import("./i18n/en/translation.json");
  }
}
