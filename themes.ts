import {
  blue,
  blueDark,
  gray,
  grayDark,
  green,
  greenDark,
  orange,
  orangeDark,
  pink,
  pinkDark,
  purple,
  purpleDark,
  red,
  redDark,
  yellow,
  yellowDark,
} from "@tamagui/colors";
import { createThemeBuilder } from "@tamagui/theme-builder";
import type { Variable } from "@tamagui/web";
import { createTokens } from "@tamagui/web";

const colorTokens = {
  light: {
    blue,
    gray,
    green,
    orange,
    pink,
    purple,
    red,
    yellow,
  },
  dark: {
    blue: blueDark,
    gray: grayDark,
    green: greenDark,
    orange: orangeDark,
    pink: pinkDark,
    purple: purpleDark,
    red: redDark,
    yellow: yellowDark,
  },
};

const lightShadowColor = "rgba(0,0,0,0.04)";
const lightShadowColorStrong = "rgba(0,0,0,0.085)";
const darkShadowColor = "rgba(0,0,0,0.2)";
const darkShadowColorStrong = "rgba(0,0,0,0.3)";

const darkColors = {
  ...colorTokens.dark.blue,
  ...colorTokens.dark.gray,
  ...colorTokens.dark.green,
  ...colorTokens.dark.orange,
  ...colorTokens.dark.pink,
  ...colorTokens.dark.purple,
  ...colorTokens.dark.red,
  ...colorTokens.dark.yellow,
};

const lightColors = {
  ...colorTokens.light.blue,
  ...colorTokens.light.gray,
  ...colorTokens.light.green,
  ...colorTokens.light.orange,
  ...colorTokens.light.pink,
  ...colorTokens.light.purple,
  ...colorTokens.light.red,
  ...colorTokens.light.yellow,
};

const color = {
  white0: "rgba(255,255,255,0)",
  white075: "rgba(255,255,255,0.75)",
  white05: "rgba(255,255,255,0.5)",
  white025: "rgba(255,255,255,0.25)",
  black0: "rgba(10,10,10,0)",
  black075: "rgba(10,10,10,0.75)",
  black05: "rgba(10,10,10,0.5)",
  black025: "rgba(10,10,10,0.25)",
  white1: "#fff",
  white2: "#f8f8f8",
  white3: "hsl(0, 0%, 96.3%)",
  white4: "hsl(0, 0%, 94.1%)",
  white5: "hsl(0, 0%, 92.0%)",
  white6: "hsl(0, 0%, 90.0%)",
  white7: "hsl(0, 0%, 88.5%)",
  white8: "hsl(0, 0%, 81.0%)",
  white9: "hsl(0, 0%, 56.1%)",
  white10: "hsl(0, 0%, 50.3%)",
  white11: "hsl(0, 0%, 42.5%)",
  white12: "hsl(0, 0%, 9.0%)",
  black1: "#050505",
  black2: "#151515",
  black3: "#191919",
  black4: "#232323",
  black5: "#282828",
  black6: "#323232",
  black7: "#424242",
  black8: "#494949",
  black9: "#545454",
  black10: "#626262",
  black11: "#a5a5a5",
  black12: "#fff",
  ...postfixObjKeys(lightColors, "Light"),
  ...postfixObjKeys(darkColors, "Dark"),
};

