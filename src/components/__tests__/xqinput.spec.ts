import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import xqInput from '@/components/xqInput.vue'; // Adjust the path to your component


// Mock the store if needed
const mockAddQuestion = vi.fn();
const mockChangeStopState = vi.fn();
// interface MediaFile {
//     name: string;
//     url: string;
//     file: File;
// }
vi.mock('@/stores/aiAnswer', () => {
  return {
    useAiStore: () => ({
      addQuestion: mockAddQuestion,
      changeStopState: mockChangeStopState,
      useStopComp: false,
    }),
  };
});

describe('xqInputComponent', () => {
  let wrapper: any;
  const createFile = (name: string, size: number, type: string) => {
    const blob = new Blob([new Uint8Array(size)], { type });
    return new File([blob], name, { type });
  };
  beforeEach(() => {
    global.URL.createObjectURL = vi.fn().mockReturnValue('mocked-url');
    global.URL.revokeObjectURL = vi.fn();

    wrapper = mount(xqInput);
  });

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks(); // Clear mocks after each test
  });

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('handles input changes correctly', async () => {
    const textarea = wrapper.find('textarea');
    await textarea.setValue('Hello, world!');
    expect(textarea.element.value).toBe('Hello, world!');
  });

  it('uploads files correctly', async () => {
    const fileInput = wrapper.find('input[type="file"]');
    const file = new File(['file content'], 'test.png', { type: 'image/png' });

    // Simulate file upload
    Object.defineProperty(fileInput.element, 'files', {
      value: [file],
      writable: false, // Make it readonly to mimic browser behavior
    });

    await fileInput.trigger('change'); // Simulate change event

    expect(wrapper.vm.mediaFiles).toHaveLength(1);
    expect(wrapper.vm.mediaFiles[0].name).toBe('test.png');
  });

  it('removes files correctly', async () => {
    const fileInput = wrapper.find('input[type="file"]');
    const file = new File(['file content'], 'test.png', { type: 'image/png' });

    // Upload the file first
    Object.defineProperty(fileInput.element, 'files', {
      value: [file],
      writable: false,
    });
    await fileInput.trigger('change'); // Simulate change event

    expect(wrapper.vm.mediaFiles).toHaveLength(1);

    // Find the remove button (ensure you use the right selector for the button)
    const removeButton = wrapper.find('button'); // Ensure this targets the correct button
    await removeButton.trigger('click');

    expect(wrapper.vm.mediaFiles).toHaveLength(0);
  });
  it('should upload images correctly under size and count limits', async () => {
    const fileInput = wrapper.find('input[type="file"]');
    const upload = vi.spyOn(wrapper.vm, "handleFileUpload");


    // 创建一个4MB的有效文件
    const validFile = createFile('validFile.png', 4 * 1024 * 1024, 'image/png');



    // 模拟上传文件
    Object.defineProperty(fileInput.element, 'files', {
      value: [validFile],
      writable: false,
    });
    await wrapper.vm.handleFileUpload({ target: { files: fileInput.element.files } }); // 触发 change 事件
    expect(upload).toBeCalledTimes(1);
    expect(wrapper.vm.isImage({ type: 'image/png' } as File)).toBe(true);
    expect(wrapper.find('img').exists()).toBe(true);
    expect(wrapper.vm.mediaFiles).toHaveLength(1);


  });
  it('should upload file correctly under size and count limits', async () => {
    const fileInput = wrapper.find('input[type="file"]');
    const upload = vi.spyOn(wrapper.vm, "handleFileUpload");


    // 创建一个4MB的有效文件
    const validFile = createFile('validFile.png', 4 * 1024 * 1024, 'image/md');



    // 模拟上传文件
    Object.defineProperty(fileInput.element, 'files', {
      value: [validFile],
      writable: false,
    });
    await wrapper.vm.handleFileUpload({ target: { files: fileInput.element.files } }); // 触发 change 事件
    expect(upload).toBeCalledTimes(1);
    expect(wrapper.vm.isImage({ type: 'image/md' } as File)).toBe(false);
    expect(wrapper.find('img').exists()).toBe(false);
    expect(wrapper.vm.mediaFiles).toHaveLength(1);


  });

  it('should not upload files exceeding size limit', async () => {
    const fileInput = wrapper.find('input[type="file"]');
    const largeFile = createFile('validFile.png', 6 * 1024 * 1024, 'image/png'); // 6MB

    // 模拟上传文件
    Object.defineProperty(fileInput.element, 'files', {
      value: [largeFile],
      writable: false,
    });
    await fileInput.trigger('change'); // 触发 change 事件

    expect(wrapper.vm.mediaFiles).toHaveLength(0); // 应该不允许上传

  });

  it('should not upload more than 5 files', async () => {
    const fileInput = wrapper.find('input[type="file"]');
    // 模拟上传超过5个文件
    const files = [];
    for (let i = 0; i < 6; i++) {


      files.push(createFile('validFile.png', 3 * 1024 * 1024, 'image/png')); // 4MB


    }
    Object.defineProperty(fileInput.element, 'files', {
      value: files,
      writable: false,
    });
    await fileInput.trigger('change'); // 触发 change 事件]
    // await wrapper.vm.$nextTick();
    expect(wrapper.vm.mediaFiles).toHaveLength(5);
     
    expect(wrapper.vm.fileInputRef.value).toBe("");
        
  });
});