
import {assert} from 'chai';
import domEvents from 'dom-events';
import td from 'testdouble';

import {ADComponent} from '../../../packages/base/component';

class FakeComponent extends ADComponent {
  get root() {
    return this.root_;
  }

  init(...args) {
    this.initializeArgs = args;
    this.initializeComesBeforeFoundation = !this.foundation_;
  }

  initialSyncWithDOM() {
    this.synced = true;
  }
}

suite('ADComponent');

test('Provides a static attachTo() method that returns a basic instance with the specified root', () => {
  const root = document.createElement('div');
  const b = ADComponent.attachTo(root);
  assert.isOk(b instanceof ADComponent);
});
