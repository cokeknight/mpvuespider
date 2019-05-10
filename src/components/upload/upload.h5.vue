<template>
  <div :class="classStr">
    <p class="t-center">
      从相册选一张
    </p>
    <label class="uploadbox" :for="name"> <input :id="id || name" v-track="{name: trackName + '_upload'}" type="file" :name="name" :accept="accept"
                                                 :multiple="multiple" @click="fileInputClick" @change="fileInputChange"
                                          />
      <slot></slot>
    </label>
    <button v-if="!autoUpload" type="button" @click="fileUpload">
      上传
    </button>
  </div>
</template>
<style lang="scss">
</style>

<script>
import lrz from 'src/lib/localResizeIMG/lrz.all';

export default {
  props: {
    classStr: String,
    autoUpload: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      required: true
    },
    id: String,
    action: {
      type: String,
      required: true
    },
    accept: {
      type: String,
      default: 'image/jpg, image/png, image/jpeg'
    },
    multiple: String,
    headers: Object,
    trackName: String
  },
  data: function() {
    return {
      myFiles: []
    };
  },
  methods: {
    fileInputClick: function() {
      // 选择图片对话框出来
      this.$emit('onFileClick', this.myFiles);
    },
    fileInputChange: function() {
      // 图片变更
      var ident = this.id || this.name;
      this.myFiles = document.getElementById(ident).files;

      if (this.autoUpload) {
        this.fileUpload();
      } else {
        this.$emit('onFileChange', this.myFiles);
      }
    },
    _onProgress: function(e) {
      // XHR 实现的上传 百分比
      e.percent = (e.loaded / e.total) * 100;
      this.$emit('onFileProgress', e);
    },

    _handleUpload: function(file) {
      let self = this;

      self.$emit('beforeFileUpload', file);

      return lrz(file)
        .then(function(rst) {
          return upload.call(self, rst);
        });

      function upload(rst) {
        var form = rst.formData;
        form.set('avatar', form.get('file'));
        form.delete('file');
        var xhr = new window.XMLHttpRequest();

        return new Promise(function(resolve, reject) {
          xhr.upload.addEventListener('progress', this._onProgress, false);
          xhr.onreadystatechange = function() {
            if (xhr.readyState < 4) {
              return;
            }
            if (xhr.status < 400) {
              var res = JSON.parse(xhr.responseText);
              this.$emit('onFileUpload', file, res);
              resolve(file);
            } else {
              var err = JSON.parse(xhr.responseText);
              err.status = xhr.status;
              err.statusText = xhr.statusText;
              this.$emit('onFileError', file, err);
              reject(err);
            }
          }.bind(this);

          xhr.onerror = function() {
            var err = JSON.parse(xhr.responseText);
            err.status = xhr.status;
            err.statusText = xhr.statusText;
            this.$emit('onFileError', file, err);
            reject(err);
          }.bind(this);

          xhr.open('POST', this.action, true);
          if (this.headers) {
            for (var header in this.headers) {
              xhr.setRequestHeader(header, this.headers[header]);
            }
          }
          xhr.send(form);
          this.$emit('afterFileUpload', file);
        }.bind(this));
      }
    },
    fileUpload: function() {

      const tempFilesSize = this.myFiles[0].size;
      if (tempFilesSize > 1024 * 1024) {
        MP.Tip({
          msg: '图片超过1M，请选择其他图片'
        });
        return false;
      }

      if (this.myFiles.length > 0) {
        // 将files转化为数组
        var arrayOfPromises = Array.prototype.slice.call(this.myFiles, 0).map(function(file) {
          return this._handleUpload(file);
        }.bind(this));
        // 等待promise结束
        Promise.all(arrayOfPromises).then(function(allFiles) {
          this.$emit('onAllFilesUploaded', allFiles);
        }.bind(this)).catch(function(err) {
          this.$emit('onFileError', this.myFiles, err);
        }.bind(this));
      } else {
        // 未选择文件
        var err = new Error('请选择文件');
        this.$emit('onFileError', this.myFiles, err);
      }
    }
  }
};
</script>