export const palettes = (() => {
  const transparent = (hsl: string, opacity = 0) =>
    hsl.replace(`%)`, `%, ${opacity})`).replace(`hsl(`, `hsla(`);

  const getColorPalette = (colors: Object): string[] => {
    const colorPalette = Object.values(colors);
    // make the transparent color vibrant and towards the middle
    const colorI = colorPalette.length - 4;

    // add our transparent colors first/last
    // and make sure the last (foreground) color is white/black rather than colorful
    // this is mostly for consistency with the older theme-base
    return [
      transparent(colorPalette[0], 0),
      transparent(colorPalette[0], 0.25),
      transparent(colorPalette[0], 0.5),
      transparent(colorPalette[0], 0.75),
      ...colorPalette,
      transparent(colorPalette[colorI], 0.75),
      transparent(colorPalette[colorI], 0.5),
      transparent(colorPalette[colorI], 0.25),
      transparent(colorPalette[colorI], 0),
    ];
  };

  const lightPalette = [
    color.white0,
    color.white075,
    color.white05,
    color.white025,
    color.white1,
    color.white2,
    color.white3,
    color.white4,
    color.white5,
    color.white6,
    color.white7,
    color.white8,
    color.white9,
    color.white10,
    color.white11,
    color.white12,
    color.black075,
    color.black05,
    color.black025,
    color.black0,
  ];

  const darkPalette = [
    color.black0,
    color.black075,
    color.black05,
    color.black025,
    color.black1,
    color.black2,
    color.black3,
    color.black4,
    color.black5,
    color.black6,
    color.black7,
    color.black8,
    color.black9,
    color.black10,
    color.black11,
    color.black12,
    color.white075,
    color.white05,
    color.white025,
    color.white0,
  ];

  const lightPalettes = objectFromEntries(
    objectKeys(colorTokens.light).map(
      (key) =>
        [`light_${key}`, getColorPalette(colorTokens.light[key])] as const,
    ),
  );

  const darkPalettes = objectFromEntries(
    objectKeys(colorTokens.dark).map(
      (key) => [`dark_${key}`, getColorPalette(colorTokens.dark[key])] as const,
    ),
  );

  const colorPalettes = {
    ...lightPalettes,
    ...darkPalettes,
  };

  return {
    light: lightPalette,
    dark: darkPalette,
    ...colorPalettes,
  };
})();

export const templates = (() => {
  const transparencies = 3;

  // templates use the palette and specify index
  // negative goes backwards from end so -1 is the last item
  const base = {
    background0: 0,
    background025: 1,
    background05: 2,
    background075: 3,
    color1: transparencies + 1,
    color2: transparencies + 2,
    color3: transparencies + 3,
    color4: transparencies + 4,
    color5: transparencies + 5,
    color6: transparencies + 6,
    color7: transparencies + 7,
    color8: transparencies + 8,
    color9: transparencies + 9,
    color10: transparencies + 10,
    color11: transparencies + 11,
    color12: transparencies + 12,
    color0: -0,
    color025: -1,
    color05: -2,
    color075: -3,
    // the background, color, etc keys here work like generics - they make it so you
    // can publish components for others to use without mandating a specific color scale
    // the @tamagui/button Button component looks for `$background`, so you set the
    // dark_red_Button theme to have a stronger background than the dark_red theme.
    background: transparencies + 1,
    backgroundHover: transparencies + 2,
    backgroundPress: transparencies + 3,
    backgroundFocus: transparencies + 1,
    borderColor: transparencies + 4,
    borderColorHover: transparencies + 5,
    borderColorFocus: transparencies + 2,
    borderColorPress: transparencies + 4,
    color: -transparencies - 1,
    colorHover: -transparencies - 2,
    colorPress: -transparencies - 1,
    colorFocus: -transparencies - 2,
    colorTransparent: -0,
    placeholderColor: -transparencies - 4,
    outlineColor: -1,
  };

  const surface1 = {
    background: base.background + 1,
    backgroundHover: base.backgroundHover + 1,
    backgroundPress: base.backgroundPress + 1,
    backgroundFocus: base.backgroundFocus + 1,
    borderColor: base.borderColor + 1,
    borderColorHover: base.borderColorHover + 1,
    borderColorFocus: base.borderColorFocus + 1,
    borderColorPress: base.borderColorPress + 1,
  };

  const surface2 = {
    background: base.background + 2,
    backgroundHover: base.backgroundHover + 2,
    backgroundPress: base.backgroundPress + 2,
    backgroundFocus: base.backgroundFocus + 2,
    borderColor: base.borderColor + 2,
    borderColorHover: base.borderColorHover + 2,
    borderColorFocus: base.borderColorFocus + 2,
    borderColorPress: base.borderColorPress + 2,
  };

  const surface3 = {
    background: base.background + 3,
    backgroundHover: base.backgroundHover + 3,
    backgroundPress: base.backgroundPress + 3,
    backgroundFocus: base.backgroundFocus + 3,
    borderColor: base.borderColor + 3,
    borderColorHover: base.borderColorHover + 3,
    borderColorFocus: base.borderColorFocus + 3,
    borderColorPress: base.borderColorPress + 3,
  };

  const surfaceActive = {
    background: base.background + 5,
    backgroundHover: base.background + 5,
    backgroundPress: base.backgroundPress + 5,
    backgroundFocus: base.backgroundFocus + 5,
    borderColor: base.borderColor + 5,
    borderColorHover: base.borderColor + 5,
    borderColorFocus: base.borderColorFocus + 5,
    borderColorPress: base.borderColorPress + 5,
  };

  const inverseSurface1 = {
    color: surface1.background,
    colorHover: surface1.backgroundHover,
    colorPress: surface1.backgroundPress,
    colorFocus: surface1.backgroundFocus,
    background: base.color,
    backgroundHover: base.colorHover,
    backgroundPress: base.colorPress,
    backgroundFocus: base.colorFocus,
    borderColor: base.color - 2,
    borderColorHover: base.color - 3,
    borderColorFocus: base.color - 4,
    borderColorPress: base.color - 5,
  };

  const inverseActive = {
    ...inverseSurface1,
    background: base.color - 2,
    backgroundHover: base.colorHover - 2,
    backgroundPress: base.colorPress - 2,
    backgroundFocus: base.colorFocus - 2,
    borderColor: base.color - 2 - 2,
    borderColorHover: base.color - 3 - 2,
    borderColorFocus: base.color - 4 - 2,
    borderColorPress: base.color - 5 - 2,
  };

  const alt1 = {
    color: base.color - 1,
    colorHover: base.colorHover - 1,
    colorPress: base.colorPress - 1,
    colorFocus: base.colorFocus - 1,
  };

  const alt2 = {
    color: base.color - 2,
    colorHover: base.colorHover - 2,
    colorPress: base.colorPress - 2,
    colorFocus: base.colorFocus - 2,
  };

  return {
    base,
    alt1,
    alt2,
    surface1,
    surface2,
    surface3,
    inverseSurface1,
    inverseActive,
    surfaceActive,
  };
})();

