import {
  Children,
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import './Hint.css';

const SHOW_DELAY_MS = 380;
const VIEW_PAD = 8;
const MAX_WIDTH = 280;

type HintChildProps = {
  disabled?: boolean;
  ref?: Ref<HTMLElement>;
  onPointerEnter?: (event: React.PointerEvent) => void;
  onPointerLeave?: (event: React.PointerEvent) => void;
  'aria-describedby'?: string;
};

function mergeRefs<T>(a?: Ref<T>, b?: Ref<T>) {
  return (node: T | null) => {
    if (typeof a === 'function') a(node);
    else if (a) (a as { current: T | null }).current = node;
    if (typeof b === 'function') b(node);
    else if (b) (b as { current: T | null }).current = node;
  };
}

function composeHandlers<E>(
  a?: (event: E) => void,
  b?: (event: E) => void,
) {
  return (event: E) => {
    a?.(event);
    b?.(event);
  };
}

function placeTooltip(anchorRect: DOMRect, tipRect: DOMRect) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(tipRect.width || MAX_WIDTH, vw - VIEW_PAD * 2);
  const height = tipRect.height || 0;
  let left = anchorRect.left + anchorRect.width / 2 - width / 2;
  left = Math.max(VIEW_PAD, Math.min(left, vw - width - VIEW_PAD));

  const belowTop = anchorRect.bottom + 8;
  const aboveTop = anchorRect.top - height - 8;
  const fitsBelow = belowTop + height <= vh - VIEW_PAD;
  const fitsAbove = aboveTop >= VIEW_PAD;
  const top = !fitsBelow && fitsAbove ? aboveTop : belowTop;

  return { left, top, width };
}

export default function Hint({
  text,
  children,
}: {
  text?: string;
  children: ReactNode;
}) {
  const child = Children.only(children) as ReactElement<HintChildProps>;
  const id = useId();
  const anchorRef = useRef<HTMLElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const showTimer = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);

  const clearTimer = useCallback(() => {
    if (showTimer.current) {
      window.clearTimeout(showTimer.current);
      showTimer.current = null;
    }
  }, []);

  const hide = useCallback(() => {
    clearTimer();
    setOpen(false);
    setCoords(null);
  }, [clearTimer]);

  const scheduleShow = useCallback(() => {
    if (!text) return;
    clearTimer();
    showTimer.current = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
  }, [clearTimer, text]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    const anchor = anchorRef.current;
    const tip = tipRef.current;
    if (anchor && tip) {
      setCoords(
        placeTooltip(anchor.getBoundingClientRect(), tip.getBoundingClientRect()),
      );
    }
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
    return () => {
      window.removeEventListener('scroll', hide, true);
      window.removeEventListener('resize', hide);
    };
  }, [open, text, hide]);

  if (!text) return child;

  const wrapDisabled = Boolean(child.props?.disabled);
  const describedBy =
    [child.props?.['aria-describedby'], open ? id : null]
      .filter(Boolean)
      .join(' ') || undefined;

  const extra = {
    onPointerEnter: composeHandlers(child.props.onPointerEnter, scheduleShow),
    onPointerLeave: composeHandlers(child.props.onPointerLeave, hide),
  };

  let trigger: ReactNode;
  if (wrapDisabled) {
    trigger = (
      <span
        className="hint-anchor"
        ref={(node) => {
          anchorRef.current = node;
        }}
        onPointerEnter={scheduleShow}
        onPointerLeave={hide}
      >
        {cloneElement(child, extra)}
      </span>
    );
  } else {
    trigger = cloneElement(child, {
      ...extra,
      ref: mergeRefs(child.props.ref, anchorRef),
      'aria-describedby': describedBy,
    });
  }

  return (
    <>
      {trigger}
      {open
        ? createPortal(
            <div
              ref={tipRef}
              id={id}
              role="tooltip"
              className="hint-bubble"
              style={{
                left: coords?.left ?? 0,
                top: coords?.top ?? 0,
                maxWidth: coords?.width ?? MAX_WIDTH,
                visibility: coords ? 'visible' : 'hidden',
              }}
            >
              {text}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
