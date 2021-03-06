import {Component, h, Prop} from '@stencil/core';

@Component({
  tag: 'app-expansion-panel',
  styleUrl: 'app-expansion-panel.scss',
})
export class AppExpansionPanel {
  container!: HTMLDivElement;

  @Prop()
  expander: boolean = true;

  @Prop({mutable: true})
  expanded: 'open' | 'close' = 'open';

  // Source animation: https://css-tricks.com/using-css-transitions-auto-dimensions/

  componentDidLoad() {
    if (this.expanded === 'close') {
      this.container.style.height = 0 + 'px';
    }
  }

  private toggle() {
    if (this.expanded === 'close') {
      this.expand();
    } else {
      this.collapse();
    }
  }

  private collapse() {
    if (!this.container) {
      return;
    }

    const sectionHeight: number = this.container.scrollHeight;
    const elementTransition = this.container.style.transition;
    this.container.style.transition = '';

    requestAnimationFrame(() => {
      this.container.style.height = sectionHeight + 'px';
      this.container.style.transition = elementTransition;

      requestAnimationFrame(() => {
        this.container.style.height = 0 + 'px';
      });
    });

    this.expanded = 'close';
  }

  private expand() {
    if (!this.container) {
      return;
    }

    const sectionHeight: number = this.container.scrollHeight;
    this.container.style.height = sectionHeight + 'px';

    this.container.addEventListener(
      'transitionend',
      () => {
        this.container.style.height = '';
      },
      {once: true}
    );

    this.expanded = 'open';
  }

  render() {
    return (
      <article class={this.expanded}>
        <ion-item button onClick={() => this.toggle()} class={this.expander ? undefined : 'hidden'}>
          <div>
            <slot name="title"></slot>
          </div>
          <ion-icon slot="start" src="/assets/icons/ionicons/chevron-down.svg"></ion-icon>
          <div slot="end">
            <slot name="info"></slot>
          </div>
        </ion-item>

        <div ref={(el) => (this.container = el as HTMLDivElement)}>
          <slot></slot>
        </div>
      </article>
    );
  }
}