const shadows = {
  light: {
    shadowColor: lightShadowColorStrong,
    shadowColorHover: lightShadowColorStrong,
    shadowColorPress: lightShadowColor,
    shadowColorFocus: lightShadowColor,
  },
  dark: {
    shadowColor: darkShadowColorStrong,
    shadowColorHover: darkShadowColorStrong,
    shadowColorPress: darkShadowColor,
    shadowColorFocus: darkShadowColor,
  },
};

const nonInherited = {
  light: {
    ...lightColors,
    ...shadows.light,
  },
  dark: {
    ...darkColors,
    ...shadows.dark,
  },
};

const overlayThemeDefinitions = [
  {
    parent: "light",
    theme: {
      background: "rgba(0,0,0,0.5)",
    },
  },
  {
    parent: "dark",
    theme: {
      background: "rgba(0,0,0,0.9)",
    },
  },
];

const inverseSurface1 = [
  {
    parent: "active",
    template: "inverseActive",
  },
  {
    parent: "",
    template: "inverseSurface1",
  },
] as any;

const surface1 = [
  {
    parent: "active",
    template: "surfaceActive",
  },
  {
    parent: "",
    template: "surface1",
  },
] as any;

const surface2 = [
  {
    parent: "active",
    template: "surfaceActive",
  },
  {
    parent: "",
    template: "surface2",
  },
] as any;

const surface3 = [
  {
    parent: "active",
    template: "surfaceActive",
  },
  {
    parent: "",
    template: "surface3",
  },
] as any;

// --- themeBuilder ---

