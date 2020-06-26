$(() => {
  $.get("https://ztassistant.herokuapp.com/stats/global/data", (data) => {
    console.log(data);
    data.forEach((dt, index) => {
      $(".statsHolder").append(
        $(
          `<div style='margin:10px'><p style="text-align:center">${dt.question.title}</p><canvas class='mn_chartStat${index}' width='200px' height='200px'></canvas></div>`
        )
      );
      new Chart($(".mn_chartStat" + index), {
        type: "pie",
        data: {
          labels: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"],
          datasets: [
            {
              label: "#Produits",
              data: [
                dt.subViews[0],
                dt.subViews[1],
                dt.subViews[2],
                dt.subViews[3],
                dt.subViews[4],
                dt.subViews[5],
              ],
              backgroundColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(162, 105, 219,1)",
                "rgba(41, 255, 84,1)",
              ],
            },
          ],
        },
        options: {
          legend: {
            position: "bottom",
          },
        },
      });
    });
    //MainGlobalStats
    $(".global-statsHolder").append(
      $(
        `<div style='margin:10px'><canvas class='gmn_chartStat' width='600px' height='300px'></canvas></div>`
      )
    );
    let resr = data.map((dt) => dt.views);
    let resnt = data.map((dt) => dt.question.title);
    new Chart($(".gmn_chartStat"), {
      type: "bar",
      data: {
        labels: resnt,
        datasets: [
          {
            label: "Produits",
            data: resr,
            backgroundColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
            ],
          },
        ],
      },
      options: {
        legend: {
          position: "bottom",
        },
        scales: { yAxes: [{ ticks: { beginAtZero: true, max: 100 } }] },
      },
    });
  });
});
