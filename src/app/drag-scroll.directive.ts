import { DOCUMENT } from "@angular/common";
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Renderer2,
} from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Directive({
  selector: '[appDragScroll]',
  standalone: true
})
export class DragScrollDirective implements AfterViewInit, OnDestroy {

  private element !: HTMLCanvasElement;
  private subscriptions: Subscription[] = [];

  private readonly DEFAULT_DRAGGING_BOUNDARY_QUERY = "body";
  @Input() boundaryQuery = this.DEFAULT_DRAGGING_BOUNDARY_QUERY;

  constructor(
    @Inject(ElementRef) private elementRef: ElementRef,
    @Inject(Renderer2) private renderer: Renderer2,
    @Inject(DOCUMENT) private document: any
  ) { }

  ngAfterViewInit(): void {
    this.element = this.elementRef.nativeElement as HTMLCanvasElement;
    this.onLoad();
  }

  @HostListener('window:resize')
  onResize() {
    this.ngOnDestroy();
    this.initDrag();
  }


  @HostListener('load')
  onLoad() {
    this.initDrag();
  }

  @Input() set reset(realSize: boolean | null) {
    if (!this.element) {
      return;
    }
    realSize && this.renderer.setStyle(this.element, "object-position", "center center");
  }

  initDrag(): void {
    const touchSupported = 'ontouchstart' in window;
    if (touchSupported) {
      return;
    }
    const dragStart$ = fromEvent<any>(this.element, "mousedown", { passive: true });
    const dragEnd$ = fromEvent<any>(this.document, "mouseup", { passive: true });
    const drag$ = fromEvent<any>(this.document, "mousemove", { passive: true }).pipe(
      takeUntil(dragEnd$)
    );


    let initialX: number,
      currentX = 0;


    const parent = this.element.parentElement,
      maxX = -(this.element.clientWidth - (window.document.body.clientWidth || 0));

    let dragSub !: Subscription;

    const getClientX = (event: any) => {
      if (event instanceof MouseEvent) {
        event.stopPropagation();
        return event.clientX;
      }
      return event.touches[0].clientX;
    }

    const dragStartSub = dragStart$.subscribe((event: MouseEvent) => {

      initialX = getClientX(event) - currentX;
      this.renderer.addClass(this.element, "dragging");

      dragSub = drag$.subscribe((event: any) => {
        const x = Math.min(0, Math.max(getClientX(event) - initialX, maxX));
        currentX = x;
        return this.renderer.setStyle(this.element, "object-position", `${x}px center`);
      });
    });

    const dragEndSub = dragEnd$.subscribe((event: any) => {
      initialX = currentX;
      this.renderer.removeClass(this.element, "dragging");
      if (dragSub) {
        dragSub.unsubscribe();
      }
    });

    this.subscriptions.push.apply(this.subscriptions, [
      dragStartSub,
      dragSub,
      dragEndSub,
    ]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s?.unsubscribe());
  }


}