const themeBuilder = createThemeBuilder()
  .addPalettes(palettes)
  .addTemplates(templates)
  .addThemes({
    light: {
      template: "base",
      palette: "light",
      nonInheritedValues: nonInherited.light,
    },
    dark: {
      template: "base",
      palette: "dark",
      nonInheritedValues: nonInherited.dark,
    },
  })
  .addChildThemes({
    orange: {
      palette: "orange",
      template: "base",
    },
    yellow: {
      palette: "yellow",
      template: "base",
    },
    green: {
      palette: "green",
      template: "base",
    },
    blue: {
      palette: "blue",
      template: "base",
    },
    purple: {
      palette: "purple",
      template: "base",
    },
    pink: {
      palette: "pink",
      template: "base",
    },
    red: {
      palette: "red",
      template: "base",
    },
    gray: {
      palette: "gray",
      template: "base",
    },
  })
  .addChildThemes({
    alt1: {
      template: "alt1",
    },
    alt2: {
      template: "alt2",
    },
    active: {
      template: "surface3",
    },
  })
  .addChildThemes(
    {
      ListItem: {
        template: "surface1",
      },
      SelectTrigger: surface1,
      Card: surface1,
      Button: surface3,
      Checkbox: surface2,
      Switch: surface2,
      SwitchThumb: inverseSurface1,
      TooltipContent: surface2,
      DrawerFrame: {
        template: "surface1",
      },
      Progress: {
        template: "surface1",
      },
      RadioGroupItem: surface2,
      TooltipArrow: {
        template: "surface1",
      },
      SliderTrackActive: {
        template: "surface3",
      },
      SliderTrack: {
        template: "surface1",
      },
      SliderThumb: inverseSurface1,
      Tooltip: inverseSurface1,
      ProgressIndicator: inverseSurface1,
      SheetOverlay: overlayThemeDefinitions,
      DialogOverlay: overlayThemeDefinitions,
      ModalOverlay: overlayThemeDefinitions,
      Input: surface1,
      TextArea: surface1,
    },
    {
      avoidNestingWithin: ["alt1", "alt2"],
    },
  );

// --- themes ---

const themesIn = themeBuilder.build();

export type Theme = Record<keyof typeof templates.base, string> &
  typeof nonInherited.light;
export type ThemesOut = Record<keyof typeof themesIn, Theme>;
export const themes = themesIn as ThemesOut;

// --- utils ---

export function postfixObjKeys<
  A extends { [key: string]: Variable<string> | string },
  B extends string,
>(
  obj: A,
  postfix: B,
): {
  [Key in `${keyof A extends string ? keyof A : never}${B}`]:
    | Variable<string>
    | string;
} {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [`${k}${postfix}`, v]),
  ) as any;
}

// a bit odd but keeping backward compat for values >8 while fixing below
export function sizeToSpace(v: number) {
  if (v === 0) return 0;
  if (v === 2) return 0.5;
  if (v === 4) return 1;
  if (v === 8) return 1.5;
  if (v <= 16) return Math.round(v * 0.333);
  return Math.floor(v * 0.7 - 12);
}

export function objectFromEntries<ARR_T extends EntriesType>(
  arr: ARR_T,
): EntriesToObject<ARR_T> {
  return Object.fromEntries(arr) as EntriesToObject<ARR_T>;
}

export type EntriesType =
  | [PropertyKey, unknown][]
  | ReadonlyArray<readonly [PropertyKey, unknown]>;

export type DeepWritable<OBJ_T> = {
  -readonly [P in keyof OBJ_T]: DeepWritable<OBJ_T[P]>;
};
export type UnionToIntersection<UNION_T> = // From https://stackoverflow.com/a/50375286
  (UNION_T extends any ? (k: UNION_T) => void : never) extends (
    k: infer I,
  ) => void
    ? I
    : never;

export type UnionObjectFromArrayOfPairs<ARR_T extends EntriesType> =
  DeepWritable<ARR_T> extends (infer R)[]
    ? R extends [infer key, infer val]
      ? { [prop in key & PropertyKey]: val }
      : never
    : never;
export type MergeIntersectingObjects<ObjT> = { [key in keyof ObjT]: ObjT[key] };
export type EntriesToObject<ARR_T extends EntriesType> =
  MergeIntersectingObjects<
    UnionToIntersection<UnionObjectFromArrayOfPairs<ARR_T>>
  >;

export function objectKeys<O extends Object>(obj: O) {
  return Object.keys(obj) as Array<keyof O>;
}
