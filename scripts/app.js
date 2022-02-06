const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "# of Votes",
        data: [2000, 0],
        backgroundColor: [
          // "rgba(255, 206, 86, 0.0)",
          "#ba66f9",
          // "rgba(255, 206, 86, 0.0)",
          "#03a9f4",
        ],
        borderColor: [
          // "rgba(255, 206, 86, 0)",
          "#ba66f9",
          // "rgba(255, 206, 86, 0)",
          "#03a9f4",
        ],
        borderWidth: 1,
        spacing: 5,
        cutout: "80%",
        borderRadius: 30,
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        display: false,
      },
    },
  },
});
