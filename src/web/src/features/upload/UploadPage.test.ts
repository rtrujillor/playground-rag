import { createPinia } from 'pinia';
import { mount, flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UploadPage from './UploadPage.vue';
import { uploadFiles } from '../../shared/api/upload';

vi.mock('../../shared/api/upload', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../shared/api/upload')>()),
  uploadFiles: vi.fn(async (files: File[]) =>
    files.map((file) => ({
      id: file.name,
      name: file.name,
      size: file.size,
      status: 'uploaded',
      message: 'Done',
    })),
  ),
}));
function setup(pinia = createPinia()) {
  const wrapper = mount(UploadPage, {
    global: {
      plugins: [pinia],
      stubs: {
        VBtn: { template: '<button><slot /></button>' },
        VContainer: { template: '<div><slot /></div>' },
        VSheet: { template: '<section><slot /></section>' },
      },
    },
  });
  async function select(files: File[]) {
    const input = wrapper.get('input[type="file"]');
    Object.defineProperty(input.element, 'files', {
      configurable: true,
      value: files,
    });
    await input.trigger('change');
  }
  return { wrapper, select };
}
beforeEach(() => vi.clearAllMocks());
describe('upload queue', () => {
  it('retains files and removal when navigating away and returning', async () => {
    const pinia = createPinia();
    const first = setup(pinia);
    const file = new File(['abc'], 'retained.txt');
    await first.select([file]);
    first.wrapper.unmount();
    const second = setup(pinia);
    expect(second.wrapper.text()).toContain('retained.txt');
    expect(second.wrapper.text()).toContain('Total size: 3 B');
    await second.select([new File(['x'], 'added.txt')]);
    expect(second.wrapper.findAll('li')).toHaveLength(2);
    await second.wrapper
      .get('button[aria-label="Remove retained.txt"]')
      .trigger('click');
    second.wrapper.unmount();
    const third = setup(pinia);
    expect(third.wrapper.findAll('li')).toHaveLength(1);
    expect(third.wrapper.text()).not.toContain('retained.txt');
    await third.wrapper
      .findAll('button')
      .find((button) => button.text() === 'Submit files')
      ?.trigger('click');
    await flushPromises();
    expect(vi.mocked(uploadFiles).mock.calls[0]?.[0][0]?.name).toBe(
      'added.txt',
    );
  });
  it('aggregates selections, ignores duplicates, and allows removal and reselection', async () => {
    const { wrapper, select } = setup();
    const first = new File(['abc'], 'first.txt', { lastModified: 1 });
    const second = new File(['hello'], 'second.md', { lastModified: 2 });
    await select([first, second]);
    await select([new File(['x'], 'third.pdf')]);
    await select([first]);
    await select([]);
    expect(wrapper.findAll('li')).toHaveLength(3);
    expect(wrapper.text()).toContain('Total size: 9 B');
    expect(wrapper.findAll('li')[0]?.text()).toContain('3 B');
    await wrapper.get('button[aria-label="Remove first.txt"]').trigger('click');
    expect(wrapper.findAll('li')).toHaveLength(2);
    expect(wrapper.text()).toContain('Total size: 6 B');
    await select([first]);
    expect(wrapper.findAll('li')).toHaveLength(3);
  });
  it('submits retained valid files only, including distinct files with the same name', async () => {
    const { wrapper, select } = setup();
    const first = new File(['a'], 'same.txt', { lastModified: 1 });
    const second = new File(['bb'], 'same.txt', { lastModified: 2 });
    await select([
      first,
      second,
      new File(['x'], 'bad.exe'),
      new File(['x'], 'remove.txt'),
    ]);
    expect(wrapper.text()).toContain('Unsupported file type');
    await wrapper
      .get('button[aria-label="Remove remove.txt"]')
      .trigger('click');
    const submit = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Submit files');
    await submit?.trigger('click');
    await flushPromises();
    expect(vi.mocked(uploadFiles).mock.calls.map((call) => call[0][0])).toEqual(
      [first, second],
    );
    expect(
      wrapper.findAll('li').filter((row) => row.text().includes('uploaded')),
    ).toHaveLength(2);
  });
  it('shows the empty state after removing the last file', async () => {
    const { wrapper, select } = setup();
    await select([new File(['x'], 'only.txt')]);
    await wrapper.get('button[aria-label="Remove only.txt"]').trigger('click');
    expect(wrapper.text()).toContain('No files selected yet.');
    expect(wrapper.text()).not.toContain('Submit files');
  });
});
