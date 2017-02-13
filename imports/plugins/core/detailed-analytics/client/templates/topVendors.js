import uv from "uvCharts";

const getBarChart = (data) => {
  const graphDef = {
    categories: ["topVendors"],
    dataset: {
      topVendors: data
    }
  };

  uv.chart("Bar", graphDef, {
    graph: {
      orientation: "Vertical",
      custompalette: ["#A1A4A5", "#C80F98", "#5F0DCF"]
    },
    meta: {
      position: "#vendors",
      caption: "Most Patronised Vendors",
      subcaption: "for this ecommerce site"
    },
    caption: {
      fontsize: 20
    },
    subcaption: {
      fontsize: 50
    },
    dimension: {
      width: "500",
      height: "500"
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
    axis: {
      subticks: 0,
      ticks: 3
    },
    margin: {
      top: 100
    }
  });
};

Template.topVendors.onRendered(() => {
  Meteor.call("analytics/getTopVendors", (error, result) => {
    getBarChart(result);
  });
});
