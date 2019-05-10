import Tip from "./ui/tip";
import Confirm from "./ui/confirm";
import Alert from "./ui/alert";
import Popbox from "./ui/popbox";
import LoadingUI from "./ui/loading";

interface LoadingInterFace {
  instance: any,
  show: () => void,
  hide: () => void
}

const Loading: LoadingInterFace = {
  instance: null,
  show() {
    if (this.instance) {
      this.instance.visible = true;
      return;
    }
    this.instance = LoadingUI();
  },
  hide() {
    if (this.instance) {
      this.instance.visible = false;
    }
  }
};
export default {
  Tip,
  Confirm,
  Alert,
  Popbox,
  Loading
};
