import { mount } from '@vue/test-utils';
import { expect, it } from 'vitest';
import HomePage from './HomePage.vue';

it('identifies the playground without exposing unfinished workflows', () => {
  const wrapper = mount(HomePage, {
    global: {
      stubs: {
        VContainer: { template: '<div><slot /></div>' },
        VSheet: { template: '<section><slot /></section>' },
      },
    },
  });
  expect(wrapper.get('h1').text()).toBe('RAG Playground');
  expect(wrapper.findAll('input, button, form, a')).toHaveLength(0);
});
