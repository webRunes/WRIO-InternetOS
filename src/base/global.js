export var importUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost"
    : "https://wrioos.com/";
export var cssUrl;
export var theme;

if (process.env.NODE_ENV === "development") {
  cssUrl = "//localhost:3033/";
  theme = "Default-WRIO-Theme";
} else {
  cssUrl = "//default.wrioos.com/";
  theme = "";
}

if (process.env.NODE_ENV === "dockerdev") {
  console.log("Docker production ENV detected");
  importUrl = cssUrl = "//localhost:3033/";
  theme = "Default-WRIO-Theme";
}

export var themeImportUrl = importUrl + theme + "/widget/";
export const isAirticlelist = false;

export function getResourcePath(filename: string): string {
  if (filename) {
    if (filename[0] === "/") {
      filename = filename.substring(1); // strip starting slash
    }
  }

  if (theme) {
    return cssUrl + theme + "/" + filename;
  } else {
    return cssUrl + filename;
  }
}

export var tabKey = "";

export function setValue(newValue: string) {
  tabKey = newValue;
  console.log("New value is " + tabKey);
}