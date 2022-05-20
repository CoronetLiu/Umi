import React, { useEffect, useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import styles from './index.less';

const RichEditor = () => {
  const [editor, setEditor] = useState(null);
  useEffect(() => {
    console.log('编辑器加载完毕');
  }, [editor]);

  const handleEditorChange = (e) => {
    console.log('Content was updated:', e.target.getContent());
  };
  return (
    <div className={styles.container}>
      <Editor
        apiKey={'wcrst7nyjfeiq184mpows243gcv6sokux5i1p0926qi1zb6t'}
        // initialValue="<p>......</p>"
        onChange={handleEditorChange}
        init={{
          height: 800, //高度
          language: 'zh_CN', //注意大小写
          placeholder: '　　当前页面无缓存功能，请不要在编辑时刷新，以免内容丢失。',
          inline: false, // 使用内联
          statusbar: false, // 禁用状态栏
          // branding: false, // logo
          // elementpath: false, //路径展示
          toolbar_mode: 'wrap', // 工具栏样式
          menubar: false,
          // menubar: 'file edit insert help',
          menu: {
            file: { title: 'File', items: 'code | preview | print ' },
            edit: {
              title: 'Edit',
              items: 'undo redo | cut copy paste | selectall | searchreplace',
            },
            insert: {
              title: 'Insert',
              items:
                'image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime',
            },
            help: { title: 'Help', items: 'help' },
          },
          plugins: [
            'advlist autolink lists link image',
            'charmap print preview anchor help',
            'searchreplace visualblocks code',
            'insertdatetime media table paste wordcount',
            'autosave preview fullscreen',
          ],
          toolbar:
            'undo redo | formatselect | fontselect | fontsizeselect |\
            forecolor backcolor |\
            bold italic underline strikethrough superscript subscript removeformat |\
            alignleft aligncenter alignright alignjustify |\
            ink image table charmap insertdatetime | bullist numlist outdent indent |\
            fullscreen preview print code | help',
          fontsize_formats: '12pt 14pt 16pt 18pt 24pt 36pt 48pt',
          font_formats:
            '微软雅黑=Microsoft YaHei;Arial=arial; Courier New=courier new;宋体=宋体;黑体=黑体',
          /* 图片上传*/
          image_title: true,
          automatic_uploads: true,
          file_picker_types: 'image',
          file_picker_callback: function (cb, value, meta) {
            let input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.onchange = function () {
              let file = this.files[0];
              let reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = function () {
                let id = 'blobid' + new Date().getTime();
                let blobCache = tinymce.activeEditor.editorUpload.blobCache;
                let base64 = reader.result.split(',')[1];
                let blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);
                cb(blobInfo.blobUri(), { title: file.name });
              };
            };
            input.click();
          },
          content_style:
            'body { font-family:宋体; font-size:14px} p {margin: 0px; border:0px ; padding: 0px; line-height:1.5; text-indent:2em;}',
          setup: function (ed) {
            ed.on('init', function () {
              ed.setContent('');
              setEditor(ed);
            });
          },
        }}
      />
    </div>
  );
};

export default RichEditor;
