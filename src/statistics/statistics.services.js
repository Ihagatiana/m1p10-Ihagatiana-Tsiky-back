const appServices = require("./../appservices/appservices.model");
const Appointment = require("./../appointments/appointments.model");
const Payments = require("./../payments/payments.model");
const moment = require("moment");

const getAvgHoursPerEmp = async () => {
  const appServ = await appServices.find().populate("employes");
  const employeTotalTime = {};

  // Parcours des appservices pour calculer le temps de travail de chaque employé
  appServ.forEach((appservice) => {
    const startTime = moment(
      appservice.starttime.hours * 60 + appservice.starttime.minutes,
      "HH:mm"
    );
    const endTime = moment(
      appservice.endtime.hours * 60 + appservice.endtime.minutes,
      "HH:mm"
    );
    const duration = moment.duration(endTime.diff(startTime));

    const employeName = `${appservice.employes?.firstname ?? "N/A"} ${
      appservice.employes?.name ?? "N/A"
    }`;

    // Si c'est la première fois qu'on voit cet employé, initialiser le temps de travail à 0
    if (!employeTotalTime[employeName]) {
      employeTotalTime[employeName] = moment.duration(0);
    }

    // Ajouter la durée de cet appservice au temps de travail total de l'employé
    employeTotalTime[employeName].add(duration);
  });

  // Calcul du temps moyen de travail pour chaque employé
  const employeAverageTime = [];
  Object.keys(employeTotalTime).forEach((employeName) => {
    const totalDuration = employeTotalTime[employeName];
    const numberOfAppServices = appServ.filter(
      (appservice) =>
        `${appservice.employes?.firstname ?? "N/A"} ${
          appservice.employes?.name ?? "N/A"
        }` === employeName
    ).length;
    const averageDuration =
      numberOfAppServices > 0
        ? totalDuration.asMinutes() / numberOfAppServices
        : 0;

    // Conversion du temps moyen en objet { hours: string, minutes: string }
    const averageHours = Math.floor(averageDuration / 60)
      .toString()
      .padStart(2, "0");
    const averageMinutes = (averageDuration % 60).toFixed(0).padStart(2, "0");

    employeAverageTime.push({
      name: employeName,
      avgTime: { hours: averageHours, minutes: averageMinutes },
    });
  });

  return employeAverageTime;
};
const generateDatesForYear = (year) => {
  const dates = [];
  for (let month = 1; month <= 12; month++) {
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    dates.push(`${year}-${formattedMonth}`);
  }
  return dates;
};

const getCaPerMonth = async () => {
  const dates = generateDatesForYear(2024);

  const caPerMonth = [];
  for (const date of dates) {
    const [year, month] = date.split("-");
    const startOfMonth = new Date(year, parseInt(month) - 1, 1);
    const endOfMonth = new Date(year, parseInt(month), 0, 23, 59, 59, 999);

    const payments = await Payments.find({
      date: { $gte: startOfMonth, $lt: endOfMonth },
    });

    const ca = payments.reduce((acc, obj) => acc + obj.amount, 0);

    caPerMonth.push({ date, ca });
  }

  return caPerMonth;
};

const getBenefitsPerMonth = async ({ salary, rent, purchases, expenses }) => {
  const dates = generateDatesForYear(2024);

  const caPerMonth = [];
  for (const date of dates) {
    const [year, month] = date.split("-");
    const startOfMonth = new Date(year, parseInt(month) - 1, 1);
    const endOfMonth = new Date(year, parseInt(month), 0, 23, 59, 59, 999);

    const payments = await Payments.find({
      date: { $gte: startOfMonth, $lt: endOfMonth },
    });

    const expensesSum = salary + rent + purchases + expenses;
    const ca = payments.reduce((acc, obj) => acc + obj.amount, 0) - expensesSum;
    caPerMonth.push({ date, ca: Math.max(0, ca) });
  }
  return caPerMonth;
};
const getAppointementByDate = async () => {
  const year = 2024;

  const dates = generateDatesForYear(year);

  const appServicesByMonth = [];

  for (const date of dates) {
    const [year, month] = date.split("-");
    const startOfMonth = new Date(year, parseInt(month) - 1, 1);
    const endOfMonth = new Date(year, parseInt(month), 0, 23, 59, 59, 999);

    const servicesCount = await appServices.countDocuments({
      appointments: {
        $in: await Appointment.find({
          date: { $gte: startOfMonth, $lt: endOfMonth },
        }).distinct("_id"),
      },
    });

    appServicesByMonth.push({ date, numberOfServices: servicesCount });
  }

  return appServicesByMonth;
};

const getEmployeStatistical = async () => {
  return await appServices.aggregate([
    {
      $lookup: {
        from: "appointments",
        localField: "appointments",
        foreignField: "_id",
        as: "appointmentDetails",
      },
    },
    {
      $unwind: "$appointmentDetails",
    },
    {
      $lookup: {
        from: "employes", // Collection à partir de laquelle on récupère les détails des employés
        localField: "employes",
        foreignField: "_id",
        as: "employeDetails", // Alias pour stocker les détails des employés
      },
    },
    {
      $unwind: "$employeDetails",
    },
    {
      $group: {
        _id: "$employeDetails.name", // Utilisation du nom de l'employé pour le groupement
        count: { $sum: 1 }, // Compte le nombre de rendez-vous pour chaque employé
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
};

module.exports = {
  getEmployeStatistical,
  getAppointementByDate,
  getAvgHoursPerEmp,
  getCaPerMonth,
  getBenefitsPerMonth,
};
