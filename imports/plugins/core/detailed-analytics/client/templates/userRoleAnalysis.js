import uv from "uvCharts";

const getPieChart = (data) => {
  const graphDef = {
    categories: ["userRoles"],
    dataset: {
      userRoles: data
    }
  };

  uv.chart("Pie", graphDef, {
    graph: {
      orientation: "Vertical",
      custompalette: ["#A1A4A5", "#C80F98", "#5F0DCF"]
    },
    meta: {
      position: "#userRole",
      caption: "User Distribution (%)",
      subcaption: "across this ecommerce site. (buyers, vendors, admin)"
    },
    caption: {
      fontsize: 20
    },
    subcaption: {
      fontsize: 50
    },
    legend: {
      position: "right",
      legendstart: 0,
      fontfamily: "Arial",
      fontsize: "11",
      fontweight: "normal",
      legendtype: "dataset",
      symbolsize: 10,
      showlegends: true
    },
    dimension: {
      width: "500",
      height: "500"
    }
  });
};

Template.userRoleAnalysis.onRendered(() => {
  Meteor.call("analytics/getUserRoles", (error, result) => {
    getPieChart(result);
  });
});
