/**
 * @deprecated use Caret.getRelativePosition instead.
 */
export function getCaretCoordinates(element: HTMLInputElement | HTMLTextAreaElement, position: number, options: any): any;

export namespace Caret {
  interface Position {
    /**
     * position in pixel.
     */
    top: number;
    /**
     * position in pixel.
     */
    left: number;
    /**
     * if true the position is relative to the inner window size, if false the position is relative to itself.
     */
    absolute: boolean;
    /**
     * height in pixel.
     */
    height: number;
  }
  interface Point {
    /**
     * left postition.
     */
    left: number;
    /**
     * top postition.
     */
    top: number;
  }
  interface Options {
    /**
     * Enables debug Mode.
     */
    debug?: boolean;
    /**
     * usesSelection End Instead of selection Start.
     */
    useSelectionEnd?: boolean;
    /**
     * if true the left position gets caped if left >= element Width.
     */
    checkWidthOverflow?: boolean;
  }
  /**
   * Returns the Absolute (relative to the inner window size) position of the caret in the given element.
   * @param element Input (has to be type='text') or Text Area.
   */
  function getAbsolutePosition(element: HTMLInputElement | HTMLTextAreaElement): Position;
  /**
   * Returns the relative position of the caret in the given element.
   * @param element Input (has to be type='text') or Text Area.
   */
  function getRelativePosition(element: HTMLInputElement | HTMLTextAreaElement, options?: Options): Position;
  /**
   * set the top and left css stlye of the element based on the absolute posiotion of the caretElements caret,
   * @param offset offsets the postion.
   * @param detectBoundary offsets the position if the position would be outside the window.
   * @param returnOnly if true the element position wont be set.
   */
  function setElementPositionBasedOnCaret(
    element: HTMLElement,
    caretElement: HTMLInputElement | HTMLTextAreaElement,
    offset: Point,
    detectBoundary?: boolean,
    returnOnly?: boolean
  ): Point;
}
