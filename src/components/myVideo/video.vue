<style lang="less">
  .wx-video, .video-img-wrap, .video-img, .video-js {
    width: 100%;
    height: 211px;
  }

  .video-img-wrap {
    position: relative;

    .video-play {
      position: absolute;
      width: 57px;
      height: 57px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .h5-video{
    line-height: 0;
    .video-js{
      height: auto;
    }
  }
</style>
<template>
  <div>
    <div v-if="!mpvuePlatform" class="wx-video">
      <video class="wx-video" :src="url" custom-cache="false" :poster="imgUrl" objectFit="fill"></video>
    </div>
    <div v-if="mpvuePlatform" class="h5-video">
      <div v-if="!show" class="video-img-wrap" @click="videoPlay">
        <img :src="imgUrl" class="video-img" /> <img :src="ImgUrl+'bg-play.png'" class="video-play" />
      </div>
      <video
        v-if="show"
        ref="myVideo"
        class="video-js"
        :src="url"
        autoplay="true"
        controls
        preload="auto"
        webkit-playsinline="true"
        playsinline="true"
      />
    </div>
  </div>
</template>
<script>
import config from 'src/config';

export default {
  components: {},
  props: {
    url: String,
    imgUrl: String
  },
  data() {
    return {
      mpvuePlatform: mpvuePlatform === 'h5',
      show: false,
      ImgUrl: config.imgUrl
    };
  },
  methods: {
    videoPlay() {
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
        if (config.server === 'wx') {
          this.$nextTick(() => {
            this.$refs.myVideo.play()
          })
        }
      });
    }
  }
};
</script>
