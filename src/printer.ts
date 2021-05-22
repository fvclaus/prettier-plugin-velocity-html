import { Doc, doc, FastPath } from "prettier";
import {
  AttributeNode,
  DecoratedNode,
  HtmlCdataNode,
  HtmlCloseNode,
  HtmlCommentNode,
  HtmlDocTypeNode,
  HtmlTagNode,
  HtmlTextNode,
  IeConditionalCommentNode,
  NodeWithChildren,
  ParserNode,
  RootNode,
} from "./parser/VelocityParserNodes";
import { VelocityToken } from "./parser/VelocityToken";

const {
  literalline,
  breakParent,
  dedentToRoot,
  fill,
  ifBreak,
  concat,
  hardline,
  softline,
  join,
  group,
  indent,
  line,
} = doc.builders;

function escapeDoubleQuote(text: string): string {
  return text.replace(/"/g, "&quot;");
}

function printRevealedConditionalComment(token: VelocityToken) {
  return token.textValue.trim().replace(/\s/g, " ").replace(/\s+]/, "]");
}

function decorateStart(node: DecoratedNode | undefined): Doc {
  return node != null && node.revealedConditionalCommentStart != null
    ? printRevealedConditionalComment(node.revealedConditionalCommentStart)
    : "";
}

function decorateEnd(node: DecoratedNode | undefined): Doc {
  return node != null && node.revealedConditionalCommentEnd != null
    ? printRevealedConditionalComment(node.revealedConditionalCommentEnd)
    : "";
}

function decorate(doc: Doc | Doc[], node: DecoratedNode | undefined): Doc {
  return concat([
    decorateStart(node),
    ...(doc instanceof Array ? doc : [doc]),
    decorateEnd(node),
  ]);
}

export function printOpeningTag(
  node: HtmlTagNode,
  path: FastPath<ParserNode>,
  print: (path: FastPath) => Doc
): Doc {
  const printedAttributes: Doc[] = path.map(print, "attributes");
  const tagOpenParts: Doc[] = [
    decorateStart(node.startNode),
    `<${node.tagName}`,
  ];

  if (printedAttributes.length > 0) {
    tagOpenParts.push(indent(concat([line, join(line, printedAttributes)])));
  }

  if (!node.isSelfClosing && !breakOpeningTag(node)) {
    tagOpenParts.push(softline, ">", decorateEnd(node.startNode));
  }

  return group(concat(tagOpenParts));
}

export function printClosingTag(node: HtmlTagNode): Doc {
  if (node.forceCloseTag || node.endNode != null) {
    const parts: Doc[] = [];
    if (!breakClosingTag(node)) {
      parts.push(decorateStart(node.endNode), `</${node.tagName}`);
    }
    parts.push(`>`, decorateEnd(node.endNode));
    return concat(parts);
  } else if (node.isSelfClosing) {
    return concat([line, "/>"]);
  } else {
    return "";
  }
}

export function concatChildren(node: ParserNode, children: Doc[] | Doc): Doc {
  if (children == "") {
    return "";
  }
  const firstChild = node instanceof NodeWithChildren ? node.children[0] : null;
  /**
   * The close node is special, because it prints its children first (no start tag).
   * This will result in too many softlines (one per level) before the children content starts.
   */
  const doSoftline =
    !node.isSelfOrParentPreformatted && !(firstChild instanceof HtmlCloseNode);
  return group(
    concat([
      indent(
        concat([
          /**
           * An indent only works with a softline and it only indents to the level of the softline.
           * Therefore we always must place softline inside the inner most indent.
           * This seems to be a design decision by prettier.
           */
          doSoftline ? softline : "",
          ...(children instanceof Array ? children : [children]),
          node instanceof NodeWithChildren && node.forceBreakChildren
            ? breakParent
            : "",
        ])
      ),
      !node.isSelfOrParentPreformatted ? softline : "",
    ])
  );
}

function calculateDifferenceBetweenChildren(
  prev: ParserNode,
  next: ParserNode,
  sameLineDoc: Doc
): Doc {
  const lineDifference = next.startLocation.line - prev.endLocation!.line;
  if (lineDifference == 0) {
    return sameLineDoc;
  } else if (lineDifference == 1) {
    return hardline;
  } else {
    return concat([hardline, hardline]);
  }
}

