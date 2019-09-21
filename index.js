"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Caret;
(function (Caret) {
    /**
     * Returns the Absolute (relative to the inner window size) position of the caret in the given element.
     * @param element Input (has to be type='text') or Text Area.
     */
    function getAbsolutePosition(element) {
        var caretRelPost = getRelativePosition(element);
        return {
            left: window.scrollX + element.getBoundingClientRect().left + caretRelPost.left,
            top: window.scrollY + element.getBoundingClientRect().top + caretRelPost.top,
            absolute: true,
            height: caretRelPost.height
        };
    }
    Caret.getAbsolutePosition = getAbsolutePosition;
    /**
     * Returns the relative position of the caret in the given element.
     * @param element Input (has to be type='text') or Text Area.
     */
    function getRelativePosition(element, options) {
        if (options === void 0) { options = { debug: false, useSelectionEnd: false, checkWidthOverflow: true }; }
        var selectionStart = element.selectionStart !== null ? element.selectionStart : 0;
        var selectionEnd = element.selectionEnd !== null ? element.selectionEnd : 0;
        var position = options.useSelectionEnd ? selectionEnd : selectionStart;
        // We'll copy the properties below into the mirror div.
        // Note that some browsers, such as Firefox, do not concatenate properties
        // into their shorthand (e.g. padding-top, padding-bottom etc. -> padding),
        // so we have to list every single property explicitly.
        var properties = [
            'direction',
            'boxSizing',
            'width',
            'height',
            'overflowX',
            'overflowY',
            'borderTopWidth',
            'borderRightWidth',
            'borderBottomWidth',
            'borderLeftWidth',
            'borderStyle',
            'paddingTop',
            'paddingRight',
            'paddingBottom',
            'paddingLeft',
            // https://developer.mozilla.org/en-US/docs/Web/CSS/font
            'fontStyle',
            'fontVariant',
            'fontWeight',
            'fontStretch',
            'fontSize',
            'fontSizeAdjust',
            'lineHeight',
            'fontFamily',
            'textAlign',
            'textTransform',
            'textIndent',
            'textDecoration',
            'letterSpacing',
            'wordSpacing',
            'tabSize',
            'MozTabSize'
        ];
        // Firefox 1.0+
        var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        var isBrowser = typeof window !== 'undefined';
        if (!isBrowser) {
            throw new Error('textarea-caret-position#getCaretPosition should only be called in a browser');
        }
        var debug = (options && options.debug) || false;
        if (debug) {
            var el = document.querySelector('#input-textarea-caret-position-mirror-div');
            if (el && el.parentNode)
                el.parentNode.removeChild(el);
        }
        // The mirror div will replicate the textareas style
        var div = document.createElement('div');
        div.id = 'input-textarea-caret-position-mirror-div';
        document.body.appendChild(div);
        var style = div.style;
        // @ts-ignore
        var computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle; // currentStyle for IE < 9
        var isInput = element.nodeName === 'INPUT';
        // Default textarea styles
        style.whiteSpace = 'pre-wrap';
        if (!isInput)
            style.wordWrap = 'break-word'; // only for textarea-s
        // Position off-screen
        style.position = 'absolute'; // required to return coordinates properly
        if (!debug)
            style.visibility = 'hidden'; // not 'display: none' because we want rendering
        // Transfer the element's properties to the div
        properties.forEach(function (prop) {
            if (isInput && prop === 'lineHeight') {
                // Special case for <input>s because text is rendered centered and line height may be != height
                if (computed.boxSizing === 'border-box') {
                    var height = parseInt(computed.height);
                    var outerHeight_1 = parseInt(computed.paddingTop) +
                        parseInt(computed.paddingBottom) +
                        parseInt(computed.borderTopWidth) +
                        parseInt(computed.borderBottomWidth);
                    var targetHeight = outerHeight_1 + parseInt(computed.lineHeight);
                    if (height > targetHeight) {
                        style.lineHeight = height - outerHeight_1 + 'px';
                    }
                    else if (height === targetHeight) {
                        style.lineHeight = computed.lineHeight;
                    }
                    else {
                        style.lineHeight = '0';
                    }
                }
                else {
                    style.lineHeight = computed.height;
                }
            }
            else {
                //@ts-ignore
                style[prop] = computed[prop];
            }
        });
        if (isFirefox) {
            // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
            if (element.scrollHeight > parseInt(computed.height))
                style.overflowY = 'scroll';
        }
        else {
            style.overflow = 'hidden'; // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
        }
        div.textContent = element.value.substring(0, position);
        // The second special handling for input type="text" vs textarea:
        // spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
        if (isInput && div.textContent)
            div.textContent = div.textContent.replace(/\s/g, '\u00a0');
        var span = document.createElement('span');
        // Wrapping must be replicated *exactly*, including when a long word gets
        // onto the next line, with whitespace at the end of the line before (#7).
        // The  *only* reliable way to do that is to copy the *entire* rest of the
        // textareas content into the <span> created at the caret position.
        // For inputs, just '.' would be enough, but no need to bother.
        span.textContent = element.value.substring(position) || '.'; // || because a completely empty faux span doesn't render at all
        div.appendChild(span);
        var relativePosition = {
            top: span.offsetTop + parseInt(computed['borderTopWidth']),
            left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
            absolute: false,
            height: parseInt(computed['lineHeight'])
        };
        if (debug) {
            span.style.backgroundColor = '#aaa';
        }
        else {
            document.body.removeChild(div);
        }
        if (relativePosition.left >= element.clientWidth && options.checkWidthOverflow) {
            relativePosition.left = element.clientWidth;
        }
        return relativePosition;
    }
    Caret.getRelativePosition = getRelativePosition;
    /**
     * sets the top and left css style of the element based on the absolute position of the caretElements caret,
     * @param offset offsets the position.
     * @param detectBoundary offsets the position if the position would be outside the window.
     * @param returnOnly if true the element position wont be set.
     */
    function setElementPositionBasedOnCaret(element, caretElement, offset, margin, detectBoundary, returnOnly) {
        if (offset === void 0) { offset = { top: 0, left: 0 }; }
        if (margin === void 0) { margin = 2; }
        if (detectBoundary === void 0) { detectBoundary = true; }
        if (returnOnly === void 0) { returnOnly = false; }
        var pos = getAbsolutePosition(caretElement);
        if (detectBoundary) {
            pos.left =
                pos.left + (element.clientWidth + margin) + offset.left > window.scrollX + window.innerWidth
                    ? (pos.left = window.scrollX + window.innerWidth - (element.clientWidth + margin))
                    : (pos.left += offset.left);
            pos.top =
                pos.top + (element.clientWidth + margin) + offset.top > window.scrollY + window.innerHeight
                    ? (pos.top -= element.clientWidth + margin)
                    : (pos.top += offset.top);
        }
        else {
            pos.top += offset.top;
            pos.left += offset.left;
        }
        if (!returnOnly) {
            element.style.top = pos.top + 'px';
            element.style.left = pos.left + 'px';
        }
        return pos;
    }
    Caret.setElementPositionBasedOnCaret = setElementPositionBasedOnCaret;
})(Caret = exports.Caret || (exports.Caret = {}));
/**
 * @deprecated use Caret.getRelativePosition instead.
 */
exports.getCaretCoordinates = function (element, position, options) {
    if (options === void 0) { options = { debug: false }; }
    return Caret.getRelativePosition(element, options);
};
