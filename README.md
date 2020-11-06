# Textarea Caret Position Typescript version

is a fork of [this](https://github.com/component/textarea-caret-position) repo, with new functions.

## Example

> Note: the package has only been tested in angular but should also work in vue, react or other frameworks.

```ts
import { Caret } from 'textarea-caret-ts';

@ViewChild('caretElement', { static: true }) caretElement: ElementRef<HTMLInputElement>;
@ViewChild('divElement', { static: false }) divElement: ElementRef<HTMLDivElement>;

ngAfterViewInit() {
  this.caretElement.nativeElement.addEventListener('keydown', event => {
    // gets the Relative position of the caret (the original function only slightly changed).
    Caret.getRelativePosition(this.caretElement.nativeElement)
    // gets the Absolute position of the caret (not in  the original package).
    Caret.getAbsolutePosition(this.caretElement.nativeElement)
    // sets the position of the div element based on the caret position (not in  the original package).
    Caret.setElementPositionBasedOnCaret(this.divElement.nativeElement, this.caretElement.nativeElement, { left: 10, top: 12 });
  });
```