function breakOpeningTag(parent: HtmlTagNode) {
  return (
    parent.isInlineRenderMode &&
    parent.children.length > 0 &&
    parent.children[0].isInlineRenderMode &&
    !parent.children[0].hasLeadingSpaces
  );
}

function breakClosingTag(parent: HtmlTagNode) {
  // TODO Duplication
  return (
    parent.isInlineRenderMode &&
    parent.endNode != null &&
    parent.children.length > 0 &&
    parent.children[parent.children.length - 1].isInlineRenderMode &&
    !parent.children[parent.children.length - 1].hasTrailingSpaces
  );
}

/*
 * Inline content should fill as much horizontal space as possible.
 * In contrast, block content should break uniformly.
 * <p>foo <strong>baz</strong> bar bar </p>
 * should break like
 * <p>
 *   foo <strong>baz</strong>
 *   bar bar
 * </p>
 * and not like
 * <p>
 *   foo
 *   <strong>baz</strong>
 *   bar
 *   bar
 * </p>
 * This is achieved by pushing the linebreaks inside the children group and instead of next to it:
 * [
 *   group(fill("<span>Hello,World!</span>"))
 *   group([
 *     line,
 *     group([
 *       group(fill("<span>")),
 *       group(fill("Hello, World!")
 *     ])
 *   ])
 * ]
 * vs
 * [
 *   group(fill("<span>Hello,World!</span>")),
 *   line,
 *   group([
 *     group(fill("<span>")),
 *     group(fill("Hello, World!")
 *   ])
 * ]
 *
 *
 * This is loosely based on https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace
 */
function printChildren(
  path: FastPath<ParserNode>,
  options: unknown,
  print: (path: FastPath) => Doc
): Doc[] {
  return path.map((childPath, childIndex) => {
    const childNode = childPath.getValue();
    const parts: Doc[] = [];
    const childParts = print(childPath);

    const parent = childNode.parent;
    if (parent == null) {
      throw new Error("parent cannot be null inside printChildren");
    }
    if (
      childNode.isFirstChild &&
      parent instanceof HtmlTagNode &&
      breakOpeningTag(parent)
    ) {
      parts.push(">", decorateEnd(parent.startNode));
    }

    if (childNode.isOnlyChild) {
      const isParentInlineRenderingMode = parent.isInlineRenderMode;
      /**
       * TODO Kommentar stimmt nicht mehr.
       * Preserve whitespace from input, but don't use linebreaks.
       * Children are enclosed by line breaks in concatChildren()
       */
      if (isParentInlineRenderingMode && childNode.hasLeadingSpaces) {
        parts.push(ifBreak("", " "));
      }
      parts.push(childParts);
      // Ensure forceBreak, even if there is no next node.
      if (childNode.forceBreak) {
        parts.push(breakParent);
      }
      if (isParentInlineRenderingMode && childNode.hasTrailingSpaces) {
        parts.push(ifBreak("", " "));
      }
    } else {
      /**
       * Look at previous node to determine if line break is needed before child content.
       */
      if (childNode.prev != null) {
        const prev = childNode.prev;
        let lineBreak: Doc = "";

        if (prev.isPreformatted || prev.forceBreak) {
          // At least one hardline after preformatted text
          lineBreak = calculateDifferenceBetweenChildren(
            prev,
            childNode,
            hardline
          );
        } else if (prev.isInlineRenderMode && childNode.isInlineRenderMode) {
          // In inline mode, use line instead of softline to seperate content.
          lineBreak = childNode.hasLeadingSpaces
            ? calculateDifferenceBetweenChildren(prev, childNode, line)
            : /**
               * Allow the formatter insert a line break before the next tag:
               * <span> inline </span><span> inline </span> <span> inline </span>
               * <span> inline </span>
               * Instead of having to break the whole tag:
               * <span> inline </span><span> inline </span> <span>
               *  inline
               * </span> <span> inline </span>
               */
              // ifBreak(softline, "");
              "";
        }
        parts.push(group(concat([lineBreak, childParts])));
      } else {
        // Block Mode requires no linebreak, because there will be a linebreak at the end of the prev
        parts.push(childParts);
      }

      // Ensure forceBreak, even if there is no next node.
      if (childNode.forceBreak && childNode.next == null) {
        parts.push(breakParent);
      }

      /**
       * Look at next node to determine if line break is needed after child content.
       */
      // Preformatted and force break is handled in prev check of next node.
      if (
        childNode.next != null &&
        !(childNode.isPreformatted || childNode.forceBreak)
      ) {
        const next = childNode.next;
        if (
          next.isInlineRenderMode &&
          !childNode.isInlineRenderMode &&
          childNode.hasTrailingSpaces
        ) {
          parts[parts.length - 1] = group(
            concat([
              parts[parts.length - 1],
              // In inline mode, use line instead of softline to seperate content.
              calculateDifferenceBetweenChildren(childNode, next, line),
            ])
          );
        } else if (next.isBlockRenderMode) {
          parts.push(
            calculateDifferenceBetweenChildren(childNode, next, softline)
          );
        }
      }
    }

    const isLastChild = childNode.index == parent.children.length - 1;

    if (
      isLastChild &&
      parent instanceof HtmlTagNode &&
      breakClosingTag(parent)
    ) {
      parts.push(
        decorateStart(childNode.parent?.endNode),
        `</${parent.tagName}`
      );
    }

    return concat(parts);
  }, "children");
}

