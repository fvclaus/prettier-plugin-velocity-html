export enum RenderMode {
  BLOCK,
  INLINE,
}

export interface RenderDefinition {
  siblingsMode: RenderMode;
  childrenMode?: RenderMode;
  forceBreak?: boolean;
  forceBreakChildren?: boolean;
  forceClose?: boolean;
  preformatted?: boolean;
  selfClosing?: boolean;
}

// prettier-ignore
const renderDefinitions: [string, RenderDefinition][] = [
  ["applet",            { siblingsMode: RenderMode.INLINE }],
  ["audio",             { siblingsMode: RenderMode.INLINE }],
  ["b",                 { siblingsMode: RenderMode.INLINE }],
  ["basefont",          { siblingsMode: RenderMode.INLINE }],
  ["bdi",               { siblingsMode: RenderMode.INLINE }],
  ["bdo",               { siblingsMode: RenderMode.INLINE }],
  ["bgsound",           { siblingsMode: RenderMode.INLINE }],
  ["big",               { siblingsMode: RenderMode.INLINE }],
  ["blink",             { siblingsMode: RenderMode.INLINE }],
  ["block-quote",       { siblingsMode: RenderMode.INLINE }],
  ["button",            { siblingsMode: RenderMode.INLINE, childrenMode: RenderMode.BLOCK }],
  ["canvas",            { siblingsMode: RenderMode.INLINE }],
  ["caption",           { siblingsMode: RenderMode.INLINE }],
  ["center",            { siblingsMode: RenderMode.INLINE }],
  ["cite",              { siblingsMode: RenderMode.INLINE }],
  ["code",              { siblingsMode: RenderMode.INLINE }],
  ["colgroup",          { siblingsMode: RenderMode.INLINE }],
  ["content",           { siblingsMode: RenderMode.INLINE }],
  ["data",              { siblingsMode: RenderMode.INLINE }],
  ["del",               { siblingsMode: RenderMode.INLINE }],
  ["dfn",               { siblingsMode: RenderMode.INLINE }],
  ["dir",               { siblingsMode: RenderMode.INLINE }],
  ["em",                { siblingsMode: RenderMode.INLINE }],
  ["font",              { siblingsMode: RenderMode.INLINE }],
  ["frame",             { siblingsMode: RenderMode.INLINE }],
  ["frameset",          { siblingsMode: RenderMode.INLINE }],
  ["iframe",            { siblingsMode: RenderMode.INLINE }],
  ["ins",               { siblingsMode: RenderMode.INLINE }],
  ["isindex",           { siblingsMode: RenderMode.INLINE }],
  ["kbd",               { siblingsMode: RenderMode.INLINE }],
  ["label",             { siblingsMode: RenderMode.INLINE }],
  ["legend",            { siblingsMode: RenderMode.INLINE }],
  ["listing",           { siblingsMode: RenderMode.INLINE }],
  ["map",               { siblingsMode: RenderMode.INLINE }],
  ["mark",              { siblingsMode: RenderMode.INLINE }],
  ["marquee",           { siblingsMode: RenderMode.INLINE }],
  ["math",              { siblingsMode: RenderMode.INLINE }],
  ["menu",              { siblingsMode: RenderMode.INLINE }],
  ["menuitem",          { siblingsMode: RenderMode.INLINE }],
  ["meter",             { siblingsMode: RenderMode.INLINE }],
  ["multicol",          { siblingsMode: RenderMode.INLINE }],
  ["nextid",            { siblingsMode: RenderMode.INLINE }],
  ["nobr",              { siblingsMode: RenderMode.INLINE }],
  ["noembed",           { siblingsMode: RenderMode.INLINE }],
  ["noframes",          { siblingsMode: RenderMode.INLINE }],
  ["noscript",          { siblingsMode: RenderMode.INLINE }],
  ["object",            { siblingsMode: RenderMode.INLINE }],
  ["output",            { siblingsMode: RenderMode.INLINE }],
  ["picture",           { siblingsMode: RenderMode.INLINE }],
  ["plain-text",        { siblingsMode: RenderMode.INLINE }],
  ["portal",            { siblingsMode: RenderMode.INLINE }],
  ["progress",          { siblingsMode: RenderMode.INLINE }],
  ["q",                 { siblingsMode: RenderMode.INLINE }],
  ["rb",                { siblingsMode: RenderMode.INLINE }],
  ["rp",                { siblingsMode: RenderMode.INLINE }],
  ["rt",                { siblingsMode: RenderMode.INLINE }],
  ["rtc",               { siblingsMode: RenderMode.INLINE }],
  ["ruby",              { siblingsMode: RenderMode.INLINE }],
  ["s",                 { siblingsMode: RenderMode.INLINE }],
  ["samp",              { siblingsMode: RenderMode.INLINE }],
  ["shadow",            { siblingsMode: RenderMode.INLINE }],
  ["slot",              { siblingsMode: RenderMode.INLINE }],
  ["small",             { siblingsMode: RenderMode.INLINE }],
  ["spacer",            { siblingsMode: RenderMode.INLINE }],
  ["span",              { siblingsMode: RenderMode.INLINE }],
  ["strike",            { siblingsMode: RenderMode.INLINE }],
  ["strong",            { siblingsMode: RenderMode.INLINE }],
  ["sub",               { siblingsMode: RenderMode.INLINE }],
  ["sup",               { siblingsMode: RenderMode.INLINE }],
  ["svg",               { siblingsMode: RenderMode.INLINE }],
  ["tbody",             { siblingsMode: RenderMode.INLINE }],
  ["td",                { siblingsMode: RenderMode.INLINE }],
  ["template",          { siblingsMode: RenderMode.INLINE }],
  ["tfoot",             { siblingsMode: RenderMode.INLINE }],
  ["th",                { siblingsMode: RenderMode.INLINE }],
  ["thead",             { siblingsMode: RenderMode.INLINE }],
  ["time",              { siblingsMode: RenderMode.INLINE }],
  ["title",             { siblingsMode: RenderMode.BLOCK }],
  ["tr",                { siblingsMode: RenderMode.INLINE }],
  ["tt",                { siblingsMode: RenderMode.INLINE }],
  ["u",                 { siblingsMode: RenderMode.INLINE }],
  ["var",               { siblingsMode: RenderMode.INLINE }],
  ["video",             { siblingsMode: RenderMode.INLINE }],
  ["xmp",               { siblingsMode: RenderMode.INLINE }],
  ["a",                 { siblingsMode: RenderMode.INLINE}],
  ["abbr",              { siblingsMode: RenderMode.INLINE}],
  ["acronym",           { siblingsMode: RenderMode.INLINE}],
  ["image",             { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["line",              { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["mpath",             { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["path",              { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["polygon",           { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["polyline",          { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["rect",              { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["set",               { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["stop",              { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["use",               { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["view",              { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["circle",            { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["clipPath",          { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["ellipse",           { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["feBlend",           { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["feColorMatrix",     { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["feComposite",       { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["feConvolveMatrix",  { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["feDisplacementMap", { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["feDropShadow",      { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["feFlood",           { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["feGaussianBlur",    { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["feImage",           { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["feMergeNode",       { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["feMorphology",      { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["feOffset",          { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["fePointLight",      { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["feSpotLight",       { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["feTile",            { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["feTurbulence",      { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["hatchpath",         { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["animate",           { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["animateMotion",     { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["animateTransform",  { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["source",            { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["col",               { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["area",              { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["base",              { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["defs",              { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["embed",             { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["img",               { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["keygen",            { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["link",              { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["meta",              { siblingsMode: RenderMode.BLOCK, selfClosing: true }],
  ["br",                { siblingsMode: RenderMode.INLINE, forceBreak: true, selfClosing: true }],
  ["address",           { siblingsMode: RenderMode.BLOCK }],
  ["article",           { siblingsMode: RenderMode.BLOCK }],
  ["aside",             { siblingsMode: RenderMode.BLOCK }],
  ["body",              { siblingsMode: RenderMode.BLOCK, forceBreakChildren: true }],
  ["blockquote",        { siblingsMode: RenderMode.BLOCK }],
  ["details",           { siblingsMode: RenderMode.BLOCK, forceBreakChildren: true }],
  ["datalist",          { siblingsMode: RenderMode.BLOCK, forceBreakChildren: true }],
  ["dialog",            { siblingsMode: RenderMode.BLOCK }],
  ["dd",                { siblingsMode: RenderMode.BLOCK }],
  ["div",               { siblingsMode: RenderMode.BLOCK }],
  ["dl",                { siblingsMode: RenderMode.BLOCK }],
  ["dt",                { siblingsMode: RenderMode.BLOCK }],
  ["fieldset",          { siblingsMode: RenderMode.BLOCK }],
  ["figcaption",        { siblingsMode: RenderMode.BLOCK }],
  ["figure",            { siblingsMode: RenderMode.BLOCK }],
  ["footer",            { siblingsMode: RenderMode.BLOCK }],
  ["form",              { siblingsMode: RenderMode.BLOCK }],
  ["input",             { siblingsMode: RenderMode.INLINE, selfClosing: true }],
  ["g",                 { siblingsMode: RenderMode.BLOCK }],
  ["h1",                { siblingsMode: RenderMode.BLOCK }],
  ["h2",                { siblingsMode: RenderMode.BLOCK }],
  ["h3",                { siblingsMode: RenderMode.BLOCK }],
  ["h4",                { siblingsMode: RenderMode.BLOCK }],
  ["h5",                { siblingsMode: RenderMode.BLOCK }],
  ["h6",                { siblingsMode: RenderMode.BLOCK }],
  ["html",              { siblingsMode: RenderMode.BLOCK }],
  ["header",            { siblingsMode: RenderMode.BLOCK }],
  ["head",              { siblingsMode: RenderMode.BLOCK, forceBreakChildren: true }],
  ["hgroup",            { siblingsMode: RenderMode.BLOCK }],
  ["hr",                { siblingsMode: RenderMode.BLOCK, selfClosing: true }],
  ["li",                { siblingsMode: RenderMode.BLOCK }],
  ["main",              { siblingsMode: RenderMode.BLOCK }],
  ["nav",               { siblingsMode: RenderMode.BLOCK }],
  ["ol",                { siblingsMode: RenderMode.BLOCK, forceBreakChildren: true }],
  ["p",                 { siblingsMode: RenderMode.BLOCK }],
  ["pre",               { siblingsMode: RenderMode.BLOCK, preformatted: true }],
  ["section",           { siblingsMode: RenderMode.BLOCK }],
  ["select",            { siblingsMode: RenderMode.BLOCK, forceBreakChildren: true }],
  ["optgroup",          { siblingsMode: RenderMode.BLOCK }],
  ["option",            { siblingsMode: RenderMode.BLOCK }],
  ["summary",           { siblingsMode: RenderMode.BLOCK }],
  ["script",            { siblingsMode: RenderMode.BLOCK, forceClose: true, forceBreakChildren: true },],
  ["style",             { siblingsMode: RenderMode.BLOCK, forceBreakChildren: true }],
  ["param",             { siblingsMode: RenderMode.BLOCK, selfClosing: true }],
  ["table",             { siblingsMode: RenderMode.BLOCK, forceBreakChildren: true }],
  ["ul",                { siblingsMode: RenderMode.BLOCK, forceBreakChildren: true }],
  ["track",             { siblingsMode: RenderMode.BLOCK, selfClosing: true }],
  ["textarea",          { siblingsMode: RenderMode.INLINE, preformatted: true }],
  ["wbr",               { siblingsMode: RenderMode. INLINE, selfClosing: true }],
];

export const tagRegistry: Map<string, RenderDefinition> = new Map<
  string,
  RenderDefinition
>();

const duplicatedTags: string[] = [];
for (const [tagName, renderDefinition] of renderDefinitions) {
  if (tagRegistry.has(tagName)) {
    duplicatedTags.push(tagName);
  }
  tagRegistry.set(tagName, renderDefinition);
}
if (duplicatedTags.length > 0) {
  throw new Error(duplicatedTags.join(", ") + " are duplicated");
}
