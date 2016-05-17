angular.module('MyApp', [])
.controller('MyController', function($timeout) {
  var vm = this;

  vm.format = {
    value: '--',
    delim: ':',
    string: '--:--',
    zero: '00:00'
  };

  vm.myKeyPress = function(event) {
    var is24HourPattern = /^([01]?[0-9]|2[0-3])(:[0-5][0-9])?$/;
    var val = event.target.value + event.key;
    if(!is24HourPattern.test(val)) event.preventDefault();
  };

  vm.highlight = function(event) {
    var start = event.target.selectionStart;
    if(start < 3 || start >= 5) event.target.setSelectionRange(0,2);
    else event.target.setSelectionRange(3,5);
  };

  vm.clearTime = function(model) {
    vm[model] = vm.format.string;
  };

  function int2String(timeInt, format) {
    var hourString = '' + timeInt.hour;
    var minuteString = '' + timeInt.minute;

    if(hourString.length === 1) hourString = '0' + hourString;
    if(minuteString.length === 1) minuteString = '0' + minuteString;

    return hourString + format.delim + minuteString;
  }

  function string2Int(timeString, format) {
    var hour = timeString.hourString === format.value? 0: parseInt(timeString.hourString);
    var minute = timeString.minuteString === format.value? 0: parseInt(timeString.minuteString);
    return { hour: hour, minute: minute };
  }

  vm.changeTime = function(modelString, changeInt) {

    /* INPUT */

    var elem = document.getElementById(modelString);

    var timeString = {
      hourString: vm[modelString].substring(0, 2),
      minuteString: vm[modelString].substring(3, 5)
    };

    var start = elem.selectionStart;
    var end = elem.selectionEnd;

    if (start < 3 || start > 4) {
      start = 0;
      end = 2;
    } else {
      start = 3;
      end = 5;
    }

    /* PROCESSING */

    var timeInt;

    if (timeString.hourString === vm.format.value) {
      timeInt = { hour: 0, minute: 0 };
    } else {
      timeInt = string2Int(timeString, vm.format);
      if(start === 0) {
        timeInt.hour = (timeInt.hour + changeInt)%24;
        if(timeInt.hour === -1) timeInt.hour += 24;
      } else {
        timeInt.minute = (timeInt.minute + changeInt)%60;
        if(timeInt.minute === -1) timeInt.minute += 60;
      }
    }

    /* OUTPUT */

    vm[modelString] = int2String(timeInt, vm.format);

    console.log(start, end);

    $timeout(function() {
      elem.setSelectionRange(start, end);
    });
  };

  vm.hourFrom = vm.format.string;
});
