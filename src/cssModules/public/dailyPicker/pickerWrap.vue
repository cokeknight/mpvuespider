<!--2017-3-7删除了 接收外面要求关闭弹框的事件 可在父组件中修改show来改变sheet状态-->
<template>
  <div class="picker-column-wrap">
    <PickerColumn v-for="item in columns" :key="item.id" :list="item.values" :item-height="45"
                  :visible-item-count="3" @change="onChange"
    ></PickerColumn>
  </div>
</template>

<script>
import PickerColumn from './PickerColumn'
export default {
  name: 'CityPicker',
  components:{
    PickerColumn
  },
  props: {
    columns: Array,
    itemHeight: {
      type: Number,
      default: 10
    },
    visibleItemCount: Number
  },
  data() {
    return {
      children: []
    };
  },
  computed: {
    simple() {
      return this.columns.length && !this.columns[0].values;
    }
  },

  watch: {
    columns() {
      this.setColumns();
    }
  },

  methods: {
    setColumns() {
      const columns = this.simple ? [{ values: this.columns }] : this.columns;
      columns.forEach((column, index) => {
        const copy = JSON.parse(JSON.stringify(column.values))
        this.setColumnValues(index, copy);
      });
    },

    emit(event) {
      if (this.simple) {
        this.$emit(event, this.getColumnValue(0), this.getColumnIndex(0));
      } else {
        this.$emit(event, this.getValues(), this.getIndexes());
      }
    },

    onChange(columnIndex) {
      if (this.simple) {
        this.$emit(
          'change',
          this,
          this.getColumnValue(0),
          this.getColumnIndex(0)
        );
      } else {
        this.$emit('change', this, this.getValues(), columnIndex);
      }
    },

    // get column instance by index
    getColumn(index) {
      return this.children[index];
    },

    // get column value by index
    getColumnValue(index) {
      const column = this.getColumn(index);
      return column && column.getValue();
    },

    // set column value by index
    setColumnValue(index, value) {
      const column = this.getColumn(index);
      column && column.setValue(value);
    },

    // get column option index by column index
    getColumnIndex(columnIndex) {
      return (this.getColumn(columnIndex) || {}).currentIndex;
    },

    // set column option index by column index
    setColumnIndex(columnIndex, optionIndex) {
      const column = this.getColumn(columnIndex);
      column && column.setIndex(optionIndex);
    },

    // get options of column by index
    getColumnValues(index) {
      return (this.children[index] || {}).options;
    },

    // set options of column by index
    setColumnValues(index, options) {
      const column = this.children[index];
      if (
        column &&
        JSON.stringify(column.options) !== JSON.stringify(options)
      ) {
        column.options = options;
        column.setIndex(0);
      }
    },

    // get values of all columns
    getValues() {
      return this.children.map(child => child.getValue());
    },

    // set values of all columns
    setValues(values) {
      values.forEach((value, index) => {
        this.setColumnValue(index, value);
      });
    },

    // get indexes of all columns
    getIndexes() {
      return this.children.map(child => child.currentIndex);
    },

    // set indexes of all columns
    setIndexes(indexes) {
      indexes.forEach((optionIndex, columnIndex) => {
        this.setColumnIndex(columnIndex, optionIndex);
      });
    },

    onConfirm() {
      this.emit('confirm');
    },

    onCancel() {
      this.emit('cancel');
    }
  },
}
</script>
