const addTime = (time01, time02) => {
  let time1 = convertToNumber(time01);
  let time2 = convertToNumber(time02);
    const { hours: time1Hours, minutes: time1Minutes } = time1;
    const { hours: time2Hours, minutes: time2Minutes } = time2;
    const totalMinutes = time1Hours * 60 + time1Minutes + time2Hours * 60 + time2Minutes;
    const totalHours = Math.floor(totalMinutes / 60);
    const endHours = totalHours % 24;
    const endMinutes = totalMinutes % 60;
    const totaltime = {
      hours: endHours,
      minutes: endMinutes
    };
    return totaltime;
  };
  
const subtractTime = (time01, time02) => {
  let time1 = convertToNumber(time01);
  let time2 = convertToNumber(time02);
  const { hours: time1Hours, minutes: time1Minutes } = time1;
  const { hours: time2Hours, minutes: time2Minutes } = time2;
  const totalMinutes = (time1Hours * 60 + time1Minutes) - (time2Hours * 60 + time2Minutes);
  const endHours = (totalMinutes >= 0 ? Math.floor(totalMinutes / 60) : 0) % 24;
  const endMinutes = (totalMinutes >= 0 ? totalMinutes % 60 : 0);
  const totaltime = {
    hours: endHours,
    minutes: endMinutes
  };
  return totaltime;
};

const calculateTotalTime = (timeCollection) => {
    let totalHours = 0;
    let totalMinutes = 0;
    for (let i = 0; i < timeCollection.length; i++) {
      const { hours, minutes } = timeCollection[i];
      totalHours += hours;
      totalMinutes += minutes;
      if (totalMinutes >= 60) {
        totalHours += Math.floor(totalMinutes / 60);
        totalMinutes %= 60;
      }
    }
    return { hours: totalHours, minutes: totalMinutes };
};

const isTimeBetween = (timeToCheck, startTime, endTime) => {
  const convertedTimeToCheck = convertToNumber(timeToCheck);
  const convertedStartTime = convertToNumber(startTime);
  const convertedEndTime = convertToNumber(endTime);
  const timeToCheckInMinutes = convertedTimeToCheck.hours * 60 + convertedTimeToCheck.minutes;
  const startTimeInMinutes = convertedStartTime.hours * 60 + convertedStartTime.minutes;
  const endTimeInMinutes = convertedEndTime.hours * 60 + convertedEndTime.minutes;
  return timeToCheckInMinutes >= startTimeInMinutes && timeToCheckInMinutes <= endTimeInMinutes;
};

const convertToNumber = (time) => {
  return {
    hours: parseInt(time.hours, 10),
    minutes: parseInt(time.minutes, 10)
  };
};

const compareTimes = (time1, time2) => {
  if (time1.hours < time2.hours) return -1;
  if (time1.hours > time2.hours) return 1;

  if (time1.minutes < time2.minutes) return -1;
  if (time1.minutes > time2.minutes) return 1;

  return 0;
};

const formatTime = (time) => {
  return `${time.hours}:${time.minutes < 10 ? '0' : ''}${time.minutes}`;
};


module.exports = {addTime,subtractTime,calculateTotalTime,isTimeBetween,convertToNumber,compareTimes,formatTime};