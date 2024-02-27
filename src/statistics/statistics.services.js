const appServices = require("./../appservices/appservices.model");

const getAppointementByDate = async () => {
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
      $addFields: {
        appointmentDate: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$appointmentDetails.date",
          },
        },
      },
    },
    {
      $group: {
        _id: "$appointmentDate",
        count: { $sum: 1 }, // Compte le nombre d'éléments pour chaque date de rendez-vous
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
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
