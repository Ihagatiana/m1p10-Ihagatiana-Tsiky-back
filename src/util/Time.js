const addTime = (time1, time2) => {
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
  
const subtractTime = (time1, time2) => {
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

module.exports = {addTime,subtractTime,calculateTotalTime};