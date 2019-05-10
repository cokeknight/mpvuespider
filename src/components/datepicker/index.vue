<template>
  <actionsheet
    v-model="isShowPop"
    :title="title"
    :icon-type="iconType"
  >
    <div class="cov-vue-date">
      <div class="datepicker-overlay">
        <div class="cov-date-body">
          <div class="cov-date-monthly">
            <div
              class="cov-date-previous"
              @click="nextMonth('pre')"
            >
              «
            </div>
            <div class="cov-date-caption">
              <span @click="showYear"><small>{{ checked.year }}</small></span> <br> <span @click="showMonth">{{ displayInfo.month }}</span>
            </div>
            <div
              class="cov-date-next"
              @click="nextMonth('next')"
            >
              »
            </div>
          </div>
          <div
            v-if="showInfo.day"
            class="cov-date-box"
          >
            <div class="cov-picker-box">
              <div class="week">
                <ul>
                  <li v-for="weekie in library.week">
                    {{ weekie }}
                  </li>
                </ul>
              </div>
              <div
                v-for="day in dayList"
                class="day"
                track-by="$index"
                :class="{'checked':day.checked,'unavailable':day.unavailable,'passive-day': !(day.inMonth)}"
                @click="checkDay(day)"
              >
                {{ day.value }}
              </div>
            </div>
          </div>
          <div
            v-if="showInfo.year"
            class="cov-date-box list-box"
          >
            <div
              id="yearList"
              class="cov-picker-box date-list"
            >
              <div
                v-for="yearItem in library.year"
                class="date-item"
                track-by="$index"
                @click="setYear(yearItem)"
              >
                {{ yearItem }}
              </div>
            </div>
          </div>
          <div
            v-if="showInfo.month"
            class="cov-date-box list-box"
          >
            <div class="cov-picker-box date-list">
              <div
                v-for="monthItem in library.month"
                class="date-item"
                track-by="$index"
                @click="setMonth(monthItem)"
              >
                {{ monthItem }}
              </div>
            </div>
          </div>
          <div
            v-if="showInfo.hour"
            class="cov-date-box list-box"
          >
            <div class="cov-picker-box date-list">
              <div class="watch-box">
                <div class="hour-box">
                  <div class="mui-pciker-rule mui-pciker-rule-ft" />
                  <ul>
                    <li
                      v-for="hitem in hours"
                      class="hour-item"
                      :class="{'active':hitem.checked}"
                      @click="setTime('hour', hitem, hours)"
                    >
                      {{ hitem.value }}
                    </li>
                  </ul>
                </div>
                <div class="min-box">
                  <div class="mui-pciker-rule mui-pciker-rule-ft" />
                  <div
                    v-for="mitem in mins"
                    class="min-item"
                    :class="{'active':mitem.checked}"
                    @click="setTime('min',mitem, mins)"
                  >
                    {{ mitem.value }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </actionsheet>
</template>
<script>
import actionsheet from 'actionsheet';

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// 基础配制
let opts = {
  type: 'day',
  SundayFirst: false,
  week: ['一', '二', '三', '四', '五', '六', '七'],
  month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  format: 'YYYY-MM-DD',
  limit: [{
    type: 'fromto',
    from: '2017-05-12',
    to: '2017-05-14'
  }]
};

export default {
  components: {
    actionsheet
  },
  props: {
    value: {
      default: false
    },
    title: {
      default: '选择退出日期'
    },
    iconType: {
      type: String,
      default: 'close'
    },
    closeClearTime: {
      type: Boolean,
      default: false
    },
    date: {
      type: Object,
      default: function() {
        return {
          time: ''
        };
      }
    },
    option: {
      type: Object,
      default: function() {
        return {};
      }
    },
    // 选择区域值
    limit: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 选择list里的值
    list: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data: function data() {
    function hours() {
      var list = [];
      var hour = 24;
      while (hour > 0) {
        hour--;
        list.push({
          checked: false,
          value: hour < 10 ? '0' + hour : hour
        });
      }
      return list;
    }

    function mins() {
      var list = [];
      var min = 60;
      while (min > 0) {
        min--;
        list.push({
          checked: false,
          value: min < 10 ? '0' + min : min
        });
      }
      return list;
    }

    return {
      isShowPop: this.value,
      opts: {},
      hours: hours(),
      mins: mins(),
      showInfo: {
        hour: false,
        day: false,
        month: false,
        year: false,
        check: false
      },
      displayInfo: {
        month: ''
      },
      library: {},
      checked: {
        oldtime: '',
        currentMoment: null,
        year: '',
        month: '',
        day: '',
        hour: '00',
        min: '00'
      },
      dayList: [],
      selectedDays: []
    };
  },
  watch: {
    value: function(v) {
      this.isShowPop = v;
      if (v) {
        this.showCheck();
      }
    },
    isShowPop: function(v) {
      if (!v) {
        if (this.closeClearTime) {
          this.date.time = '';
        }
        // 顺序不能变
        this.$emit('input', false);
        this.$emit('close');
      }
    }
  },
  created: function() {
    this.opts = Object.assign({}, opts, this.option);
    this.library = {
      week: this.opts.week,
      month: this.opts.month,
      year: []
    };
  },
  methods: {
    pad: function pad(n) {
      n = Math.floor(n);
      return n < 10 ? '0' + n : n;
    },
    nextMonth: function nextMonth(type) {
      var next = null;
      type === 'next' ? next = (0, _moment2.default)(this.checked.currentMoment).add(1, 'M') : next = (0, _moment2.default)(this.checked.currentMoment).add(-1, 'M');
      this.showDay(next);
    },
    showDay: function showDay(time) {
      if (time === undefined || !Date.parse(time)) {
        this.checked.currentMoment = (0, _moment2.default)();
      } else {
        this.checked.currentMoment = (0, _moment2.default)(time, this.opts.format);
      }
      this.showOne('day');
      this.checked.year = (0, _moment2.default)(this.checked.currentMoment).format('YYYY');
      this.checked.month = (0, _moment2.default)(this.checked.currentMoment).format('MM');
      this.checked.day = (0, _moment2.default)(this.checked.currentMoment).format('DD');
      this.displayInfo.month = this.library.month[(0, _moment2.default)(this.checked.currentMoment).month()];
      var days = [];
      var currentMoment = this.checked.currentMoment;
      var firstDay = (0, _moment2.default)(currentMoment).date(1).day();
      // gettting previous and next month
      // let currentMonth = moment(currentMoment)
      var previousMonth = (0, _moment2.default)(currentMoment);
      var nextMonth = (0, _moment2.default)(currentMoment);
      nextMonth.add(1, 'months');
      previousMonth.subtract(1, 'months');
      var monthDays = (0, _moment2.default)(currentMoment).daysInMonth();
      var oldtime = this.checked.oldtime;
      for (var i = 1; i <= monthDays; ++i) {
        days.push({
          value: i,
          inMonth: true,
          unavailable: false,
          checked: false,
          moment: (0, _moment2.default)(currentMoment).date(i)
        });
        if (i === Math.ceil((0, _moment2.default)(currentMoment).format('D')) && (0, _moment2.default)(oldtime, this.opts.format).year() === (0, _moment2.default)(currentMoment).year() && (0, _moment2.default)(oldtime, this.opts.format).month() === (0, _moment2.default)(currentMoment).month()) {
          days[i - 1].checked = true;
        }
        this.checkBySelectDays(i, days);
      }
      if (firstDay === 0) firstDay = 7;
      for (var _i = 0; _i < firstDay - (this.opts.SundayFirst ? 0 : 1); _i++) {
        var passiveDay = {
          value: previousMonth.daysInMonth() - _i,
          inMonth: false,
          action: 'previous',
          unavailable: false,
          checked: false,
          moment: (0, _moment2.default)(currentMoment).date(1).subtract(_i + 1, 'days')
        };
        days.unshift(passiveDay);
      }
      var passiveDaysAtFinal = 42 - days.length;
      for (var _i2 = 1; _i2 <= passiveDaysAtFinal; _i2++) {
        var _passiveDay = {
          value: _i2,
          inMonth: false,
          action: 'next',
          unavailable: false,
          checked: false,
          moment: (0, _moment2.default)(currentMoment).add(1, 'months').date(_i2)
        };
        days.push(_passiveDay);
      }
      // 自己添加
      if (this.list.length) {
        var self = this,
          listItem;
        days.forEach(function(item) {
          var month = self.checked.month,
            year = self.checked.year;
          if (item.action == 'previous') {
            month--;
            if (!month) {
              year--;
              month = 12;
            }
          }
          if (item.action == 'next') {
            month++;
            if (month > 12) {
              year++;
              month = 1;
            }
          }
          listItem = (0, _moment2.default)(year + '-' + self.pad(month) + '-' + self.pad(item.value));
          listItem = listItem._i.replace(/-/g, '');
          listItem = self.list.indexOf(listItem);
          item.unavailable = listItem == -1;
        });
      }
      if (this.limit.length > 0) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError;// = undefined
        // 如果是第二次筛选，要用特殊处理
        var isNoFirst = false;

        try {
          for (var _iterator = this.limit[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var li = _step.value;

            switch (li.type) {
              case 'fromto':
                days = this.limitFromTo(li, days, isNoFirst);
                break;
              case 'weekday':
                days = this.limitWeekDay(li, days);
                break;
            }
            isNoFirst = true;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              // throw _iteratorError
            }
          }
        }
      }
      this.dayList = days;
    },
    checkBySelectDays: function checkBySelectDays(d, days) {
      var _this = this;

      this.selectedDays.forEach(function(day) {
        if (_this.checked.year === (0, _moment2.default)(day).format('YYYY') && _this.checked.month === (0, _moment2.default)(day).format('MM') && d === Math.ceil((0, _moment2.default)(day).format('D'))) {
          days[d - 1].checked = true;
        }
      });
    },
    limitWeekDay: function limitWeekDay(limit, days) {
      days.map(function(day) {
        if (limit.available.indexOf(Math.floor(day.moment.format('d'))) === -1) {
          day.unavailable = true;
        }
      });
      return days;
    },
    limitFromTo: function limitFromTo(limit, days, isNoFirst) {
      var _this2 = this;

      if (limit.from || limit.to) {
        days.map(function(day) {
          // 不满足条件
          var isDissatisfy = _this2.getLimitCondition(limit, day);
          // 第一次筛选
          if (!isNoFirst && isDissatisfy) {
            day.unavailable = true;
            return;
          }
          if (isNoFirst && !isDissatisfy && day.unavailable) {
            day.unavailable = false;
          }
        });
      }
      return days;
    },
    getLimitCondition: function getLimitCondition(limit, day) {
      var tmpMoment = (0, _moment2.default)(this.checked.year + '-' + this.pad(this.checked.month) + '-' + this.pad(day.value));
      if (limit.from && !limit.to) {
        return !tmpMoment.isAfter(limit.from);
      } else if (!limit.from && limit.to) {
        return !tmpMoment.isBefore(limit.to);
      } else {
        return !tmpMoment.isBetween(limit.from, limit.to);
      }
    },
    checkDay: function checkDay(obj) {
      if (obj.unavailable || obj.value === '') {
        return false;
      }
      if (!obj.inMonth) {
        this.nextMonth(obj.action);
      }
      if (this.opts.type === 'day' || this.opts.type === 'min') {
        this.dayList.forEach(function(x) {
          x.checked = false;
        });
        this.checked.day = this.pad(obj.value);
        obj.checked = true;
      } else {
        var day = this.pad(obj.value);
        var ctime = this.checked.year + '-' + this.checked.month + '-' + day;
        if (obj.checked === true) {
          obj.checked = false;
          this.selectedDays.$remove(ctime);
        } else {
          this.selectedDays.push(ctime);
          obj.checked = true;
        }
      }
      switch (this.opts.type) {
        case 'day':
          this.picked();
          break;
        case 'min':
          this.showOne('hour');
          // shift activated time items to visible position.
          this.shiftActTime();
          break;
      }
    },
    showYear: function showYear() {
      var _this3 = this;

      var year = (0, _moment2.default)(this.checked.currentMoment).year();
      this.library.year = [];
      var yearTmp = [];
      for (var i = year - 100; i < year + 5; ++i) {
        yearTmp.push(i);
      }
      this.library.year = yearTmp;
      this.showOne('year');
      this.$nextTick(function() {
        var listDom = document.getElementById('yearList');
        listDom.scrollTop = listDom.scrollHeight - 100;
        _this3.addYear();
      });
    },
    showOne: function showOne(type) {
      switch (type) {
        case 'year':
          this.showInfo.hour = false;
          this.showInfo.day = false;
          this.showInfo.year = true;
          this.showInfo.month = false;
          break;
        case 'month':
          this.showInfo.hour = false;
          this.showInfo.day = false;
          this.showInfo.year = false;
          this.showInfo.month = true;
          break;
        case 'day':
          this.showInfo.hour = false;
          this.showInfo.day = true;
          this.showInfo.year = false;
          this.showInfo.month = false;
          break;
        case 'hour':
          this.showInfo.hour = true;
          this.showInfo.day = false;
          this.showInfo.year = false;
          this.showInfo.month = false;
          break;
        default:
          this.showInfo.day = true;
          this.showInfo.year = false;
          this.showInfo.month = false;
          this.showInfo.hour = false;
      }
    },
    showMonth: function showMonth() {
      this.showOne('month');
    },
    addYear: function addYear() {
      var _this4 = this;

      var listDom = document.getElementById('yearList');
      listDom.addEventListener('scroll', function(e) {
        if (listDom.scrollTop < listDom.scrollHeight - 100) {
          var len = _this4.library.year.length;
          var lastYear = _this4.library.year[len - 1];
          _this4.library.year.push(lastYear + 1);
        }
      }, false);
    },
    setYear: function setYear(year) {
      this.checked.currentMoment = (0, _moment2.default)(year + '-' + this.checked.month + '-' + this.checked.day);
      this.showDay(this.checked.currentMoment);
    },
    setMonth: function setMonth(month) {
      var mo = this.library.month.indexOf(month) + 1;
      if (mo < 10) {
        mo = '0' + '' + mo;
      }
      this.checked.currentMoment = (0, _moment2.default)(this.checked.year + '-' + mo + '-' + this.checked.day);
      this.showDay(this.checked.currentMoment);
    },
    showCheck: function showCheck() {
      if (this.date.time === '') {
        this.showDay();
      } else {
        if (this.opts.type === 'day' || this.opts.type === 'min') {
          this.checked.oldtime = this.date.time;
          this.showDay(this.date.time);
        } else {
          this.selectedDays = JSON.parse(this.date.time);
          if (this.selectedDays.length) {
            this.checked.oldtime = this.selectedDays[0];
            this.showDay(this.selectedDays[0]);
          } else {
            this.showDay();
          }
        }
      }
      this.showInfo.check = true;
    },
    setTime: function setTime(type, obj, list) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2;// = undefined

      try {
        for (var _iterator2 = list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var item = _step2.value;

          item.checked = false;
          if (item.value === obj.value) {
            item.checked = true;
            this.checked[type] = item.value;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            // throw _iteratorError2
          }
        }
      }
    },
    picked: function picked() {
      var oldTime = this.date.time;
      if (this.opts.type === 'day' || this.opts.type === 'min') {
        var ctime = this.checked.year + '-' + this.checked.month + '-' + this.checked.day + ' ' + this.checked.hour + ':' + this.checked.min;
        this.checked.currentMoment = (0, _moment2.default)(ctime, 'YYYY-MM-DD HH:mm');
        this.date.time = (0, _moment2.default)(this.checked.currentMoment).format(this.opts.format);
      } else {
        this.date.time = JSON.stringify(this.selectedDays);
      }
      if (oldTime !== this.date.time) {
        this.$emit('change', this.date.time);
        this.$emit('input', false);
      }
    },
    shiftActTime: function shiftActTime() {
      // shift activated time items to visible position.
      this.$nextTick(function() {
        if (!document.querySelector('.hour-item.active')) {
          return false;
        }
        document.querySelector('.hour-box').scrollTop = (document.querySelector('.hour-item.active').offsetTop || 0) - 250;
        document.querySelector('.min-box').scrollTop = (document.querySelector('.min-item.active').offsetTop || 0) - 250;
      });
    }
  }
};
</script>
