const appServices = require("./../appservices/appservices.model");
const Appointment = require("./../appointments/appointments.model");
const generateDatesForYear = (year) => {
  const dates = [];
  for (let month = 1; month <= 12; month++) {
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    dates.push(`${year}-${formattedMonth}`);
  }
  return dates;
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
        from: "employes", // Collection à partir de laquelle vous souhaitez récupérer les détails des employés
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

// const getHoursWorkedByEmploye = async () => {
//   return await appServices.aggregate([
//     {
//       $lookup: {
//         from: "appointments",
//         localField: "appointments",
//         foreignField: "_id",
//         as: "appointmentDetails"
//       }
//     },
//     {
//       $unwind: "$appointmentDetails"
//     },
//     {
//       $lookup: {
//         from: "employes",
//         localField: "employes",
//         foreignField: "_id",
//         as: "employeeDetails"
//       }
//     },
//     {
//       $unwind: "$employeeDetails"
//     },
//     {
//       $addFields: {
//         "totalMinutes": {
//           $subtract: [
//             {
//               $add: [
//                 { $multiply: ["$starttime.hours", 60] }, // Convertit les heures en minutes
//                 "$starttime.minutes"
//               ]
//             },
//             {
//               $add: [
//                 { $multiply: ["$endtime.hours", 60] }, // Convertit les heures en minutes
//                 "$endtime.minutes"
//               ]
//             }
//           ]
//         }
//       }
//     },
//     {
//       $group: {
//         _id: {
//           appointmentDate: { $dateToString: { format: "%Y-%m-%d", date: "$appointmentDetails.date" } }, // Regrouper par date
//           employeeId: "$employeeDetails._id" // Regrouper par identifiant de l'employé
//         },
//         totalWorkMinutes: { $sum: "$totalMinutes" } // Somme des minutes travaillées pour chaque employé par date
//       }
//     },
//     {
//       $addFields: {
//         totalWorkHours: { $divide: ["$totalWorkMinutes", 60] } // Convertit les minutes en heures
//       }
//     },
//     {
//       $group: {
//         _id: { appointmentDate: "$_id.appointmentDate" }, // Regrouper par date uniquement
//         employees: {
//           $push: {
//             employeeId: "$_id.employeeId",
//             totalWorkHours: "$totalWorkHours"
//           }
//         }
//       }
//     },
//     {
//       $lookup: {
//         from: "employes",
//         localField: "employees.employeeId",
//         foreignField: "_id",
//         as: "employeeInfo"
//       }
//     },
//     {
//       $unwind: "$employeeInfo"
//     },
//     {
//       $project: {
//         _id: "$_id.appointmentDate",
//         employees: {
//           firstName: "$employeeInfo.firstName",
//           lastName: "$employeeInfo.lastName",
//           totalWorkHours: 1
//         }
//       }
//     },
//     {
//       $sort: { "_id": 1 } // Trier par date croissante
//     }
//   ]);
// };

module.exports = {
  getEmployeStatistical,
  getAppointementByDate,
  //   getHoursWorkedByEmploye,
};