export default function print(
  path: FastPath<ParserNode>,
  options: unknown,
  print: (path: FastPath) => Doc
): Doc {
  const node: ParserNode = path.getValue();

  if (node instanceof RootNode) {
    return concat(printChildren(path, options, print));
  } else if (node instanceof HtmlTagNode) {
    return group(
      concat([
        printOpeningTag(node, path, print),
        node.children.length > 0
          ? concatChildren(node, printChildren(path, options, print))
          : "",
        printClosingTag(node),
      ])
    );
  } else if (node instanceof AttributeNode) {
    if (node.value != null) {
      if (node.name === "class") {
        const classNames = node.value.trim().split(/\s+/);
        return concat([
          group(
            concat([
              'class="',
              indent(concat([softline, join(line, classNames)])),
              softline,
              '"',
            ])
          ),
        ]);
      } else {
        return concat([`${node.name}="${escapeDoubleQuote(node.value)}"`]);
      }
    } else {
      return concat([node.name]);
    }
  } else if (node instanceof HtmlTextNode) {
    if (node.isSelfOrParentPreformatted) {
      const textLines = node.text.split("\n");
      const parts: Doc[] = [];
      textLines.forEach((textLine, index) => {
        parts.push(textLine);
        if (index < textLines.length - 1) {
          parts.push(literalline, breakParent);
        }
      });
      return decorate(concat([dedentToRoot(softline), fill(parts)]), node);
    } else {
      const words = node.text.trim().split(/\s+/);
      const parts: Doc[] = [];
      words.forEach((word, index) => {
        parts.push(word);
        if (index < words.length - 1) {
          parts.push(line);
        }
      });
      return decorate(fill(parts), node);
    }
  } else if (node instanceof HtmlCommentNode) {
    return decorate([node.text], node);
  } else if (node instanceof HtmlDocTypeNode) {
    // Lowercase root element
    const types = node.types
      .map((type, index) => (index == 0 ? type.toLowerCase() : type))
      .join(" ");
    return decorate(
      group(concat([group(concat([`<!DOCTYPE ${types}`])), ">"])),
      node
    );
  } else if (node instanceof IeConditionalCommentNode) {
    const el: Doc[] = [decorate(node.text, node.startNode)];

    if (node.children.length > 0) {
      const printedChildren = printChildren(path, options, print);

      el.push(concatChildren(node, printedChildren));
    }

    el.push(decorate(`<![endif]-->`, node.endNode));
    return group(concat(el));
  } else if (node instanceof HtmlCdataNode) {
    return decorate([node.text], node);
  } else if (node instanceof HtmlCloseNode) {
    return concat([
      node.children.length > 0
        ? concatChildren(node, printChildren(path, options, print))
        : "",
      breakParent,
      // Children are always preceeded by softline to make indent work.
      node.isFirstChild && node.children.length == 0 ? softline : "",
      `</${node.tagName}>`,
    ]);
  } else {
    throw new Error("Unknown type " + node.constructor.toString());
  }
}
